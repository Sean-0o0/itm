import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import * as echarts from 'echarts';

export default function TeamCard(props) {
  const { teamData } = props;
  const location = useLocation();
  const pieChartRef = useRef(null);

  useEffect(() => {
    const pieChart = echarts.init(pieChartRef.current);
    if (teamData?.length !== 0) {
      // const dataCake = [...teamData];
      const dataCake = [
        {
          value: 74,
          name: '信息技术运保部',
        },
        {
          value: 101,
          name: '信息技术开发部',
        },
        {
          value: 11,
          name: '外包团队22121',
        },
        {
          value: 74,
          name: '信息技术运保1224部',
        },
        {
          value: 101,
          name: '信息技术开43123发部',
        },
        {
          value: 11,
          name: '外包团453241队',
        },
        {
          value: 74,
          name: '信息技运33321保部',
        },
        {
          value: 101,
          name: '信息技1145术开发部',
        },
        {
          value: 11,
          name: '外包团6563队',
        },
        {
          value: 74,
          name: '信息技术lll运保部',
        },
        {
          value: 101,
          name: '信息技术开000发部',
        },
        {
          value: 11,
          name: '外包团7676队',
        },
      ];
      const getValue = name => dataCake?.filter(x => x.name === name)[0].value;
      const pieChartOption = {
        legend: {
          itemWidth: 8,
          itemHeight: 8,
          icon: 'circle',
          orient: 'vertical',
          // padding: [42, 0],
          right: '0%', //图例距离左的距离
          y: 'center', //图例上下居中
          itemGap: 15,
          type: 'scroll',
          pageIconColor: '#3361ff',
          formatter: name => {
            const nameStr = name.length > 8 ? name.substr(0, 8) + '...' : name;
            return `{a|${nameStr}}{b|${getValue(name)}}`;
          },
          textStyle: {
            rich: {
              a: {
                width: 120,
                fontSize: 12,
                padding: [0, 0, 0, 4],
                fontFamily: 'PingFangSC-Regular, PingFang SC',
                color: '#9198A7',
              },
              b: {
                fontSize: 14,
                fontFamily: 'Roboto-Medium, Roboto',
                fontWeight: 'bold',
                color: '#222222',
                // width: 30,
              },
            },
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '65%'],
            avoidLabelOverlap: false,
            center: ['27%', '50%'],
            label: {
              show: false,
              position: 'center',
              formatter: params => {
                return `{a|${params.name}}\n{b|${getValue(params.name)}}`;ff
              },
              color: 'black',
              fontFamily: 'PingFangSC-Regular, PingFang SC',
              textStyle: {
                rich: {
                  a: {
                    fontSize: 14,
                    fontFamily: 'THSMoneyfont-Medium, THSMoneyfont',
                    color: '#606266',
                    lineHeight: 29,
                  },
                  b: {
                    fontSize: 24,
                    fontFamily: 'Roboto-Medium, Roboto',
                    fontWeight: 'bold',
                    color: '#222222',
                  },
                },
              },
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
      window.onresize = function() {
        pieChart.resize();
      };
      window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize
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
          <Link
            to={{
              pathname: `/pms/manage/departmentOverview`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            }}
          >
            全部
            <i className="iconfont icon-right" />
          </Link>
        </span>
      </div>
      <div className="team-chart" ref={pieChartRef} />
    </div>
  );
}
