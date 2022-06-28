import React, { Fragment } from 'react';
import { Card, Button, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import StaffType from './StaffType';
import SalaryItems from './SalaryItems';
import { FetchoperateSalaryProgramConf } from '../../../../../../../../services/EsaServices/salaryManagement';
/**
 * 左侧 类别、项目
 */

class LeftPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  // 保存
  handleSave = () => {
    const { versionId, selectedStaff = [], selectedSalary = [], salaryData = [], selectedYyb = '', selectedYybName = '', setLoading } = this.props;
    setLoading(true);
    let errCode = 0;
    let errMsg = '';
    const salaryPlan = [];
    const tmplSelectedStaff = JSON.parse(JSON.stringify(selectedStaff));
    tmplSelectedStaff.forEach((selectedStaffItem) => {
      const salaryPlanObj = {};
      salaryPlanObj.classId = selectedStaffItem.classId;
      salaryPlanObj.levelId = selectedStaffItem.levelId;
      salaryPlanObj.remk = `${selectedYybName}${selectedStaffItem.className}${selectedStaffItem.levelName}薪酬方案`;
      const paramValues = [];
      const codeSno = [];
      const { payProgram = [] } = selectedStaffItem;
    
      if (payProgram.length === 0) {
        errCode = -1;
        errMsg = `${selectedStaffItem.className} - ${selectedStaffItem.levelName} 类目下没有薪酬项目数据，请点选！`;
        setLoading(false)
        return false;
      }
      payProgram.forEach((payProgramItem) => {
        const paramValuesObj = {};
        paramValuesObj.payCodeId = payProgramItem.payCodeId;
        paramValuesObj.settType = payProgramItem.settType;
        paramValuesObj.settRestr = payProgramItem.settRestr;
        paramValuesObj.leaveIsCal = payProgramItem.leaveIsCal;
        paramValues.push(paramValuesObj);
        const codeSnoObj = {};
        codeSnoObj.orgNo = selectedYyb;
        codeSnoObj.sno = String(selectedSalary.findIndex(item => item.payCodeId === payProgramItem.payCodeId));
        codeSnoObj.payCodeId = payProgramItem.payCodeId;
        codeSnoObj.payCodeName = salaryData.find(salaryDataItem => salaryDataItem.ID === payProgramItem.payCodeId).PAY_NAME;
        codeSno.push(codeSnoObj);
      });
      salaryPlanObj.paramValues = paramValues;
      salaryPlanObj.codeSno = codeSno;
      salaryPlan.push(salaryPlanObj);
    });

    if (errCode < 0) {
      message.error(errMsg);
      return false;
    }
    if (selectedYyb) {
      FetchoperateSalaryProgramConf({
        depClass: 1,
        inArea: 1,
        operType: 1,
        orgNo: selectedYyb,
        payProgram: JSON.stringify(salaryPlan),
        version : versionId || '',
      }).then((ret = {}) => {
        const { code = 0, note = '' } = ret;
        if (code > 0) {
          message.success(note);
          setLoading(false);
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
        setLoading(false);
      });
    }
  }
  render() {
    const {
      selectedYyb = '',
      staffTypes = [],
      staffClassData = [],
      staffLevelData = [],
      selectedStaff = [],
      selectedSalary = [],
      salaryData = [],
      height,
      dispatch } = this.props;
    return (
      <Fragment>
        <Card
          className="m-card m-card-pay"
          style={{ borderRight: '1px solid #E3E3E3' }}
        >
          <Scrollbars
            autoHide
            style={{ height: height - 60 }}
          >
            <div className="m-condition-title">人员类别</div>
            <div className="m-pay-tag-list">
              <StaffType
                staffTypes={staffTypes}
                staffClassData={staffClassData}
                staffLevelData={staffLevelData}
                selectedStaff={selectedStaff}
                dispatch={dispatch}
              />
            </div>
            <div className="m-condition-title">薪酬项目</div>
            <div className="m-pay-tag-list">
              <SalaryItems
                selectedYyb={selectedYyb}
                selectedStaff={selectedStaff}
                selectedSalary={selectedSalary}
                salaryData={salaryData}
                dispatch={dispatch}
              />
            </div>
            <div className="m-bottom-btn-box" style={{ padding: '0 1.8333rem 2rem' }}>
              <Button className="m-btn-radius m-btn-block m-btn-radius-big m-btn-headColor" onClick={this.handleSave}>确认</Button>
            </div>
          </Scrollbars>
        </Card>
      </Fragment>
    );
  }
}
export default LeftPanel;
