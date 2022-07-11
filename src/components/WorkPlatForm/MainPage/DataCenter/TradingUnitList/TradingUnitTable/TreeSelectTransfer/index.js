import React from 'react';
import { Button } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import TransferItem from './transferItem';
// import { FetchSaveMySearchInfo } from '../../../../../../../../services/customerbase/customerListHandle';

class CustomizedColumn extends React.Component {
  state = {
    visibleModal: false,
    selectedKeys: [], // 已选指标IDs
    selectedTitles: [], // 已选指标名称
  };

  componentWillReceiveProps(nextProps) {
    const { targetKeys = [], titles = [] } = nextProps;
    this.setState({
      selectedKeys: targetKeys,
      selectedTitles: titles
    })
  }

  handleTransferSelect = ({ selectedKeys, selectedTitles }) => {
    this.setState({ selectedKeys, selectedTitles });
  }

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  }
  // 确定按钮
  handleOk = () => {
    // const { mockData = [] } = this.props;
    const { selectedKeys } = this.state;
    // const targetKeys = []
    // selectedKeys.forEach((item) => {
    //   const codeIndex = mockData.findIndex((temp) => { return temp.key === item; });
    //   if (codeIndex >= 0) {
    //     targetKeys.push(mockData[codeIndex]);
    //   }
    // })
    this.props.changeDisplayColumn(selectedKeys);
    this.setState({
      visibleModal: false,
    });
  }
  // 取消按钮
  handleCancel = () => {
    this.setState({
      visibleModal: false,
    });
  }
  render() {
    const { selectedKeys, selectedTitles } = this.state;
    const { mockData = [] } = this.props;

    return (
      <>
        {/* <div title="自定义输出列" className="icon-box" onClick={this.showModal} style={{cursor: 'pointer'}}>
          <a style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
            <i className="iconfont icon-zdysz" style={{ fontSize: '1.833rem' }} />
          </a>
        </div> */}

        <Button className="opt-button" style={{ margin: '.7rem' }} onClick={this.showModal}>自定义展示列</Button>

        <BasicModal
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          title="自定义列设置"
          width="50%"
          style={{ margin: '0 auto', top: '10rem' }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <TransferItem selectedKeys={selectedKeys} selectedTitles={selectedTitles} allDatas={mockData} handleTransferSelect={this.handleTransferSelect} />
        </BasicModal>
      </>
    );
  }
}
export default CustomizedColumn;
