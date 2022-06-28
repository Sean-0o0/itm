/*
 * @Description: 领导评分
 * @Autor:
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import BusEvaluateComponent from '../../../../../../components/WorkPlatForm/EsaPage/AssessmentEvaluation/v3/BusEvaluate/index';

class LeaderEvaluate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { userid } = this.props;
    return (
      < BusEvaluateComponent shuji={userid === 'lihua'} />
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userid: (global.userBasicInfo && global.userBasicInfo.userid) || '',
}))(LeaderEvaluate);
