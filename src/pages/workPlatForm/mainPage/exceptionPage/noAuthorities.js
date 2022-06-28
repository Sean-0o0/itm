import React from 'react';
import { Row } from 'antd';
import nodata from '../../../../assets/qsy.jpg';

class ExceptionPage extends React.Component {
  render() {
    return (
      <Row style={{ height: 'calc(100% - 5.5rem)', background: '#fff', display: 'flex', justifyContent: 'center', padding: '10% 1rem', marginTop: '1.333rem' }}>
        <div>
          <img src={nodata} alt="" width="240" /><div style={{ textAlign: 'center', color: '#b0b0b0', fontSize: '1.5rem', marginTop: '1.5rem' }}> 暂未分配权限，无可展示内容!</div>
        </div>
      </Row>
    );
  }
}
export default ExceptionPage;
