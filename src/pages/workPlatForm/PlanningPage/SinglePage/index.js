/*
 * @Author: yxm
 * @Date: 2021-03-30 20:08:09
 * @Description: 供livebos调用页面
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import LBDialog from 'livebos-frame/dist/LBDialog';
import { Switch, Route } from 'dva/router';
import AddEditBudgetTemplate from './AddEditBudgetTemplate';
//import DepartmentAssessPlan from './AccessPlan/DepartmentAssessPlan';
//import BussinessAssessment from './AccessPlan/BussinessAssessment';
//import BussinessAssessmentModify from './AccessPlan/BussinessAssessmentModify';
import AddInd from './AccessPlan/AddInd';
import AddIndModify from './AccessPlan/AddIndModify';
import AppointInd from './AccessPlan/AppointInd';
//import DepartmentAssessPlanModify from './AccessPlan/DepartmentAssessPlanModify';

class SinglePage extends Component {
  componentDidMount() {
    if (this.props.resizeDialog) {
      const height = this.getParamString('height') || 400;
      const width = this.getParamString('width') || 800;
      // eslint-disable-next-line no-console
      // //console.log(`高度：${this.getParamString('height')}`);
      this.props.resizeDialog({ width, height });
    }
    if (this.props.dialogOpened) {
      const maximize = this.getParamString('maximize') || 'false';
      if (maximize === 'true') {
        this.props.dialogOpened();

      }
    }
  }
  // liveBos弹框确定
  onSubmitOperate = () => {
    const result = { code: 1 };
    if (this.props.onSubmitOperate) {
      this.props.onSubmitOperate(result);
    }
  }
  // liveBos弹框关闭
  onCancelOperate = () => {
    if (this.props.onCancelOperate) {
      this.props.onCancelOperate();
    }
  }
  getParamString = (key) => {
    const { location: { search = '' } } = this.props;
    const regExp = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i');
    const paramString = search.match(regExp);
    if (paramString !== null) {
      return unescape(paramString[2]);
    }
    return null;
  }
  render() {
    const {
      match: { url: parentUrl = '' },
    } = this.props;
    return (
      <Fragment>
        <Switch>
          {/* 预算模板的新增和修改 */}
          <Route exact path={`${parentUrl}/addEditBudgetTemplate/:params`} render={props => <AddEditBudgetTemplate {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 职能部门考核方案 */}
          {/* <Route exact path={`${parentUrl}/departmentAssessPlan`} render={props => <DepartmentAssessPlan {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} /> */}
          {/* 职能部门考核方案修改 */}
          {/* <Route exact path={`${parentUrl}/departmentAssessPlanModify/:params`} render={props => <DepartmentAssessPlanModify {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} /> */}
          {/* 业务条线考核方案 */}
          {/* <Route exact path={`${parentUrl}/bussinessAssessment/:params`} render={props => <BussinessAssessment {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} /> */}
           {/* 业务条线考核方案修改 */}
           {/* <Route exact path={`${parentUrl}/bussinessAssessmentModify/:params`} render={props => <BussinessAssessmentModify {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} /> */}
          {/* 考核方案跟踪方案添加指标 */}
          <Route exact path={`${parentUrl}/addInd/:params`} render={props => <AddInd {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 考核方案跟踪方案添加指标 */}
          <Route exact path={`${parentUrl}/appointInd/:params`} render={props => <AppointInd {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 考核方案跟踪方案添加指标修改 */}
          <Route exact path={`${parentUrl}/addIndModify/:params`} render={props => <AddIndModify {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 考核方案列表页面 */}
          {/* <Route exact path={`${parentUrl}/EvaluationSchemeListPage`} render={props => <EvaluationSchemeListPage {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} /> */}
        </Switch>
      </Fragment>
    );
  }
}

const SinglePageApp = ({ ...props }) => {
  return (
    <Fragment>
      <LBDialog trustedOrigin="*">
        <SinglePage {...props} />
      </LBDialog>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(SinglePageApp);
