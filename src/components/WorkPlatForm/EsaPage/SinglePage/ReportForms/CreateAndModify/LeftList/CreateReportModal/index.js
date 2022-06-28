import React from 'react';
import { connect } from 'dva';
import { Tag } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import CreateReportForm from './CreateReportForm';


class CreateReportModal extends React.Component {
  state = {
    modalVisible: false,
  }
  handleClick = () => {
    this.setState({
      modalVisible: true,
    });
  }
  handleOnCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  render() {
    const { refresRightList } = this.props;
    return (
      <React.Fragment>
        <Tag className="m-pay-tag m-tag-add" onClick={this.handleClick}><i className="iconfont icon-add" /><span>创建报表</span></Tag>
        <BasicModal
          title="新建报表"
          width="60rem"
          style={{ top: '2rem' }}
          visible={this.state.modalVisible}
          onCancel={this.handleOnCancel}
          footer={null}
        >
          <CreateReportForm onCancel={this.handleOnCancel} refresRightList={refresRightList} />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(CreateReportModal);
