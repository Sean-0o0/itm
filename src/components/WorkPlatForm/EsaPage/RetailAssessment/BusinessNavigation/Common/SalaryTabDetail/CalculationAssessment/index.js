/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React, { Fragment } from 'react';
import { Button, message } from 'antd';
import ScoreDetailTable from './ScoreDetailTable';
import AccountManagerTable from './AccountManagerTable';
import AssessmentSalaryTable from './AssessmentSalaryTable';
import LevelCalculationModal from './LevelCalculationModal';
import LevelAdjustModal from './LevelAdjustModal';
import StockbrokerLevelAdjustModal from './StockbrokerLevelAdjustModal';
import { FetchoperateExamMenuExecFinish } from '../../../../../../../../services/EsaServices/navigation';

/**
 *  考核导航-计算考核组件
 */

class CalculationAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      levelCalculationModal: {// 级别计算modal
        visible: false,
        operateType: '', // 操作类型 // 0|级别计算 2|完成级别考核
        refreshNumAdd: this.refreshNumAdd,
      },
      levelAdjustModal: {// 手工级别调整modal
        visible: false,
        selectData: {},
        refreshNumAdd: this.refreshNumAdd,
      },
      stockbrokerLevelAdjustModal: {// 证券经纪人级别转换调整modal
        visible: false,
      },
      selectData: {},
      refreshNum: 0,
      empNo: '',
    };
  }
  // 手工级别调整
  onManualAdjustment = () => {
    const { selectData } = this.state;
    if (selectData.id) {
      this.openLevelAdjustModal(selectData);
    } else {
      message.warning('请选择一条记录!');
    }
  }
  //  打开手工级别调整弹出框
  openLevelAdjustModal = (selectData) => {
    const { levelAdjustModal } = this.state;
    this.setState({ levelAdjustModal: { ...levelAdjustModal, visible: true, selectData } });
  }
  //  关闭手工级别调整弹出框
  closeLevelAdjustModal = () => {
    const { levelAdjustModal } = this.state;
    this.setState({ levelAdjustModal: { ...levelAdjustModal, visible: false } });
  }
  // 关闭级别计算，完成级别考核modal
  closeLevelCalculateModal = () => {
    const { levelCalculationModal } = this.state;
    this.setState({ levelCalculationModal: { ...levelCalculationModal, visible: false } });
  }

  // 打开级别计算，完成级别考核级别计算modal
  openLevelCalculateModal = (operateType) => {
    const { levelCalculationModal } = this.state;
    if (operateType === 0) {
      const { ip = '', orgNo, mon, stepId, depClass } = this.props;
      // 考核前待办完成情况判断
      FetchoperateExamMenuExecFinish({ ip, orgNo, mon, stepId, depClass }).then((res) => {
        const { code, note } = res;
        if (code < 0) {
          message.error(note);
        } else {
          this.setState({ levelCalculationModal: { ...levelCalculationModal, visible: true, operateType } });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else {
      this.setState({ levelCalculationModal: { ...levelCalculationModal, visible: true, operateType } });
    }
  }

  //  打开证券经纪人级别转换调整弹出框
  openStockbrokerLevelAdjustModal = () => {
    const { stockbrokerLevelAdjustModal } = this.state;
    this.setState({ stockbrokerLevelAdjustModal: { ...stockbrokerLevelAdjustModal, visible: true } });
  }
  //  关闭证券经纪人级别转换调整弹出框
  closeStockbrokerLevelAdjustModal = () => {
    const { stockbrokerLevelAdjustModal } = this.state;
    this.setState({ stockbrokerLevelAdjustModal: { ...stockbrokerLevelAdjustModal, visible: false } });
  }
  selectRowData = (record) => {
    this.setState({ selectData: record });
  }
  resetSelectData = () => {
    this.setState({ selectData: {} });
  }
  refreshNumAdd = () => {
    const { refreshNum } = this.state;
    this.setState({ refreshNum: Number(refreshNum) + 1 });
  }
  render() {
    const { depClass, mon, orgNo, orgName, dictionary } = this.props;
    const { levelCalculationModal, stockbrokerLevelAdjustModal, refreshNum, levelAdjustModal, selectData } = this.state;
    const { empNo = '' } = selectData;
    const commonProps = {
      mon,
      orgNo,
      depClass,
      orgName,
      dictionary,
      empNo,
    };
    const btnClass = 'fcbtn m-btn-border m-btn-border-headColor btn-1c mr10';
    return (
      <Fragment>
        <div style={{ margin: '10px 0 0 20px' }}>
          {depClass === 1 ? (
            <div><Button type="button" className={btnClass} onClick={() => this.openLevelCalculateModal(0)}>级别计算</Button>
              <Button type="button" className={btnClass} onClick={() => this.onManualAdjustment()}>手工级别调整</Button>
              <Button type="button" className={btnClass} onClick={() => this.openLevelCalculateModal(1, 1)}>完成级别考核</Button>
              <AccountManagerTable {...commonProps} selectRowData={this.selectRowData} refreshNum={refreshNum} />
              <ScoreDetailTable {...commonProps} refreshNum={refreshNum} />
            </div>
          ) : depClass === 2 || depClass === 3 ? (
            <div>
              <Button type="button" className={btnClass} onClick={() => this.openLevelCalculateModal(0)}>级别计算</Button>
              <Button type="button" className={btnClass} onClick={() => this.onManualAdjustment()}>手动级别调整</Button>
              {/* <Button type="button" className={btnClass} onClick={() => this.openStockbrokerLevelAdjustModal()}>证券经纪人级别转换调整</Button>
            <Button type="button" className={btnClass}>合同自动续约</Button> */}
              <Button type="button" className={btnClass} onClick={() => this.openLevelCalculateModal(1)}>完成级别考核</Button>
              {/* <Button type="button" className={btnClass}>转为一般经纪人</Button>
            <Button type="button" className={btnClass}>培训状态调整</Button>
            <Button type="button" className={btnClass}>合同手动续约</Button>
            <Button type="button" className={btnClass}>修改</Button> */}
              <AssessmentSalaryTable {...commonProps} selectRowData={this.selectRowData} refreshNum={refreshNum} />
              <ScoreDetailTable {...commonProps} refreshNum={refreshNum} />
            </div>
          ) : ''}
          <LevelCalculationModal {...levelCalculationModal} {...commonProps} onCancel={this.closeLevelCalculateModal} />
          <LevelAdjustModal {...levelAdjustModal} {...commonProps} onCancel={this.closeLevelAdjustModal} selectData={selectData} resetSelectData={this.resetSelectData} />
          <StockbrokerLevelAdjustModal {...stockbrokerLevelAdjustModal} {...commonProps} onCancel={this.closeStockbrokerLevelAdjustModal} />
        </div >
      </Fragment >
    );
  }
}
export default CalculationAssessment;
