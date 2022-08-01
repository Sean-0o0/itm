import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';
import {connect} from 'dva';
import WorkBench
  from '../../../components/pmsPage/WorkBench/index';

class PersonWorkBench extends Component {
  render() {
    return (
      <React.Fragment>
        <WorkBench/>
      </React.Fragment>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(PersonWorkBench);
