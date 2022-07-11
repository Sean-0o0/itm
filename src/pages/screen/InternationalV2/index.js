import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import International from '../../../components/LargeScreen/InternationalV2';

class InternationalPage extends React.Component {

  render() {
    const title = '兴证国际运营监控大屏';
    return (
      <div className="oprt-body">
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '11'/>
          <International/>
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default InternationalPage;
