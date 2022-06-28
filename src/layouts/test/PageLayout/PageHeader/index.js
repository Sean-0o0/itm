import React from 'react';
import { Layout } from 'antd';

export default class PageHeader extends React.PureComponent {
  render() {
    return (
      <Layout.Header style={{ color: '#fff' }}>
        头部
      </Layout.Header>
    );
  }
}
