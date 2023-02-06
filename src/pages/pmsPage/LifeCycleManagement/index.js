import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';
import {connect} from 'dva';
import LifeCycleManagementTabs
  from '../../../components/pmsPage/LifeCycleManagement/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

class LifeCycleManagement extends Component {

  render() {
    const {location: {query = {}}} = this.props;
    // const jsonParam = JSON.parse(DecryptBase64(params.params));
    console.log("params", query);
    return (
      <React.Fragment>
        <LifeCycleManagementTabs params={query}/>
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(LifeCycleManagement);
