import React from 'react';
// import classnames from 'classnames';
import lodash from 'lodash';
import { Menu } from 'antd';

class SubMenu extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     selectedMenuKeys: this.props.selectedMenuKeys,
  //   };
  // }
  // componentWillReceiveProps(nextProps) {
  //   this.editExpendKey(nextProps.selectedMenuKeys);
  // }
  // editExpendKey = (selectedMenuKeys) => {
  //   this.setState({
  //     selectedMenuKeys,
  //   });
  // }
  // menuLangKey = (item = {}) => {
  //   const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
  //   if (langKeys.length > 0) {
  //     return lodash.get(langKeys, '[0].text', '');
  //   }
  //   return lodash.get(item, 'title[0].text', '');
  // }
  render() {
    const { menuData = {}, key = '' } = this.props;
    const subMenuTree = lodash.get(menuData, 'menu.item', []);
    // const { selectedMenuKeys = [] } = this.state;
    // const menuClass = selectedMenuKeys && selectedMenuKeys.includes(this.menuLangKey(menuData)) ? 'm-menu-selected' : '';
    return (
      <Menu.SubMenu
        key={key}
        title={
          <span>
            <i className={`iconfont ${lodash.get(menuData, 'iconUrl', '')}`} />
            <span className="hide-menu">{name}</span>
            <i className="ant-menu-submenu-arrow" />
          </span>}
      >
        {
            subMenuTree.map((temp) => {
              const subName = lodash.get(temp, 'describe[0].text', '');
              return (
                <Menu.Item key={subName}>
                  <a href="../home/index.html">
                    <i className="m-circular" />
                    <span className="hide-menu">{subName}</span>
                  </a>
                </Menu.Item>
                  );
            })
          }
      </Menu.SubMenu>
    );
  }
}
export default SubMenu;
