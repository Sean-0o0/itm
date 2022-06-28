import React from 'react';
import classnames from 'classnames';
import { Drawer } from 'antd';

class BasicDrawer extends React.PureComponent {
  // 每次弹抽屉的时候都创建一个新的div,沿用Modal的容器
  getContainer = () => {
    const modalContent = document.getElementById('modalContent');
    const div = document.createElement('div');
    modalContent.appendChild(div);
    return div;
  }

  render() {
    // isAllWindow 是否支持最大化 1:支持|0:不支持
    const { className, maskClosable = false, title, isAllWindow = 0, style = {}, onCancel, ...otherProps } = this.props; // eslint-disable-line
    return (
      <Drawer
        destroyOnClose
        getContainer={this.getContainer}
        maskClosable={maskClosable}
        className={classnames('m-drawer-wrap', className)}
        {...otherProps}
      />
    );
  }
}

export default BasicDrawer;
