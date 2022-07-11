import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class BarStack extends React.Component {
    // 获取x轴配置
    getXAxisOption = () => {
        const { xAxisData = [] } = this.props;
        const maxLength = 4;
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
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff',   //这里用参数代替了
                },
                fontSize: 10,
                interval: 0,
                formatter: function (value) {
                    let ret = "";//拼接加\n返回的类目项
                    const valLength = value.length;//X轴类目项的文字个数
                    const rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                    if (rowN > 1)//如果类目项的文字大于5,
                    {
                        for (var i = 0; i < rowN; i++) {
                            let temp = "";//每次截取的字符串
                            const start = i * maxLength;//开始截取的位置
                            const end = start + maxLength;//结束截取的位置
                            //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                            temp = value.substring(start, end) + "\n";
                            ret += temp; //凭借最终的字符串
                        }
                        return ret;
                    }
                    else {
                        return value;
                    }
                },
            },
        };
        return xAxis;
    };

    //y轴配置
    getYAxisOption = () => {
        let yAxis = {};
        yAxis = {
            axisLabel: {
                show: true,
                fontSize: 10,
                textStyle: {
                    color: '#fff'
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
            splitNumber: 5,
            // min: (value) => {
            //     return value.min-5>0?value.min-5:0;
            // },
            max: (value) => {
                return value.max < 10 ? value.max + 10 : value.max;
            }
        }
        return yAxis;
    };

    // 获取数据
    getSeriesData = () => {
        const { data = {}, legend = [] } = this.props
        let series = [];
        const color = ['#55B6F3', '#0057B7', '#FFA700', '#C08803'];
        legend.forEach((item, index) => {
            series.push({
                name: item,
                type: 'bar',
                data: data.length > index ? data[index] : [],
                showBackground: true,
                barWidth: '40%',
                stack: 'total',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: color[2 * index] },     //柱图渐变色
                                { offset: 1, color: color[2 * index + 1] },   //柱图渐变色
                            ])
                    }
                }
            });
        })
        return series;
    };

    render() {
        const { legend = [] } = this.props;
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
            grid: {
                left: '12%',
                right: '3%',
                bottom: '22%',
                top: '15%',
            },
            legend: {
                textStyle: {
                    color: "#fff",
                    fontSize: 10
                },
                icon: "roundRect",
                itemGap: 60,
                itemHeight: 8,
                itemWidth: 8,
                data: legend
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
export default BarStack;
