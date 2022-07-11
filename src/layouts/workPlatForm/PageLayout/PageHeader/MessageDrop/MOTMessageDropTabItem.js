import React, { Fragment } from 'react';
import { message } from 'antd';
import { getMotMsgToDoEventStatistics, getMotListCusDimension } from '../../../../../services/motbase';
import FetchDataTable from '../../../../../components/Common/FetchDataTable';
import MessageTypes from './MessageTypes';
import ExecutionModal from '../../../../../components/WorkPlatForm/MainPage/Mot/MotEvent/ExecutionModal';
import Execution from '../../../../../components/WorkPlatForm/MainPage/Mot/x/Execution';
// import CustomerDimensionExecution from '../../../../../components/WorkPlatForm/MainPage/Mot/MotEvent/CustomerDimensionExecution';

class MessageDropTabItem extends React.Component {
  state = {
    payload: {
      type: '',
      keyword: '',
      isread: 0, // 0：未读，1：已读
    },
    record: {},
    loading: true,
    executionVisible: false,
    customer: {},
  };
  componentDidMount() {
    this.fetchData();
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
        isread: 0,
      },
    });
  }
  FetchCustomerProfile = (record) => {
    this.setState({ loading: true });
    const { sjid = '', khh = '', fwksrq: rq = '' } = record;
    getMotListCusDimension({
      current: 1,
      pageSize: 10,
      paging: 1,
      total: -1,
      sort: '',
      motlx: '',
      zzc: '',
      khh,
      sjid,
      ksrq: rq || '',
      jsrq: rq || '',
    }).then((response) => {
      const { records = [] } = response;
      this.setState({ loading: false, executionVisible: true, customer: records[0] || {} });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleExecute = (e, khid, record) => {
    this.setState({ record, executionVisible: true });
    this.FetchCustomerProfile(record);
  }
  assembleColumns = () => {
    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) => {
          return (
            <a onClick={e => this.handleExecute(e, record.khid, record)}>
              <div className="m-table-icon">执行</div>
            </a>
          );
        },
      },
      {
        dataIndex: 'lxmc',
        title: '类型名称',
        render: text => text || '--',
      },
      {
        dataIndex: 'khh',
        title: '客户号',
        render: text => text || '--',
      },
      {
        dataIndex: 'khxm',
        title: '客户名称',
        render: text => text || '--',
      },
      {
        dataIndex: 'nr',
        title: '内容',
        width: 400,
        render: text => text || '--',
      },
      {
        dataIndex: 'fwksrq',
        title: '服务开始时间',
        render: text => text || '--',
      },
      {
        dataIndex: 'fwjzrq',
        title: '服务截止时间',
        render: text => text || '--',
      },
    ];
    return columns;
  }
  handleCancelExecute = () => {
    this.setState({ executionVisible: false });
  }
  handleRefresh = () => {
    this.fetchData();
    const { onRefresh } = this.props;
    if (onRefresh) {
      onRefresh();
    }
  }
  render() {
    const { payload, executionVisible, loading, record: { sjid = '', khh = '', fwksrq: rq = '' }, customer } = this.state;
    const { typeKey } = this.props;
    const tableProps = {
      rowKey: record => record.sjid,
      rowClassName: (record, chosenRowKey) => `${record.msgId === chosenRowKey ? 'active' : ''}`,
      columns: this.assembleColumns(typeKey),
      fetch: {
        service: payload.type && getMotMsgToDoEventStatistics,
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
      <Fragment>
        <FetchDataTable
          className="m-table-customer"
          {...tableProps}
        />
        {
          !loading && (
            <ExecutionModal
              title="事件执行-客户维度"
              visible={executionVisible}
              onCancel={this.handleCancelExecute}
            >
              {executionVisible && (
                <Execution
                  type={1} // 客户维度执行
                  dimensionData={customer}
                  queryParams={{ khh, sjid, ksrq: rq || '', jsrq: rq || '' }}
                  onRefresh={this.onRefresh}
                />
              )}
              {/* <CustomerDimensionExecution
                customer={customer}
                currentEvent={{ khh, sjid, yf: rq || '' }}
                onRefresh={this.onRefresh}
              /> */}
            </ExecutionModal>
          )
        }
      </Fragment>
    );
  }
}

export default MessageDropTabItem;
