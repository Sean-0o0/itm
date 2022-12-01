import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function TeamStatistic() {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

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
          name: 'Precipitation',
          min: 0,
          max: 100,
          interval: 25,
          axisLabel: {
            color: '#858585',
            // fontSize: 14,
            fontFamily: 'Roboto-Regular, Roboto',
            fontWeight: 400,
            showMaxLabel: true,
            formatter: '{value}',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          }
        },
      ],
      series: [
        {
          name: 'Evaporation',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name: 'Temperature',
          type: 'bar',
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ],
      color: ['#3361FF', '#FDC041'],
    };
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
          return `{a|${name}}{b|${getValue(name)}%}{c|${getValue(name) * 2}人}`;
        },
        textStyle: {
          rich: {
            a: {
              width: 100,
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
          center: ['15%', '50%'],
          label: {
            show: false,
            position: 'center',
            formatter: (params) => {
              return [
                params.name, `${params.percent}%`
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

  const getContrastItem = (dataTxt = '--', dataNum = '--', unit = '', contrastNum = '--') => {
    dataNum = `${dataNum}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    contrastNum = contrastNum === 0 ? '--' : contrastNum;
    const plusStr = contrastNum > 0 ? '+' : '';
    const icon = contrastNum > 0 ? ' icon-rise' : contrastNum < 0 ? ' icon-fall' : '';
    const color = contrastNum > 0 ? '#F06270' : contrastNum < 0 ? '#46CB9F' : '#909399';
    return (
      <div className='contrast-item'>
        <div className='contrast-item-txt'>{dataTxt}</div>
        <div className='contrast-item-data'>
          <div className='data-txt'>
            <span className='data-txt-num'>{dataNum}</span>
            {unit}
          </div>
          <div className='data-contrast'>较去年:
            <span className='data-contrast-num' style={{ color }}>{plusStr}{contrastNum}
              <i className={'iconfont' + icon} style={{ fontSize: '2px' }}></i>
            </span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className='team-statistic-box'>
      <div className='team-left'>
        <div className='left-title'>科研人才队伍</div>
        <div className='left-content'>
          <div className='content-contrast'>
            {getContrastItem('开发部人数', 83, '', 23)}
            {getContrastItem()}
          </div>
          <div className='content-chart' ref={barChartRef} />
        </div>
      </div>
      <div className='team-right'>
        <div className='right-title'>科研队伍构成</div>
        <div className='right-content' ref={pieChartRef} />
      </div>
    </div>
  )
}
