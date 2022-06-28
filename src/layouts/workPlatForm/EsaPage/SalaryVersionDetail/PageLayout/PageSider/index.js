/* eslint-disable valid-jsdoc */
import React from 'react';
import { Link } from 'dva/router';
import { Layout, Menu } from 'antd';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { suffix } from '../../../../../../utils/config';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';
import styles from './index.less';

class SalaryVersionDetailSider extends React.PureComponent {
  constructor(props) {
    super(props);
    const { collapsed } = props;
    this.state = {
      collapsed,
      collapsedKey: '',
    };
  }
  componentWillReceiveProps(props) {
    if ('collapsed' in props) {
      const { collapsed } = props;
      this.setState({
        collapsed,
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
    return menusData.filter(item => item.name && !item.hideInMenu).map((item) => {
      const ItemDom = this.getSubMenuOrItem(item);
      return this.checkPermissionItem(item.authority, ItemDom);
    }).filter(item => !!item);
  }
  /**
   * 获取当前菜单节点及其子节点
   */
  getSubMenuOrItem = (item) => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <Menu.SubMenu
          key={item.key || item.path}
          title={
            item.icon ? (
              <span>
                <i className={`iconfont ${item.icon}`} />
                <span className="hide-menu">{item.name}</span>
              </span>
            ) : item.name
          }
        >
          {this.getNavMenuItems(item.children)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item
        key={item.key || item.path}
      // onClick={this.handleMenuClick}
      >
        {this.getMenuItemPath(item)}
      </Menu.Item>
    );
  }
  /**
* 查找某个字符的位置
*/
  findIndexOption = (str, cha, num) => {
    let x = str.indexOf(cha);
    for (let i = 0; i < num; i++) {
      x = str.indexOf(cha, x + 1);
    }
    return x;
  }
  /**
  * 判断是否是http链接.返回 Link 或 a
  */
  getMenuItemPath = (item) => {
    let itemPath = this.conversionPath(item.path);
    // 加密
    const versionData = itemPath.substring(itemPath.lastIndexOf('/') + 1);
    itemPath = `${itemPath.substring(0, itemPath.lastIndexOf('/'))}/${versionData}`;
    const { target, name, icon } = item;
    // 如果是 http(s) 链接,那么就返回一个a标签
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon ? <i className={`iconfont ${item.icon}`} /> : ''}
          <span className="hide-menu">{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
      >
        {icon ? <i className={`iconfont ${item.icon}`} /> : ''}
        <span className="hide-menu">{name}</span>
      </Link>
    );
  }
  /**
   * 获取选中的菜单节点
   */
  getSelectedMenuKeys = (pathname, menus) => {
    const selectedKeys = [];
    menus.every((item) => {
      let curentPath = item.path || '';
      const versionData = curentPath.substring(curentPath.lastIndexOf('/') + 1);
      curentPath = `${curentPath.substring(0, curentPath.lastIndexOf('/'))}/${versionData}`;
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
      } else if (curentPath === pathname) {
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
   * 菜单点击事件
   */
  handleMenuClick = (e) => {
    const { collapsedKey } = this.state;
    const { key } = e;
    const { toggleCollapsed, collapsed = false } = this.props;
    if (!collapsed && collapsedKey !== key) {
      if (toggleCollapsed && typeof toggleCollapsed === 'function') {
        toggleCollapsed.call(this);
      }
    }
    this.setState({
      collapsedKey: key,
    });
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
  conversionPath = (path) => {
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
      if (item.path && !item.path.endsWith(suffixWithDot)) {
        finalItem.path = `${item.path}${suffixWithDot}`;
      }
      if (item.children && item.children.length > 0) {
        finalItem.children = this.concatSuffix(item.children);
      }
      return finalItem;
    });
  }
  render() {
    const { menuData, toggleCollapsed, location: { pathname }, salaryVersionDetail: { versionData = '' } } = this.props;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuData));
    } else {
      finalMenuData.push(...menuData);
    }
    // 获取当前选中的菜单key值
    const selectedKeys = this.getSelectedMenuKeys(pathname, finalMenuData);
    const versionDataJson = JSON.parse(DecryptBase64(versionData));
    return (
      <Layout.Sider collapsible collapsedWidth={60} width="16.666rem" trigger={null} collapsed={this.state.collapsed} style={{ position: 'fixed' }} className={`${this.state.collapsed ? styles.m_collapsed : styles.m_uncollapsed} m-sider360`} >
        <Scrollbars
          autoHide
          renderTrackVertical={props => <div {...props} className={styles['scrollbars-track-vertical']} />}
        >
          <div className="m-product-sider360-head" style={{ minHeight: 0 }} onClick={toggleCollapsed} >
            <h3 style={{ cursor: 'pointer' }}>
              <span>
                <i className="iconfont icon-menu" />
              </span>
            </h3>
          </div>
          <div className="scroll-wrap" style={{ height: '100%' }}>
            <div style={this.state.collapsed ? { margin: '20px 0', textAlign: 'center', display: 'none' } : { margin: '20px 0', textAlign: 'center' }}>
              <h3 style={{ color: '#fff', fontWeight: 'bold' }}>{versionDataJson.versionName || '--'}版本</h3>
            </div>
            <div className="scroll-cont">
              <Scrollbars
                autoHide
                renderTrackVertical={props => <div {...props} className={styles['scrollbars-track-vertical']} />}
                style={{ width: '100%' }}
              >
                <Menu
                  className="m-menu"
                  mode="inline"
                  inlineIndent="18"
                  theme="dark"
                  style={{ width: '100%', marginTop: '0rem' }}
                  selectedKeys={selectedKeys}
                >
                  {
                    this.getNavMenuItems(finalMenuData)
                  }
                </Menu>
              </Scrollbars>
            </div>
          </div>
        </Scrollbars>
      </Layout.Sider>
    );
  }
}
export default connect(({ salaryVersionDetail }) => ({
  salaryVersionDetail,
}))(SalaryVersionDetailSider);
