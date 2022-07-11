import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { basicservices: { cusMsgBlackList, cusMsgBlackListOperate } } = api;

// 消息黑名单
export async function fetchCusMsgBlackList(payload) {
  const option = {
    url: cusMsgBlackList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function fetchCusMsgBlackListOperate(payload) {
  const option = {
    url: cusMsgBlackListOperate,
    method: 'post',
    data: payload,
  };
  return request(option);
}
