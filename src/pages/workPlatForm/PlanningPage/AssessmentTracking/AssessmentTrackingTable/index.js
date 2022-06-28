import React, { Fragment } from 'react';
import { Row, } from 'antd';
import { connect } from 'dva';
import AssessmentTrackingTable from '../../../../../components/WorkPlatForm/PlanningPage/AssessmentTracking/AssessmentTrackingTable'
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';
class AssessmentTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { match: { params } } = this.props;
        const jsonParam = JSON.parse(DecryptBase64(params.params));
        return (
            <Fragment>
                <Row style={{ height: '100%' }} className='dp-body' >
                    <AssessmentTrackingTable param={jsonParam} />
                </Row>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
    userBasicInfo: global.userBasicInfo
}))(AssessmentTracking);
