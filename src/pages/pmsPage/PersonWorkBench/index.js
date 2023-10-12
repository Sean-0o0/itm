import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import WorkBench from '../../../components/pmsPage/WorkBench/index';
import StatisticAnalysisTab from '../../../components/pmsPage/StatisticAnalysis/index';
import { QueryUserRole } from '../../../services/pmsServices';
import { Spin } from 'antd';

class PersonWorkBench extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    isLeader: false, //是否为领导
    isSpinning: false, //加载状态
  };
  componentDidMount() {
    const LOGIN_USERID = JSON.parse(sessionStorage.getItem('user'))?.id;
    this.setState({
      isSpinning: true,
    });
    if (LOGIN_USERID !== undefined) {
      // console.log('登录用户id', LOGIN_USERID);
      QueryUserRole({
        userId: Number(LOGIN_USERID),
      }).then(res => {
        this.setState({
          isLeader: res.role === '信息技术事业部领导',
          isSpinning: false,
        });
      });
    } else {
      this.setState({
        isLeader: false,
        isSpinning: false,
      });
    }
  }
  render() {
    return (
      <Spin
        spinning={this.state.isSpinning}
        tip="加载中"
        size="large"
        wrapperClassName="person-workbench-spin-style"
      >
        {this.state.isLeader ? <StatisticAnalysisTab /> : <WorkBench {...this.props} />}
      </Spin>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(PersonWorkBench);
