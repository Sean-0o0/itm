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
            name: '笔',
            nameTextStyle: {
                color: '#fff',
                align: 'center'
            },
            nameGap: 5,
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
            // min: (value) => {
            //     return value.min - 5 > 0 ? value.min - 5 : 0;
            // },
            max: (value) => {
                return value.max<10?value.max + 10:value.max;
            }
        };
        return yAxis;
    };

    // 获取color配置
    // getColorOption = () => {
    //     const colorArr = ['rgba(0, 172, 255, 1)','rgba(237, 237, 25, 1)', 'rgba(226, 60, 57, 1)', 'rgba(247, 180, 50, 1)', 'rgba(253, 96, 225, 1)', 'rgba(0, 172, 255, 1)',
    //         'rgba(21, 126, 244, 1)', 'rgba(227,207,87,1)', 'rgba(255, 227, 132, 1)', 'rgba(106, 90, 205, 1)', 'rgba(245, 222, 179, 1)'];
    //     const { fqqdArr = [] } = this.props;
    //     const tmpl = [];
    //     for (let i = 0; i < fqqdArr.length; i++) {
    //         tmpl.push(colorArr[i])
    //     }
    //     return tmpl;
    // }

    getLegendName = () => {
        const { fqqdArr = [] } = this.props;
        let legendArr = ['总量'];
        fqqdArr.forEach(item => {
            if (item === '3') {
                legendArr.push('网厅')
            } else if (item === '4') {
                legendArr.push('pc')
            } else if (item === '5') {
                legendArr.push('iPad')
            }
        });
        // console.log(legendArr);
        return legendArr;
    }

    // 获取legend配置
    getLegendOption = () => {
        const legendArr = this.getLegendName();
        const legendOption = {
            data: legendArr,
            x: 'right', //可设定图例在左、右、居中
            y: 'top',
            textStyle: {//图例文字的样式
                color: '#fff',
            },
        };
        return legendOption;
    };

    // 获取数据
    getSeriesData = () => {
        const { data = {}, fqqdArr = [], xAxisData = [] } = this.props;
        const legendArr = this.getLegendName();
        let datas = [];
        let series = [];
        let total = [];
        fqqdArr.forEach(item => {
            const element = data[item] || [];
            const value = element.map(m => m ? m.zywbs : 0);
            datas.push(value);
        })
        const colorArr = ['rgba(0, 172, 255, 1)', 'rgba(237, 237, 25, 1)', 'rgba(226, 60, 57, 1)', 'rgba(253, 96, 225, 1)', 'rgba(247, 180, 50, 1)', 'rgba(0, 172, 255, 1)',
            'rgba(21, 126, 244, 1)', 'rgba(227,207,87,1)', 'rgba(255, 227, 132, 1)', 'rgba(106, 90, 205, 1)', 'rgba(245, 222, 179, 1)'];
        for (let i = 0; i < xAxisData.length; i++) {
            let tmpl = 0;
            datas.forEach(item => {
                tmpl = parseNumbers(item[i]) + tmpl;
            })
            total.push(tmpl);
        }
        series.push({
            name: '总量',
            type: 'bar',
            data: total,
            barWidth: '40%',
            itemStyle: {
                normal: {
                    color: colorArr[0],
                },
            },
        })
        for (let i = 0; i < datas.length; i++) {
            const tmpl = {
                name: legendArr[i + 1] || '',
                type: 'line',
                data: datas[i] || [],
                symbol: 'circle',
                symbolSize: 5,
                sampling: 'average',
                barWidth: '20%',
                itemStyle: {
                    normal: {
                        color: colorArr[i + 1],
                    },
                },
            };
            series.push(tmpl);
        }
        // console.log(series)
        return series;
    };

    render() {
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
                // formatter:(params)=>{
                //     let name = '';
                //     let marker = [];
                //     let seriesName = [];
                //     let value = [];
                //     params.forEach(item=>{
                //         name = item.name;
                //         marker.push(item.marker)
                //         seriesName.push(item.seriesName)
                //         value.push(item.value)
                //     })
                //     let tooltext = '';
                //     marker.forEach((item,index)=>{
                //         tooltext = tooltext+'<br/>'+item+seriesName[index]+': '+value[index];
                //     })
                //     return name+tooltext;
                // }
            },
            // color: this.getColorOption(),
            legend: this.getLegendOption(),
            grid: {
                left: '10%',
                right: '10%',
                // containLabel: true,
                bottom: '20%',
                top: '20%',
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
