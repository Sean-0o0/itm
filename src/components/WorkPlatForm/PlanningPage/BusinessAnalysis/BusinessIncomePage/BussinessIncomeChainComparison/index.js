import React, { Component } from 'react'
import { Row, Col } from "antd";
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/bar';
import moment from "moment";


/*
 * @Author: cyp
 * @Date: 2021年5月20日09:52:23
 * @Description: 经营分析-财务类-营业收入-查看明细页面-环比图
 */
export class BussinessIncomeChainComparison extends Component {
    constructor(props) {
        super(props)

        this.state = {
            option: {},
        }
    }

    static getDerivedStateFromProps(nextProps, preState) {
        const { result2 } = nextProps
        if (JSON.stringify(result2) !== JSON.stringify(preState.result2)) {
            //数据有两种 依据月份分类
            const Mon = moment().subtract(1, 'months').format("YYYYMM")
            const lastMon = moment().subtract(2, 'months').format("YYYYMM")
            let series1 = []
            let series2 = []
            let xAxis = []
            result2.forEach(ele => {
                ele.MON === Mon && series1.push(ele.INDIVAL), xAxis.push(ele.ORGNAME)
                ele.MON === lastMon && series2.push(ele.INDIVAL)

            });
            let option = {
                // title: {
                //     text: '世界人口总量',
                //     subtext: '数据来自网络'
                // },
                color: ['#5B8FF9', '#F6868E'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                // legend: {
                //     data: ['五月份', '六月份']
                // },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    top: '2%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xAxis,
                    axisLabel: {
                        interval: 0
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 15,
                        textStyle: {
                            color: '#000',
                            fontSize: 10
                        }
                    },

                },
                yAxis: [{
                    type: 'value',
                }],
                series: [
                    {
                        name: lastMon,
                        type: 'bar',
                        data: series1
                    },
                    {
                        name: Mon,
                        type: 'bar',
                        data: series2
                    }
                ]
            };
            return {
                option,
                result2
            }
        }

    }


    render() {
        const { option } = this.state
        return (
            <div className='ba-body' style={{ margin: '.8rem', backgroundColor: 'white' }}>
                <Row>
                    <Col span={24} style={{ marginBottom: '2rem' }}>
                        <Row type='flex' justify='center'>
                            <span style={{ fontSize: '24px', fontWeight: '700', marginTop: '1rem', marginBottom: '1rem' }}>各业务线营收环比情况</span>
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

export default BussinessIncomeChainComparison
