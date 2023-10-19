import React, {useState} from 'react';
import {Tabs} from 'antd';
import {useLocation} from 'react-router';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/radar';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import InfoDetail from "../../ProjectMemberStatisticsInfo/infoDetail";


const {TabPane} = Tabs;

export default function InfoTable(props) {

  const [footerVisable, setFooterVisable] = useState(false);
  const [detailVisable, setDetailVisable] = useState(false);
  const {
    tableData = [],
    total = 0,
    activeKey,
  } = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)

  //获取雷达图数据
  let datavalue = [25, 25, 5, 15];
  let i = -1;
  const option = {
    // title: {
    //   text: '基础雷达图'
    // },
    color: ["#1890FF"],
    tooltip: {
      show: false,
    },
    radar: [{
      center: ['50%', '50%'],
      // shape: 'circle',
      radius: 68,
      name: {
        textStyle: {
          color: '#999',
          backgroundColor: '#fff',
          borderRadius: 3,
          padding: [1, 1]
        },
        rich: {
          a: {
            fontSize: '14',
            color: '#999999',
            align: 'left',
            lineHeight: '20'
          },
          b: {
            fontSize: '14',
            color: '#333333',
            align: 'center',
            fontWeight: 'bold'
          }
        },
        formatter: (a, b) => {
          i++;
          return `{a|${a}}\n{b|${datavalue[i]}}`
        }
      },
      indicator: [
        {name: '负责项目', max: 25},
        {name: '获奖项目', max: 25},
        {name: '课题项目', max: 25},
        {name: '专班项目', max: 25},
      ],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#fff', '']
          // 图表背景网格的颜色
        }
      },
    }],
    series: [{
      name: '预算 vs 开销（Budget vs spending）',
      type: 'radar',
      // areaStyle: {normal: {}},
      itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
        color: '#5B8FF9',
        borderColor: '#5B8FF9',
      },
      areaStyle: {
        color: '#5B8FF9',
      },
      data: [
        {
          value: [25, 25, 5, 15],
          name: '童卫',
        },
      ]
    }]
  };

  const getFooter = () => {
    setFooterVisable(true)
  }

  const hiddenFooter = () => {
    setFooterVisable(false)
  }

  const toDetail = () => {
    setDetailVisable(true);
  }

  const hiddenDetail = () => {
    setDetailVisable(false)
  }

  return (
    activeKey === 'YJBM_ALL' ? !detailVisable ?
      <div className="info-table">
        <div className="info-table-title">
          领导统计
        </div>
        <div className="info-table-content">
          <div className="info-table-content-box">
            <div className="info-table-content-box-title">
              <div className="info-table-content-box-title-left">
                童卫
              </div>
              <div className="info-table-content-box-title-right">
                <i className="iconfont icon-vs"/>数据对比
              </div>
            </div>
            <div className="info-table-content-box-radar" onMouseEnter={getFooter} onMouseLeave={hiddenFooter}>
              <ReactEchartsCore
                echarts={echarts}
                option={option}
                notMerge
                lazyUpdate
                style={{height: '240px'}}
                theme=""
              />
              {
                footerVisable &&
                <div className="info-table-content-box-footer">
                  <div className="info-table-content-box-footer-left">
                    <span className="info-table-content-box-footer-left-span">项目明细</span>
                  </div>
                  <div className="info-table-content-box-footer-right">
                    <span className="info-table-content-box-footer-left-span" onClick={toDetail}>部门详情</span>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="info-table-content-box">
            <div className="info-table-content-box-title">
              <div className="info-table-content-box-title-left">
                童卫
              </div>
              <div className="info-table-content-box-title-right">
                <i className="iconfont icon-vs"/>数据对比
              </div>
            </div>
            <div className="info-table-content-box-radar" onMouseEnter={getFooter} onMouseLeave={hiddenFooter}>
              <ReactEchartsCore
                echarts={echarts}
                option={option}
                notMerge
                lazyUpdate
                style={{height: '240px'}}
                theme=""
              />
              {
                footerVisable &&
                <div className="info-table-content-box-footer">
                  <div className="info-table-content-box-footer-left">
                    <span className="info-table-content-box-footer-left-span">项目明细</span>
                  </div>
                  <div className="info-table-content-box-footer-right">
                    <span className="info-table-content-box-footer-left-span">部门详情</span>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="info-table-content-box">
            <div className="info-table-content-box-title">
              <div className="info-table-content-box-title-left">
                童卫
              </div>
              <div className="info-table-content-box-title-right">
                <i className="iconfont icon-vs"/>数据对比
              </div>
            </div>
            <div className="info-table-content-box-radar" onMouseEnter={getFooter} onMouseLeave={hiddenFooter}>
              <ReactEchartsCore
                echarts={echarts}
                option={option}
                notMerge
                lazyUpdate
                style={{height: '240px'}}
                theme=""
              />
              {
                footerVisable &&
                <div className="info-table-content-box-footer">
                  <div className="info-table-content-box-footer-left">
                    <span className="info-table-content-box-footer-left-span">项目明细</span>
                  </div>
                  <div className="info-table-content-box-footer-right">
                    <span className="info-table-content-box-footer-left-span">部门详情</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div> : <InfoDetail hiddenDetail={hiddenDetail}/>
      : ''

  );
}
