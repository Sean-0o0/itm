import React from 'react';
import { Route, Switch } from 'dva/router';
import { Layout } from 'antd';
import lodash from 'lodash';
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
    key: 'test3',
    name: 'test3',
    path: '/testPage/test3',
  },
];

export default class TestPageLayout extends React.PureComponent {
  render() {
    const { route = {}, location } = this.props;
    const routes = lodash.get(route, 'routes', []);
    return (
      <Layout className="default-dark-theme" style={{ height: '100%' }}>
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
