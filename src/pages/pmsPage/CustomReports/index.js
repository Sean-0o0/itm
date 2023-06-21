import React, {Fragment} from 'react';
import {connect} from 'dva';
import CustomReportsTab from '../../../components/pmsPage/CustomReports/index';

const CustomReports = (props) => {
  return (
    <Fragment>
      <CustomReportsTab></CustomReportsTab>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(CustomReports);
