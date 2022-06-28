import TreeUtils from '../../../../../../utils/treeUtils';
import { fetchObject } from '../../../../../../services/sysCommon';
import { fetchUserAuthorityDepartment } from '../../../../../../services/commonbase/userAuthorityDepartment';
import { FetchQuerySalaryProgram, FetchQueryInfoSalaryProgramSno } from '../../../../../../services/EsaServices/salaryManagement';

export default {

  namespace: 'salaryPlanSettings',
  state: {
    gxyybDatas: [], // 营业部数据
    staffClassData: [], // 人员类别数据
    staffLevelData: [], // 人员级别数据
    selectedStaff: [], // 已选人员
    salaryData: [], // 薪酬代码数据
    selectedSalary: [], // 已选薪酬
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => { // eslint-disable-line
        if (pathname.includes('salaryPlanSettings')) {
          dispatch({ type: 'resetDatas' });
          dispatch({ type: 'fetchYybDatas' });
          dispatch({ type: 'fetchSalary' });
          dispatch({ type: 'fetchStaffCategoryLevel' });
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
        gxyybDatas: [],
        staffClassData: [], // 人员类别数据
        staffLevelData: [], // 人员级别数据
        selectedStaff: [], // 已选人员
        salaryData: [], // 薪酬代码数据
        selectedSalary: [], // 已选薪酬
      };
      yield put({ type: 'save', payload });
    },

    // 查询营业部数据
    *fetchYybDatas(_, { call, put }) {
      const data = yield call(fetchUserAuthorityDepartment, {
        paging: 0,
        current: 1,
        pageSize: 10,
        total: -1,
        sort: '',
      });
      const { code = 0, records = [] } = data || {};
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
        const tmpl = [];
        datas.forEach((item) => {
          const { children } = item;
          tmpl.push(...children);
        });
        yield put({ type: 'save', payload: { gxyybDatas: tmpl } });
      }
    },

    // 查询薪酬代码
    *fetchSalary({ payload: { versionId } }, { call, put }) {
      const condition = {
        status: '1',
      }
      if (versionId) {
        condition.version = versionId;
      }
      const data = yield call(fetchObject, 'XCXMDY', { condition });
      const { code = 0, records = [] } = data;
      if (code > 0) {
        yield put({ type: 'save', payload: { salaryData: records || [] } });
      }
    },

    // 薪酬方案查询
    *fetchQuerySalaryProgram({ payload }, { call, put }) {
      const data = yield call(FetchQuerySalaryProgram, payload);
      const dataSno = yield call(FetchQueryInfoSalaryProgramSno, payload);
      const { code: code1 = 0, records: records1 = [] } = data;
      if (code1 > 0) {
        // 保存已选人员数据（包含人员下的薪酬方案数据）
        if (Array.isArray(records1) && records1.length !== 0) {
          const tmplSelectedStaff = [];
          records1.forEach((item) => {
            const selectedStaffObj = item;
            const { payProgram: payProgramTemp } = item;
            const payProgram = JSON.parse(payProgramTemp);
            const tmplPayProgram = [];
            payProgram.forEach((m) => {
              const payProgramItem = m;
              payProgramItem.remk = payProgramItem.REMK;
              delete payProgramItem.REMK;
              payProgramItem.payCodeId = payProgramItem.PAY_CODE_ID;
              delete payProgramItem.PAY_CODE_ID;
              payProgramItem.settType = payProgramItem.SETT_TYPE;
              delete payProgramItem.SETT_TYPE;
              payProgramItem.settTypeName = payProgramItem.SETT_TYPE_NAME;
              delete payProgramItem.SETT_TYPE_NAME;
              payProgramItem.settRestr = payProgramItem.SETT_RESTR;
              delete payProgramItem.SETT_RESTR;
              payProgramItem.leaveIsCal = payProgramItem.LEAVE_IS_CAL;
              delete payProgramItem.LEAVE_IS_CAL;
              tmplPayProgram.push(payProgramItem);
            });
            selectedStaffObj.payProgram = tmplPayProgram;
            tmplSelectedStaff.push(selectedStaffObj);
          });
          yield put({ type: 'save', payload: { selectedStaff: tmplSelectedStaff } });
        } else {
          yield put({ type: 'save', payload: { selectedStaff: [] } });
        }
      }
      const { code: code2 = 0, records: records2 = [] } = dataSno;
      if (code2 > 0) {
        // 保存已选薪酬代码（已排序）
        yield put({ type: 'save', payload: { selectedSalary: records2 } });
      }
    },

    // 更新已选薪酬项目
    *updateSelectedSalary({ payload }, { put }) {
      yield put({ type: 'save', payload });
    },
    // 更新已选人员
    *updateSelectedStaff({ payload }, { put }) {
      yield put({ type: 'save', payload });
    },

    // 查询人员类别人员级别数据
    // eslint-disable-next-line no-unused-vars
    *fetchStaffCategoryLevel({ payload }, { call, put }) {
      const staffClssData = yield call(fetchObject, '', {
        condition: '',
        objectName: 'TEMP_CLASS_DEF',
        queryOption: {
          "batchNo": 1,
          "batchSize": 9999,
        },
      });
      const staffLvData = yield call(fetchObject, '', {
        condition: '',
        objectName: 'TEMP_LEVEL_DEF',
        queryOption: {
          "batchNo": 1,
          "batchSize": 9999,
        },
      });
      const { code: code1 = 0, records: records1 = [] } = staffClssData;
      if (code1 > 0) {
        const tmpl = [];
        records1.forEach((item) => {
          tmpl.push({
            value: item.ID,
            label: item.CLASS_NAME,
            ...item,
          });
        });
        yield put({ type: 'save', payload: { staffClassData: tmpl } });
      }
      const { code: code2 = 0, records: records2 = [] } = staffLvData;
      if (code2 > 0) {
        const tmpl = [];
        records2.forEach((item) => {
          tmpl.push({
            value: item.ID,
            label: item.LEVEL_NAME,
            ...item,
          });
        });
        yield put({ type: 'save', payload: { staffLevelData: tmpl } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
