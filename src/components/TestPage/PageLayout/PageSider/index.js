import React from 'react';
import { Link } from 'dva/router';
import { Layout, Menu } from 'antd';

export default class TestPageSider extends React.PureComponent {
  /**
  * 获得菜单子节点
  */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    // 过滤隐藏的菜单,并检查菜单权限
    return menusData.filter(item => item.name && !item.hideInMenu).map((item) => {
      const ItemDom = this.getSubMenuOrItem(item);
      return this.checkPermissionItem(item.authority, ItemDom);
    }).filter(item => !!item);
  }
  /**
   * 获取当前菜单节点及其子节点
   */
  getSubMenuOrItem=(item) => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <Menu.SubMenu
          title={
            item.icon ? (
              <span>
                { /** 此处处理菜单的icon图片 */ }
                <span>{item.name}</span>
              </span>
            ) : item.name
            }
          key={item.key || item.path}
        >
          {this.getNavMenuItems(item.children)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={item.key || item.path}>
        {this.getMenuItemPath(item)}
      </Menu.Item>
    );
  }
  /**
  * 判断是否是http链接.返回 Link 或 a
  */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const { target, name } = item;
    // 如果是 http(s) 链接,那么就返回一个a标签
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
      >
        <span>{name}</span>
      </Link>
    );
  }
  /**
   * 获取选中的菜单节点
   */
  getSelectedMenuKeys = (pathname, menus) => {
    const selectedKeys = [];
    menus.every((item) => {
      const curentPath = item.path || '';
      const curentKey = item.key || curentPath;
      if (item.children) {
        let tempKeys = [];
        tempKeys.push(curentKey);
        // 递归检查子菜单
        tempKeys = tempKeys.concat(this.getSelectedMenuKeys(pathname, item.children));
        // 如果子菜单符合条件,那么就放到selectedKeys
        if (tempKeys.length > 1) {
          selectedKeys.push(...tempKeys);
          return false;
        }
      } else if (item.path === pathname) {
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
  /**
  * 转化路径
  */
  conversionPath=(path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  }
  render() {
    const { menuData, location: { pathname } } = this.props;
    // 获取当前选中的菜单key值
    const selectedKeys = this.getSelectedMenuKeys(pathname, menuData);
    return (
      <Layout.Sider>
        <div style={{ width: '100%', height: 64, color: '#fff' }}>这里放logo什么的</div>
        <Menu
          mode="inline"
          theme="dark"
          style={{ width: '100%' }}
          selectedKeys={selectedKeys}
        >
          {
            this.getNavMenuItems(menuData)
          }
        </Menu>
      </Layout.Sider>
    );
  }
}
