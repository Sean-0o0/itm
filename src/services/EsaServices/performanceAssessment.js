import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  esa: {
    operateAppraisalProgramConf, queryListAppraisalProgram, queryListAppraisalProgramDetail, operateEmpPrfmExamProgram,
    queryListEmpPrfmExamProgram, queryListEmpPrfmExamProgramDetail, queryListEmpClassLevel, queryInfoAppraisalProgramWeight,
  } } = api;

/* =================绩效考核方案start=================== */
// 绩效考核方案设置
export async function FetchoperateAppraisalProgramConf(payload = {}) {
  const option = {
    url: operateAppraisalProgramConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 绩效考核方案查询
export async function FetchqueryListAppraisalProgram(payload = {}) {
  const option = {
    url: queryListAppraisalProgram,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 绩效考核方案明细
export async function FetchqueryListAppraisalProgramDetail(payload = {}) {
  const option = {
    url: queryListAppraisalProgramDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 个人绩效考核方案设置
export async function FetchoperateEmpPrfmExamProgram(payload = {}) {
  const option = {
    url: operateEmpPrfmExamProgram,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 个人绩效考核方案查询
export async function FetchqueryListEmpPrfmExamProgram(payload = {}) {
  const option = {
    url: queryListEmpPrfmExamProgram,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 个人绩效考核方案明细
export async function FetchqueryListEmpPrfmExamProgramDetail(payload = {}) {
  const option = {
    url: queryListEmpPrfmExamProgramDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 绩效考核方案人员
export async function FetchqueryListEmpClassLevel(payload = {}) {
  const option = {
    url: queryListEmpClassLevel,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 绩效考核权重查询
export async function FetchqueryInfoAppraisalProgramWeight(payload = {}) {
  const option = {
    url: queryInfoAppraisalProgramWeight,
    method: 'post',
    data: payload,
  };
  return request(option);
}
/* =================绩效考核方案end=================== */

