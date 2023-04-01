const prefix = '/pms/manage';
exports.routes = [
  {
    //生命周期管理页面
    path: `${prefix}/LifeCycleManagement/:params`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './pmsPage/LifeCycleManagement',
  },
  {
    //生命周期管理页面
    path: `${prefix}/LifeCycleManagement`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './pmsPage/LifeCycleManagement',
  },
  // {
  //   //周报汇总
  //   path: `${prefix}/WeeklyReportSummary`,
  //   component: './pmsPage/WeeklyReportSummary',
  // },
  {
    //报告汇总
    path: `${prefix}/WeeklyReportTable`,
    component: './pmsPage/WeeklyReportTable',
  },
  // {
  //   //月报汇总
  //   path: `${prefix}/MonthlyReportTable`,
  //   component: './pmsPage/MonthlyReportTable',
  // },
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
  {
    // 项目信息
    path: `${prefix}/ProjectInfo/:params`,
    component: './pmsPage/ProjectInfo',
  },
  {
    // 项目信息
    path: `${prefix}/ProjectInfo`,
    component: './pmsPage/ProjectInfo',
  },
  {
    // 文档库
    path: `${prefix}/attachLibrary`,
    component: './pmsPage/AttachLibrary',
  },
  // {
  //   path: `${prefix}/`,
  //   component: './workPlatForm/singlePage',
  // },
  {
    //新首页
    path: `${prefix}/HomePage`,
    component: './pmsPage/HomePage',
  },
  {
    // 人员详情
    path: `${prefix}/staffDetail/:params`,
    component: './pmsPage/StaffDetail',
  },
  {
    // 人员详情
    path: `${prefix}/staffDetail`,
    component: './pmsPage/StaffDetail',
  },
  {
    // 标签详情
    path: `${prefix}/labelDetail`,
    component: './pmsPage/LabelDetail',
  },
  {
    //编辑项目信息
    path: `${prefix}/EditProjectInfo`,
    component: './pmsPage/EditProjectInfo',
  },
  {
    // 项目详情
    path: `${prefix}/ProjectDetail/:params`,
    component: './pmsPage/ProjectDetail',
  },
  {
    // 项目详情
    path: `${prefix}/ProjectDetail`,
    component: './pmsPage/ProjectDetail',
  },
];
