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
    // 项目列表 - 带参数的要放前边
    path: `${prefix}/ProjectInfo/:params`,
    component: './pmsPage/ProjectInfo',
  },
  {
    // 项目列表
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
  // {
  //   // 人员详情
  //   path: `${prefix}/staffDetail`,
  //   component: './pmsPage/StaffDetail',
  // },
  {
    // 标签详情
    path: `${prefix}/labelDetail/:params`,
    component: './pmsPage/LabelDetail',
  },
  // {
  //   // 标签详情
  //   path: `${prefix}/labelDetail`,
  //   component: './pmsPage/LabelDetail',
  // },
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
    //供应商列表
    path: `${prefix}/SupplierInfo`,
    component: './pmsPage/SupplierInfo',
  },
  {
    //供应商详情
    path: `${prefix}/SupplierDetail/:params`,
    component: './pmsPage/SupplierDetail',
  },
  {
    // 硬件项目相关
    path: `${prefix}/HardwareItems`,
    component: './pmsPage/HardwareItems',
  },
  {
    // 硬件项目相关-中标信息录入
    path: `${prefix}/EnterBidInfo`,
    component: './pmsPage/EnterBidInfo',
  },
  {
    // 硬件项目相关-合同信息录入
    path: `${prefix}/AgreementEnter`,
    component: './pmsPage/AgreementEnter',
  },
  {
    // 硬件项目相关-询比结果录入
    path: `${prefix}/PollResultInfo`,
    component: './pmsPage/PollResultInfo',
  },
  {
    // 硬件项目相关-询比结果列表
    path: `${prefix}/PollResultList`,
    component: './pmsPage/PollResultList',
  },
  {
    // 硬件项目相关-需求列表
    path: `${prefix}/RequireList`,
    component: './pmsPage/RequireList',
  },
  {
    // 统计分析-概览部门
    path: `${prefix}/DepartmentOverview/:params`,
    component: './pmsPage/DepartmentOverview',
  },
  {
    // 统计分析-项目建设
    path: `${prefix}/ProjectBuilding/:params`,
    component: './pmsPage/ProjectBuilding',
  },
  {
    // 统计分析-预算执行
    path: `${prefix}/BudgetExcute/:params`,
    component: './pmsPage/BudgetExcute',
  },
  {
    // 统计分析-供应商情况
    path: `${prefix}/SupplierSituation/:params`,
    component: './pmsPage/SupplierSituation',
  },
  {
    // 统计分析-概览部门
    path: `${prefix}/DepartmentOverview`,
    component: './pmsPage/DepartmentOverview',
  },
  {
    // 统计分析-项目建设
    path: `${prefix}/ProjectBuilding`,
    component: './pmsPage/ProjectBuilding',
  },
  {
    // 统计分析-预算执行
    path: `${prefix}/BudgetExcute`,
    component: './pmsPage/BudgetExcute',
  },
  {
    // 统计分析-供应商情况
    path: `${prefix}/SupplierSituation`,
    component: './pmsPage/SupplierSituation',
  },
  {
    // 人员列表
    path: `${prefix}/StaffInfo`,
    component: './pmsPage/StaffInfo',
  },
  {
    // 需求详情
    path: `${prefix}/DemandDetail/:params`,
    component: './pmsPage/DemandDetail',
  },
  {
    // 需求列表 - 带参数的要放前边
    path: `${prefix}/DemandInfo/:params`,
    component: './pmsPage/DemandInfo',
  },
  {
    // 需求列表
    path: `${prefix}/DemandInfo`,
    component: './pmsPage/DemandInfo',
  },
  {
    // 关系图谱
    path: `${prefix}/RealtivePicture`,
    component: './pmsPage/RealtivePicture',
  },
  {
    //人员信息
    path: `${prefix}/MemberInfo/:params`,
    component: './pmsPage/MemberInfo',
  },
  {
    //人员信息
    path: `${prefix}/MemberInfo`,
    component: './pmsPage/MemberInfo',
  },
  {
    //外包人员详情
    path: `${prefix}/MemberDetail/:params`,
    component: './pmsPage/MemberDetail',
  },
  {
    // 供应商需求页面
    path: `${prefix}/SupplierDmInfo`,
    component: './pmsPage/SupplierDmInfo',
  },
  {
    // 简历分发页面
    path: `${prefix}/ResumeDistribution/:params`,
    component: './pmsPage/ResumeDistribution',
  },
  {
    // 费用列表页面
    path: `${prefix}/ExpenseInfo/:params`,
    component: './pmsPage/ExpenseInfo',
  },
  {
    // 费用列表页面
    path: `${prefix}/ExpenseInfo`,
    component: './pmsPage/ExpenseInfo',
  },
  {
    // 考勤列表页面
    path: `${prefix}/AttendanceListInfo/:params`,
    component: './pmsPage/AttendanceListInfo',
  },
  {
    // 考勤列表页面
    path: `${prefix}/AttendanceListInfo`,
    component: './pmsPage/AttendanceListInfo',
  },
  {
    // 项目跟踪页面
    path: `${prefix}/ProjectTracking`,
    component: './pmsPage/ProjectTracking',
  },
  {
    // 月度考核
    path: `${prefix}/MonthlyAssessment`,
    component: './pmsPage/MonthlyAssessment',
  },
  {
    // 自定义报表 - 报表管理
    path: `${prefix}/CustomRptManagement/:params`,
    component: './pmsPage/CustomRptManagement',
  },
  {
    // 自定义报表 - 报表管理
    path: `${prefix}/CustomRptManagement`,
    component: './pmsPage/CustomRptManagement',
  },
  {
    // 自定义报表 - 我的报表
    path: `${prefix}/CustomReports`,
    component: './pmsPage/CustomReports',
  },
  {
    // 自定义报表 - 报表详情  - 带参数的要放前边
    path: `${prefix}/CustomRptInfo/:params`,
    component: './pmsPage/CustomRptInfo',
  },
  {
    // 自定义报表 - 报表详情
    path: `${prefix}/CustomRptInfo`,
    component: './pmsPage/CustomRptInfo',
  },
  {
    // 自定义报告 - 列表  - 带参数的要放前边
    path: `${prefix}/CustomReportInfo/:params`,
    component: './pmsPage/CustomReportInfo',
  },
  {
    // 自定义报告 - 列表
    path: `${prefix}/CustomReportInfo`,
    component: './pmsPage/CustomReportInfo',
  },
  {
    // 自定义报告 - 详情  - 带参数的要放前边
    path: `${prefix}/CustomReportDetail/:params`,
    component: './pmsPage/CustomReportDetail',
  },
  {
    // 自定义报告 - 详情
    path: `${prefix}/CustomReportDetail`,
    component: './pmsPage/CustomReportDetail',
  },
  {
    // 项目列表
    path: `${prefix}/ProjectStatisticsInfo/:params`,
    component: './pmsPage/ProjectStatisticsInfo',
  },
  {
    // 项目列表
    path: `${prefix}/ProjectStatisticsInfo`,
    component: './pmsPage/ProjectStatisticsInfo',
  },
  {
    // 项目列表-按阶段分
    path: `${prefix}/ProjectStateInfo/:params`,
    component: './pmsPage/ProjectStateInfo',
  },
  {
    // 项目列表-按阶段分
    path: `${prefix}/ProjectStateInfo`,
    component: './pmsPage/ProjectStateInfo',
  },
  {
    // 项目人员/部门统计
    path: `${prefix}/ProjectMemberStatisticsInfo`,
    component: './pmsPage/ProjectMemberStatisticsInfo',
  },
  {
    // 统计分析 - 预算统计
    path: `${prefix}/BudgetStatistic/:params`,
    component: './pmsPage/BudgetStatistic',
  },
  {
    // 统计分析 - 预算统计
    path: `${prefix}/BudgetStatistic`,
    component: './pmsPage/BudgetStatistic',
  },
  {
    // 统计分析 - 考勤统计
    path: `${prefix}/AttendanceStatistic`,
    component: './pmsPage/AttendanceStatistic',
  },
  {
    // 测试页面
    path: `${prefix}/TestPage`,
    component: './pmsPage/TestPage',
  },
  {
    // 信委会议案上会审批
    path: `${prefix}/XwhExamine`,
    component: './pmsPage/XwhExamine',
  },
  {
    // 知识产权列表
    path: `${prefix}/IntelProperty/:params`,
    component: './pmsPage/IntelProperty',
  },
  {
    // 知识产权列表
    path: `${prefix}/IntelProperty`,
    component: './pmsPage/IntelProperty',
  },
  {
    // 获奖荣誉列表
    path: `${prefix}/AwardHonor/:params`,
    component: './pmsPage/AwardHonor',
  },
  {
    // 获奖荣誉列表
    path: `${prefix}/AwardHonor`,
    component: './pmsPage/AwardHonor',
  },
  {
    // 信创合同列表
    path: `${prefix}/InnovationContract/:params`,
    component: './pmsPage/InnovationContract',
  },
  {
    // 信创合同列表
    path: `${prefix}/InnovationContract`,
    component: './pmsPage/InnovationContract',
  },
  {
    // 信创合同编辑
    path: `${prefix}/InnovationContractEdit/:params`,
    component: './pmsPage/InnovationContractEdit',
  },
  {
    // 信创合同查看
    path: `${prefix}/InnovationContractView/:params`,
    component: './pmsPage/InnovationContractView',
  },
  {
    // 文档模板库
    path: `${prefix}/DocTemplateLib`,
    component: './pmsPage/DocTemplateLib',
  },
  {
    // 人员互评
    path: `${prefix}/MutualEvaluation/:params`,
    component: './pmsPage/MutualEvaluation',
  },
  {
    // 人员互评
    path: `${prefix}/MutualEvaluation`,
    component: './pmsPage/MutualEvaluation',
  },
  {
    // 人员评价统计
    path: `${prefix}/MutualEvaluationSituation/:params`,
    component: './pmsPage/MutualEvaluationSituation',
  },
  {
    // 人员评价统计
    path: `${prefix}/MutualEvaluationSituation`,
    component: './pmsPage/MutualEvaluationSituation',
  },
  {
    // 统计分析 - 预算结转
    path: `${prefix}/BudgetCarryover/:params`,
    component: './pmsPage/BudgetCarryover',
  },
  {
    // 统计分析 - 预算结转
    path: `${prefix}/BudgetCarryover`,
    component: './pmsPage/BudgetCarryover',
  },
  {
    // 预算结转 - 预算填报
    path: `${prefix}/BudgetSubmit/:params`,
    component: './pmsPage/BudgetSubmit',
  },
  {
    // 预算结转 - 预算填报
    path: `${prefix}/BudgetSubmit`,
    component: './pmsPage/BudgetSubmit',
  },
  {
    // 统计分析 - 预算录入
    path: `${prefix}/BudgetInput/:params`,
    component: './pmsPage/BudgetInput',
  },
  {
    // 统计分析 - 预算录入
    path: `${prefix}/BudgetInput`,
    component: './pmsPage/BudgetInput',
  },
  {
    // 预算详情
    path: `${prefix}/BudgetDetail/:params`,
    component: './pmsPage/BudgetDetail',
  },
];
