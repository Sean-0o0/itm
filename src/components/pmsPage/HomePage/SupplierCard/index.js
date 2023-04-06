import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function SupplierCard(props) {
  const { supplierData, time } = props;
  const radarChartRef = useRef(null);
  //防抖定时器
  let timer = null;

  useEffect(() => {
    const radarChart = echarts.init(radarChartRef.current);
    if (JSON.stringify(supplierData) !== '{}') {
      // console.log('🚀 ~ file: index.js ~ line 11 ~ useEffect ~ supplierData', supplierData);
      const radarChartOption = {
        legend: {
          data: ['采购金额(万元)', '采购数量'],
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
        },
        tooltip: {
          // trigger: 'axis',
          confine: true,
        },
        zlevel: 100,

        radar: {
          // shape: 'circle',
          splitNumber: 4,
          center: ['50%', '50%'],
          radius: '45%',
          indicator: supplierData?.gysmc,
          splitArea: {
            areaStyle: {
              color: ['#fafafbFF', '#fafafbFF', '#fafafbFF', '#fff'],
            },
          },
          splitLine: {
            lineStyle: {
              color: ['#EBEEF5FF'],
              width: 2,
            },
          },
          name:{
            color: '#606266',
            fontFamily: 'Roboto-Regular, Roboto',
            fontSize: 12,
            formatter: function(value) {
              let list = value.split('');
              let result = '';
              for (let i = 1; i <= list.length; i++) {
                if (!(i % 6) && list[i] != undefined) {
                  result += list[i - 1] + '\n';
                } else {
                  result += list[i - 1];
                }
              }
              return result;
            },
          }
          // triggerEvent: true,
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: supplierData?.cgje,
                name: '采购金额(万元)',
              },
              {
                value: supplierData?.cgsl,
                name: '采购数量',
              },
            ],
          },
        ],
        color: [
          '#3361FF',
          '#FDC041',
          '#FF8D84',
          '#86E0FF',
          '#02E4DD',
          '#6B74FF',
          '#7392CA',
          '#9DBCFF',
        ],
      };
      radarChart.setOption(radarChartOption);
      window.onresize = function() {
        radarChart.resize();
      };
    }
    return () => {
      if (supplierData !== '{}') radarChart.dispose();
    };
  }, [props]);

  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  return (
    <div className="supplier-card-box">
      <div className="home-card-title-box" style={{ marginBottom: 9 }}>
        供应商情况
        <span>
          全部
          <i className="iconfont icon-right" />
        </span>
      </div>
      <div style={{ color: '#b7b3b3', fontSize: '12px', marginBottom: '16px', marginLeft: '24px' }}>
        {time + ' 更新'}
      </div>
      <div className="supplier-chart" ref={radarChartRef} />
    </div>
  );
}
