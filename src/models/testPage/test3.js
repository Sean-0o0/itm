import React from 'react';
import { Tag, Divider } from 'antd';

export default {

  namespace: 'test3modal',

  state: {
    columns: [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
          })}
        </span>
      ),
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;">Invite {record.name}</a>
          <Divider type="vertical" />
          <a href="javascript:;">Delete</a>
        </span>
      ),
    }],

    dataSource: [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    }, {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    }],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // history.listen(({ pathname }) => {
      // });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *changeTextAction({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeText', payload });
    },
    *updateColumns({ payload }, { put }) {
      yield put({ type: 'save', payload });
    },
  },


  reducers: {
    save(state, action) {
      debugger;
      return { ...state, ...action.payload };
    },
    changeText(state, { payload }) {
      const { text } = payload;
      return { ...state, text };
    },
  },

};
