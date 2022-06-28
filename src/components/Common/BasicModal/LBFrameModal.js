import React from 'react';
import LBFrame from 'livebos-frame';
import BasicModal from './';

class LBFrameModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allWindowProps: {},
    };
  }

  onAllWindowChange = (props) => {
    this.setState({ allWindowProps: props });
  }

  render() {
    const { allWindowProps } = this.state;
    const { modalProps = {}, frameProps = {} } = this.props;
    const { isAllWindow, defaultFullScreen = false, height: defaultModalHeight } = modalProps;
    const { height: defaultFrameHeight } = frameProps;
    let frameHeight;
    let modalHeight;
    if (isAllWindow !== 1) { // 不支持最大化
      frameHeight = defaultFrameHeight || '40rem';
      modalHeight = defaultModalHeight || '50rem';
    } else if (!allWindowProps.changeStyle) { // 支持最大化-初始状态
      if (defaultFullScreen) {
        frameHeight = document.body.offsetHeight - 62; // 减去modal头部高度
        modalHeight = document.body.offsetHeight;
      } else {
        frameHeight = defaultFrameHeight || '40rem';
        modalHeight = defaultModalHeight || '50rem';
      }
    } else { // 支持最大化-已放大/还原
      frameHeight = allWindowProps.changeStyle === 'max' ? allWindowProps.height - 62 : (defaultFrameHeight || '40rem');
      modalHeight = allWindowProps.changeStyle === 'max' ? allWindowProps.height : (defaultModalHeight || '50rem');
    }
    // 弹出框属性
    const basicModalProps = {
      // isAllWindow: 1,
      // defaultFullScreen: true, 默认全屏
      onAllWindowChange: this.onAllWindowChange,
      footer: null,
      ...modalProps,
      height: modalHeight,
    };
    // frame属性
    const lbFrameProps = {
      src: '',
      id: 'defaultFID',
      display: 'initial',
      allowFullScreen: true,
      frameborder: 'no',
      border: '0',
      style: {
        background: 'white',
        position: 'absolute',
        width: '100%',
        height: frameHeight,
      },
      ...frameProps,
    };
    return (
      <BasicModal {...basicModalProps}>
        <LBFrame {...lbFrameProps} />
      </BasicModal>
    );
  }
}

export default LBFrameModal;
