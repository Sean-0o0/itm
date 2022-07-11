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
    path: '/clearingPlace',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__ClearingPlace__index" */ '../screen/ClearingPlace/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/ClearingPlace/index').default,
    exact: true,
  },
  {
    path: '/fundSettlement',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__FundSettlementV2__index" */ '../screen/FundSettlementV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/FundSettlementV2/index').default,
    exact: true,
  },
  {
    path: '/futures',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__FuturesV2__index" */ '../screen/FuturesV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/FuturesV2/index').default,
    exact: true,
  },
  {
    path: '/international',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__InternationalV2__index" */ '../screen/InternationalV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/InternationalV2/index').default,
    exact: true,
  },
  {
    path: '/oprtRiskOfAsset',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__OprtRiskOfAssetV2__index" */ '../screen/OprtRiskOfAssetV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/OprtRiskOfAssetV2/index').default,
    exact: true,
  },
  {
    path: '/capital',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__Capital__index" */ '../screen/Capital/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/Capital/index').default,
    exact: true,
  },
  {
    path: '/fund',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__FundV2__index" */ '../screen/FundV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/FundV2/index').default,
    exact: true,
  },
  {
    path: '/investment',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__Investment__index" */ '../screen/Investment/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/Investment/index').default,
    exact: true,
  },
  {
    path: '/bond',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__BondV2__index" */ '../screen/BondV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/BondV2/index').default,
    exact: true,
  },
  {
    path: '/runManage',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__RunManageV2__index" */ '../screen/RunManageV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/RunManageV2/index').default,
    exact: true,
  },
  {
    path: '/centralOpert',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__CentralOpert__index" */ '../screen/CentralOpert/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/CentralOpert/index').default,
    exact: true,
  },
  {
    path: '/callCenter',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__callCenter__index" */ '../screen/callCenter/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/callCenter/index').default,
    exact: true,
  },
  {
    path: '/mainScreen',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__MainScreenV2__index" */ '../screen/MainScreenV2/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/MainScreenV2/index').default,
    exact: true,
  },
  {
    path: '/selfRun',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__SelfRun__index" */ '../screen/SelfRun/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/SelfRun/index').default,
    exact: true,
  },
  {
    path: '/businessUnit',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__BusinessUnit__index" */ '../screen/BusinessUnit/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/BusinessUnit/index').default,
    exact: true,
  },
  {
    path: '/subsidiary',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__Subsidiary__index" */ '../screen/Subsidiary/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/Subsidiary/index').default,
    exact: true,
  },
  {
    path: '/realNameMonitoring',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__screen__RealNameMonitoring__index" */ '../screen/RealNameMonitoring/index'),
          LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
            .default,
        })
      : require('../screen/RealNameMonitoring/index').default,
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
        path: '/single/superviseProDtl/:params',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__processCenter__superviseProDtl" */ '../processCenter/superviseProDtl'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../processCenter/superviseProDtl').default,
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
        path: '/staffAdmission',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__workPlatForm__mainPage__businessNavigate__models__staffAdmission.js' */ '/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/pages/workPlatForm/mainPage/businessNavigate/models/staffAdmission.js').then(
                  m => {
                    return { namespace: 'staffAdmission', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__businessNavigate__staffAdmission" */ '../workPlatForm/mainPage/businessNavigate/staffAdmission'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/businessNavigate/staffAdmission')
              .default,
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
        path: '/dataCenter/tradingUnitList',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__dataCenter__TradingUnitList" */ '../workPlatForm/mainPage/dataCenter/TradingUnitList'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/dataCenter/TradingUnitList')
              .default,
        exact: true,
      },
      {
        path: '/dataCenter/tradingUnitCompare',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__dataCenter__TradingUnitCompare" */ '../workPlatForm/mainPage/dataCenter/TradingUnitCompare'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/dataCenter/TradingUnitCompare')
              .default,
        exact: true,
      },
      {
        path: '/dataCenter/tradingUnitZLPanorama',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__dataCenter__TradingUnitZLPanorama" */ '../workPlatForm/mainPage/dataCenter/TradingUnitZLPanorama'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/dataCenter/TradingUnitZLPanorama')
              .default,
        exact: true,
      },
      {
        path: '/dataCenter/tradingUnitZYPanorama',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__dataCenter__TradingUnitZYPanorama" */ '../workPlatForm/mainPage/dataCenter/TradingUnitZYPanorama'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/dataCenter/TradingUnitZYPanorama')
              .default,
        exact: true,
      },
      {
        path: '/dataCenter/tradingUnitAnalyze',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__dataCenter__TradingUnitAnalyze" */ '../workPlatForm/mainPage/dataCenter/TradingUnitAnalyze'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/dataCenter/TradingUnitAnalyze')
              .default,
        exact: true,
      },
      {
        path: '/dataCenter/tradingUnitCalculate',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__dataCenter__tradingUnitCalculate" */ '../workPlatForm/mainPage/dataCenter/tradingUnitCalculate'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/dataCenter/tradingUnitCalculate')
              .default,
        exact: true,
      },
      {
        path: '/dataCenter/tradingUnitApportion',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__dataCenter__tradingUnitApportion" */ '../workPlatForm/mainPage/dataCenter/tradingUnitApportion'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/dataCenter/tradingUnitApportion')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/motFactorIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTFactorIndex" */ '../workPlatForm/mainPage/motProduction/MOTFactorIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTFactorIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/motEventIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTEventIndex" */ '../workPlatForm/mainPage/motProduction/MOTEventIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTEventIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/dispatchIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__DISPatchIndex" */ '../workPlatForm/mainPage/motProduction/DISPatchIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/DISPatchIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/distributeStreamTableConfig',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__DIStributeStreamTableConfig" */ '../workPlatForm/mainPage/motProduction/DIStributeStreamTableConfig'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/DIStributeStreamTableConfig')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/yybMotDefineIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__YybMotDefineIndex" */ '../workPlatForm/mainPage/motProduction/YybMotDefineIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/YybMotDefineIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/ryMotDefineIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__RyMotDefineIndex" */ '../workPlatForm/mainPage/motProduction/RyMotDefineIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/RyMotDefineIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/groupDefinedIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTGroupDefinedIndex" */ '../workPlatForm/mainPage/motProduction/MOTGroupDefinedIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTGroupDefinedIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/motMonitoring',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTMonitoring" */ '../workPlatForm/mainPage/motProduction/MOTMonitoring'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTMonitoring')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/supervisorListIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTSupervisorListIndex" */ '../workPlatForm/mainPage/motProduction/MOTSupervisorListIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTSupervisorListIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/supervisorTaskIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTSupervisorTaskIndex" */ '../workPlatForm/mainPage/motProduction/MOTSupervisorTaskIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTSupervisorTaskIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/employeeExecutionOneIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTEmployeeExecutionOneIndex" */ '../workPlatForm/mainPage/motProduction/MOTEmployeeExecutionOneIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTEmployeeExecutionOneIndex')
              .default,
        exact: true,
      },
      {
        path: '/motcfg/employeeExecutionTwoIndex',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__workPlatForm__mainPage__motProduction__MOTEmployeeExecutionTwoIndex" */ '../workPlatForm/mainPage/motProduction/MOTEmployeeExecutionTwoIndex'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../workPlatForm/mainPage/motProduction/MOTEmployeeExecutionTwoIndex')
              .default,
        exact: true,
      },
      {
        path: '/processCenter/proAnalysis',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__processCenter__ProAnalysis" */ '../processCenter/ProAnalysis'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../processCenter/ProAnalysis').default,
        exact: true,
      },
      {
        path: '/processCenter/accountList',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__processCenter__AccountList" */ '../processCenter/AccountList'),
              LoadingComponent: require('/Applications/code/cxyw/zszq-pms/pro-pms-fe/src/components/Loader/Loader')
                .default,
            })
          : require('../processCenter/AccountList').default,
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
