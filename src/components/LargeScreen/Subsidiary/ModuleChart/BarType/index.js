import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class BarType extends React.Component {
    // 获取x轴配置
    getXAxisOption = () => {
        const { xAxisData = [] } = this.props;
        const maxLength = xAxisData.length <= 5 ? 8 : 4;
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
                    fontSize: 10
                },
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
        const yAxis = {
            // name:'笔',
            // nameTextStyle: {
            //     color: '#fff',
            //     align: 'right'
            // },
            // nameGap: 5,
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
        const { data = [] } = this.props
        const series = {
            type: 'bar',
            data: data,
            showBackground: true,
            barWidth: '40%',
            label: {
                show: true,
                position: 'top',
                color: '#fff',
                fontSize: 10,
                backgroundColor: '#040F27',
                borderRadius: 2,
                padding: [5, 5, 2, 5]
            },
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#55B6F3' },     //柱图渐变色
                            { offset: 1, color: '#0057B7' },   //柱图渐变色
                        ])
                }
            }
        };
        return series;

    };

    render() {
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
                left: '15%',
                right: '5%',
                bottom: '22%',
                top: '15%',
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
export default BarType;
