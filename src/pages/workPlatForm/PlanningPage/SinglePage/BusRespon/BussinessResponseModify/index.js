import React, { Fragment } from 'react';
import { Row, Col, } from 'antd';
import { connect } from 'dva';
import BussinessResponseContent from '../../../../../../components/WorkPlatForm/PlanningPage/SinglePage/BusResponListPlan/BussinessResponseModify/BussinessAssessmentContent'
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';
class BussinessAssessmentModify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { match: { params }, onCancelOperate, onSubmitOperate } = this.props;
        //onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate}
        const jsonParam = JSON.parse(DecryptBase64(params.params));

        return (
            <Fragment>
                <Row style={{ height: '100%' }} className='dp-body'>
                    {/* <Col span={24} className='dp-title'>
                        <PlanDeclare />
                    </Col> */}
                    <Col span={24} className='dp-cont'>
                        <Row>
                            <BussinessResponseContent jsonParam={jsonParam.planId ? jsonParam : jsonParam.planId} onSubmitOperate={onSubmitOperate} onCancelOperate={onCancelOperate} />
                        </Row>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(BussinessAssessmentModify);
