import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import ReactEchartsCore from 'echarts-for-react/lib/core';

export class PieCharts extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
        
    }

    getOption = () =>{
        const { title ,chartData = {} } = this.props;
        let finishNum = 0;
        if(chartData.length > 0){
            chartData.forEach(item => {
                if(item.STATE !== '0'){
                    finishNum += Number.parseInt(item.COUNT);
                }
            });
        }
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '60%'],
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: function (colors) {
                                var colorList = ['#157EF4', '#AAAAAA'];
                                return colorList[colors.dataIndex]
                            }
                        }
                    },
                    data: [
                        // { value: finishNum, name: '完成' },
                        // { value: chartData[0]?chartData[0]:0, name: '未完成' },
                        { value: finishNum, name: '完成' },
                        { value: chartData[0]?chartData[0].COUNT:0, name: '未完成' },
                    ]
                },
                {
                    name: title,
                    type: 'pie',
                    radius: ['70%', '78%'],
                    labelLine: {
                        show: false
                    },
                    label: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: function (colors) {
                                var colorList = ['#157EF4', '#E23C39', '#F7B432', '#AAAAAA'];
                                return colorList[colors.dataIndex]
                            }
                        }
                    },
                    data: [
                        { value: chartData[1]?chartData[1].COUNT:0, name: '正常' },
                        { value: chartData[2]?chartData[2].COUNT:0, name: '异常' },
                        { value: chartData[3]?chartData[3].COUNT:0, name: '手工确认' },
                        { value: chartData[0]?chartData[0].COUNT:0, name: '未完成' },
                    ]
                }
            ]
        }
        return option;
    }

    render() {
        return (
            <ReactEchartsCore
                echarts={echarts}
                option={this.getOption()}
                notMerge
                lazyUpdate
                style={{ height: '112%' }}
                theme=""
            />
        )
    }
}

export default PieCharts
