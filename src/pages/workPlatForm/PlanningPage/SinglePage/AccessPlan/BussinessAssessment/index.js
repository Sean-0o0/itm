import React, { Fragment } from 'react';
import { Row, Col, Select, Menu } from 'antd';
import { connect } from 'dva';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt'
import BussinessAssessmentContent from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/BussinessAssessment/BussinessAssessmentContent'
class BussinessAssessment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { match: { params }, onCancelOperate } = this.props;
        const planType = JSON.parse(DecryptBase64(params.params)).planType
        return (
            <Fragment>
                <Row style={{ height: '100%' }} className='dp-body'>
                    {/* <Col span={24} className='dp-title'>
                        <PlanDeclare />
                    </Col> */}
                    <Col span={24} className='dp-cont'>
                        <Row>
                            <BussinessAssessmentContent params={Number(planType)} onCancelOperate={onCancelOperate} />
                        </Row>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(BussinessAssessment);
