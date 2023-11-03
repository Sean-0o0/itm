import React from 'react';
import { connect } from 'dva';
import IntelPropertyTab from '../../../components/pmsPage/IntelProperty/index';
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(props => <IntelPropertyTab {...props} />);
