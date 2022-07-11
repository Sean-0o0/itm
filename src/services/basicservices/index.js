import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { basicservices: {
  operationLog,
  queryRemind,
  operateRemindChange,
  cusServiceRecord
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

// 提醒消息查询接口
export async function FetchQueryRemind(payload) {
  const option = {
    url: queryRemind,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 提醒状态改变接口
export async function FetchOperateRemindChange(payload) {
  const option = {
    url: operateRemindChange,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取客户服务记录(当日/历史)
export async function getCusServiceRecord(payload) {
  const option = {
    url: cusServiceRecord,
    method: 'post',
    data: payload,
  };
  return request(option);
}