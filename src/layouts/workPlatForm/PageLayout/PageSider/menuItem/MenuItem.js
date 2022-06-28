import React from 'react';
import { Link } from 'dva/router';
import { Menu } from 'antd';
// import classnames from 'classnames';
import lodash from 'lodash';

class LinkMenuItem extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     selectedMenuKeys: this.props.selectedMenuKeys,
  //   };
  // }
  componentWillReceiveProps(nextProps) {
    this.editExpendKey(nextProps.selectedMenuKeys);
  }
  // editExpendKey = (selectedMenuKeys) => {
  //   this.setState({
  //     selectedMenuKeys,
  //   });
  // }
  /**
   * 转化路径
   */
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  }
  menuLangKey = (item = {}) => {
    const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  }
  render() {
    const { menuData = {}, location = {}, key } = this.props; // eslint-disable-line
    // const { selectedMenuKeys = [] } = this.state;
    const itemPath = this.conversionPath(lodash.get(menuData, 'url', ''));
    const toLinkObj = {
      pathname: itemPath,
    };
    // const menuClass = selectedMenuKeys && selectedMenuKeys.includes(this.menuLangKey(menuData)) ? 'm-menu-selected' : '';
    return (
      <Menu.Item key={key}>
        {
          /^https?:\/\//.test(menuData.url) ? (
            <a
              className="m-item-title-link"
              href={itemPath}
              target={menuData.windowType === 1 ? '_blank' : ''}
            >
              <i className={`iconfont ${lodash.get(menuData, 'iconUrl', '')}`} />
              <span className="hide-menu">{lodash.get(menuData, 'title[0].text', '')}</span>
            </a>
          ) : (
            <Link
              to={toLinkObj}
              target={lodash.get(menuData, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
              replace={itemPath === this.props.location.pathname}
            >
              <i className={`iconfont ${lodash.get(menuData, 'iconUrl', '')}`} />
              <span className="hide-menu">{lodash.get(menuData, 'title[0].text', '')}</span>
            </Link>
          )}
        {/* <a href="../home/index.html">
        <i className="m-circular" />
        <span className="hide-menu">{subName}</span>
      </a> */}
      </Menu.Item>
    // <li className={classnames('ant-menu-item', menuClass)} key={this.menuLangKey(menuData)}>

    // </li>
    );
  }
}
export default LinkMenuItem;
