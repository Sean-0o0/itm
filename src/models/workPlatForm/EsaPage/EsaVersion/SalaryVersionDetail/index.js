const menuData = [
  {
    key: 'basicInfo',
    name: '基本信息',
    icon: 'icon-profile',
    path: '/salaryVersionDetail/basicInfo',
  },
  {
    key: 'systemIndiCode',
    name: '系统指标代码',
    icon: 'icon-relationship1',
    path: '/salaryVersionDetail/systemIndiCode',
  },
  {
    key: 'systemIndiParams',
    name: '系统指标参数',
    icon: 'icon-xiaoxizhongxin',
    path: '/salaryVersionDetail/systemIndiParams',
  },
  {
    key: 'commissionFormulaDefinition',
    name: '提成公式定义',
    icon: 'icon-fundamentals',
    path: '/salaryVersionDetail/commissionFormulaDefinition',
  },
  {
    key: 'commissionTmpDef',
    name: '提成模板定义',
    icon: 'icon-odd',
    path: '/salaryVersionDetail/commissionTmpDef',
  },
  {
    key: 'assessmentIndiManage',
    name: '绩效考核指标管理',
    icon: 'icon-transaction',
    path: '/salaryVersionDetail/assessmentIndiManage',
  },
  {
    key: 'levelAssessmentDef',
    name: '级别考核方案定义',
    icon: 'icon-ranking-line',
    path: '/salaryVersionDetail/levelAssessmentDef',
  },
  {
    key: 'payTmplFmla',
    name: '薪酬模板公式',
    icon: 'icon-fuwuchanpin',
    path: '/salaryVersionDetail/payTmplFmla',
  },
  {
    key: 'salaryProjectManage',
    name: '薪酬项目管理',
    icon: 'icon-balance',
    path: '/salaryVersionDetail/salaryProjectManage',
  },
];
export default {
  namespace: 'salaryVersionDetail',
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
