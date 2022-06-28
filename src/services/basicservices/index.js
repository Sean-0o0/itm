import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { basicservices: {
  operationLog,
},
} = api;


// 登记操作日志
export async function fetchOperationLog(payload) {
  const option = {
    url: operationLog,
    method: 'post',
    data: payload,
  };
  return request(option);
}