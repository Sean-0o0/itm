import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function DigitalClassStatistic() {
  const digitalClassLeftChartRef = useRef(null);
  const digitalClassRightChartRef = useRef(null);

  useEffect(() => {
    const digitalClassChartOption = {
      grid: {
        left: '3%',
        right: '9%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [ 
        {
          type: 'category',
          data: ['零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班', '零售业务专班'],
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
          data: [10, 42, 20, 33, 39, 36, 22, 14, 25, 32, 15],
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
