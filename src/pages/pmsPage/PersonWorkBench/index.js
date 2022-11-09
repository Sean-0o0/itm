import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';
import {connect} from 'dva';
import WorkBench
  from '../../../components/pmsPage/WorkBench/index';

class PersonWorkBench extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <React.Fragment>
        <WorkBench {...this.props}/>
      </React.Fragment>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(PersonWorkBench);