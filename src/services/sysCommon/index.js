import request from '../../utils/request';
import config from '../../utils/config';
import { getObjKey } from '../../utils/dictUtils';

const { api } = config;
const { sysCommon: { direct, objectQuery } } = api;

// 通用对象查询接口（通过对象查询通用接口配置表tObjQuerySetting 来查询对应的对象数据）
export async function FetchObjectQuery(payload) {
  const option = {
    url: objectQuery,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询LiveBOS对象的数据接口（C5标准direct接口，需要配置化微服务定义TC_DB_SERVICE_DEF配置）
export async function FetchSysCommonTable(payload) {
  const { objectName = '', condition, queryOption = {} } = payload;
  const { orderBy = '' } = queryOption;
  const tmplName = `objquery-${objectName.toLocaleLowerCase()}`;
  const tmplPayload = {
    serviceId: tmplName,
    payload: { macro: '1', ...condition },
  };
  const option = {
    url: direct,
    method: 'post',
    data: tmplPayload,
  };
  return request(option);
}

export async function fetchObject(name, opt = {}) {
  const objectName = getObjKey(name);
  const response = await FetchSysCommonTable({ objectName, ...opt });
  return {
    name: objectName,
    ...response,
  };
}
