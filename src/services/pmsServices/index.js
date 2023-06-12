import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  pmsServices: {
    queryLiftcycleMilestone,
    queryLifecycleStuff,
    queryOwnerWorkflow,
    createOperateHyperLink,
    queryOwnerProjectList,
    queryOwnerMessage,
    updateMessageState,
    queryProjectInfoInCycle,
    queryHTXXByXQTC,
    updateHTXX,
    queryOAUrl,
    queryWpsWDXX,
    zipLivebosFilesPost,
    queryZBYSFJ,
    queryZBXXByXQTC,
    queryGysInZbxx,
    updateZbxx,
    exportExcel,
    queryEpibolyLifeCycleExeStatue,
    queryDigitalSpecialClassWeeklyReport,
    operateSZHZBWeekly,
    queryMonthlyList,
    operateMonthly,
    digitalSpecialClassWeeklyReportExcel,
    digitalSpecialClassMonthReportExcel,
    queryUserInfo,
    queryPaymentAccountList,
    queryPaymentFlowInfo,
    queryPaymentFlowDetail,
    creatPaymentFlow,
    queryPaymentFlowDetailFile,
    getApplyListProvisionalAuth,
    queryContrastStatisticInfo,
    checkInvoice,
    queryUserRole,
    individuationGetOAResult,
    queryHjgWeeklyInfo,
    operateHjgWeeklyReport,
    hJGWeeklyReportExcel,
    queryOafilerela,
    queryProjectListInfo,
    queryProjectListPara,
    queryProjectInfoAll,
    queryXWHYAFJ,
    queryAttachLibraryList,
    queryHistoryAttach,
    queryStagingOverviewInfo,
    queryBudgetOverviewInfo,
    queryMemberOverviewInfo,
    querySupplierOverviewInfo,
    queryProjectGeneralInfo,
    queryCreatePaymentInfo,
    queryMemberDetailInfo,
    queryLabelDetailInfo,
    updateProjectOtherInfo,
    queryProjectMessages,
    updateProjectMessages,
    querySupplierList,
    queryZCXX,
    operateSupplierInfo,
    querySupplierDetailInfo,
    queryMemberInfo,
    remindSubProjectFinish,
    operateOutsourceRequirements,
    queryOutsourceRequirement,
    queryOutsourceRequirementList,
    queryRequirementListPara,
    queryRequirementDetail,
    queryWeekday,
    queryOutsourceMemberList,
    operateEvaluation,
    sendMail,
    resumeDistribution,
    queryOutsourceMemberDetail,
    queryEmail,
    updateOutsourceMemberInfo,
    queryEvaluationGradeInfo,
    evaluationScoring,
    supplierQueryDemand,
    queryOutsourceCostList,
    globalSearch,
    outsourceCostCalculation,
    uploadCurriculumVitae,
    queryOutsourceMemberAttendance,
    costCalculationCheck,
    outsourceCostExportExcel,
    queryOutsourceRankInfo,
    insertOutsourcePaymentInfo,
    finishOutsourceWork,
  },
} = api;

