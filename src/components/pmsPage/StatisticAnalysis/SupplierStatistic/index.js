import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function SupplierStatistic() {
  const leftBarChartRef = useRef(null);
  const rightBarChartRef = useRef(null);

  useEffect(() => {

    const barChartOption = {
      legend: {
        data: ['Evaporation', 'Temperature'],
        itemHeight: 7,
        itemWidth: 7,
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            color: '#858585',
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
          name: '单位：万  ',
          min: 0,
          max: 250,
          interval: 50,
          nameTextStyle: {
            // fontSize: 14,
            // align: 'right',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#909399'
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
          name: '单位：个',
          min: 0,
          max: 25,
          interval: 5,
          nameTextStyle: {
            // fontSize: 14,
            // align: 'right',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#909399'
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
          // name: 'Evaporation',
          type: 'bar',
          data: [
            2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
          ]
        },
        {
          // name: 'Temperature',
          type: 'bar',
          yAxisIndex: 1,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ],
      color: ['#3361FF', '#FDC041'],
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
    };
    const leftBarChart = echarts.init(leftBarChartRef.current);
    const rightBarChart = echarts.init(rightBarChartRef.current);
    leftBarChart.setOption(barChartOption);
    rightBarChart.setOption(barChartOption);
    return () => {
      leftBarChart.dispose();
      rightBarChart.dispose();
    }
  }, []);
  return (
    <div className='supplier-statistic-box'>
      <div className='supplier-left'>
        <div className='left-title'>项目外包供应商统计</div>
        <div className='left-chart' ref={leftBarChartRef} />
      </div>
      <div className='supplier-right'>
        <div className='right-title'>人力外包供应商统计</div>
        <div className='right-chart' ref={rightBarChartRef} />
      </div>
    </div>
  )
}
