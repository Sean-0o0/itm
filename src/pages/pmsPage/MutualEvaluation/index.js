import React from 'react';
import { connect } from 'dva';
import MutualEvaluationTab from '../../../components/pmsPage/MutualEvaluation/index';
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(props => <MutualEvaluationTab {...props} />);
