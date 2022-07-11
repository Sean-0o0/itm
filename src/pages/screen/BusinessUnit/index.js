import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import BusinessUnit from '../../../components/LargeScreen/BusinessUnit';

class BusinessUnitPage extends React.Component {

  render() {
    const title = '交易单元监控屏';
    return (
      <div className="xy-body" style={{height: '100%'}}>
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '11'/>
          <BusinessUnit />
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default BusinessUnitPage;
