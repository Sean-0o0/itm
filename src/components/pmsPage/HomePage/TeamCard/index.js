import React, { useEffect, useState, useRef } from 'react';
import * as echarts from 'echarts';

export default function TeamCard(props) {
  const { teamData } = props;
  const pieChartRef = useRef(null);

  useEffect(() => {
    const pieChart = echarts.init(pieChartRef.current);
    if (teamData?.length !== 0) {
      const dataCake = [...teamData];
      const getValue = name => dataCake?.filter(x => x.name === name)[0].value;
      const pieChartOption = {
        legend: {
          itemWidth: 8,
          itemHeight: 8,
          icon: 'circle',
          orient: 'vertical',
          padding: [42, 0],
          left: '60%', //图例距离左的距离
          y: 'center', //图例上下居中
          itemGap: 20,
          formatter: name => {
            const nameStr = name.length > 5 ? name.substr(0, 5) + '...' : name;
            return `{a|${nameStr}}{b|${getValue(name)}}`;
          },
          textStyle: {
            rich: {
              a: {
                width: 60,
                fontSize: 12,
                padding: [0, 0, 0, 8],
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
            },
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '60%'],
            avoidLabelOverlap: false,
            center: ['25%', '50%'],
            label: {
              show: false,
              position: 'center',
              formatter: params => {
                return [params.name, `${getValue(params.name) * 2}人`].join('\n');
              },
              color: 'black',
              fontFamily: 'PingFangSC-Regular, PingFang SC',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
              },
            },
            labelLine: {
              show: false,
            },
            data: dataCake,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
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
      pieChart.setOption(pieChartOption);
      window.onresize = function(){
        pieChart.resize();
      }
    }
    return () => {
      if (teamData?.length !== 0) pieChart.dispose();
    };
  }, [props]);
  return (
    <div className="team-card-box">
      <div className="home-card-title-box">
        部门队伍建设(含外包)
        <span>
          全部
          <i className="iconfont icon-right" />
        </span>
      </div>
      <div className="team-chart" ref={pieChartRef} />
    </div>
  );
}
