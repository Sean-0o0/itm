const Intergration = require('./Intergration');
const Others = require('./Others');
const pmsPage =require('../../pmsPage')
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
      ...pmsPage.routes,
    ],
  },
];
