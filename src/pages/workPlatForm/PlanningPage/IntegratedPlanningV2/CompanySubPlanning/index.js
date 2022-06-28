import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import { connect } from 'dva';
import CompanySubPlan
  from '../../../../../components/WorkPlatForm/PlanningPage/IntegratedPlanning/IntegrationCont/CompanySubPlan';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';
class CompanySubPlanning extends Component {

    // 获取url参数
    getUrlParams = () => {
        const { match: { params: { params: encryptParams = '' } } } = this.props;
        // console.log("DecryptBase64(encryptParams)=", DecryptBase64(encryptParams));
        const params = JSON.parse(DecryptBase64(encryptParams));
        return params;
    }

    render() {
        const params = this.getUrlParams();
        return (
            <React.Fragment>
                <Row className='ip-body'>
                    <Col span={24} className='ip-cont'>
                      {/*<Tabs defaultActiveKey="1">*/}
                      {/*  <Tabs.TabPane tab="专项规划" key="1">*/}
                          <CompanySubPlan params={params}/>
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
}))(CompanySubPlanning);
