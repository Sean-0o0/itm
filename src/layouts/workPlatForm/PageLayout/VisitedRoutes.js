import React from 'react';
import { Row, Col, Tabs, Affix, Dropdown, Menu, Icon } from 'antd';
import lodash from 'lodash';
import { withRouter, Link } from 'dva/router';
// import debounce from 'lodash/debounce';
import { suffix } from '../../../utils/config';
import RecentlyVisiteUtils from '../../../utils/recentlyVisiteUtils';

class VisitedRoutes extends React.Component {
  constructor(props) {
    super(props);
    // this.onChangeHistory = debounce(this.onChangeHistory, props.wait);
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    this.isFirstRender = true;
    this.state = {
      urls: recentlyVisitedUrls,
      siderMenuWidth: 0, // 菜单宽度
    };
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(this.onChangeHistory);
  }

  componentWillReceiveProps(nextProps) {
    const { menuCollapsed: preFlag = false, menuTreeLoaded: preMenuLoaded } = this.props;
    const { menuCollapsed: aftFlag = false, menuTreeLoaded: aftMenuLoaded } = nextProps;
    if (preFlag !== aftFlag || preMenuLoaded !== aftMenuLoaded) {
      this.getMenuSiderWidth(nextProps);
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  onChangeHistory = (e = {}) => {
    setTimeout(() => {
      const { pathname = '' } = e;
      let tmpl = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
      if (tmpl.indexOf(`${pathname}|`) < 0) {
        tmpl.push(`${pathname}|`);
      }
      tmpl = tmpl.filter((m) => { // 把菜单中没有返回的剔除出去
        const tempIndex = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { return tempItem.url === m.substring(0, m.indexOf('|')); });
        if (tempIndex > -1 || m === '/index|') {
          return true;
        }
        return false;
      });
      this.getMenuSiderWidth(this.props);
      sessionStorage.setItem('recentlyVisited', tmpl);
      this.setState({
        urls: tmpl,
      });
    }, 100);
  }

  getNameAndUrl = (value) => { // 遍历目录树 找到url 和name
    const { url = '', title = [], menu = {} } = value;
    if (url && title.length > 0) {
      let aUrl = '';
      if (url.indexOf('{') === 0) {
        const ob = JSON.parse(url);
        aUrl = ob.url;
        if (ob.type === 'ifm') {
          aUrl = `/iframe/${aUrl}`;
        }
      } else {
        aUrl = url;
      }
      RecentlyVisiteUtils.mapUrls.push({
        url: aUrl,
        name: title[0].text,
      });
    }
    if (Reflect.has(menu, 'item')) {
      menu.item.forEach((tempItem) => {
        this.getNameAndUrl(tempItem);
      });
    }
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

  // 删除路由
  handleDeleteUrl = (url = '') => {
    const { location: { pathname: currentPath = '' } } = this.props;
    // 删除对象缓存
    const urls = RecentlyVisiteUtils.mapUrls || [];
    const tmpl = urls.filter(item => item.url !== url);
    RecentlyVisiteUtils.mapUrls = tmpl;
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    // 如果关闭的不是当前页签，不用跳转
    if (currentPath.startsWith(url)) {
      // 跳转到临近的url（优先前一个）
      let tmplHrefs = recentlyVisitedUrls.filter(m => m !== '/loading|');
      tmplHrefs = tmplHrefs.map(m => m.replace('|', ''));
      const tmplIndex = tmplHrefs.findIndex(m => m === url);
      const tmplArr = [tmplHrefs[tmplIndex - 1], tmplHrefs[tmplIndex + 1]];
      const tmplHref = tmplArr[0] ? tmplArr[0] : tmplArr[1];
      window.location.href = `/#${tmplHref}`;
    }
    // 删除session缓存
    const tmplSesn = recentlyVisitedUrls.filter(item => item.indexOf(`${url}|`) < 0);
    sessionStorage.setItem('recentlyVisited', tmplSesn);
    // 删除组件缓存
    this.setState({
      urls: tmplSesn,
    });
  }

  // 获取菜单宽度
  getMenuSiderWidth = (props) => { // eslint-disable-line
    const { menuTree = [], menuCollapsed = false, location: { pathname = '' }, menuTreeLoaded, menuSchemeName = '' } = props;
    if (pathname) {
      if (menuSchemeName.indexOf('(WS)') > -1 && pathname === '/index') {
        this.setState({ siderMenuWidth: 0 });
        return;
      }
      if (menuTreeLoaded && this.isFirstRender) { // 菜单加载完毕且是第一次渲染
        if (menuCollapsed) {
          this.setState({ siderMenuWidth: 50 });
        } else {
          this.setState({ siderMenuWidth: 200 });
        }
        this.isFirstRender = null;
      } else {
        const tempIndex = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { return tempItem.url === pathname; });
        const urlName = tempIndex >= 0 ? RecentlyVisiteUtils.mapUrls[tempIndex].name : '';
        if (urlName) {
          // 如果在当前菜单方案下能找到当前url对应的菜单，说明该菜单没有二级菜单
          const [tmplMenu] = menuTree.filter(m => lodash.get(m, 'title[0].text', '') === urlName);
          if (!tmplMenu) { // eslint-disable-line
            if (menuCollapsed) {
              this.setState({ siderMenuWidth: 50 });
            } else {
              this.setState({ siderMenuWidth: 200 });
            }
          } else {
            this.setState({ siderMenuWidth: 0 });
          }
        }
      }
    }
  }

  // 点击tab跳转，这里用于首页图标整个区域可点
  tabLinkHref = (url) => {
    if (url === '/index') {
      window.location.href = `/#${url}`;
    }
  }

  // 右边下拉菜单
  getExtraDropdownMenu = () => {
    // 关闭Tabs
    const closeTabs = (type) => { // 0全部，1其他
      const { urls: cuUrls = [] } = this.state;
      const { location: { pathname = '' }, menuTree } = this.props;
      // 删除对象缓存
      const urls = RecentlyVisiteUtils.mapUrls || [];
      let tmpl = [];
      if (type === 1) {
        tmpl = urls.filter(item => item.url === pathname);
      } else if (type === 0) {
        tmpl = [];
      }
      RecentlyVisiteUtils.mapUrls = tmpl;
      // 删除session缓存
      const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
      // 删除session缓存
      let tmplSesn = [];
      if (type === 1) {
        tmplSesn = recentlyVisitedUrls.filter(item => item.indexOf(`${pathname}|`) === 0);
        if (cuUrls.includes('/index|')) { // 有首页权限
          tmplSesn = ['/index|', ...tmplSesn];
        }
      } else if (type === 0) {
        if (cuUrls.includes('/index|')) { // 有首页权限
          tmplSesn = ['/index|'];
        } else {
          const firstMenu = lodash.get(menuTree, '[0].menu.item[0].url', '');
          tmplSesn = [`${firstMenu}|`];
        }
      }
      sessionStorage.setItem('recentlyVisited', tmplSesn);
      // 删除组件缓存
      this.setState({
        urls: tmplSesn,
      });
      const projectIndex = sessionStorage.getItem('projectIndex');
      // 关闭全部，跳转
      if (type === 0 && tmplSesn.length > 0 && !projectIndex) {
        const tgt = tmplSesn[0] || '';
        window.location.href = `/#${tgt.substring(0, tgt.indexOf('|'))}`;
      } else if (type === 0 && projectIndex) {
        window.location.href = `/#${projectIndex}`;
      }
    };
    // 构建菜单
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => { closeTabs(0); }}>
            关闭全部
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { closeTabs(1); }}>
            关闭其他
          </a>
        </Menu.Item>
      </Menu>
    );
    return menu;
  }

  render() {
    const { urls = [], siderMenuWidth = 0 } = this.state;
    const { menuTree = [] } = this.props;
    // 容器宽度
    const containerWidth = window.innerWidth || 0;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    RecentlyVisiteUtils.mapUrls = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    finalMenuData.forEach((item) => {
      this.getNameAndUrl(item);
    });
    // 处理顺序,首页第一
    let tmplUrls = urls;
    if (urls.includes('/index|')) { // 没有首页权限的话不加
      tmplUrls = urls.filter(m => m !== '/index|');
      tmplUrls = ['/index|', ...tmplUrls];
    }
    // 选中的Tabkey，是url井号后面的内容
    let activeKey = '';
    const href = lodash.get(window, 'location.href', '');
    const tmplIndex = href.indexOf('#');
    if (tmplIndex > -1) {
      activeKey = href.substring(tmplIndex + 1);
    }
    // tab的宽度
    let tabWidth = containerWidth - siderMenuWidth;
    const container = document.getElementById('htmlContent') || {};
    // 如果有滚动条的话要减掉滚动条宽度
    if (container.scrollHeight > container.clientHeight) { // 滚动高度大于当前高度，有滚动条
      tabWidth -= 20;
    }
    return (
      tmplUrls.length > 0 && (
        <Affix target={() => document.getElementById('htmlContent')}>
          <Row className="m-row-top" style={{ backgroundColor: '#FFFFFF', margin: '0 0rem' }}>
            <Col span={24}>
              <Tabs
                className="m-tabs-nav"
                tabPosition="top"
                type="line"
                animated={false}
                activeKey={activeKey}
                // style={{ width: `${tabWidth}px` }}
                onTabClick={this.tabLinkHref}
                tabBarExtraContent={
                  <Dropdown overlay={this.getExtraDropdownMenu()}>
                    <a className="ant-dropdown-link" style={{ display: 'inline-block', width: '2rem' }}>
                      <Icon type="down" style={{ fontSize: '1.586rem', marginTop: '.86rem' }} />
                    </a>
                  </Dropdown>
                }
              >
                {
                  tmplUrls.map((item) => {
                    const url = item.substring(0, item.indexOf('|'));
                    let key = url;
                    if (url === '/' || url === '/loading') {
                      return null;
                    }
                    let name = item.substring(item.indexOf('|') + 1);
                    if (!name || name === '') {
                      const tempIndex = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { return tempItem.url === url; });
                      name = tempIndex >= 0 ? RecentlyVisiteUtils.mapUrls[tempIndex].name : '';
                      if (url === '/index') {
                        name = '首页';
                      }
                      if (activeKey.startsWith(url)) {
                        key = activeKey;
                      }
                    }
                    if (name === '') {
                      return null;
                    }
                    return (
                      <Tabs.TabPane
                        key={key}
                        tab={
                          <React.Fragment>
                            <Link to={url} style={{ display: 'inline-block', height: '3.286rem' }}>
                              {
                                url === '/index' ? (
                                  <i className="iconfont icon-shouye" style={{ display: 'inline-block', height: '3.286rem' }} />
                                ) : (<span>{name}</span>)
                              }
                            </Link>
                            {
                              tmplUrls.length > 1 && url !== '/index' && <i className="iconfont icon-close-small" style={{ display: 'inline-block', height: '3.286rem', fontSize: '1rem', marginLeft: '.2rem' }} onClick={() => { this.handleDeleteUrl(url); }} />
                            }
                          </React.Fragment>
                        }
                      />
                    );
                  })
                }
              </Tabs>
            </Col>
          </Row>
        </Affix>
      )
    );
  }
}

export default withRouter(VisitedRoutes);
