/*
 * @Author: linzhihong
 * @Date: 2020-03-06 10:08:09
 * @LastEditTime: 2020-09-17 19:25:23
 * @Description: 供livebos调用页面
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import LBDialog from 'livebos-frame/dist/LBDialog';
import { Switch, Route } from 'dva/router';
import AddEditAppraisalPlanPage from './AddEditAppraisalPlanPage';
import CalculationRuleDefinition from './CalculationRuleDefinition';
import GradeAssessmentPlanDefinition from './GradeAssessmentPlanDefinition';
import AddEditCommissionTemplateDef from './AddEditCommissionTemplateDef';
import AddEditSalaryTemplate from './AddEditSalaryTemplate';
import GradeAssessmentPlanConfig from './GradeAssessmentPlanConfig';
import CheckSalary from '../RetailAssessment/BusinessNavigation/CheckSalary';
import SubjectDataConfig from './SubjectDataConfig';
import AddEditDataTemplate from './AddEditDataTemplate';
import DataTemplateColumnFormulaDef from './DataTemplateColumnFormulaDef';
import ReportForm from './ReportForm';
import ImgPreview from './ImgPreview';
import LeaderEvaluateComponentPage from './LeaderEvaluateComponentPage';
import ImportDataEntry from './ImportDataEntry';

class SinglePage extends Component {
  componentDidMount() {
    if (this.props.resizeDialog) {
      const height = this.getParamString('height') || 400;
      const width = this.getParamString('width') || 800;
      // eslint-disable-next-line no-console
      //console.log(`高度：${this.getParamString('height')}`);
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
          {/* 新增修改绩效考核方案 */}
          <Route exact path={`${parentUrl}/addEditAppraisalPlan/:id?`} render={props => <AddEditAppraisalPlanPage {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 计算规则定义 */}
          <Route exact path={`${parentUrl}/CalculationRuleDefinition/:params?`} render={props => <CalculationRuleDefinition {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 级别考核方案定义 */}
          <Route exact path={`${parentUrl}/GradeAssessmentPlanDefinition/:params`} render={props => <GradeAssessmentPlanDefinition {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 级别考核方案配置 */}
          <Route exact path={`${parentUrl}/GradeAssessmentPlanConfig/:params`} render={props => <GradeAssessmentPlanConfig {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 提成模板定义的新增和修改 */}
          <Route exact path={`${parentUrl}/addEditCommissionTemplateDef/:params`} render={props => <AddEditCommissionTemplateDef {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 薪酬的新增和修改 */}
          <Route exact path={`${parentUrl}/addEditSalaryTemplate/:params`} render={props => <AddEditSalaryTemplate {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 核对薪酬列表纯表格页面 */}
          <Route exact path={`${parentUrl}/checkSalaryTable/:params?`} render={props => <CheckSalary {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 主题数据配置 */}
          <Route exact path={`${parentUrl}/subjectDataConfig/:id?`} render={props => <SubjectDataConfig {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 数据模板列的新增和修改 */}
          <Route exact path={`${parentUrl}/addEditDataTemplate/:id?`} render={props => <AddEditDataTemplate {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 导入数据模板定义--配置模板字段-计算公式配置 */}
          <Route exact path={`${parentUrl}/DataTemplateColumnFormulaDef/:id?`} render={props => <DataTemplateColumnFormulaDef {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 扩展报表--json配置功能 */}
          <Route exact path={`${parentUrl}/jsonDatas/:optTp?`} render={props => <ReportForm {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 图片预览 */}
          <Route exact path={`${parentUrl}/imgPreview/:params?`} render={props => <ImgPreview {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
          {/* 领导打分查看 */}
          <Route exact path={`${parentUrl}/leDetail/:params`} render={props => <LeaderEvaluateComponentPage {...props} />} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />
          {/* 导入数据录入 */}
          <Route exact path={`${parentUrl}/importDataEntry/:tmplNo?`} render={props => <ImportDataEntry {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
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
