import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  pmsServices: {
    queryDocTemplate,
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
    queryProjectTracking,
    queryProjectNode,
    projectCollect,
    queryMonthlyAssessment,
    queryCustomQueryCriteria,
    deleteMonthlyAssessment,
    queryCustomReportList,
    saveCustomReportSetting,
    queryCustomReport,
    queryReportOperateRecord,
    queryProjectStatisticsList,
    queryProjectDynamics,
    queryProjectStatistics,
    queryCustomReportContent,
    configureCustomReport,
    editCustomReport,
    completeReport,
    queryApportionsInfo,
    queryBudgetStatistics,
    queryPaymentByCode,
    supplyPaymentInfo,
    writeProjectTrackingReport,
    queryProjectFiles,
    insertFileDownloadRecord,
    finishProject,
    inviteMemberAgain,
    queryRequisitionData,
    queryUnreadInfo,
    insertResumeDownloadRecords,
    queryResumeDownloadRecords,
    insertProjectUpdateInfo,
    queryProjectUpdateInfo,
    insertProjectAttendanceRcd,
    queryMemberAttendanceRcd,
    insertEvaluateInfo,
    queryEvaluateInfo,
    initIterationProjectInfo,
    queryIteProjPayRcd,
    queryIteProjPayPlan,
    queryContractFlowInfo,
    copyCustomReport,
    insertIteContract,
    queryIteContractInfo,
    updateItePayInfo,
    queryUploadRcd,
    feeCalculation,
    querySelfDevProjWHstatistics,
    attendanceStatisticExportExcel,
    queryLeadApprovalFlow,
    updatePaymentContract,
    queryIteContractList,
    queryProjectDraft,
    relIteContractFlow,
    queryIteContractFlow,
    queryIPRList,
    queryAwardAndHonorList,
    editIPRInfo,
    operateAwardAndHonor,
    queryXCContractInfo,
    queryXCContractSubInfo,
    operateXCContract,
    transferXCContract,
    queryProjectXCContract,
    queryIteProjectList,
    queryUndoMatters,
    queryDocTemplateLibrary,
    editDocTemplate,
    queryDocType,
    queryDepartment,
    fileTypeCheck,
    queryEmployeeAppraiseList,
    operateEmployeeAppraise,
    queryProjectAppraiseSwitchList,
    generateBudgetCarryoverInfo,
    operateBudgetCarryoverInfo,
    operateCapitalBeginYearBudgetInfo,
    queryProjectBudgetCarryoverInfo,
    queryCapitalBudgetCarryoverInfo,
    convertToSelfDevIteProject,
    queryBudgetProjectDetail,
    queryMemberRevaluationByORG,
    queryUnifiedProjectInitProcess,
    operateSinglePaymentProject,
    queryIteContractInfoList,
    queryOperateStatistics,
    queryOperateDetail,
    exportCustomReportToExcel,
    queryProjectApplicationFlow,
    operateVoidProjectApplication,
    queryProjectStatusList,
    queryProjectProgressList,
    queryMilestoneStageInfo,
    queryProjectProgressStatistics,
    queryProjectPayments,
    queryProjectSelectList,
    queryMemberSelectList,
    queryProjectDynamicSection,
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

// 查询项目跟踪信息
export async function QueryProjectTracking(payload) {
  const option = {
    url: queryProjectTracking,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目节点
export async function QueryProjectNode(payload) {
  const option = {
    url: queryProjectNode,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 收藏项目
export async function ProjectCollect(payload) {
  const option = {
    url: projectCollect,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询自定义报表里的查询条件
export async function QueryCustomQueryCriteria(payload) {
  const option = {
    url: queryCustomQueryCriteria,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 月度考核
export async function QueryMonthlyAssessment(payload) {
  const option = {
    url: queryMonthlyAssessment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 月度考核
export async function DeleteMonthlyAssessment(payload) {
  const option = {
    url: deleteMonthlyAssessment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 报表查询
export async function FetchQueryCustomReportList(payload) {
  const option = {
    url: queryCustomReportList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 保存自定义报表配置
export async function SaveCustomReportSetting(payload) {
  const option = {
    url: saveCustomReportSetting,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 自定义报表查询
export async function QueryCustomReport(payload) {
  const option = {
    url: queryCustomReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询报表历史操作记录
export async function QueryReportOperateRecord(payload) {
  const option = {
    url: queryReportOperateRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询
export async function QueryProjectStatisticsList(payload) {
  const option = {
    url: queryProjectStatisticsList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询首页项目动态信息
export async function QueryProjectDynamics(payload) {
  const option = {
    url: queryProjectDynamics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目统计
export async function QueryProjectStatistics(payload) {
  const option = {
    url: queryProjectStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询自定义报告内容
export async function QueryCustomReportContent(payload) {
  const option = {
    url: queryCustomReportContent,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 创建自定义报告
export async function ConfigureCustomReport(payload) {
  const option = {
    url: configureCustomReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑自定义报告内容
export async function EditCustomReport(payload) {
  const option = {
    url: editCustomReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 报告填写完成
export async function CompleteReport(payload) {
  const option = {
    url: completeReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询创建单据时所需的分摊信息
export async function QueryApportionsInfo(payload) {
  const option = {
    url: queryApportionsInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 预算统计查询
export async function QueryBudgetStatistics(payload) {
  const option = {
    url: queryBudgetStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 补录付款流程信息时，根据单据编号查询单据信息
export async function QueryPaymentByCode(payload) {
  const option = {
    url: queryPaymentByCode,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 补录付款流程信息
export async function SupplyPaymentInfo(payload) {
  const option = {
    url: supplyPaymentInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 填写项目周报
export async function WriteProjectTrackingReport(payload) {
  const option = {
    url: writeProjectTrackingReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目文档
export async function QueryProjectFiles(payload) {
  const option = {
    url: queryProjectFiles,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 插入项目文档下载记录
export async function InsertFileDownloadRecord(payload) {
  const option = {
    url: insertFileDownloadRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 完结项目
export async function FinishProject(payload) {
  const option = {
    url: finishProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 再次邀请人员
export async function InviteMemberAgain(payload) {
  const option = {
    url: inviteMemberAgain,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询关联申请信息
export async function QueryRequisitionData(payload) {
  const option = {
    url: queryRequisitionData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 前端轮询获取未读信息数量
export async function QueryUnreadInfo(payload) {
  const option = {
    url: queryUnreadInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 插入简历下载记录
export async function InsertResumeDownloadRecord(payload) {
  const option = {
    url: insertResumeDownloadRecords,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询简历下载记录
export async function QueryResumeDownloadRecords(payload) {
  const option = {
    url: queryResumeDownloadRecords,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 新增、修改、删除自研项目升级内容
export async function InsertProjectUpdateInfo(payload) {
  const option = {
    url: insertProjectUpdateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询自研项目升级内容
export async function QueryProjectUpdateInfo(payload) {
  const option = {
    url: queryProjectUpdateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 自研项目考勤登记
export async function InsertProjectAttendanceRcd(payload) {
  const option = {
    url: insertProjectAttendanceRcd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询自研项目考勤记录
export async function QueryMemberAttendanceRcd(payload) {
  const option = {
    url: queryMemberAttendanceRcd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 新增、修改评估信息
export async function InsertEvaluateInfo(payload) {
  const option = {
    url: insertEvaluateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询迭代项目评估信息
export async function QueryEvaluateInfo(payload) {
  const option = {
    url: queryEvaluateInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 初始化迭代项目信息
export async function InitIterationProjectInfo(payload) {
  const option = {
    url: initIterationProjectInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询迭代项目付款记录
export async function QueryIteProjPayRcd(payload) {
  const option = {
    url: queryIteProjPayRcd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询迭代项目付款计划
export async function QueryIteProjPayPlan(payload) {
  const option = {
    url: queryIteProjPayPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询合同签署流程
export async function QueryContractFlowInfo(payload) {
  const option = {
    url: queryContractFlowInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 复制自定义报告
export async function CopyCustomReport(payload) {
  const option = {
    url: copyCustomReport,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 新增、修改迭代合同
export async function InsertIteContract(payload) {
  const option = {
    url: insertIteContract,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询迭代合同信息
export async function QueryIteContractInfo(payload) {
  const option = {
    url: queryIteContractInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 迭代付款后更新迭代付款信息
export async function UpdateItePayInfo(payload) {
  const option = {
    url: updateItePayInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询简历上传流水
export async function QueryUploadRcd(payload) {
  const option = {
    url: queryUploadRcd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 返回num1对num2的加减乘除保留两位数的结果
export async function FeeCalculation(payload) {
  const option = {
    url: feeCalculation,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询自研项目工时统计
export async function QuerySelfDevProjWHstatistics(payload) {
  const option = {
    url: querySelfDevProjWHstatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 导出自研项目考勤统计
export async function AttendanceStatisticExportExcel(payload) {
  const option = {
    url: attendanceStatisticExportExcel,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询待领导审批流程
export async function QueryLeadApprovalFlow(payload) {
  const option = {
    url: queryLeadApprovalFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 更新付款关联合同信息
export async function UpdatePaymentContract(payload) {
  const option = {
    url: updatePaymentContract,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询迭代合同列表
export async function QueryIteContractList(payload) {
  const option = {
    url: queryIteContractList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目草稿
export async function QueryProjectDraft(payload) {
  const option = {
    url: queryProjectDraft,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 关联迭代合同
export async function RelIteContractFlow(payload) {
  const option = {
    url: relIteContractFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 关联迭代合同签署流程
export async function QueryIteContractFlow(payload) {
  const option = {
    url: queryIteContractFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询知识产权列表
export async function QueryIPRList(payload) {
  const option = {
    url: queryIPRList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询获奖荣誉
export async function QueryAwardAndHonorList(payload) {
  const option = {
    url: queryAwardAndHonorList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑知识产权
export async function EditIPRInfo(payload) {
  const option = {
    url: editIPRInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑获奖荣誉
export async function OperateAwardAndHonor(payload) {
  const option = {
    url: operateAwardAndHonor,
    method: 'post',
    data: payload,
  };
  return request(option);
}
//

// 查询信创合同列表
export async function QueryXCContractInfo(payload) {
  const option = {
    url: queryXCContractInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询信创合同附属信息
export async function QueryXCContractSubInfo(payload) {
  const option = {
    url: queryXCContractSubInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑信创合同信息
export async function OperateXCContract(payload) {
  const option = {
    url: operateXCContract,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 信创合同转办
export async function TransferXCContract(payload) {
  const option = {
    url: transferXCContract,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 项目详情里查信创合同
export async function QueryProjectXCContract(payload) {
  const option = {
    url: queryProjectXCContract,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询迭代项目
export async function QueryIteProjectList(payload) {
  const option = {
    url: queryIteProjectList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询未完成事项
export async function QueryUndoMatters(payload) {
  const option = {
    url: queryUndoMatters,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询文档模板库
export async function QueryDocTemplateLibrary(payload) {
  const option = {
    url: queryDocTemplateLibrary,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑文档模板
export async function EditDocTemplate(payload) {
  const option = {
    url: editDocTemplate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询文档类型
export async function QueryDocType(payload) {
  const option = {
    url: queryDocType,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询付款流程分摊明细 易快报 部门数据
export async function QueryDepartment(payload) {
  const option = {
    url: queryDepartment,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询文档模板
export async function QueryDocTemplate(payload) {
  const option = {
    url: queryDocTemplate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 文件类型判断
export async function FileTypeCheck(payload) {
  const option = {
    url: fileTypeCheck,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人员评价列表
export async function QueryEmployeeAppraiseList(payload) {
  const option = {
    url: queryEmployeeAppraiseList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑人员评价
export async function OperateEmployeeAppraise(payload) {
  const option = {
    url: operateEmployeeAppraise,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询评价开关页面的项目信息
export async function QueryProjectAppraiseSwitchList(payload) {
  const option = {
    url: queryProjectAppraiseSwitchList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 生成预算结转信息
export async function GenerateBudgetCarryoverInfo(payload) {
  const option = {
    url: generateBudgetCarryoverInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 项目预算结转
export async function OperateBudgetCarryoverInfo(payload) {
  const option = {
    url: operateBudgetCarryoverInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑资本性年初预算信息
export async function OperateCapitalBeginYearBudgetInfo(payload) {
  const option = {
    url: operateCapitalBeginYearBudgetInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目预算结转信息
export async function QueryProjectBudgetCarryoverInfo(payload) {
  const option = {
    url: queryProjectBudgetCarryoverInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目预算结转信息
export async function QueryCapitalBudgetCarryoverInfo(payload) {
  const option = {
    url: queryCapitalBudgetCarryoverInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 转换为自研迭代项目
export async function ConvertToSelfDevIteProject(payload) {
  const option = {
    url: convertToSelfDevIteProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}

/** 查预算详情 */
export async function QueryBudgetProjectDetail(payload) {
  const option = {
    url: queryBudgetProjectDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 根据部门查询人员评价
export async function QueryMemberRevaluationByORG(payload) {
  const option = {
    url: queryMemberRevaluationByORG,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询统一立项流程
export async function QueryUnifiedProjectInitProcess(payload) {
  const option = {
    url: queryUnifiedProjectInitProcess,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 编辑单费用付款项目
export async function OperateSinglePaymentProject(payload) {
  const option = {
    url: operateSinglePaymentProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 合同列表页面查询查询迭代合同信息
export async function QueryIteContractInfoList(payload) {
  const option = {
    url: queryIteContractInfoList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询埋点的操作统计
export async function QueryOperateStatistics(payload) {
  const option = {
    url: queryOperateStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询埋点的操作详情
export async function QueryOperateDetail(payload) {
  const option = {
    url: queryOperateDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 自定义报告导出
export async function ExportCustomReportToExcel(payload) {
  const option = {
    url: exportCustomReportToExcel,
    method: 'post',
    data: payload,
  };
  return request(option);
}

/** 查询项目历史发起未作废的项目立项流程 */
export async function QueryProjectApplicationFlow(payload) {
  const option = {
    url: queryProjectApplicationFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目情况
export async function QueryProjectStatusList(payload) {
  const option = {
    url: queryProjectStatusList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目动态看板
export async function QueryProjectDynamicSection(payload) {
  const option = {
    url: queryProjectDynamicSection,
    method: 'post',
    data: payload,
  };
  return request(option);
}

/** 作废项目立项流程 */
export async function OperateVoidProjectApplication(payload) {
  const option = {
    url: operateVoidProjectApplication,
    method: 'post',
    data: payload,
  };
  return request(option);
}

/** 查询项目进展（动态） */
export async function QueryProjectProgressList(payload) {
  const option = {
    url: queryProjectProgressList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

/** 查询里程碑阶段信息 */
export async function QueryMilestoneStageInfo(payload) {
  const option = {
    url: queryMilestoneStageInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

/** 项目详情查询项目进展统计 */
export async function QueryProjectProgressStatistics(payload) {
  const option = {
    url: queryProjectProgressStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}

/** 项目详情查询项目付款情况 */
export async function QueryProjectPayments(payload) {
  const option = {
    url: queryProjectPayments,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询项目选择下拉框的数据（大部分操作窗口下拉框适用）
export async function QueryProjectSelectList(payload) {
  const option = {
    url: queryProjectSelectList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人员选择下拉框的数据（大部分操作窗口下拉框适用）
export async function QueryMemberSelectList(payload) {
  const option = {
    url: queryMemberSelectList,
    method: 'post',
    data: payload,
  };
  return request(option);
}