import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { sysParam } } = api;

// 获取系统说明
export async function fetchSysParam(payload) {
  const option = {
    url: sysParam,
    method: 'post',
    data: payload,
  };
  return request(option);
}
