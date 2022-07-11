import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class PieType extends React.Component {

    // 获取color配置
    getColorOption = () => {
        const color = ['rgba(226, 60, 57, 1)', 'rgba(247, 180, 50, 1)', 'rgba(21, 126, 244, 1)', 'rgba(237, 237, 25, 1)', 'rgba(0, 172, 255, 1)',
            'rgba(253, 96, 225, 1)', 'rgba(205,129,98,1)', 'rgba(139,137,137,1)', 'rgba(106, 90, 205, 1)', 'rgba(245, 222, 179, 1)'];
        const { data } = this.props;
        const tmpl = [];
        for (let i = 0; i < data.length; i++) {
            tmpl.push(color[i])
        }
        return tmpl;
    }

    render() {
        const { data } = this.props;
        const option = {
            color: this.getColorOption(),
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}&nbsp;&nbsp;&nbsp;({d}%)'
            },
            legend: {
                // type: 'scroll',
                right: '10%',
                y: 'center',
                itemHeight: 7,
                itemGap: 4,
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
                    if (valLength > 8) {
                        let temp = "";//每次截取的字符串  
                        temp = name.substring(0, 8) + '...';
                        return temp + ' : ' + tarValue;
                    }
                    else {
                        return name + ' : ' + tarValue;
                    }
                },
                orient: 'vertical',
                textStyle: {
                    color: "#fff",
                    fontSize: 10
                },
                icon: "circle"
            },
            series: [
                // {
                //     name: '',
                //     type: 'pie', //饼状图
                //     minAngle: 12,
                //     radius: '70%', //大小
                //     center: ['50%', '60%'], //显示位置
                //     data: data ? data : [],
                //     avoidLabelOverlap: true,
                //     itemStyle: {
                //         normal: {
                //             label: {
                //                 show: true,
                //                 position: 'outer',
                //                 alignTo: 'edge',
                //                 margin: 0,
                //                 fontWeight: 'bold',
                //                 formatter: '{b}: {c}'
                //             },
                //         }
                //     }
                // },
                {
                    name: '',
                    type: 'pie', //饼状图
                    minAngle: 15,
                    radius: '70%', //大小
                    center: ['35%', '50%'], //显示位置
                    data: data ? data : [],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                alignTo: 'labelLine',
                                fontWeight: 'bold',
                                fontSize: 12,
                                formatter: function (p) { //指示线对应文字，说明文字
                                    const percent = p.percent === 100?p.percent:p.percent.toFixed(1);
                                    if (percent <= 0) {
                                        return ''
                                    }
                                    return percent + "%"
                                }
                            },
                            labelLine: { //指示线状态
                                show: false,
                                length: 0,
                                length2: 2

                            }
                        }
                    }
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
export default PieType;
