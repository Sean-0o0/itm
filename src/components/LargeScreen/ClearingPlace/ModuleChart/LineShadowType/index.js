import React from 'react';
import { message } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import {
    FetchQueryChartIndexData,
} from '../../../../../services/largescreen';

class LineShadowType extends React.Component {
    state = {
        datas: [],
    };
    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
        this.fetchData();
        this.fetchInterval = setInterval(() => {
            this.fetchData();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    fetchData = () => {
        const { configData = {} } = this.props;
        FetchQueryChartIndexData({
            chartCode: configData.chartCode,
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ datas: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    // 获取x轴配置
    getXAxisOption = () => {
        const { configData = {} } = this.props;
        const { datas = [] } = this.state;
        const data = datas.map(m => `${m.RQ}`);
        const chartCode = configData.chartCode;
        if (chartCode !== "IndCapProAmtCh" && chartCode !== "IndCapCurAmt" && chartCode !== "IndCapScFuPro") {
            for (let i = 0; i < data.length; i++) {
                data[i] = data[i].slice(4, data[i].legend);
                data[i] = `${data[i].slice(0, 2)}-${data[i].slice(2)}`;
            }
        }
        const xAxis = {
            data: data,
            axisTick: {
                show: true,
                inside: true
            },
            boundaryGap: false,
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
            },
            min: (value) => {
                return value.min;
            },
            max: (value) => {
                return value.max;
            },
        };
        return xAxis;
    };

    //y轴配置
    getYAxisOption = () => {
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        const iConf = indexConfig[chartCode] || [];
        const yAxis = [];
        // 左纵轴单位
        const leftVerticalUnit = configData.leftVerticalUnit;
        // 右纵轴单位
        const rightVerticalUnit = configData.rightVerticalUnit;
        // 确定有左纵轴
        const haveLeftYAxis = true;
        // 是否有右纵轴
        const haveRightYAxis = iConf.some(m => Number.parseInt(m.verticalType, 10) === 2);
        const defaultOption = {
            axisTick: {
                show: false,
            },
            boundaryGap: false,
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
                    color: '#fff'
                },
            },
            splitNumber: 8,
            // min: (value) => {
            //     return value.min-5>0?value.min-5:0;
            // },
            max: (value) => {
                return value.max<15?value.max + 15:value.max;
            }
        };
        let align = 'center';
        if (haveLeftYAxis) {
            if (leftVerticalUnit.length > 6) {
                align = 'left';
            }
            yAxis.push({
                ...defaultOption,
                name: leftVerticalUnit,
                nameTextStyle: {
                    color: '#fff',
                    align: align
                },
            });

        }
        if (haveRightYAxis) {
            if (leftVerticalUnit.length > 6) {
                align = 'right';
            }
            yAxis.push({
                ...defaultOption,
                name: rightVerticalUnit,
                nameTextStyle: {
                    color: '#fff',
                    align: align
                },
            });
        }
        return yAxis;
    };

    // 获取color配置
    getColorOption = () => {
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        const data = iConf.map(m => m.displayColor);
        return data;
    }

    // 获取legend配置
    getLegendOption = () => {
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        const data = iConf.map(m => m.indexName);
        let fontSize = 12;
        if( chartCode === 'FutursBrokerageRetFee'||chartCode === 'xqcustomerservice'){
            fontSize = 9;
        }
        const legendOption = {
            data: data,
            x: 'center',      //可设定图例在左、右、居中
            y: 'top',
            textStyle: {//图例文字的样式
                color: '#fff',
                fontSize: fontSize
            },
        };
        return legendOption;
    };

    // 获取数据
    getSeriesData = () => {
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        const legendNames = iConf.map(m => m.indexName);
        const { datas = [] } = this.state;
        const series = [];
        let label = {};
        if(legendNames.length === 1){
            label = {
                formatter: (params) => {
                    if (params.dataIndex === 0) {
                        return ''
                    } else {
                        return params.value
                    }
                },
                show: true,
                position: "top",
                textStyle: {
                    color: "#fff"
                }
            }
        }
        for (let i = 0; i < legendNames.length; i++) {
            const iConfItem = iConf.find(m => m.indexName === legendNames[i]) || {};
            if (Object.keys(iConfItem).length > 0) {
                let data = [];
                // 指标编码
                const {
                    indexCode = '',
                    indexName = '',
                    verticalType = '',
                    displayColor = '',
                    displayType = '',
                } = iConfItem;
                // 构建数据
                data = datas.map(m => m[indexCode] || 0);
                let tmpl = {};
                if (displayType === '33') {
                    tmpl = {
                        name: indexName || '',
                        type: 'line',
                        symbol: 'none',
                        yAxisIndex: Number.parseInt(verticalType, 10) - 1 || 0,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                    type: 'dotted',  //'dotted'虚线 'solid'实线
                                    color: displayColor || 'rgba(0, 172, 255, 1)'
                                },
                                color: displayColor || 'rgba(0, 172, 255, 1)'
                            }
                        },
                        data,
                        label: label,
                    };
                } else {
                    tmpl = {
                        name: indexName || '',
                        type: 'line',
                        yAxisIndex: Number.parseInt(verticalType, 10) - 1 || 0,
                        data,
                        symbol: 'circle',
                        symbolSize: 5,
                        sampling: 'average',
                        itemStyle: {
                            normal: {
                                color: displayColor || 'rgba(0, 172, 255, 1)',
                            },
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: displayColor || 'rgba(0, 172, 255, 1)'
                            },
                            // {
                            //     offset: 0.3,
                            //     color:  displayColor == null ?  displayColor.slice(0, displayColor.length - 2) + '0.1)':'rgba(0, 172, 255, 1)'

                            // },
                            {
                                offset: 1,
                                color: 'rgba(0, 172, 255, 0)'

                            }])
                        },
                        label: label,
                        // markLine:{
                        //     symbol: ['none', 'none'],
                        //     label:{
                        //         position: 'end',
                        //         show: true,
                        //     },
                        //     data:[{
                        //         yAxis: 100
                        //     }],
                        //     lineStyle:{
                        //         type: 'dashed',
                        //         color: '#fff'
                        //     }
                        // }
                    };
                }
                series.push(tmpl);
            }
        };
        return series;
    };

    render() {
        const { configData = {} } = this.props;
        const { chartCode = '' } = configData;
        let left = '15%';
        let right = '12%';
        if (chartCode === 'IndIntqueryCsrSer' || chartCode === 'IndIntqueryDepAmt'|| chartCode === 'IndIntqueryIrrAmt') {
            left = '19%';
        }
        if(chartCode === 'Settlementvolume'){
            right = '16%';
        }
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
                left: left,
                right: right,
                // containLabel: true,
                bottom: '12%'

            },
            xAxis: this.getXAxisOption(),
            yAxis: this.getYAxisOption(),
            series: this.getSeriesData(),
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
export default LineShadowType;
