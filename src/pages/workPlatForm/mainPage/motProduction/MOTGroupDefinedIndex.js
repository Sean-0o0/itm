import React, { Fragment } from 'react';
import { connect } from 'dva';

import GroupDefinedIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/GroupDefinedIndex';

class MOTGroupDefinedIndex extends React.Component {
  render() {
    const { dictionary = {} } = this.props;
    return (
      <Fragment>
        <GroupDefinedIndex dictionary={dictionary}/>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(MOTGroupDefinedIndex);
