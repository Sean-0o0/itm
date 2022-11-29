import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ProjectProfileTab from './ProjectProfileTab';

export default function ProjectOverView() {
  const gloryChartRef = useRef(null);
  useEffect(() => {
    const dataCake = [
      { value: 443, name: '行业指定标准' },
      { value: 165, name: '创新课题申报' },
      { value: 243, name: '技术专利' },
      { value: 85, name: '软件著作' },
    ];
    const getValue = (name) => dataCake?.filter(x => x.name === name)[0].value;
    const gloryChartOption = {
      legend: {
        orient: 'vertical',
        left: '50%',  //图例距离左的距离
        y: 'center',  //图例上下居中
        itemGap: 20,
        formatter: (name) => {
          return `{b|${name}}{a|${getValue(name)}}`;
        },
        textStyle: {
          rich: {
            a: {
              fontSize: 14,
              fontFamily: 'Roboto-Medium, Roboto',
              fontWeight: 'bold',
              color: '#222222',
            },
            b: {
              width: 100,
            },
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
      color: ['#3361FF', '#FDC041', '#FF8D84', '#86E0FF']
    };
    const gloryChart = echarts.init(gloryChartRef.current);
    gloryChart.setOption(gloryChartOption);
    return () => {
      gloryChart.dispose();
    };
  }, []);
  const getContrastItem = (iconName) => {
    return (
      <div className='contrast-item'>
        <div className='contrast-item-left'>
          <i className={'iconfont icon-' + iconName} style={{ fontSize: '24px' }}></i>
        </div>
        <div className='contrast-item-right'>
          <div className='contrast-item-txt'>资本性预算</div>
          <div className='contrast-item-data'>
            <div className='data-txt'>
              <span className='data-txt-num'>80000</span>
              万
            </div>
            <div className='data-contrast'>较去年:
              {/*绿色 #46CB9F */}
              <span className='data-contrast-num' style={{ color: '#F06270' }}>+200
                <i className='iconfont icon-rise' style={{ fontSize: '2px' }}></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const getMedalItem = () => {
    return (
      <div className='medal-item'>
        国家级
        <div className='medal-num'>2</div>
        <img className='medal-bg' src={require('../../../../image/pms/StatisticAnalysis/medal@2x.png')} alt='' />
      </div>
    );
  };
  return (
    <div className='project-overview-box'>
      <div className='overview-top-box'>
        <ProjectProfileTab />
        <div className='glory-profile-box'>
          <div className='title'>荣誉情况</div>
          <div className='content-box'>
            <div className='glory-info'>
              <div className='info-num'>
                <div className='info-num-item1'>
                  <i className='iconfont icon-report info-num-icon' />
                  参与次数：
                  <span className='info-num-count'>76</span>
                </div>
                <div className='info-num-item2'>
                  <i className='iconfont icon-medal info-num-icon' />
                  获奖次数：
                  <span className='info-num-count'>65</span>
                </div>
              </div>
              <div className='info-medal'>
                {getMedalItem()}
                {getMedalItem()}
                {getMedalItem()}
              </div>
            </div>
            <div className='glory-graph' ref={gloryChartRef}></div>
          </div>
        </div>
      </div>
      <div className='overview-bottom-box'>
        <div className='overview-bottom-title'>预算总体情况</div>
        <div className='overview-bottom-contrast-box'>
          {getContrastItem('finance')}
          {getContrastItem('cash')}
          {getContrastItem('assets')}
        </div>
      </div>
    </div>
  )
}
