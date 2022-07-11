import React from 'react';
import { Card } from 'antd';
import ProcessDeatil from './ProcessDetail';

class SuperviseProDtl extends React.Component {
  
  render() {
    const {instid = ''} = this.props;
    return (
      <Card className="m-card ant-card-padding-transition mot-factor ant-card-body" style={{ margin: '1rem 0', height: 'calc(100vh - 10rem)' }}>
          <ProcessDeatil instid = {instid}/>
      </Card>
    );
  }
}

export default SuperviseProDtl;
