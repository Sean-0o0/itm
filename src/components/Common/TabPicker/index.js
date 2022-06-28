import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;

class TabPicker extends Component {
  constructor(props) {
    super(props);
    const { value = '' } = props;
    this.state = {
      activeKey: value,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { value = '' } = nextProps;
    const { activeKey = '' } = prevState || {};
    if (value !== activeKey) {
      return {
        activeKey: value,
      };
    }
    // 默认不改动 state
    return null;
  }
  // tab版面切换的时候触发
  handleTabChange = (activeKey) => {
    this.setState({ activeKey });
    this.triggerChange(activeKey);
  }
  triggerChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }
  renderItem = (record = {}) => {
    const { titleKey = 'name', renderItem } = this.props;
    if (renderItem && typeof renderItem === 'function') {
      return renderItem(record);
    }
    return record[titleKey];
  }
  render() {
    const { activeKey = '' } = this.state;
    const { className, rowKey = 'id', label = '', dataSource = [] } = this.props;
    return (
      <Fragment>
        { label && label }
        <Tabs className={classnames('m-tabs-underline-second', styles.tabPicker, className)} activeKey={activeKey} onChange={this.handleTabChange}>
          {
            dataSource.map(item => <TabPane key={item[rowKey]} tab={this.renderItem(item)} />)
          }
        </Tabs>
      </Fragment>
    );
  }
}

export default TabPicker;
