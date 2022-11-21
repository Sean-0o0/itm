import React, { useEffect, useRef }  from 'react';
import * as echarts from 'echarts';

export default function DigitalClassStatistic() {
    const digitalClassLeftChartRef = useRef(null);
    const digitalClassRightChartRef = useRef(null);
  
    useEffect(() => {
      const digitalClassChartOption = {
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'shadow'
        //   }
        // },
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
      const digitalClassLeftChart = echarts.init(digitalClassLeftChartRef.current);
      const digitalClassRightChart = echarts.init(digitalClassRightChartRef.current);
      digitalClassLeftChart.setOption(digitalClassChartOption);
      digitalClassRightChart.setOption(digitalClassChartOption);
      return () => {
        digitalClassLeftChart.dispose();
        digitalClassRightChart.dispose();
      }
    }, []);
    const getDigitalClassItem = (iconName, ref) => {
        return (
            <div className='digital-class-item'>
                <div className='top-title'>
                    <div className='top-title-img'>
                        <i className={'iconfont icon-' + iconName} style={{ fontSize: '1px' }} />
                    </div>
                    人员投入分布
                </div>
                <div className='top-title-total'><span className='top-title-total-label'>总数：</span>150人</div>
                <div className='bottom-graph' ref={ref}>
                </div>
            </div>
        );
    };
    return (
        <div className='digital-class-box'>
            <div className='digital-class-title'>数字化专班建设</div>
            <div className='digital-class-item-box'>
                {getDigitalClassItem('team', digitalClassLeftChartRef)}
                {getDigitalClassItem('search', digitalClassRightChartRef)}
            </div>
        </div>
    );
}
