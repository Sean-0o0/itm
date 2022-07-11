export default [
  // mot预警(督导)，因子维护
  { code: '509601', key: 'motFactorMaintenance', url: '/motconfig/v1/motFactorMaintenance', dis: 'MOT-因子维护-因子维护' },
  { code: '509602', key: 'queryMotFactorInfo', url: '/motconfig/v1/queryMotFactorInfo', dis: 'MOT-因子维护-因子信息查询' },
  { code: '509603', key: 'queryMotFactorTree', url: '/motconfig/v1/queryMotFactorTree', dis: 'MOT-因子维护-因子树' },
  { code: '509605', key: 'motFactorCheck', url: '/motconfig/v1/motFactorCheck', dis: 'MOT-因子维护-因子检验' },

  // mot预警(督导)，事件定义
  { code: '509701', key: 'queryMotEventInfo', url: '/motconfig/v1/queryMotEventInfo', dis: '查询MOT事件信息' },
  { code: '509702', key: 'queryMotEventTree', url: '/motconfig/v1/queryMotEventTree', dis: '事件树查询' },
  { code: '509703', key: 'queryAvailableIndex', url: '/motconfig/v1/queryAvailableIndex', dis: 'MOT-事件定义-内容模板定义页面可选指标查询' },
  { code: '509705', key: 'eventMaintenance', url: '/motconfig/v1/eventMaintenance', dis: 'MOT-事件定义-事件维护' },
  { code: '509716', key: 'queryEventImportDetail', url: '/motconfig/v1/queryEventImportDetail', dis: 'MOT-事件定义-查询事件导入明细' },

  // mot预警(督导)，分组设置
  { code: '509803', key: 'queryScheduleGroupTree', url: '/motconfig/v1/queryScheduleGroupTree', dis: 'MOT配置-查询调度分组树信息' },
  { code: '509804', key: 'queryScheduleDescription', url: '/motconfig/v1/queryScheduleDescription', dis: '获取调度信息描述' },
  { code: '509805', key: 'scheduleGroupMaintenance', url: '/motconfig/v1/scheduleGroupMaintenance', dis: 'MOT配置-调度分组维护' },
  { code: '509806', key: 'scheduleInfoMaintenance', url: '/motconfig/v1/scheduleInfoMaintenance', dis: '调度频率维护' },
  { code: '509807', key: 'queryScheduleGroupTaskList', url: '/motconfig/v1/queryScheduleGroupTaskList', dis: '查询调度任务明细' },
  { code: '509808', key: 'scheduleDateTypeMaintenance', url: '/motconfig/v1/scheduleDateTypeMaintenance', dis: '调度时间类型维护' },
  { code: '509809', key: 'scheduleGroupTaskMaintenance', url: '/motconfig/v1/scheduleGroupTaskMaintenance', dis: '分组任务维护' },
  { code: '509810', key: 'queryScheduleGroupOptionalEvent', url: '/motconfig/v1/queryScheduleGroupOptionalEvent', dis: '查询分组任务可选事件' },

  // mot预警(督导)，分组监控
  { code: '509801', key: 'queryScheduleGroupList', url: '/motconfig/v1/queryScheduleGroupList', dis: 'MOT配置-查询调度任务明细' },
  { code: '509813', key: 'queryScheduleCheck', url: '/motconfig/v1/scheduleCheck', dis: 'MOT配置-引擎启动校验' },
  { code: '509816', key: 'oracleScheduleCompute', url: '/motconfig/v1/oracleScheduleCompute', dis: 'MOT配置-MOT调度计算（Oracle）' },
  { code: '509815', key: 'manualUpdateStatus', url: '/motconfig/v1/manualUpdateStatus', dis: 'MOT配置-更新分组状态（手动）' },
  

  // 督导名单管理
  { code: '531102', key: 'querySuperviseBasicInformation', url: '/motsupervise/v1/querySuperviseBasicInformation', dis: '督导名单管理-查询督导基本信息' },
  { code: '531101', key: 'querySuperviseStaffDetail', url: '/motsupervise/v1/querySuperviseStaffDetail', dis: '督导名单管理-查询督导名单明细' },
  { code: '531104', key: 'querySuperviseMessageTemplate', url: '/motsupervise/v1/querySuperviseMessageTemplate', dis: '督导名单管理-查询督导消息通知模板' },

  { code: '531105', key: 'querySuperviseTaskList', url: '/motsupervise/v1/querySuperviseTaskList', dist: '查询督导任务列表'},
  { code: '531106', key: 'querySuperviseTaskStaffDetail', url: '/motsupervise/v1/querySuperviseTaskStaffDetail', dist: '查询督导任务名单'},
  { code: '531103', key: 'superviseTaskMaintenance', url: '/motsupervise/v1/superviseTaskMaintenance', dist: '督导任务维护'},





  




  { code: '', key: 'motSameBatchList', url: '/motconfig/v1/motSameBatchList', dis: 'MOT同批次任务列表' },
  { code: '509802', key: 'queryScheduleGroupTaskList', url: '/motconfig/v1/queryScheduleGroupTaskList', dis: 'MOT配置-查询调度任务明细' },
  { code: '509906', key: 'queryCurrentEngineIp', url: '/motconfig/v1/queryCurrentEngineIp', dis: 'MOT配置-查询当前MOT引擎服务器地址' },
  { code: '509604', key: 'queryStreamTable', url: '/motconfig/v1/queryStreamTable', dis: 'MOT-因子维护-获取流数据表' },
  { code: '509723', key: 'checkFactor', url: '/motconfig/v1/checkFactor', dis: 'MOT-因子维护-sparkMot引擎校验' },
  { code: '', key: 'userAuthorityDepartment', url: '/commonbase/v1/userAuthorityDepartment', dis: '查询可选营业部' },
  { code: '509713', key: 'queryMessageStrategy', url: '/motconfig/v1/queryMessageStrategy', dis: 'MOT配置-查询消息策略' },
  { code: '509714', key: 'queryMessageStrategyDisplayChannel', url: '/motconfig/v1/queryMessageStrategyDisplayChannel', dis: 'MOT配置-查询消息策略默认显示渠道' },
  { code: '509712', key: 'queryMessageColumn', url: '/motconfig/v1/queryMessageColumn', dis: 'MOT配置-查询消息栏目' },

  { code: '509706', key: 'motEventOrganizationVariableMaintenance', url: '/motconfig/v1/motEventOrganizationVariableMaintenance', dis: 'MOT配置-营业部事件维护' },
  { code: '509708', key: 'queryStaffMotEventInfo', url: '/motconfig/v1/queryStaffMotEventInfo', dis: 'MOT配置-查询员工事件定义' },
  { code: '509711', key: 'queryMyCustomer', url: '/motconfig/v1/queryMyCustomer', dis: 'MOT配置-查询我的客户' },

  { code: '509717', key: 'queryStaffInfo', url: '/motconfig/v1/queryStaffInfo', dis: '获取登录员工信息' },
  { code: '509707', key: 'motEventStaffVariableMaintenance', url: '/motconfig/v1/motEventStaffVariableMaintenance', dis: '员工事件维护' },
  { code: '509709', key: 'motEventStaffVariableDelete', url: '/motconfig/v1/motEventStaffVariableDelete', dis: '删除员工设置参数件维护' },
  { code: '509704', key: 'queryCalculateRule', url: '/motconfig/v1/queryCalculateRule', dis: '查询计算规则' },

  { code: '509807', key: 'scheduleGroupPostTreatmentScriptMaintenance', url: '/motconfig/v1/scheduleGroupPostTreatmentScriptMaintenance', dis: '调度时间类型维护' },

  { code: '509901', key: 'queryConnectionUrlExample', url: '/motconfig/v1/queryConnectionUrlExample', dis: '查询连接URL示例' },
  { code: '509902', key: 'queryStreamTableConfiguration', url: '/motconfig/v1/queryStreamTableConfiguration', dis: '查询流数据表配置' },
  { code: '509903', key: 'queryStreamTableConfigurationList', url: '/motconfig/v1/queryStreamTableConfigurationList', dis: '查询流数据表配置列表' },
  { code: '509904', key: 'streamTableConfigurationMaintenance', url: '/motconfig/v1/streamTableConfigurationMaintenance', dis: 'MOT配置-流数据表配置维护' },
  { code: '509905', key: 'streamTableStatusUpdate', url: '/motconfig/v1/streamTableStatusUpdate', dis: 'MOT配置-流数据表状态更新' },

  { code: '509817', key: 'startGroupTasks', url: '/motconfig/v1/startGroupTasks', dis: 'SparkMot引擎-分组启动' },

  { code: '509818', key: 'stopGroupTasks', url: '/motconfig/v1/stopGroupTasks', dis: 'SparkMot引擎-分组停止' },
  { code: '509819', key: 'startTaskTask', url: '/motconfig/v1/startTaskTask', dis: 'SparkMot引擎-启动单个任务' },
  { code: '509820', key: 'stopTask', url: '/motconfig/v1/stopTask', dis: 'SparkMot引擎-关闭单个任务' },
  { code: '509821', key: 'getLog', url: '/motconfig/v1/getLog', dis: 'SparkMot引擎-查看分组日志和分组任务日志' },
  { code: '509715', key: 'queryMessageStrategySelectionChannel', url: '/motconfig/v1/queryMessageStrategySelectionChannel', dis: 'MOT-事件定义-查询消息策略可选渠道' },
  { code: '509710', key: 'queryData', url: '/motconfig/v1/queryData', dis: 'MOT-事件定义-查询变量可选值' },
  { code: '509718', key: 'motDataImport', url: '/motconfig/v1/motDataImport', dis: 'MOT-事件定义-导入Excel' },
  { code: '509908', key: 'kafkaConnect', url: '/motconfig/v1/kafkaConnect', dis: '调用kafka connect接口' },
  { code: '509907', key: 'queryStreamTableDataType', url: '/motconfig/v1/queryStreamTableDataType', dis: 'MOT配置-查询流表数据类型' },
  { code: '509909', key: 'refreshStatus', url: '/motconfig/v1/refreshStatus', dis: '更新状态' },
  { code: '531104', key: 'queryMotUrl', url: '/motconfig/v1/queryMotUrl', dis: '获取引擎控制台、CDH、YARN、SPARK页面地址' },
  { code: '', key: 'stopMotSchd', url: '/motconfig/v1/stopMotSchd', dis: '更新分组调度状态' },


  { code: '531108', key: 'queryStaffSuperviseTaskList', url: '/motsupervise/v1/queryStaffSuperviseTaskList', dis: '查询员工督导任务列表' },
  { code: '531107', key: 'queryStaffSuperviseTaskSituationStatistics', url: '/motsupervise/v1/queryStaffSuperviseTaskSituationStatistics', dis: '员工督导任务情况统计' },
  { code: '531109', key: 'staffSuperviseTaskComplete', url: '/motsupervise/v1/StaffSuperviseTaskComplete', dis: '员工督导任务办结' },
  { code: '531110', key: 'queryStaffSuperviseTaskTotalStatistics', url: '/motsupervise/v1/queryStaffSuperviseTaskTotalStatistics', dis: '员工督导任务情况统计（近6月)' },
  { code: '531111', key: 'queryStaffSuperviseTaskListDetail', url: '/motsupervise/v1/queryStaffSuperviseTaskListDetail', dis: '员工督导任务列表（明细）' },

  { code: '531104', key: 'superviseTaskMaintenance', url: '/motsupervise/v1/superviseTaskMaintenance', dis: '督导名单管理-督导任务维护' },
];
