import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function SupplierCard(props) {
  const {} = props;
  const radarChartRef = useRef(null);

  useEffect(() => {
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
      },
      zlevel: 10,

      radar: {
        // shape: 'circle',
        splitNumber: 4,
        center: ['50%', '50%'],
        radius: '60%',
        indicator: [
          { name: 'Sales', max: 6500 },
          { name: 'Administration', max: 16000 },
          { name: 'Information Technology', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 },
        ],
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
        axisName: {
          color: '#606266FF',

          fontFamily: 'Roboto-Regular, Roboto',
          fontSize: 14,
        },
        // triggerEvent: true,
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: '采购金额(万元)',
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
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
    const radarChart = echarts.init(radarChartRef.current);
    radarChart.setOption(radarChartOption);
    return () => {
      radarChart.dispose();
    };
  }, []);
  return (
    <div className="supplier-card-box">
      <div className="home-card-title-box">
        部门队伍建设(含外包)
        <span>
          全部
          <i className="iconfont icon-right" />
        </span>
      </div>
      <div className="supplier-chart" ref={radarChartRef} />
    </div>
  );
}
