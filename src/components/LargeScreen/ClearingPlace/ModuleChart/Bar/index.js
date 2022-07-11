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

class Bar extends React.Component {
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
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        const data = iConf.map(m => m.indexName);
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

            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'   //这里用参数代替了
                },
                interval: 0,
                formatter: function (value) {
                    let ret = "";//拼接加\n返回的类目项
                    let maxLength = 4;//每项显示文字个数
                    // if(chartCode === 'Coreoperationscost'){
                    //     maxLength = 4;
                    // }
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
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        const iConf = indexConfig[chartCode] || [];
        const yAxis = [];
        // 左纵轴单位
        let leftVerticalUnit = configData.leftVerticalUnit;
        // 右纵轴单位
        const rightVerticalUnit = configData.rightVerticalUnit;
        if (chartCode === "IndIvTotalNum" || chartCode === "IndIvNewIncNum" || chartCode === "IndIvOutProNum") {
            leftVerticalUnit = ''
        }
        // 确定有左纵轴
        const haveLeftYAxis = true;
        // 是否有右纵轴
        const haveRightYAxis = iConf.some(m => Number.parseInt(m.verticalType, 10) === 2);
        // 纵轴格式
        let formatter = '{value}';
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
                return value.max < 15 ? value.max + 15 : value.max;
            },
            nameGap: 7
        };

        if (haveLeftYAxis) {
            yAxis.push({
                ...defaultOption,
                name: leftVerticalUnit,
                nameTextStyle: {
                    color: '#fff',
                    align: 'right',
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: formatter,
                },
            });

        }
        if (haveRightYAxis) {
            yAxis.push({
                ...defaultOption,
                name: rightVerticalUnit,
                nameTextStyle: {
                    color: '#fff',
                    align: 'left'
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    },
                    formatter: formatter,
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
        const { configData = {} } = this.props;
        const { chartCode = '' } = configData;
        let legendOption = {};
        if (chartCode === 'Coreoperationscost') {
            legendOption = {
                data: ['平均耗时'],
                x: 'right',      //可设定图例在左、右、居中
                y: 'top',
                icon:'path://M102.4 487.68h116.608v39.488H102.4v-39.424z m353.792 0.512v39.488H336.256v-39.424l119.936-0.064z m234.432-0.512v39.424H570.56V487.68h120.064z m230.592 0v39.488h-120.064V487.68h120.064z',
                textStyle: {//图例文字的样式
                    color: '#fff',
                },
            };
        }
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
        const indexCode = iConf.map(m => m.indexCode);
        const { datas = [] } = this.state;
        const series = [];
        let data = [];
        let avgCostData = [];
        let costData = [];
        if (chartCode === 'Coreoperationscost') {
            indexCode.forEach(element=>{
                datas.forEach(item => {
                    if (item.IDX_CODE === element) {
                        avgCostData.push(item.AVG_COST||'');
                        costData.push(item.COST||'')
                    }
            })
            })
            for (let i = 0; i < avgCostData.length; i++) {
                avgCostData[i] = [legendNames[i], avgCostData[i]]
            }
            data = costData;
        } else {
            for (let i = 0; i < legendNames.length; i++) {
                const iConfItem = iConf.find(m => m.indexName === legendNames[i]) || {};
                if (Object.keys(iConfItem).length > 0) {
                    // 指标编码
                    const {
                        indexCode = '',
                    } = iConfItem;
                    // 构建数据
                    const tmpl = datas.map(m => m[indexCode] || 0);
                    data.push((tmpl[0]));
                }
            };
        }

        let label = {};
        let text = (chartCode === 'Coreoperationscost') ? '分钟' : '';
        const displayColor = iConf.map(m => m.displayColor);
        // if (chartCode === 'Coreoperationscost' || chartCode === 'Specialoptbusinessind') {
        label = {
            show: true,
            position: 'top',
            color: '#fff',
            formatter: (params) => {
                const minutes = parseInt(params.data);
                return `${minutes}${text}`
            },
            backgroundColor: '#040F27',
            borderRadius: 2,
            padding: [5, 5, 2, 5]
        };
        // }
        series.push({
            type: 'bar',
            data: data,
            showBackground: true,
            barWidth: '20%',
            label: label,
            itemStyle: {
                normal: {
                    color: (chartCode === 'Coreoperationscost' || chartCode === 'Specialoptbusinessind') ?
                        (new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: displayColor[0] || 'rgba(0, 172, 255, 1)' },                   //柱图渐变色
                                { offset: 1, color: displayColor[0] ? displayColor[0].slice(0, displayColor[0].length - 2) + "0.1)" : 'rgba(0, 172, 255, 1)' },                   //柱图渐变色
                            ])) : (displayColor[0]) || 'rgba(0, 172, 255, 1)'
                }
            }
        });
        if (chartCode === 'Coreoperationscost') {
            series.push({
                type: 'custom',
                name: '平均耗时',
                itemStyle: {
                    normal: {
                        borderWidth: 0.5,
                        borderType: "dashed"
                    }
                },
                renderItem: this.renderItem,
                encode: {
                    x: 0,
                    y: 1
                },
                data: avgCostData,
                z: 100
            })
        }
        return series;
    };

    renderItem = (params, api) => {
        var xValue = api.value(0);
        var highPoint = api.coord([xValue, api.value(1)]);
        var style = api.style({
            fill: '#00ACFF', stroke: '#00ACFF'
        });

        return {
            type: 'line',
            shape: {
                x1: 65, y1: highPoint[1],
                x2: highPoint[0], y2: highPoint[1]
            },
            style: style

        };
    }

    render() {
        // this.fetchData(this.props);
        const { configData = {} } = this.props;
        const { chartCode = '' } = configData;
        let bottom = 42;
        let top = 40;
        let left = '13%';
        if (chartCode === 'Coreoperationscost') {
            left = 65;
        }
        if (chartCode === 'Coreoperationscost' || chartCode === 'Specialoptbusinessind') {
            top = 25;
        }
        if (chartCode === "IndIvTotalNum" || chartCode === "IndIvNewIncNum" || chartCode === "IndIvOutProNum") {
            top = 20;
        }
        if(chartCode === "Coreoperationscost"){
            top = 60;
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
                right: '10%',
                // containLabel: true,
                top: top,
                bottom: bottom
            },
            xAxis: this.getXAxisOption(),
            yAxis: this.getYAxisOption(),
            series: this.getSeriesData(),
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
