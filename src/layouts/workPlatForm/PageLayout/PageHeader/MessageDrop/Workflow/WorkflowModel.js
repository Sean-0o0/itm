import React from 'react';
import { message } from 'antd';
import eventUtils from 'livebos-frame/dist/utils/event';
import LBFrameModal from '../../../../../../components/Common/BasicModal/LBFrameModal';
import { FetchLivebosLink } from '../../../../../../services/amslb/user';

class WorkflowModel extends React.Component {
  state = {
    url: '',
  }

  componentWillMount() {
    eventUtils.attachEvent('message', this.onMessage);
  }

  open = () => {
    const { data: { instId, step } } = this.props;
    this.getUrl(instId, step);
  }

  onClose = () => {
    this.setState({ visible: false });
    const { onRefresh, data: { msgId } } = this.props;
    if (msgId) {
      if (onRefresh) onRefresh(msgId);
    }
  };

  getUrl = (instId, step) => {
    if (instId === '' && step === '') return;
    this.setState({
      url: '',
    });
    FetchLivebosLink({
      object: 'WORKFLOWS',
      params: {
        instId,
        step,
      },
    }).then((ret = {}) => {
      const { data = '' } = ret;
      if (data) {
        this.setState({
          url: data,
          visible: true,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  onMessage = (event) => { // iframe的回调事件
    const { success: sc = false } = event || {};
    let msg = {};
    try {
      msg = JSON.parse(event.data);
      if (!msg) {
        // this.handleCancel();
      } else {
        const { success: sc1 = false, data: { success } } = msg;
        if ((sc || sc1 || success)) { // 操作完成后,刷新消息提醒条数
          this.onClose();
        }
        // this.handleCancel();
      }
    } catch (ignored) {
      return;
    }
    switch (msg.type) {
      case 'sessionTimeout':
        window.location.href = '/#/login';
        break;
      default:
        break;
    }
  }

  render() {
    const { url = '', visible } = this.state;
    const basicModalProps = {
      isAllWindow: 1,
      style: {
        overflowY: 'auto',
        top: '5rem',
      },
      destroyOnClose: true,
      title: '流程中心',
      width: '100rem',
      height: '55rem',
    };
    const basicFrameProps = { height: '50rem' };
    return (
      <LBFrameModal
        modalProps={{
          ...basicModalProps,
          visible,
          onCancel: this.onClose,
        }}
        frameProps={{
          ...basicFrameProps,
          src: `${localStorage.getItem('livebos') || ''}${url}&HideCancelBtn=true`,
          onMessage: this.onMessage,
        }}
      />
    );
  }
}

export default WorkflowModel;
