import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
export default function XmbcTab() {
    const xmbqChartRef = useRef(null);

    useEffect(() => {
        const dataCake = [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
        ];
        const xmbqChartOption = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: '50%',  //图例距离左的距离
                y: 'center',  //图例上下居中
                itemGap: 20,
                formatter: function (name) {
                    let target, percentage;
                    for (let i = 0; i < dataCake.length; i++) {
                        if (dataCake[i].name === name) {
                            target = dataCake[i].value
                            percentage = dataCake[i].percentage
                        }
                    }
                    let arr = [name + ' ', " " + target + "人 ", " " + percentage]
                    return arr.join(" ")
                },
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    center: ['25%', '50%'],
                    label: {
                        show: false,
                        // position: 'left'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: dataCake,
                }
            ]
        };
        const xmbqChart = echarts.init(xmbqChartRef.current);
        xmbqChart.setOption(xmbqChartOption);
        return () => {
            xmbqChart.dispose();
        };
    }, []);
    const getXmbqColumn = () => {
        return (
            <div className='xmbq-column'>
                <div className='xmbq-row1'>1</div>
                <div className='xmbq-row2'>1</div>
                <div className='xmbq-row3'>1</div>
                <div className='xmbq-row4'>1</div>
            </div>
        );
    }
    return (
        <div className='xmbq-box'>
            <div className='xmbq-graph' ref={xmbqChartRef}></div>
            <div className='xmbq-table'>
                {getXmbqColumn()}
                {getXmbqColumn()}
                {getXmbqColumn()}
            </div>
        </div>
    );
}
