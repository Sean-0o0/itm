import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  esa: {
    queryInfoSalaryProgram, queryInfoSalaryProgramSno, operateSalaryProgramConf, queryListSalaryCode, queryListSalaryFormula, operateProject,
    operateSalaryFormulaDef, queryInfoSalaryFormulaDef, queryInfoSalaryTemplateConf, operateSalaryTemplateConf,
  } } = api;

// 薪酬方案查询
export async function FetchQuerySalaryProgram(payload) {
  const option = {
    url: queryInfoSalaryProgram,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 薪酬方案顺序查询
export async function FetchQueryInfoSalaryProgramSno(payload) {
  const option = {
    url: queryInfoSalaryProgramSno,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 薪酬方案设置
export async function FetchoperateSalaryProgramConf(payload) {
  const option = {
    url: operateSalaryProgramConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询薪酬代码列表
export async function FetchqueryListSalaryCode(payload = {}) {
  const option = {
    url: queryListSalaryCode,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询薪酬代码公式列表
export async function FetchqueryListSalaryFormula(payload = {}) {
  const option = {
    url: queryListSalaryFormula,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 薪酬项目操作
export async function FetchoperateProject(payload = {}) {
  const option = {
    url: operateProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 薪酬代码公式定义操作
export async function FetchoperateSalaryFormulaDef(payload = {}) {
  const option = {
    url: operateSalaryFormulaDef,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询薪酬代码公式定义
export async function FetchqueryInfoSalaryFormulaDef(payload = {}) {
  const option = {
    url: queryInfoSalaryFormulaDef,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询薪酬模板配置
export async function FetchqueryInfoSalaryTemplateConf(payload = {}) {
  const option = {
    url: queryInfoSalaryTemplateConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬模板配置:薪酬新增|修改|删除
export async function FetchoperateSalaryTemplateConf(payload = {}) {
  const option = {
    url: operateSalaryTemplateConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}

