import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { Card } from "antd";
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';

import downSrc from "../../../../../../src/assets/go-down.svg";

export class RightEchartData extends Component {

  constructor(props) {
    super(props)

    this.state = {
      option: {},
      data: [],
      echartData: [],
    }
  }

  componentDidMount() {
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (JSON.stringify(nextProps.echartData) !== JSON.stringify(preState.echartData)) {
      const temData = []
      let total = 0
      total = Number(nextProps.echartData?.planNum);
      temData[0] = {
        id: 1,
        name: "实际情况",
        value: nextProps.echartData?.nowNum?nextProps.echartData?.nowNum:'--',
      }
      temData[1] = {
        id: 2,
        name: "拟配置情况",
        value: nextProps.echartData?.addNum?nextProps.echartData?.addNum:'--',
      }
      // temData[2] = {
      //   id: 3,
      //   name: "计划情况",
      //   value: nextProps.echartData?.planNum?nextProps.echartData?.planNum:'--',
      // }
      const option = {
        tooltip: {
          trigger: 'item'
        },
        color: ['rgba(115, 160, 250, 1)', 'rgba(247, 192, 43, 1)', 'rgba(84, 169, 223, 0.1)',],
        series: [
          {
            //name: '访问来源',
            type: 'pie',
            radius: '70%',
            center: [`22%`, `50%`],//height /2.667=多的行数 每行对应2%
            data: temData,
            itemStyle: {
              // borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        legend: {
          //type: 'scroll',
          orient: 'vertical',
          right: '1',
          top: `30%`,
          itemWidth: 13,
          icon: 'circle',
          //formatter: '{name}',
          data: temData,
          formatter: function (name) {
            // 获取legend显示内容
            let optionValueArray = option.series[0].data
            let rate = 0
            let num = 0
            optionValueArray.forEach((item) => {
              if (item.name === name) {
                // console.log("item.value",item.value)
                rate = item.value !== '--'?(item.value / total) * 100 + '':'--'
                rate = item.value!== '--'?rate.slice(0, 5):'--'
                num = item.value
              }
            })
            return `{a|${name} |} {b| ${num}/${rate}%}`;
            //return <span style={{ color: '#000' }}>{name} | <span style={{ color: '#333' }}></span>100/{rate}%</span>;
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 13,
                color: '#999',
              },
              b: {
                fontSize: 13,
                color: '#333',
              },
              c: {
                backgroundColor: {
                  image: downSrc
                }
              }
            },
          }
        }

      }
      return {
        option
      }
    }
    return null
  }

  render() {
    const { option = {}, } = this.state
    return (
      <div style={{padding: '0.5rem 0',height: '100%'}}>
          <ReactEchartsCore
            echarts={echarts}
            style={{ height: `17rem`, width: "100%" }}
            option={option}
            notMerge
            lazyUpdate
            theme="theme_name"
          />
      </div>
    )
  }
}

export default RightEchartData
