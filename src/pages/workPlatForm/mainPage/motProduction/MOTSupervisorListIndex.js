import React, { Fragment } from 'react';
import { connect } from 'dva';

import SupervisorListIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/SupervisorListIndex';

class MOTSupervisorListIndex extends React.Component {
  render() {
    const { dictionary } = this.props;
    return (
      <Fragment>
        <SupervisorListIndex dictionary={dictionary}/>
      
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTSupervisorListIndex);
