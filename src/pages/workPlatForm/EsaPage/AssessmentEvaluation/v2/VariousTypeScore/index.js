/*
 * @Description: 各类型打分
 * @Autor:
 * @Date: 2020-11-11 11:07:27
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import VariousTypeScoreComponent from '../../../../../../components/WorkPlatForm/EsaPage/AssessmentEvaluation/v2/VariousTypeScore';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

class VariousTypeScore extends Component {
  render() {
    const { match: { params }, userBasicInfo = {} } = this.props;

    const jsonParam = JSON.parse(DecryptBase64(params.params));
    //console.log("jsonParam===", jsonParam)

    return (
      <VariousTypeScoreComponent params={jsonParam} userBasicInfo={userBasicInfo} />
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo
}))(VariousTypeScore);
