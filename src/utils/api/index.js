import commonbase from './commonbase';
import login from './login';
import basicservices from './basicservices';
import sysCommon from './sysCommon';
import amslb from './amslb';
import recentaccessmenu from './recentaccessmenu';
import tool from './tool';
import token from './token';
import taskcenter from './taskcenter';
import largescreen from './largescreen';
import motProduction from './motProduction'; // MOT配置和督导执行
import reportcenter from './reportcenter';
import processCenter from './processCenter';
import dataCenter from './dataCenter';
import pmsServices from "./pmsServices";

const APIPrefix = '/api';

const getAPIs = () => {
  const apisInfo = {
    commonbase, // 系统通用api
    login, // 登录相关接口
    basicservices, // 基础服务
    sysCommon, // 系统通用相关api
    amslb, // 平台GRPC用户类WS接口
    recentaccessmenu, // 用户最近访问菜单
    tool,
    token,
    taskcenter,
    largescreen,// 查询运作类指标状态
    motProduction, // MOT配置和督导执行
    reportcenter,//自定义报表
    processCenter,//流程中心
    dataCenter, //数据中心
    pmsServices,//pms微服务
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
