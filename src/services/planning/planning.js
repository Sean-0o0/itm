import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { planning: {
  queryAssessTrackPlanDetail,
  queryLegalNote,
  queryOrgList,
  queryIndiList,
  addFuncAssessPlan,
  queryAssessTrackPlanIndiSched,
  queryOptList,
  queryOptionRela,
  queryAssessPlanBusDetail,
  queryHisAssessPlanBusDetail,
  queryOptOprAuth,
  queryAssessTrackPlanIndiVal,
  queryTrackIndiOrg,
  queryAssessPlanFuncDetail,
  queryHisAssessPlanFuncDetail,
  queryTrackIndiFirst,
  queryTrackIndiSecond,
  queryTrackIndiThird,
  queryDefIndi,
  queryUserList,//查询人员方案
  queryCompanyPlanYear,
  queryCompanyProfitBudget,
  queryCompanyBusplan,
  grantOption,
  addOption,
  oprOption,
  updateOption,

  deleteOption,
  queryAssessTrackPlan,
  queryHisAssessPlanList,
  addAssessTrackPlan,
  addAssessPlan,
  addAssessPlanLegalNote,
  updateAssessPlan,
  queryCompanyBusplanBreak,
  updateFuncAssessPlan,
  breakCompanyBusplan,
  updateAssessTrackPlan,
  loadAssessPlanData,
  updateOprOption,
  queryAssessPlanList,
  createPlanWord,
  queryBusAnalBusiness,
  queryBusAnalBusinessDetail,
  queryBusAnalBusinessDril,
  queryBusAnalFinanceFirst,
  queryBusAnalFinanceSecond,
  queryFinanceIndexAnalysis,
  queryBusAnalFinanceSecondDril,
  queryAssessPlanWfList,
  queryAssessPlanWfOption,
  queryAssessPlanWfAction,
  auditAssessPlanWf,
  assessPlanWfStart,
  assessPlanOptStart,
  assessPlanRelease,
  queryBusResponList,
  addBusRespon,
  updateBusRespon,
  startBusResponWorkflow,
  queryBusResponDetail,
  queryHisBusResponDetail,
  queryBusResponWfList,
  auditBusResponWorkflow,
  queryBusResponLegalNote,
  queryBusResponOptionRela,
  createPlanWordForBusRespon,
  queryIndustryNews,
  queryAuthorizedRecycling,
  updateAuthorizedRecycling,
  queryResourceAllocation,
  modResourceAllocationDeal,
  queryNewsComment,
  modNewsComment,
  querySpecialPlanZXZB,
  queryDepartmentPlanZFZB,
  queryNewsCateg,
  queryTspecial,
  queryTdepartment,
} } = api;


