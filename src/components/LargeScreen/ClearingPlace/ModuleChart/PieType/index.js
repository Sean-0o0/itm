import React from 'react';
import { message } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import {
    FetchQueryChartIndexData,
} from '../../../../../services/largescreen';

class PieType extends React.Component {
    state = {
        datas: [],
    };
    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
        this.fetchData(this.props);
        this.fetchInterval = setInterval(() => {
            this.fetchData(this.props);
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(nextProps) !== JSON.stringify(this.props)){
            this.fetchData(nextProps);
        }
    }

    fetchData = (props) => {
        const { configData = {} } = props;
        if (configData.chartCode) {
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
        }
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

    // 获取数据
    getSeriesData = () => {
        const { configData = {}, indexConfig = {} } = this.props;
        const { chartCode = '' } = configData;
        let iConf = indexConfig[chartCode] || [];
        // 排序
        iConf = iConf.sort((x, y) => x.displayOrder - y.displayOrder);
        const legendNames = iConf.map(m => m.indexName);
        const { datas = [] } = this.state;
        let data = [];
        for (let i = 0; i < legendNames.length; i++) {
            const iConfItem = iConf.find(m => m.indexName === legendNames[i]) || {};
            if (Object.keys(iConfItem).length > 0) {
                // 指标编码
                const {
                    indexCode = '',
                    indexName = '',
                } = iConfItem;
                // 构建数据
                const valueData = datas.map(m => m[indexCode] || 0);
                // if (valueData > 0) {
                    let tmpl = {
                        name: indexName || '',
                        value: valueData[0] || 0
                    };
                    data.push(tmpl);
                // }
            }
        };
        return data;
    };

    render() {
        const { configData = {}} = this.props;
        const { chartCode = '' } = configData;
        // const { screenPage = '' } = configData;
        let radius = '60%';
        let right = '36%';
        if (chartCode === 'IndCapProAmt' || chartCode === 'HJProBusPro') {
            radius = '70%';
            // right = '41%';
        }
        const option = {
            color: this.getColorOption(),
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}&nbsp;&nbsp;&nbsp;{d}%'
            },
            legend: {
                // type: 'scroll',
                right: 5,
                y: 'center',
                formatter: function (name) {
                    // 获取legend显示内容
                    let data = option.series[0].data;
                    let tarValue = 0;
                    for (let i = 0, l = data.length; i < l; i++) {
                        if (data[i].name === name) {
                            tarValue = parseInt(data[i].value);
                        }
                    }
                    const valLength = name.length;//X轴类目项的文字个数
                    if (valLength > 6) {
                        let temp = "";//每次截取的字符串
                        temp = name.substring(0, 6) + '...';
                        return temp + ' : ' + tarValue;
                    }
                    else {
                        return name + ' : ' + tarValue;
                    }


                },
                orient: 'vertical',
                textStyle:{
                    color:"#fff",
                    fontSize: 10
                },
                icon: "circle",
                itemHeight: 10,
            },
            series: [
                // {
                //     name: '',
                //     type: 'pie', //饼状图
                //     minAngle: 12,
                //     radius: radius, //大小
                //     center: ['50%', '50%'], //显示位置
                //     data: this.getSeriesData(),
                //     avoidLabelOverlap: true,
                //     itemStyle: {
                //         normal: {
                //             label: {
                //                 show: true,
                //                 position: 'outer',
                //                 alignTo: 'edge',
                //                 margin: 30,
                //                 fontWeight: 'bold',
                //                 formatter: [
                //                     '{b}',
                //                     '{c}             {d}%'
                //                 ].join('\n'),
                //             },
                //             labelLine: { //指示线状态
                //                 show: true,
                //                 length2: 500
                //             },
                //             distanceToLabelLine: 0
                //         }
                //     }
                // },
                {
                    name: '',
                    type: 'pie', //饼状图
                    radius: radius, //大小
                    // minAngle: 3,
                    center: [right, '50%'], //显示位置
                    data: this.getSeriesData(),
                    // avoidLabelOverlap: true,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                fontWeight: 'bold',
                                formatter: function (p) { //指示线对应文字，说明文字
                                    const percent = p.percent === 100?p.percent:(p.percent.toFixed(1) <= 0?p.percent.toFixed(2):p.percent.toFixed(1));
                                    if (parseInt(p.value) <= 0) {
                                        return ''
                                    }
                                    return percent + "%"
                                }
                            },
                            labelLine: { //指示线状态
                                show: false,
                                length: 5,
                                length2: 0

                            }
                        },
                    }
                },
            ]
        }

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
export default PieType;
