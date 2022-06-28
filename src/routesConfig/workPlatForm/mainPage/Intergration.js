const prefix = '';
exports.routes = [
  {
    path: `${prefix}/**.sdo`,
    component:'./intergration/doIframeContent',
  },
  { // livebos集成
    path: `${prefix}/UIProcessor**`,
    component:'./intergration/iframeContent',
  },
  {
    path: `${prefix}/OperateProcessor**`,
    component:'./intergration/iframeContent',
  },
  {
    path: `${prefix}/ShowWorkflow`,
    component:'./intergration/iframeContent',
  },
  { // 报表导航页面
    path: `${prefix}/iframe**`,
    component:'./intergration/reactIframe',
  },
];
