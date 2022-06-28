import React from 'react';
import { NavLink } from 'dva/router';

// eslint-disable-next-line arrow-parens
const TabLink = (props) => (
  <NavLink
    className="ant-tabs-tab"
    activeClassName="ant-tabs-tab-active"
    exact
    {...props}
  />
);

export default TabLink;
