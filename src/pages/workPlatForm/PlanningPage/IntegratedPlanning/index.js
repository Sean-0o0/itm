import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import IntegrationHeader from '../../../../components/WorkPlatForm/PlanningPage/IntegratedPlanning/IntegrationHeader';
import IntegrationCont from '../../../../components/WorkPlatForm/PlanningPage/IntegratedPlanning/IntegrationCont';

class IntegratedPlanning extends Component {
    render() {
        return (
            <React.Fragment>
                <Row className='ip-body'>
                    <Col span={24} className='ip-title'>
                        <IntegrationHeader/>
                    </Col>
                    <Col span={24} className='ip-cont'>
                        <IntegrationCont/>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(IntegratedPlanning);