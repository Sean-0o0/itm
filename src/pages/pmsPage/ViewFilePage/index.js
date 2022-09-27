import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';
import {connect} from 'dva';
import ViewFile
  from '../../../components/pmsPage/ViewFile/index';

class ViewFilePage extends Component {
  render() {
    return (
      <React.Fragment>
        <ViewFile/>
      </React.Fragment>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(ViewFilePage);
