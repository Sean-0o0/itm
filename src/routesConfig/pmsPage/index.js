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
    //周报列表页面
    path: `${prefix}/WeeklyReportSummary`,
    component: './pmsPage/WeeklyReportSummary',
  },
  {
    //周报汇总-数字化专报
    path: `${prefix}/WeeklyReportTable`,
    component: './pmsPage/WeeklyReportTable',
  },
  {
    //月报汇总
    path: `${prefix}/MonthlyReportTable`,
    component: './pmsPage/MonthlyReportTable',
  },
  {
    //外包生命周期页面
    path: `${prefix}/EpibolyLifeCycle`,
    component: './pmsPage/EpibolyLifeCycle',
  },
  {
    //个人工作台
    path: `/PersonWorkBench`,
    component: './pmsPage/PersonWorkBench',
  },
  {
    //WPS在线预览
    path: `${prefix}/ViewFilePage`,
    component: './pmsPage/ViewFilePage',
  },
  {
    // 统计分析 - 领导看板页面
    path: `${prefix}/StatisticAnalysis`,
    component: './pmsPage/StatisticAnalysis',
  },
  // {
  //   path: `${prefix}/`,
  //   component: './workPlatForm/singlePage',
  // },
]
