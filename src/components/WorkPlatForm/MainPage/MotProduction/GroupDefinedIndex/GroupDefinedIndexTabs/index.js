/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
import GroupDefinedIndexLeftSearch from '../GroupDefinedIndexLeftSearch';
import GroupDefinedIndexRightMainContent from '../GroupDefinedIndexRightMainContent';

import { getDictKey } from '../../../../../../utils/dictUtils';

/**
 * 分组定义
 */

class GroupDefinedIndexTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      factorInfoData: [],
      type: true,
      yzID: '',
      selectedItem: {}, // 左边列表选中的MOT
    };
  }
  setCompany = (info) => {
    this.setState({
      selectedItem: info,
    });
  }

  // 调用子组件 方法 重新查询刷新页面
  fetchCompanyName = (tgtTp, id) => {
    this.child.fetchCompanyName(tgtTp, id, this.state.selectedItem);
  }

  setType = (value) => {
    // this.leftValue.setType(value);
    this.setState({ type: value });
  }
  setRight = (value) => {
    this.informationeRight.setType(value);
  }
  render() {
    const { type, selectedItem = {} } = this.state;
    const { dictionary } = this.props;
    const { [getDictKey('jsms')]: jsms = [] } = dictionary; // 分组树父节点
    return (
      <Fragment>
        <Row style={{ height: '100%', backgroundColor: '#FFF' }} className="mot-prod-scrollbar">
          <Col xs={6} sm={6} lg={6} xl={6} style={{ height: 'calc(100% - 2rem)', borderRight: '1px solid #E3E3E3', overflowY: 'auto' }}>
            {/* 左侧搜索组件 */}
            <GroupDefinedIndexLeftSearch dictionary={dictionary} onRef={(ref) => { this.child = ref; }} tgtTp={this.props.tgtTp} type={type} setType={this.setType} setRight={this.setRight} jsms={jsms} setCompany={this.setCompany} />
          </Col>
          <Col xs={18} sm={18} lg={18} xl={18} style={{ height: '100%', overflowY: 'auto' }}>
            {/* 右侧主要内容 */}
            <GroupDefinedIndexRightMainContent fetchCompanyName={this.fetchCompanyName} selectedItem={selectedItem} tgtTp={this.props.tgtTp} dictionary={dictionary} />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default GroupDefinedIndexTabs;
