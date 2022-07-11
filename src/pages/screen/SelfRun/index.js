import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import SelfRun from '../../../components/LargeScreen/SelfRun';

class SelfRunPage extends React.Component {

  render() {
    const title = '自营账户监控屏';
    return (
      <div className="xy-body" style={{height: '100%'}}>
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '11'/>
          <SelfRun />
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default SelfRunPage;
