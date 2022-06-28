import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  esa: {
    queryCalculateRuleDefinition, operateCalculateRuleDefinition,
  } } = api;
// 系统指标-计算规则定义查询
export async function FetchqueryCalculateRuleDefinition(payload = {}) {
  const option = {
    url: queryCalculateRuleDefinition,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 系统指标-计算规则定义
export async function FetchoperateCalculateRuleDefinition(payload = {}) {
  const option = {
    url: operateCalculateRuleDefinition,
    method: 'post',
    data: payload,
  };
  return request(option);
}
