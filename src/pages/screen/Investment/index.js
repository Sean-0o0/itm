import React from 'react';
import { connect } from 'dva';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import Investment from '../../../components/LargeScreen/Investment';

class InvestmentPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '兴证投资监控大屏';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '8'/>
          <Investment/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default InvestmentPage;
