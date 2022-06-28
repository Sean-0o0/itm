import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { userBusinessRole } } = api;

// 获取用户系统授权业务角色
export async function fetchUserBusinessRole(payload) {
  const option = {
    url: userBusinessRole,
    method: 'post',
    data: payload,
  };
  return request(option);
}
