import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import BusinessResponList from '../../../../components/WorkPlatForm/PlanningPage/SinglePage/BusResponListPlan/BusinessResponList';
class BusResponListPage extends React.Component {
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
        return (
            <Fragment>
                <Row style={{ height: '100%' }} className='evaluation-body'>
                    <Col span={24} >
                        <Row>
                            <BusinessResponList  params={params}/>
                        </Row>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(BusResponListPage);
