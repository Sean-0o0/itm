
import { FetchMenu } from '../../../services/amslb/user';
import { FetchUserUnreadMsgNum } from '../../../services/commonbase/index';

export default {

  namespace: 'mainPage',

  state: {
    menuTree: [], // 获取登录用户的所有菜单项
    menuTreeLoaded: false,
    menuData: [
      {
        key: 'homePage',
        name: '首页',
        icon: 'icon-nav-home',
        path: '/index',
      },
      {
        key: 'customer',
        name: '客户',
        icon: 'icon-nav-customer',
        children: [
          {
            key: 'myCustomer',
            name: '我的客户',
            path: '/myCustomer',
          },
        ],
      },
      {
        key: 'staff',
        name: '人员',
        icon: 'icon-nav-user',
        children: [
          {
            key: 'staffManagement',
            name: '人员管理',
            path: '/staffManagement',
          },
          {
            key: 'staffAdmission',
            name: '入离职管理',
            path: '/staffAdmission',
          },
        ],
      },
      {
        key: 'product',
        name: '产品',
        icon: 'icon-nav-product',
        children: [
          {
            key: 'productList',
            name: '产品列表',
            path: '/product/productList',
          },
          {
            key: 'filterProduct',
            name: '产品筛选',
            path: '/product/filterProduct',
          },
          {
            key: 'hisProductList',
            name: '历史重点产品',
            path: '/product/hisProductList',
          },
        ],
      },
      {
        key: 'mot',
        name: 'MOT',
        icon: 'icon-nav-work',
        children: [
          { // MOT-MOT事件
            key: 'motEvent',
            name: '人员MOT',
            path: '/motEvent',
          },
          { // MOT-MOT事件
            key: 'motAnalysis',
            name: '营业部MOT',
            path: '/motAnalysis',
          },
          { // MOT-MOT类型
            key: 'motType',
            name: 'MOT知识库',
            path: '/motType',
          },
        ],
      },
      {
        key: 'work',
        name: '工作',
        icon: 'icon-nav-sale',
        children: [
          { // 工作日志
            key: 'workLog',
            name: '工作日志',
            path: '/workLog',
          },
        ],
      },
      {
        key: 'serviceProduct',
        name: '服务',
        icon: 'icon-nav-service',
        children: [
          {
            key: 'serviceProductList',
            name: '服务产品列表',
            path: '/serviceProductList',
          },
          {
            key: 'serviceProductManage',
            name: '服务产品列表管理',
            path: '/serviceProductManage',
          },
          {
            key: 'msgCenter',
            name: '消息中心',
            path: '/msgCenter',
          },
        ],
      },
      {
        key: 'marketing',
        name: '营销',
        icon: 'icon-ranking-line',
        children: [
          {
            key: 'customerDevelop',
            name: '客户开发',
            path: '/customerDevelop',
          },
        ],
      },
    ],
    messageDrop: {
      unreadMsgNums: {},
      unreadMOTNums: 0,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {   // eslint-disable-line
      history.listen(({ pathname }) => { // eslint-disable-line
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    // 获取登录用户的所有菜单项
    *fetchMenu({ payload }, { call, put }) {
      const response = yield call(FetchMenu, payload);
      const { data = {} } = response;
      yield put({
        type: 'save',
        payload: {
          menuTree: (data.menuTree && data.menuTree.menu && data.menuTree.menu.item ? data.menuTree.menu.item : []),
          menuTreeLoaded: true,
        },
      });
    },
    // 获取头部消息提醒信息
    *fetchMessageNoticeNum({ payload }, { call, put }) {
      const result = yield call(FetchUserUnreadMsgNum, payload);
      const { records = [] } = result || {};
      yield put({
        type: 'saveMessageDrop',
        payload: {
          unreadMsgNums: records && records.length > 0 ? records[0] : [],
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveMessageDrop(state, { payload }) {
      const { messageDrop } = state;
      return {
        ...state,
        messageDrop: {
          ...messageDrop,
          ...payload,
        },
      };
    },
  },

};

