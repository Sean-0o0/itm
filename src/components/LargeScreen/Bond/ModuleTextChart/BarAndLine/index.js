import React from 'react';
import { message } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import {
    FetchQueryChartIndexData,
} from '../../../../../services/largescreen';

class LineType extends React.Component {
    state = {
        datas: [],
    };

    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
        this.fetchData();
        this.fetchInterval = setInterval(() => {
            // const loginStatus = localStorage.getItem('loginStatus');
            // if (loginStatus !== '1') {
            //     this.props.dispatch({
            //         type: 'global/logout',
            //     });
            // }
            this.fetchData();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    fetchData = () => {
        const { configData = {} } = this.props;
        FetchQueryChartIndexData({
            chartCode: configData.chartCode,
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ datas: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    // 获取x轴配置
    getXAxisOption = () => {
        const { datas = [] } = this.state;
        const data = datas.map(m => `${m.RQ}`);
        for (let i = 0; i < data.length; i++) {
            data[i] = data[i].slice(4, data[i].legend);
            data[i] = `${data[i].slice(0, 2)}-${data[i].slice(2)}`;
        }

        const xAxis = {
            data: data,
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#00ACFF',
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'   //这里用参数代替了
                },
                interval: 0,
                formatter: function (value) {
                  let ret = "";//拼接加\n返回的类目项
                  const valLength = value.length;//X轴类目项的文字个数
                  const rowN = Math.ceil(valLength / 4); //类目项需要换行的行数
                  if (rowN > 1)//如果类目项的文字大于5,
                  {
                    for (var i = 0; i < rowN; i++) {
                      let temp = "";//每次截取的字符串
                      const start = i * 4;//开始截取的位置
                      const end = start + 4;//结束截取的位置
                      //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                      temp = value.substring(start, end) + "\n";
                      ret += temp; //凭借最终的字符串
                    }
                    return ret;
                  }
                  else {
                    return value;
                  }
                },
            },
        };

        const {businessUnit = false } = this.props;
        if(businessUnit) {
          xAxis.data = [];
          datas.map((item, index) => {
            xAxis.data.push(item.GROUPNAME);
          });
        }
        return xAxis;
    };

    //y轴配置
    getYAxisOption = () => {
        const { configData = {}, indexConfig = {}, businessUnit = false  } = this.props;
        const { chartCode = '' } = configData;
        const iConf = indexConfig[chartCode] || [];
        const yAxis = [];
        // 左纵轴单位
        const leftVerticalUnit = configData.leftVerticalUnit;
        // 右纵轴单位
        const rightVerticalUnit = configData.rightVerticalUnit;
        // 确定有左纵轴
        const haveLeftYAxis = true;
        // 是否有右纵轴
        const haveRightYAxis = businessUnit ? true : iConf.some(m => Number.parseInt(m.verticalType, 10) === 2);
        const defaultOption = {
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#00ACFF',
                }
            },
            splitLine: {
                show: false
            },
            splitNumber: 5,
            // min: (value) => {
            //     return value.min-5>0?value.min-5:0;
            // },
            max: (value) => {
                return value.max < 15 ? value.max + 15 : value.max;
            }
        };
        if (haveLeftYAxis) {
            yAxis.push({
                ...defaultOption,
                name: leftVerticalUnit,
                nameTextStyle: {
                    color: '#fff',
                },
                nameGap: 8,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                },
            });

        }
        if (haveRightYAxis) {
            yAxis.push({
                ...defaultOption,
                name: rightVerticalUnit,
                nameGap: 8,
                nameTextStyle: {
                    color: '#fff',
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                },
            });
        }
        return yAxis;
    };

    // 获取color配置
    getColorOption = () => {
        const { configData = {}, indexConfig = {}, businessUnit = false } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        const data = iConf.map(m => m.displayColor);

        if(businessUnit) {
          return ["rgba(0, 172, 255, 1)","rgba(247, 180, 50, 1)", "rgb(243, 85, 163)"]
        } else {
          return data;
        }

    }

    // 获取legend配置
    getLegendOption = () => {
        const { configData = {}, indexConfig = {}, businessUnit = false } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        let num = 2;
        let fontSize = 12;
        if( chartCode === 'FutursCustNum' || chartCode === 'FutursCustEquity' || chartCode === 'FutursNewCustNum' || chartCode === 'FutursBrokerageTrd'){
          num = 3;
          fontSize = 9;
        }
        if( chartCode === 'FutursTrdRiskControl' ){
          fontSize = 9;
        }
        const data = iConf.map(m => m.indexName);
        const maxlength = Math.ceil(data.length / num);
        const dataArr = [];
        const legendArr = [];
        for (let i = 0; i < maxlength; i++) {
          dataArr.push([]);
        }
        data.forEach((item, index) => {
          dataArr[parseInt(index / num)].push(item);
        });
        dataArr.forEach((item, index) => {
          const paddingTop = index * 18;
          const legendOption = {
            data: item,
            x: 'center',
            y: paddingTop,
            orient: 'horizontal',
            textStyle: {//图例文字的样式
              color: '#fff',
              fontSize: fontSize
            },
            itemHeight: 10,
            itemGap: 5,
          };
          legendArr.push(legendOption);
        });

        if(businessUnit) {
          const tab = [{
            data:["交易单元数量","佣金","成本"],
            x:"center",
            y:0,
            orient:"horizontal",
            textStyle:{color:"#fff", fontSize:9},
            itemHeight:10,
            itemGap:5}]
          return tab;
        } else {

          return legendArr;
        }


    };

