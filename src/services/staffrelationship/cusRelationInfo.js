import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { staffrelationship: { cusRelationInfo } } = api;

// 获取员工客户关系信息
export async function getCusRelationInfo(payload) {
  const option = {
    url: cusRelationInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
