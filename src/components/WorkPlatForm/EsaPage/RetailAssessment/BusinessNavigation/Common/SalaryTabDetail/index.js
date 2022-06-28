/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import { Tabs, Card } from 'antd';
import UpComing from './UpComing';
import CalculationAssessment from './CalculationAssessment';
import CalculationSalary from './CalculationSalary';
import ReportForm from './ReportForm';
import CalculationLog from './CalculationLog';

const { TabPane } = Tabs;

/**
 *  客户经理薪酬考核导航  和 证券经纪人考核薪酬 的公共底部组件
 */

class SalaryTabDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '1', // 记录当前tab页
    };
  }
  onChange = (tabKey) => {
    this.setState({ tabKey });
  }
  getStepId = (valueIndex) => {
    const { depClass } = this.props;
    // 步骤ID数组
    // 考核前待办 | 薪酬前待办 | 考核报表 | 薪酬报表
    const stepIdArr = [[1, 8, 24], [3, 10, 15], [5, 12, 26], [6, 13, 17]];
    switch (depClass) {
      case 1:
        return stepIdArr[valueIndex][0];
      case 2:
        return stepIdArr[valueIndex][1];
      case 3:
        return stepIdArr[valueIndex][2];
      default:
        return 999;
    }
  }
  render() {
    const { depClass, theme, mon, orgNo, orgName, dictionary } = this.props;
    const { tabKey } = this.state;
    const commonProps = {
      mon,
      orgNo,
      depClass,
      theme,
      orgName,
      dictionary,
    };
    return (
      <Fragment>
        <Card style={{ height: '100%', overflow: 'hidden auto' }} className="m-card">
          <Tabs
            defaultActiveKey="1"
            className="m-tabs-underline-thrid m-tabs-underline-small esa-salaryNavigation-salaryTabs"
            onChange={this.onChange}
          >
            <TabPane tab="1.考核前待办" key="1" >
              {tabKey === '1' ? <UpComing {...commonProps} stepId={this.getStepId(0)} /> : ''}
            </TabPane>
            <TabPane tab="2.计算考核" key="2">
              {tabKey === '2' ? <CalculationAssessment {...commonProps} stepId={this.getStepId(0)} /> : ''}
            </TabPane>
            <TabPane tab="3.薪酬前待办" key="3" >
              {tabKey === '3' ? <UpComing {...commonProps} stepId={this.getStepId(1)} /> : ''}
            </TabPane>
            <TabPane tab="4.计算薪酬" key="4">
              {tabKey === '4' ? <CalculationSalary {...commonProps} stepId={this.getStepId(1)} /> : ''}
            </TabPane>
            <TabPane tab="5.考核报表" key="5" >
              {tabKey === '5' ? <ReportForm {...commonProps} bizType={1} stepId={this.getStepId(2)} /> : ''}
            </TabPane>
            <TabPane tab="6.薪酬报表" key="6" >
              {tabKey === '6' ? <ReportForm {...commonProps} bizType={2} stepId={this.getStepId(3)} /> : ''}
            </TabPane>
            <TabPane tab="7.计算日志" key="7">
              {tabKey === '7' ? <CalculationLog {...commonProps} /> : ''}
            </TabPane>
          </Tabs>
        </Card>
      </Fragment>
    );
  }
}
export default SalaryTabDetail;
