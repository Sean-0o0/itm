import React, { Component } from 'react';

import { Row, Col,Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';

import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie';

class CostAndExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showExpense: true,
        };
    }

    toggleContent = (e) => {
        let { changeExpenseArray, showExpense } = this.props;
        changeExpenseArray(2, !showExpense)
    }

    componentWillMount() {
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '20%',
                left: 'center',
                orient: 'vertical',
                icon: 'circle',
                itemWidth: 15,
                itemHeight: 15,
                formatter: function (name) {
                    // 获取legend显示内容
                    let data = option.series[0].data;
                    let tarValue = 0;
                    for (let i = 0, l = data.length; i < l; i++) {
                        if (data[i].name === name) {
                            tarValue = parseInt(data[i].value);
                        }
                    }
                    //const valLength = name.length;//X轴类目项的文字个数
                    return `{a|${name} |} ${tarValue}亿元`;
                },
                textStyle: {
                    fontSize: 15,
                    rich: {
                        a: {
                            color: '#999999',
                        },
                    }
                }
            },
            series: [
                {
                    type: 'pie',
                    radius: ['30%', '40%'],
                    center: ['50%', '25%'],
                    color: ['#73A0FA', '#f5d472'],
                    avoidLabelOverlap: false,
                    cursor: 'pointer',
                    itemStyle: {
                        // borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '15',
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: '本部资产' },
                        { value: 735, name: '非本部资产' },
                    ]
                }
            ]
        };
        let netOption = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '20%',
                left: 'center',
                orient: 'vertical',
                icon: 'circle',
                itemWidth: 15,
                itemHeight: 15,
                formatter: function (name) {
                    // 获取legend显示内容
                    let data = netOption.series[0].data;
                    let tarValue = 0;
                    for (let i = 0, l = data.length; i < l; i++) {
                        if (data[i].name === name) {
                            tarValue = parseInt(data[i].value);
                        }
                    }
                    //const valLength = name.length;//X轴类目项的文字个数
                    return `{a|${name} |} ${tarValue}亿元`;
                },
                textStyle: {
                    fontSize: 15,
                    rich: {
                        a: {
                            color: '#999999',
                        },
                    }
                }
            },
            series: [
                {
                    type: 'pie',
                    radius: ['30%', '40%'],
                    center: ['50%', '25%'],
                    color: ['#73A0FA', '#f5d472'],
                    avoidLabelOverlap: false,
                    cursor: 'pointer',
                    itemStyle: {
                        // borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 1
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '15',
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 2665, name: '本部资产' },
                        { value: 652, name: '非本部资产' },
                    ]
                }
            ]
        };
        let lineOption = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#aaa',
                    fontWeight: 'normal',
                    fontSize: 14
                },
                padding: [10, 10],
                itemGap: 40,
                icon: 'circle',
                data: [
                    {
                        name: '总资产',
                        itemStyle: {
                            color: '#E51339'
                        }
                    },
                    {
                        name: '净资产',
                        itemStyle: {
                            color: '#D3AA7D'
                        }
                    }
                ]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            // toolbox: {
            //     feature: {
            //         saveAsImage: {}
            //     }
            // },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                min: 0,
                data: ['201901', '201902', '201903', '201904', '201905', '201906'],
                offset: 10,
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize: 15,
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
                name:'单位:（万元）',
                nameTextStyle:{
                  padding:[0, 0, 0, 6],
                  fontSize:14,
                  color: '#A5A7AF',
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize: 15,
                }

            },
            series: [
                {
                    name: '总资产',
                    type: 'line',

                    data: [220, 182, 191, 234, 290, 330],
                    itemStyle: {
                        color: '#E51339'
                    },
                    lineStyle: {
                        color: '#E51339'
                    }
                },
                {
                    name: '净资产',
                    type: 'line',
                    data: [120, 132, 101, 134, 90, 230],
                    itemStyle: {
                        color: '#D3AA7D'
                    },
                    lineStyle: {
                        color: '#D3AA7D'
                    }
                },
            ]
        };
        this.setState({
            option,
            netOption,
            lineOption
        })
    }

    render() {
        const { showExpense } = this.props
        const { option, netOption, lineOption } = this.state
        return (
            <Row className='cost-expense'>
                <Col span={24}>
                    <div className='basic-index-outline title'>
                        {<div className='dp-table-title' style={{ display: 'flex', alignItems: "center"}}>
                            成本费用
                                <div onClick={() => { this.toggleContent() }}>
                                {showExpense ?
                                    <i className="iconfont iconfont icon-down-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} /> :
                                    <i className="iconfont icon-right-solid-arrow" style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
                                }
                            </div>

                        </div>}
                    </div>
                </Col>
                <Col span={12} className='toggleCont' style={{height: '31.75rem',display: showExpense ? 'block' : 'none' }}>
                    <Row style={{ height: '100%' }}>
                        <Col span={12} style={{ height: '100%' }}>
                            <div className="block-content" style={{ height: '100%',padding: '2rem 1rem 1rem 2rem'}}>
                              <Card bodyStyle={{width:'100%',height:'100%',padding:'2rem'}} hoverable={true} className="grad-content3">
                              <span className="unit" style={{fontSize: '1.2rem'}}>总资产（亿元）</span>
                                <span className="data">- -</span>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    style={{ height: "22.416667rem", width: "100%" }}
                                    option={option}
                                    notMerge
                                    lazyUpdate
                                    theme="theme_name"
                                />
                              </Card>
                            </div>
                        </Col>
                        <Col span={12} style={{ height: '100%' }}>
                            <div className="block-content" style={{ height: '100%',padding: '2rem 1rem 1rem 2rem'}}>
                              <Card bodyStyle={{width:'100%',height:'100%',padding:'2rem'}} hoverable={true} className="grad-content3">
                                <span className="unit" style={{fontSize: '1.2rem'}}>净资产（亿元）</span>
                                <span className="data">- -</span>
                                <ReactEchartsCore
                                    echarts={echarts}
                                    style={{ height: "22.416667rem", width: "100%" }}
                                    option={netOption}
                                    notMerge
                                    lazyUpdate
                                    theme="theme_name"
                                />
                              </Card>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={12} className='toggleCont' style={{ height: '31.75rem',display: showExpense ? 'block' : 'none' }}>
                  <div className='coreIndex2'>
                      <Card style={{height: '100%'}} bodyStyle={{height: '28rem',padding: '0.5rem'}} hoverable={true}>
                        <ReactEchartsCore
                            echarts={echarts}
                            style={{marginLeft: '1rem',height: "26.5rem", width: "100%" }}
                            option={lineOption}
                            notMerge
                            lazyUpdate
                            theme="theme_name"
                        />
                      </Card>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default CostAndExpense;
