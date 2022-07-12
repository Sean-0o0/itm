import React from 'react';
import { connect } from 'dva';
import { Route, Switch, Link } from 'dva/router';
import { Layout } from 'antd';
import lodash from 'lodash';
import Exception from '../../../components/Exception';

const { Content } = Layout;

class LargeScreenPageLayout extends React.PureComponent {
  render() {
    const { theme, route = {} } = this.props;
    const routes = lodash.get(route, 'routes', []);
    return (
      <Layout className={`${theme}`} style={{ height: '100%' }}>
        <Content style={{ minHeight: '100%', backgroundColor: '#fff' }}>
          <Switch>
            {
              // 路由
              routes.map(({ key, path, component }) => (
                <Route
                  key={key || path}
                  path={path}
                  component={component}
                />
              ))
            }
            {/* <Redirect exact from={`${prefix}/`} to={routes[0] ? routes[0].path : `${prefix}/404`} /> */}
            <Route render={() => <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />} />
          </Switch>
        </Content>
        <Content id="modalContent" />
      </Layout>
    );
  }
}

export default connect(({ global, largeScreen }) => ({
  theme: global.theme || '',
  largeScreen,
}))(LargeScreenPageLayout);
