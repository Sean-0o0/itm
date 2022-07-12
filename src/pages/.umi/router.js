import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/403',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__Exception__403" */ '../Exception/403'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../Exception/403').default,
    exact: true,
  },
  {
    path: '/404',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__Exception__404" */ '../Exception/404'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../Exception/404').default,
    exact: true,
  },
  {
    path: '/500',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__Exception__500" */ '../Exception/500'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../Exception/500').default,
    exact: true,
  },
  {
    path: '/login',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__login" */ '../../layouts/login'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../../layouts/login').default,
    exact: true,
  },
  {
    path: '/testPage/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__test__PageLayout" */ '../../layouts/test/PageLayout'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../../layouts/test/PageLayout').default,
    routes: [
      {
        path: '/testPage/basicDataTable',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__basicDataTable" */ '../testPage/basicDataTable'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/basicDataTable').default,
        exact: true,
      },
      {
        path: '/testPage/dataTable',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__dataTable" */ '../testPage/dataTable'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/dataTable').default,
        exact: true,
      },
      {
        path: '/testPage/test1',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__test1" */ '../testPage/test1'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/test1').default,
        exact: true,
      },
      {
        path: '/testPage/test2',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__test2" */ '../testPage/test2'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/test2').default,
        exact: true,
      },
      {
        path: '/testPage/memberSingleSelect',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__memberSingleSelect" */ '../testPage/memberSingleSelect'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/memberSingleSelect').default,
        exact: true,
      },
      {
        path: '/testPage/vTable',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__vTable" */ '../testPage/vTable'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/vTable').default,
        exact: true,
      },
      {
        path: '/testPage/test3',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__test3" */ '../testPage/test3'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/test3').default,
        exact: true,
      },
      {
        path: '/testPage/form',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__form" */ '../testPage/form'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/form').default,
        exact: true,
      },
      {
        path: '/testPage/g6Combo',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__testPage__g6Combo" */ '../testPage/g6Combo'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../testPage/g6Combo').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/iconFont',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "components__Common__IconFont" */ '../../components/Common/IconFont'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../../components/Common/IconFont').default,
    exact: true,
  },
  {
    path: '/single/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__single__PageLayout" */ '../../layouts/single/PageLayout'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../../layouts/single/PageLayout').default,
    routes: [
      {
        path: '/single/jsonDatas/:optTp',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__singlePage__reportForm__jsonDatas" */ '../workPlatForm/singlePage/reportForm/jsonDatas'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/singlePage/reportForm/jsonDatas').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__workPlatForm__PageLayout" */ '../../layouts/workPlatForm/PageLayout'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../../layouts/workPlatForm/PageLayout').default,
    routes: [
      {
        path: '/loading',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__Exception__loading" */ '../Exception/loading'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../Exception/loading').default,
        exact: true,
      },
      {
        path: '/index',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__homePageV2__models__homePage.js' */ '/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/pages/homePageV2/models/homePage.js').then(
                  m => {
                    return { namespace: 'homePage', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__homePageV2__index" */ '../homePageV2/index'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../homePageV2/index').default,
        exact: true,
      },
      {
        path: '/blank',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__homePageV2__models__homePage.js' */ '/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/pages/homePageV2/models/homePage.js').then(
                  m => {
                    return { namespace: 'homePage', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__homePageV2__Blank__index" */ '../homePageV2/Blank/index'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../homePageV2/Blank/index').default,
        exact: true,
      },
      {
        path: '/**.sdo',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__intergration__doIframeContent" */ '../intergration/doIframeContent'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../intergration/doIframeContent').default,
        exact: true,
      },
      {
        path: '/UIProcessor**',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__intergration__bridgeContent" */ '../intergration/bridgeContent'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../intergration/bridgeContent').default,
        exact: true,
      },
      {
        path: '/WorkProcessor**',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__intergration__bridgeContent" */ '../intergration/bridgeContent'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../intergration/bridgeContent').default,
        exact: true,
      },
      {
        path: '/OperateProcessor**',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__intergration__bridgeContent" */ '../intergration/bridgeContent'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../intergration/bridgeContent').default,
        exact: true,
      },
      {
        path: '/ShowWorkflow',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__intergration__bridgeContent" */ '../intergration/bridgeContent'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../intergration/bridgeContent').default,
        exact: true,
      },
      {
        path: '/iframe**',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__intergration__bridgeContent" */ '../intergration/bridgeContent'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../intergration/bridgeContent').default,
        exact: true,
      },
      {
        path: '/WarningPage',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "components__Common__WarningPage" */ '../../components/Common/WarningPage'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../../components/Common/WarningPage').default,
        exact: true,
      },
      {
        path: '/pms/manage/LifeCycleManagement',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__pmsPage__LifeCycleManagement" */ '../pmsPage/LifeCycleManagement'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../pmsPage/LifeCycleManagement').default,
        exact: true,
      },
      {
        path: '/pms/manage/WeeklyReportSummary',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__pmsPage__WeeklyReportSummary" */ '../pmsPage/WeeklyReportSummary'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../pmsPage/WeeklyReportSummary').default,
        exact: true,
      },
      {
        path: '/pms/manage/WeeklyReportTable',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__pmsPage__WeeklyReportTable" */ '../pmsPage/WeeklyReportTable'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../pmsPage/WeeklyReportTable').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
