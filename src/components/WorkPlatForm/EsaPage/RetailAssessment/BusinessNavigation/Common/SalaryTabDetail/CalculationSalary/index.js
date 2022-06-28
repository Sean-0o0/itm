import React, { Fragment } from 'react';
import { Button, message } from 'antd';
import CalculationState from './CalculationState';
import CalculationSalaryModal from './CalculationSalaryModal';
import { FetchoperatePayMenuExecFinish } from '../../../../../../../../services/EsaServices/navigation';

/**
 *  考核导航-计算薪酬组件
 */
class CalculationSalary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshNum: 0,
      calculationSalaryModalModal: {// 试算申请、结算申请、结算回退modal
        visible: false,
        operateType: '', // 操作类型 // 1|试算申请 2|结算申请 3|结算回退
        refreshNumAdd: this.refreshNumAdd,
      },
    };
  }
  // 关闭试算申请、结算申请、结算回退modal
  closeLevelCalculateModal = () => {
    const { calculationSalaryModalModal } = this.state;
    this.setState({ calculationSalaryModalModal: { ...calculationSalaryModalModal, visible: false } });
  }
  // 打开试算申请、结算申请、结算回退modal
  openLevelCalculateModal = (operateType) => {
    const { calculationSalaryModalModal } = this.state;
    this.setState({ calculationSalaryModalModal: { ...calculationSalaryModalModal, visible: true, operateType } });
  }
  trialApply = () => {
    const { ip = '', orgNo, mon, stepId, depClass } = this.props;
    // 薪酬前待办完成情况判断
    FetchoperatePayMenuExecFinish({ ip, orgNo, depClass, mon, stepId }).then((res) => {
      const { code, note } = res;
      if (code < 0) {
        message.error(note);
      } else {
        this.openLevelCalculateModal(1);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  refreshNumAdd = () => {
    const { refreshNum } = this.state;
    this.setState({ refreshNum: Number(refreshNum) + 1 });
  }
  render() {
    const btnClass = 'fcbtn m-btn-border m-btn-border-headColor btn-1c mr10';
    const { depClass, mon, orgNo, orgName, dictionary } = this.props;
    const { calculationSalaryModalModal, refreshNum } = this.state;
    const commonProps = {
      mon,
      orgNo,
      depClass,
      orgName,
      dictionary,
    };
    return (
      <Fragment>
        <div style={{ margin: '10px 0 40px 20px' }}>
          <Button type="button" className={btnClass} onClick={this.trialApply}>试算申请</Button>
          <Button type="button" className={btnClass} onClick={() => this.openLevelCalculateModal(2)}>结算申请</Button>
          <Button type="button" className={btnClass} onClick={() => this.openLevelCalculateModal(3)}> 结算回退</Button>
        </div >
        <CalculationState {...commonProps} refreshNum={refreshNum} />
        <CalculationSalaryModal {...calculationSalaryModalModal} {...commonProps} onCancel={this.closeLevelCalculateModal} />
      </Fragment >
    );
  }
}
export default CalculationSalary;
