import React from 'react';
import { connect } from 'dva';
import BudgetSubmitTab from '../../../components/pmsPage/BudgetSubmit/index';
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(props => <BudgetSubmitTab {...props} />);
