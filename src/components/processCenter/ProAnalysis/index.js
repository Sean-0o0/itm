import React from 'react';
import { Card } from 'antd';
import ProcessTabs from './ProcessTabs';

class ProAnalysis extends React.Component {
  
  render() {
    
    return (
      <Card className="m-card ant-card-padding-transition mot-factor ant-card-body" style={{ margin: '1rem 0', height: 'calc(100vh - 10rem)' }}>
            <ProcessTabs />
      </Card>
    );
  }
}

export default ProAnalysis;
