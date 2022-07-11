import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { token: { tokenAuth } } = api;

// 切换用户
export async function FetchTokenAuth(payload, configObj) {
  const option = {
    url: tokenAuth,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}
