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

class LableLinePieType extends React.Component {
    state = {
        datas: [],
    };
    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";;
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
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
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
                    value: valueData[0] || 0,
                };
                data.push(tmpl);
                // }
            }
        };
        return data;
    };

    render() {
        const { configData = {} } = this.props;
        const { chartCode = '',leftVerticalUnit='' } = configData;
        // const { screenPage = '' } = configData;
        let radius = '60%';
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
              show:false,
              orient: 'vertical',
              left: 'left',
              textStyle:{
                color:'white',
              },
              // 重写legend显示样式--在名称后显示百分比
              // formatter: function(name) {
              //   // 获取legend显示内容
              //   let data = option.series[0].data;
              //   let total = 0;
              //   let tarValue = 0;
              //   for (let i = 0, l = data.length; i < l; i++) {
              //     total += parseInt(data[i].value);
              //     if (data[i].name == name) {
              //       tarValue = data[i].value;
              //     }
              //   }
              //   let p = (tarValue / total * 100).toFixed(2);
              //   return name + ' ' + ' ' + tarValue + `${leftVerticalUnit}`;
              // },
            },
            series: [
                {
                    name: '',
                    type: 'pie', //饼状图
                    radius: radius, //大小
                    center: ['50%', '60%'],
                    minAngle: 2,
                    //center: ['75%', '40%'], //显示位置
                    data: this.getSeriesData(),
                    avoidLabelOverlap: true,
                    label: {
                        //射线
                        show: true,
                        position: 'outer',
                        alignTo: 'edge',
                        margin: 20,
                        fontSize: 12,
                        fontWeight: 'bold',
                        //饼图图形上的文本标签
                        // normal:{
                        //   show:true,
                        //   position:'inner', //标签的位置
                        //   textStyle : {
                        //     fontWeight : 300 ,
                        //     fontSize : 16    //文字的字体大小
                        //   },
                        //   formatter:'{b} {c}（{d}%）'
                        // },
                        formatter(p) {
                            let text = p.name;
                            let value_format = p.value;
                            const percent = p.percent === 100 ? p.percent : (p.percent.toFixed(1) <= 0 ? p.percent.toFixed(2) : p.percent.toFixed(1));
                            // if (parseInt(p.value) <= 0) {
                            //     return ''
                            // }
                            const valLength = text.length;//X轴类目项的文字个数

                            if (valLength > 9) {
                                let temp = "";//每次截取的字符串
                                temp = text.substring(0, 8) + '...';
                                return `${temp}\n\n${value_format}            ${percent}%`;
                            } else {
                                return `${text}\n\n${value_format}            ${percent}%`;
                            }

                        },
                        distanceToLabelLine: 0
                    },
                    labelLine: { //指示线状态
                        show: true,
                        length2: 500
                    },
                },
            ]
        }

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
export default LableLinePieType;
