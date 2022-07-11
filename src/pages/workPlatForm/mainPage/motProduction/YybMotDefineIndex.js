import React, { Fragment } from 'react';
import { connect } from 'dva';

import YYBMotDefineIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/YybMotDefineIndex';


class YybMotDefineIndex extends React.Component {
  render() {
    const { dictionary = {} } = this.props
    return (
      <Fragment>


        {/* 营业部事件 */}
        <YYBMotDefineIndex dictionary={dictionary} />

      </Fragment>
    );
  }
}

export default connect(({ motEvent, global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(YybMotDefineIndex);
