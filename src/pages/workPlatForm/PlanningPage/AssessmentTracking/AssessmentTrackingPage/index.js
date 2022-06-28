import React, { Fragment } from 'react';
import { Row, Col, Select, Menu } from 'antd';
import { connect } from 'dva';
import AssessmentTrackingCom from '../../../../../components/WorkPlatForm/PlanningPage/AssessmentTracking/AssessmentTrackingPage'
class AssessmentTracking extends React.Component {
    //const { match: { params }, userBasicInfo = {} } = this.props;
    // const jsonParam = JSON.parse(DecryptBase64(params.params));
    // //console.log("jsonParam===", jsonParam)

    // return (
    //     <VariousTypeScoreComponent />
    //     // <VariousTypeScoreComponent params={jsonParam} userBasicInfo={userBasicInfo} />
    //   );
    render() {
        // const { dictionary = {},match: { params }, userBasicInfo = {}  } = this.props;
        // const jsonParam = JSON.parse(DecryptBase64(params.params));
        // //console.log("pagejsonParam===", jsonParam)
        return (
            <Fragment>
                <Row style={{ height: '100%' }} className='dp-body'>

                    <AssessmentTrackingCom  />

                </Row>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
    userBasicInfo: global.userBasicInfo
}))(AssessmentTracking);
