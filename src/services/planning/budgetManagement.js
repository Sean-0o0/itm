import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  planning: {
    operateBudgetTemplateConf, queryListBudgetCode, queryListBudgetFormula, operateBudgetProject,
    operateBudgetFormulaDef, queryInfoBudgetFormulaDef, queryInfoBudgetTemplateConf, queryBudgetFormulaConf,
  } } = api;

// 预算模板配置:预算新增|修改|删除
export async function FetchOperateBudgetTemplateConf(payload = {}) {
  const option = {
    url: operateBudgetTemplateConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询预算模板配置
export async function FetchQueryInfoBudgetTemplateConf(payload = {}) {
  const option = {
    url: queryInfoBudgetTemplateConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询预算代码列表
export async function FetchQueryListBudgetCode(payload = {}) {
  const option = {
    url: queryListBudgetCode,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询预算代码公式列表
export async function FetchQueryListBudgetFormula(payload = {}) {
  const option = {
    url: queryListBudgetFormula,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 预算项目操作
export async function FetchOperateBudgetProject(payload = {}) {
  const option = {
    url: operateBudgetProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 预算代码公式定义操作
export async function FetchOperateBudgetFormulaDef(payload = {}) {
  const option = {
    url: operateBudgetFormulaDef,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询预算代码公式定义
export async function FetchQueryInfoBudgetFormulaDef(payload = {}) {
  const option = {
    url: queryInfoBudgetFormulaDef,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询预算公式配置项目
export async function FetchQueryBudgetFormulaConf(payload) {
  const option = {
    url: queryBudgetFormulaConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}
