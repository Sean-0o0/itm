import React, { Fragment } from 'react';
import { connect } from 'dva';

import DistributeStreamTableConfig from '../../../../components/WorkPlatForm/MainPage/MotProduction/DistributeStreamTableConfig';

class DIStributeStreamTableConfig extends React.Component {
  render() {
    return (
      <Fragment>
        <DistributeStreamTableConfig/>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(DIStributeStreamTableConfig);
