import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { parseNumbers } from 'xml2js/lib/processors';

class LineType extends React.Component {

    // 获取x轴配置
    getXAxisOption = () => {
        const { xAxisData = [] } = this.props;

        const xAxis = {
            data: xAxisData,
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#00ACFF',
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff',   //这里用参数代替了
                    fontSize: 10
                },
                showMaxLabel: true
            },
        };
        return xAxis;
    };

    //y轴配置
    getYAxisOption = () => {
        const yAxis = {
            name: '笔/笔数',
            nameTextStyle: {
                color: '#fff',
                align: 'center',
                fontSize: 10
            },
            nameGap: 7,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff',
                    fontSize: 10
                },
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#00ACFF',
                }
            },
            splitLine: {
                show: false
            },
            // min: (value) => {
            //     return value.min - 5 > 0 ? value.min - 5 : 0;
            // },
            max: (value) => {
                return value.max < 10 ? value.max + 10 : value.max;
            }
        };
        return yAxis;
    };

    // 获取数据
    getSeriesData = () => {
        const { data = [], legend = [] } = this.props;
        let series = [];
        const color = ['#00ACFF', '#F7B432', '#EDED19', '#E23C39'];
        legend.forEach((item, index) => {
            if (index === 0) {
                series.push({
                    name: item,
                    type: 'bar',
                    data: data.length > index ? data[index] : [],
                    barWidth: '40%',
                    itemStyle: {
                        normal: {
                            color: color[index],
                        },
                    },
                })
            } else {
                series.push({
                    name: item,
                    type: 'line',
                    data: data.length > index ? data[index] : [],
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    barWidth: '20%',
                    itemStyle: {
                        normal: {
                            color: color[index],
                        },
                    },
                });
            }

        })
        return series;
    };

    render() {
        const { legend } = this.props;
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross',       // 默认为直线，可选为：'line' | 'shadow'
                },
                textStyle: {
                    align: 'left'
                }
            },
            legend: {
                textStyle: {
                    color: "#fff",
                    fontSize: 10
                },
                itemGap: 20,
                itemHeight: 8,
                itemWidth: 10,
                data: legend
            },
            grid: {
                left: '10%',
                right: '5%',
                // containLabel: true,
                bottom: '20%',
                top: '20%',
            },
            xAxis: this.getXAxisOption(),
            yAxis: this.getYAxisOption(),
            series: this.getSeriesData()
        };
        return (
            <React.Fragment>
                <ReactEchartsCore
                    echarts={echarts}
                    option={option}
                    notMerge
                    lazyUpdate
                    style={{ height: '100%' }}
                    theme=""
                />
            </React.Fragment>
        )
    }
}
export default LineType;
