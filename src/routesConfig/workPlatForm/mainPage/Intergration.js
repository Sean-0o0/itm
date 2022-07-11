const prefix = '';
exports.routes = [
  {
    path: `${prefix}/**.sdo`,
    component:'./intergration/doIframeContent',
  },
  { // livebos集成
    path: `${prefix}/UIProcessor**`,
    component:'./intergration/bridgeContent',
  },
  { // livebos集成
    path: `${prefix}/WorkProcessor**`,
    component:'./intergration/bridgeContent',
  },
  {
    path: `${prefix}/OperateProcessor**`,
    component:'./intergration/bridgeContent',
  },
  {
    path: `${prefix}/ShowWorkflow`,
    component:'./intergration/bridgeContent',
  },
  { // 报表导航页面
    path: `${prefix}/iframe**`,
    component:'./intergration/bridgeContent',
  },
];
