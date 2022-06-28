import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { staffrelationship: { staffBasicInfo, staffMoreInfo, staffRelationshipStatistics, staffRelationshipDetail,
  staffCusSignDetail, staffSettlementAccount, staffImageDetail, staffContractDetail, staffQualificationDetail, staffTrainingDetail,
  staffCusActStac, staffProSalesStac, staffMonCusNumStac, staffRelationNumMonStac, staffChagFlow,
  staffPersonnelManagementStatus, staffPersonnelManagementStatusExtenDetail, worklogProjectScope, fillInWorklog,
  staffPerformanceAnalysis, staffCusTradActivityAnalysis, queryStaffTips, browseWorklog, staffCusAwkwardness, staffCusHotStocks,
  staffAssetsTransactionTrend, loginUserPersonalInfo, userConfidentialityData, staffExamSbjInfo, userCommitmentRecord,
  queryStaffCategoryLevel, checkCusPanoramaCompliance, cusPanoramaComplianceInfo, handleWorklogRemaind, queryOtherUsers, uploadProto,
} } = api;

// 查询其它用户
export async function FetchQueryOtherUsers(payload) {
  const option = {
    url: queryOtherUsers,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取员工基本信息
export async function FetchStaffBasicInfo(payload) {
  const option = {
    url: staffBasicInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取员工详细信息
export async function FetchStaffMoreInfo(payload) {
  const option = {
    url: staffMoreInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 获取人员关系统计数据（分类数据+汇总）
export async function FetchStaffRelationshipDetail(payload) {
  const option = {
    url: staffRelationshipDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询人员客户关系明细
export async function FetchStaffRelationshipStatistics(payload) {
  const option = {
    url: staffRelationshipStatistics,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询人员签约客户明细
export async function FetchStaffCusSignDetail(payload) {
  const option = {
    url: staffCusSignDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询人员结算账户信息
export async function FetchStaffSettlementAccount(payload) {
  const option = {
    url: staffSettlementAccount,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询人员影像信息
export async function FetchStaffImageDetail(payload) {
  const option = {
    url: staffImageDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询人员合同信息
export async function FetchStaffContractDetail(payload) {
  const option = {
    url: staffContractDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询人员从业资格信息
export async function FetchStaffQualificationDetail(payload) {
  const option = {
    url: staffQualificationDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询人员培训信息
export async function FetchStaffTrainingDetail(payload) {
  const option = {
    url: staffTrainingDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员全景  查询客户开户统计
export async function FetchStaffCusActStac(payload) {
  const option = {
    url: staffCusActStac,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员全景 查询产品销售统计
export async function FetchStaffProSalesStac(payload) {
  const option = {
    url: staffProSalesStac,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员全景  查询人员月客户数统计
export async function FetchStaffMonCusNumStac(payload) {
  const option = {
    url: staffMonCusNumStac,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员全景  查询人员月关系数统计(当月总关系数以及当月新增关系数)
export async function FetchStaffRelationNumMonStac(payload) {
  const option = {
    url: staffRelationNumMonStac,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员全景 查询人员变动流水
export async function FetchStaffChagFlow(payload) {
  const option = {
    url: staffChagFlow,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员列表  获取某人员人事办理状态
export async function FetchStaffPersonnelManagementStatus(payload) {
  const option = {
    url: staffPersonnelManagementStatus,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 人员列表  获取某人员某人事节点详情
export async function FetchStaffPersonnelManagementStatusExtenDetail(payload) {
  const option = {
    url: staffPersonnelManagementStatusExtenDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 工作日志 获取日志项目数据范围
export async function FetchWorklogProjectScope(payload) {
  const option = {
    url: worklogProjectScope,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 工作日志  填写工作日志
export async function FetchFillInWorklog(payload) {
  const option = {
    url: fillInWorklog,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页  获取人员业绩趋势分析
export async function FetchStaffPerformanceAnalysis(payload) {
  const option = {
    url: staffPerformanceAnalysis,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页  获取人员名下客户交易活跃度分析
export async function FetchStaffCusTradActivityAnalysis(payload) {
  const option = {
    url: staffCusTradActivityAnalysis,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页  人员模糊搜索
export async function FetchQueryStaffTips(payload) {
  const option = {
    url: queryStaffTips,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 记录浏览日志
export async function DoBrowseWorklog(payload) {
  const option = {
    url: browseWorklog,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 系统首页  人员名下客户重仓股
export async function FetchStaffCusAwkwardness(payload) {
  const option = {
    url: staffCusAwkwardness,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 系统首页  人员名下客户热门股
export async function FetchStaffCusHotStocks(payload) {
  const option = {
    url: staffCusHotStocks,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 人员全景  获取人员资产交易量趋势
export async function FetchStaffAssetsTransactionTrend(payload) {
  const option = {
    url: staffAssetsTransactionTrend,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取登陆用户人事信息
export async function FetchLoginUserPersonalInfo(payload) {
  const option = {
    url: loginUserPersonalInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取保密协议书内容
export async function FetchUserConfidentialityData(payload) {
  const option = {
    url: userConfidentialityData,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取考试科目信息
export async function FetchStaffExamSbjInfo(payload) {
  const option = {
    url: staffExamSbjInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 写入用户承诺书签订记录
export async function DoUserCommitmentRecord(payload) {
  const option = {
    url: userCommitmentRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询人员类别即级别关系
export async function FetchQueryStaffCategoryLevel(payload) {
  const option = {
    url: queryStaffCategoryLevel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 登记客户全景合规信息检测
export async function FetchCheckCusPanoramaCompliance(payload) {
  const option = {
    url: checkCusPanoramaCompliance,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询客户全景合规信息
export async function FetchCusPanoramaComplianceInfo(payload) {
  const option = {
    url: cusPanoramaComplianceInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 工作日志  处理特别提醒
export async function FetchHandleWorklogRemaind(payload) {
  const option = {
    url: handleWorklogRemaind,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 上传头像
export async function FetchUploadProto(payload) {
  const option = {
    url: uploadProto,
    method: 'post',
    data: payload,
  };
  return request(option);
}
