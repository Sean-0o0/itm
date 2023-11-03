import React from 'react';
import { connect } from 'dva';
import AwardHonorTab from '../../../components/pmsPage/AwardHonor/index';
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(props => <AwardHonorTab {...props} />);
