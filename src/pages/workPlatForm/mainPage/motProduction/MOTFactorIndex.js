import React, { Fragment } from 'react';
import { connect } from 'dva';

import MotFactorIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/MotFactorIndex';

class MOTFactorIndex extends React.Component {
  render() {
    const { dictionary } = this.props;
    return (
      <Fragment>
        <MotFactorIndex dictionary={dictionary}/>
      
      </Fragment>
    );
  }
}

export default connect(({ motEvent, global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTFactorIndex);
