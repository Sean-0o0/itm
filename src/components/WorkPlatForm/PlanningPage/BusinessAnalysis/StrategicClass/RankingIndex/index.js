import React, { Component } from 'react'
import { Row, Col,Card } from 'antd';
import echarts from 'echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';

class RankingIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showExpense: true,
            customersOption: {},
            assetOption: {},
        };
    }

    toggleContent = (e) => {
        let { showExpense } = this.state;
        if (showExpense) {
            this.setState({ showExpense: false });
        } else {
            this.setState({ showExpense: true });
        }
    }

    componentWillMount() {
        const data = [
  [
    [864, 1000, 17096869, '客户数', 1990],
    [163, 223.4, 27662440, '客户数', 1990],
    [516, 168, 1154605773, '客户数', 1990],
    [367, 741.7, 10582082, '客户数', 1990],
    [899, 175, 4986705, '客户数', 1990],
    [947, 727.1, 56943299, '客户数', 1990],
    [147, 745.4, 78958237, '客户数', 1990],
    [266, 178.1, 254830, '客户数', 1990],
    [177, 157.7, 870601776, '客户数', 1990],
    [250, 791.1, 122249285, '客户数', 1990],
    [76, 671.9, 20194354, '客户数', 1990],
    [87, 172, 42972254, '客户数', 1990],
    [241, 725.4, 3397534, '客户数', 1990],
    [296, 761.8, 4240375, '客户数', 1990],
    [100, 170.8, 38195258, '客户数', 1990],
    [149, 692.6, 147568552, '客户数', 1990],
    [570, 617.3, 53994605, '客户数', 1990],
    [624, 175.7, 57110117, '客户数', 1990],
    [706, 751.4, 252847810, '客户数', 1990]
  ],
];
        const customersOption = {
            // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [
            //   {
            //     offset: 0,
            //     color: '#f7f8fa'
            //   },
            //   {
            //     offset: 1,
            //     color: '#cdd0d5'
            //   }
            // ]),
            title: {
            //   text: 'Life Expectancy and GDP by Country',
              left: '5%',
              top: '3%'
            },
            // legend: {
            //   right: '10%',
            //   top: '3%',
            //   data: ['1990', '2015']
            // },
            grid: {
              left: '8%',
              top: '10%'
            },
            xAxis: {
              name:'净利润:万元',
              nameLocation:'center',
              nameTextStyle:{
                // align:'left',
                // padding:'1rem'
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              min:0,
              max:1000,
            },
            yAxis: {
              name:'营业收入:万元',
            //   nameLocation:'center',
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              nameTextStyle:{
                align:'left',
                // padding:'1rem'
              },
              min:0,
              max:1000,
            },
            series: [
              {
                name: '1990',
                data: data[0],
                type: 'scatter',
                symbolSize: function (data) {
                  return Math.sqrt(data[2]) / 5e2;
                },
                emphasis: {
                  focus: 'series',
                  label: {
                    show: true,
                    formatter: function (param) {
                      return param.data[3];
                    },
                    position: 'top'
                  }
                },
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(120, 36, 50, 0.5)',
                  shadowOffsetY: 5,
                  color: 'rgba(91, 143, 249, 0.5)'
                }
              },
            //   {
            //     name: '2015',
            //     data: data[1],
            //     type: 'scatter',
            //     symbolSize: function (data) {
            //       return Math.sqrt(data[2]) / 5e2;
            //     },
            //     emphasis: {
            //       focus: 'series',
            //       label: {
            //         show: true,
            //         formatter: function (param) {
            //           return param.data[3];
            //         },
            //         position: 'top'
            //       }
            //     },
            //     itemStyle: {
            //       shadowBlur: 10,
            //       shadowColor: 'rgba(25, 100, 150, 0.5)',
            //       shadowOffsetY: 5,
            //       color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            //         {
            //           offset: 0,
            //           color: 'rgb(129, 227, 238)'
            //         },
            //         {
            //           offset: 1,
            //           color: 'rgb(25, 183, 207)'
            //         }
            //       ])
            //     }
            //   }
            ]
          };
        const assetOption = {
            title: {
              text: ''
            },
            color: ["rgba(91, 143, 249, 1)", "rgba(247, 192, 43, 1)"],
            legend: {
              bottom:1,
              data: ['排名', '较去年底']
            },
            radar: {
              indicator: [
                { name: '监管评级', max: 32 },
                { name: '总体地位', max: 32 },
                { name: '业务', max: 32 },
                { name: '资源', max: 32 },
                { name: '经济效益', max: 32 },
              ]
            },
            series: [
              {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                  {
                    value: [32, 24, 16, 8, 0],
                    name: '排名'
                  },
                  {
                    value: [20, 4, 20, 8, 16],
                    name: '较去年底'
                  }
                ]
              }
            ]
          };
        this.setState({
            customersOption: customersOption,
            assetOption: assetOption
        })
    }
    render() {
        const { customersOption, assetOption, showExpense } = this.state
        return (
            <Row className='ci-index'>
                <Col span={24}>
                    <div className='title'>
                        {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center"}}>
                            排名指标
                                    <div onClick={() => { this.toggleContent() }}>
                                {showExpense ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
                                }
                            </div>

                        </div>}
                    </div>
                </Col>
                <Col span={16} style={{ height: '35rem',padding:'2rem 1rem 2rem 2rem', display: showExpense ? 'block' : 'none' }}>
                  <Card style={{ height: '100%', width: '100%'}}
                        bodyStyle={{ width: '100%', height: '100%', padding: '0.5rem' }}
                        hoverable={true}>
                      <div style={{height:'100%',width: '100%',paddingTop:'1.5rem'}}>
                        <ReactEchartsCore
                          echarts={echarts}
                          style={{ height: "100%", width: "100%" }}
                          option={customersOption}
                          notMerge
                          lazyUpdate
                          theme="theme_name"
                        />
                      </div>
                  </Card>
                </Col>
                <Col span={8} style={{ height: '35rem',padding:'2rem 1rem 2rem 2rem', display: showExpense ? 'block' : 'none' }}>
                  <Card style={{ height: '100%', width: '100%'}}
                        bodyStyle={{ width: '100%', height: '100%', padding: '0.5rem' }}
                        hoverable={true}>
                    <div style={{height:'100%',width: '100%',paddingTop:'1.5rem'}}>
                    <ReactEchartsCore
                      echarts={echarts}
                      style={{ height: "100%", width: "100%" }}
                      option={assetOption}
                      notMerge
                      lazyUpdate
                      theme="theme_name"
                    />
                    </div>
                  </Card>
                </Col>
            </Row>

        )
    }
}

export default RankingIndex;
