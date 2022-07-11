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
        return ['#E23C39', '#FE8B46', '#F7B432', '#EDED19', '#00ACFF',
            '#157EF4', '#4F1AFA', '#7200FF', '#BA00FF', '#FD60E1']
    }

    render() {
        const { data = [] } = this.props;

        const option = {
            color: this.getColorOption(),
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}&nbsp;&nbsp;&nbsp;{d}%'
            },
            legend: [{
                left: '39%',
                y: 'center',
                data: data.length > 5 ? data.slice(0, 5) : data,
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
                        return temp + '  ' + tarValue;
                    }
                    else {
                        return name + '  ' + tarValue;
                    }
                },
                orient: 'vertical',
                textStyle: {
                    color: "#fff",
                    fontSize: 10
                },
                icon: "roundRect",
                itemGap: 15,
                itemHeight: 8,
                itemWidth: 8,
            }, {
                left: '68%',
                y: 'center',
                data: data.length > 5 ? data.slice(5) : [],
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
                        return temp + '  ' + tarValue;
                    }
                    else {
                        return name + '  ' + tarValue;
                    }


                },
                orient: 'vertical',
                textStyle: {
                    color: "#fff",
                    fontSize: 10
                },
                icon: "roundRect",
                itemGap: 15,
                itemHeight: 8,
                itemWidth: 8,
            }],
            series: [
                {
                    name: '',
                    type: 'pie', //饼状图
                    radius: '60%', //大小
                    center: ['20%', '50%'], //显示位置
                    data: data,
                    avoidLabelOverlap: true,
                    label: {
                        color: '#fff',
                        show: true,
                        position: 'outside',
                        fontSize: 10,
                        formatter: function (p) { //指示线对应文字，说明文字
                            const percent = p.percent === 100 ? p.percent : (p.percent.toFixed(1) <= 0 ? p.percent.toFixed(2) : p.percent.toFixed(1));
                            if (parseFloat(p.percent) > 10) {
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
                {
                    name: '',
                    type: 'pie', //饼状图
                    radius: '60%', //大小
                    center: ['20%', '50%'], //显示位置
                    data: data,
                    avoidLabelOverlap: true,
                    label: {
                        color: '#fff',
                        show: true,
                        position: 'inside',
                        fontSize: 10,
                        formatter: function (p) { //指示线对应文字，说明文字
                            const percent = p.percent === 100 ? p.percent : (p.percent.toFixed(1) <= 0 ? p.percent.toFixed(2) : p.percent.toFixed(1));
                            if (parseFloat(p.percent) <= 10) {
                                return ''
                            }
                            return percent + "%"
                        }
                    }
                }
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
