import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';

import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';
import { Card, Col, Row, Skeleton } from 'antd';

import { BussinessClassRightTable } from "./BussinessClassRightTable";
import { result } from 'lodash-es';
export class BussinessClassRight extends Component {

    constructor(props) {
        super(props)

        this.state = {
            option: {},
            result: {},//总的数据
            result3: {},
            orderResultObj: {},//排序集合的result3
            colors: ['#83D0EF', '#A285D2', '#46A9A8', '#FFAB67', '#C7D9FD',
                '#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#6DC8EC', '#E8684A', '#FFA8CC',
            ],
            tableData: [],//table页面数据
            series: [],//存放图表数组的
        }
    }

    componentDidMount() {
    }

    static getDerivedStateFromProps(nextProp, preState) {
        const { colors } = preState
        if (nextProp.result && JSON.stringify(nextProp.result) !== JSON.stringify(preState.result)) {
            let series = []
            let tableData = []

            //对result3进行排序 排序是为了echart颜色于table颜色一致
            let orderResultObj = {}
            nextProp.result.result3.length > 0 && nextProp.result.result3.forEach((item, index) => {
                if (Object.keys(orderResultObj).indexOf(item.ORGNAME) !== -1) {
                    orderResultObj[item.ORGNAME] = orderResultObj[item.ORGNAME].concat([item])
                } else {
                    orderResultObj[item.ORGNAME] = [item]
                }
                //CLASSNAME: "手续费"
                // ISRUNIN: "0"
                // ORGID: "41"
                // ORGNAME: "传统经纪"
            })
            let result3 = []
            if (Object.keys(orderResultObj).length > 0) {
                for (let item in orderResultObj) {
                    result3 = result3.concat(orderResultObj[item])
                }
            }

            result3.length > 0 && result3.forEach((item, index) => {
                let datas = []
                Object.keys(item).forEach((key, num) => {
                    //key值为1~12的时候 取出对应的坐标值:202105,202106...
                    if (Number(key)) {
                        datas[num] = +item[key]
                    }
                })
                //将数据存放到
                tableData[index] = datas
                series[index] = {
                    name: item.CLASSNAME,
                    type: 'line',
                    data: datas,
                    itemStyle: {
                        color: colors[index]
                    },
                    lineStyle: {
                        color: colors[index]
                    }
                }
            })
            //更新state
            if (series.length > 0) return {
                option: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '18%',
                        right: '6%',
                        bottom: nextProp.type === 3 ? '1.1%' : '-3.1%',
                        top: '17%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: nextProp.monData.length > 0 ? nextProp.monData.split(',') : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '00'],
                        show: nextProp.type !== 3 ? false : true,
                        axisLabel: {
                            color: '#333',
                            fontSize: 17

                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#A5A7AF',
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        // show: true
                    },
                    yAxis: {
                        type: 'value',
                        name: "亿元",
                        nameTextStyle :{
                          fontSize: 14,
                          color: '#A5A7AF',
                        },
                        // interval: 50, // 步长
                        // min: 0, // 起始
                        // max: 350, // 终止
                        //data: ['', 50, 100, 150, 200, 250 ],
                        axisLine: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            color: '#A5A7AF',
                            formatter: function (value, index) {
                                return `{a|${value}}`
                            },
                            rich: {
                                a: {
                                    fontSize: 13,
                                    // 让年度信息更醒目
                                    color: '#A5A7AF',
                                    // fontWeight: 'bold',
                                },

                            }
                        },
                    },
                    series
                },
                result: nextProp.result,
                tableData,
                result3,
                orderResultObj,
                series
            }
            return null
        }
        return null
    }

    // orderResult = (result3) => {
    //     let orderResultObj = {}
    //     result3.length > 0 && result3.forEach((item, index) => {
    //         if (Object.keys(orderResultObj).indexOf(item.ORGNAME) !== -1) {
    //             orderResultObj[item.ORGNAME] = orderResultObj[item.ORGNAME].concat([item])
    //         } else {
    //             orderResultObj[item.ORGNAME] = [item]
    //         }
    //         //CLASSNAME: "手续费"
    //         // ISRUNIN: "0"
    //         // ORGID: "41"
    //         // ORGNAME: "传统经纪"
    //     })
    //     return orderResultObj;
    // }

    // orderArray = (orderResultObj) => {
    //     //排序result3
    //     orderResult3 = [];
    //     if (Object.keys(orderResultObj).length > 0) {
    //         for (let item in orderResultObj) {
    //             orderResult3 = orderResult3.concat(orderResultObj[item])
    //         }
    //     }
    // }

    render() {
        const { option, tableData, result3, orderResultObj, series } = this.state
        const { brokerArray, type, monData } = this.props
        let height = 0
        if (type === 3) {
            height = '20.25rem'
        } else {
            height = 38.75 + (result3.length - 5) * 2.667 + 'rem'
        }
        // let xAxis
        // if (option && option.xAxis) {
        //     xAxis = option.xAxis.data
        // }
        return (

            <Col span={24}>
              <div style={{padding: '2rem 1rem 2rem 2rem'}}>
              <Card style={{height: '100%'}} bodyStyle={{height: '100%',padding: '0.5rem'}} hoverable={true}>
              <Row style={{ zIndex: 3 }}>
                    <Col span={24}>
                        {/* <Skeleton loading={loading} active> */}
                        <ReactEchartsCore
                            echarts={echarts}
                            style={{ height: type === 3 ? '18.08rem' : '20rem', width: '100%'}}
                            option={option}
                            notMerge
                            lazyUpdate
                            theme="theme_name"
                        />
                        {/* </Skeleton> */}
                    </Col>
                </Row>
                {type !== 3 && <Row>
                    <Col span={24} >
                        {tableData.length !== 0 && <BussinessClassRightTable orderResultObj={orderResultObj}
                            tableData={tableData} result3={result3} brokerArray={brokerArray}
                            monData={monData} series={series} />}
                    </Col>
                </Row>}
              </Card>
              </div>
            </Col>

        )
    }
}

export default BussinessClassRight
