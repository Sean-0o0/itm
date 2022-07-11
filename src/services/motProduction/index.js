import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { motProduction: {
  // mot因子维护相关接口
  motFactorMaintenance,queryMotFactorInfo,queryMotFactorTree,motFactorCheck,
  // mot事件定义相关接口
  queryEventImportDetail, queryMotEventTree, queryMotEventInfo, eventMaintenance, queryAvailableIndex,
  // mot分组设置相关接口
  queryScheduleGroupTree, scheduleGroupMaintenance, scheduleDateTypeMaintenance, queryScheduleDescription, scheduleInfoMaintenance, queryScheduleGroupOptionalEvent, queryScheduleGroupTaskList, scheduleGroupTaskMaintenance,
  // mot分组监控相关接口
  queryScheduleGroupList,queryScheduleCheck,oracleScheduleCompute,manualUpdateStatus,
  //督导名单管理相关接口
  querySuperviseBasicInformation, querySuperviseStaffDetail, querySuperviseMessageTemplate,
  querySuperviseTaskList, querySuperviseTaskStaffDetail, superviseTaskMaintenance,
  
  motSameBatchList, queryCurrentEngineIp, queryStreamTable, userAuthorityDepartment, queryMessageStrategy,
  queryMessageStrategyDisplayChannel, queryMessageColumn, motEventOrganizationVariableMaintenance, checkFactor, queryStaffMotEventInfo, queryMyCustomer,
  queryMessageStrategySelectionChannel, queryData, 
  queryStaffInfo, motEventStaffVariableMaintenance, motEventStaffVariableDelete, queryCalculateRule, queryStreamTableConfigurationList, queryConnectionUrlExample, queryStreamTableConfiguration,
  startGroupTasks, streamTableConfigurationMaintenance, streamTableStatusUpdate,
  scheduleGroupPostTreatmentScriptMaintenance,
  stopGroupTasks,startTaskTask, stopTask, getLog, kafkaConnect, queryStreamTableDataType, refreshStatus,stopMotSchd,
  queryStaffSuperviseTaskList, queryStaffSuperviseTaskSituationStatistics, queryStaffSuperviseTaskTotalStatistics,
  queryStaffSuperviseTaskListDetail,staffSuperviseTaskComplete,
   queryMotUrl,queryShortMessageChannel
} } = api;


