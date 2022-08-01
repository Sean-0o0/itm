const prefix = '/pms/manage';
exports.routes = [
  {
    //生命周期管理页面
    path: `${prefix}/LifeCycleManagement`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './pmsPage/LifeCycleManagement',
  },
  {
    //周报详情页面
    path: `${prefix}/WeeklyReportSummary`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './pmsPage/WeeklyReportSummary',
  },
  {
    //周报列表页面
    path: `${prefix}/WeeklyReportTable`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './pmsPage/WeeklyReportTable',
  },
  {
    //个人工作台
    path: `/PersonWorkBench`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './pmsPage/PersonWorkBench',
  },
]
