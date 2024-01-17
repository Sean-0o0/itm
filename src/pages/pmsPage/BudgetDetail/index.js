import React from 'react';
import { connect } from 'dva';
import BudgetDetail from '../../../components/pmsPage/BudgetDetail/index';
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(props => <BudgetDetail {...props} />);
