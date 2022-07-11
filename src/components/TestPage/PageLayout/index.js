import React from 'react';
import { Route, Switch } from 'dva/router';
import { Layout } from 'antd';
import PageHeader from './PageHeader';
import PageSider from './PageSider';
import NotFound from '../../../pages/Exception/404';

const { Footer, Content } = Layout;

const menuData = [
  {
    key: 'basicDataTable',
    name: 'basicDataTable',
    path: '/testPage/basicDataTable',
  },
  {
    key: 'dataTable',
    name: 'dataTable',
    path: '/testPage/dataTable',
  },
  {
    key: 'testPage 1',
    name: 'testPage 1',
    path: '/testPage/test1',
  },
  {
    key: 'testPage 2',
    name: 'testPage 2',
    path: '/testPage/test2',
  },
  {
    key: 'memberSingleSelect',
    name: 'memberSingleSelect',
    path: '/testPage/memberSingleSelect',
  },
  {
    key: 'vTable',
    name: 'vTable',
    path: '/testPage/vTable',
  },
  {
    key: 'cusGroup',
    name: '客户群相关组件',
    path: '/testPage/cusGroup',
  },
  {
    key: 'test3',
    name: 'test3',
    path: '/testPage/test3',
  },
  {
    key: 'g6Combo',
    name: 'G6群组',
    path: '/testPage/g6Combo'
  }
];

export default class TestPageLayout extends React.PureComponent {
  render() {
    const { routes, location } = this.props;
    return (
      <Layout className="blue-dark-theme" style={{ height: '100%' }}>
        <PageSider
          location={location}
          routes={routes}
          menuData={menuData}
        />
        <Layout id="scrollContent">
          <PageHeader />
          <Content>
            <Switch>
              {
                // 路由
                routes.map(({ key, path, component }) => (
                  <Route
                    key={key || path}
                    exact
                    path={path}
                    component={component}
                  />
                ))
              }
              {/* <Redirect exact from={`${prefix}/`} to={routes[0] ? routes[0].path : `${prefix}/404`} /> */}
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer>Footer</Footer>
          <Content id="modalContent" />
        </Layout>
      </Layout>
    );
  }
}
