import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { userSysRole } } = api;

// 获取用户基础应用平台业务角色
export async function fetchUserSysRole(payload) {
  const option = {
    url: userSysRole,
    method: 'post',
    data: payload,
  };
  return request(option);
}