// 查询生命周期里程碑执行情况
export async function FetchQueryLiftcycleMilestone(payload) {
  const option = {
    url: queryLiftcycleMilestone,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询生命周期里程碑中的事项执行情况
export async function FetchQueryLifecycleStuff(payload) {
  const option = {
    url: queryLifecycleStuff,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询登录用户发起的流程情况
export async function FetchQueryOwnerWorkflow(payload) {
  const option = {
    url: queryOwnerWorkflow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取livebos加密url
export async function CreateOperateHyperLink(payload) {
  const option = {
    url: createOperateHyperLink,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询当前登录用户的项目列表，查询下拉框用
export async function FetchQueryOwnerProjectList(payload) {
  const option = {
    url: queryOwnerProjectList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询当前登录用户的消息列表
export async function FetchQueryOwnerMessage(payload) {
  const option = {
    url: queryOwnerMessage,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 将待办事项的查看状态修改为已读
export async function UpdateMessageState(payload) {
  const option = {
    url: updateMessageState,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询生命周期用到的项目信息
export async function FetchQueryProjectInfoInCycle(payload) {
  const option = {
    url: queryProjectInfoInCycle,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询合同信息修改弹窗需要的合同信息
export async function FetchQueryHTXXByXQTC(payload) {
  const option = {
    url: queryHTXXByXQTC,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 更新合同信息
export async function UpdateHTXX(payload) {
  const option = {
    url: updateHTXX,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询oa返回的url
export async function FetchQueryOAUrl(payload) {
  const option = {
    url: queryOAUrl,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询中标信息修改弹窗需要的中标信息
export async function FetchQueryZBXXByXQTC(payload) {
  const option = {
    url: queryZBXXByXQTC,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询预览所需的url
export async function FetchQueryWpsWDXX(payload) {
  const option = {
    url: queryWpsWDXX,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询中标信息修改时的供应商下拉列表
export async function FetchQueryGysInZbxx(payload) {
  const option = {
    url: queryGysInZbxx,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 更新中标信息
export async function UpdateZbxx(payload) {
  const option = {
    url: updateZbxx,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询预览所需的url
export async function ZipLivebosFilesPost(payload) {
  const option = {
    url: zipLivebosFilesPost,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询外包事务生命周期执行情况
export async function QueryEpibolyLifeCycleExeStatue(payload) {
  const option = {
    url: queryEpibolyLifeCycleExeStatue,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询预览所需的url
export async function QueryZBYSFJ(payload) {
  const option = {
    url: queryZBYSFJ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询新数字化专班周报
export async function QueryDigitalSpecialClassWeeklyReport(payload) {
  const option = {
    url: queryDigitalSpecialClassWeeklyReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询预览所需的url
export async function ExportExcel(payload) {
  const option = {
    url: exportExcel,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//更新、退回、删除、跳过本周数字化专班周报信息
export async function OperateSZHZBWeekly(payload) {
  const option = {
    url: operateSZHZBWeekly,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询月报信息
export async function QueryMonthlyList(payload) {
  const option = {
    url: queryMonthlyList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//更新、退回、删除月报信息
export async function OperateMonthly(payload) {
  const option = {
    url: operateMonthly,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//数字化专班周报导出EXCELL
export async function DigitalSpecialClassWeeklyReportExcel(payload) {
  const option = {
    url: digitalSpecialClassWeeklyReportExcel,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//数字化专班月报导出EXCELL
export async function DigitalSpecialClassMonthReportExcel(payload) {
  const option = {
    url: digitalSpecialClassMonthReportExcel,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//月报查询用户信息,填报人下拉列表使用
export async function QueryUserInfo(payload) {
  const option = {
    url: queryUserInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询收款账户
export async function QueryPaymentAccountList(payload) {
  const option = {
    url: queryPaymentAccountList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//创建单据时获取基本信息 -付款流程发起
export async function QueryPaymentFlowInfo(payload) {
  const option = {
    url: queryPaymentFlowInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//创建单据时获取费用明细 -付款流程发起
export async function QueryPaymentFlowDetail(payload) {
  const option = {
    url: queryPaymentFlowDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//创建单据 -付款流程发起
export async function CreatPaymentFlow(payload) {
  const option = {
    url: creatPaymentFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//创建单据 -付款流程发起
export async function QueryPaymentFlowDetailFile(payload) {
  const option = {
    url: queryPaymentFlowDetailFile,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//获取预览付款单的url
export async function GetApplyListProvisionalAuth(payload) {
  const option = {
    url: getApplyListProvisionalAuth,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询领导看板页顶部较去年数据
export async function QueryContrastStatisticInfo(payload) {
  const option = {
    url: queryContrastStatisticInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//对接易快报发票查验接口
export async function CheckInvoice(payload) {
  const option = {
    url: checkInvoice,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//查询用户的角色
export async function QueryUserRole(payload) {
  const option = {
    url: queryUserRole,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 修改项目时查询项目详细信息
export async function IndividuationGetOAResult(payload, configObj) {
  const option = {
    url: individuationGetOAResult,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 获取汇金谷零售周报汇总信息
export async function QueryHjgWeeklyInfo(payload, configObj) {
  const option = {
    url: queryHjgWeeklyInfo,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 更新、提交、删除、跳过周报信息
export async function OperateHjgWeeklyReport(payload, configObj) {
  const option = {
    url: operateHjgWeeklyReport,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 导出汇金谷零售周报汇总excel
export async function HJGWeeklyReportExcel(payload, configObj) {
  const option = {
    url: hJGWeeklyReportExcel,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 调用oa接口获取关联文件
export async function QueryOafilerela(payload, configObj) {
  const option = {
    url: queryOafilerela,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询项目信息列表的项目信息
export async function QueryProjectListInfo(payload, configObj) {
  const option = {
    url: queryProjectListInfo,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询项目信息列表的查询条件
export async function QueryProjectListPara(payload, configObj) {
  const option = {
    url: queryProjectListPara,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询项目信息所有基本信息
export async function QueryProjectInfoAll(payload, configObj) {
  const option = {
    url: queryProjectInfoAll,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询要导出的信委会议案
export async function QueryXWHYAFJ(payload) {
  const option = {
    url: queryXWHYAFJ,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询工作台的零散信息
export async function QueryStagingOverviewInfo(payload) {
  const option = {
    url: queryStagingOverviewInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询预算概览信息
export async function QueryBudgetOverviewInfo(payload) {
  const option = {
    url: queryBudgetOverviewInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人员概览信息
export async function QueryMemberOverviewInfo(payload) {
  const option = {
    url: queryMemberOverviewInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询供应商信息
export async function QuerySupplierOverviewInfo(payload) {
  const option = {
    url: querySupplierOverviewInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询首页项目综合信息
export async function QueryProjectGeneralInfo(payload) {
  const option = {
    url: queryProjectGeneralInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询文档列表
export async function QueryAttachLibraryList(payload) {
  const option = {
    url: queryAttachLibraryList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询历史文档
export async function QueryHistoryAttach(payload) {
  const option = {
    url: queryHistoryAttach,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询发起付款流程所需的基本信息
export async function QueryCreatePaymentInfo(payload) {
  const option = {
    url: queryCreatePaymentInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人员详情信息
export async function QueryMemberDetailInfo(payload) {
  const option = {
    url: queryMemberDetailInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询标签详情信息
export async function QueryLabelDetailInfo(payload) {
  const option = {
    url: queryLabelDetailInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 更新项目编辑中的其他信息
export async function UpdateProjectOtherInfo(payload) {
  const option = {
    url: updateProjectOtherInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目留言
export async function QueryProjectMessages(payload) {
  const option = {
    url: queryProjectMessages,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 新增、修改项目留言
export async function UpdateProjectMessages(payload) {
  const option = {
    url: updateProjectMessages,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询供应商信息列表
export async function QuerySupplierList(payload) {
  const option = {
    url: querySupplierList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询中标信息和合同信息
export async function FetchQueryZCXX(payload) {
  const option = {
    url: queryZCXX,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询供应商详情
export async function QuerySupplierDetailInfo(payload) {
  const option = {
    url: querySupplierDetailInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑供应商详情
export async function OperateSupplierInfo(payload) {
  const option = {
    url: operateSupplierInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人员信息
export async function QueryMemberInfo(payload) {
  const option = {
    url: queryMemberInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 提醒子项目完善信息
export async function RemindSubProjectFinish(payload) {
  const option = {
    url: remindSubProjectFinish,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 需求发起
export async function OperateOutsourceRequirements(payload) {
  const option = {
    url: operateOutsourceRequirements,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询需求发起结果
export async function FetchqueryOutsourceRequirement(payload) {
  const option = {
    url: queryOutsourceRequirement,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询外包需求列表
export async function QueryOutsourceRequirementList(payload) {
  const option = {
    url: queryOutsourceRequirementList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人力外包需求详情
export async function QueryRequirementDetail(payload) {
  const option = {
    url: queryRequirementDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 外包人员列表查询条件
export async function QueryRequirementListPara(payload) {
  const option = {
    url: queryRequirementListPara,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 工作日查询
export async function QueryWeekday(payload) {
  const option = {
    url: queryWeekday,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 综合评测信息操作
export async function OperateEvaluation(payload) {
  const option = {
    url: operateEvaluation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人员信息
export async function QueryOutsourceMemberList(payload) {
  const option = {
    url: queryOutsourceMemberList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 邮件发送
export async function SendMail(payload) {
  const option = {
    url: sendMail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 简历分发
export async function ResumeDistribution(payload) {
  const option = {
    url: resumeDistribution,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询外包人员详情
export async function FetchQueryOutsourceMemberDetail(payload) {
  const option = {
    url: queryOutsourceMemberDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询邮件发送人
export async function QueryEmail(payload) {
  const option = {
    url: queryEmail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 外包人员信息编辑
export async function UpdateOutsourceMemberInfo(payload) {
  const option = {
    url: updateOutsourceMemberInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询综合评测打分信息
export async function QueryEvaluationGradeInfo(payload) {
  const option = {
    url: queryEvaluationGradeInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 综合评测打分
export async function EvaluationScoring(payload) {
  const option = {
    url: evaluationScoring,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询供应商需求
export async function QuerySupplierDemand(payload) {
  const option = {
    url: supplierQueryDemand,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询费用列表
export async function QueryOutsourceCostList(payload) {
  const option = {
    url: queryOutsourceCostList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 全局搜索
export async function GlobalSearch(payload) {
  const option = {
    url: globalSearch,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 费用计算
export async function OutsourceCostCalculation(payload) {
  const option = {
    url: outsourceCostCalculation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 简历上传
export async function UploadCurriculumVitae(payload) {
  const option = {
    url: uploadCurriculumVitae,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 考勤查询
export async function QueryOutsourceMemberAttendance(payload) {
  const option = {
    url: queryOutsourceMemberAttendance,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 费用计算前校验
export async function CostCalculationCheck(payload) {
  const option = {
    url: costCalculationCheck,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 外包费用导出Excel
export async function OutsourceCostExportExcel(payload) {
  const option = {
    url: outsourceCostExportExcel,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员等级查询
export async function QueryOutsourceRankInfo(payload) {
  const option = {
    url: queryOutsourceRankInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 外包人员付款后插入外包付款信息
export async function InsertOutsourcePaymentInfo(payload) {
  const option = {
    url: insertOutsourcePaymentInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 完成外包事务
export async function FinishOutsourceWork(payload) {
  const option = {
    url: finishOutsourceWork,
    method: 'post',
    data: payload,
  };
  return request(option);
}
