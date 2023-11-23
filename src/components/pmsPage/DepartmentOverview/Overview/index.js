import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/radar';
import ReactEchartsCore from 'echarts-for-react/lib/core';

class Overview extends Component {
  state = {};

  render() {
    const { order = 1, title = '-', dataSource = [] } = this.props;
    const length = Math.ceil(dataSource.length / 2);
    let data = [];
    dataSource.forEach(element => {
      const { GW = '', RYSL = '' } = element;
      data.push({
        name: GW,
        value: RYSL,
      });
    });
    const option = {
      color: [
        '#3361FF',
        '#86E0FF',
        '#FDC041',
        '#FF8D84',
        '#F2A1C3',
        '#DA6D5D',
        '#F49B5A',
        '#5B6BB9',
        '#00ACFF',
        '#BA00FF',
        'rgba(218, 109, 93, 0.5)',
        'rgba(255, 141, 132, 0.5)',
      ],
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}&nbsp;&nbsp;&nbsp;{d}%',
      },
      legend: [
        {
          left: '38%',
          y: 'center',
          data: data.length > length ? data.slice(0, length) : data,
          tooltip: {
            show: true,
          },
          formatter: function(name) {
            // 获取legend显示内容
            let data = option.series[0].data;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
              if (data[i].name === name) {
                tarValue = parseInt(data[i].value);
              }
            }
            const valLength = name.length; //X轴类目项的文字个数
            if (valLength > 8) {
              let temp = ''; //每次截取的字符串
              temp = name.substring(0, 7) + '...';
              return `{labelMark|${temp}}${tarValue}`;
            } else {
              return `{labelMark|${name}}${tarValue}`;
            }
          },
          orient: 'vertical',
          textStyle: {
            color: '#606266',
            fontSize: 13,
            rich: {
              // 给labelMark添加样式
              labelMark: {
                width: 90,
              },
            },
          },
          icon: 'circle',
          itemGap: 10,
          itemHeight: 8,
          itemWidth: 8,
        },
        {
          left: '67%',
          y: 'center',
          data: data.length > length ? data.slice(length) : [],
          tooltip: {
            show: true,
          },
          formatter: function(name) {
            // 获取legend显示内容
            let data = option.series[0].data;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
              if (data[i].name === name) {
                tarValue = parseInt(data[i].value);
              }
            }
            const valLength = name.length; //X轴类目项的文字个数
            if (valLength > 8) {
              let temp = ''; //每次截取的字符串
              temp = name.substring(0, 7) + '...';
              return `{labelMark|${temp}}${tarValue}`;
            } else {
              return `{labelMark|${name}}${tarValue}`;
            }
          },
          orient: 'vertical',
          textStyle: {
            color: '#606266',
            fontSize: 13,
            rich: {
              // 给labelMark添加样式
              labelMark: {
                width: 90,
              },
            },
          },
          icon: 'circle',
          itemGap: 15,
          itemHeight: 8,
          itemWidth: 8,
        },
      ],
      series: [
        {
          name: '',
          type: 'pie', //饼状图
          radius: ['50%', '70%'], //大小
          center: ['20%', '50%'], //显示位置
          data: data,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          avoidLabelOverlap: true,
          label: {
            color: '#fff',
            show: false,
          },
          labelLine: {
            //指示线状态
            show: false,
          },
        },
        {
          name: '',
          type: 'pie', //饼状图
          radius: ['50%', '70%'], //大小
          center: ['20%', '50%'], //显示位置
          data: data,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
            formatter: params => {
              const num = data?.filter(x => x.name === params.name)[0].value;
              return `{a|${params.name}}\n{b|${num}}`;
            },
            color: 'black',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            textStyle: {
              rich: {
                a: {
                  fontSize: 14,
                  color: '#606266',
                  lineHeight: 29,
                },
                b: {
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#222222',
                },
              },
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '13',
            },
          },
          labelLine: {
            //指示线状态
            show: false,
          },
        },
      ],
    };

    return (
      <div
        className="cont-block staff-overview"
        style={{
          margin: order === 1 ? '0px 12px 0px 24px' : '0px 24px 0px 12px',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            color: '#303133',
            fontSize: 16,
            fontWeight: 'bold',
            height: '40px',
            lineHeight: '48px',
          }}
        >
          {title}
        </div>
        <React.Fragment>
          <ReactEchartsCore
            echarts={echarts}
            option={option}
            notMerge
            lazyUpdate
            style={{ height: length<= 6 ? 200 : 200 + (length - 6) * 20 }}
            theme=""
          />
        </React.Fragment>
      </div>
    );
  }
}

export default Overview;
