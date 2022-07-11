/* eslint-disable no-unused-expressions */
import React, { Fragment } from 'react';
import { Row, Modal, Tree } from 'antd';
import TabContent from './TabContent';


class LeftContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      yyb: 'XX证券',
    };
  }


  componentWillMount() {

  }

    // 显示营业部选择框
    showModal = () => {
      this.setState({
        visible: true,
      });
    };

    // 选择营业部确认
    handleOk = () => {
      this.setState({
        visible: false,
      });
      const { yybId = 1 } = this.state;
      this.props.onYybChange(yybId);
    };

    handleCancel = () => {
      this.setState({
        visible: false,
      });
    };


    // 选中树节点
    onSelect = (selectedKeys, e) => {
      const { selectedNodes = [] } = e;
      if (selectedNodes.length > 0) {
        const yyb = selectedNodes[0].props.title;
        const yybId = selectedNodes[0].props.value;

        this.setState({
          yyb,
          yybId,
        });
      }
    }

    // 目标类型面板改变
    onTabChange = (key) => {
      this.props.onTabsChange(key);
    }


    render() {
      const { yyb } = this.state;
      const { yybData = [], leftListData = [], onkeyWordSearch, dictionary = {}, leftPanelList = [], onMotClick, selectedMotId } = this.props;

      return (
        <Fragment>


          <div style={{ padding: '0 1rem 1rem 2rem' }}>
            <i className="iconfont icon-shouye" />
            <span style={{ padding: '0 0 0 1rem', cursor: 'pointer' }} onClick={this.showModal}>{yyb}</span>
          </div>


          <Row >
            <TabContent selectedMotId={selectedMotId} dictionary={dictionary} onMotClick={onMotClick} leftListData={leftListData} leftPanelList={leftPanelList} onkeyWordSearch={onkeyWordSearch} />
          </Row>


          <Modal

            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            centered
          >
            <Row style={{ overflow: 'auto', height: '20rem' }}>
              <Tree
                onSelect={this.onSelect}

                treeData={yybData}
              />
            </Row>

          </Modal>

        </Fragment >
      );
    }
}

export default LeftContent;
