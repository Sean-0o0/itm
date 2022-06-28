/*
 * @Description: 考核表
 * @Autor: 
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import AssessmentTableComponent from '../../../../../../components/WorkPlatForm/EsaPage/AssessmentEvaluation/v1/AssessmentTable';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

class AssessmentTable extends Component {

  render() {
    const { match: { params: { params = '' } } } = this.props;
    try {
      const payload = JSON.parse(DecryptBase64(params));
      return (
        <AssessmentTableComponent payload={payload} params={params} />
      );
    } catch (e) { return null; }
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(AssessmentTable);