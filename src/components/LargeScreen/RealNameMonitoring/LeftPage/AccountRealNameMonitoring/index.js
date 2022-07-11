import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ChartBox from '../../ChartBox';
import {
  FetchQueryChartIndexData,
} from '../../../../../services/largescreen';

class AccountRealNameMonitoring extends React.Component {
  state = {
    top10BacklogNumber: [],
    xAxisData: [], //x轴数据
    moduleCharts: [],//指标状态说明
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
          let top10BacklogNumber = [];
          let xAxisData = [];
          data.forEach((item) => {
            top10BacklogNumber.push(item.NUM);
            xAxisData.push(item.GROUPNAME)
          });
          this.setState({
            top10BacklogNumber: top10BacklogNumber,
            xAxisData: xAxisData,
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const { top10BacklogNumber = [], xAxisData = [], moduleCharts = {},} = this.state;
    // const { dispatch } = this.props;

    return (
      <div className="h50 pd10">
        <ChartBox
          data={top10BacklogNumber}
          // data={top10BusVolDIsCom}
          xAxisData={xAxisData}
          yAxisName={''}
          tClass='title-l'
          title='未处理TOP10分公司（ 账户实名制监控 ）'
          chartType='2'
          chartConfig={moduleCharts[2]} />
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(AccountRealNameMonitoring);
