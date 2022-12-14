import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function PersonnelStatistic() {
  const leftPieChartRef = useRef(null);
  const rightPieChartRef = useRef(null);

  useEffect(() => {
    const dataCake = [
      { value: 30, name: '行业指定标准' },
      { value: 20, name: '创新课题申报' },
      { value: 15, name: '技术专利' },
      { value: 10, name: '软件著作' },
      { value: 10, name: 'aaaa' },
      { value: 5, name: 'bbbb' },
      { value: 5, name: 'cccc' },
      { value: 5, name: 'dddd' },
    ];
    const getValue = (name) => dataCake?.filter(x => x.name === name)[0].value;
    const pieChartOption = {
      legend: {
        itemWidth: 7,
        itemHeight: 7,
        orient: 'vertical',
        padding: [42, 0],
        left: '30%',  //图例距离左的距离
        y: 'center',  //图例上下居中
        itemGap: 20,
        formatter: (name) => {
          const nameStr = name.length>5?name.substr(0, 5)+'...':name;
          return `{a|${nameStr}}{b|${getValue(name)}%}{c|${getValue(name) * 2}人}`;
        },
        textStyle: {
          rich: {
            a: {
              width: 80,
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
              width: 60,
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
          center: ['15%', '50%'],
          label: {
            show: false,
            position: 'center',
            formatter: (params) => {
              return [
                params.name, `${getValue(params.name) * 2}人`
              ].join('\n');
            },
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
          },
        }
      ],
      color: ['#3361FF', '#FDC041', '#FF8D84', '#86E0FF', '#02E4DD', '#6B74FF', '#7392CA', '#9DBCFF']
    };
    const leftPieChart = echarts.init(leftPieChartRef.current);
    const rightPieChart = echarts.init(rightPieChartRef.current);
    leftPieChart.setOption(pieChartOption);
    rightPieChart.setOption(pieChartOption);
    return () => {
      leftPieChart.dispose();
      rightPieChart.dispose();
    }
  }, []);
  return (
    <div className='personnel-statistic-box'>
      <div className='personnel-left'>
        <div className='left-title'>人力外包人员岗位统计</div>
        <div className='left-chart' ref={leftPieChartRef} />
      </div>
      <div className='personnel-right'>
        <div className='right-title'>人力外包人员等级统计</div>
        <div className='right-chart' ref={rightPieChartRef} />
      </div>
    </div>
  )
}
