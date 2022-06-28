import React from 'react';
import { Layout } from 'antd';

export default class PageHeader extends React.PureComponent {
  state={
  }
  render() {
    const { toggleCollapsed, collapsed = false } = this.props;
    return (
      <Layout.Header className="m-header m-header360 " style={{ width: '100%', height: '5rem', paddingLeft: collapsed ? '5rem' : '16.666rem' }}>
        <div>
          {
            !collapsed && <span className="menu-list" onClick={toggleCollapsed}><i className="iconfont icon-menu" /></span>
          }
        </div>
      </Layout.Header>
    );
  }
}
