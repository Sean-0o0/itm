import React, { Component } from 'react'
import { Row, Col,Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';

class CustomerSituation extends Component {
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
        const customersOption = {
            color: ['#6294F9', '#F6C02B', '#75CAED'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#aaa',
                    fontSize:14
                },
                padding: [10, 10],
                icon: 'circle',
                left: '4%',
                data: ['信用账户', '证券经纪资金账户', '合计'],
                itemGap: 40
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['2017', '2018', '2019', '2020', '2021'],
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#A5A7AF',
                        fontSize: 16
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#A5A7AF',
                        fontSize:16
                    }
                }
            ],
            series: [
                {
                    name: '信用账户',
                    type: 'bar',
                    barWidth: '20%',
                    data: [2.0, 4.9, 7.0, 23.2, 25.6],
                },
                {
                    name: '证券经纪资金账户',
                    type: 'bar',
                    barWidth: '20%',
                    data: [2.6, 5.9, 9.0, 26.4, 28.7],
                },
                {
                    name: '合计',
                    type: 'bar',
                    barWidth: '20%',
                    barGap: '10%',
                    data: [4.6, 10.9, 18.0, 51.4, 56.7],
                }
            ]
        };
        const assetOption = {
            title: {
                // text: '图：资产构成',
                left: 'center',
                bottom: '13%',
                textStyle: {
                    color: '#A5A7AF',
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    center: ['45%', '40%'],
                    color: ['#6294F9', '#F6C02B', '#75CAED'],
                    data: [
                        { value: 1048, name: '股基' },
                        { value: 735, name: '信用' },
                        { value: 580, name: '期权' },
                    ],
                    itemStyle: {
                        // borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 1,
                    },
                    label: {
                        show: false,
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
                    },

                }

            ],
            legend: {
                orient: 'vertical',
                right: '15',
                top: '25%',
                itemWidth: 10,
                icon: 'circle',
                data: ['股基', '信用', '期权'],
                textStyle: {
                  fontSize: 14
              },
            }
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
                            客户情况
                                    <div onClick={() => { this.toggleContent() }}>
                                {showExpense ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
                                }
                            </div>

                        </div>}
                    </div>
                </Col>
                <Col span={12} style={{ height: '45rem',padding:'2rem 1rem 2rem 2rem', display: showExpense ? 'block' : 'none' }}>
                  <Card style={{ height: '100%', width: '100%'}}
                        bodyStyle={{ width: '100%', height: '100%', padding: '0.5rem' }}
                        hoverable={true}>
                      <div style={{height:'30%',width: '100%'}} className='ci-item-box'>
                        <div className='ci-item-outline'>客户数量</div>
                          <Col span={24} style={{display:'flex',paddingLeft:'2rem'}}>
                            <div className='ci-item' style={{display:'inline-grid',padding:'0 12rem 0 0'}}><span className='ci-item-key' style={{padding:'0 0 1rem 0'}}>当期累计：</span>123411</div>
                            <div className='ci-item' style={{display:'inline-grid',padding:'0 12rem 0 0'}}><span className='ci-item-key' style={{padding:'0 0 1rem 0'}}>当期新增：</span>12123</div>
                            <div className='ci-item' style={{display:'inline-grid'}}><span className='ci-item-key' style={{padding:'0 0 1rem 0'}}>存量客户排名：</span><div>21&nbsp;&nbsp; <div style={{ display: 'inline-block', color: '#EC6057' }}> 3&nbsp;</div><div className="go-up-icon"></div></div></div>
                          </Col>
                      </div>
                      <div style={{height:'70%',width: '100%',paddingTop:'1.5rem'}}>
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
                <Col span={12} style={{ height: '45rem',padding:'2rem 1rem 2rem 2rem', display: showExpense ? 'block' : 'none' }}>
                  <Card style={{ height: '100%', width: '100%'}}
                        bodyStyle={{ width: '100%', height: '100%', padding: '0.5rem' }}
                        hoverable={true}>
                    <div style={{height:'30%',width: '100%'}} className='ci-item-box'>
                      <div className='ci-item-outline'>资产</div>
                      <Col span={24} style={{display:'flex',paddingLeft:'2rem'}}>
                        <div className='ci-item' style={{display:'inline-grid',padding:'0 12rem 0 0'}}><span className='ci-item-key' style={{padding:'0 0 1rem 0'}}>当期资产：</span>123411</div>
                        <div className='ci-item' style={{display:'inline-grid',padding:'0 12rem 0 0'}}><span className='ci-item-key' style={{padding:'0 0 1rem 0'}}>当期新增：</span>12123</div>
                        <div className='ci-item' style={{display:'inline-grid'}}><span className='ci-item-key' style={{padding:'0 0 1rem 0'}}>存量客户排名：</span><div>21&nbsp;&nbsp; <div style={{ display: 'inline-block', color: '#EC6057' }}> 3&nbsp;</div><div className="go-up-icon"></div></div></div>
                      </Col>
                    </div>
                    <div style={{height:'70%',width: '100%',paddingTop:'1.5rem'}}>
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

export default CustomerSituation;
