import React from 'react';
import { connect } from 'dva';
import BasicModal from '../../../../../../../../Common/BasicModal';
import DetailModal from './DetailModal';

class Detail extends React.Component {
  state = {
    visible: false,
  };

  componentWillUnmount() {
    this.tmplSelectedStaffTypes = null;
  }

  // 修改人员-薪酬-参数
  handleCheckboxChange = (value, payCodeId, fieldName) => {
    const { selectedStaff = [], dispatch, record = {} } = this.props;
    const tmplSelectedStaff = JSON.parse(JSON.stringify(selectedStaff));
    for (let i = 0; i < tmplSelectedStaff.length; i++) {
      if (tmplSelectedStaff[i].levelId === record.levelId && tmplSelectedStaff[i].classId === record.classId) {
        const { payProgram = [] } = tmplSelectedStaff[i];
        for (let j = 0; j < payProgram.length; j++) {
          if (payProgram[j].payCodeId === payCodeId) {
            tmplSelectedStaff[i].payProgram[j][fieldName] = value;
            break;
          }
        }
        break;
      }
    }
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedStaff',
        payload: { selectedStaff: tmplSelectedStaff },
      });
    }
  }

  handleClick = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible } = this.state;
    const { record = {}, dictionary, selectedYybName = '', salaryData = [] } = this.props;
    const modalProps = {
      title: '查看编辑',
      visible,
      width: '86rem',
      height: '50rem',
      onCancel: this.handleCancel,
      onOk: this.handleOk,
    };
    return (
      <React.Fragment>
        <div className="table-firstLine">
          <a className="txt-d" style={{ color: '#2daae4' }} target="_blank" onClick={this.handleClick}>查看</a>
        </div>
        <BasicModal {...modalProps}>
          <DetailModal
            record={record}
            dictionary={dictionary}
            selectedYybName={selectedYybName}
            salaryData={salaryData}
            handleCheckboxChange={this.handleCheckboxChange}
          />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default connect(({ global, salaryPlanSettings }) => ({
  dictionary: global.dictionary,
  salaryData: salaryPlanSettings.salaryData,
  selectedStaff: salaryPlanSettings.selectedStaff,
}))(Detail);
