import React from 'react';
import lodash from 'lodash';
import { Redirect } from 'dva/router';
import PropTypes from 'prop-types';

/**
 * Component: AuthRedirect
 * Description: 带权限控制的Redirect组件，基于dva/router - <Redirect
 * Author: WANGQI
 * Date: 2018/11/22
 * Remarks: --
 */
class AuthRedirect extends React.Component {
  static propTypes = {
    switchNode: PropTypes.object, // <Switch组件的ref
    authorityArr: PropTypes.array.isRequired, // 权限点的字符串数组
    routePathes: PropTypes.array, // 路由url的字符串数组
  }

  static defaultProps = {
    switchNode: {},
    routePathes: [],
  }

  getRedirectPath = () => {
    const { switchNode, authorityArr, routePathes } = this.props;
    let toPaths = [];
    if (!routePathes) {
      // 获取switch的子node
      const childNodes = lodash.get(switchNode, 'props.children', []);
      if (childNodes.length === 0) {
        return '';
      }
      // childNodes是Switch下面的子组件，包含Route和该组件等
      childNodes.forEach((item) => {
        const toPath = lodash.get(item, 'props.path');
        if (toPath) {
          toPaths.push(toPath);
        }
      });
    } else {
      toPaths = routePathes;
    }
    // 根据权限筛选可以跳转的路由url数组
    const redirectPaths = toPaths.filter(item => authorityArr.includes(item.substring(item.lastIndexOf('/') + 1)));
    return redirectPaths[0] || '';
  }

  render() {
    const { switchNode } = this.props;
    const toPath = this.getRedirectPath();
    return switchNode && toPath && <Redirect to={toPath} />;
  }
}

export default AuthRedirect;
