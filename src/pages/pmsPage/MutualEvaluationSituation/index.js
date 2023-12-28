import React from 'react';
import { connect } from 'dva';
import MutualEvaluationSituationTab from '../../../components/pmsPage/MutualEvaluationSituation/index';
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(props => <MutualEvaluationSituationTab {...props} />);
