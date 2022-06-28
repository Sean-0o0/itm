import { fetchObject } from '../../../../../../services/sysCommon';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';

export default {

  namespace: 'commissionFormulaDefinition',
  state: {
    indiData: [], // 设置拆分指标
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => { // eslint-disable-line
        if (pathname.includes('/commissionFormulaDefinition/')) {
          const versionData = pathname.substring(pathname.lastIndexOf('/') + 1);
          const versionDataJson =  versionData ? JSON.parse(DecryptBase64(versionData)) : {};
          const version = versionDataJson.VersionId || versionDataJson.parentVersionId || '';
          dispatch({ type: 'resetDatas' });
          dispatch({ type: 'fetchindiData', value: version });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },

    // 重置数据
    *resetDatas(_, { put }) {
      const payload = {
        indiData: [],
      };
      yield put({ type: 'save', payload });
    },

    // 查询拆分指标
    *fetchindiData(payload = {}, { call, put }) {
      const respon = yield call(fetchObject, 'tCFZB', {
        condition: payload.value ? `CANCEL_FLAG=0 AND VERSION=${payload.value}` : 'CANCEL_FLAG=0',
        objectName: 'TINDI_DEF',
        queryOption: {
          "batchNo": 1,
          "batchSize": 9999,
        },
      });
      const { code = 0, records = [] } = respon;
      if (code > 0) {
        const data = [];
        records.forEach((item) => {
          data.push({
            value: item.ID,
            name: item.INDI_NAME,
            ...item,
          });
        });
        yield put({ type: 'save', payload: { indiData: data } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
