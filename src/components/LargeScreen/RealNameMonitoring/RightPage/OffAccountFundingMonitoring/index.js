import React from 'react';
import { connect } from 'dva';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import { message } from 'antd';
import {
  FetchQueryChartIndexData,
} from '../../../../../services/largescreen';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';

class OffAccountFundingMonitoring extends React.Component {
  state = {
    //指标名称
    dataName: [],
    //指标数据
    dataNum: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.records !== this.props.records) {
      this.fetchData(nextProps.records);
    }
  }

  componentWillUnmount() {
  }

  //表头数据查询
  fetchData = (records = []) => {
    FetchQueryChartIndexData({
      chartCode: records.chartCode
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          let dataName = [];
          let dataNum = [];
          data.forEach((item) => {
            dataName.push(item.GROUPNAME);
            dataNum.push(item.NUM)
          });
          this.setState({
            dataName: dataName.reverse(),
            dataNum: dataNum.reverse(),
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };



  render() {
    const { dataName = [], dataNum = [], } = this.state;
    const option = {
      // color: ['#55B6F3'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        textStyle: {
          color: '#FFFFFF'          // 图例文字颜色
        },
        data: ['单指标预警总量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          interval: 0,
          textStyle: {
            color: '#fff',
            fontSize: '12'
          },
        },
        // x轴的颜色和宽度
        axisLine: {
          lineStyle: {
            // color: '#107D9F',
            width: 0,   //这里是坐标轴的宽度,可以去掉
          }
        },
        // 控制网格线是否显示
        splitLine: {
          show: true,
          //  改变轴线颜色
          lineStyle: {
            // 使用深浅的间隔色
            color: ['rgba(0, 172, 255, 0.5)']
          }
        },
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          interval: 0,
          textStyle: {
            fontWeight: 400,
            color: '#F8F8F8',
            fontSize: '12'
          },
          formatter: function (params) {
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = 11;  //一行显示几个字
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p === rowNumber - 1) {
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr;
              }

            } else {
              newParamsName = params;
            }
            return newParamsName
          },
        },
        // y轴的颜色和宽度
        axisLine: {
          lineStyle: {
            color: '#107D9F',
            width: 1,   //这里是坐标轴的宽度,可以去掉
          }
        },
        axisTick: false,
        // data: ['非现场开户多客户关键信息相同监控', '反洗钱客户离柜开户监控', '不合格账户离柜开户监控', '离柜开户已激活的客户未建立第三方存管', '资金冻结解冻', '资金红冲蓝补',]
        data: dataName,
      },
      series: [
        {
          name: '单指标预警总量',
          type: 'bar',
          stack: 'total',
          label: {
            show: false
          },
          barWidth: 18,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 1, 0,       //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                [
                  { offset: 1, color: '#55B6F3' },
                  { offset: 0, color: '#0057B7' }
                ]
              )
            }
          },
          emphasis: {
            focus: 'series'
          },
          // data: [120, 130, 131, 153, 183, 200]
          data: dataNum,
        },
      ]
    };

    return (
      <div className="h50 pd10">
        <div className="ax-card flex-c flex1">
          <div className="card-title title-r">离柜开户/资金业务监控</div>
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
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(OffAccountFundingMonitoring);
