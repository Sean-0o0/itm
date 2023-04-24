import React, { useEffect, useState, useRef } from 'react';
import { Progress } from 'antd';
import * as echarts from 'echarts';

export default function CapitalBudget() {
  const lineBarChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const dataCake = [
      { value: 30, name: '行业指定标准行业指定标准' },
      { value: 20, name: '创新课题申报' },
      { value: 16, name: '技术专利行业指定标准' },
      { value: 14, name: '软件著作' },
      { value: 10, name: 'aaaa行业指定标准' },
      { value: 10, name: 'bbbb' },
    ];
    const getValue = (name) => dataCake?.filter(x => x.name === name)[0].value;
    const lineBarChartOption = {
      legend: {
        itemHeight: 7,
        itemWidth: 7,
        data: ['Evaporation', {
          name: 'Temperature',
          icon: 'roundRect'
        }],
        textStyle: {
          fontSize: 12,
          fontFamily: 'PingFangSC-Regular, PingFang SC',
          color: '#9198A7',
        }
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            color: '#858585',
            align: 'left',
            fontSize: 14,
            fontFamily: 'Roboto-Regular, Roboto,PingFangSC-Regular,PingFang SC',
            fontWeight: 400,
            interval: 0,
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
          name: '亿元',
          min: 0,
          max: 250,
          interval: 50,
          nameTextStyle: {
            // fontSize: 14,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            align: 'right',
            color: '#9198A7',
          },
          nameGap: 18,
          axisLabel: {
            color: '#858585',
            // fontSize: 14,
            fontFamily: 'Roboto-Regular, Roboto,PingFangSC-Regular,PingFang SC',
            fontWeight: 400,
            showMaxLabel: true,
            formatter: '{value}'
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          }
        },
        {
          type: 'value',
          name: '   %',
          min: 0,
          max: 25,
          interval: 5,
          nameTextStyle: {
            // fontSize: 14,
            align: 'left',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#9198A7',
          },
          nameGap: 18,
          axisLabel: {
            color: '#858585',
            // fontSize: 14,
            fontFamily: 'Roboto-Regular, Roboto,PingFangSC-Regular,PingFang SC',
            fontWeight: 400,
            showMaxLabel: true,
            formatter: '{value}'
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
          name: 'Evaporation',
          type: 'bar',
          data: [
            2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
          ]
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 1,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
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
      color: ['#3361FF', '#FDC041']
    };
    const pieChartOption = {
      legend: {
        itemWidth: 7,
        itemHeight: 7,
        orient: 'vertical',
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
    const lineBarChart = echarts.init(lineBarChartRef.current);
    const pieChart = echarts.init(pieChartRef.current);
    lineBarChart.setOption(lineBarChartOption);
    pieChart.setOption(pieChartOption);
    return () => {
      lineBarChart.dispose();
      pieChart.dispose();
    }
  }, []);

  const getProgressItem = () => {
    return (
      <div className='progress-bar'>
        <div className='progress-top'>
          已执行软件金额
          <span>28000万</span>
        </div>
        <Progress strokeWidth={16} strokeColor='#3361ff' percent={70} />
        <div className='progress-bottom'>
          总金额：30000万
          <span>剩余：2000万</span>
        </div>
      </div>
    );
  };
  return (
    <div className='capital'>
      <div className='capital-title'>资本性预算</div>
      <div className='capital-top'>
        <div className='progress-box'>
          {getProgressItem()}
          {getProgressItem()}
        </div>
        <div className='line-bar-chart' ref={lineBarChartRef} />
      </div>
      <div className='capital-bottom' ref={pieChartRef} />
    </div>
  )
}
