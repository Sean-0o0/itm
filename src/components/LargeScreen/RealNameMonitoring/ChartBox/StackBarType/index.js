import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class StackBarType extends React.Component {

  getSeriesOption = (data, colorList) => {
    let series = [];
    let flag = true; // 提示线方向  false:下  true: 上
    let flag_high_top = true; // 上方提示线高度  true：高  false 低
    let flag_high_bottom = true; // 下方提示线高度  true：高  false 低
    let total = 0;
    for(let i=0; i<data.length; i++) {
      total = total + data[i];
    }
    for(let i = 0; i < data.length; i++) {
      let item = {
          type:'bar',
          barWidth: '35%',
          stack: '占比',
          label: {
            normal: {
              align: 'center',
              verticalAlign: 'middle',
              show: true,
              position: 'left',
              formatter: function() {
                return '\t\t\t\t\t\t\t\t\t\t\t' + (data[i]/total*100).toFixed(0) + '%'
              },
              color: "#FFFFFF"
            }
          },
          itemStyle: {
            barBorderRadius : [ 0, 0, 0, 0],
            color: colorList[i]
          },
          data:[{
            value: data[i]
          }]
        };
      if(i === 0) {
        item.itemStyle.barBorderRadius = [5, 0, 0, 5];
      }
      if((data[i]/total * 100).toFixed(0) < 10) {
        if(flag) {
          if(flag_high_top) {
            let label = {
              normal: {
                align: 'center',
                distance: 19,
                verticalAlign: 'middle',
                show: true,
                position: 'top',
                formatter: function() {
                  return (data[i]/total * 100).toFixed(0) + '%\n|\n|'
                  // return ''
                },
                color: "#FFFFFF"
              }
            };
            item.label = label;
          } else {
            let label = {
              normal: {
                align: 'center',
                distance: 13,
                verticalAlign: 'middle',
                show: true,
                position: 'top',
                formatter: function() {
                  return (data[i]/total * 100).toFixed(0) + '%\n|'
                  // return ''
                },
                color: "#FFFFFF"
              }
            };
            item.label = label;
          }
          flag_high_top = !flag_high_top;
          flag = !flag;
        } else {

          if(flag_high_bottom) {
            let label = {
              normal: {
                align: 'center',
                distance: 19,
                verticalAlign: 'middle',
                show: true,
                position: 'bottom',
                formatter: function() {
                  return '|\n|\n' + (data[i]/total * 100).toFixed(0) + '%'
                  // return ''
                },
                color: "#FFFFFF"
              }
            };
            item.label = label;
          } else {
            let label = {
              normal: {
                align: 'center',
                distance: 13,
                verticalAlign: 'middle',
                show: true,
                position: 'bottom',
                formatter: function() {
                  return '|\n' + (data[i]/total * 100).toFixed(0) + '%'
                  // return ''
                },
                color: "#FFFFFF"
              }
            };
            item.label = label;
          }
          flag_high_bottom = !flag_high_bottom;
          flag = !flag;
        }

      }
      if(i === data.length - 1) {
        item.itemStyle.barBorderRadius = [0, 5, 5, 0];
      }
      series.push(item)

    }

    return series;

  };

  render() {
    const { data, colorList } = this.props;
    let total = 0;
    for(let i=0; i<data.length; i++) {
      total = total + data[i];
    }
    const option = {
      // backgroundColor:'#000E1B',
      tooltip: {
        show: true,
        formatter: function(params) {
          console.log(JSON.stringify(params));
          return (params.value / total * 100 ).toFixed(0) + '%'
        }
      },
      grid: {
        left:'10%',
        right: '10%',
        bottom: '2%',
        top: '2%',
      },
      xAxis: [{
        type :'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false,
        }
      }],
      yAxis: [{
        data: [''],
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
          }
        }

      }],
      series: this.getSeriesOption(data, colorList)
    };

    return (
      <React.Fragment>
        <ReactEchartsCore
          echarts={echarts}
          option={option}
          notMerge
          lazyUpdate
          style={{ height: '100%', width: '68rem'}}
          theme=""
        />
      </React.Fragment>
    )
  }
}
export default StackBarType;
