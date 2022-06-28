import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import CompanyBusinessPlan
  from '../../../../../components/WorkPlatForm/PlanningPage/IntegratedPlanning/IntegrationCont/CompanyBusinessPlan';

class CompanyBusinessPlanV2 extends Component {
    render() {
        return (
            <React.Fragment>
                <Row className='ip-body'>
                    <Col span={24} className='ip-cont'>
                      {/*<Tabs defaultActiveKey="1">*/}
                        {/*<Tabs.TabPane tab="年度规划" key="3">*/}
                          <CompanyBusinessPlan />
                        {/*</Tabs.TabPane>*/}
                      {/*</Tabs>*/}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(CompanyBusinessPlanV2);
