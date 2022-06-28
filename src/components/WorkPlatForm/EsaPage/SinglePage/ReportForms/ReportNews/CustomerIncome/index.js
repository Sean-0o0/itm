import React from 'react';
import { Row, Card, Col } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts-liquidfill/src/liquidFill.js';  // eslint-disable-line


class CustomerIncome extends React.Component {
  render() {
    const leftPieOption = {
      title: {
        text: '访问次数占比',
        x: 'left',
        y: 'top',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 60,
        top: 50,
        data: ['佣金收入', '息费收费', '其他收入'],
      },
      color: ['#DE5567', '#58BFC1', '#4090F7'],
      series: [
        {
          name: '访问次数占比',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 927890.42, name: '佣金收入' },
            { value: 775955.96, name: '息费收费' },
            { value: 450284.83, name: '其他收入' },
          ],
        },
      ],
    };
    const midPieOption = {
      title: {
        text: '访问次数占比',
        x: 'left',
        y: 'top',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 60,
        top: 50,
        data: ['约定购回余额', '股票质押余额', '融资融券余额'],
      },
      color: ['#DE5567', '#58BFC1', '#4090F7'],
      series: [
        {
          name: '访问次数占比',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 927890.42, name: '约定购回余额' },
            { value: 775955.96, name: '股票质押余额' },
            { value: 450284.83, name: '融资融券余额' },
          ],
        },
      ],
    };
    const rightPieOption = {
      title: {
        text: '访问次数占比',
        x: 'left',
        y: 'top',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 60,
        top: 50,
        data: ['融资类资产', '理财产品类', '普通证券类'],
      },
      color: ['#DE5567', '#58BFC1', '#4090F7'],
      series: [
        {
          name: '访问次数占比',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            { value: 927890.42, name: '融资类资产' },
            { value: 775955.96, name: '理财产品类' },
            { value: 450284.83, name: '普通证券类' },
          ],
        },
      ],
    };

    const leftOption = {
      color: ['#3398DB'],
      legend: {
        data: ['收入', '环比%'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        // formatter: params => this.handleData(params),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['2019-01', '2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
          // name: '单位：万',
          type: 'value',
        },
        {
          splitLine: {
            show: false,
          },
          name: '环比%',
          type: 'value',
        },
      ],
      series: [
        {
          name: '收入',
          type: 'bar',
          stack: '客户资金',
          barWidth: '60%',
          yAxisIndex: '0',
          data: [100000, 120000, 90000, 108000, 109000, 100600, 100060, 79000, 100000, 110000, 80000, 100000],
          itemStyle: {
            normal: {
              color: '#82cdf3',
            },
          },
        },
        {
          name: '环比%',
          type: 'line',
          data: [2, 3, 5, 4, 3, 7, 8, 4, 5, 4, 4, 3],
          yAxisIndex: '1',
          itemStyle: {
            normal: {
              color: '#e52a33',
              lineStyle: {
                color: '#e52a33',
              },
            },
          },
        },
      ],
    };

    const rightOption = {
      color: ['#3398DB'],
      legend: {
        data: ['资产', '环比%'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        // formatter: params => this.handleData(params),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['2019-01', '2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
            },
          },
          // name: '单位：万',
          type: 'value',
        },
        {
          splitLine: {
            show: false,
          },
          name: '环比',
          type: 'value',
        },
      ],
      series: [
        {
          name: '资产',
          type: 'bar',
          stack: '客户资金',
          barWidth: '60%',
          yAxisIndex: '0',
          data: [100000, 100000, 90000, 108000, 109000, 10600, 100060, 79000, 100000, 90000, 80000, 100000],
          itemStyle: {
            normal: {
              color: '#82cdf3',
            },
          },
        },
        {
          name: '环比%',
          type: 'line',
          data: [2, 3, 5, 4, 3, -7, 8, 4, 5, 4, 4, 3],
          yAxisIndex: '1',
          itemStyle: {
            normal: {
              color: '#e52a33',
              lineStyle: {
                color: '#e52a33',
              },
            },
          },
        },
      ],
    };
    return (
      <React.Fragment>
        <Row>
          <Card className="m-card" title={<div style={{ fontWeight: '900' }}>高端客户资产及业务收入情况简报</div>}>
            <Row>
              <Col span={8} style={{ padding: '0 2rem 2rem 2rem', border: '1px solid rgba(240,240,240,0.8 )' }}>
                <div style={{ position: 'relative', height: '30px', lineHeight: '30px', fontWeight: '900' }}><span style={{ width: '3px', height: '10px', position: 'absolute', top: '10px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />收入贡献</div>
                <div>总收入贡献(万元)<i className="icon-font icon-font-cash" /><span style={{ float: 'right', fontWeight: '900', fontSize: '20px' }}>803846.37</span></div>
                <ReactEchartsCore
                  echarts={echarts}
                  style={{ height: '15rem', width: '100%' }}
                  option={leftPieOption}
                  notMerge
                  lazyUpdate
                  theme="theme_name"
                />
              </Col>
              <Col span={8} style={{ padding: '0 2rem 2rem 2rem', border: '1px solid rgba(240,240,240,0.8 )' }}>
                <div style={{ position: 'relative', height: '30px', lineHeight: '30px', fontWeight: '900' }}><span style={{ width: '3px', height: '10px', position: 'absolute', top: '10px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />业务情况</div>
                <div>总融资余额(万元)<i className="icon-font icon-font-cash" /><span style={{ float: 'right', fontWeight: '900', fontSize: '20px' }}>803846.37</span></div>
                <ReactEchartsCore
                  echarts={echarts}
                  style={{ height: '15rem', width: '100%' }}
                  option={midPieOption}
                  notMerge
                  lazyUpdate
                  theme="theme_name"
                />
              </Col>
              <Col span={8} style={{ padding: '0 2rem 2rem 2rem', border: '1px solid rgba(240,240,240,0.8 )' }}>
                <div style={{ position: 'relative', height: '30px', lineHeight: '30px', fontWeight: '900' }}><span style={{ width: '3px', height: '10px', position: 'absolute', top: '10px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />资产情况</div>
                <div>总资产(万元)<i className="icon-font icon-font-cash" /><span style={{ float: 'right', fontWeight: '900', fontSize: '20px' }}>803846.37</span></div>
                <ReactEchartsCore
                  echarts={echarts}
                  style={{ height: '15rem', width: '100%' }}
                  option={rightPieOption}
                  notMerge
                  lazyUpdate
                  theme="theme_name"
                />
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ padding: '0 2rem 2rem 2rem', border: '1px solid rgba(240,240,240,0.8 )' }}>
                <div style={{ position: 'relative', height: '30px', lineHeight: '30px', fontWeight: '900' }}><span style={{ width: '3px', height: '10px', position: 'absolute', top: '10px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />月度收入变动趋势(万元)</div>
                <ReactEchartsCore
                  echarts={echarts}
                  style={{ height: '15rem', width: '100%' }}
                  option={leftOption}
                  notMerge
                  lazyUpdate
                  theme="theme_name"
                />
              </Col>
              <Col span={12} style={{ padding: '0 2rem 2rem 2rem', border: '1px solid rgba(240,240,240,0.8 )' }}>
                <div style={{ position: 'relative', height: '30px', lineHeight: '30px', fontWeight: '900' }}><span style={{ width: '3px', height: '10px', position: 'absolute', top: '10px', left: '-10px', backgroundColor: 'rgb(44, 170, 228)' }} />月度资产变动趋势(万元)</div>
                <ReactEchartsCore
                  echarts={echarts}
                  style={{ height: '15rem', width: '100%' }}
                  option={rightOption}
                  notMerge
                  lazyUpdate
                  theme="theme_name"
                />
              </Col>
            </Row>
          </Card>
        </Row>
      </React.Fragment>
    )
  }
}
export default CustomerIncome;