import React, { Component } from 'react';
import classnames from 'classnames';
import { Spin, Collapse } from 'antd';
import styles from './index.less';

const Panel = (props) => {
  const { header, className, ...others } = props;
  return (
    <Collapse.Panel
      {...others}
      className={classnames(styles.panel, className)}
      header={header}
    />
  );
};

class BasicMenuCollapse extends Component {
  render() {
    const { loading = false, className, ...others } = this.props;
    return (
      <Spin spinning={loading}>
        <Collapse {...others} className={classnames(styles.basicMenuCollapse, className)} />
      </Spin>
    );
  }
}

export default BasicMenuCollapse;
export {
  Panel,
};
