import React, { Fragment } from 'react';
import { Table, } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/chart/line';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;



class TradingUnitTableJYCont extends React.Component {
    state = {
        loading: false,
        pageParam: {
            pageSize: 10,
            current: 1,
            total: 100,
            selectedRow: {},
            selectedRowKeys: ''
        }
    }

    render() {
        const { loading, pageParam } = this.state;
        const { } = this.props;
        const monthFormat = 'YYYY-MM';
        const month = ["2021-05", "2021-06", "2021-07", "2021-08", "2021-09", "2021-10", "2021-11", "2021-12", "2022-01", "2022-02"];
        const dataArr1 = ["130", "150", "190", "120", "140", "120", "150", "160", "150", "180", "195"];
        const dataArr2 = ["2000", "1800", "1600", "1400", "1500", "1000", "1900", "1700", "1100", "1200", "1550"];
        let option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                textStyle: {
                    color: '#aaa',
                    fontWeight: 'normal',
                    fontSize: '12',
                },
                padding: [10, 10],
                itemGap: 40,
                icon: 'circle',
                data: [
                    {
                        name: '委托笔数',
                        itemStyle: {
                            color: 'rgba(97, 151, 242, 1)',
                        },
                    },
                    {
                        name: '成本',
                        itemStyle: {
                            color: 'rgba(249, 200, 82, 1)',
                        },
                    },
                ],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                min: 0,
                data: month,
                offset: 10,
                axisLabel: {
                    color: '#A5A7AF',
                    fontSize: 12,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#A5A7AF',
                    },
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: [
                {
                    type: 'value',
                    name: '委托笔数:（笔）',
                    nameTextStyle: {
                        padding: [0, 0, 0, 6],
                        fontSize: 12,
                        color: '#A5A7AF',
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#A5A7AF',
                        fontSize: 12,
                    },
                    min: 0,
                    // 不想数据=max,可手动更改interval*7 或 (interval*6)+ 20
                    max: 300, // 最大值
                    splitNumber: 6, // 坐标轴的分割段数(预估值)
                    // interval: intervalY1, // 强制设置坐标轴分割间隔。
                },
                {
                    type: 'value',
                    name: '成本:（元）',
                    nameTextStyle: {
                        padding: [0, 0, 0, 6],
                        fontSize: 12,
                        color: '#A5A7AF',
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#A5A7AF',
                        fontSize: 12,
                    },
                    min: 0,
                    // 不想数据=max,可手动更改interval*7 或 (interval*6)+ 20
                    max: 3000, // 最大值
                    splitNumber: 6, // 坐标轴的分割段数(预估值)
                    // interval: intervalY2, // 强制设置坐标轴分割间隔。
                },
            ],
            series: [
                {
                    name: '委托笔数',
                    type: 'line',
                    data: dataArr1,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: 'rgba(97, 151, 242, 1)',
                    },
                    lineStyle: {
                        color: 'rgba(97, 151, 242, 1)',
                    },
                },
                //   rgba(97, 151, 242, 1)
                // rgba(249, 200, 82, 1)
                {
                    name: '成本',
                    type: 'line',
                    data: dataArr2,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: 'rgba(249, 200, 82, 1)',
                    },
                    lineStyle: {
                        color: 'rgba(249, 200, 82, 1)',
                    },
                },
            ],
        };

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    交易单元活跃情况
                </div>
                <div className='tradingunitlist-table-opt' style={{ margin: '2rem' }}>
                    <span style={{ color: '#5C5C5C', fontWeight: 400, }}>日期选择：<RangePicker
                        defaultValue={[moment('2021-05', monthFormat), moment('2022-02', monthFormat)]}
                        format={monthFormat}
                        separator="至"
                    /></span>
                </div>
                <div className='tradingunitlist-table-cont' >
                    <div>
                        <ReactEchartsCore
                            style={{ height: '70rem' }}
                            echarts={echarts}
                            // style={{ height, width }}
                            option={option}
                            notMerge
                            lazyUpdate
                            theme="theme_name"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default TradingUnitTableJYCont;