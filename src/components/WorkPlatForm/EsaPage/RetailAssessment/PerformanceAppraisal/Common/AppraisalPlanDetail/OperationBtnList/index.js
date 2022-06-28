import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
/**
 * 操作按钮列表
 */
class OperationBtnList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  // 方案修改
  handlePlanEdit=() => {
    const { handlePlanEdit } = this.props;
    if (typeof handlePlanEdit === 'function') {
      handlePlanEdit();
    }
  }
  // 提交审批
  handleSubmitExamine=() => {
    const { handleSubmitExamine } = this.props;
    if (typeof handleSubmitExamine === 'function') {
      handleSubmitExamine();
    }
  }
  // 营业部负责人审批
  handleDepartmentExamine=() => {
    const { handleDepartmentExamine } = this.props;
    if (typeof handleDepartmentExamine === 'function') {
      handleDepartmentExamine();
    }
  }
  // 分公司审批
  handleCompanyExamine=() => {
    const { handleCompanyExamine } = this.props;
    if (typeof handleCompanyExamine === 'function') {
      handleCompanyExamine();
    }
  }
  // 方案回退
  handlePlanReturn=() => {
    const { handlePlanReturn } = this.props;
    if (typeof handlePlanReturn === 'function') {
      handlePlanReturn();
    }
  }
  render() {
    const { authorities: { PrfmProgram = [],PrfmProgramEmp=[] },pageType } = this.props;
    return (
      <Fragment>
        {    (((pageType === '1')&&PrfmProgram.some(authKey => authKey === 'mod'))||((pageType === '2')&&PrfmProgramEmp.some(authKey => authKey === 'mod')))&&(
   <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={() => this.handlePlanEdit()}>方案修改</Button>
   )}
       {     (((pageType === '1')&&PrfmProgram.some(authKey => authKey === 'up'))||((pageType === '2')&&PrfmProgramEmp.some(authKey => authKey === 'up')))&&(
    <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c ml10" onClick={() => this.handleSubmitExamine()}>提交审批</Button>
    )}
    
    {     (((pageType === '1')&&PrfmProgram.some(authKey => authKey === 'org_apvl'))||((pageType === '2')&&PrfmProgramEmp.some(authKey => authKey === 'org_apvl')))&&(
         <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c ml10" onClick={() => this.handleDepartmentExamine()}>营业部负责人审批</Button>
   )}
     {    (((pageType === '1')&&PrfmProgram.some(authKey => authKey === 'br_apvl'))||((pageType === '2')&&PrfmProgramEmp.some(authKey => authKey === 'br_apvl')))&&(
     <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c ml10" onClick={() => this.handleCompanyExamine()}>分公司复核</Button>
    )}
     {     (((pageType === '1')&&PrfmProgram.some(authKey => authKey === 'backoff'))||((pageType === '2')&&PrfmProgramEmp.some(authKey => authKey === 'backoff')))&&(
      <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c ml10" onClick={() => this.handlePlanReturn()}>回退方案</Button>
      )}
    </Fragment>
    );
  }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(OperationBtnList) ;



