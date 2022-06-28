import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { userBasicInfo } } = api;

// 获取用户基本信息
export async function fetchUserBasicInfo(payload) {
  const option = {
    url: userBasicInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
