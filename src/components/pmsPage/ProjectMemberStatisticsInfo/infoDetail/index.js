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


const {TabPane} = Tabs;

export default function InfoDetail(props) {
  const [footerVisable, setFooterVisable] = useState(false)
  const {hiddenDetail} = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)

  //获取雷达图数据
  const getRadarChat = () => {
    return {
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          {name: 'Sales', max: 6500},
          {name: 'Administration', max: 16000},
          {name: 'Information Technology', max: 30000},
          {name: 'Customer Support', max: 38000},
          {name: 'Development', max: 52000},
          {name: 'Marketing', max: 25000}
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending'
            }
          ]
        }
      ]
    };
  }

  const option = {
    // title: {
    //   text: '基础雷达图'
    // },
    color: ["#3361ff"],
    tooltip: {},
    radar: {
      center: ['50%', '50%'],
      // shape: 'circle',
      radius: 68,
      name: {
        textStyle: {
          color: '#999',
          backgroundColor: '#fff',
          borderRadius: 3,
          padding: [1, 1]
        }
      },
      indicator: [
        {name: '负责项目', max: 25},
        {name: '获奖项目', max: 25},
        {name: '课题项目', max: 25},
        {name: '专班项目', max: 25},
      ]
    },
    series: [{
      name: '预算 vs 开销（Budget vs spending）',
      type: 'radar',
      // areaStyle: {normal: {}},
      data: [
        {
          value: [25, 25, 5, 15],
          name: '童卫'
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

  return (
    <div className="info-table">
      <div className="info-table-detail-title">
        <div className='info-table-detail-title-back' onClick={hiddenDetail}>
          <i className="iconfont icon-left"/> 返回 ｜
        </div>
        <div className='info-table-detail-title-name'>
          项目管理部
        </div>
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
    </div>
  );
}
