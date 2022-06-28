/*
 * @Description: 考核评分首页列表
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import AssessmentListComponent from '../../../../../../components/WorkPlatForm/EsaPage/AssessmentEvaluation/v1/AssessmentList';

class AssessmentList extends Component {
  render() {
    return (
      <AssessmentListComponent />
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(AssessmentList);