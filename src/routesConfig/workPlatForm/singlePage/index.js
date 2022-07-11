const prefix = '/single';
exports.routes = [
  {
    path: `${prefix}/`,
    component:'../layouts/single/PageLayout',
    routes: [
      { // 扩展报表--json配置功能
        path: `${prefix}/jsonDatas/:optTp`,
        component: './workPlatForm/singlePage/reportForm/jsonDatas',
      },
      {
        path: `${prefix}/superviseProDtl/:params`,
        component:'./processCenter/superviseProDtl',
      },
    ],
  },
];
