import React from 'react';
import { connect } from 'dva';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import CallCenter from '../../../components/LargeScreen/CallCenter';

class CallCenterPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '集团客服中心业务监控';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '5'/>
          <CallCenter/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default CallCenterPage;
