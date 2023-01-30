import React from 'react';
import BasicModal from './';
import Bridge from 'livebos-bridge';
import { Spin } from 'antd';

const { getThemeName, getUser } = Bridge.selectors

const { events } = Bridge.constants

class BridgeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allWindowProps: {},
      bridge: null,
      isSpinning: true,
    };
    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    if(this.props.isSpining && this.props.isSpining == 'customize') {
      this.setState({isSpinning: false});
    }
    setTimeout(() => {
      this.iframeRef.current.onload = (() => {
        this.connect();
      })
    }, 0)

  }

  connect = () => {
    const { onSucess } = this.props;
    const bridge = new Bridge(this.iframeRef.current.contentWindow)
    bridge.onReady(() => {
      bridge.on(events.SESSION_TIME_OUT, () => {
        window.location.href = '/#/login';
      })
      bridge.on(events.OPERATE_CALLBACK, (data) => {
        const { callback: { cancelFlag }, success } = data;
        if (cancelFlag === true) {
          this.close()
        }
        if (success === true) {
          onSucess();
          this.close()
        }
      })
      this.setState({
        bridge,
        isSpinning: false,
      })
    })
  }

  close = () => {
    const { bridge = null } = this.state;
    if (bridge !== null) {
      bridge.close()
      this.setState({
        bridge: null
      })
    }
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel()
    }

  }

  onAllWindowChange = (props) => {
    this.setState({ allWindowProps: props });
  }

  render() {
    const { allWindowProps, isSpinning } = this.state;
    const { modalProps = {}, src = '' } = this.props;
    const { isAllWindow, defaultFullScreen = false, height: defaultModalHeight } = modalProps;
    let frameHeight;
    let modalHeight;
    if (isAllWindow !== 1) { // 不支持最大化
      frameHeight = defaultModalHeight ? `calc(${defaultModalHeight} - 62px)` : '40rem'
      modalHeight = defaultModalHeight || '50rem';
    } else if (!allWindowProps.changeStyle) { // 支持最大化-初始状态
      if (defaultFullScreen) {
        frameHeight = document.body.offsetHeight - 62; // 减去modal头部高度
        modalHeight = document.body.offsetHeight;
      } else {
        frameHeight = defaultModalHeight ? `calc(${defaultModalHeight} - 62px)` : '40rem'
        modalHeight = defaultModalHeight || '50rem';
      }
    } else { // 支持最大化-已放大/还原
      frameHeight = allWindowProps.changeStyle === 'max' ? allWindowProps.height - 62 : (defaultModalHeight ? `calc(${defaultModalHeight} - 62px)` : '40rem');
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
      onCancel: this.close
    };

    // diy-style-spin样式写于pmsPage.less里
    return (
      <BasicModal {...basicModalProps}>
        <Spin spinning={isSpinning} tip='加载中' size='large' wrapperClassName='diy-style-spin'>
          <iframe style={{ width: '100%', borderColor: 'transparent', height: frameHeight }} ref={this.iframeRef} title='livebos' src={src} />
        </Spin>
      </BasicModal>
    );
  }
}

export default BridgeModal;
