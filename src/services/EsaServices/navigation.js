import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  esa: {
    queryWorkMenuClass,
    queryWorkMenuConf,
    operateWorkMenuAgent,
    queryExamResultTabList,
    operateExamMenuExecFinish,
    operateExamExec,
    operateExamManualLvlAdj,
    operateExamFinish,
    queryExamIndiDetl,
    queryPayCalSts,
    queryPayLineUpQry,
    queryPayTrailExec,
    queryTrailFinish,
    queryPaymentSettlementAuditProgress,
    queryPaymentSettlementAuditStepDetail,
    queryCheckPayment,
    operatePayMenuExecFinish,
    operatePayTrialApply,
    operatePaySettlementApply,
    operatePaySettlementRollBack,
    operateCheckSalaryList,
    queryStaffSalaryForm,
    staffSalaryFormCodeInfo,
    proCalProc,
    queryEmpPayCalcFmla,
  } } = api;

// 查询业务工作导航菜单分类
export async function FetchqueryWorkMenuClass(payload = {}) {
  const option = {
    url: queryWorkMenuClass,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 业务工作导航菜单-查询
export async function FetchqueryWorkMenuConf(payload = {}) {
  const option = {
    url: queryWorkMenuConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 业务工作导航菜单待办
export async function FetchoperateWorkMenuAgent(payload = {}) {
  const option = {
    url: operateWorkMenuAgent,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 考核计算结果-列表查询
export async function FetchqueryExamResultTabList(payload = {}) {
  const option = {
    url: queryExamResultTabList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 考核前待办完成情况判断
export async function FetchoperateExamMenuExecFinish(payload = {}) {
  const option = {
    url: operateExamMenuExecFinish,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 级别计算操作
export async function FetchoperateExamExec(payload = {}) {
  const option = {
    url: operateExamExec,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 手动级别调整
export async function FetchoperateExamManualLvlAdj(payload = {}) {
  const option = {
    url: operateExamManualLvlAdj,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 完成级别考核
export async function FetchoperateExamFinish(payload = {}) {
  const option = {
    url: operateExamFinish,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 考核指标明细-列表查询
export async function FetchqueryExamIndiDetl(payload = {}) {
  const option = {
    url: queryExamIndiDetl,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬计算状态-查询
export async function FetchqueryPayCalSts(payload = {}) {
  const option = {
    url: queryPayCalSts,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬计算排队中信息-查询
export async function FetchqueryPayLineUpQry(payload = {}) {
  const option = {
    url: queryPayLineUpQry,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬计算试算中信息-查询
export async function FetchqueryPayTrailExec(payload = {}) {
  const option = {
    url: queryPayTrailExec,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬计算试算完成信息-查询
export async function FetchqueryTrailFinish(payload = {}) {
  const option = {
    url: queryTrailFinish,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬计算结算审批进度-查询
export async function FetchqueryPaymentSettlementAuditProgress(payload = {}) {
  const option = {
    url: queryPaymentSettlementAuditProgress,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬计算结算审批步骤明细查询
export async function FetchqueryPaymentSettlementAuditStepDetail(payload = {}) {
  const option = {
    url: queryPaymentSettlementAuditStepDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询核对薪酬列表
export async function FetchqueryCheckPayment(payload = {}) {
  const option = {
    url: queryCheckPayment,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬前待办完成情况判断
export async function FetchoperatePayMenuExecFinish(payload = {}) {
  const option = {
    url: operatePayMenuExecFinish,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 试算申请
export async function FetchoperatePayTrialApply(payload = {}) {
  const option = {
    url: operatePayTrialApply,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 结算申请
export async function FetchoperatePaySettlementApply(payload = {}) {
  const option = {
    url: operatePaySettlementApply,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 结算回退
export async function FetchoperatePaySettlementRollBack(payload = {}) {
  const option = {
    url: operatePaySettlementRollBack,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 核对薪酬操作
export async function FetchoperateCheckSalaryList(payload = {}) {
  const option = {
    url: operateCheckSalaryList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员薪酬模板查询
export async function FetchqueryStaffSalaryForm(payload = {}) {
  const option = {
    url: queryStaffSalaryForm,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员薪酬模版指标详情
export async function FetchstaffSalaryFormCodeInfo(payload = {}) {
  const option = {
    url: staffSalaryFormCodeInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 过程调过程
export async function FetchproCalProc(payload = {}) {
  const option = {
    url: proCalProc,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员薪酬模版计算公式
export async function FetchqueryEmpPayCalcFmla(payload = {}) {
  const option = {
    url: queryEmpPayCalcFmla,
    method: 'post',
    data: payload,
  };
  return request(option);
}
