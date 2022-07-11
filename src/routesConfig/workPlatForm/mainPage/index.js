const Intergration = require('./Intergration');
const Others = require('./Others');
const dataCenter =require('../../dataCenter')
const Mot =require('../../motProduction')
const processCenter =require('../../processCenter')
const prefix = '';
exports.routes = [
  {
    path: `${prefix}/`,
    models: () => [
      import('../models/workPlatForm/mainPage'),
    ],
    component: '../layouts/workPlatForm/PageLayout',
    routes: [
      {
        path: `${prefix}/loading`,
        component: './Exception/loading',
      },
      {
        path: `${prefix}/index`,
        component: './homePageV2/index',
      },
      {
        path: `${prefix}/blank`,
        component: './homePageV2/Blank/index',
      },
      // 集成iframe路由定义
      ...Intergration.routes,
      // 集成业务导航路由定义
      ...Others.routes,
	  // 数据中心路由
      ...dataCenter.routes,
      // mot路由
      ...Mot.routes,
      //流程中心路由
      ...processCenter.routes
    ],
  },
];
