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
          data: ['零售业务专班1', '零售业务专班2', '零售业务专班3', '零售业务专班4', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', ''],
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
          name: '单位：人',
          nameTextStyle: {
            fontSize: 14,
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
          return `{a|${name}}{b|${getValue(name)}%}{c|${getValue(name) * 1000000}}`;
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
          center: ['25%', '50%'],
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
  return (
    <div className='non-capital'>
      <div className='non-capital-title'>非资本性预算</div>
      <div className='non-capital-top' ref={barChartRef} />
      <div className='non-capital-bottom' ref={pieChartRef} />
    </div>
  )
}
