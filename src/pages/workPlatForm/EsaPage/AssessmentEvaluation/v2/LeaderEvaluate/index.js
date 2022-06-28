/*
 * @Description: 领导评分
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import LeaderEvaluateComponent from '../../../../../../components/WorkPlatForm/EsaPage/AssessmentEvaluation/v2/LeaderEvaluate';

class LeaderEvaluate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  render() {
    const { userid } = this.props;
    return (
      < LeaderEvaluateComponent shuji={userid === 'lihua'} />
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userid: (global.userBasicInfo && global.userBasicInfo.userid) || '',
}))(LeaderEvaluate);