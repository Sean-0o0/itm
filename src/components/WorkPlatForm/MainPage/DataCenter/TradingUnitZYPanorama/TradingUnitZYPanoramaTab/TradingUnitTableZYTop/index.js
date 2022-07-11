import React, { Fragment } from 'react';
import { Row, Col, Card } from 'antd';

class TradingUnitTableZYTop extends React.Component {
    state = {
        loading: false,
        pageParam: {
            pageSize: 10,
            current: 1,
            total: 100,
            selectedRow: {},
            selectedRowKeys: ''
        }
    }

    render() {
        const { } = this.state;
        const { } = this.props;

        return (
            <div className='tradingunitpanorama-card'>
                <Card title="结算方式" style={{ width: '100%' }}>
                    <Row className='row2'>
                        <Col span={8}>结算账户名称<span className='content'>国金创富1113</span></Col>
                        <Col span={8}>结算账户<span className='content'>1373293871</span></Col>
                        <Col span={8}><span className='spec'>结算方式</span><span className='content'>银行结算</span></Col>
                    </Row>
                </Card>
            </div>

        );
    }
}

export default TradingUnitTableZYTop;