import React, { Component } from 'react'
import { Row, Col } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';

class DispositionSituation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showExpense: false,
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
            color: ['#5B8FF9', '#F35F5F', '#5D7092'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#aaa',
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
                        color: '#A5A7AF'
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
                        color: '#A5A7AF'
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
                text: '资产构成',
                left: 'center',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 17
                }
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    center: ['40%', '70%'],
                    color: ['#5B8FF9', '#F35F5F', '#5D7092'],
                    data: [
                        { value: 1048, name: '股基' },
                        { value: 735, name: '信用' },
                        { value: 580, name: '期权' },
                    ],
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
                    },

                }

            ],
            legend: {
                orient: 'vertical',
                right: 0,
                top: '45%',
                itemWidth: 10,
                icon: 'circle',
                data: ['股基', '信用', '期权'],
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
                            分布情况
                                    <div onClick={() => { this.toggleContent() }}>
                                {showExpense ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1rem' }} />
                                }
                            </div>

                        </div>}
                    </div>
                </Col>
                {/* <Col span={18} style={{ height: '25rem', borderRight: '2px solid  #F2F2F2', display: showExpense ? 'block' : 'none' }}>
                    <Col span={4} className='ci-item-box' style={{ padding: '4rem 0', height: '25rem' }}>
                        <div className='ci-item-outline' style={{ marginBottom: '4rem' }}>客户数量</div>
                        <div className='ci-item'><span className='ci-item-key'>当期累计：</span>123411</div>
                        <div className='ci-item'><span className='ci-item-key'>当期新增：</span>12123</div>
                        <div className='ci-item'><span className='ci-item-key'>存量客户排名：</span>21 <div style={{ display: 'inline-block', color: '#EC6057' }}> 3&nbsp;</div><div className="go-up-icon"></div></div>
                    </Col>
                    <Col span={20} style={{ height: '100%' }}>
                        <ReactEchartsCore
                            echarts={echarts}
                            style={{ height: "100%", width: "100%" }}
                            option={customersOption}
                            notMerge
                            lazyUpdate
                            theme="theme_name"
                        />
                    </Col>
                </Col>
                <Col span={6} style={{ height: '25rem', display: showExpense ? 'block' : 'none' }}>
                    <Col span={12} className='ci-item-box' style={{ padding: '4rem 0', height: '25rem' }}>
                        <div className='ci-item-outline' style={{ marginBottom: '4rem' }}>资产</div>
                        <div className='ci-item'><span className='ci-item-key'>当期资产：</span>123411亿元</div>
                        <div className='ci-item'><span className='ci-item-key'>当期新增：</span>12123亿元</div>
                        <div className='ci-item'><span className='ci-item-key'>存量客户排名：</span>21 <div style={{ display: 'inline-block', color: '#EC6057' }}> 3&nbsp;</div><div className="go-up-icon"></div></div>
                    </Col>
                    <Col span={12} className='ci-item-box' style={{padding: '4rem 0', height: '21rem'}}>
                        <ReactEchartsCore
                            echarts={echarts}
                            style={{ height: "100%", width: "100%" }}
                            option={assetOption}
                            notMerge
                            lazyUpdate
                            theme="theme_name"
                        />
                    </Col>
                </Col>
                */}
            </Row>

        )
    }
}

export default DispositionSituation;
