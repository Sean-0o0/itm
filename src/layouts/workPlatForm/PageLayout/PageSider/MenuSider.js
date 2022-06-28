import React from 'react';
// import { Link } from 'dva/router';
// import { Layout } from 'antd';
import LeftContent from './content/LeftContent';
// import RightContent from './content/RightContent';
// import styles from './index.less';

class MenuSider extends React.Component {
  constructor(props) {
    super(props);
    this.enterTimer = null;
  }
  render() {
    const { location, collapsed, toggleCollapsed, menuLangKey, selectedMenuKeys, subMenuTree, dispatch } = this.props;
    return (
      <LeftContent dispatch={dispatch} subMenuTree={subMenuTree} collapsed={collapsed} toggleCollapsed={toggleCollapsed} menuLangKey={menuLangKey} selectedMenuKeys={selectedMenuKeys} location={location} />
    );
  }
}
export default MenuSider;
