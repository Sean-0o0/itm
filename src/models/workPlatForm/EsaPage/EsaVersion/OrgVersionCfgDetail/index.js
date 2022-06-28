// import { DecryptBase64 } from '../../../../components/Common/Encrypt';
// import { FetchstrategyBasisInformation } from '../../../../services/FmaServices/strategy';

const menuData = [
  {
    key: 'appraisalPlan',
    name: '绩效考核方案',
    icon: 'icon-survey',
    path: '/orgVersionCfgDetail/appraisalPlan',
  },
  {
    key: 'personalAppraisalPlan',
    name: '个人绩效考核方案',
    icon: 'icon-kyc',
    path: '/orgVersionCfgDetail/personalAppraisalPlan',
  },
  {
    key: 'LevelProgramConfig',
    name: '级别方案配置',
    icon: 'icon-ranking-line',
    path: '/orgVersionCfgDetail/LevelProgramConfig',
  },
  {
    key: 'LevelEffectProgram',
    name: '级别生效方案',
    icon: 'icon-sign',
    path: '/orgVersionCfgDetail/LevelEffectProgram',
  },
  {
    key: 'salaryPlanSettings',
    name: '薪酬方案设置',
    icon: 'icon-yunyingguanli',
    path: '/orgVersionCfgDetail/salaryPlanSettings',
  },
  {
    key: 'OrgCommissionMode',
    name: '营业部提成方式',
    icon: 'icon-nav-home',
    path: '/orgVersionCfgDetail/OrgCommissionMode',
  },
  {
    key: 'EmpCommissionMode',
    name: '人员提成方式',
    icon: 'icon-customerLine',
    path: '/orgVersionCfgDetail/EmpCommissionMode',
  },
  {
    key: 'CustCommissionMode',
    name: '客户提成方式',
    icon: 'icon-customerInfo',
    path: '/orgVersionCfgDetail/CustCommissionMode',
  },
];
export default {
  namespace: 'orgVersionCfgDetail',
  state: {
    menuData,
    versionData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        menuData.every((item) => {
          const { path: url } = item;
          if (pathname.startsWith(url)) {
            const versionData = pathname.substring(url.length + 1);
            dispatch({
              type: 'setParams',
              payload: { versionData },
            });
            return false;
          }
          return true;
        });
      });
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *setParams({ payload }, { call, put, select }) {  // eslint-disable-line
      const oldversionData = yield select(state => state.orgVersionCfgDetail.versionData);
      const { versionData } = payload;
      if (versionData && oldversionData !== versionData) {
        yield put({ type: 'saveParams', payload: { versionData } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveParams(state, { payload }) {
      const { versionData } = payload;
      return { ...state, versionData };
    },
  },
};
