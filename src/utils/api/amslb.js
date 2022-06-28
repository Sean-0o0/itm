export default [
  { code: 'access', key: 'access', url: '/amslb/user/access', dis: '根据Livebos权限验证用户是否允许操作某功能' },
  { code: 'auths', key: 'auths', url: '/amslb/user/auths', dis: '获取当前登录用户的功能权限' },
  { code: 'pwd', key: 'pwd', url: '/amslb/user/change/pwd', dis: '修改用登录密码' },
  { code: 'menu', key: 'menu', url: '/amslb/user/menus', dis: '获取登录用户的所有菜单项' },
  { code: '', key: 'notifyCount', url: '/amslb/notify/count', dis: '系统提醒-获取消息数目' },
  { code: '', key: 'notifyNotices', url: '/amslb/notify/notices', dis: '系统提醒-获取未读消息列表' },
  { code: '', key: 'notifyRead', url: '/amslb/notify/read', dis: '未读消息标为已读' },
  { code: '', key: 'link', url: '/amslb/dynamic/link', dis: 'livebos扩展' },
  { code: '', key: 'todoCount', url: '/amslb/workflow/todo/count', dis: '查询待办流程数目' },
  { code: '', key: 'todo', url: '/amslb/workflow/todo', dis: '查询待办流程' },
];
