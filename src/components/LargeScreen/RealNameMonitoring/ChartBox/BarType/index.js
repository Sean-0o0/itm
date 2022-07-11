import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class BarType extends React.Component {
    // 获取x轴配置
    getXAxisOption = () => {
        const { xAxisData = [], type = '' } = this.props;
        let maxLength = 2;
        if(type === 'top5'){
            maxLength = 4;
        }
        const xAxis = {
            data: xAxisData,
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
                    color: '#fff',   //这里用参数代替了
                    // fontSize: fontSize
                },
                interval: 0,
                formatter: function (value) {
                    let ret = "";//拼接加\n返回的类目项
                    const valLength = value.length;//X轴类目项的文字个数
                    const rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                      if (rowN > 1)//如果类目项的文字大于5,
                    {
                        for (var i = 0; i < rowN; i++) {
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
      const { yAxisName = '' } = this.props;
        let yAxis = {};
        yAxis = {
            name: yAxisName,
            nameTextStyle: {
                color: '#fff',
                align: 'right'
            },
            nameGap: 5,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                },
            },
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
            max: 5000
        }
        return yAxis;
    };

    // 获取数据
    getSeriesData = () => {
        const { data = [], type = '', gradientColor = 'false', } = this.props
        let series = [];
        let barWidth = '40%';
        if(type === "top5"){
            barWidth = '20%';
        }
        if(gradientColor) {
          series.push({
            type: 'bar',
            data: data,
            showBackground: true,
            barWidth: barWidth,
            label: {
              show: true,
              position: 'top',
              color: '#fff',
              backgroundColor: '#040F27',
              borderRadius: 2,
              padding: [5, 5, 2, 5]
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 1, 0, 0,       //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                    [
                        {offset: 1, color: '#55B6F3'},
                        {offset: 0, color: '#0057B7'}
                    ]
                  )
              }
            }
          });
          return series;

        } else {
          series.push({
            type: 'bar',
            data: data,
            showBackground: true,
            barWidth: barWidth,
            label: {
              show: true,
              position: 'top',
              color: '#fff',
              backgroundColor: '#040F27',
              borderRadius: 2,
              padding: [5, 5, 2, 5]
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 1, 0, 0,
                  [
                    {offset: 1, color: '#55B6F3'},
                    {offset: 0, color: '#0057B7'}
                    // { offset: 0, color: 'rgba(0, 87, 183, 1)' },     //柱图渐变色
                    // { offset: 1, color: 'rgba(0, 87, 183, 0.1)' },   //柱图渐变色
                  ])
              }
            }
          });
          return series;
        }

    };

    render() {
      const {yAxisName = ''} = this.props;
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
            grid: {
                left:'15%',
                right: '10%',
                bottom: '15%',
                top: '15%',
            },
            xAxis: this.getXAxisOption(),
            yAxis: this.getYAxisOption(),
            series: this.getSeriesData()
        };
        return (
            <React.Fragment>
                <ReactEchartsCore
                    echarts={echarts}
                    option={option}
                    notMerge
                    lazyUpdate
                    style={{height: '100%'}}
                    theme=""
                />
            </React.Fragment>
        )
    }
}
export default BarType;
