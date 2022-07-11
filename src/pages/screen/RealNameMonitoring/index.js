import React from 'react';
import PageHeader from '../../../components/LargeScreen/PageHeader';
import PageFooter from '../../../components/LargeScreen/PageFooter';
import RealNameMonitoring from '../../../components/LargeScreen/RealNameMonitoring';

class RealNameMonitoringPage extends React.Component {

  render() {
    const title = '实名制监控屏';
    return (
      <div className="xy-body" style={{height: '100%'}}>
        <div className="flex-c page-wrap">
          <PageHeader title={title} page = '11'/>
          <RealNameMonitoring />
          <PageFooter/>
        </div>
      </div>
    );
  }
}

export default RealNameMonitoringPage;
