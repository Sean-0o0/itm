const prefix = '';
exports.routes = [
  {
    path: `${prefix}/loading`,
    component: './Exception/loading',
  },
  {
    path: `${prefix}/clearingPlace`, // 总部清算业务监控
    component: './screen/ClearingPlace/index',
  },
  {
    path: `${prefix}/fundSettlement`, // 总部资金结算业务监控
    component: './screen/FundSettlementV2/index',
  },
  {
    path: `${prefix}/futures`, // 兴证期货监控大屏
    component: './screen/FuturesV2/index',
  },
  {
    path: `${prefix}/international`, // 兴证国际监控大屏
    component: './screen/InternationalV2/index',
  },
  {
    path: `${prefix}/oprtRiskOfAsset`, // 兴证资管运营风险监控大屏
    component: './screen/OprtRiskOfAssetV2/index',
  },
  {
    path: `${prefix}/capital`, // 兴证资本监控大屏
    component: './screen/Capital/index',
  },
  {
    path: `${prefix}/fund`, // 兴证基金监控大屏
    component: './screen/FundV2/index',
  },
  {
    path: `${prefix}/investment`, // 兴证投资监控大屏
    component: './screen/Investment/index',
  },
  {
    path: `${prefix}/bond`, // 总部银行间债券结算业务监控
    component: './screen/BondV2/index',
  },
  {
    path: `${prefix}/runManage`, // 总部运行管理业务监控
    component: './screen/RunManageV2/index',
  },
  {
    path: `${prefix}/centralOpert`, // 总部集中运营业务监控
    component: './screen/CentralOpert/index',
  },
  {
    path: `${prefix}/callCenter`, // 总部呼叫中心业务监控
    component: './screen/callCenter/index',
  },
  {
    path: `${prefix}/mainScreen`, // 主屏
    component: './screen/MainScreenV2/index',
  },
  {
    path: `${prefix}/selfRun`, // 自营账户监控屏
    component: './screen/SelfRun/index',
  },
  {
    path: `${prefix}/businessUnit`, // 交易单元监控屏
    component: './screen/BusinessUnit/index',
  },
  {
    path: `${prefix}/subsidiary`, // 分公司监控屏
    component: './screen/Subsidiary/index',
  },
  {
    path: `${prefix}/realNameMonitoring`, // 实名制监控屏
    component: './screen/RealNameMonitoring/index',
  },
  // {
  //   path: `${prefix}/mainScreen1`, // 主屏
  //   component: './screen/MainScreenV3/index',
  // },
];
