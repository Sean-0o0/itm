import request from '../utils/request';
import config from '../utils/config';

const { api } = config;
const { commonbase: { userSysRole, userBasicInfo, sysVersionNum, sysVersionList, checkWhtLstIP }, login: { auth, logout, user, tokenAuth, captchaFetchSms } } = api;

// 登录接口
export async function AccountLogin(params) {
  const option = {
    url: auth,
    method: 'post',
    data: params,
  };
  return request(option);
}

// 根据token登录
export async function AccountLoginByToken(params) {
  const option = {
    url: tokenAuth,
    method: 'post',
    data: params,
  };
  return request(option);
}

// 退出接口
export async function AccountLogout() {
  const option = {
    url: logout,
    method: 'post',
  };
  return request(option);
}
// 查询用户信息
export async function AccountUser(params) {
  const option = {
    url: user,
    method: 'post',
    data: params,
  };
  return request(option);
}
// 查询系统授权业务角色
export async function UserBusinessRole(params) {
  const option = {
    url: userSysRole,
    method: 'post',
    data: params,
  };
  return request(option);
}
// 获取用户基本信息(包含系统角色信息)
export async function UserBasicInfo(params) {
  const option = {
    url: userBasicInfo,
    method: 'post',
    data: params,
  };
  return request(option);
}
// 获取系统当前版本号
export async function SysVersionNum(params) {
  const option = {
    url: sysVersionNum,
    method: 'post',
    data: params,
  };
  return request(option);
}
// 获取系统版本信息列表
export async function SysVersionList(params) {
  const option = {
    url: sysVersionList,
    method: 'post',
    data: params,
  };
  return request(option);
}

// 获取短信验证码
export async function FetchSmsCaptcha(params) {
  const option = {
    url: captchaFetchSms,
    method: 'get',
    data: params,
  };
  return request(option);
}

// 获取短信验证码
export async function FetchCheckWhtLstIP(params) {
  const option = {
    url: checkWhtLstIP,
    method: 'post',
    data: params,
  };
  return request(option);
}
