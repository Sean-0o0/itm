export default {

  namespace: 'mainPage',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {   // eslint-disable-line
      history.listen(({ pathname }) => { // eslint-disable-line
      });
    },
  },

  effects: {
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};

