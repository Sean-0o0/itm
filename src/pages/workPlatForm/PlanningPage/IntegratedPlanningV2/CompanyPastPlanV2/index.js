import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import CompanyPastPlan
  from '../../../../../components/WorkPlatForm/PlanningPage/IntegratedPlanning/IntegrationCont/CompanyPastPlan';
class CompanyPastPlanV2 extends Component {
    render() {
        return (
            <React.Fragment>
                <Row className='ip-body'>
                    <Col span={24} className='ip-cont'>
                      {/*<Tabs defaultActiveKey="1">*/}
                      {/*  <Tabs.TabPane tab="专项规划" key="1">*/}
                          <CompanyPastPlan />
                      {/*  </Tabs.TabPane>*/}
                      {/*</Tabs>*/}
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(CompanyPastPlanV2);
