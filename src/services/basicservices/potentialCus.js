import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { basicservices: { potentialCusServiceRecord, queryPotCusServiceRecord } } = api;

// 潜在客户填写服务记录
export async function fetchPotentialCusServiceRecord(payload) {
  const option = {
    url: potentialCusServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 潜在客户查询
export async function fetchQueryPotCusServiceRecord(payload) {
  const option = {
    url: queryPotCusServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}
