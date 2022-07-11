import React from 'react';
import { connect } from 'dva';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import Capital from '../../../components/LargeScreen/Capital';

class CapitalPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '兴证资本监控大屏';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '12'/>
          <Capital/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default CapitalPage;
