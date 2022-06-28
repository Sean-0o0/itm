const prefix = '/testPage';
exports.routes = [
  {
    path: `${prefix}/`,
    component: '../layouts/test/PageLayout',
    routes: [
      {
        path: `${prefix}/basicDataTable`,
        component: './testPage/basicDataTable',
      },
      {
        path: `${prefix}/dataTable`,
        component: './testPage/dataTable',
      },
      {
        path: `${prefix}/test2`,
        component: './testPage/test2',
      },
      {
        path: `${prefix}/memberSingleSelect`,
        component: './testPage/memberSingleSelect',
      },
      {
        path: `${prefix}/vTable`,
        component: './testPage/vTable',
      },
      {
        path: `${prefix}/test3`,
        models: () => [import('../models/testPage/test3')],
        component: './testPage/test3',
      },
      // {
      //   path: `${prefix}/test509`,
      //   models: () => [import('../../models/testPage/test509')],
      //   component: './testPage/test509',
      // },
      // {
      //   path: `${prefix}/test514`,
      //   models: () => [import('../../models/testPage/test514')],
      //   component: './testPage/test514',
      // },
      // {
      //   path: `${prefix}/getParams/:params`,
      //   component: './testPage/getParams',
      // },
      {
        path: `${prefix}/form`,
        component: './testPage/form',
      },
    ],
  },
];
