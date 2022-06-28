import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import CompanySub from '../../../../../components/WorkPlatForm/PlanningPage/IntegratedPlanning/IntegrationCont/CompanySub';
class CompanySubList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let params = {};
        if (this.props.location.query) {
            if (this.props.location.query.headState) {
                params = this.props.location.query.headState;
            }
        }
        //console.log("------this.params-----",params)
        return (
            <Fragment>
                <Row className='evaluation-body'>
                    {/* <Col span={24} className='dp-title'>
                        <PlanDeclare />
                    </Col> */}
                    <Col span={24}>
                        <Row>
                            {/* params={Number(planType)} onCancelOperate={onCancelOperate} */}
                            <CompanySub params={params} />
                        </Row>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(CompanySubList);
