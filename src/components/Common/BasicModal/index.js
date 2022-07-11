import React from 'react';
import classnames from 'classnames';
import { Modal, Button } from 'antd';

class BasicModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const { defaultFullScreen, onAllWindowChange, style, width } = props;
    let defaultChangeStyle = 'min';
    let defaultWidth = width || 700;
    let defaultHeight = style && style.height ? style.height : '';
    let defaultTop = style && style.top ? style.top : '';
    // this.props.defaultFullScreen 是否默认最大化
    if (defaultFullScreen) {
      defaultChangeStyle = 'max';
      defaultWidth = document.body.scrollWidth;
      defaultHeight = document.body.offsetHeight;
      defaultTop = 0;
      if (onAllWindowChange && typeof onAllWindowChange === 'function') {
        onAllWindowChange({ defaultChangeStyle, defaultHeight, defaultWidth, defaultTop });
      }
    }
    this.state = {
      changeStyle: defaultChangeStyle,
      width: defaultWidth,
      height: defaultHeight,
      top: defaultTop,
    };
  }
  // 弹出层右上角关闭事件
  onCancelEvent = () => {
    this.setDefaultProps();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  // 确认按钮点击事件
  onOkBtn = () => {
    this.setDefaultProps();
    if (this.props.onOk) {
      this.props.onOk();
    }
  }
  // 取消按钮点击事件
  onCancelBtn = () => {
    this.setDefaultProps();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  // 每次弹框的时候都创建一个新的div
  getContainer = () => {
    const modalContent = document.getElementById('modalContent');
    const div = document.createElement('div');
    modalContent.appendChild(div);
    return div;
  }
  setDefaultProps = () => {
    this.setState({
      changeStyle: 'min',
      width: this.props.width || 700,
      height: this.props.style && this.props.style.height ? this.props.style.height : '',
      top: this.props.style && this.props.style.top ? this.props.style.top : '',
    });
  }
  allWindow = (e) => {
    const { onAllWindowChange } = this.props;
    const tempClass = e.currentTarget.className || '';
    let changeStyle = '';
    let height = 0;
    let width = 0;
    let top = 0;
    if (tempClass.indexOf('fangda') !== -1) {
      changeStyle = 'max';
      height = document.body.offsetHeight;
      width = document.body.scrollWidth;
      top = 0;
    } else {
      changeStyle = 'min';
      height = this.props.style && this.props.style.height ? this.props.style.height : 500;
      width = this.props.width || 700;
      top = this.props.style && this.props.style.top ? this.props.style.top : '2rem';
    }
    this.setState({ changeStyle, height, width, top });
    if (onAllWindowChange && typeof onAllWindowChange === 'function') {
      onAllWindowChange({ changeStyle, height, width, top });
    }
  }

  renderFooter() {
    const { confirmDisabled = false, confirmLoading = false, onOk, onCancel, okText, cancelText } = this.props; // eslint-disable-line
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {onCancel && <Button className="m-btn-radius m-btn-white" onClick={this.onCancelBtn} disabled={confirmLoading} style={{ fontSize: 'unset' }}>{cancelText || '关闭'}</Button>}
        {onOk && <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={this.onOkBtn} loading={confirmLoading} disabled={confirmDisabled} style={{ fontSize: 'unset' }}>{okText || '确 定'}</Button>}
      </div >
    );
  }

  render() {
    // isAllWindow 是否支持最大化 1:支持|0:不支持
    const { className, maskClosable = false, title, isAllWindow = 0, style = {}, onCancel, destroyOnClose = true, ...otherProps } = this.props;
    const { changeStyle, width, height, top = '2rem' } = this.state;
    return (
      <Modal
        ref={(c) => { this.modal = c; }}
        style={{ ...style, height, top }}
        destroyOnClose={destroyOnClose}
        getContainer={this.getContainer}
        footer={this.renderFooter()}
        title={isAllWindow === 1 ? [title, <i key={Math.random(1000)} className={`iconfont icon-${changeStyle === 'max' ? 'suoxiao' : 'fangda'}`} style={{ fontSize: '1.883rem', position: 'absolute', right: '5.2rem', cursor: 'pointer', height: '1.8rem', lineHeight: '3.2rem' }} onClick={this.allWindow.bind(this)} />] : title}
        maskClosable={maskClosable}
        className={classnames('m-modal-wrap', className)}
        onCancel={this.onCancelEvent}
        {...otherProps}
        width={width}
      />
    );
  }
}

export default BasicModal;
