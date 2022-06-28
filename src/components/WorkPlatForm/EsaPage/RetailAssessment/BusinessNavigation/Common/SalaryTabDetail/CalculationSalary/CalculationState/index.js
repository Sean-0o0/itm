import React, { Fragment } from 'react';
import { Steps, message } from 'antd';
import { FetchqueryPayCalSts } from '../../../../../../../../../services/EsaServices/navigation';
import QueueInfo from './QueueInfo';
import CalculatingInfo from './CalculatingInfo';
import CalculationFinishInfo from './CalculationFinishInfo';
import CheckInfo from './CheckInfo';
import ClearingFinishInfo from './ClearingFinishInfo';

const { Step } = Steps;
/**
 *  考核导航-计算薪酬-计算状态组件
 */

// 薪酬状态定时器
let statusTimer = null;
class CalculationState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payCalStsData: {},
    };
  }
  componentDidMount() {
    const { depClass, mon, orgNo } = this.props;
    const params = {
      mon,
      depClass,
      orgNo,
    };
    if (mon && orgNo) {
      this.queryPayCalSts(params);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { mon, orgNo, depClass } = nextProps;
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      const params = {
        mon,
        depClass,
        orgNo,
      };
      this.destroyTimer();
      this.queryPayCalSts(params);
    }
  }
  componentWillUnmount() {
    this.destroyTimer();
  }
  // 根据计算状态显示组件
  showCalculationState = (step) => {
    const { depClass, mon, orgNo, orgName } = this.props;
    const commonProps = {
      mon,
      orgNo,
      depClass,
      orgName,
    };
    switch (step) {
      case 0:
        return <QueueInfo {...commonProps} step={step} />;
      case 1:
        return <CalculatingInfo {...commonProps} step={step} />;
      case 2:
        return <CalculationFinishInfo {...commonProps} />;
      case 3:
        return <CheckInfo {...commonProps} step={step} />;
      case 4:
        return <ClearingFinishInfo {...commonProps} />;
      default:
        return '';
    }
  }
  // 创建定时器
  createTimer = (params) => {
    if (params.mon && params.orgNo && statusTimer === null) {
      statusTimer = setInterval(() => {
        this.queryPayCalSts(params);
      }, 5000);
    }
  }
  // 销毁定时器
  destroyTimer = () => {
    if (statusTimer !== null) {
      clearInterval(statusTimer);
    }
  }
  // 根据状态是否定时刷新
  handleStateChange = (state, params) => {
    // 状态：0|待试算;1|排队中;2|试算中;3|试算完成;4|结算审批中;5|结算完成
    if (state === '0') {
      this.destroyTimer();
    } else if (state === '1') {
      this.createTimer(params);
    } else if (state === '2') {
      this.createTimer(params);
    } else if (state === '3') {
      this.destroyTimer();
    } else if (state === '4') {
      this.createTimer(params);
    } else if (state === '5') {
      this.destroyTimer();
    }
  }
  // 薪酬计算状态查询
  queryPayCalSts = async (params) => {
    await FetchqueryPayCalSts({ ...params }).then((res) => {
      const { records = [] } = res;
      this.setState({
        payCalStsData: records[0] ? records[0] : {},
      });
      this.handleStateChange(records[0].calSts, params);
    }).catch((error) => {
      this.setState({
        payCalStsData: {},
      });
      this.destroyTimer();
      message.error(!error.success ? error.message : error.note);
    });
  };
  render() {
    const { payCalStsData = {} } = this.state;
    return (
      <Fragment>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Steps current={payCalStsData.calSts - 1} className="m-steps esa-steps esa-salaryNavigation-steps">
            <Step title="排队中" className="m-steps-item" description={payCalStsData.lineUpTime} />
            <Step title="试算中" className="m-steps-item" description={payCalStsData.trailTime} />
            <Step title="试算完成" className="m-steps-item" description={payCalStsData.trailFinishTime} />
            <Step title="结算审批中" className="m-steps-item" description={payCalStsData.settScheduleTime} />
            <Step title="结算完成" className="m-steps-item" description={payCalStsData.settFinishTime} />
          </Steps>
          {this.showCalculationState(payCalStsData.calSts - 1)}
        </div >
      </Fragment >
    );
  }
}
export default CalculationState;
