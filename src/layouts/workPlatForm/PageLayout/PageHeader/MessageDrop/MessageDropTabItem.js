import React from 'react';
import { Link } from 'umi';
import Moment from 'moment';
import { FetchUserMsgRmdList, FetchUserReadMsgRmd } from '../../../../../services/commonbase/index';
import FetchDataTable from '../../../../../components/Common/FetchDataTable';
import MessageTypes from './MessageTypes';

class MessageDropTabItem extends React.Component {
  state = {
    payload: {
      type: '',
      keyword: '',
      isread: '', // 0：未读，1：已读
    },
  };
  componentDidMount() {
    this.fetchData();
  }
  handleReadMsg = (msgId) => {
    const { onRefresh } = this.props;
    FetchUserReadMsgRmd({
      msg_id: msgId || '',
    }).then((ret = {}) => {
      const { code = 0 } = ret;
      if (code > 0) {
        // 刷新数据
        if (onRefresh && typeof onRefresh === 'function') {
          onRefresh.call(this);
        }
        this.fetchData();
      }
    });
  }
  fetchData = (typeKey = this.props.typeKey) => {
    let type;
    MessageTypes.map((item) => {
      const { type: itemType } = item;
      if (item.key === typeKey) {
        type = itemType;
        return true;
      }
      return false;
    });
    this.setState({
      payload: {
        type,
        keyword: '',
        isread: '',
      },
    });
  }
  assembleColumns = () => {
    const columns = [
      {
        dataIndex: 'title',
        title: '消息主题',
        render:
          (_, record) => {
            const text = record.title ? (record.title.length > 30 ? `${record.title.substring(0, 30)}...` : record.title) : '--'; // eslint-disable-line
            return (
              <Link to={record.link} target="_blank" rel="noopener noreferrer" onClick={() => { this.handleReadMsg(record.msgId); }}>
                <span style={{ color: record.isread === '1' ? '#484747' : '#30AAE4' }}>
                  {text}
                </span>
              </Link>
            );
          },
      },
      {
        dataIndex: 'sndUser',
        title: '发送人',
        render: text => text || '--',
      },
      {
        dataIndex: 'rmdTm',
        title: '提醒时间',
        render: (text) => {
          if (text && text !== '') {
            return Moment(text).format('YYYY年MM月DD日');
          }
          return '--';
        },
      },
    ];
    return columns;
  }
  render() {
    const { payload } = this.state;
    const tableProps = {
      rowKey: record => record.msgId,
      rowClassName: (record, chosenRowKey) => `${record.msgId === chosenRowKey ? 'active' : ''}`,
      columns: this.assembleColumns(),
      fetch: {
        service: payload.type && FetchUserMsgRmdList,
        params: {
          ...payload,
        },
      },
      rowSelection: null,
      pagination: {
        pageSize: 10,
        showSizeChanger: false,
      },
    };
    return (
      <FetchDataTable
        className="m-table-customer"
        {...tableProps}
      />
    );
  }
}

export default MessageDropTabItem;
