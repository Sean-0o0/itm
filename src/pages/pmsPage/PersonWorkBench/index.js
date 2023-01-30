import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import WorkBench from '../../../components/pmsPage/WorkBench/index';
import StatisticAnalysisTab from '../../../components/pmsPage/StatisticAnalysis/index';

class PersonWorkBench extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const LOGIN_USERID = Number(JSON.parse(sessionStorage.getItem("user"))?.id);
    console.log('登录用户id', LOGIN_USERID);
    // if (LOGIN_USERID === 0)
      return (
        <React.Fragment>
          <WorkBench {...this.props} />
        </React.Fragment>
      );
    // else
      // return <StatisticAnalysisTab />;
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(PersonWorkBench);