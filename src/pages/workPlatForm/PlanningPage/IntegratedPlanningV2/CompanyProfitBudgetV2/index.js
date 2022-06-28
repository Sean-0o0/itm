import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import CompanyProfitBudget
  from '../../../../../components/WorkPlatForm/PlanningPage/IntegratedPlanning/IntegrationCont/CompanyProfitBudget';

class CompanyProfitBudgetV2 extends Component {
    render() {
        return (
            <React.Fragment>
                <Row className='ip-body'>
                    <Col span={24} className='ip-cont'>
                      {/*<Tabs defaultActiveKey="1">*/}
                      {/*  <Tabs.TabPane tab="公司预算" key="2">*/}
                          <CompanyProfitBudget />
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
}))(CompanyProfitBudgetV2);
