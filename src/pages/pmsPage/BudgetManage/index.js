import React from 'react';
import { connect } from 'dva';
import BudgetManage from '../../../components/pmsPage/BudgetManage';
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(props => <BudgetManage {...props} />);
