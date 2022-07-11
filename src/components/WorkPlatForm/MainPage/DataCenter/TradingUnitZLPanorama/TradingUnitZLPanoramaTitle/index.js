import React from 'react';
import { Form, Row, Col,Card } from 'antd';

class TradingUnitZLPanoramaTitle extends React.Component {
    state = {

    }

    render() {
        const { } = this.state;
        const { } = this.props;

        return (
            <div className='tradingunitpanorama-card'>
                    <Card title="基本属性" style={{ width: '100%' }}>
                    <Row className='row2'>
                        <Col span={8}>交易单元名称<span className='content'>创富1113</span></Col>
                        <Col span={8}>使用情况<span className='content'>正常</span></Col>
                        <Col span={8}><span className='spec'>托管单元号</span><span className='content'>556677</span></Col>
                    </Row>
                    <Row className='row2'>
                        <Col span={8}>交易单元代码<span className='content'>112233</span></Col>
                        <Col span={8}>使用部门<span className='content'>金融衍生产品部</span></Col>
                        <Col span={8}><span className='spec'>管理部门</span><span className='content'>销售部</span></Col>
                    </Row>
                    <Row className='row2'>
                        <Col span={8}>交易单元市场<span className='content'>上交所</span></Col>
                        <Col span={8}>开通日期<span className='content'>2021-10-21</span></Col>
                        <Col span={8}><span className='spec'>子属性</span><span className='content'>A股（QFII专用）</span></Col>
                    </Row>
                    <Row className='row2'>
                        <Col span={8}>交易单元状态<span className='content'>租赁中</span></Col>
                        <Col span={8}>停用日期<span className='content'>2022-07-28</span></Col>
                        <Col span={8}><span className='spec'>联通圈</span><span className='content'>112332</span></Col>
                    </Row>
                    <Row className='row2'>
                        <Col span={8}>交易单元属性<span className='content'>QFII/RQFII</span></Col>
                    </Row>
                    </Card>
                </div>
        );
    }
}

export default Form.create()(TradingUnitZLPanoramaTitle);
