import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { userMenuProject,
  userDefaultProject,
  userNoticeList,
  userNoticeDtl,
  userMsgRmdList,
  userReadMsgRmd,
  userUnreadMsgNum,
  getNotification,
  userProjectUpdate,
  userShortcutMenuConfig,
  queryShortcutMenu,
  updateShortcutMenu,
  userSuggest,
  achieveAuthCode,
  resetPassword,
  qryLoginPageConf,
  userWorkflowList,
  queryListDictionary,
  querySalaryFormulaConf,
  userAuthorityDepartment,
} } = api;

// 首页 -- 获取公司公告
export async function FetchUserNoticeList(payload) {
  const option = {
    url: userNoticeList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页 -- 获取公告详情
export async function FetchUserNoticeDtl(payload) {
  const option = {
    url: userNoticeDtl,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页 -- 获取消息提醒
export async function FetchUserMsgRmdList(payload) {
  const option = {
    url: userMsgRmdList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页 -- 阅读消息提醒
export async function FetchUserReadMsgRmd(payload) {
  const option = {
    url: userReadMsgRmd,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页 -- 未读消息提醒数
export async function FetchUserUnreadMsgNum(payload) {
  const option = {
    url: userUnreadMsgNum,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页 -- 获取铃铛状态
export async function FetcBellNum(payload) {
  const option = {
    url: getNotification,
    method: 'get',
    data: payload,
  };
  return request(option);
}

// 首页 -- 获取菜单
export async function FetcUserMenuProject(payload) {
  const option = {
    url: userMenuProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 首页 -- 获取默认菜单 -- 弃用
export async function FetcUserDefaultProject(payload) {
  const option = {
    url: userDefaultProject,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 首页 -- 记录用户选择的菜单
export async function FetCuserProjectUpdate(payload) {
  const option = {
    url: userProjectUpdate,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 目录 获取用户的快捷菜单配置
export async function FetchuserShortcutMenuConfig(payload) {
  const option = {
    url: userShortcutMenuConfig,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 快捷菜单 获取所有的快捷菜单
export async function FetchqueryShortcutMenuConfig(payload) {
  const option = {
    url: queryShortcutMenu,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 快捷菜单 更新用户勾选的快捷菜单
export async function FetchupdateShortcutMenuConfig(payload) {
  const option = {
    url: updateShortcutMenu,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 快捷菜单 用户反馈意见
export async function FetchUserSuggest(payload) {
  const option = {
    url: userSuggest,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取短信验证码
export async function FetchAchieveAuthCode(payload) {
  const option = {
    url: achieveAuthCode,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 重置登录密码
export async function FetchResetPassword(payload) {
  const option = {
    url: resetPassword,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询登录页面配置
export async function FetchQryLoginPageConf(payload) {
  const option = {
    url: qryLoginPageConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询已办流程
export async function FetchUserWorkflowList(payload) {
  const option = {
    url: userWorkflowList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 系统通用  获取数据字典
export async function FetchQueryListDictionary(payload) {
  const option = {
    url: queryListDictionary,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 系统通用  查询薪酬公式配置项目
export async function FetchQuerySalaryFormulaConf(payload) {
  const option = {
    url: querySalaryFormulaConf,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 获取用户数据权限营业部数据
export async function FetchuserAuthorityDepartment(payload) {
  const option = {
    url: userAuthorityDepartment,
    method: 'post',
    data: payload,
  };
  return request(option);
}