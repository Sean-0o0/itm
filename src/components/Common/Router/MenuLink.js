import React from 'react';
import { Menu } from 'antd';
import { Link, Route } from 'dva/router';
// import { Switch, Route, withRouter, Redirect } from 'dva/router';

// eslint-disable-next-line arrow-parens
const MenuLink = ({ to, menuname, activeClassName = 'ant-menu-item-selected', className = 'ant-menu-item', ...other }) => (
  <Route
    path={to}
    // eslint-disable-next-line
    children={({ match }) => {
      return (
        <Menu.Item className={match ? activeClassName : className} {...other}>
          <Link to={to}>
            <span><span className="hide-menu">{menuname}</span></span>
          </Link>
        </Menu.Item>
      );
    }}
  />
);

export default MenuLink;
