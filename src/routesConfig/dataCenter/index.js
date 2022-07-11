const prefix = '/dataCenter';
exports.routes = [
  {
    path: `${prefix}/tradingUnitList`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/dataCenter/TradingUnitList',
  },
  {
    path: `${prefix}/tradingUnitCompare`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/dataCenter/TradingUnitCompare',
  },
  //交易单元全景-租赁
  {
    path: `${prefix}/tradingUnitZLPanorama`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/dataCenter/TradingUnitZLPanorama',
  },
  //交易单元全景-自用
  {
    path: `${prefix}/tradingUnitZYPanorama`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/dataCenter/TradingUnitZYPanorama',
  },
  {
    path: `${prefix}/tradingUnitAnalyze`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/dataCenter/TradingUnitAnalyze',
  },
  //交易单元成本计算
  {
    path: `${prefix}/tradingUnitCalculate`,
    component: './workPlatForm/mainPage/dataCenter/tradingUnitCalculate',
  },
  //交易单元成本分摊计算
  {
    path: `${prefix}/tradingUnitApportion`,
    component: './workPlatForm/mainPage/dataCenter/tradingUnitApportion',
  }
]
