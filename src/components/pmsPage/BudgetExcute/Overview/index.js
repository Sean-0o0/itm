import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/custom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class Overview extends Component {
    state = {}

    render() {
        const { title = '-' } = this.props
        const data = []
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
            color: ['#5B8FF9', '#9EE6FF', '#FDCD67'],
            legend: {
                data: data,
                x: 'center',      //可设定图例在左、右、居中
                y: 'top',
                textStyle: {//图例文字的样式
                    color: '#333333',
                    fontSize: 12
                },
            },
            grid: {
                right: 24,
                bottom: 30,
                containLabel: true,
            },
            xAxis: this.getXAxisOption(),
            yAxis: this.getYAxisOption(),
            series: this.getSeriesData(),
        };

        return (
            <div className='cont-block staff-overview' style={{ margin: '24px 12px 0', padding: '0 24px' }}>
                <div style={{ color: '#303133', fontSize: 16, fontWeight: 'bold', height: '30px', lineHeight: '35px' }}>{title}</div>
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