// 506259 考核方案审批用户可操作按钮查询接口   auditAssessPlanWf
export async function OprateAuditAssessPlanWf(payload) {
  const option = {
    url: auditAssessPlanWf,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506258 考核方案审批用户可操作按钮查询接口
export async function FetchQueryAssessPlanWfAction(payload) {
  const option = {
    url: queryAssessPlanWfAction,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506257 考核方案审批流程意见列表接口  queryAssessPlanWfList
export async function FetchQueryAssessPlanWfOption(payload) {
  const option = {
    url: queryAssessPlanWfOption,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506256 考核方案审批流程  queryAssessPlanWfList
export async function FetchQueryAssessPlanWfList(payload) {
  const option = {
    url: queryAssessPlanWfList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506247 查询考核方案列表 queryAssessPlanList
export async function FetchQueryAssessPlanList(payload) {
  const option = {
    url: queryAssessPlanList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506202 修改业务条线考核方案 updateAssessPlan
export async function FetchUpdateAssessPlan(payload) {
  const option = {
    url: updateAssessPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506242 考核方案法律条文写入 addAssessPlanLegalNote
export async function FetchAddAssessPlanLegalNote(payload) {
  const option = {
    url: addAssessPlanLegalNote,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506201 新增业务条线考核方案 addAssessPlan
export async function FetchAddAssessPlan(payload) {
  const option = {
    url: addAssessPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506220 可选指标列表查询
export async function FetchQueryIndiList(payload) {
  const option = {
    url: queryIndiList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506229 考核跟踪方案明细查看
export async function FetchQueryAssessTrackPlan(payload) {
  const option = {
    url: queryAssessTrackPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506229 考核跟踪方案明细查看
export async function FetchUpdateFuncAssessPlan(payload) {
  const option = {
    url: updateFuncAssessPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506227 考核跟踪方案新增
export async function FetchAddAssessTrackPlan(payload) {
  const option = {
    url: addAssessTrackPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506228 考核跟踪方案修改
export async function FetchUpdateAssessTrackPlan(payload) {
  const option = {
    url: updateAssessTrackPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506230 考核跟踪方案跟踪指标详情
export async function FetchQueryAssessTrackPlanDetail(payload) {
  const option = {
    url: queryAssessTrackPlanDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506239 人员列表
export async function FetchQueryUserList(payload) {
  const option = {
    url: queryUserList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506203 考核方案设计时查询需展示考核说明信息
export async function FetchQueryLegalNote(payload) {
  const option = {
    url: queryLegalNote,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506205 新增业务考核方案默认展示内容
export async function FetchQueryDefIndi(payload) {
  const option = {
    url: queryDefIndi,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506231 考核跟踪方案跟踪指标目标完成进度 planning.v1.queryAssessTrackPlanIndiSched
export async function FetchQueryAssessTrackPlanIndiSched(payload) {
  const option = {
    url: queryAssessTrackPlanIndiSched,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506204 查询组织机构信息
export async function FetchQueryOrgList(payload) {
  const option = {
    url: queryOrgList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506232 考核跟踪方案跟踪指标值变化情况  queryAssessTrackPlanIndiVal
export async function FetchQueryAssessTrackPlanIndiVal(payload) {
  const option = {
    url: queryAssessTrackPlanIndiVal,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506235 考核跟踪方首页各业务指标情况
export async function FetchQueryTrackIndiOrg(payload) {
  const option = {
    url: queryTrackIndiOrg,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506221 新增职能部门考核方案
export async function FetchAddFuncAssessPlan(payload) {
  const option = {
    url: addFuncAssessPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506209 职能部门考核方案明细查看
export async function FetchQueryAssessPlanFuncDetail(payload) {
  const option = {
    url: queryAssessPlanFuncDetail,
    method: 'post',
    data: payload,
  };
  return request(option);

}

// 506209 职能部门考核方案明细查看--查询历史接口
export async function FetchQueryHisAssessPlanFuncDetail(payload) {
  const option = {
    url: queryHisAssessPlanFuncDetail,
    method: 'post',
    data: payload,
  };
  return request(option);

}
//考核跟踪首页
export async function FetchQueryTrackIndiFirst(payload) {
  const option = {
    url: queryTrackIndiFirst,
    method: 'post',
    data: payload
  };
  return request(option)
}
export async function FetchQueryTrackIndiSecond(payload) {
  const option = {
    url: queryTrackIndiSecond,
    method: 'post',
    data: payload
  };
  return request(option)
}
export async function FetchQueryTrackIndiThird(payload) {
  const option = {
    url: queryTrackIndiThird,
    method: 'post',
    data: payload
  };
  return request(option)
}

// 506213 查询意见反馈列表
export async function FetchQueryOptList(payload) {
  const option = {
    url: queryOptList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506206 查询我有权限进行意见反馈的方案
export async function FetchQueryOptionRela(payload) {
  const option = {
    url: queryOptionRela,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506207 业务条线考核方案明细查看
export async function FetchQueryAssessPlanBusDetail(payload) {
  const option = {
    url: queryAssessPlanBusDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506207 业务条线考核方案明细查看---查询历史接口
export async function FetchQueryHisAssessPlanBusDetail(payload) {
  const option = {
    url: queryHisAssessPlanBusDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506212 登录人员意见反馈操作页面按钮权限
export async function FetchQueryOptOprAuth(payload) {
  const option = {
    url: queryOptOprAuth,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506223 查询公司当年规划
export async function FetchQueryCompanyPlanYear(payload) {
  const option = {
    url: queryCompanyPlanYear,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506224 查询公司当年利润预算规划
export async function FetchQueryCompanyProfitBudget(payload) {
  const option = {
    url: queryCompanyProfitBudget,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506225 查询公司经营计划
export async function FetchQueryCompanyBusplan(payload) {
  const option = {
    url: queryCompanyBusplan,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506219 意见反馈授权
export async function GrantOption(payload) {
  const option = {
    url: grantOption,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506221 意见反馈新增
export async function AddOption(payload) {
  const option = {
    url: addOption,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506217 意见反馈新增
export async function OprOption(payload) {
  const option = {
    url: oprOption,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506215 意见反馈修改
export async function UpdateOption(payload) {
  const option = {
    url: updateOption,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506216 意见反馈删除
export async function DeleteOption(payload) {
  const option = {
    url: deleteOption,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506211 查询考核方案历史版本流水
export async function FetchQueryHisAssessPlanList(payload) {
  const option = {
    url: queryHisAssessPlanList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506243 查询公司经营计划分解结果详情
export async function FetchQueryCompanyBusplanBreak(payload) {
  const option = {
    url: queryCompanyBusplanBreak,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 506243 查询公司经营计划分解结果详情
export async function BreakCompanyBusplan(payload) {
  const option = {
    url: breakCompanyBusplan,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506246 导入数据后处理过程
export async function LoadAssessPlanData(payload) {
  const option = {
    url: loadAssessPlanData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506218 意见反馈处理结果修改
export async function UpdateOprOption(payload) {
  const option = {
    url: updateOprOption,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 526401 考核方案word生成
export async function CreatePlanWord(payload) {
  const option = {
    url: createPlanWord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506252 经营分析业务类指标分析
export async function FetchQueryBusAnalBusiness(payload) {
  const option = {
    url: queryBusAnalBusiness,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506253 经营分析业务类指标钻取
export async function FetchQueryBusAnalBusinessDril(payload) {
  const option = {
    url: queryBusAnalBusinessDril,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506254 经营分析业务类指标明细
export async function FetchQueryBusAnalBusinessDetail(payload) {
  const option = {
    url: queryBusAnalBusinessDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506248 经营分析财务类核心指标
export async function FetchQueryBusAnalFinanceFirst(payload) {
  const option = {
    url: queryBusAnalFinanceFirst,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506249 经营分析财务类指标分析
export async function FetchQueryBusAnalFinanceSecond(payload) {
  const option = {
    url: queryBusAnalFinanceSecond,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506256 经营分析财务类指标详情选项信息
export async function FetchQueryFinanceIndexAnalysis(payload) {
  const option = {
    url: queryFinanceIndexAnalysis,
    method: 'post',
    data: payload,
  };
  return request(option);
}

///planning/v1/queryBusAnalFinanceSecondDril
// 506250 经营分析财务类指标分析（可选）指标下钻
export async function FetchQueryBusAnalFinanceSecondDril(payload) {
  const option = {
    url: queryBusAnalFinanceSecondDril,
    method: 'post',
    data: payload,
  };
  return request(option);
}

///planning/v1/assessPlanOptStart
// 506260 考核方案意见征求发起
export async function FetchAssessPlanOptStart(payload) {
  const option = {
    url: assessPlanOptStart,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// planning/v1/assessPlanWfStart
// 506261 考核方案审核流程发起
export async function FetchAssessPlanWfStart(payload) {
  const option = {
    url: assessPlanWfStart,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// planning/v1/assessPlanRelease
// 506262 考核方案发布
export async function FetchAssessPlanRelease(payload) {
  const option = {
    url: assessPlanRelease,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 经营责任书列表相关接口-----------------------------------------------
// 506264 查询经营责任书列表 queryBusResponList
export async function FetchQueryBusResponList(payload) {
  const option = {
    url: queryBusResponList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506265 新增业务条线经营责任书 addBusRespon
export async function FetchAddBusRespon(payload) {
  const option = {
    url: addBusRespon,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506266 修改业务条线经营责任书 updateBusRespon
export async function FetchUpdateBusRespon(payload) {
  const option = {
    url: updateBusRespon,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506267 经营责任书审核流程发起
export async function FetchStartBusResponWorkflow(payload) {
  const option = {
    url: startBusResponWorkflow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506269 经营责任书明细查看
export async function FetchQueryBusResponDetail(payload) {
  const option = {
    url: queryBusResponDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506270 经营责任书历史版本明细查看
export async function FetchQueryHisBusResponDetail(payload) {
  const option = {
    url: queryHisBusResponDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506271 经营责任书审批流程列表
export async function FetchQueryBusResponWfList(payload) {
  const option = {
    url: queryBusResponWfList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506272 经营责任书流程审批操作
export async function FetchAuditBusResponWorkflow(payload) {
  const option = {
    url: auditBusResponWorkflow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506273 经营责任书设计时查询需展示考核说明信息
export async function FetchQueryBusResponLegalNote(payload) {
  const option = {
    url: queryBusResponLegalNote,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506274 查询我有权限进行意见反馈的经营责任书
export async function FetchQueryBusResponOptionRela(payload) {
  const option = {
    url: queryBusResponOptionRela,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506275 责任书方案pdf/word导出
export async function CreatePlanWordForBusRespon(payload) {
  const option = {
    url: createPlanWordForBusRespon,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506275 查询行业动态信息
export async function FetchQueryIndustryNews(payload) {
  const option = {
    url: queryIndustryNews,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询授权人员
export async function FetchQueryAuthorizedRecycling(payload) {
  const option = {
    url: queryAuthorizedRecycling,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//授权回收
export async function UpdateAuthorizedRecycling(payload) {
  const option = {
    url: updateAuthorizedRecycling,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询（根据VIEWTYPE参数的入参来判断查询结果，VIEWTYPE入参为1时，查询总体资源；VIEWTYPE入参为2时，查询部门资源；VIEWTYPE入参为3时，查询资源明细情况。）
export async function FetchQueryResourceAllocation(payload) {
  const option = {
    url: queryResourceAllocation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//修改总体资源
export async function ModResourceAllocationDeal(payload) {
  const option = {
    url: modResourceAllocationDeal,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询行业动态评论信息
export async function FetchQueryNewsComment(payload) {
  const option = {
    url: queryNewsComment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//编辑行业动态评论信息
export async function FetchModNewsComment(payload) {
  const option = {
    url: modNewsComment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506223 专项规划详情
export async function FetchQuerySpecialPlanZXZB(payload) {
  const option = {
    url: querySpecialPlanZXZB,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506224 子分规划详情
export async function FetchQueryDepartmentPlanZFZB(payload) {
  const option = {
    url: queryDepartmentPlanZFZB,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506223 专项规划
export async function FetchQueryTspecial(payload) {
  const option = {
    url: queryTspecial,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506224 子分规划
export async function FetchQueryTdepartment(payload) {
  const option = {
    url: queryTdepartment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 506225 行业动态分类查询
export async function FetchQueryNewsCateg(payload) {
  const option = {
    url: queryNewsCateg,
    method: 'post',
    data: payload,
  };
  return request(option);
}
