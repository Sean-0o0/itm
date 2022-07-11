import React, { Fragment } from 'react';
import { Row, Col, Divider, Timeline, Tag } from 'antd';

class TradingUnitTableLCButttom extends React.Component {
    state = {

    }

    render() {
        const { } = this.state;
        const { } = this.props;

        return (
            <div>
                <Row>
                    <Col span={12}>
                        <div className='tradingunitlist-table' style={{ margin: '2rem 0' }}>
                            <div className='tradingunitlist-table-opt'>
                                变动信息
                            </div>
                            <Divider style={{ marginTop: '2rem' }}></Divider>
                            <div style={{ height: '50rem', overflowY: 'auto' }}>
                                <Timeline style={{ margin: '1rem' }}>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                    <Timeline.Item style={{ padding: '0 0 2rem', fontSize: '1.2rem' }} color="rgba(74, 175, 237, 1)"><p style={{ display: 'flex' }}><div style={{ width: '50%' }}>这里是对应的流程名称有这么长长长</div><div style={{ width: '50%', textAlign: 'end' }}>2022-05-17 17:30</div></p>
                                        <p>这里是对应的流程内容内容有这么长长长</p>
                                    </Timeline.Item>
                                </Timeline>
                            </div>
                        </div>
                    </Col>


                    <Col span={12} style={{ paddingLeft: '2rem' }}>
                        <div className='tradingunitlist-table'>
                            <div className='tradingunitlist-table-opt'>
                                风险信息
                            </div>
                            <Divider style={{ marginTop: '2rem' }}></Divider>
                            <div style={{ height: '50rem', overflowY: 'auto' }}>
                                <div style={{ backgroundColor: 'rgba(249, 249, 249, 1)', width: '100%', height: '12rem' }}>
                                    <Row style={{ padding: '2rem' }}>
                                        <Col span={16}>
                                            <Tag color="rgba(247, 80, 57, 1)" style={{ fontSize: '1.2rem' }}>流程超期</Tag>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'end' }}>
                                            2022-05-06 15:07
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '0 2rem 2rem 2rem' }}>
                                        <Col span={24} style={{fontWeight: '400',color: '#292929',lineHeight: '20px',}}>
                                            交易单元一号权限变更超过一个月未办结交易单元一号权限变更超过一个月未办结
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ backgroundColor: 'rgba(249, 249, 249, 1)', width: '100%', height: '12rem',margin: '2rem 0',}}>
                                    <Row style={{ padding: '2rem' }}>
                                        <Col span={16}>
                                            <Tag color="rgba(247, 199, 57, 1)" style={{ fontSize: '1.2rem' }}>属性分类不符</Tag>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'end' }}>
                                            2022-05-06 15:07
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '0 2rem 2rem 2rem' }}>
                                        <Col span={24} style={{fontWeight: '400',color: '#292929',lineHeight: '20px',}}>
                                            交易单元一号权限变更超过一个月未办结交易单元一号权限变更超过一个月未办结
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ backgroundColor: 'rgba(249, 249, 249, 1)', width: '100%', height: '12rem',margin: '2rem 0', }}>
                                    <Row style={{ padding: '2rem' }}>
                                        <Col span={16}>
                                            <Tag color="rgba(247, 137, 57, 1)" style={{ fontSize: '1.2rem' }}>网关到期提醒</Tag>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'end' }}>
                                            2022-05-06 15:07
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '0 2rem 2rem 2rem' }}>
                                        <Col span={24} style={{fontWeight: '400',color: '#292929',lineHeight: '20px',}}>
                                            交易单元一号权限变更超过一个月未办结交易单元一号权限变更超过一个月未办结
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ backgroundColor: 'rgba(249, 249, 249, 1)', width: '100%', height: '12rem',margin: '2rem 0', }}>
                                    <Row style={{ padding: '2rem' }}>
                                        <Col span={16}>
                                            <Tag color="rgba(247, 80, 57, 1)" style={{ fontSize: '1.2rem' }}>网关停止超期提醒</Tag>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'end' }}>
                                            2022-05-06 15:07
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '0 2rem 2rem 2rem' }}>
                                        <Col span={24} style={{fontWeight: '400',color: '#292929',lineHeight: '20px',}}>
                                            交易单元一号权限变更超过一个月未办结交易单元一号权限变更超过一个月未办结
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ backgroundColor: 'rgba(249, 249, 249, 1)', width: '100%', height: '12rem',margin: '2rem 0', }}>
                                    <Row style={{ padding: '2rem' }}>
                                        <Col span={16}>
                                            <Tag color="rgba(247, 80, 57, 1)" style={{ fontSize: '1.2rem' }}>网关停止超期提醒</Tag>
                                        </Col>
                                        <Col span={8} style={{ textAlign: 'end' }}>
                                            2022-05-06 15:07
                                        </Col>
                                    </Row>
                                    <Row style={{ padding: '0 2rem 2rem 2rem' }}>
                                        <Col span={24} style={{fontWeight: '400',color: '#292929',lineHeight: '20px',}}>
                                            交易单元一号权限变更超过一个月未办结交易单元一号权限变更超过一个月未办结
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </Col>

                </Row>
            </div>
        );
    }
}

export default TradingUnitTableLCButttom;