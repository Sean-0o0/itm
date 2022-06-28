import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { sysDescription } } = api;

// 获取系统说明
export async function fetchSysDescription(payload) {
  const option = {
    url: sysDescription,
    method: 'post',
    data: payload,
  };
  return request(option);
}
