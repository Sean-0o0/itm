import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { tool: { des, aes } } = api;

// des加解密
export async function FetchDes(payload) {
  const option = {
    url: des,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// aes加密
export async function FetchAes(payload) {
  const option = {
    url: aes,
    method: 'post',
    data: payload,
  };
  return request(option);
}
