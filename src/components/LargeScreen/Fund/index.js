import React from 'react';
import { connect } from 'dva';
import { message, Row, Col } from 'antd';
import OverviewGroup from '../FundV2/OverviewGroup'
import RunState from './RunState'
import {

} from '../../../services/largescreen';

class Fund extends React.Component {
    state = {
        xzjjSettleCompletion: [],
        moduleCharts: [],
    };

    componentDidMount() {
        const { moduleCharts } = this.state
        moduleCharts.push({ chartTitle: "O32投资系统指标监控" })
    }

    componentWillUnmount() {

    }

    render() {
        const { xzjjSettleCompletion, moduleCharts } = this.state
        return (
            <div className="flex1 cont-wrap fund">

                <OverviewGroup />
                <Row style={{ marginTop: "3.229167rem" }}>
                    <Col span={15}>
                        {/* 估值指标 */}
                        <Col span={24}>
                            <div className="metrics-index ax-card">
                                <div className="index-title">
                                    <img className="data-item-img" src={[require("../../../image/ks_b.png")]} alt="" />
                                    估值指标监控</div>
                            </div>
                        </Col>
                        {/* 投资指标 */}
                        <Col span={8}>
                            <div className="invest-index ax-card">
                                <div className="index-title">O32投资系统指标监控</div>
                                <div className="wid34 pd10">
                                    <RunState xzjjSettleCompletion={xzjjSettleCompletion} chartConfig={moduleCharts[0]} />
                                </div>
                            </div>
                        </Col>
                        {/* 直销系统 */}
                        <Col span={16}>
                            <div className="metrics-index ax-card">
                                <div className="index-title">直销系统指标监控</div>
                            </div>
                        </Col>
                    </Col>
                    {/* TA指标 */}
                    <Col span={9}>
                        <div className="metrics-index ax-card">
                            <div className="index-title">TA指标监控</div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(Fund);
