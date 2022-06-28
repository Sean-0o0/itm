import React from 'react';
import { Link } from 'dva/router';
import { Layout, Menu } from 'antd';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import { suffix } from '../../../../../utils/config';
import styles from './index.less';

export default class TestPageSider extends React.PureComponent {
  state = {
    openKeys: [],
    mouseOverStyle: '',
  };
  // 菜单展开/收缩点击事件
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (openKeys.length > 0) {
      this.setState({ openKeys: [openKeys[openKeys.length - 1]] });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  /**
  * 获得菜单子节点
  */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    // 过滤隐藏的菜单,并检查菜单权限
    return menusData.filter(item => this.menuLangKey(item)).map((item) => {
      const ItemDom = this.getSubMenuOrItem(item);
      return this.checkPermissionItem(item.authority, ItemDom);
    }).filter(item => !!item);
  }
  /**
   * 获取当前菜单节点及其子节点
   */
  getSubMenuOrItem = (item) => {
    if (lodash.get(item, 'menu.item', []).some(child => this.menuLangKey(child))) {
      const name = this.menuLangKey(item);
      const key = this.menuLangKey(item);
      return (
        <Menu.SubMenu
          className={styles.subMenuPosition}
          popupOffset={[1, 0]}
          key={key}
          title={
            item.iconUrl ? (
              <span>
                <i className={`iconfont ${item.iconUrl}`} />
                <span className="hide-menu">{ name }</span>
              </span>
            ) : <span>{name}</span>
          }
        >
          {this.getNavMenuItems(lodash.get(item, 'menu.item', []))}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item
        key={item.url}
      >
        {this.getMenuItemPath(item)}
      </Menu.Item>
    );
  }
  /**
  * 判断是否是http链接.返回 Link 或 a
  */
  getMenuItemPath = (item) => {
    const iconUrl = lodash.get(item, 'iconUrl', 'm-circular');
    const { windowType: target } = item; // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
    // const itemPath = target === 2 ? '/iframe' : this.conversionPath(item.url);
    const itemPath = this.conversionPath(item.url);
    const toLinkObj = {
      pathname: itemPath,
    };
    if (target === 2) toLinkObj.query = { url: item.url };
    // 如果是 http(s) 链接,那么就返回一个a标签
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target === 1 ? '_blank' : ''}>
          {iconUrl ? <i className={`iconfont ${iconUrl}`} /> : <i className="m-circular" />}
          <span className={iconUrl ? 'hide-menu' : ''}>{lodash.get(item, 'title[0].text', '')}</span>
        </a>
      );
    }
    return (
      <Link
        to={toLinkObj}
        target={target === 1 ? '_blank' : ''}
        replace={itemPath === this.props.location.pathname}
      >
        {iconUrl ? <i className={`iconfont ${iconUrl}`} /> : <i className="m-circular" />}
        <span className={iconUrl ? 'hide-menu' : ''}>{lodash.get(item, 'title[0].text', '')}</span>
      </Link>
    );
  }
  /**
   * 获取选中的菜单节点
   */
  getSelectedMenuKeys = (pathname, menus) => {
    const selectedKeys = [];
    menus.every((item) => {
      // const curentPath = item.url || '';
      const curentKey = this.menuLangKey(item); // 父节点使用describe[0].text值作为key，子节点使用url值作为key
      if (item.menu && item.menu.item) {
        let tempKeys = [];
        tempKeys.push(curentKey);
        // 递归检查子菜单
        tempKeys = tempKeys.concat(this.getSelectedMenuKeys(pathname, item.menu.item));
        // 如果子菜单符合条件,那么就放到selectedKeys
        if (tempKeys.length > 1) {
          selectedKeys.push(...tempKeys);
          return false;
        }
      } else if (pathname !== '' && pathname !== '/' && (pathname.indexOf(item.url) === 0 || pathname.indexOf(`/${lodash.get(item, 'describe[0].text', '')}`) === 0)) {
        selectedKeys.push(curentKey);
        return false;
      } else {
        // 如果没有匹配的,就清空数组
        selectedKeys.length = 0;
      }
      return true;
    });
    return selectedKeys;
  }
  /**
  * 检查菜单权限
  */
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(
        authority,
        ItemDom
      );
    }
    return ItemDom;
  }
  menuLangKey = (item = {}) => {
    const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  }
  /**
  * 转化路径
  */
  conversionPath=(path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
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
  menuClick = (menu) => {
    if (menu.keyPath.length === 1) {
      this.setState({
        openKeys: [],
      });
    }
  }
  mouseOverFunc = () => {
    this.setState({
      mouseOverStyle: 'hover',
    });
  }
  mouseOutFunc = () => {
    this.setState({
      mouseOverStyle: '',
    });
  }
  render() {
    const { menuTree = [], location: { pathname, search = '' } } = this.props;
    const { mouseOverStyle } = this.state;
    // const { openKeys } = this.state;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    // 获取当前选中的菜单key值
    const selectedKeys = this.getSelectedMenuKeys(pathname + search, finalMenuData);
    return (
      <div>
        <Layout.Sider
          className={`m-sider ${mouseOverStyle}`}
          id="m-sider"
          width="5rem"
          style={{ position: 'fixed' }}
          onMouseEnter={this.mouseOverFunc} // eslint-disable-line
          onMouseLeave={this.mouseOutFunc} // eslint-disable-line
        >
          <div className="m-sider-head">
            <h3>
              <span>
                <i className="iconfont icon-menu" />
              </span>
            </h3>
          </div>
          <Scrollbars
            autoHide
            renderTrackVertical={props => <div {...props} className={styles['scrollbars-track-vertical']} />}
            style={{ width: '100%' }}
          >
            {
              finalMenuData.length > 0 ? (
                <Menu
                  className="m-menu"
                  // mode="inline"
                  mode="vertical"
                  inlineIndent="18"
                  theme="dark"
                  style={{ width: '100%', marginBottom: '5rem' }}
                  // defaultOpenKeys={selectedKeys}
                  // openKeys={openKeys.length > 0 ? openKeys : selectedKeys}
                  selectedKeys={selectedKeys}
                  onOpenChange={this.onOpenChange}
                  onClick={this.menuClick}
                  getPopupContainer={() => document.getElementById('subMenuDiv')}
                  subMenuOpenDelay={0.2}
                >
                  {
                    this.getNavMenuItems(finalMenuData)
                  }
                </Menu>
              ) : ''
            }

          </Scrollbars>
        </Layout.Sider>
        <div className="m-menu" id="subMenuDiv" style={{ zIndex: 999, height: document.documentElement.clientHeight, position: 'fixed' }} />
      </div>
    );
  }
}
