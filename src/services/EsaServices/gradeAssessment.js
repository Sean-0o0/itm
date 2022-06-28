import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  esa: {
    operateClassAssessmentPlan,
    operateLevelAssessmentPlan,
    queryInfoClassProgramFmla,
    queryInfoLevelProgramFmla,
    queryInfoProgramSeqGet,
    queryListClassProgram,
    queryListLevelProgram,
  } } = api;

// 类别考核 -- 操作类别考核方案
export async function FetchOperateClassAssessmentPlan(payload = {}) {
  const option = {
    url: operateClassAssessmentPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 级别考核 -- 操作级别考核方案
export async function FetchOperateLevelAssessmentPlan(payload = {}) {
  const option = {
    url: operateLevelAssessmentPlan,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 类别考核方案-公式获取
export async function FetchQueryInfoClassProgramFmla(payload = {}) {
  const option = {
    url: queryInfoClassProgramFmla,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 级别考核方案-公式获取
export async function FetchQueryInfoLevelProgramFmla(payload = {}) {
  const option = {
    url: queryInfoLevelProgramFmla,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 方案考核顺序获取
export async function FetchQueryInfoProgramSeqGet(payload = {}) {
  const option = {
    url: queryInfoProgramSeqGet,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 类别考核方案列表查询
export async function FetchQueryListClassProgram(payload = {}) {
  const option = {
    url: queryListClassProgram,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 级别考核方案列表查询
export async function FetchQueryListLevelProgram(payload = {}) {
  const option = {
    url: queryListLevelProgram,
    method: 'post',
    data: payload,
  };
  return request(option);
}
