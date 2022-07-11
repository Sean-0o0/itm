import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import International from '../../../components/LargeScreen/International';

class InternationalPage extends React.Component {

  render() {
    const title = '兴证国际监控大屏';
    return (
      <div className="xy-body">
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
