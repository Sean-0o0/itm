import React from 'react';
import { connect } from 'dva';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import CentralOpert from '../../../components/LargeScreen/centralOpert';

class CentralOpertPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '总部集中运营业务监控';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '3'/>
          <CentralOpert/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default CentralOpertPage;
