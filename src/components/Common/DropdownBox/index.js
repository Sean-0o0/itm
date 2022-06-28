import React, { Component } from 'react';
import classnames from 'classnames';
import { Dropdown, Menu } from 'antd';
import styles from './index.less';

class DropdownBox extends Component {
  state = {
    id: `dropdownBox_${new Date().getTime()}_${this.props.id || Math.random()}`,
    visible: this.props.visible || false,
  }
  onVisibleChange = (visible) => {
    this.setState({ visible });
    const { onVisibleChange } = this.props;
    if (onVisibleChange) {
      onVisibleChange(visible);
    }
  }
  render() {
    const { id, visible: visibleInstate } = this.state;
    const { className, title, dropbox, style, visible = visibleInstate, closeOnClickMenu = false } = this.props;
    const clns = classnames(styles.dropdownBox, 'm-dropdown', className, visible && 'active');
    return (
      <span id={id} className={clns} style={style}>
        <Dropdown
          visible={visible}
          trigger={['click']}
          getPopupContainer={() => document.getElementById(id)}
          onVisibleChange={this.onVisibleChange}
          overlay={(
            <Menu>
              <Menu.Item key="0" onClick={() => { if (closeOnClickMenu) { this.setState({ visible: false }); } }}>
                {dropbox}
              </Menu.Item>
            </Menu>
          )}
        >
          <div className="m-dropdown-title">
            {title}
          </div>
        </Dropdown>
      </span>
    );
  }
}

export default DropdownBox;
