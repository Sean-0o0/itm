import React, { Fragment } from 'react';
import { connect } from 'dva';

import DisPatchIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/DisPatchIndex';

class DISPatchIndex extends React.Component {
  render() {
    return (
      <Fragment>
        <DisPatchIndex/>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(DISPatchIndex);
