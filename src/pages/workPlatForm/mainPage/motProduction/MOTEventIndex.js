import React, { Fragment } from 'react';
import { connect } from 'dva';

import MotEventIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/MotEventIndex';

class MOTEventIndex extends React.Component {
  render() {
    const { dictionary } = this.props;
    return (
      <Fragment>
        <MotEventIndex dictionary={dictionary}/>
      
      </Fragment>
    );
  }
}

export default connect(({ motEvent, global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTEventIndex);
