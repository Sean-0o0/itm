import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  processCenter: {
    proAnalysis,
    processStepDeatil,
    incomdispAssess,
    incomdispProgress,
    querySelfAccountList,
    operateSelfAccountList,
    querySelfAccountCol
  },
} = api;

// 工作流流程分析
export async function FetchProAnalysis(payload) {
  const option = {
    url: proAnalysis,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询外规流程步骤明细
export async function FetchProcessStepDeatil(payload) {
  const option = {
    url: processStepDeatil,
    method: 'post',
    data: payload,
  };
  return request(option);
}


// 监管外规流程查询
export async function FetchIncomdispAssess(payload) {
  const option = {
    url: incomdispAssess,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询外规流程进度
export async function FetchIncomdispProgress(payload) {
  const option = {
    url: incomdispProgress,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询自营账户列表
export async function FetchQuerySelfAccountList(payload) {
  const option = {
    url: querySelfAccountList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 自营账户列表操作
export async function OperateSelfAccountList(payload) {
  const option = {
    url: operateSelfAccountList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 自定义展示列表数据
export async function FetchQuerySelfAccountCol(payload) {
  const option = {
    url: querySelfAccountCol,
    method: 'post',
    data: payload,
  };
  return request(option);
}