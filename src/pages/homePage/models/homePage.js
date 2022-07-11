import { FetchQueryBaseDblcs, FetchQueryBaseNewClass } from '../../../services/largescreen';

export default {

    namespace: 'homePage',

    state: {
        BaseNewClass: [],
        liquidfillDatas: {// 水球图
            code: 1,
            data: [{
                type: 'MOT',
                name: '待办事项',
                zs: 0,
                wcs: 0,
            },
            // {
            //     type: 'dbrw',
            //     name: '待办任务',
            //     zs: 0,
            //     wcs: 0,
            // },
            ],
        },
    },
    
    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line

            history.listen((location) => {
                if (location.pathname === '/index') {
                    dispatch({ type: 'getAllDatas' });
                }
            });
        },
    },

    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
            yield put({ type: 'save' });
        },
        *getAllDatas({ payload }, { call, put, select }) {  // eslint-disable-line
            const homePageStates = yield select(state => state.homePage); // eslint-disable-line
            // 查询水波球数据
            yield put({ type: 'getLiquidfillDatas', payload: {} });
            yield put({ type: 'getBaseNewClass', payload: {} });
        },
        *getLiquidfillDatas({ payload }, { call, put, select }) {
            const states = yield select(state => state.homePage);
            let { liquidfillDatas = {} } = states;
            const { data = [] } = liquidfillDatas;
            // 待办事项
            const data1 = yield call(FetchQueryBaseDblcs, { ...payload });
            const records1 = ((data1.records || [])[0]) || {};
            data[0] = {
                type: 'MOT',
                name: '待办事项',
                zs: Number.parseInt(records1.dblcs, 10) || 0,
                wcs: Number.parseInt(records1.zlcs, 10) || 0,
            };
            liquidfillDatas = {
                ...liquidfillDatas,
                data,
            };
            yield put({ type: 'saveLiquidfillDatas', payload: { liquidfillDatas: { ...states.liquidfillDatas } } });
        },
        *getBaseNewClass({ payload }, { call, put }) {
            const data = yield call(FetchQueryBaseNewClass, { ...payload });
            const { code = 0, records = [] } = data || {};
            if (code > 0) {
              yield put({ type: 'saveBaseNewClass', payload: { BaseNewClass: records || [] } });
            }
          },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
        saveLiquidfillDatas(state, { payload }) {
            const { liquidfillDatas = state.liquidfillDatas } = payload;
            return {
                ...state,
                liquidfillDatas,
            }
        },
        saveBaseNewClass(state, { payload }) {
            const { BaseNewClass = state.BaseNewClass } = payload;
            return {
                ...state,
                BaseNewClass,
            }
        },
    },

}

