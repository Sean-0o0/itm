import React, { Fragment } from 'react';
import { message } from 'antd';
import FetchDataTable from '../../../../../../components/Common/FetchDataTable';
import { fetchReadRmndEvent } from '../../../../../../services/basicservices/index';
import { FetchUserMsgRmdList } from '../../../../../../services/commonbase/index';
import WorkflowModel from './WorkflowModel';
import styles from '../style.less';

class WorkflowTable extends React.Component {
  state={
    item: {},
  }

  handleRmdMessageClick = (msgId = '') => {
    const { tabCode = '' } = this.props;
    fetchReadRmndEvent({
      rmndId: msgId,
      clCode: tabCode
    }).then((response) => {
      const { code = -1 } = response;
      if (code > 0) {
        this.fetchTableData();
        const { onRefresh } = this.props;
        if (onRefresh) onRefresh();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchTableData = () => {
    const { isread = 0 } = this.props;
    const fetch = {
      service: FetchUserMsgRmdList,
      params: {
        isread,
        type: 'Workflow',
      },
    };
    if (this.table) this.table.fetchTableData({ fetch });
  }

  onClick = (record) => {
    this.setState({ item: record }, this.Modal.open);
  }

  assembleColumns = () => {
    return [
      {
        title: '任务类别',
        dataIndex: 'msgTp',
        key: 'msgTp',
        render: (text, record) => {
          return <span style={{ color: `${record.isread === '1' ? '' : '#54a9df'}` }}>{text || '--'}</span>;
        },
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => {
          return <span style={{ color: `${record.isread === '1' ? '' : '#54a9df'}` }}>{text || '--'}</span>;
        },
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        className: `${styles.maxWidth}`,
        render: (text, record) => {
          const subedText = (text && text.length > 20 ? (
            <span style={{ color: `${record.isread === '1' ? '' : '#54a9df'}` }} title={text}>
              {text.substring(0, 20)}
              ...
            </span>
          ) : <span style={{ color: `${record.isread === '1' ? '' : '#54a9df'}` }} title={text}>{text || '--'}</span>);
          return subedText;
        },
      },
      {
        title: '提醒时间',
        dataIndex: 'rmdTm',
        key: 'rmdTm',
        render: (text, record) => {
          return <span style={{ color: `${record.isread === '1' ? '' : '#54a9df'}` }}>{text || '--'}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) => {
          if (record.isread === '0') {
            return (<a onClick={() => this.onClick(record)} style={{ color: '#54a9df' }}>执行</a>);
          } return (<div>已读</div>);
        },
      },
    ];
  }

  render() {
    const { item = {} } = this.state;
    const { isread = 0 } = this.props;
    const { link = '{}', msgId } = item;
    let obj = {};
    try {
      obj = JSON.parse(link);
    } catch (e) {
      // do nothing
    }
    const { step = '', instid = '' } = obj;
    const tableProps = {
      rowKey: record => record.msgId,
      rowClassName: (record, chosenRowKey) => `${record.msgId === chosenRowKey ? 'active' : ''}`,
      columns: this.assembleColumns(),
      fetch: {
        service: FetchUserMsgRmdList,
        params: {
          isread,
          type: 'Workflow',
        },
      },
      rowSelection: null,
      pagination: {
        className: 'm-paging',
        pageSize: 10,
        showSizeChanger: false,
      },
    };
    return (
      <Fragment>
        <FetchDataTable
          className="m-table-customer"
          ref={(n) => { this.table = n; }}
          {...tableProps}
        />
        <WorkflowModel ref={(c) => { this.Modal = c; }} data={{ step, instId: instid, msgId }} onRefresh={this.handleRmdMessageClick} />
      </Fragment>
    );
  }
}

export default WorkflowTable;
