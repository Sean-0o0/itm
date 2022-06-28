import React, { Component } from 'react'
import { Row, Col } from "antd";
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/bar';


/*
 * @Author: cyp
 * @Date: 2021年5月20日09:52:23
 * @Description: 经营分析-财务类-营业收入-查看明细页面-结构明细组件
 */
export class BussinessIncomeStructureChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            option: {},
            result1: [],
            mon: '一'
        }
    }

    static getDerivedStateFromProps(nextProps, preState) {
        const { result1 } = nextProps
        if (JSON.stringify(result1) !== JSON.stringify(preState.result1)) {
            let yAxis = [];
            let series = [];

            result1.forEach((item, index) => {
                yAxis.push(item.ORGNAME)
                series.push(item.TOTL_VAL)
            })
            const option = {
                // title: {
                //     text: '6月营收贡献结构图(业务线)',
                // },
                color: '#54A9DF',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                // legend: {
                //     data: ['2011年', '2012年']
                // },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0%',
                    top: '1%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    //boundaryGap: [0, 0.01],
                    axisTick: { show: false },//坐标轴刻度
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        formatter: function (name) {
                            return ` ${name}%`;

                        },
                        // rich: {
                        //     fontSize: 17,
                        //     a: {
                        //         color: '#999',
                        //     }
                        // }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: yAxis,
                    splitLine: { show: false },//坐标轴在 grid 区域中的分隔线
                    axisTick: { show: false },//坐标轴刻度
                    axisLine: { show: false },//坐标轴轴线
                    axisLabel: {
                        formatter: function (name) {
                            return `{a|${name}  }`;
                        },
                        rich: {
                            fontSize: 17,
                            a: {
                                color: '#999',
                            }
                        }
                    }
                },
                series: [
                    {
                        name: '营收结构',
                        type: 'bar',
                        data: series,
                        barGap: '2%',/*多个并排柱子设置柱子之间的间距*/
                        //barWidth : '30',//柱图宽度
                        //barCategoryGap:'0%',/*多个并排柱子设置柱子之间的间距*/
                        label: {
                            show: true,
                            position: 'right',
                            color: 'black',
                            formatter: function (data) {
                                const tempArr = option.series[0].data
                                ////console.log(tempArr, dataIndex,tempArr[ dataIndex],name)
                                return `${tempArr[data.dataIndex]}%`;

                            },
                            // rich: {
                            //     fontSize: 17,
                            //     a: {
                            //         color: '#999',
                            //     }
                            // }
                        },

                    }
                ]

            }
            return {
                option,
                result1
            }
        }
        return null
    }

    componentDidMount() {
        let mon = +new Date().getMonth() - 1
        const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        this.setState({
            mon: months[mon]
        })
    }


    render() {
        const { option, mon } = this.state
        return (
            <div className='ba-body' style={{ margin: '.8rem', backgroundColor: 'white' }}>
                <Row>
                    <Col span={24} style={{ marginBottom: '2rem' }}>
                        <Row type='flex' justify='center'>
                            <span style={{ fontSize: '24px', fontWeight: '700', marginTop: '1rem', marginBottom: '1rem' }}>{mon}月营收贡献结构图（业务线）</span>
                        </Row>
                        <ReactEchartsCore
                            echarts={echarts}
                            style={{ height: "31rem", width: "100%" }}
                            option={option}
                            notMerge
                            lazyUpdate
                            theme="theme_name"
                        />
                    </Col>
                </Row>
            </div >
        )
    }
}

export default BussinessIncomeStructureChart
