/* eslint-disable no-empty */
import React, { Component } from 'react';
import { Button } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';

class ErrorMessageModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleCancel =() => {
    const { handleCancel } = this.props;
    if (typeof handleCancel === 'function') {
      handleCancel();
    }
  }

  handleOk=() => {
    const { handleOk } = this.props;
    if (typeof handleOk === 'function') {
      handleOk();
    }
  }

  render() {
    const { errMsg, visible = false } = this.props;
    let errorMessage = '';
    try { errorMessage = JSON.parse(errMsg).message; } catch (e) {}
    const modalProps = {
      className: 'mot-prod-scrollbar',
      bodyStyle: { padding: '1rem', maxHeight: '32rem', overflow: 'auto' },
      title: '错误信息',
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      footer: <div className="tr"><Button type="primary" className="m-btn-radius m-btn-headColor" onClick={this.handleCancel} style={{ fontSize: 'unset' }}>确定</Button></div>,
    };
    return (
      <BasicModal {...modalProps}>
        {errorMessage || errMsg}
      </BasicModal>
    );
  }
}

export default ErrorMessageModal;
