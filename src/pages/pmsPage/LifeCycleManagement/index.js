import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';
import {connect} from 'dva';
import LifeCycleManagementTabs
  from '../../../components/pmsPage/LifeCycleManagement/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

class LifeCycleManagement extends Component {

  render() {
    const {location: {query = {}}, match: {params: {params: encryptParams = ''}}} = this.props;
    let jsonParam = ""
    if (this.props.match.params.params !== undefined) {
      jsonParam = JSON.parse(DecryptBase64(encryptParams));
      console.log("params", jsonParam);
    }
    return (
      <React.Fragment>
        <LifeCycleManagementTabs params={jsonParam}/>
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(LifeCycleManagement);
