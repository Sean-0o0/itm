import React, { Component } from 'react'
import { Row, Col, Card, Progress, Divider } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';

class CompetitiveIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {},
            showExpense: true
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
        let option = {
            title: {
                text: '近几年排名变化',
                left: '4%',
                top: '4%',
                textStyle: {
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 17
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                right:10,
                textStyle: {
                    color: '#aaa',
                    fontWeight: 'normal',
                    fontSize: 14
                },
                padding: 15,
                itemGap: 40,
                icon: 'circle',
                data: [
                    {
                        name: '营业收入',
                        itemStyle: {
                            color: '#E51339',
                        }
                    },
                    {
                        name: '净利润',
                        itemStyle: {
                            color: '#C79156'
                        }
                    }
                ]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                min: 0,
                data: ['2017', '2018', '2019', '2020', '2021'],
                offset: 10,
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize: 16
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#A5A7AF'
                    }
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize: 16
                }

            },
            series: [
                {
                    name: '营业收入',
                    type: 'line',
                    data: [12, 13, 10, 13, 9, 23],
                    itemStyle: {
                        color: '#E51339'
                    },
                    lineStyle: {
                        color: '#E51339'
                    }
                },
                {
                    name: '净利润',
                    type: 'line',
                    data: [15, 23, 20, 15, 19, 33],
                    lineStyle: {
                        color: '#C79156'
                    },
                    itemStyle: {
                        color: '#C79156',
                        fontSize: 17,
                    }
                }
            ]
        };
        this.setState({
            option,
        })
    }
    render() {
        const { option, showExpense } = this.state
        return (
            <Row className='ci-index'>
                <Col span={24}>
                    <div className='title'>
                        {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center" }}>
                            竞争力指标
                            <div onClick={() => { this.toggleContent() }}>
                                {showExpense ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
                                }
                            </div>

                        </div>}
                    </div>
                </Col>
                <Col span={8} style={{ height: '30rem', display: showExpense ? 'flex' : 'none' }}>
                    <Col span={24} className='ci-item-box' style={{ height: '100%', padding: '2rem' }}>
                        <Card style={{ height: '100%', width: '100%', }}
                            bodyStyle={{ width: '100%', height: '100%', padding: '2rem 1rem 1rem 2rem' }}
                            hoverable={true}>
                            <div style={{ display: 'inline', textAlign: 'left', height: '16.667%', width: '100%', fontSize: '1.61rem', fontWeight: 500, lineHeight: '2rem', whiteSpace: 'normal', color: '#666666' }}>
                                营业收入
                            </div>
                            <div style={{ padding: '1rem 0', display: 'inline-flex', whiteSpace: 'nowrap', flex: '1', height: '16.667%', width: '100%' }}>
                                <div style={{ textAlign: 'left', display: 'inline-block', width: '20%', fontSize: '1.25rem', fontWeight: 500, lineHeight: '2rem', whiteSpace: 'normal', color: '#666666' }}>
                                    本年累计
                                </div>
                                <div style={{ display: 'grid', width: '60%', height: '1.5rem' }}>
                                    <Progress format={0} strokeColor='linear-gradient(90deg, #5CBAF6 0%, #3796D2 100%)'
                                        percent={12} showInfo={false} size='small'
                                        style={{ height: '1.5rem', display: 'inline-block' }} />
                                    <span style={{ fontSize: '1rem', display: 'flex' }}><span style={{ textAlign: 'left', width: '100%', color: '#999999' }}>0</span><span style={{ textAlign: 'right', color: '#999999' }}>期望:</span></span>
                                </div>
                                <div style={{ display: 'grid', width: '20%', textAlign: 'left', color: '#333333', fontSize: '1.43rem', fontWeight: 500, lineHeight: '2.4rem' }}>
                                    &nbsp;&nbsp;189万
                                </div>
                            </div>
                            <div style={{ paddingTop: '1rem', display: 'inline-block', width: '100%', height: '16.667%', textAlign: 'left', fontSize: '1.25rem', fontWeight: 400, lineHeight: '1.7rem' }}>
                                {/*<div className="month-data" style={{ fontSize: '1.2rem' }} >{data.INDI_VAL}/{data.MONBREAK_GOAL}</div>*/}
                                <span style={{ display: 'inline-block', color: '#999999' }}>份额：<span style={{ color: '#333333' }}>12%&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                                <span className='rank' style={{ fontSize: '1.07rem', color: '#999999' }}>排名：
                                    <span>21&nbsp;</span>
                                    {/* 排名图标由MONRANK_CHANGE控制 */}
                                    <div className='go-up-icon' />
                                    {/*{Number(data.MONRANK) < 0 && <div className='go-down-icon' />}*/}
                                    {3 !== '-' &&
                                        <span className={false ? 'down-color-green' : 'up-color-red'} style={{ color: '#333333' }}>3</span>}
                                </span>
                            </div>
                            <div style={{ padding: '1rem 0' }}><Divider style={{ margin: '0' }}></Divider></div>
                            <div style={{ display: 'inline', textAlign: 'left', height: '16.667%', width: '100%', fontSize: '1.61rem', fontWeight: 500, lineHeight: '2rem', whiteSpace: 'normal', color: '#666666' }}>
                                营业收入
                            </div>
                            <div style={{ padding: '1rem 0', display: 'inline-flex', whiteSpace: 'nowrap', flex: '1', height: '16.667%', width: '100%' }}>
                                <div style={{ textAlign: 'left', display: 'inline-block', width: '20%', fontSize: '1.25rem', fontWeight: 500, lineHeight: '2rem', whiteSpace: 'normal', color: '#666666' }}>
                                    本年累计
                                </div>
                                <div style={{ display: 'grid', width: '60%', height: '1.5rem' }}>
                                    <Progress format={0} strokeColor='linear-gradient(90deg, #5CBAF6 0%, #3796D2 100%)'
                                        percent={12} showInfo={false} size='small'
                                        style={{ height: '1.5rem', display: 'inline-block' }} />
                                    <span style={{ fontSize: '1rem', display: 'flex' }}><span style={{ textAlign: 'left', width: '100%', color: '#999999' }}>0</span><span style={{ textAlign: 'right', color: '#999999' }}>期望:</span></span>
                                </div>
                                <div style={{ display: 'grid', width: '20%', textAlign: 'left', color: '#333333', fontSize: '1.43rem', fontWeight: 500, lineHeight: '2.4rem' }}>
                                    &nbsp;&nbsp;189万
                                </div>
                            </div>
                            <div style={{ paddingTop: '1rem', display: 'inline-block', width: '100%', height: '16.667%', textAlign: 'left', fontSize: '1.25rem', fontWeight: 400, lineHeight: '1.7rem' }}>
                                {/*<div className="month-data" style={{ fontSize: '1.2rem' }} >{data.INDI_VAL}/{data.MONBREAK_GOAL}</div>*/}
                                <span style={{ display: 'inline-block', color: '#999999' }}>份额：<span style={{ color: '#333333' }}>12%&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
                                <span className='rank' style={{ fontSize: '1.07rem', color: '#999999' }}>排名：
                                    <span>21&nbsp;</span>
                                    {/* 排名图标由MONRANK_CHANGE控制 */}
                                    <div className='go-up-icon' />
                                    {/*{Number(data.MONRANK) < 0 && <div className='go-down-icon' />}*/}
                                    {3 !== '-' &&
                                        <span className={false ? 'down-color-green' : 'up-color-red'} style={{ color: '#333333' }}>3</span>}
                                </span>
                            </div>
                        </Card>
                    </Col>
                </Col>
                <Col span={8} style={{ display: showExpense ? 'block' : 'none', height: '30rem' }}>
                    <div style={{ padding: '2rem 1rem 2rem 2rem', height: '100%' }}>
                        <Card style={{ height: '100%' }} bodyStyle={{ height: '100%', padding: '0.5rem' }} hoverable={true}>
                            <ReactEchartsCore
                                echarts={echarts}
                                style={{ height: "100%", width: "100%" }}
                                option={option}
                                notMerge
                                lazyUpdate
                                theme="theme_name"
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={8} style={{ height: '30rem' }}>
                    <Row span={12} style={{ display: showExpense ? 'block' : 'none', height: '15rem' }}>
                        <div style={{ padding: '2rem 1rem 0.5rem 2rem', height: '100%' }}>
                            <Card style={{ height: '100%', textAlign: 'center' }} bodyStyle={{ height: '100%', padding: '0.5rem', display: 'flex' }} hoverable={true}>
                                <div style={{
                                    width: '50%', textAlign: 'start', paddingTop: '9%',paddingLeft: '15%', fontSize: '1.4rem',
                                    fontWeight: '400',
                                    color: '#666666',
                                    lineHeight: '2rem',
                                }}>
                                    综合评分
                                    <div style={{
                                        fontSize: '2.4rem',
                                        fontWeight: 'normal',
                                        color: '#333333',
                                        lineHeight: '2.8rem',
                                    }}>
                                        1093.21
                                    </div>
                                </div>
                                <Progress style={{ width: '50%', }} type="circle" percent={12.5} strokeWidth='8' strokeColor='rgba(115, 160, 250, 1)' width={100} format={() => <div style={{
                                    fontSize: '1.4rem',
                                    fontWeight: '400',
                                    color: '#666666',
                                    lineHeight: '2rem',
                                }}>业务达成<div style={{
                                    fontSize: '2.4rem',
                                    fontWeight: 'normal',
                                    color: '#333333',
                                    lineHeight: '2.8rem',
                                }}>1/7</div></div>} />
                            </Card>
                        </div>
                    </Row>
                    <Row span={12} style={{ padding: '0 0 1rem 0', height: '15rem' }}>
                        <Col span={12} style={{ height: '100%' }}>
                            <div style={{ padding: '0.5rem 0.5rem 1rem 2rem', height: '100%' }}>
                                <Card style={{ height: '100%', textAlign: 'center' }} bodyStyle={{ height: '100%', padding: '0.5rem' }} hoverable={true}>
                                    <Progress type="circle" percent={12.5} strokeWidth='8' strokeColor='rgba(115, 160, 250, 1)' width={100} format={() => <div style={{
                                        fontSize: '1.4rem',
                                        fontWeight: '400',
                                        color: '#666666',
                                        lineHeight: '2rem',
                                    }}>融资计划<div style={{
                                        fontSize: '2.4rem',
                                        fontWeight: 'normal',
                                        color: '#333333',
                                        lineHeight: '2.8rem',
                                    }}>12.5%</div></div>} />
                                </Card>
                            </div>
                        </Col>
                        <Col span={12} style={{ height: '100%' }}>
                            <div style={{ padding: '0.5rem 1rem 1rem 0.5rem', height: '100%' }}>
                                <Card style={{ height: '100%', textAlign: 'center' }} bodyStyle={{ height: '100%', padding: '0.5rem' }} hoverable={true}>
                                    <Progress type="circle" percent={100} strokeWidth='8' strokeColor='rgba(115, 160, 250, 1)' width={100} format={() => <div style={{
                                        fontSize: '1.4rem',
                                        fontWeight: '400',
                                        color: '#666666',
                                        lineHeight: '2rem',
                                    }}>投资计划<div style={{
                                        fontSize: '2.4rem',
                                        fontWeight: 'normal',
                                        color: '#333333',
                                        lineHeight: '2.8rem',
                                    }}>100%</div></div>} />
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row >

        )
    }
}

export default CompetitiveIndex;
