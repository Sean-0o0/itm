import React, { Fragment } from 'react';
import { connect } from 'dva';

import SupervisorTaskIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/SupervisorTaskIndex';

class MOTSupervisorTaskIndex extends React.Component {
  render() {
    const { dictionary } = this.props;
    return (
      <Fragment>
        <SupervisorTaskIndex dictionary={dictionary}/>
      
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTSupervisorTaskIndex);
