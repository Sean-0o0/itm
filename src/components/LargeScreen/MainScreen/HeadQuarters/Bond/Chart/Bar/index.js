import React from 'react';
import { message } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import {
    FetchQueryChartIndexData,
} from '../../../../../../../services/largescreen';

class Bar extends React.Component {
    state = {
        datas: [],
    };

    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage');
        this.fetchData();
        this.fetchInterval = setInterval(() => {
            const loginStatus = localStorage.getItem('loginStatus');
            if (loginStatus !== '1') {
                this.props.dispatch({
                    type: 'global/logout',
                });
            }
            this.fetchData();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "ZBYHJ"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.setState({ datas: data });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    // 获取x轴配置
    getXAxisOption = () => {
        const { datas = [] } = this.state;
        const data = datas.map(m => m.IDX_NM);
        const xAxis = {
            data: data,
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
                interval:0,
                formatter: (value) => {
                    let ret = "";//拼接加\n返回的类目项  
                    const maxLength = 4;//每项显示文字个数  
                    const valLength = value.length;//X轴类目项的文字个数  
                    const rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
                    if (rowN > 1)//如果类目项的文字大于5,  
                    {
                        for (let i = 0; i < rowN; i++) {
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
        const yAxis = [];
        const defaultOption = {
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
                return value.max<10?value.max + 10:value.max;
            }
        };
        yAxis.push({
            ...defaultOption,
            name: '笔数/笔',
            nameTextStyle: {
                color: '#fff',
                // align: 'right'
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                },
            },
        });
        yAxis.push({
            ...defaultOption,
            name: '金额/万元',
            nameTextStyle: {
                color: '#fff',
                // align: 'left'
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                },
            },
        });
        return yAxis;
    };

    // 获取color配置
    getColorOption = () => {
        const colorArr = ['rgba(0, 172, 255, 1)', 'rgba(247, 180, 50, 1)'];
        return colorArr;
    }

    // 获取legend配置
    getLegendOption = () => {
        const data = ['笔数', '金额'];
        const legendOption = {
            data: data,
            x: 'center', //可设定图例在左、右、居中
            y: 'top',
            textStyle: { //图例文字的样式
                color: '#fff',
            },
        };
        return legendOption;
    };

    // 获取数据
    getSeriesData = () => {
        const { datas = [] } = this.state;
        const series = [];

        let data1 = [];
        // 构建数据
        data1 = datas.map(m => Number.parseInt(m.BS) || 0);
        const tmpl = {
            name: '笔数',
            type: 'bar',
            yAxisIndex: 0,
            data: data1,
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            barWidth: '20%',
            areaStyle: 'transparent',
            itemStyle: {
                normal: {
                    color: '#00ade9', // 00ade9, fca800, 318dec, ba3f0a
                },
            },
        };
        series.push(tmpl);

        let data2 = [];
        // 构建数据
        data2 = datas.map(m => m.JE || 0);
        const tmp2 = {
            name: '金额',
            type: 'bar',
            yAxisIndex: 1,
            data: data2,
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            barWidth: '20%',
            areaStyle: 'transparent',
            itemStyle: {
                normal: {
                    color: '#fca800', // 00ade9, fca800, 318dec, ba3f0a
                },
            },
        };
        series.push(tmp2);

        return series;
    };

    render() {
        const option = {
            // tooltip: {
            //     trigger: 'item',
            //     formatter: '{b}:{c}'
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
                left: '14%',
                right: '21%',
                // containLabel: true, // 文本是否强制全部显示
                bottom: '20%'
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
export default Bar;
