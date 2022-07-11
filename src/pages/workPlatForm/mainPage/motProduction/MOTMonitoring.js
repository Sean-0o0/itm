import React, { Fragment } from 'react';
import { connect } from 'dva';

import MotMonitoring from '../../../../components/WorkPlatForm/MainPage/MotProduction/MotMonitoring';

class MOTMonitoring extends React.Component {
  render() {
    return (
      <Fragment>
        <MotMonitoring/>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTMonitoring);
