import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class Overview extends Component {
    state = {}

    sortArr = (arr) => {
        let map = {};
        let myArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].FKSJ) {
                if (!map[arr[i].FKSJ]) {
                    const { YSLX, YZXYS } = arr[i];
                    myArr.push({
                        FKSJ: arr[i].FKSJ,
                        [YSLX]: YZXYS
                    });
                    map[arr[i].FKSJ] = arr[i]
                } else {
                    for (let j = 0; j < myArr.length; j++) {
                        if (arr[i].FKSJ === myArr[j].FKSJ) {
                            const { YSLX, YZXYS } = arr[i];
                            myArr[j][YSLX] = YZXYS;
                            break
                        }
                    }
                }
            }
        }
        return myArr;
    }

    render() {
        const { title = '-', ysqs = [] } = this.props
        const data = this.sortArr(ysqs);
        const option = {
            color: ['#5B8FF9', '#9EE6FF', '#FDCD67'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                itemHeight: 0, //圆点大小
                itemGap: 50,
                data: ['资本性预算执行(万元)', '非资本性预算(万元)', '自主研发投入(万元)']
            },
            grid: {
                bottom: 36,
                right: 24,
                left: 56,
                top: 36
            },
            xAxis: {
                axisTick: {
                    show: false,
                },
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.45)',
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#A5A7AF'   //这里用参数代替了
                    },
                },
                data: data.map(item=> item.FKSJ)
            },
            yAxis: {
                axisTick: {
                    show: false,
                },
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#EDEDED',
                    }
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#A5A7AF'   //这里用参数代替了
                    },
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                splitNumber: 5
            },
            series: [
                {
                    name: '资本性预算执行(万元)',
                    type: 'line',
                    stack: 'Total',
                    symbolSize: 1,
                    data: data.map(item=> item['资本性预算执行']||0),
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(91, 143, 249, 1)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(91, 143, 249, 0)'

                        }]),
                        opacity: 0.7
                    },
                    emphasis:{
                        itemStyle: {
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        }
                    }
                },
                {
                    name: '非资本性预算(万元)',
                    type: 'line',
                    stack: 'Total',
                    symbolSize: 1,
                    data: data.map(item=> item['非资本性预算执行']||0),
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(158, 230, 255, 1)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(158, 230, 255, 0)'

                        }]),
                        opacity: 0.7
                    },
                    emphasis:{
                        itemStyle: {
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        }
                    }
                },
                {
                    name: '自主研发投入(万元)',
                    type: 'line',
                    stack: 'Total',
                    symbolSize: 1,
                    data: data.map(item=> item['科研预算执行']||0),
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(253, 205, 103, 1)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(253, 205, 103, 0)'
    
                        }]),
                        opacity: 0.7
                    },
                    emphasis:{
                        itemStyle: {
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10
                        }
                    }
                }
            ]
        };

        return (
            <div className='cont-block trend-overview' style={{ margin: '24px 24px 0' }}>
                <div style={{ paddingLeft: '24px', color: '#303133', fontSize: 16, fontWeight: 'bold', height: '30px', lineHeight: '40px' }}>{title}</div>
                <React.Fragment>
                    <ReactEchartsCore
                        echarts={echarts}
                        option={option}
                        notMerge
                        lazyUpdate
                        style={{ height: 'calc(100% - 30px)' }}
                        theme=""
                    />
                </React.Fragment>
            </div>
        );
    }
}

export default Overview;