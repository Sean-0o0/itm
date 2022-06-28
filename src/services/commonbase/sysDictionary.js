import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { sysDictionary } } = api;

// 获取系统字典
export async function fetchSysDictionary(payload) {
  const option = {
    url: sysDictionary,
    method: 'post',
    data: payload,
  };
  return request(option);
}
