const Intergration = require('./Intergration');
const Esa = require('./Esa');
const Planning = require('./Planning');


const prefix = '';
exports.routes = [
  {
    path: `${prefix}/`,
    models: () => [
      import('../models/workPlatForm/mainPage'),
    ],
    component:'../layouts/workPlatForm/PageLayout',
    routes: [
      {
        path: `${prefix}/loading`,
        component: './Exception/loading',
      },
      { // 点击没有菜单的方案特殊处理
        path: `${prefix}/exceptionPage/noAuthorities`,
        component: '../pages/workPlatForm/mainPage/exceptionPage/noAuthorities',
      },
      // 集成iframe路由定义
      ...Intergration.routes,
      // 薪酬
      ...Esa.routes,
      // 企划
      ...Planning.routes,
    ],
  },
];