// MOT-因子维护相关接口 START--------------------------------------
// MOT-因子维护-因子维护
export async function FetchMotFactorMaintenance(payload) {
  const option = {
    url: motFactorMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-因子维护-因子信息查询
export async function FetchQueryMotFactorInfo(payload) {
  const option = {
    url: queryMotFactorInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-因子维护-因子树
export async function FetchQueryMotFactorTree(payload) {
  const option = {
    url: queryMotFactorTree,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-因子维护-因子检验
export async function FetchMotFactorCheck(payload) {
  const option = {
    url: motFactorCheck,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-因子维护相关接口 END--------------------------------------

// MOT-事件定义相关接口 START----------------------
// MOT-事件定义-查询事件导入明细
export async function FetchqueryEventImportDetail(payload) {
  const option = {
    url: queryEventImportDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 事件树查询
export async function FetchqueryMotEventTree(payload) {
  const option = {
    url: queryMotEventTree,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询MOT事件信息
export async function FetchqueryMotEventInfo(payload) {
  const option = {
    url: queryMotEventInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-事件定义-事件维护
export async function FetcheventMaintenance(payload) {
  const option = {
    url: eventMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-事件定义-内容模板定义页面可选指标查询
export async function FetchqueryAvailableIndex(payload) {
  const option = {
    url: queryAvailableIndex,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-事件定义相关接口 END----------------------

// mot分组设置相关接口 START----------------------
// MOT配置-查询调度分组树信息
export async function FetchQueryScheduleGroupTree(payload) {
  const option = {
    url: queryScheduleGroupTree,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT配置-调度分组维护
export async function FetchScheduleGroupMaintenance(payload) {
  const option = {
    url: scheduleGroupMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 调度时间类型维护
export async function FetchscheduleDateTypeMaintenance(payload) {
  const option = {
    url: scheduleDateTypeMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取调度信息描述
export async function FetchqueryScheduleDescription(payload) {
  const option = {
    url: queryScheduleDescription,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 调度频率维护
export async function FetchscheduleInfoMaintenance(payload) {
  const option = {
    url: scheduleInfoMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询分组任务可选事件
export async function FetchqueryScheduleGroupOptionalEvent(payload) {
  const option = {
    url: queryScheduleGroupOptionalEvent,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT配置-查询调度任务明细
export async function FetchQueryScheduleGroupTaskList(payload) {
  const option = {
    url: queryScheduleGroupTaskList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//分组任务维护
export async function FetchscheduleGroupTaskMaintenance(payload) {
  const option = {
    url: scheduleGroupTaskMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// mot分组设置相关接口 END

// mot分组监控相关接口 START----------------------
// MOT配置-查询调度任务明细
export async function FetchQueryScheduleGroupList(payload) {
  const option = {
    url: queryScheduleGroupList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT配置-引擎启动校验
export async function FetchQueryScheduleCheck(payload) {
  const option = {
    url: queryScheduleCheck,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT配置-MOT调度计算（Oracle）
export async function FetchOracleScheduleCompute(payload) {
  const option = {
    url: oracleScheduleCompute,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT配置-更新分组状态（手动）
export async function FetchManualUpdateStatus(payload) {
  const option = {
    url: manualUpdateStatus,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// mot分组监控相关接口 END-----------------------------------------



//督导名单管理相关接口 START-----------------------------------------
// 督导名单管理-查询督导基本信息
export async function FetchquerySuperviseBasicInformation(payload) {
  const option = {
    url: querySuperviseBasicInformation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 督导名单管理-查询督导名单明细
export async function FetchquerySuperviseStaffDetail(payload) {
  const option = {
    url: querySuperviseStaffDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 督导名单管理-查询督导消息通知模板
export async function FetchquerySuperviseMessageTemplate(payload) {
  const option = {
    url: querySuperviseMessageTemplate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//督导任务管理-查询督导任务列表
export async function FetchQuerySuperviseTaskList(payload) {
  const option = {
    url: querySuperviseTaskList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//督导任务管理-查询督导任务名单
export async function FetchQuerySuperviseTaskStaffDetail(payload) {
  const option = {
    url: querySuperviseTaskStaffDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//督导任务管理-督导任务维护
export async function FetchSuperviseTaskMaintenance(payload) {
  const option = {
    url: superviseTaskMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//督导名单管理相关接口 END-----------------------------------------
















// MOT指派
export async function FetchMotSameBatchList(payload) {
  const option = {
    url: motSameBatchList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询可选营业部
export async function FetchuserAuthorityDepartment(payload) {
  const option = {
    url: userAuthorityDepartment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询消息策略
export async function FetchqueryMessageStrategy(payload) {
  const option = {
    url: queryMessageStrategy,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询消息策略默认显示渠道
export async function FetchqueryMessageStrategyDisplayChannel(payload) {
  const option = {
    url: queryMessageStrategyDisplayChannel,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 查询消息栏目
export async function FetchqueryMessageColumn(payload) {
  const option = {
    url: queryMessageColumn,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 营业部事件维护
export async function FetchmotEventOrganizationVariableMaintenance(payload) {
  const option = {
    url: motEventOrganizationVariableMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}



// mot分组监控相关接口


// MOT配置-查询当前MOT引擎服务器地址
export async function FetchQueryCurrentEngineIp(payload) {
  const option = {
    url: queryCurrentEngineIp,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// SparkMot引擎-分组启动
export async function FetchStartGroupTasks(payload) {
  const option = {
    url: startGroupTasks,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// SparkMot引擎-分组停止
export async function FetchStopGroupTasks(payload) {
  const option = {
    url: stopGroupTasks,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// SparkMot引擎-启动单个任务
export async function FetchStartTaskTask(payload) {
  const option = {
    url: startTaskTask,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// SparkMot引擎-关闭单个任务
export async function FetchStopTask(payload) {
  const option = {
    url: stopTask,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT监控-更新分组调度状态
export async function FetchStopMotSchd(payload) {
  const option = {
    url: stopMotSchd,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// SparkMot引擎-查看分组日志和分组任务日志
export async function FetchGetLog(payload) {
  const option = {
    url: getLog,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT-因子维护-获取流数据表
export async function FetchQueryStreamTable(payload) {
  const option = {
    url: queryStreamTable,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT-因子维护-sparkMot引擎校验
export async function FetchCheckFactor(payload) {
  const option = {
    url: checkFactor,
    method: 'post',
    data: payload,
  };
  return request(option);
}





// MOT-查询员工事件定义
export async function FetchqueryStaffMotEventInfo(payload) {
  const option = {
    url: queryStaffMotEventInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT-查询我的客户
export async function FetchqueryMyCustomer(payload) {
  const option = {
    url: queryMyCustomer,
    method: 'post',
    data: payload,
  };
  return request(option);
}







//获取登录员工信息
export async function FetchqueryStaffInfo(payload) {
  const option = {
    url: queryStaffInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//员工事件维护
export async function FetchmotEventStaffVariableMaintenance(payload) {
  const option = {
    url: motEventStaffVariableMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//删除员工设置参数
export async function FetchmotEventStaffVariableDelete(payload) {
  const option = {
    url: motEventStaffVariableDelete,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//删除员工设置参数
export async function FetchqueryCalculateRule(payload) {
  const option = {
    url: queryCalculateRule,
    method: 'post',
    data: payload,
  };
  return request(option);
}


//调度频率维护
export async function FetchscheduleGroupPostTreatmentScriptMaintenance(payload) {
  const option = {
    url: scheduleGroupPostTreatmentScriptMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}





// 查询流数据表配置列表
export async function FetchQueryStreamTableConfigurationList(payload) {
  const option = {
    url: queryStreamTableConfigurationList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询连接URL示例
export async function FetchQueryConnectionUrlExample(payload) {
  const option = {
    url: queryConnectionUrlExample,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询流数据表配置
export async function FetchQueryStreamTableConfiguration(payload) {
  const option = {
    url: queryStreamTableConfiguration,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT配置-流数据表配置维护
export async function FetchStreamTableConfigurationMaintenance(payload) {
  const option = {
    url: streamTableConfigurationMaintenance,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT配置-流数据表状态更新
export async function FetchStreamTableStatusUpdate(payload) {
  const option = {
    url: streamTableStatusUpdate,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询消息策略可选渠道
export async function FetchqueryMessageStrategySelectionChannel(payload) {
  const option = {
    url: queryMessageStrategySelectionChannel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// MOT-事件定义-查询变量可选值
export async function FetchqueryData(payload) {
  const option = {
    url: queryData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// KafkaConnect
export async function FetchKafkaConnect(payload) {
  const option = {
    url: kafkaConnect,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT配置-查询流表数据类型
export async function FetchQueryStreamTableDataType(payload) {
  const option = {
    url: queryStreamTableDataType,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT配置-刷新状态
export async function FetchRefreshStatus(payload) {
  const option = {
    url: refreshStatus,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 查询督导任务列表
export async function FetchQueryStaffSuperviseTaskList(payload) {
  const option = {
    url: queryStaffSuperviseTaskList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 员工督导任务情况统计
export async function FetchQueryStaffSuperviseTaskSituationStatistics(payload) {
  const option = {
    url: queryStaffSuperviseTaskSituationStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 员工督导任务情况统计（近6月)
export async function FetchQueryStaffSuperviseTaskTotalStatistics(payload) {
  const option = {
    url: queryStaffSuperviseTaskTotalStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 员工督导任务列表（明细）
export async function FetchQueryStaffSuperviseTaskListDetail(payload) {
  const option = {
    url: queryStaffSuperviseTaskListDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 员工督导任务列表（明细）
export async function FetchStaffSuperviseTaskComplete(payload) {
  const option = {
    url: staffSuperviseTaskComplete,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// MOT监控-获取引擎控制台、CDH、YARN、SPARK页面地址
export async function FetchQueryMotUrl(payload) {
  const option = {
    url: queryMotUrl,
    method: 'post',
    data: payload,
  };
  return request(option);
}

