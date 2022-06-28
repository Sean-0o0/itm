import React from 'react';
import { connect } from 'dva';
import { Route, Switch, Redirect } from 'dva/router';
import lodash from 'lodash';
import { Layout } from 'antd';
import PageSider from './PageSider';
import PageHeader from './PageHeader';
import NotFound from '../../../../../pages/Exception/404';
import logo from '../../../../../assets/logo.png';

const { Content } = Layout;
const prefix = '';
class SalaryVersionDetailLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    // 获取菜单默认展开状态，0：不展开，1：展开
    // const menuExpansion = localStorage.getItem('menuExpansion');
    this.state = {
      collapsed: false,
    };
  }
  componentDidMount() {
    // authPromise 向服务器发送认证请求，示例以Promise形式返回，result表示认证是否成功
    this.props.dispatch({
      type: 'global/checkAuth',
    });
  }
  getMenuData = (menuData, versionData) => {
    return menuData.map((item) => {
      const { path, children } = item;
      if (children && children.length > 0) { // 如果有子菜单,那么就递归调用该函数
        return {
          ...item,
          children: this.getMenuData(children, versionData),
        };
      }

      return {
        ...item,
        path: `${path}${versionData ? `/${versionData}` : ''}`,
      };
    });
  }
  // 主题样式改变
  handleThemeChange = (theme) => {
    this.props.dispatch({
      type: 'global/changeTheme',
      payload: { theme },
    });
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    const { theme, route = {}, userBusinessRole, location, hasAuthed, salaryVersionDetail } = this.props;
    const routes = lodash.get(route, 'routes', []);
    const { versionData, menuData } = salaryVersionDetail;
    const menuDataWithId = this.getMenuData(menuData, versionData);
    if (!hasAuthed) {
      return null;
    }
    return (
      <div className={`${theme} ${this.state.collapsed ? 'hild-menu-box' : ''}`} >
        <Layout className="m-layout">
          <PageSider
            collapsed={this.state.collapsed}
            location={location}
            toggleCollapsed={this.toggleCollapsed}
            routes={routes}
            menuData={menuDataWithId}
          />
          <Layout className="m-layout">
            <PageHeader
              collapsed={this.state.collapsed}
              theme={theme}
              menuData={menuData}
              toggleCollapsed={this.toggleCollapsed}
              userBusinessRole={userBusinessRole}
              handleThemeChange={this.handleThemeChange}
              location={location}
              logo={logo}
            />
            <Content className="m-layout-content360" style={this.state.collapsed ? { padding: '6.5rem 1rem 2rem 6.5rem', position: 'absolute', width: '100%' } : { padding: '6.5rem 1rem 2rem 18rem', position: 'absolute', width: '100%' }}>
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
                <Redirect exact from={`${prefix}/strategyPlanDetail/`} to={routes[0] ? routes[0].path : `${prefix}/404/`} />
                <Route render={NotFound} />
              </Switch>
            </Content>
            <Content id="modalContent" />
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default connect(({ global, salaryVersionDetail }) => ({
  authorities: global.authorities,
  authoritiesFlag: global.authoritiesFlag, // 获取用户功能权限点接口是否调用过
  dictionary: global.dictionary,
  userBusinessRole: global.userBusinessRole,
  theme: global.theme,
  hasAuthed: global.hasAuthed, // 判断用户token是否有效
  salaryVersionDetail,
}))(SalaryVersionDetailLayout);
