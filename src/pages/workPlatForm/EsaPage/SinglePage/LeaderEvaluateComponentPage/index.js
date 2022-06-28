/**
 * 新增供livebos直接打开分管领导考评
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import LeaderEvaluateComponent from '../../../../../components/WorkPlatForm/EsaPage/AssessmentEvaluation/v2/LeaderEvaluate';

class LeaderEvaluateComponentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { dictionary = {}, onSubmitOperate, onCancelOperate, match = {}, userid } = this.props;
    const { params } = match.params;
    const paramJson = decodeURIComponent(params);
    const paramsArray = paramJson.split('/');
    let pgmId = '';
    if (paramsArray[1] !== '' && paramsArray[1] !== undefined && paramsArray[1] !=="VIEW") {
      pgmId = paramsArray[1];
    }
    return (
      <Fragment>
        <LeaderEvaluateComponent dictionary={dictionary} onSubmitOperate={onSubmitOperate} onCancelOperate={onCancelOperate} id={pgmId} shuji={userid === 'lihua'} />
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userid: (global.userBasicInfo && global.userBasicInfo.userid) || '',
}))(LeaderEvaluateComponentPage);
