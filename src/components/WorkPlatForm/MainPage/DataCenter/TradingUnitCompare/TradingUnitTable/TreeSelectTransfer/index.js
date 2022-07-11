import React from 'react';
// import { message } from 'antd';
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
      <span >
        <div title="自定义输出列" className="icon-box" onClick={this.showModal} style={{cursor: 'pointer', marginTop: '2rem'}}>
          <a style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
            <i className="iconfont icon-zdysz" style={{ fontSize: '2rem' }} />
          </a>
        </div>

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
      </span>
    );
  }
}
export default CustomizedColumn;
