
import commonbase from './commonbase';
import login from './login';
import basicservices from './basicservices';
import sysCommon from './sysCommon';
import amslb from './amslb';
import tool from './tool';
import token from './token';
import staffrelationship from './staffrelationship';
import esa from './EesApi/esa';
import planning from './planning'

const APIPrefix = '/api';

const getAPIs = () => {
  const apisInfo = {
    staffrelationship,
    commonbase, // 系统通用api
    login, // 登录相关接口
    basicservices, // 基础服务
    sysCommon, // 系统通用相关api
    amslb, // 平台GRPC用户类WS接口
    tool,
    token,
    esa,
    planning, //企划平台模块接口
  };
  const apis = {};

  Object.keys(apisInfo).forEach((groupKey) => {
    const items = apisInfo[groupKey];
    const finalItems = {};
    items.forEach((item) => {
      const { key, url, version = 'v5.0.0.1' } = item;
      finalItems[key] = `${APIPrefix}${url}`;
      finalItems[`${key}version`] = version;
    });
    apis[groupKey] = finalItems;
  });
  return apis;
};

export default getAPIs;
