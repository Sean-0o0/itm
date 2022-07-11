const prefix = '/motcfg';
exports.routes = [
  // {
  //   path: `${prefix}/`,
  //   models: () => [
  //     import('../models/workPlatForm/mainPage'),
  //   ],
  //   component: '../layouts/workPlatForm/PageLayout',
  //   routes: [
  {
    path: `${prefix}/motFactorIndex`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTFactorIndex',
  },
  {
    path: `${prefix}/motEventIndex`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTEventIndex',
  },
  {
    path: `${prefix}/dispatchIndex`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/DISPatchIndex',
  },
  {
    path: `${prefix}/distributeStreamTableConfig`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/DIStributeStreamTableConfig',
  },
  {
    path: `${prefix}/yybMotDefineIndex`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/YybMotDefineIndex',
  },
  {
    path: `${prefix}/ryMotDefineIndex`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/RyMotDefineIndex',
  },
  {
    path: `${prefix}/groupDefinedIndex`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTGroupDefinedIndex',
  },
  {
    path: `${prefix}/motMonitoring`,
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTMonitoring',
  },
  {
    path: `${prefix}/supervisorListIndex`,  // 督导名单管理
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTSupervisorListIndex',
  },
  {
    path: `${prefix}/supervisorTaskIndex`,  // 督导任务管理
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTSupervisorTaskIndex',
  },
  {
    path: `${prefix}/employeeExecutionOneIndex`,  // 员工执行页面-1
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTEmployeeExecutionOneIndex',
  },
  {
    path: `${prefix}/employeeExecutionTwoIndex`,  // 员工执行页面-2
    //exact: false,
    // models: () => [import('../models/workPlatForm/mainPage/mot/motEvent')],
    component: './workPlatForm/mainPage/motProduction/MOTEmployeeExecutionTwoIndex',
  },
  //   ]
  // }
]
