import React, { Fragment } from 'react';
import { connect } from 'dva';

import EmployeeExecutionTwoIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/EmployeeExecutionTwoIndex';

class MOTEmployeeExecutionTwoIndex extends React.Component {
  render() {
    const { dictionary } = this.props;
    return (
      <Fragment>
        <EmployeeExecutionTwoIndex dictionary={dictionary}/>
      
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTEmployeeExecutionTwoIndex);
