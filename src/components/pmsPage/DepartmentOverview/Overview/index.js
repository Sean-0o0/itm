import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/title';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class Overview extends Component {
    state = {}
    render() {
        const { order = 1 } = this.props;
        const data = [
            {
                name: '项目经理',
                value: '97'
            },
            {
                name: '开发工程师',
                value: '97'
            },
            {
                name: '运维工程师',
                value: '97'
            },
            {
                name: '架构工程师',
                value: '97'
            },
            {
                name: '产品经理',
                value: '97'
            },
            {
                name: '网络工程师',
                value: '97'
            },
            {
                name: '质量工程师',
                value: '97'
            },
            {
                name: '设计师',
                value: '97'
            }
        ]
        const length = Math.ceil(data.length/2);
        const option = {
            color: ['#3361FF', '#86E0FF', '#FDC041', '#FF8D84', 
                '#F2A1C3', '#DA6D5D', '#F49B5A', '#5B6BB9', '#00ACFF','#BA00FF'],
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}&nbsp;&nbsp;&nbsp;{d}%'
            },
            legend: [{
                left: '38%',
                y: 'center',
                data: data.length > length ? data.slice(0, length) : data,
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
                        temp = name.substring(0, 7) + '...';
                        return `{labelMark|${temp}}${tarValue}`;
                    }
                    else {
                        return `{labelMark|${name}}${tarValue}`;
                    }

                },
                orient: 'vertical',
                textStyle: {
                    color: "#606266",
                    fontSize: 12,
                    rich: {
                        // 给labelMark添加样式
                        labelMark: {
                            width: 90
                        }
                    }
                },
                icon: "circle",
                itemGap: 15,
                itemHeight: 8,
                itemWidth: 8,
            }, {
                left: '67%',
                y: 'center',
                data: data.length > length ? data.slice(length) : [],
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
                        temp = name.substring(0, 7) + '...';
                        return `{labelMark|${temp}}${tarValue}`;
                    }
                    else {
                        return `{labelMark|${name}}${tarValue}`;
                    }

                },
                orient: 'vertical',
                textStyle: {
                    color: "#606266",
                    fontSize: 12,
                    rich: {
                        // 给labelMark添加样式
                        labelMark: {
                            width: 90
                        }
                    }
                },
                icon: "circle",
                itemGap: 15,
                itemHeight: 8,
                itemWidth: 8,
            }],
            series: [
                {
                    name: '',
                    type: 'pie', //饼状图
                    radius: ['45%', '65%'], //大小
                    center: ['20%', '50%'], //显示位置
                    data: data,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    avoidLabelOverlap: true,
                    label: {
                        color: '#fff',
                        show: false,
                    },
                    labelLine: { //指示线状态
                        show: false,
                    }
                },
                {
                    name: '',
                    type: 'pie', //饼状图
                    radius: ['45%', '65%'], //大小
                    center: ['20%', '50%'], //显示位置
                    data: data,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    avoidLabelOverlap: true,
                    label: {
                        color: '#fff',
                        show: false,
                    },
                    labelLine: { //指示线状态
                        show: false,
                    }
                }
            ]
        }

        return (
            <div className='cont-block staff-overview' style={{ margin: order === 1 ? '0px 12px 0px 24px' : '0px 24px 0px 12px', padding: '0 24px' }}>
                <div style={{color: '#303133',fontSize: 16, fontWeight: 'bold', height: '30px', lineHeight: '35px'}}>自研团队建设</div>
                <React.Fragment>
                    <ReactEchartsCore
                        echarts={echarts}
                        option={option}
                        notMerge
                        lazyUpdate
                        style={{ height: 'calc(100% - 30px)' }}
                        theme=""
                    />
                </React.Fragment>
            </div>
        );
    }
}

export default Overview;