    // 获取数据
    getSeriesData = () => {
        const { configData = {}, indexConfig = {}, businessUnit = false } = this.props;
        const { chartCode = '' } = configData;
        const series = [];
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        const legendNames = iConf.map(m => m.indexName);
        const { datas = [] } = this.state;
        const dcTypeDic = {
          21: 'bar',
          22: 'line',
        };
        for (let i = 0; i < legendNames.length; i++) {
          const iConfItem = iConf.find(m => m.indexName === legendNames[i]) || {};
          if (Object.keys(iConfItem).length > 0) {
            let data = [];
            // 指标编码
            const {
              indexCode = '',
              indexName = '',
              verticalType = '',
              displayColor = '',
              displayType = '',
            } = iConfItem;
            // 构建数据
            data = datas.map(m => m[indexCode] || 0);
            let color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: displayColor || 'rgba(0, 172, 255, 1)'
            },
              {
                offset: 1,
                color: 'rgba(0, 172, 255, 0)'

              }])
            if(displayType&&displayType ==='22'){
              color = displayColor || '#00ade9'
            }
            const tmpl = {
              name: indexName || '',
              type: dcTypeDic[displayType] || 'bar',
              yAxisIndex: Number.parseInt(verticalType, 10) - 1 || 0,
              data,
              symbol: 'circle',
              symbolSize: 5,
              sampling: 'average',
              barWidth: '25%',
              areaStyle: {
                color: iConf.some(item => {
                  return item.displayType === '21';
                })
                  ? 'transparent'
                  : {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: displayColor, // 0% 处的颜色
                      },
                      {
                        offset: 0.4,
                        color: displayColor, // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'transparent', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
              },
              itemStyle: {
                emphasis: {
                  barBorderRadius: 4
                },
                normal: {
                  barBorderRadius: 4,
                  color: color
                },
              },
            };
            series.push(tmpl);
          }
        };

        if(!businessUnit) {
          return series;
        } else {
            const MKTUNITNUM = [];
            const COMMISSION = [];
            const COST = [];
            datas.map((item, index) => {
              MKTUNITNUM.push(item.MKTUNITNUM);
              COMMISSION.push(item.COMMISSION);
              COST.push(item.COST);
            });
            return [
              {name:"交易单元数量",
                "type":"bar",
                yAxisIndex:0,
                data: MKTUNITNUM,
                symbol:"circle",
                symbolSize:5,
                sampling:"average",
                barWidth:"25%",
                areaStyle:{"color":"transparent"},
                itemStyle:{emphasis:{barBorderRadius:4}, normal:{barBorderRadius:4,color:{x:0,y:0,x2:0,y2:1,type:"linear",global:false,
                      colorStops:[{offset:0,color:"rgba(0, 172, 255, 1)"},
                        {offset:1,color:"rgba(0, 172, 255, 0)"}]}}}},
              {name:"佣金",type:"line",yAxisIndex:1,data: COMMISSION,
                symbol:"circle",symbolSize:5,sampling:"average",barWidth:"25%",areaStyle:{"color":"transparent"},
                itemStyle:{emphasis:{barBorderRadius:4},normal:{barBorderRadius:4,color:"rgba(247, 180, 50, 1)"}}},
              {name:"成本",type:"line",yAxisIndex:1,data: COST,
                symbol:"circle",symbolSize:5,sampling:"average",barWidth:"25%",areaStyle:{"color":"transparent"},
                itemStyle:{emphasis:{barBorderRadius:4},normal:{barBorderRadius:4,color:"rgb(243, 85, 163)"}}}]
        }



    };

    render() {
        const { configData = {} } = this.props;
        const { chartCode = '' } = configData;
        let top = '50';
        if(chartCode === 'FutursCustNum' || chartCode === 'FutursCustEquity' || chartCode === 'FutursNewCustNum'){
            top = '75';
        }

        const option = {
            // tooltip: {
            //     trigger: 'item',
            //     formatter: '{c}'
            // }
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross',       // 默认为直线，可选为：'line' | 'shadow'
                },
                textStyle: {
                    align: 'left'
                }
            },
            color: this.getColorOption(),
            legend: this.getLegendOption(),
            grid: {
                left: '4%',
                right: '6%',
                containLabel: true,
                bottom: '3%',
                top: top
            },
            xAxis: this.getXAxisOption(),
            yAxis: this.getYAxisOption(),
            series: this.getSeriesData()
        };

        return (
            // <div>111</div>
            <React.Fragment>
                <ReactEchartsCore
                    echarts={echarts}
                    option={option}
                    notMerge
                    lazyUpdate
                    style={{ height: '100%' }}
                    theme=""
                />
            </React.Fragment>
        )
    }
}
export default LineType;
