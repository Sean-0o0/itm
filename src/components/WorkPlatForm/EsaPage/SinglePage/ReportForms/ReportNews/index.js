import React from 'react';
import { Row } from 'antd';
import CustomerIncome from './CustomerIncome';
import CustomerMsg from './CustomerMsg';
import CustomerNorm from './CustomerNorm';
import CustomerRanking from './CustomerRanking';

class ReportNews extends React.Component {
  render() {
    return (
      <div>
        <Row style={{ margin: '1rem 0' }}>
          <CustomerNorm />
        </Row>
        <Row style={{ margin: '1rem 0' }}>
          <CustomerMsg />
        </Row>
        <Row style={{ margin: '1rem 0' }}>
          <CustomerIncome />
        </Row>
        <Row style={{ margin: '1rem 0' }}>
          <CustomerRanking />
        </Row>
      </div>
    )
  }
}
export default ReportNews;