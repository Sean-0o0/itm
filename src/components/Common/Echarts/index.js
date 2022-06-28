import React from 'react';
import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/pie';
import ReactEchartsCore from 'echarts-for-react/lib/core';

function EchartsHelper(props) {
  // -------------------------------图形基本option分割线------------------------------------------
  // 线柱组合图option
  const LINE_AND_BAR = {
    title: {
      trigger: 'axis',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {},
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: null,
        nameTextStyle: {
          fontSize: 14,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        boundaryGap: [0, 0.1],
        nameTextStyle: {
          fontSize: 14,
        },
      },
    ],
    calculable: false, // 禁止拖拽功能
    // dataZoom: {
    //   show: true,
    //   realtime: false,
    //   start: 88,
    //   end: 100,
    // },
  };
  // 饼状图option
  const PIE = {
    title: {
      text: '',
      subtext: null,
      x: 'center',
      y: 'top',
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: [],
    },
    calculable: false, // 禁止拖拽功能
    series: [
      {
        name: '',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: [],
      },
    ],
  };
  // 横向柱状图option
  const YAXIS_BAR = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: [],
    },
    calculable: false, // 禁止拖拽功能
    xAxis: [
      {
        type: 'value',
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: [],
      },
    ],
    series: [],
  };
  // -------------------------------datas数据封装分割线------------------------------------------
  /**
   * 将数据组合成折线或者柱状图
   * @param datas              callProcedure无分页调用的结果集中的0_RESULT
   * @param option           自定义覆盖型的ECHARTS参数，API请参考ECHARTS官网
   * @param arrSeries        数据库与图表的映射对象 {NAME:[A,B,C]，COLUMN:['COL1','COL2','COL3']} 表示图表的线段A将使用O_RESULT中COL1的数据
   * @param xAxisColumn      横轴对应的数据库列
   * @param type             图表类型 | line(默认) 折线图; bar 柱状图
   * @param multiY           是否开启多Y轴
   * @returns {*}
   */
  const generateLineOrBarData = (datas, option, arrSeries, xAxisColumn, type, multiY) => {
    const opt = option;
    const data = [];
    const x = [];
    const yAxis = [];
    const insArray = datas;
    const xlength = insArray.length;
    let xCol = xAxisColumn || 'SJ';
    if (typeof (xAxisColumn) === 'number') {
      xCol = xAxisColumn;
    }
    for (let index = 0; index < xlength; index += 1) {
      const d = insArray[index];
      const xItem = d[xCol];
      x.push(xItem);
      for (let i = 0, l = arrSeries.COLUMN.length; i < l; i += 1) {
        if (!data[i]) {
          data[i] = [];
        }
        const col = arrSeries.COLUMN[i];
        const item = d[col];
        data[i].push(item);
      }
    }
    const series = [];
    for (let j = 0, len = arrSeries.COLUMN.length; j < len; j += 1) {
      // 曲线的平滑效果IE8及其以下强制为直线
      const ser = { name: arrSeries.NAME[j], type: type || 'line', data: data[j], smooth: true };
      series.push(ser);
      if (multiY) {
        const yItem = {
          type: 'value',
          name: arrSeries.NAME[j],
          nameTextStyle: {
            fontSize: 14,
          },
        };
        yAxis.push(yItem);
        ser.yAxisIndex = j;
      }
    }
    opt.xAxis[0].data = x;
    if (multiY) {
      opt.yAxis = yAxis;
    }
    opt.legend.data = arrSeries.NAME;
    opt.series = series;
    return option;
  };

  /**
     * 将数据组合成折线图数据
     * @param datas            callProcedure无分页调用的结果集中的0_RESULT
     *                         [{"RQ":"20151023","SL":"3","QDMC":"渠道1"},{"RQ":"20151023","SL":"1","QDMC":"渠道2"},
     *                          {"RQ":"20151024","SL":"0","QDMC":"渠道1"},{"RQ":"20151024","SL":"2","QDMC":"渠道2"}]
     *                         注意： xAisColumn对应值相同的数据需要相邻,如RQ为20151023的两条数据是相邻的。
     * @param option           自定义覆盖型的ECHARTS参数，API请参考ECHARTS官网
     * @param valueColumn      数据值对应的列名
     * @param legendColumn     legend对应的列名
     * @param xAxisColumn      横轴对应的数据库列
     * @param type             生成图形的类型 line
     * @returns {*}
     */
  const generateLineData = (datas, option, valueColumn, legendColumn, xAxisColumn, type) => {
    const opt = option;
    const x = [];
    const legend = [];
    const seriesList = [];
    const xlength = datas.length;
    for (let index = 0; index < xlength; index += 1) {
      const rowData = datas[index];
      const xItem = rowData[xAxisColumn];
      const legendItem = rowData[legendColumn];
      let legendIndex = legend.indexOf(legendItem);
      if (legendIndex === -1) {
        legend.push(legendItem);
        seriesList.push({
          name: legendItem,
          type,
          data: [],
        });
        legendIndex = legend.length - 1;
      }
      if (!x.includes(xItem)) {
        x.push(xItem);
      }
      seriesList[legendIndex].data.push(rowData[valueColumn]);
    }
    opt.xAxis[0].data = x;
    opt.legend.data = legend;
    opt.series = seriesList;
    return opt;
  };

  /**
   * 将数据组合成饼图数据
   * @param datas              callProcedure无分页调用的结果集中的0_RESULT
   * @param option           自定义覆盖型的ECHARTS参数，API请参考ECHARTS官网
   * @param valueColumn      数据库里面的取值列
   * @param titleColumn      数据库里面的文本名称列
   * @param chartName        图表总名称
   */
  const generatePieData = (datas, option, valueColumn, titleColumn, chartName) => {
    const opt = option;
    const legend = [];
    const data = [];
    const insArray = datas;
    const xlength = insArray.length;
    for (let index = 0; index < xlength; index += 1) {
      const value = insArray[index][valueColumn];
      const name = insArray[index][titleColumn];
      const dataIns = {};
      dataIns.value = value;
      dataIns.name = name;
      legend.push(name);
      data.push(dataIns);
    }
    opt.legend.data = legend;
    opt.series[0].data = data;
    if (chartName) {
      opt.series[0].name = chartName;
      opt.title.text = chartName;
    }
    return opt;
  };

  /**
   * 将数据组合成横向柱状图
   * @param datas           callProcedure无分页调用的结果集中的0_RESULT
   * @param option        自定义覆盖型的ECHARTS参数，API请参考ECHARTS官网
   * @param colName       数据库返回数据的列名
   * @param ifStack       是否使用stack层叠显示
   * @returns {*}
   */
  const generateYaxisBarData = (datas, option, colName, ifStack) => {
    const opt = option;
    const legendArr = [];
    const yAxisArr = [];
    const seriesArr = [];
    const dataArr = [];
    for (let i = 0; i < datas.length; i += 1) {
      const d = datas[i];
      const legendD = d[colName[1]];
      const yAxisD = d[colName[0]];
      if (!legendArr.includes(legendD)) {
        legendArr.push(legendD);
      }
      if (!yAxisArr.includes(yAxisD)) {
        yAxisArr.push(yAxisD);
      }
    }
    for (let index = 0; index < datas.length; index += 1) {
      const d = datas[index];
      for (let m = 0; m < legendArr.length; m += 1) {
        if (!dataArr[m]) {
          dataArr[m] = [];
        }
        const col = legendArr[m];
        if (col === d[colName[1]]) {
          const item = d[colName[2]];
          dataArr[m].push(item);
        }
      }
    }
    for (let j = 0; j < legendArr.length; j += 1) {
      let ser = {};
      if (ifStack) {
        ser = { name: legendArr[j], type: 'bar', stack: '统计', itemStyle: { normal: { label: { show: true, position: 'insideRight' } } }, data: dataArr[j] };
      } else {
        ser = { name: legendArr[j], type: 'bar', data: dataArr[j] };
      }
      seriesArr.push(ser);
    }

    opt.legend.data = legendArr;
    opt.yAxis[0].data = yAxisArr; // yAxis为数组 必须指定第一个
    opt.series = seriesArr;
    return opt;
  };

  /**
   * 将数据组合成折线柱状混合图
   * @param datas              callProcedure无分页调用的结果集中的0_RESULT
   * @param option           自定义覆盖型的ECHARTS参数，API请参考ECHARTS官网
   * @param arrSeries        数据库与图表的映射对象 {NAME:[A,B,C]，COLUMN:['COL1','COL2','COL3']} 表示图表的线段A将使用O_RESULT中COL1的数据，TYPE: ['bar', 'line'] 表示echarts的直角系图类型名称
   * @param xAxisColumn      横轴对应的数据库列
   * @param multiY          是否根据dataMapping的NAME生成多Y
   * @returns {*}
   */
  const generateBarLineData = (datas, option, arrSeries, xAxisColumn, multiY) => {
    const opt = option;
    const data = [];
    const x = [];
    const insArray = datas;
    const xlength = insArray.length;
    const xCol = xAxisColumn || 'SJ';
    for (let index = 0; index < xlength; index += 1) {
      const d = insArray[index];
      const xItem = d[xCol];
      x.push(xItem);
      for (let i = 0, l = arrSeries.COLUMN.length; i < l; i += 1) {
        if (!data[i]) {
          data[i] = [];
        }
        const col = arrSeries.COLUMN[i];
        const item = d[col];
        data[i].push(item);
      }
    }

    const series = [];
    const yAxis = [];
    // 以下两个参数判断 y轴是否已经被占用
    // chartType存储图形类型 如果已存在图形类型则不需要再次创建y轴  使用已有Y轴
    // yAxisIsNotExist为true的时候创建新的Y轴
    const chartType = [];
    let yAxisIsNotExist = true;
    for (let j = 0, len = arrSeries.COLUMN.length; j < len; j++) {
      let ser = {};
      if (!chartType.includes(arrSeries.TYPE[j])) {
        if (j === 0) {
          ser = { name: arrSeries.NAME[j], type: arrSeries.TYPE[j] || 'line', data: data[j], smooth: true };
        } else {
          ser = { name: arrSeries.NAME[j], type: arrSeries.TYPE[j] || 'line', data: data[j], yAxisIndex: 1, smooth: true };
        }
        chartType.push(arrSeries.TYPE[j]);
        yAxisIsNotExist = true;
      } else {
        // 判断当前图形类型在 图形数组中的位置 如果为第一位则用左侧Y轴 否则用右侧Y轴
        const i = chartType.indexOf(arrSeries.TYPE[j]);
        let yIndex = 0;
        if (i !== '0') {
          yIndex = 1;
        }
        ser = { name: arrSeries.NAME[j], type: arrSeries.TYPE[j] || 'line', data: data[j], yAxisIndex: yIndex, smooth: true };
        yAxisIsNotExist = false;
      }
      if (multiY && yAxisIsNotExist) {
        const yItem = {
          type: 'value',
          name: arrSeries.NAME[j],
          nameTextStyle: {
            fontSize: 14,
          },
        };
        yAxis.push(yItem);
      }
      series.push(ser);
    }
    if (multiY) {
      opt.yAxis = yAxis;
    }
    opt.xAxis[0].data = x;
    opt.legend.data = arrSeries.NAME;
    opt.series = series;
    return opt;
  };
  // ---------------------------------画图分割线-------------------------------------------------------
  const { height, width, type } = props; // height/width:图形大小 type:图类型(line、bar等)
  const datas = (props && props.datas) ? props.datas : []; // 获取数据
  let option = (props && props.options) ? props.options : []; // 自定义覆盖型的ECHARTS参数，API请参考ECHARTS官网
  if (type === 'line') { // 线图
    option = Object.assign(LINE_AND_BAR, option);
    option = generateLineOrBarData(datas, option, props.arrSeries, props.xAxisColumn, props.type, props.multiY);
  } else if (type === 'pie') { // 饼状图
    option = Object.assign(PIE, option);
    option = generatePieData(datas, option, props.valueColumn, props.titleColumn, props.chartName);
  } else if (type === 'bar') { // 柱状图
    option = Object.assign(LINE_AND_BAR, option);
    option = generateLineOrBarData(datas, option, props.dataMapping, props.xAxisColumn, 'bar', props.multiY);
  } else if (type === 'line2') { // 线图(与line作用一样，只是两种datas结构不同，查看readme)
    option = Object.assign(LINE_AND_BAR, option);
    option = generateLineData(datas, option, props.valueColumn, props.legendColumn, props.xAxisColumn, 'line');
  } else if (type === 'barAndLine') { // 线柱组合图
    option = Object.assign(LINE_AND_BAR, option);
    option = generateBarLineData(datas, option, props.dataMapping, props.xAxisColumn, props.multiY);
  } else if (type === 'yaxisBar') { // 横向柱状图
    option = Object.assign(YAXIS_BAR, option);
    option = generateYaxisBarData(datas, option, props.colName, props.stack);
  }
  return (
    <ReactEchartsCore
      echarts={echarts}
      style={{ height, width }}
      option={option}
      notMerge
      lazyUpdate
      theme="theme_name"
    />
  );
}
export default EchartsHelper;
