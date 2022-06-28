import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { staffrelationship: { staffList } } = api;

// 获取员工列表
export async function FetchStaffList(payload) {
  const option = {
    url: staffList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
