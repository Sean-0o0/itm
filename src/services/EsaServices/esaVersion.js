import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { esa: { queryOrgSalaryVersion, operateOrgSalaryVersion,
  querySalaryVersion, querySalaryVersionDetail, operateSalaryVersion
} } = api;


// 营业部薪酬版本引用查询
export async function FetchqueryOrgSalaryVersion(payload = {}) {
  const option = {
    url: queryOrgSalaryVersion,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 营业部薪酬版本配置
export async function FetchoperateOrgSalaryVersion(payload = {}) {
  const option = {
    url: operateOrgSalaryVersion,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬版本查询
export async function FetchquerySalaryVersion(payload = {}) {
  const option = {
    url: querySalaryVersion,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 薪酬版本详情查询
export async function FetchquerySalaryVersionDetail(payload = {}) {
  const option = {
    url: querySalaryVersionDetail,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 薪酬版本配置
export async function FetchoperateSalaryVersion(payload = {}) {
  const option = {
    url: operateSalaryVersion,
    method: 'post',
    data: payload,
  };
  return request(option);
}
