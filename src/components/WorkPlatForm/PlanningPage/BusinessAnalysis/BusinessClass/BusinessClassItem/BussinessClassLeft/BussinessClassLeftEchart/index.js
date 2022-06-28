import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { Card } from "antd";
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';

import downSrc from "../../../../../../../../../src/assets/go-down.svg";
import upSrc from "../../../../../../../../../src/assets/go-up.svg";

export class BussinessClassLeftEchart extends Component {

    constructor(props) {
        super(props)

        this.state = {
            option: {},
            data: [],
            echartData: [],
        }
    }

    componentDidMount() {
        const option = {
            tooltip: {
                trigger: 'item'
            },
            color: ['#83D0EF', '#A285D2', '#46A9A8', '#FFAB67', '#C7D9FD',
                '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#6DC8EC', '#E8684A', '#FFA8CC',
            ],
            series: [
                {
                    //name: '访问来源',
                    type: 'pie',
                    radius: '40%',
                    center: ['25%', '40%'],
                    data: [
                        { value: 20, name: '财富管理', },
                        { value: 30, name: '机构业务', },
                        { value: 25, name: '信用业务', },
                        { value: 5, name: '衍生品经纪', },
                        { value: 20, name: '网点(分支)', },
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
                    }
                }
            ],
            legend: {
                //type: 'scroll',
                orient: 'vertical',
                right: '30',
                top: '20%',
                itemWidth: 13,
                icon: 'circle',
                //formatter: '{name}',
                data: [{ name: '财富管理', }, { name: '机构业务', },
                { name: '信用业务', }, { name: '衍生品经纪', },
                { name: '网点(分支)', }],
                formatter: function (name) {
                    // 获取legend显示内容
                    let optionValueArray = option.series[0].data
                    let rate = 0
                    optionValueArray.forEach((item) => {
                        if (item.name === name) {
                            rate = item.value
                        }
                    })
                    return `{a|${name} |} {b| 100/${rate}%}`;
                    //return <span style={{ color: '#000' }}>{name} | <span style={{ color: '#333' }}></span>100/{rate}%</span>;
                },
                textStyle: {
                    fontSize: 17,
                    rich: {
                        a: {
                            color: '#999',
                        },
                        b: {
                            color: '#333',
                        },
                        c: {
                            backgroundColor: {
                                image: downSrc
                                // 这里可以是图片的 URL，
                                // 或者图片的 dataURI，
                                // 或者 HTMLImageElement 对象，
                                // 或者 HTMLCanvasElement 对象。
                            }
                        }
                    },
                }
            }


        }
        this.setState({
            // option
        })
    }
    static getDerivedStateFromProps(nextProps, preState) {
        if (nextProps.echartData.length > 0 && JSON.stringify(nextProps.echartData) !== JSON.stringify(preState.echartData)) {
            const temData = []
            let total = 0
            nextProps.echartData.forEach((element, index) => {
                //{CLASSID: "48", CLASSNAME: "信用业务", TOTLVAL: "1.2"}
                temData[index] = {
                    id: element.CLASSID,
                    name: element.CLASSNAME,
                    value: element.TOTLVAL,
                }
                total += 1 * element.TOTLVAL
            });
            const option = {
                tooltip: {
                    trigger: 'item'
                },
                color: ['#83D0EF', '#A285D2', '#46A9A8', '#FFAB67', '#C7D9FD',
                    '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#6DC8EC', '#E8684A', '#FFA8CC',
                ],
                series: [
                    {
                        //name: '访问来源',
                        type: 'pie',
                        radius: '40%',
                        center: [`25%`, `${40 + (nextProps.height === 0 ? 0 : (nextProps.height / 2.667)) * 2}%`],//height /2.667=多的行数 每行对应2%
                        data: temData
                        // [
                        //     { value: 20, name: '财富管理', },
                        //     { value: 30, name: '机构业务', },
                        //     { value: 25, name: '信用业务', },
                        //     { value: 5, name: '衍生品经纪', },
                        //     { value: 20, name: '网点(分支)', },
                        // ]
                        ,
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
                    right: '30',
                    top: `${25 + (nextProps.height === 0 ? 0 : (nextProps.height / 2.667)) * 2}%`,
                    itemWidth: 13,
                    icon: 'circle',
                    //formatter: '{name}',
                    data: temData,

                    // [{ name: '财富管理', }, { name: '机构业务', },
                    // { name: '信用业务', }, { name: '衍生品经纪', },
                    // { name: '网点(分支)', }],
                    formatter: function (name) {
                        // 获取legend显示内容
                        let optionValueArray = option.series[0].data
                        let rate = 0
                        let num = 0
                        optionValueArray.forEach((item) => {
                            if (item.name === name) {
                                rate = (item.value / total) * 100 + ''
                                rate = rate.slice(0, 5)
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
                                    // 这里可以是图片的 URL，
                                    // 或者图片的 dataURI，
                                    // 或者 HTMLImageElement 对象，
                                    // 或者 HTMLCanvasElement 对象。
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
        const { height = 0 } = this.props
        return (
          <div style={{padding: '1rem 1rem 1rem 2rem',height: '100%'}}>
          <Card style={{height: '100%'}} bodyStyle={{height: '100%',padding: '0'}} hoverable={true}>
          <ReactEchartsCore
                    echarts={echarts}
                    style={{ height: `${30.5 + height}rem`, width: "100%" }}
                    option={option}
                    notMerge
                    lazyUpdate
                    theme="theme_name"
                />
            </Card>
          </div>
        )
    }
}

export default BussinessClassLeftEchart
