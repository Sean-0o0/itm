import React from 'react';
import lodash from 'lodash';
import LinkMenuItem from './MenuItem';
import SubMenu from './SubMenu';

class MenuItem extends React.Component {
  menuMouseEnter = (key) => {
    if (typeof this.props.leftMenuMouseOver === 'function') {
      this.props.leftMenuMouseOver(key);
    }
  }
  menuMouseLeave = (key) => { // eslint-disable-line
    if (typeof this.props.leftMenuMouseLeave === 'function') {
      this.props.leftMenuMouseLeave();
    }
  }
  menuLangKey = (item = {}) => {
    const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  }
  render() {
    const { menuData = {}, location = {}, selectedMenuKeys, key } = this.props; // eslint-disable-line
    const subMenuTree = lodash.get(menuData, 'menu.item', []);
    const hasChild = subMenuTree.length !== 0;
    // return (
    //   <div
    //     onMouseEnter={(e) => { this.menuMouseEnter(this.menuLangKey(menuData)); }} // eslint-disable-line
    //     onMouseLeave={(e) => { this.menuMouseLeave(this.menuLangKey(menuData)); }} // eslint-disable-line
    //   >
    //     {
    //       hasChild ? <SubMenu selectedMenuKeys={selectedMenuKeys} menuData={menuData} location={location} /> : <LinkMenuItem selectedMenuKeys={selectedMenuKeys} menuData={menuData} location={location} />
    //     }
    //   </div>
    // );
    if (hasChild) {
      return <SubMenu key={key} selectedMenuKeys={selectedMenuKeys} menuData={menuData} location={location} />;
    }
    return <LinkMenuItem key={key} selectedMenuKeys={selectedMenuKeys} menuData={menuData} location={location} />;
  }
}
export default MenuItem;
