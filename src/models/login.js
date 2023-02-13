import lodash from 'lodash';
import {routerRedux} from 'dva/router';
import {AccountLogin, AccountUser, UserBasicInfo} from '../services/login';
import {fetchOperationLog} from '../services/basicservices';
import { FetchPwd } from '../services/amslb/user';
import { AES } from '../utils/aes_utils';
import { APP_SECRET, CLIENTID, ptlx } from '../utils/config';

export default {

  namespace: 'login',

  state: {
    loginCode: '',
    loginNote: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    // 登录操作
    *login({ payload }, { call, put }) {
      const { userName, password, verifyCode = '', authCode = '' } = payload;
      const params = {
        mode: 'user',
        clientId: CLIENTID,
        signature: '',
        ext: '',
      };
      function isJSON(str) {
        if (typeof str == 'string') {
          try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
              return true;
            } else {
              return false;
            }

          } catch (e) {
            return false;
          }
        }
      }
      const isCaptchaStr = sessionStorage.getItem('isCaptcha');
      if (isJSON(isCaptchaStr)) {
        const isCaptchaOb = JSON.parse(isCaptchaStr);
        const authCodeFlag = isCaptchaOb[CLIENTID]; // 0都不开，1开图形验证码，2开短信验证码
        if (Number.parseInt(authCodeFlag, 10) === 1) {
          params.ext = JSON.stringify({ verifyCode });
        } else if (Number.parseInt(authCodeFlag, 10) === 2) {
          params.ext = JSON.stringify({ verifyCode: authCode });
        }
      }
      // aas-aes加密
      AES.setSecret(APP_SECRET);
      const sigStr = JSON.stringify({ mode: params.mode, user: userName, password, timestamp: new Date().getTime() });
      params.signature = AES.encryptBase64(sigStr);
      // 清空session缓存
      sessionStorage.setItem('cacheUrl', ''); // 清除tab页缓存信息
      sessionStorage.setItem('recentlyVisited', ''); // 清除历史记录
      try {
        const response = yield call(AccountLogin, params);
        const {code = 0, note = '', user = {}} = response || {};
        const response2 = yield call(UserBasicInfo, {});
        const {records = []} = response2 || {};
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loginCode: code,
            loginNote: note,
            user,
            userBasicInfo: records,
          },
        });
        yield put({type: 'fetOperationLog'}); // 记录日志
        yield put({ type: 'global/resetAll' });
        yield put({ type: 'global/checkAuth' });
        yield put({ type: 'global/fetchUserBasicInfo', payload: { isFirst: true } });
        yield put(routerRedux.push('/'));
      } catch (error) {
        const { code = 0, note = '' } = error || {};
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loginCode: code,
            loginNote: note,
          },
        });
      }
    },
    *fetOperationLog(_, { call }) {
      // 记录日志
      const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
      yield call(fetchOperationLog, {
        czdx: '9001',
        czff: '',
        czjl: 0,
        czkm: '9001',
        czsm: '用户登录',
        ip,
        ptlx,
      });
    },
    *fetOperationLogOut(_, { select, call }) { // 登出日志
      // 记录日志
      const userBasicInfo = yield select(state => state.global.userBasicInfo);
      const nowTime = new Date();
      const lastlogin = lodash.get(userBasicInfo, 'lastlogin', '--');
      const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
      yield call(fetchOperationLog, {
        czdx: '9002',
        czff: '',
        czjl: 0,
        czkm: '9002',
        czsm: `用户登出,在线时间(${lastlogin}至${nowTime.getFullYear()}-${nowTime.getMonth()}-${nowTime.getDate()} ${nowTime.getHours()}:${nowTime.getMinutes()}:${nowTime.getSeconds()})`,
        ip,
        ptlx,
      });
    },
    // 更密周期到了,修改密码
    *changePassword({ payload }, { call, select, put }) {
      const { userName, oldPwd, newPwd } = payload;
      const salt = new Date().getTime();
      const params = {
        passwordSign: '',
        clientId: CLIENTID,
        salt,
      };
      // aas-aes加密
      AES.setSecret(APP_SECRET);
      params.passwordSign = AES.encryptBase64(JSON.stringify([oldPwd, newPwd, userName, salt]));
      const response = yield call(FetchPwd, params);
      const { code = 0 } = response || {};
      if (code > 0) {
        // 修改成功后关闭修改密码的弹框
        const loginNote = yield select(state => state.login.loginNote);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loginCode: -1,
            loginNote,
          },
        });
      }
    },
    // 获取用户信息
    *user(_, { call, put }) {
      const response = yield call(AccountUser, { cookie: 123 });
      if (response.success === false) {
        // 重新加载页面,刷新页面会去掉各个model里面的数据(有待确定)
        yield put(routerRedux.push('/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const {loginCode, loginNote, user, userBasicInfo} = payload;
      if (loginCode > 0) {
        sessionStorage.setItem('user', JSON.stringify(user)); // 保存用户基本信息
        sessionStorage.setItem('userBasicInfo', JSON.stringify(userBasicInfo)); // 保存用户基本信息
      }
      return {
        loginCode,
        loginNote,
      };
    },
  },

};

