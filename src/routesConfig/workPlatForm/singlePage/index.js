const Esa = require('./Esa');
const Planning = require('./Planning');
const prefix = '/single';
exports.routes = [
  {
    path: `${prefix}/`,
    models: () => [import('../models/workPlatForm/singlePage')],
    component: '../layouts/single/PageLayout',
    routes: [
      // 薪酬
      ...Esa.routes,
      // 企划平台
      ...Planning.routes,
    ],
  },
];
