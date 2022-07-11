import pathToRegexp from 'path-to-regexp';
import { getWorkFlowNavigation } from '../../../../../services/commonbase/workFlowNavigation';

export default {

  namespace: 'staffAdmission',

  state: {
    dataLoaded: false,
    workFlowData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/staffAdmission').exec(pathname);
        if (match) {
          // 获取工作流程数据
          dispatch({ type: 'fetchWorkFlowNavigation' });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *fetchWorkFlowNavigation(_, { call, put, select }) {
      const dataLoaded = yield select(state => state.staffAdmission.dataLoaded);
      if (!dataLoaded) {
        const data = yield call(getWorkFlowNavigation, { type: '1', idbz: '' });
        const { records = [] } = data || {};
        yield put({ type: 'changeDataLoaded', payload: true });
        yield put({ type: 'saveWorkFlowData', payload: records });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // 修改dataLoaded状态
    changeDataLoaded(state, { payload }) {
      return {
        ...state,
        dataLoaded: payload,
      };
    },
    // 保存工作流数据
    saveWorkFlowData(state, { payload }) {
      return {
        ...state,
        workFlowData: payload,
      };
    },
  },

};
