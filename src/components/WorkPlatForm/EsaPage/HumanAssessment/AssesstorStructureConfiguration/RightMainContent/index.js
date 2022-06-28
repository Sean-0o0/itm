import React, { Fragment } from 'react';
import { Tabs } from 'antd';
import DepartmentalEvaluation from './DepartmentalEvaluation';
import LeadingCadreEvaluation from './LeadingCadreEvaluation';

const { TabPane } = Tabs;
/**
 * 右侧配置主要内容
 */

class RightMainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {

  }

  componentWillReceiveProps() {

  }


  render() {
    const { companyData } = this.props;
    return (
      <Fragment>
        <Tabs defaultActiveKey="0">
          <TabPane tab="部门考评" key="0"><DepartmentalEvaluation companyData={companyData} /></TabPane>
          <TabPane tab="负责人考评" key="1"><LeadingCadreEvaluation companyData={companyData} /></TabPane>
        </Tabs>
      </Fragment>
    );
  }
}

export default RightMainContent;
