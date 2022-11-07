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
// 查询招标信息修改弹窗需要的招标信息
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
// 查询招标信息修改时的供应商下拉列表
export async function FetchQueryGysInZbxx(payload) {
  const option = {
    url: queryGysInZbxx,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 更新招标信息
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