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

class LineType extends React.Component {
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
                data[i] = data[i].slice(4, data[i].length);
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
                showMaxLabel: true
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
        let type = 'value';
        // 纵轴格式
        let formatter = '{value}';
        let interval = {};
        if (chartCode === 'FutursClearingEfficiency' || chartCode === 'IndAssMgtFinTime' || chartCode === 'XjSettlecomptime') {
            type = "time";
            formatter = (value) => {
                const date = new Date(value);
                let minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                const texts = date.getHours() + ':' + minutes;
                return texts;
            };
            // interval = {
            //     maxInterval: 3600 * 3 * 1000,
            //     minInterval: 3600 * 2 * 1000,
            // }

        }
        let splitNumber = 8;
        if (chartCode === 'hjcustomerservice') {
            splitNumber = 5;
        }
        const defaultOption = {
            type: type,
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
            splitNumber: splitNumber,
            // min: (value) => {
            //     if (chartCode === 'Settlecomptime' || chartCode === 'IndAssMgtFinTime' || chartCode === 'XjSettlecomptime') {
            //         return value.min;
            //     }
            //     return value.min - 10 > 0 ? value.min - 10 : 0;
            // },
            max: (value) => {
                if (chartCode === 'FutursClearingEfficiency' || chartCode === 'IndAssMgtFinTime' || chartCode === 'XjSettlecomptime') {
                    return value.max;
                }
                return value.max < 15 ? value.max + 15 : value.max;
            },
            nameGap: 6
        };
        let align = 'center';
        if (haveLeftYAxis) {
            // if (leftVerticalUnit.length > 5) {
            //     align = 'left';
            // }
            yAxis.push({
                ...defaultOption,
                name: leftVerticalUnit,
                nameTextStyle: {
                    color: '#fff',
                    // align: align
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: formatter,
                    ...interval,
                },

            });

        }
        if (haveRightYAxis) {
            if (leftVerticalUnit.length > 5) {
                align = 'right';
            }
            yAxis.push({
                ...defaultOption,
                name: rightVerticalUnit,
                nameTextStyle: {
                    color: '#fff',
                    align: align
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: formatter,
                    ...interval,
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
        let num = 2;
        if (chartCode === 'FutursClearingEfficiency') {
            num = 4;
        }
        if (chartCode === 'IndAssMgtFinTime') {
            num = 3;
        }
        const data = iConf.map(m => m.indexName);
        const maxlength = Math.ceil(data.length / num);
        const dataArr = [];
        const legendArr = [];
        for (let i = 0; i < maxlength; i++) {
            dataArr.push([]);
        }
        data.forEach((item, index) => {
            dataArr[parseInt(index / num)].push(item);
        })
        dataArr.forEach((item, index) => {
            const paddingTop = index * 18;
            const legendOption = {
                data: item,
                x: 'center',
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
        // const { configData = {}, indexConfig = {} } = this.props;
        // const { chartCode = '' } = configData;
        // let iConf = indexConfig[chartCode] || [];
        // // 排序
        // iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        // let data = iConf.map(m => m.indexName);
        // if (chartCode === 'hjcustomerservice') {
        //     data = iConf.map(m => m.indexName2);
        // }
        // const legendOption = {
        //     data: data,
        //     x: 'center',      //可设定图例在左、右、居中
        //     y: 'top',
        //     textStyle: {//图例文字的样式
        //         color: '#fff',
        //     },
        // };
        // return legendOption;
    };

    // 获取数据
    getSeriesData = () => {
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        let legendNames = iConf.map(m => m.indexName);
        if (chartCode === 'hjcustomerservice') {
            legendNames = iConf.map(m => m.indexName2);
        }
        const { datas = [] } = this.state;
        const series = [];
        for (let i = 0; i < legendNames.length; i++) {
            let iConfItem = iConf.find(m => m.indexName === legendNames[i]) || {};
            if (chartCode === 'hjcustomerservice') {
                iConfItem = iConf.find(m => m.indexName2 === legendNames[i]) || {};
            }
            if (Object.keys(iConfItem).length > 0) {
                let data = [];
                // 指标编码
                const {
                    indexCode = '',
                    indexName = '',
                    verticalType = '',
                    displayColor = '',
                    indexName2 = ''
                } = iConfItem;
                // 构建数据

                data = datas.map(m => m[indexCode.toUpperCase()] || "0");
                const strData = datas.map(m => `${m.RQ}`);
                if (chartCode === 'FutursClearingEfficiency' || chartCode === 'IndAssMgtFinTime' || chartCode === 'XjSettlecomptime') {
                    for (let j = 0; j < data.length; j++) {
                        if (data[j] !== "0") {
                            const year = parseInt(data[j].slice(0, 4));
                            const month = parseInt(data[j].slice(5, 7));
                            const day = parseInt(data[j].slice(8, 11));
                            const strYear = parseInt(strData[j].slice(0, 4));
                            const strMonth = parseInt(strData[j].slice(4, 6));
                            const strDay = parseInt(strData[j].slice(6, 8));
                            const axisYear = parseInt(strData[0].slice(0, 4));
                            const axisMonth = parseInt(strData[0].slice(4, 6));
                            const axisDay = parseInt(strData[0].slice(6, 8));
                            const hour = parseInt(data[j].slice(11, 13));
                            const minute = parseInt(data[j].slice(14, 16));
                            const seconds = parseInt(data[j].slice(17, 19));
                            let moreDay = 0;
                            if (year > strYear) {
                                moreDay = 1;
                            } else if (month > strMonth) {
                                moreDay = 1;
                            } else if (day > strDay) {
                                moreDay = 1;
                            }
                            const date = new Date();
                            date.setFullYear(axisYear, axisMonth - 1, axisDay);
                            date.setHours(hour, minute, seconds, 0);
                            let dateTick = date.getTime();
                            if (moreDay === 1) {
                                dateTick = dateTick + 24 * 60 * 60 * 1000;
                            }
                            data[j] = dateTick;
                        }
                    }
                }
                const tmpl = {
                    name: chartCode === 'hjcustomerservice' ? indexName2 : indexName,
                    type: 'line',
                    yAxisIndex: Number.parseInt(verticalType, 10) - 1 || 0,
                    data,
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: displayColor || '#00ade9',
                        },
                    },
                };
                series.push(tmpl);
            }
        };
        return series;
    };
    getTooltip = () => {
        const { configData = {} } = this.props;
        const chartCode = configData.chartCode;
        let type = 'cross';
        if (chartCode === 'FutursClearingEfficiency' || chartCode === 'IndAssMgtFinTime' || chartCode === 'XjSettlecomptime') {
            type = 'line'
        }
        const tooltip = {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: type,       // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                align: 'left'
            },
            formatter: (params) => {
                let name = '';
                let marker = [];
                let seriesName = [];
                let value = [];
                params.forEach(item => {
                    name = item.name;
                    marker.push(item.marker)
                    seriesName.push(item.seriesName)
                    value.push(item.value)
                })
                let tooltext = '';
                if (chartCode === 'FutursClearingEfficiency' || chartCode === 'IndAssMgtFinTime' || chartCode === 'XjSettlecomptime') {
                    value.forEach((item, index) => {
                        if (value[index]) {
                          if(item === "0"){
                            value[index] = "--:--"
                          } else {
                            const date = new Date(item);
                            value[index] = (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes());
                          }
                        }
                    })
                }
                marker.forEach((item, index) => {
                    if (value[index]) {
                        tooltext = tooltext + '<br/>' + item + seriesName[index] + ': ' + value[index];
                    }
                })
                return name + tooltext;
            }
        };
        return tooltip;
    }

    render() {
        const { configData = {} } = this.props;
        const { chartCode = '' } = configData;
        let top = '50';
        // let containLabel = true;
        if (chartCode === 'Coreoperationscosthis' || chartCode === 'hjcustomerservice') {
            top = '70';
            // containLabel = false;
        }
        const option = {
            tooltip: this.getTooltip(),
            color: this.getColorOption(),
            legend: this.getLegendOption(),
            grid: {
                left: '14%',
                right: '12%',
                top: top,
                // containLabel: containLabel,
                bottom: '15%'

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
