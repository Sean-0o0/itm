import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Route, Redirect, Switch } from 'umi';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Layout, ConfigProvider, message, Icon } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import lodash, { debounce } from 'lodash';
import PageSider from './PageSider';
import PageHeader from './PageHeader';
import { FetcUserMenuProject } from '../../../services/commonbase/index';
import TrackRouter from '../../../components/Common/Router/TrackRouter';
import RecentlyVisiteUtils from '../../../utils/recentlyVisiteUtils';
import { FetchMenu } from '../../../services/amslb/user';
import Watermark from './Watermark';
import SpecialUrl from './specialUrl';
import styles from './index.less';
import ViewFile from '../../../components/pmsPage/ViewFile';
import WpsUrl from './WpsUrl';
import HomePage from '../../../pages/pmsPage/HomePage';
import { translate } from '@antv/g6/lib/util/math';
// import { fetchUserTodoWorkflowNum } from '../../../services/commonbase/workFlowNavigation';

const { Header, Sider, Content } = Layout;
const prefix = '';

class MainPageLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.menuTreeLoaded = false; // 菜单是否加载
    // this.fetchMenuDatas = debounce(this.fetchMenuDatas, 200);
    // 获取菜单默认展开状态，0：不展开，1：展开
    const menuExpansion = localStorage.getItem('menuExpansion');
    // 超时时间判断
    this.staticTimeCount = 0; // 超时时间
    this.staticStartTime = new Date(); // 静止起始时间
    this.staticTimer = null; // 监听静止计时器
    this.state = {
      // collapsed: menuExpansion !== '1',
      collapsed: false,
      selectedMenuKeys: [], // 菜单选中key
      menuTree: [], // 获取登录用户的所有菜单项
      menuTreeLoaded: false, // 菜单是否加载
      userTodoWorkflowNum: 0, // 流程中心数
      name: '',
    };
  }

  checkTime = () => {
    const staticEndTime = new Date(); // 得到当前时间放入变量
    this.staticTimeCount = localStorage.getItem('sessionTimeout'); // 超时时间
    if (staticEndTime - this.staticStartTime > parseInt(this.staticTimeCount)) {
      clearInterval(this.staticTimer);
      // 如果当前时间减去初始时间大于超时时间，就执行自动跳转
      this.props.dispatch &&
        this.props.dispatch({
          type: 'global/logout',
        });
    }
  };

  reTime = () => {
    this.staticStartTime = new Date(); // 重置静止起始时间
  };

  componentDidMount() {
    const {
      location: { pathname, search },
    } = this.props;
    this.fetcUserMenuProject(pathname, search);
    // 监听鼠标/键盘静止时间，超时后则退回到登录页面
    document.onmousemove = this.reTime;
    document.onkeypress = this.reTime;
    this.staticTimer = setInterval(this.checkTime, 1000);
    // this.fetchMenuDatas('C5Base');
    // this.fetchUserTodoWorkflowNum();
  }

  componentWillUnmount() {
    clearInterval(this.staticTimer);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { menuTree = [], menuTreeLoaded } = this.state;
    const {
      hasAuthed,
      location: { pathname, search },
    } = nextProps;
    const {
      location: { pathname: prePathname, search: preSearch },
    } = this.props;
    //判断菜单是否已经加载过了?
    let flag = !menuTreeLoaded && hasAuthed;
    // let flag = hasAuthed;
    // console.log("menuTreeLoaded", menuTreeLoaded)
    // console.log("hasAuthed", hasAuthed)
    // console.log("菜单菜单菜单", flag)
    if (prePathname === '/' || pathname === '/') {
      flag = true;
    }
    if (flag) {
      // 获取默认菜单方案
      this.fetcUserMenuProject(pathname, search);
    }
  }

  fetcUserMenuProject = (pathname, search) => {
    FetcUserMenuProject({})
      .then(response => {
        const { records = [] } = response || [];
        // const new_records = [];
        // records.forEach((item) => {
        //   const { name = '' } = item;
        //   if (name === 'YYPT') {
        //     new_records.push(item);
        //   }
        // });
        // const { name } = records[0]?.name;
        // 如果用户没有配菜单方案就跳转403
        // if (!(new_records[0] || {})) {
        //   window.location.href = '/#/403';
        //   return;
        // }
        // if (name !== this.state.name) {
        // 获取权限菜单树
        //this.fetchMenuDatas(records[0]?.name, false, pathname.concat(search));
        // // 获取权限菜单树--菜单空白问题处理-暂时写死菜单方案
        this.fetchMenuDatas('PMSNOYS', false, pathname.concat(search));
        // }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  fetchUserTodoWorkflowNum = () => {
    // 流程中心
    fetchUserTodoWorkflowNum()
      .then(response => {
        const { records = [] } = response;
        const numbers = records[0] ? (records[0].dblcs ? records[0].dblcs : 0) : 0; // eslint-disable-line
        this.setState({ userTodoWorkflowNum: numbers });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  toggleCollapsed = () => {
    localStorage.setItem('menuExpansion', this.state.collapsed ? '1' : '0');
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  getUrl = item => {
    // 找到目录的第一个菜单
    let url = lodash.get(item, 'url', '');
    if (item.children && item.children.length > 0) {
      return this.getFirstChildren(item);
    }
    if (url === '/') url = '/index';
    if (!url && lodash.get(item, 'menu.item', []).length > 0) {
      return this.getUrl(lodash.get(item, 'menu.item', [])[0]);
    } else if (url) {
      return url;
    }
    return '';
  };

  // 获取权限菜单树
  fetchMenuDatas = async (name = '', isChangeTheme = false, purl = '') => {
    console.log('获取权限菜单树', name);
    if (name === '') {
      this.setState({
        menuTreeLoaded: true,
      });
      return false;
    }
    await FetchMenu({ project: name }).then(response => {
      const { data = {} } = response;
      const menuData =
        data.menuTree && data.menuTree.menu && data.menuTree.menu.item
          ? data.menuTree.menu.item
          : [];
      const menuTreeTemp = this.handleMenuData(menuData);
      // 刷新session缓存
      sessionStorage.setItem('menuTree', JSON.stringify(menuTreeTemp));
      const { menuTree } = this.formatMenu(menuTreeTemp);
      // 如果用户有菜单方案无菜单，跳转无菜单异常页面
      if (menuTree.length === 0) {
        window.location.href = '/#/403';
        // this.setState({
        //   menuTree,
        // });
        return;
      }
      if (isChangeTheme) {
        let url = this.getUrl(menuTree[0] || {}); //
        if (url) {
          this.props.dispatch(routerRedux.push(url));
        } else {
          window.location.href = '/#/403';
        }
      } else if (purl) {
        if (purl === '/loading' || purl === '/') {
          if (menuTree[0]) {
            let tempUrl = this.getUrl(menuTree[0]);
            if (!tempUrl) {
              window.location.href = '/#/blank';
            } else if (menuTree.length === 0) {
              this.props.dispatch(routerRedux.push('/403'));
            }
            this.props.dispatch(routerRedux.push(tempUrl));
          } else {
            window.location.href = '/#/403';
          }
        }
      }
      // console.log('menuTree222', menuTree);
      // sessionStorage.setItem('menuTree1', JSON.stringify(menuTree));
      this.setState({
        menuTree,
        menuTreeLoaded: true,
        name,
      });
    });
  };
  // 处理menu数据
  handleMenuData = treeData => {
    const menuTree = treeData || this.tmplMenuTree;
    menuTree.forEach((item, index) => {
      menuTree[index] = {
        ...item,
        url: this.handleMenuUrl(item.url),
      };
      if (
        item.menu &&
        item.menu.item &&
        Array.isArray(item.menu.item) &&
        item.menu.item.length > 0
      ) {
        menuTree[index].menu.item = this.handleMenuData(item.menu.item);
      }
    });
    return menuTree;
  };

  // 处理menu的URL
  handleMenuUrl = url => {
    const repStr = '/livebos/UIProcessor';
    const repStr2 = '/livebos/WorkProcessor';
    let tmplUrl = url;
    if (url.indexOf(repStr) < 0) {
      tmplUrl = tmplUrl.replace('/livebos/', '/');
    }
    // else if (url.indexOf(repStr2) < 0) {
    //   tmplUrl = tmplUrl.replace('/livebos/', '/');
    // }
    if (
      url.indexOf('/UIProcessor') !== -1 ||
      url.indexOf('/OperateProcessor') !== -1 ||
      url.indexOf('/WorkProcessor') !== -1
    ) {
      if (
        url.indexOf('lbFunAuthorize') === -1 &&
        url.indexOf('lbFunAuthScope') === -1 &&
        url.indexOf('lbFunAuthorizeTemp') === -1 &&
        url.indexOf('lbAuthorizationState') === -1
      ) {
        tmplUrl = `${tmplUrl}&hideTitlebar=true`;
      }
    }
    return tmplUrl;
  };

  //生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };

  parseUrl = data => {
    if (!data) {
      return { code: this.guid() };
    }
    let code = '';
    let openType = '_self';
    try {
      const obj = JSON.parse(data);
      const { type, url } = obj;
      if (type === 'ifm') {
        code = `/iframe/${url}`;
        openType = '_self';
      } else if (type === 'page') {
        code = url;
        openType = '_blank';
      }
    } catch (err) {
      code = data;
    }
    return { code, openType };
  };

  formatSideMenu = (data, fid, root) => {
    const children = [];
    data.forEach(element => {
      const { url = '', title = [], menu = {}, iconUrl = '', windowType = 0 } = element;
      const { text = '' } = title[0] || {};
      const { item = [] } = menu;
      const { code, openType = '_self' } = this.parseUrl(url);
      children.push({
        url: code,
        title: text,
        openType: windowType ? '_blank' : '_self',
        fid,
        root, // 根节点
        icon: iconUrl,
        children: item && item.length > 0 ? this.formatSideMenu(item, code, root) : [],
      });
    });
    return children;
  };

  formatMenu = menuData => {
    let menuTree1 = [];
    // menuTree1.push({
    //   url: '/index',
    //   title: '首页',
    //   openType: 'self',
    //   fid: '',
    //   root: '/index',
    //   icon: '',
    //   children: [],
    // });
    menuData.forEach(element => {
      const { url = '', title = [], menu = {}, iconUrl = '', windowType = 0 } = element;
      const { text = '' } = title[0] || {};
      const { item = [] } = menu;
      let icon = '';
      const { code, openType = 'self' } = this.parseUrl(url);
      //使用浙商管理平台的图标
      if (text === '首页' || text === '个人工作台') {
        icon = 'icon-home';
      }
      if (text === '项目管理') {
        icon = 'icon-detail';
      }
      if (text === '项目预算') {
        icon = 'icon-finance';
      }
      if (text === '系统管理') {
        icon = 'icon-set';
      }
      if (text === '统计分析') {
        icon = 'icon-barchart';
      }
      if (text === '生命周期管理') {
        icon = 'icon-work';
      }
      if (text === '外包项目') {
        icon = 'icon-system';
      }
      if (text === '流程管理') {
        icon = 'icon-procedure';
      }
      if (text === '人员管理') {
        icon = 'icon-user';
      }
      if (text === '报告管理') {
        icon = 'icon-read';
      }
      if (text === '供应商管理') {
        icon = 'icon-shop';
      }
      menuTree1.push({
        url: code,
        title: text,
        openType: windowType ? '_blank' : '_self',
        fid: '',
        root: url,
        icon: icon,
        children: item && item.length > 0 ? this.formatSideMenu(item, code, code) : [],
      });
    });
    return { menuTree: menuTree1 };
  };

  // 主题样式改变
  handleThemeChange = theme => {
    this.props.dispatch({
      type: 'global/changeTheme',
      payload: { theme },
    });
  };

  getFirstChildren = menu => {
    if (menu.children && menu.children.length > 0) {
      return this.getFirstChildren(menu.children[0]);
    }
    return menu.url;
  };

  pageTrack = async (loc, preLoc) => {
    // eslint-disable-line
    // ApexCountAction.recordPage(loc.pathname, preLoc ? preLoc.pathname : '', `{from:${linkToName(loc.pathname)},to:${linkToName(preLoc ? preLoc.pathname : '')}}`);
    // 获取签署状态标识
    const { pathname: preLocPath = '' } = preLoc || {};
    const { pathname: plocPath = '', search = '' } = loc || {};
    if (preLocPath.indexOf('confidentiality') > 0 || plocPath.indexOf('login') > 0) {
      return false;
    }
    RecentlyVisiteUtils.saveRecentlyVisiteUtils(plocPath, search);
  };
  render() {
    // const menuTree1 = JSON.parse(sessionStorage.getItem('menuTree1')) || [];
    const {
      history,
      theme,
      authorities = {},
      dispatch,
      route = {},
      userBusinessRole,
      location,
      userBasicInfo = {},
      dictionary,
      authUserInfo,
    } = this.props;
    const routes = lodash.get(route, 'routes', []);
    const { hasAuthed } = this.props;
    const {
      menuTree = [],
      collapsed,
      menuTreeLoaded,
      userTodoWorkflowNum,
      name: projectName,
    } = this.state;
    if (!hasAuthed) {
      return null;
    }
    let toDefaultLink = {}; // eslint-disable-line
    if (menuTree.length > 0) {
      const itemPath = this.getFirstChildren(menuTree[0]);
      toDefaultLink = { pathname: itemPath };
    }
    // 是否开启水印
    const isOpenSecureMarker = localStorage.getItem('openSecureMarker') === '1';
    // 判断是否为特殊链接
    const specialUrl = SpecialUrl.filter(item => location.pathname.startsWith(item));
    {
      /*WPS预览页面单独处理*/
    }
    const wpsUrl = WpsUrl.filter(item => location.pathname.startsWith(item));
    return wpsUrl && wpsUrl.length > 0 ? (
      <React.Fragment>
        {/*WPS预览页面单独处理*/}
        <ViewFile />
      </React.Fragment>
    ) : specialUrl && specialUrl.length > 0 ? (
      <React.Fragment>
        <Switch>
          {// 路由
          routes.map(({ key, path, component }) => {
            return (
              <Route
                key={key || path}
                path={path}
                unmount={false}
                saveScrollPosition
                component={component}
              />
            );
          })}
        </Switch>
      </React.Fragment>
    ) : (
      <ConfigProvider locale={zhCN}>
        <Layout
          className={theme}
          style={{
            minHeight: '100%',
            height: '100%',
            minWidth: window.screen.availWidth > 1440 ? '1440px' : window.screen.availWidth,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Header className="zy-header-wrap">
            <PageHeader
              menuTree={menuTree}
              fetchMenuDatas={this.fetchMenuDatas}
              history={history}
              dispatch={dispatch}
              dictionary={dictionary}
              userBasicInfo={userBasicInfo}
              userBusinessRole={userBusinessRole}
              authUserInfo={authUserInfo}
              authorities={authorities}
              location={location}
              userTodoWorkflowNum={userTodoWorkflowNum}
              projectName={projectName}
              theme={theme}
            />
          </Header>
          <Layout
            style={{
              background: '#000',
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
              // maxWidth: '1440px',
              // margin:' 0 auto',
            }}
          >
            <Sider
              className="siderContent cf-menu-wp"
              style={{
                boxShadow:
                  '0px 0px 8px 0px rgba(0,0,0,0.08), 0px 0px 1px 0px rgba(20,38,98,0.16), 2px 0px 4px 0px rgba(20,38,98,0.08)',
              }}
              trigger={null}
              collapsible
              width={240}
              collapsedWidth={100}
              collapsed={collapsed}
            >
              <PageSider
                menuTree={menuTree}
                collapsed={collapsed}
                location={location}
                history={history}
              ></PageSider>
              {
                <div
                  style={{ transform: !collapsed && 'rotate(180deg)' }}
                  className={`${styles.collapsedBar} cf-menu-bottom`}
                  onClick={this.toggleCollapsed}
                >
                  {collapsed ? (
                    <Icon type="menu-unfold" className="menu-sider-icon" />
                  ) : (
                    <Icon type="menu-fold" className="menu-sider-icon" />
                  )}
                </div>
              }
            </Sider>
            <Content
              id="htmlContent"
              style={{
                borderRadius: '0 0 0 1rem',
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                width: '100%',
              }}
              className="m-layout-content"
            >
              {/* <TopMenu></TopMenu> */}
              <TrackRouter
                history={history}
                onEnter={(loc, preLoc) => {
                  this.pageTrack(loc, preLoc);
                }}
              >
                {/* 水印 */}
                {/* 系统监控/system/monitor页面不需要水印 */
                isOpenSecureMarker &&
                  userBasicInfo.userid &&
                  lodash.get(location, 'pathname', '').indexOf('/system/monitor/view') === -1 && (
                    <Watermark
                      userBasicInfo={userBasicInfo}
                      location={location}
                      elementID="htmlContent"
                    />
                  )}
                <CacheSwitch>
                  {// 路由
                  routes.map(({ key, path, component, keepAlive = true }, index) => {
                    if (
                      (path && path.includes('/pms/manage/ProjectInfo')) ||
                      (path && path.includes('/pms/manage/ProjectDetail')) 
                      // ||(path && path.includes('/pms/manage/DemandInfo'))
                    ) {
                      return (
                        path && (
                          <Route
                            key={index}
                            when={() => {
                              return keepAlive;
                            }}
                            cacheKey={key || path}
                            path={path}
                            unmount={false}
                            component={component}
                          />
                        )
                      );
                    } else if (path && !path.includes('/index')) {
                      return (
                        path && (
                          <CacheRoute
                            key={index}
                            when={() => {
                              return keepAlive;
                            }}
                            cacheKey={key || path}
                            path={path}
                            unmount={false}
                            // saveScrollPosition
                            component={component}
                          />
                        )
                      );
                    }
                    return (
                      <CacheRoute
                        key={index}
                        when={() => {
                          return keepAlive;
                        }}
                        cacheKey={key || path}
                        path={path}
                        unmount={false}
                        // saveScrollPosition
                        render={p => <HomePage {...p}></HomePage>}
                      />
                    );
                  })}
                  <Redirect exact from={`${prefix}/`} to={`${prefix}/loading`} />
                  {menuTree && menuTree.length > 0 && (
                    <Redirect exact from={`${prefix}/`} to={toDefaultLink} />
                  )}
                  {/* {menuTreeLoaded && menuTree.length === 0 && <Redirect exact from={`${prefix}/`} to={`${prefix}/404`} />} */}
                  {/* { menuTreeLoaded && menuTree.length === 0 && <Route render={NotPermit} />}
                  { !menuTreeLoaded && <Redirect exact from={`${prefix}/`} to={`${prefix}/loading`} /> }
                  { !menuTreeLoaded && <Route render={loading} /> } */}
                </CacheSwitch>
              </TrackRouter>
            </Content>
            <div
              style={{
                // textAlign: 'right',
                // height: 0,
                // transform: 'translateX(-3.5712rem) translateY(-2.5rem)',
                color: '#000',
                position: 'absolute',
                right: '20px',
                bottom: '4px',
              }}
            >
              V1.0.0
            </div>
            <Content id="modalContent" />
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default connect(({ global = {} }) => ({
  theme: global.theme || 'default-dark-theme',
  isHideMenu: global.isHideMenu,
  userBusinessRole: global.userBusinessRole,
  hasAuthed: global.hasAuthed, // 判断用户token是否有效
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
  authUserInfo: global.authUserInfo,
  authorities: global.authorities,
}))(MainPageLayout);
