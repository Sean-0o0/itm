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
    this.container = null;
  }

  componentDidUpdate(prevProps) {
    const { visible, dragable = true } = this.props;
    const { visible: oldVisible } = prevProps;
    if (!oldVisible && visible && dragable && this.container ) {
      // 等dom节点渲染完全
      setTimeout(() => {
        this.initDragEnevt();
      }, 100);
    }
  }

  initDragEnevt = () => {
    const { destroyOnClose = true } = this.props;
    if (!destroyOnClose) {
      // 关闭不销毁元素时候,避免多次执行产生多个拉伸块
      const resizeElOld = this.container.querySelector('#resizeEl');
      if (resizeElOld) {
        return false;
      }
    }

    const modalHeader = this.container.querySelector('.ant-modal-header');

    // 清除选择头部文字效果
    modalHeader.onselectstart = () => false;
    // 头部加上可拖动cursor
    modalHeader.style.cursor = 'move';
    // 弹窗
    const dragDom = this.container.querySelector('.ant-modal');

    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    const moveDown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - modalHeader.offsetLeft;
      const disY = e.clientY - modalHeader.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL, styT;
      styL = +sty.left.replace(/\px/g, '');
      styT = +sty.top.replace(/\px/g, '');

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      };

      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    modalHeader.onmousedown = moveDown;

    // 拉伸
    // 弹框可拉伸最小宽高
    const minWidth = 400;
    const minHeight = 300;
    const resizeEl = document.createElement('div');
    dragDom.appendChild(resizeEl);
    dragDom.style.paddingBottom = '0';
    // 在弹窗右下角加上一个10-10px的控制块
    resizeEl.id = 'resizeEl';
    resizeEl.style.cursor = 'se-resize';
    resizeEl.style.position = 'absolute';
    resizeEl.style.height = '10px';
    resizeEl.style.width = '10px';
    resizeEl.style.right = '0px';
    resizeEl.style.bottom = '0px';
    // resizeEl.style.background = 'red';
    resizeEl.style.pointerEvents = 'auto';
    const content = this.container.querySelector('.ant-modal-content');
    // 鼠标拉伸弹窗
    resizeEl.onmousedown = (e) => {
      // 记录初始x位置
      const clientX = e.clientX;
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - resizeEl.offsetLeft;
      const disY = e.clientY - resizeEl.offsetTop;

      document.onmousemove = function(e) {
        e.preventDefault(); // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const x = e.clientX - disX + (e.clientX - clientX);// 这里 由于布局样式控制居中的，所以水平拉伸效果是双倍
        const y = e.clientY - disY;
        // 比较是否小于最小宽高
        dragDom.style.width = x > minWidth ? `${x}px` : minWidth + 'px';
        dragDom.style.height = y > minHeight ? `${y}px` : minHeight + 'px';
        content.style.width = x > minWidth ? `${x}px` : minWidth + 'px';
        content.style.height = y > minHeight ? `${y}px` : minHeight + 'px';
      };
      // 拉伸结束
      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
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
    this.container = div; // 记录一下div 供拖拽使用
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
      <div>
        { onOk && <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={this.onOkBtn} loading={confirmLoading} disabled={confirmDisabled} style={{ fontSize: 'unset' }}>{okText || '确 定'}</Button>}
        { onCancel && <Button className="m-btn-radius m-btn-white" onClick={this.onCancelBtn} disabled={confirmLoading} style={{ fontSize: 'unset' }}>{cancelText || '取 消'}</Button>}
      </div>
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
        title={isAllWindow === 1 ? [title, <i key={Math.random(1000)} className={`iconfont icon-${changeStyle === 'max' ? 'suoxiao' : 'fangda'}`} style={{ fontSize: '1.583rem', position: 'absolute', right: '3.5rem', cursor: 'pointer', height: '1.8rem', lineHeight: '1.7rem' }} onClick={this.allWindow.bind(this)} />] : title}
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
