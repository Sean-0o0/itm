import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function SupplierStatistic() {
  const leftBarChartRef = useRef(null);
  const rightBarChartRef = useRef(null);

  useEffect(() => {

    const barChartOption = {
      legend: {
        data: ['Evaporation', 'Temperature']
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisPointer: {
            type: 'shadow'
          },
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
          name: 'Precipitation',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value} ml'
          }
        },
        {
          type: 'value',
          name: 'Temperature',
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: '{value} °C'
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
          type: 'bar',
          yAxisIndex: 1,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ]
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
