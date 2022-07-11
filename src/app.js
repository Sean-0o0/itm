import onSessionTimeout from 'livebos-frame/dist/session';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      const { statusCode } = err;
      if (statusCode === 900) {
        // c5会话过期，通过页面消息通知livebos
        onSessionTimeout('*');
      }
    },
  },
};

// 判断会话是否过期
export function render(oldRender) {
  /* const status = window.sessionStorage.getItem('loginStatus') || '0'; // 登录状态: 0|未登录;1|已登录;-1|过期;
  if (status === '1') {
      oldRender();
  } else {
      router.push('/login')
      oldRender();
  } */
  oldRender();
}
