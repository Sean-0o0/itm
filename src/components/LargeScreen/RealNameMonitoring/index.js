import React from 'react';
import { connect } from 'dva';
import {
  FetchQueryModuleChartConfig,
} from '../../../services/largescreen';
import { message } from 'antd';
import OverallView from './CenterPage/OverallView';
import DailyReservationVolumeChart from './CenterPage/DailyReservationVolumeChart';
import AccountRealNameMonitoring from './LeftPage/AccountRealNameMonitoring';
import ExchangeBusiness from './RightPage/ExchangeBusiness';
import OffAccountFundingMonitoring from './RightPage/OffAccountFundingMonitoring';
import DayMonitoringMetrics from './LeftPage/DayMonitoringMetrics';
class RealNameMonitoring extends React.Component {
  state = {
    records: [],
  };

  componentWillMount() {
    this.fetchChartConfigData();
  }

  // 图表配置数据
  fetchChartConfigData = async () => {
    FetchQueryModuleChartConfig({
      screenPage: 14,
    }).then((res = {}) => {
      const { records = [], code = 0 } = res;
      if (code > 0) {
        this.setState({
          records: records,
        })
      }
    })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const { records = [] } = this.state;
    return (
      <div className="flex1 flex-r cont-wrap" style={{ height: 'calc(100% - 5rem)' }}>
        <div className="wid33 h100 flex-c cont-left">
          {/* 日/非日监控指标 */}
          <DayMonitoringMetrics records={records[0]} />
          {/* 未处理TOP10分公司（ 账户实名制监控 ） */}
          <AccountRealNameMonitoring records={records[5]} />
        </div>
        <div className="wid34 h100">
          {/* 总览 */}
          <OverallView records={records[1]} />
          {/* 每日预留量走势图 */}
          <DailyReservationVolumeChart/>
        </div>
        <div className="wid33 h100 flex-c">
          {/* 离柜开户/资金业务监控 */}
          <OffAccountFundingMonitoring records={records[2]} />
          {/* 未处理TOP10分公司（ 交易所业务 ） */}
          <ExchangeBusiness records={records[4]} />
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(RealNameMonitoring);
