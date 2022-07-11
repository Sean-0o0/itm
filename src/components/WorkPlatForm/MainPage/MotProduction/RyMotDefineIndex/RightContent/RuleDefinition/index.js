/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import ConfiguredParameters from './ConfiguredParameters';
import CustomerRelation from './CustomerRelation';
import Customer from './Customer';

// 引入请求路径的示例


// 右边内容模块-规则定义
class RuleDefinition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffId: '', // 登陆的员工ID
    };
  }


  componentWillMount() {
    // this.fetchData()
  }


  componentWillReceiveProps() {
    // this.fetchData()
  }

  // fetchData = () => {
  //     FetchqueryStaffInfo().then(res => {
  //         const { code = 0, records = [], note = "" } = res
  //         if (code > 0 && records.length > 0) {
  //             this.setState({
  //                 staffId: records[0].ryid,
  //             })
  //         }
  //     }).catch((error) => {
  //         message.error(!error.success ? error.message : error.note);
  //     });
  // }


  render() {
    const { dictionary = {}, motDetail = {}, tgtTp, selectedMotId, userInfo = {}, fetchMotDetail } = this.props;
    const staffId = userInfo.ryid;

    return (
      <Fragment>
        <Row>
          <p style={{ color: '#333333', fontWeight: 'bold' }}>规则定义</p>
          <Row >
            <ConfiguredParameters motDetail={motDetail} />
          </Row>
          <Row style={{ margin: '20px 0' }}>
            <Col xs={11} sm={11} md={11} lg={11} xl={11} style={{ float: 'left' }}>
              <CustomerRelation fetchMotDetail={fetchMotDetail} motDetail={motDetail} dictionary={dictionary} staffId={staffId} tgtTp={tgtTp} selectedMotId={selectedMotId} userInfo={userInfo} />
            </Col>
            <Col xs={11} sm={11} md={11} lg={11} xl={11} style={{ float: 'right' }}>
              <Customer fetchMotDetail={fetchMotDetail} motDetail={motDetail} dictionary={dictionary} staffId={staffId} tgtTp={tgtTp} selectedMotId={selectedMotId} userInfo={userInfo} />
            </Col>
          </Row>

        </Row>
      </Fragment>
    );
  }
}

export default RuleDefinition;
