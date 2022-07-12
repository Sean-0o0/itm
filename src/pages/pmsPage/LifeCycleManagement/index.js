import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import LifeCycleManagementTabs
  from '../../../components/pmsPage/LifeCycleManagement/index';
class LifeCycleManagement extends Component {
    render() {
        return (
            <React.Fragment>
              <LifeCycleManagementTabs />
            </React.Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(LifeCycleManagement);
