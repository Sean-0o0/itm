import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { format } from 'prettier';
export default function XmbcTab() {
    const xmbqChartRef = useRef(null);
    useEffect(() => {
        const dataCake = [
            { value: 80, name: '自研开发' },
            { value: 102, name: '合作开发' },
        ];
        const xmbqChartOption = {
            // tooltip: {
            //     trigger: 'item'
            // },
            legend: {
                orient: 'vertical',
                left: '50%',  //图例距离左的距离
                y: 'center',  //图例上下居中
                itemGap: 20,
                // formatter: function (name) {
                //     let target, percentage;
                //     for (let i = 0; i < dataCake.length; i++) {
                //         if (dataCake[i].name === name) {
                //             target = dataCake[i].value
                //             percentage = dataCake[i].percentage
                //         }
                //     }
                //     let arr = [name + ' ', " " + target + "人 ", " " + percentage]
                //     return arr.join(" ")
                // },
            },
            series: [
                {
                    // name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    center: ['25%', '50%'],
                    label: {
                        show: false,
                        position: 'center',
                        formatter: (params)=>{
                            return [
                                params.name, `${params.percent}%`
                            ].join('\n');
                        },
                        // rich: {
                        //     a: {
                        //         marginBottom: '3px'
                        //     }
                        // },
                        color: 'black',                   
                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '14',
                            // fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: dataCake,
                }
            ],
            color: ['#3361FF', '#FDC041']
        };
        const xmbqChart = echarts.init(xmbqChartRef.current);
        xmbqChart.setOption(xmbqChartOption);
        return () => {
            xmbqChart.dispose();
        };
    }, []);
    const getXmbqColumn = (category, quantity, amount, hour) => {
        return (
            <div className='xmbq-column'>
                <div className='xmbq-row1'>{category}</div>
                <div className='xmbq-row2'>{quantity}</div>
                <div className='xmbq-row3'>{amount}</div>
                <div className='xmbq-row4'>{hour}</div>
            </div>
        );
    }
    return (
        <div className='xmbq-box'>
            <div className='xmbq-graph' ref={xmbqChartRef}></div>
            <div className='xmbq-table'>
                {getXmbqColumn("项目类别","项目数量","项目金额","项目工时")}
                {getXmbqColumn("信创项目","35个","25000万","2500人天")}
                {getXmbqColumn("信创项目","35个","25000万","2500人天")}
            </div>
        </div>
    );
}
