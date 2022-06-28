import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { DecryptBase64 } from '../../../../components/Common/Encrypt'
import EvaluationSchemeList from '../../../../components/WorkPlatForm/PlanningPage/SinglePage/AccessPlan/EvaluationSchemeList'
class EvaluationSchemeListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
      let params ={};
      if (this.props.location.query) {
        if (this.props.location.query.headState) {
          params = this.props.location.query.headState;
        }
      }
        //console.log("------this.params-----",params)
        return (
            <Fragment>
                <Row style={{ height: '100%' }} className='evaluation-body'>
                    {/* <Col span={24} className='dp-title'>
                        <PlanDeclare />
                    </Col> */}
                    <Col span={24} >
                        <Row>
                            {/* params={Number(planType)} onCancelOperate={onCancelOperate} */}
                            <EvaluationSchemeList  params={params}/>
                        </Row>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(EvaluationSchemeListPage);
