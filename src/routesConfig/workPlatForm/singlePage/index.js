const PmsPage = require('./PmsPage');
const prefix = '/single';
exports.routes = [
  {
    path: `${prefix}/`,
    models: () => [import('../models/workPlatForm/singlePage')],
    component: '../layouts/single/PageLayout',
    routes: [
      ...PmsPage.routes,
    ],
  },
];

