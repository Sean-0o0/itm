import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { amslb: {
  access, auths, pwd, menu, notifyCount, notifyNotices, notifyRead, link, todoCount, todo,
} } = api;

// 根据Livebos权限验证用户是否允许操作某功能
export async function FetchAccess(payload) {
  const option = {
    url: access,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取当前登录用户的功能权限
export async function FetchAuths(payload) {
  const option = {
    url: auths,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 修改用登录密码
export async function FetchPwd(payload) {
  const option = {
    url: pwd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取系统提醒消息数目
export async function FetchNotifyCount(payload) {
  const option = {
    url: notifyCount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取登录用户的所有菜单项
export async function FetchMenu(payload) {
  const option = {
    url: menu,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取系统提醒未读消息列表
export async function FetchNotifyNotices(payload) {
  const option = {
    url: notifyNotices,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 系统提醒消息标为已读
export async function DoNotifyRead(payload) {
  const option = {
    url: notifyRead,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// livebos扩展
export async function FetchLivebosLink(payload) {
  const option = {
    url: link,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询待办流程数目
export async function FetchTodoCount(payload) {
  const option = {
    url: todoCount,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询待办流程
export async function FetchTodo(payload) {
  const option = {
    url: todo,
    method: 'post',
    data: payload,
  };
  return request(option);
}
