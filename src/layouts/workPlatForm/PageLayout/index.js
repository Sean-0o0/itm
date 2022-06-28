import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, routerRedux } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import classnames from 'classnames';
import { Layout, message, ConfigProvider ,} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import lodash, { debounce } from 'lodash';
import MenuSider from './PageSider/MenuSider';
import PageHeader from './PageHeader';
// import IframeContent from './iframeContent';
// import ReactIframe from './reactIframe';
// import DoIframeContent from './doIframeContent';
import { FetcUserMenuProject } from '../../../services/commonbase/index';
import NotPermit from '../../../pages/Exception/403';
import loading from '../../../pages/Exception/loading';
import TrackRouter from '../../../components/Common/Router/TrackRouter';
import logo from '../../../assets/apex-logo-login.png';
import { suffix } from '../../../utils/config';
import RecentlyVisiteUtils from '../../../utils/recentlyVisiteUtils';
import { FetchMenu } from '../../../services/amslb/user';
import VisitedRoutes from './VisitedRoutes';
import Watermark from './Watermark';
import styles from './index.less';

const { Content } = Layout;
const prefix = '';

class MainPageLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.menuTreeLoaded = false; // 菜单是否加载
    this.fetchMenuDatas = debounce(this.fetchMenuDatas, 200);
    // 获取菜单默认展开状态，0：不展开，1：展开
    const menuExpansion = localStorage.getItem('menuExpansion');
    this.state = {
      collapsed: menuExpansion !== '1',
      selectedMenuKeys: [], // 菜单选中key
      menuTree: [], // 获取登录用户的所有菜单项
      menuTreeLoaded: false, // 菜单是否加载
      name: '', // 当前菜单方案名称
      describe: '', // 菜单方案描述
    };
  }
  componentDidMount() {
    // if (this.props.hasAuthed) {
    //   const { location: { pathname, search } } = this.props;
    //   // 获取默认菜单方案
    //   FetcUserMenuProject({}).then((response) => {
    //     const { records = [] } = response || [];
    //     const { name = 'C5Base' } = records[0] || {};
    //     // 获取权限菜单树
    //     this.fetchMenuDatas(name, false, pathname.concat(search));
    //   }).catch((error) => {
    //     message.error(!error.success ? error.message : error.note);
    //   });
    // } else {
    //   // authPromise 向服务器发送认证请求，示例以Promise形式返回，result表示认证是否成功
    //   this.props.dispatch({
    //     type: 'global/checkAuth',
    //   });
    // }
    // if (!this.props.hasAuthed) {
    //   // authPromise 向服务器发送认证请求，示例以Promise形式返回，result表示认证是否成功
    //   this.props.dispatch({
    //     type: 'global/checkAuth',
    //   });
    // }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { menuTree = [], menuTreeLoaded } = this.state;
    const { hasAuthed, location: { pathname, search } } = nextProps;
    const { location: { pathname: prePathname, search: preSearch } } = this.props;
    let flag = !menuTreeLoaded && hasAuthed && prePathname !== pathname && preSearch !== search;
    if (prePathname === '/' && pathname === '/') {
      flag = true;
    }
    if (flag) {
      // 获取默认菜单方案
      FetcUserMenuProject({}).then((response) => {
        const { records = [] } = response || [];
        const { name = 'C5Base' } = records[0] || {};
        if (name !== this.state.name) {
          // 获取权限菜单树
          this.fetchMenuDatas(name, false, pathname.concat(search), menuTree);
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else if (menuTreeLoaded) {
      this.changeSelected(pathname.concat(search), menuTree);
    }
  }
  getUrl = (item) => { // 找到目录的第一个菜单
    let url = lodash.get(item, 'url', '');
    if (url === '/' ) url = '/index';
    if (!url && lodash.get(item, 'menu.item', []).length > 0) {
      return this.getUrl(lodash.get(item, 'menu.item', [])[0]);
    } else if (url) {
      return url;
    }
    return '';
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  menuLangKey = (item = {}) => { // 获取菜单的key
    const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  }
  // 处理menu数据
  handleMenuData = (treeData) => {
    const menuTree = treeData || this.tmplMenuTree;
    menuTree.forEach((item, index) => {
      menuTree[index] = {
        ...item,
        url: this.handleMenuUrl(item.url),
      };
      if (item.menu && item.menu.item && Array.isArray(item.menu.item) && item.menu.item.length > 0) {
        menuTree[index].menu.item = this.handleMenuData(item.menu.item);
      }
    });
    return menuTree;
  }
  // 处理menu的URL
  handleMenuUrl = (url) => {
    const repStr = '/livebos/UIProcessor';
    let tmplUrl = url;
    if (url.indexOf(repStr) < 0) {
      tmplUrl = tmplUrl.replace('/livebos/', '/');
    }
    // else if (url.indexOf(repStr2) < 0) {
    //   tmplUrl = tmplUrl.replace('/livebos/', '/');
    // }
    if (url.indexOf('/UIProcessor') !== -1||url.indexOf('/OperateProcessor') !== -1 ||url.indexOf('/WorkProcessor') !== -1) {
      if(url.indexOf('lbFunAuthorize') === -1&&url.indexOf('lbFunAuthScope') === -1&&url.indexOf('lbFunAuthorizeTemp') === -1&&url.indexOf('lbAuthorizationState') === -1&&url.indexOf('lbFunAudit') === -1&&url.indexOf('lbFunScopeAudit') === -1){
        tmplUrl = `${tmplUrl}&hideTitlebar=true`
      }
    }
    return tmplUrl;
  }
  // 获取权限菜单树
  fetchMenuDatas = (name = '', isChangeTheme = false, purl = '') => {
    if (name === '') {
      this.setState({
        menuTreeLoaded: true,
      });
      const { noAuthorities = false } = this.props.authorities;
      if (noAuthorities === true) {
        window.location.href = '/#/exceptionPage/noAuthorities';
        return;
      }
      return false;
    }
    FetchMenu({ project: name }).then((response) => {
      const { data = {} } = response;
      const { describe } = data;
      let menuTree = data.menuTree && data.menuTree.menu && data.menuTree.menu.item ? data.menuTree.menu.item : [];
      this.tmplMenuTree = menuTree;
      menuTree = this.handleMenuData();
      // 如果用户无任何的权限，跳转无权限异常页面
      const { noAuthorities = false } = this.props.authorities;
      if (noAuthorities === true) {
        window.location.href = '/#/exceptionPage/noAuthorities';
        return;
      }
      if (isChangeTheme) {
        let url = this.getUrl(menuTree[0] || {});
        sessionStorage.setItem('projectIndex', url); // 将方案首页的url存起来
        let tempUrl = url;
        if (tempUrl.startsWith('{') && tempUrl.endsWith('}')) {
          tempUrl = JSON.parse(tempUrl);
          const urlType = tempUrl.type || 'ifm';
          if (urlType === 'ifm') { // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
            if (tempUrl.url.startsWith('http')) {
              url = `/iframe/${tempUrl.url}`;
            } else {
              url = `/iframe${tempUrl.url}`;
            }
          } else if (urlType === 'self') {
            window.location.href = tempUrl.url;
          } else if (urlType === 'page') {
            window.open(tempUrl.url);
          }
          // url = urlType === '' ? tempUrl.url || '' : `/iframe/${tempUrl.url}`;
        }
        if (url) {
          this.props.dispatch(routerRedux.push(url));
        }
        const selectedKeys = this.findSelectedMenuKeys(url, menuTree) || [];
        if (selectedKeys.length !== 0) {
          // menuTreeLoaded = true;
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            selectedMenuKeys: selectedKeys,
            name,
            describe,
          });
        } else {
          // this.menuTreeLoaded = true;
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            name,
            describe,
          });
        }
      } else if (purl) {
        if (purl === '/loading' || purl === '/') {
          let tempUrl = this.getUrl(menuTree[0]);
          if (menuTree.length === 0) {
            this.props.dispatch(routerRedux.push('/building'));
          }
          if (tempUrl.startsWith('{') && tempUrl.endsWith('}')) {
            tempUrl = JSON.parse(tempUrl);
            const urlType = tempUrl.type || 'ifm';
            if (urlType === 'ifm') { // type: ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
              if (tempUrl.url.startsWith('http')) {
                tempUrl = `/iframe/${tempUrl.url}`;
              } else {
                tempUrl = `/iframe${tempUrl.url}`;
              }
            } else if (urlType === 'self') {
              window.location.href = tempUrl.url;
            } else if (urlType === 'page') {
              window.open(tempUrl.url);
            }
          }
          if (tempUrl.startsWith('http')) {
            window.location.href = tempUrl;
          }
          this.props.dispatch(routerRedux.push(tempUrl));
        }
        const selectedKeys = this.findSelectedMenuKeys(purl, menuTree) || [];
        if (selectedKeys.length !== 0) {
          // this.menuTreeLoaded = true;
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            selectedMenuKeys: selectedKeys,
            name,
            describe,
          });
        } else {
          // this.menuTreeLoaded = true;
          this.setState({
            menuTree,
            menuTreeLoaded: true,
            name,
            describe,
          });
        }
      } else {
        // this.menuTreeLoaded = true;
        this.setState({
          menuTree,
          menuTreeLoaded: true,
          name,
          describe,
        });
      }
    });
  }
  // 主题样式改变
  handleThemeChange = (theme) => {
    this.props.dispatch({
      type: 'global/changeTheme',
      payload: { theme },
    });
  }
  changeSelected = (url, menus) => {
    const selectedKeys = this.findSelectedMenuKeys(url, menus) || [];
    if (selectedKeys.length !== 0) {
      this.setState({
        selectedMenuKeys: selectedKeys,
      });
    }
  }
  findSelectedMenuKeys = (url, menus) => {
    const selectedKeys = [];
    menus.every((item) => {
      const curentKey = this.menuLangKey(item);
      if (item.menu && item.menu.item) {
        let tempKeys = [];
        tempKeys.push(curentKey);
        // 递归检查子菜单
        tempKeys = tempKeys.concat(this.findSelectedMenuKeys(url, item.menu.item));
        // 如果子菜单符合条件,那么就放到selectedKeys
        if (tempKeys.length > 1) {
          selectedKeys.push(...tempKeys);
          return false;
        }
      } else if (url !== '' && url !== '/' && url.indexOf(`${item.url}`) === 0) {
        if (url !== item.url) {
          if (url.indexOf(`${item.url}/`) === 0) {
            selectedKeys.push(curentKey);
            return false;
          }
        } else {
          selectedKeys.push(curentKey);
          return false;
        }
      } else if (url.startsWith('{') && url.endsWith('}')) {
        let iframeUrl = JSON.parse(url);
        iframeUrl = iframeUrl.url || '';
        if (iframeUrl.startsWith('http')) {
          iframeUrl = `/iframe/${iframeUrl}`;
        } else {
          iframeUrl = `/iframe${iframeUrl}`;
        }
        if (url === iframeUrl) {
          selectedKeys.push(curentKey);
          return false;
        }
      } else if (url.startsWith('/iframe') && item.url.startsWith('{') && item.url.endsWith('}')) {
        const tempObj = JSON.parse(item.url);
        if (tempObj.type === 'ifm' && (tempObj.url === url.replace('/iframe', '') || tempObj.url === url.replace('/iframe/', ''))) {
          selectedKeys.push(curentKey);
          return false;
        }
      } else {
        // 如果没有匹配的,就清空数组
        selectedKeys.length = 0;
      }
      return true;
    });
    return selectedKeys;
  }
  /**
   * 路由后缀处理
   */
  concatSuffix = (menuData) => {
    const suffixWithDot = `${suffix ? `.${suffix}` : ''}`;
    return menuData.map((item) => {
      const finalItem = { ...item };
      if (item.url && !item.url.endsWith(suffixWithDot)) {
        finalItem.url = `${item.url}${suffixWithDot}`;
      }
      if (item.menu && item.menu.length > 0) {
        finalItem.menu = this.concatSuffix(item.menu);
      }
      return finalItem;
    });
  }
  iterateRoutes = (menuTree, menuObj) => {
    const resultRoutes = [];
    const { path = '' } = menuObj;
    let tempPath = path;
    if (tempPath.indexOf('/:') !== -1) tempPath = lodash.get(tempPath.split('/:'), '[0]', tempPath);
    menuTree.every((item) => {
      const { url = '' } = item;
      const children = lodash.get(item, 'menu.item', []);
      if (children.length !== 0) {
        const childRoutes = this.iterateRoutes(children, menuObj);
        if (childRoutes.length > 0) {
          resultRoutes.push(...childRoutes);
          return false;
        }
      } else if (url === tempPath) {
        const describe = lodash.get(item, 'describe[0].text');
        let isCache = '1'; // 0:缓存|1:不缓存
        if (describe.indexOf('|') !== -1) {
          isCache = lodash.get(describe.split('|'), '[1]', '1');
        }
        resultRoutes.push({
          ...menuObj,
          isCache,
        });
        return false;
      } else {
        resultRoutes.length = 0;
      }
      return true;
    });
    return resultRoutes;
  }
  packageRoutes = (menuTree = [], routes = []) => {
    const results = [];
    routes.forEach((item) => {
      const ret = this.iterateRoutes(menuTree, item);
      if (ret.length > 0) {
        results.push(...ret);
      } else { // routes和menus接口数据进行比对，没有匹配到的默认为不缓存
        results.push({
          ...item,
          isCache: '1',
        });
      }
    });
    return results;
  }
  pageTrack = async (loc, preLoc) => { // eslint-disable-line
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
    const { history, theme, authorities = {}, dispatch, isHideMenu = false, route = {}, userBusinessRole, location, userBasicInfo, dictionary, authUserInfo } = this.props;
    const routes = lodash.get(route, 'routes', []);
    let contentStyle = '';
    const curl = location.pathname + location.search;
    if (curl.includes('UIProcessor') || curl.includes('/iframe/')) { //  如果为livebos页面，则修改content正文部分的样式
      contentStyle = 'iframeContent';
    } else if (isHideMenu) {
      contentStyle = 'noPadding'; //  如果为放大页面，则修改content正文部分的样式
    }
    const { hasAuthed } = this.props;
    const { menuTree = [], name = '', menuTreeLoaded, describe } = this.state;
    if (!hasAuthed) {
      return null;
    }
    let toDefaultLink = {}; // eslint-disable-line
    if (menuTree.length > 0) {
      // 设置默认显示url
      const firstItem = menuTree[0] || {};
      let itemPath = '';
      // let fiframeUrl = '';
      if (firstItem.menu) {
        const secUrlTemp = lodash.get(firstItem, 'menu.item[0].url', '');
        if (secUrlTemp !== '') { // 不存在三级菜单
          itemPath = secUrlTemp;
        } else { // 存在三级菜单
          itemPath = lodash.get(firstItem, 'menu.item[0].menu.item[0].url', '');
        }
      } else {
        itemPath = firstItem.url || '';
      }
      if (itemPath.startsWith('{') && itemPath.endsWith('}')) {
        itemPath = JSON.parse(itemPath);
        const urlType = itemPath.type || 'ifm'; // ifm: iframe嵌套定制路径 | self: 当前页面打开定制路径 | blank: 新开标签打开页面
        if (urlType === 'ifm') {
          itemPath = itemPath.url.startsWith('http') ? `/iframe/${itemPath.url}` : `/iframe${itemPath.url}`;
        } else if (urlType === 'self') {
          if (curl === itemPath.url) {
            window.location.href = itemPath.url;
          }
        } else if (urlType === 'page') {
          if (curl === itemPath.url) {
            window.open(itemPath.url);
          }
        }
      }
      toDefaultLink = { pathname: itemPath }; // eslint-disable-line
    }
    // 处理菜单路径的后缀
    const finalMenuData = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    const currentMenuData = finalMenuData.filter((item) => {
      const tempKey = this.menuLangKey(item);
      return tempKey === this.state.selectedMenuKeys[0];
    });
    const subMenuTree = lodash.get(currentMenuData[0], 'menu.item', []);
    sessionStorage.setItem('menuTree', JSON.stringify(menuTree)); // menus接口返回的菜单信息
    const cacheRoutes = this.packageRoutes(menuTree, routes); // 组装routes,获取路由是否需要缓存
    sessionStorage.setItem('cacheRoutes', JSON.stringify(cacheRoutes)); // routeConfig配置信息(包含isCache)
    // 是否开启水印
    const isOpenSecureMarker = localStorage.getItem('openSecureMarker') === '1';
    return (
      hasAuthed ? (
        <ConfigProvider locale={zhCN}>
          <Layout className={theme} style={{ minHeight: '100%', height: '100%' }}>
            <Layout.Header className="m-header-xin" style={{ padding: 0 }}>
              <div className="logo" />
              <PageHeader
                // style={{ display: isHideMenu ? 'none' : '' }}
                theme={theme}
                fetchMenuDatas={this.fetchMenuDatas}
                name={name}
                menuTree={menuTree}
                menuSchemeName={describe}
                menuLangKey={this.menuLangKey}
                handleThemeChange={this.handleThemeChange}
                location={location}
                logo={logo}
                dispatch={dispatch}
                userBasicInfo={userBasicInfo}
                dictionary={dictionary}
                userBusinessRole={userBusinessRole}
                authUserInfo={authUserInfo}
                authorities={authorities}
              />
            </Layout.Header>
            <Layout className="m-layout m-layout-xin" id="scrollContent" style={{ height: '100%' }}>
              <Layout.Sider
                id="siderContent"
                trigger={null}
                collapsible
                collapsed={subMenuTree.length === 0 ? true : this.state.collapsed}
                collapsedWidth={subMenuTree.length === 0 ? 0 : 50}
                width={180}
              >
                <MenuSider
                  location={location}
                  routes={routes}
                  selectedMenuKeys={this.state.selectedMenuKeys}
                  menuLangKey={this.menuLangKey}
                  subMenuTree={subMenuTree}
                  style={{ display: isHideMenu ? 'none' : '' }}
                  collapsed={this.state.collapsed}
                  toggleCollapsed={this.toggleCollapsed}
                />
              </Layout.Sider>
              <Layout style={{ height: '100%' }} id="htmlContent">
                <Content style={{ overflow: `${curl === '/allProducts' ? 'auto' : ''}` }} className={contentStyle === '' ? 'm-layout-content' : classnames(styles[contentStyle], 'm-layout-content')} >
                  {/* 访问过的url */}
                  <VisitedRoutes menuTree={menuTree} menuCollapsed={this.state.collapsed} menuTreeLoaded={menuTreeLoaded} menuSchemeName={describe} />
                  <TrackRouter history={history} onEnter={(loc, preLoc) => { this.pageTrack(loc, preLoc); }}>
                  {/* 水印 */}
                  {
                    isOpenSecureMarker && <Watermark userBasicInfo={userBasicInfo} />
                  }
                  <CacheSwitch>
                    {
                      // 路由
                      routes.map(({ key, path, component, isCache = '1' }) => {
                        // if (isCache === '1' && !/(?<=\/(UIProcessor|OperateProcessor|ShowWorkflow)).\S*/.test(path)) {
                        if (path) {
                          if (isCache === '1' && (!path.startsWith('/UIProcessor') || !path.startsWith('/OperateProcessor') || !path.startsWith('/ShowWorkflow'))) {
                            return (
                              <Route
                                key={key || path}
                                path={path}
                                component={component}
                              />
                            );
                          }
                        }
                        return (
                          <CacheRoute
                            key={path}
                            path={path}
                            saveScrollPosition
                            component={component}
                          />
                        );
                      }
                    )}
                    { menuTree && menuTree.length > 0 && <Redirect exact from={`${prefix}/`} to={toDefaultLink} />}
                    { menuTreeLoaded && menuTree.length === 0 && <Redirect exact from={`${prefix}/`} to={`${prefix}/404`} /> }
                    { menuTreeLoaded && menuTree.length === 0 && <Route render={NotPermit} />}
                    { !menuTreeLoaded && <Redirect exact from={`${prefix}/`} to={`${prefix}/loading`} /> }
                    { !menuTreeLoaded && <Route render={loading} /> }
                  </CacheSwitch>
                  </TrackRouter>
                </Content>
                <Content id="modalContent" />
              </Layout>
            </Layout>
          </Layout>
        </ConfigProvider>
        ) : null
    );
  }
}

export default connect(({ global = {}, mainPage }) => ({
  theme: global.theme || 'default-dark-theme',
  isHideMenu: global.isHideMenu,
  userBusinessRole: global.userBusinessRole,
  hasAuthed: global.hasAuthed, // 判断用户token是否有效
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
  authUserInfo: global.authUserInfo,
  authorities: global.authorities,
}))(MainPageLayout);
