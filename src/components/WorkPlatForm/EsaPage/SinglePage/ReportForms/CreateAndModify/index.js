import React from 'react';
import { Row, Col } from 'antd';
import LeftList from './LeftList';
import RightList from './RightList';

class CreateAndModify extends React.Component {
  state = {
    wdID: '', // 维度ID
  }
  getListDetail = (wdID) => {
    this.setState({ wdID });
  }
  // 刷新右侧List数据
  refresRightList = () => {
    this.setState({ wdID: '' }, () => {
      if (this.rightList && this.rightList.getListData) {
        this.rightList.getListData();
      }
    });
  }
  render() {
    const { wdID = '' } = this.state;
    return (
      <Row className="m-row-pay-cont" style={{ margin: '0' }}>
        <Col xs={24} sm={6} md={5} lg={4} className="m-card-right">
          <LeftList wdID={wdID} getListDetail={this.getListDetail} refresRightList={this.refresRightList} />
        </Col>
        <Col xs={24} sm={18} md={19} lg={20}>
          <RightList ref={(node) => { this.rightList = node; }} wdID={wdID} />
        </Col>
      </Row>
    );
  }
}
export default CreateAndModify;
