import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class LineType extends React.Component {

    // 获取x轴配置
    getXAxisOption = () => {
        const { xAxisData = [] } = this.props;

        const xAxis = {
            data: xAxisData,
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
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'   //这里用参数代替了
                },
                showMaxLabel: true
            },
        };
        return xAxis;
    };

    //y轴配置
    getYAxisOption = () => {
        const yAxis = {
            name: '笔数/笔',
            nameTextStyle: {
                color: '#fff',
            },
            nameGap: 10,
            axisLabel: {
                show: true,
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
        };
        return yAxis;
    };

    // 获取color配置
    getColorOption = () => {
        const colorArr = ['rgba(247, 180, 50, 1)', 'rgba(0, 172, 255, 1)', 'rgba(226, 60, 57, 1)', 'rgba(253, 96, 225, 1)', 'rgba(77, 241, 182, 1)', 'rgba(255, 120, 0, 1)'];
        return colorArr;
    }

    // 获取legend配置
    getLegendOption = () => {
        // const legendArr = ['网开单向审核', '网开视频', '网开复核', '人工在线服务', '呼入咨询服务', '电话回访服务' ];
        // const legendOption = {
        //     data: legendArr,
        //     left: '30%', //可设定图例在左、右、居中
        //     y: 'top',
        //     textStyle: {//图例文字的样式
        //         color: '#fff',
        //     },
        // };
        // return legendOption;
        const data1 = ['网开单向审核', '网开视频', '网开复核' ];
        const data2 = ['人工在线服务', '呼入咨询服务' ];
        const data3 = [ '电话回访服务' ];
        const dataArr = [data1, data2, data3];
        const legendArr = [];
        dataArr.forEach((item, index) => {
            const paddingTop = index * 18;
            const legendOption = {
                data: item,
                left: '30%',
                y: paddingTop,
                orient: 'horizontal',
                textStyle: {//图例文字的样式
                    color: '#fff',
                },
                itemHeight: 10,
                itemGap: 5,
            };
            legendArr.push(legendOption);
        })
        return legendArr;
    };

    // 获取数据
    getSeriesData = () => {
        const { data = [] } = this.props;
        const legendArr = ['网开单向审核', '网开视频', '网开复核', '人工在线服务', '呼入咨询服务', '电话回访服务' ];
        let series = [];
        for (let i = 0; i < data.length; i++) {
            const tmpl = {
                name: legendArr[i] || '',
                type: 'line',
                data: data[i] || [],
                symbol: 'circle',
                symbolSize: 5,
                boundaryGap: false,
                sampling: 'average',
                barWidth: '20%',
                // itemStyle: {
                //     normal: {
                //         color: colorArr[i+1], 
                //     },
                // },
            };
            series.push(tmpl);
        }
        // console.log(series)
        return series;
    };

    render () {
        const option = {
            // tooltip: {
            //     trigger: 'item',
            //     formatter: '{c}'
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'cross',       // 默认为直线，可选为：'line' | 'shadow'
                },
                textStyle: {
                    align: 'left'
                }
            },
            color: this.getColorOption(),
            legend: this.getLegendOption(),
            grid: {
                left: '10%',
                right: '10%',
                // containLabel: true,
                bottom: '15%',
                top: '30%',
            },
            xAxis: this.getXAxisOption(),
            yAxis: this.getYAxisOption(),
            series: this.getSeriesData()
        };

        return (
            // <div>111</div>
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
