import React from 'react';
import { connect } from 'dva';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import FundSettlement from '../../../components/LargeScreen/FundSettlementV2';

class FundSettlementPage extends React.Component {
  state = {
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const title = '总部资金交收业务监控';
    return (
      <div className="xy-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '2'/>
          <FundSettlement/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default FundSettlementPage;
