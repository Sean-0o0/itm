import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function NonCapitalBudget() {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const dataCake = [
      { value: 30, name: '行业指定标准' },
      { value: 20, name: '创新课题申报' },
      { value: 16, name: '技术专利' },
      { value: 14, name: '软件著作' },
      { value: 10, name: 'aaaa' },
      { value: 10, name: 'bbbb' },
    ];
    const getValue = (name) => dataCake?.filter(x => x.name === name)[0].value;
    const barChartOption = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['零售业务专班1', '零售业务专班2', '零售业务专班3', '零售业务专班4', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班'],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#858585',
            align: 'left',
            fontSize: 14,
            fontFamily: 'Roboto-Regular, Roboto',
            fontWeight: 400,
            interval: 0,
            rotate: -30,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '万元',
          nameTextStyle: {
            // fontSize: 14,
            align: 'right',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#909399'
          },
          nameGap: 18,
          axisLabel: {
            color: '#858585',
            fontSize: 14,
            fontFamily: 'Roboto-Regular, Roboto',
            fontWeight: 400,
            showMaxLabel: true,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          }
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '30%',
          data: [10, 42, 20, 33, 39, 36, 22, 14, 25, 32],
        }
      ],
      dataZoom: [
        {
          type: "slider", //隐藏或显示（true）组件
          show: false,
          startValue: 0,
          endValue: 9,
          filterMode: "empty",
          zoomLoxk: true, // 是否锁定选择区域（或叫做数据窗口）的大小
        },
        {
          //没有下面这块的话，只能拖动滚动条，鼠标滚轮在区域内不能控制外部滚动条
          type: "inside",
          zoomOnMouseWheel: true, //滚轮是否触发缩放
          moveOnMouseMove: true, //鼠标滚轮触发滚动
          moveOnMouseWheel: true,
        },
      ],
      grid: {
        left: '3%',
        right: '9%',
        bottom: '3%',
        containLabel: true,
      },
      color: '#3361FF',
    };
    const pieChartOption = {
      legend: {
        itemWidth: 7,
        itemHeight: 7,
        orient: 'vertical',
        // padding: [42, 0],
        left: '45%',  //图例距离左的距离
        y: 'center',  //图例上下居中
        itemGap: 20,
        formatter: (name) => {
          const nameStr = name.length>9?name.substr(0, 9)+'...':name;
          return `{a|${nameStr}}{b|${getValue(name)}%}{c|${getValue(name) * 1000000}}`;
        },
        textStyle: {
          rich: {
            a: {
              width: 120,
              fontSize: 12,
              fontFamily: 'PingFangSC-Regular, PingFang SC',
              color: '#9198A7',
            },
            b: {
              fontSize: 14,
              fontFamily: 'Roboto-Medium, Roboto',
              fontWeight: 'bold',
              color: '#222222',
              width: 60,
            },
            c: {
              fontSize: 14,
              fontFamily: 'Roboto-Medium, Roboto',
              fontWeight: 'bold',
              color: '#222222',
              width: 40,
            }
          }
        }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          center: ['25%', '50%'],
          label: {
            show: false,
            position: 'center',
            color: 'black',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
            }
          },
          labelLine: {
            show: false
          },
          data: dataCake,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ],
      color: ['#3361FF', '#FDC041', '#FF8D84', '#86E0FF', '#02E4DD', '#6B74FF', '#7392CA', '#9DBCFF']
    };
    const barChart = echarts.init(barChartRef.current);
    const pieChart = echarts.init(pieChartRef.current);
    barChart.setOption(barChartOption);
    pieChart.setOption(pieChartOption);
    return () => {
      barChart.dispose();
      pieChart.dispose();
    }
  }, []);
  return (
    <div className='non-capital'>
      <div className='non-capital-title'>非资本性预算</div>
      <div className='non-capital-top' ref={barChartRef} />
      <div className='non-capital-bottom' ref={pieChartRef} />
    </div>
  )
}
