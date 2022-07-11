import { fetchSysDictionary } from '../services/commonbase/sysDictionary';
import { fetchSysDescription } from '../services/commonbase/sysDescription';
import { fetchSysParam } from '../services/commonbase/sysParam';
// import { fetchObject } from '../services/sysCommon';
import { AccountUser, AccountLogout, UserBusinessRole, UserBasicInfo } from '../services/login';
import { FetchAuths } from '../services/amslb/user';
import TreeUtils from '../utils/treeUtils';
// import { fetchObject } from '../services/sysCommon';
import { fetchUserAuthorityDepartment } from '../services/commonbase/userAuthorityDepartment';

export default {

  namespace: 'global',

  state: {
    theme: window.localStorage.getItem('userTheme') || 'blue-dark-theme', // eslint-disable-line
    hasAuthed: false, // 表示是否向服务器发送过认证请求
    dictionary: { loading: true }, // 用来存放字典信息
    objects: { loading: true }, // 用来存放对象信息
    userBusinessRole: '', // 系统授权业务角色
    userBasicInfo: { loading: true }, // 获取用户基本信息
    authorities: { loading: true }, // 获取用户功能权限点
    authsOrOpert: {}, // 获取用户功能权限点及自定义方法
    authUserInfo: {},
    sysDescription: [], // 获取系统说明数据
    sysParam: [], // 平台url|邮箱附件大小
    isHideMenu: false,
    authoritiesFlag: false, // 获取用户功能权限点接口是否调用过
    userHighestLevelDept: '', // 当前登录人最高级别的营业部id
    globalDepartments: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(({ pathname }) => {
        const blackList = ['/login', '/logout', '/403'];
        if (!blackList.includes(pathname)) {
          dispatch({ type: 'checkAuth' }); // 每次访问新路由的时候,检查一下会话
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    checkAuth: [
      function* (_, { call, put, all }) {  // eslint-disable-line
        const data = yield call(AccountUser); // 此处不捕获异常,将异常抛到dva最外层的onError事件捕捉,如果过期就跳转到登录页面
        if (data.success) {
          yield put({
            type: 'onAuthDataChange',
            payload: {
              hasAuthed: true,
              authUserInfo: data.user || {},
            },
          });
          sessionStorage.setItem('user', JSON.stringify(data.user || {}));
          window.sessionStorage.setItem('loginStatus', '1'); // 登录状态: 0|未登录;1|已登录;-1|过期;
          // localStorage.setItem('loginStatus','1');
          yield all([
            put({ type: 'fetchDictionary' }), // 每次访问的时候检查一下字典是否查询了,如果没有查询,那么就查一下
            put({ type: 'fetchUserBasicInfo', payload: {} }), // 每次登陆的时候获取系统授权业务角色
            put({ type: 'fetchUserAuthorities' }), // 每次登陆的时候获取权限点信息
            put({ type: 'fetchDescription' }), // 获取系统说明
            put({ type: 'fetchObjects' }), // 获取系统liveBos对象
            put({ type: 'fetchParam' }), // 获取平台url
            // put({ type: 'fetchUserHighestLevelDepartment' }), // 获取用户最高级别营业部
          ]);
        }
      },
      { type: 'takeLatest' },
    ],
    // 注销操作
    *logout(_, { call, put }) {
      // // 改变登录的状态
      yield call(AccountLogout);
      window.sessionStorage.setItem('loginStatus', '0'); // 登录状态为未登录
      sessionStorage.setItem('user', null); // 清除用户基本信息
      sessionStorage.setItem('cacheUrl', ''); // 清除tab页缓存信息
      sessionStorage.setItem('recentlyVisited', '');// 清除历史记录
      localStorage.setItem('loginStatus','0');
      // 重新加载页面,刷新页面会去掉各个model里面的数据
      window.location.reload();
      yield put({
        type: 'onAuthDataChange',
        payload: { hasAuthed: false },
      });
    },
    // 获取用户基本信息
    *fetchUserBasicInfo({ payload }, { select, call, put }) {
      const userBasicInfo = yield select(state => state.global.userBasicInfo);
      const { isFirst } = payload;
      if (userBasicInfo.loading) {
        yield put({
          type: 'saveUserBasicInfo',
          payload: { userBusinessRole: '', userBasicInfo: { loading: false } },
        });
        try {
          const data = yield call(UserBasicInfo);
          const { code = 0, records = [] } = data || {};
          if (code > 0) {
            let userBusinessRole = '';
            const userBasicInfoTemp = { loading: false };
            if (records && records.length === 1) {
              const record = records[0];
              const finalRecord = {};
              const keys = Object.keys(record);
              keys.forEach((item) => {
                if (record[item] instanceof Object) {
                  const chiKeys = Object.keys(record[item]);
                  chiKeys.forEach((chiItem) => {
                    finalRecord[chiItem] = record[item][chiItem] || '';
                  });
                } else {
                  finalRecord[item] = record[item];
                }
              });
              const { xtjs = '' } = finalRecord;
              userBusinessRole = xtjs;
              Object.assign(userBasicInfoTemp, finalRecord);
            }
            if (isFirst) {
              const { userid } = userBasicInfoTemp;
              if (userid) {
                localStorage.setItem('firstUserID', userid);
              }
            }
            yield put({
              type: 'saveUserBasicInfo',
              payload: { userBusinessRole, userBasicInfo: userBasicInfoTemp },
            });
          }
        } catch (error) {
          // 请求如果出错,切换路由时尝试再次请求数据
          yield put({
            type: 'saveUserBasicInfo',
            payload: { userBusinessRole: '', userBasicInfo: { loading: true } },
          });
        }
      }
    },
    *fetchDictionaryUserBusinessRole(_, { call, put }) {
      try {
        const data = yield call(UserBusinessRole);
        const { code = 0, records = [] } = data || {};
        if (code > 0) {
          let userBusinessRole = '';
          records.forEach((item) => {
            const { ywjs } = item;
            userBusinessRole = ywjs;
          });
          yield put({
            type: 'save',
            payload: { userBusinessRole },
          });
        }
      } catch (error) {
        // do nothing
      }
    },
    *fetchUserAuthorities(_, { select, call, put }) {
      const authorities = yield select(state => state.global.authorities);
      if (authorities.loading) {
        yield put({
          type: 'saveUserAuthorities',
          payload: { loading: false },
        });
        try {
          const data = yield call(FetchAuths, { loadOption: 0, muduleName: '' });
          const { records = [] } = data || {};
          // 如果有权限信息,那么就转化成对象的格式
          if (records && records.length > 0) {
            const authoritiesData = { loading: false };
            const authsOrOpertData = {};
            records.forEach((item) => {
              const { objectName = '', commands = [], operates = 0 } = item || {};
              if (objectName !== '') {
                authoritiesData[objectName] = commands;
                authsOrOpertData[objectName] = commands;
                authsOrOpertData[objectName].push(operates);
              }
            });
            yield put({
              type: 'saveUserAuthorities',
              payload: authoritiesData,
            });
            yield put({
              type: 'saveUserAuthsOrOpert',
              payload: authsOrOpertData,
            });
          }
        } catch (error) {
          // 请求如果出错,切换路由时尝试再次请求数据
          yield put({
            type: 'saveUserAuthorities',
            payload: { loading: true },
          });
        }
        yield put({
          type: 'saveUserAuthoritiesFlag',
          payload: true,
        });
      }
    },
    *fetchDictionary(_, { select, call, put }) {
      // const hasAuthed = yield select(state => state.global.hasAuthed);
      const dictionaryInstate = yield select(state => state.global.dictionary);
      // if (hasAuthed && (!dictionaryInstate || dictionaryInstate.loading || Object.keys(dictionaryInstate).length === 1)) {
      if (!dictionaryInstate || dictionaryInstate.loading || Object.keys(dictionaryInstate).length === 1) {
        yield put({
          type: 'saveDictionary',
          payload: { loading: false },
        });
        try {
          const data = yield call(fetchSysDictionary, { fldm: '' });
          const { code = 0, records = [] } = data || {};
          const dictionary = { loading: false };
          if (code > 0) {
            records.forEach((item) => {
              const { fldm = '' } = item;
              if (fldm !== '' && dictionary[fldm]) {
                dictionary[fldm].push(item);
              } else if (fldm !== '' && !dictionary[fldm]) {
                dictionary[fldm] = [];
                dictionary[fldm].push(item);
              }
            });
          }
          yield put({
            type: 'saveDictionary',
            payload: dictionary,
          });
        } catch (error) {
          // 请求如果出错,切换路由时尝试再次请求数据
          yield put({
            type: 'saveDictionary',
            payload: { loading: true },
          });
        }
      }
    },
    *fetchObjects(_, { select, all, call, put }) {
      const objects = yield select(state => state.global.objects);
      if (objects.loading) {
        yield put({
          type: 'saveObjects',
          payload: { loading: false },
        });
        try {
          // 异步调用这两个接口,并获取其数据
          const datas = yield all([
            // 客户级别
            // call(fetchObject, 'khjbObj'),
            // MOT事件类型
            // call(fetchObject, 'motlxObj'),
            // // 客户等级
            // call(fetchObject, 'TKHJBDY'),
            // 营业部数据
            // call(fetchObject, 'lbOrganization'),
          ]);
          // 解析数据,将records存起来
          const objectsMap = { loading: false };
          datas.forEach((item) => {
            const { name = 'yyb', records = [] } = item || {};
            objectsMap[name] = records;
          });
          yield put({
            type: 'saveObjects',
            payload: objectsMap,
          });
        } catch (error) {
          // do nothing
          // 请求如果出错,切换路由时尝试再次请求数据
          yield put({
            type: 'saveObjects',
            payload: { loading: true },
          });
        }
      }
    },
    *fetchParam(_, { select, call, put }) {
      const sysParam = yield select(state => state.global.sysParam);
      if (sysParam && sysParam.length === 0) {
        const data = yield call(fetchSysParam, {csmc:""});
        const { code = 0, records = [] } = data || {};
        if (code > 0) {
          let isSwitchUser = '';
          let livebosPrefix = '';
          let mdPrefix = '';
          let sdoPrefix = '';
          let didiPrefix = '';
          let menuExpansion = ''; // 菜单是否默认展开
          let taskcenterclass = '';
          let usrPwdStrengthLevel = ''; // 密码强制安全等级
          let usrPwdMinLength = ''; // 密码最小长度
          let complianceCheck = ''; // 客户全景--是否需要签署协议 1：需要|0：不需要
          let potentialCusIsAudit = ''; // 潜在客户是否需要审核 1：需要|0：不需要
          let openSecureMarker = ''; // 是否开启安全水印 1：开启|0：关闭
          let sessionTimeout = ''; // 系统会话过期时间
          let homepageCheckSysRoleType = ''; // 首页是否判断用户角色类型 1：启用 | 0：不启用
          let refreshWebPage = ''; //大屏页面刷新时间
          let sysName = ''; //系统名称
          records.forEach((item) => {
            const { csmc = '', csz = '' } = item || {};

            switch (csmc) {
              case ('UserSwitchEnable'): isSwitchUser = csz;
                break;
              case ('system.glpt.url'): livebosPrefix = csz;
                break;
              case ('system.gzpt.url'): mdPrefix = `${csz}/count`;
                break;
              case ('system.zxtg.url'): sdoPrefix = csz;
                break;
              case ('system.didi.url'): didiPrefix = csz;
                break;
              case ('system.menu.isexpansion'): menuExpansion = csz;
                break;
              case ('sys.taskcenter.classifyrolerule'): taskcenterclass = csz;
                break;
              case ('password.strength.level'): usrPwdStrengthLevel = csz;
                break;
              case ('password.strength.length.min'): usrPwdMinLength = csz;
                break;
              case ('CustomerPanorama.ComplianceCheck'): complianceCheck = csz;
                break;
              case ('CpotentialCusIsAudit'): potentialCusIsAudit = csz;
                break;
              case ('openSecureMarker'): openSecureMarker = csz;
                break;
              case ('c5.session.timeout'): sessionTimeout = csz || 180000;
                break;
              case ('HomepageCheckSysRoleType'): homepageCheckSysRoleType = csz;
                break;
              case ('refresh-webpage'): refreshWebPage = csz;
                break;
              case ('SysName'): sysName = csz;
                break;
              default: break;
            }
          });
          localStorage.setItem('isSwitchUser', isSwitchUser);
          localStorage.setItem('livebos', livebosPrefix);
          localStorage.setItem('md', mdPrefix);
          localStorage.setItem('sdo', sdoPrefix);
          localStorage.setItem('didi', didiPrefix);
          localStorage.setItem('menuExpansion', menuExpansion);
          localStorage.setItem('taskcenterclass', taskcenterclass);
          localStorage.setItem('usrPwdStrengthLevel', usrPwdStrengthLevel);
          localStorage.setItem('usrPwdMinLength', usrPwdMinLength);
          localStorage.setItem('complianceCheck', complianceCheck);
          localStorage.setItem('potentialCusIsAudit', potentialCusIsAudit);
          localStorage.setItem('openSecureMarker', openSecureMarker);
          localStorage.setItem('sessionTimeout', sessionTimeout);
          localStorage.setItem('homepageCheckSysRoleType', homepageCheckSysRoleType);
          localStorage.setItem('refreshWebPage', refreshWebPage);
          localStorage.setItem('sysName', sysName);
          yield put({ type: 'save', payload: { sysParam: records } });
        }
      }
    },
    *fetchDescription(_, { select, call, put }) {
      const sysDescription = yield select(state => state.global.sysDescription);
      if (sysDescription && sysDescription.length === 0) {
        const data = yield call(fetchSysDescription, {});
        const { code = 0, records = [] } = data || [];
        if (code > 0) {
          yield put({ type: 'save', payload: { sysDescription: records } });
        }
      }
    },

    *fetchUserHighestLevelDepartment(_, { call, put }) {
      const data = yield call(fetchUserAuthorityDepartment, { paging: 0, current: 1, pageSize: 10, total: -1, sort: '' });
      const { code = 0, records = [] } = data || {};
      // 如果有权限信息,那么就转化成对象的格式
      if (code > 0 && records && records.length > 0) {
        const { yybid } = records[0] || {};
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
        const globalDepartments = [];
        datas.forEach((item) => {
          const { children } = item;
          globalDepartments.push(...children);
        });
        yield put({ type: 'save', payload: { globalDepartments, userHighestLevelDept: yybid } });
      }
    },

    *resetAll(_, { put }) {
      yield put({ type: 'resetData' });
    },
    *hideMenu(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          isHideMenu: true,
        },
      });
    },
    *showMenu(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          isHideMenu: false,
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    changeTheme(state, { payload }) {
      const { theme } = payload;
      window.localStorage.setItem('userTheme', theme);// eslint-disable-line
      return {
        ...state,
        theme,
      };
    },
    onAuthDataChange(state, { payload }) {
      const { hasAuthed, authUserInfo } = payload;
      return {
        ...state,
        hasAuthed, // 表示是否向服务器发送过认证请求
        authUserInfo,
      };
    },
    saveUserBasicInfo(state, { payload }) {
      const { userBusinessRole, userBasicInfo } = payload;
      return {
        ...state,
        userBusinessRole,
        userBasicInfo,
      };
    },
    saveUserAuthsOrOpert(state, { payload }) {
      return {
        ...state,
        authsOrOpert: payload,
      };
    },
    saveUserAuthorities(state, { payload }) {
      return {
        ...state,
        authorities: payload,
      };
    },
    saveUserAuthoritiesFlag(state, { payload }) {
      return {
        ...state,
        authoritiesFlag: payload,
      };
    },
    saveDictionary(state, { payload }) {
      return {
        ...state,
        dictionary: payload,
      };
    },
    saveObjects(state, { payload }) {
      return {
        ...state,
        objects: payload,
      };
    },
    resetData(state) {
      return {
        ...state,
        hasAuthed: false, // 表示是否向服务器发送过认证请求
        dictionary: { loading: true }, // 用来存放字典信息
        objects: { loading: true }, // 用来存放对象信息
        userBusinessRole: '', // 系统授权业务角色
        userBasicInfo: { loading: true }, // 获取用户基本信息
        authorities: { loading: true }, // 获取用户功能权限点
        authoritiesFlag: false, // 获取用户功能权限点接口是否调用过
      };
    },
  },
};
