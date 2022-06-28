/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Table, message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import { FetchproCalProc } from '../../../../../../../services/EsaServices/navigation';

class DrillContent extends React.Component {
  constructor(props) {
    super(props);
    const { text = '' } = props;
    const { value = '', proc = '', parm = '', type = '' } = JSON.parse(text);
    this.state = {
      value, // 值
      proc, // 过程名
      parm, // 过程参数
      type, // 类型入参
      modalVisible: false,
      tableData: [],
      tableColumns: [],
    };
  }

  showModal = () => {
    this.setState({ modalVisible: true }, this.fetchData());
  }

  fetchData = () => {
    const { proc = '', parm = '', type = '' } = this.state;
    FetchproCalProc({
      proc,
      parm,
      type,
    }).then((ret = {}) => {
      const { code = 0, records = [], column = '' } = ret;
      if (code > 0) {
        const columnArr = JSON.parse(column) || [];
        this.assembleDataSourceAndColumns(records, columnArr);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  assembleDataSourceAndColumns = (records, columnArr) => {
    const { isJsonStr } = this.props;
    const columns = [];
    const dataSource = [];
    columnArr.forEach((item) => {
      const { COL = '', NAME = '' } = item;
      columns.push({
        dataIndex: COL,
        title: NAME,
        render: (text) => {
          // 判断text是不是json字符串
          const isJson = isJsonStr(text);
          if (!text) {
            return '--';
          } else if (isJson) {
            return <DrillContent text={text} isJsonStr={isJsonStr} />;
          }
          return text;
        },
      });
    });
    records.forEach((item, index) => {
      dataSource.push({
        ...item,
        ID: index,
      });
    });
    this.setState({
      tableData: dataSource,
      tableColumns: columns,
    });
  }

  render() {
    const { value = '', modalVisible = false, tableData = [], tableColumns = [] } = this.state;
    const modalProps = {
      width: '70rem',
      title: '查看详情',
      visible: modalVisible,
      mask: false,
      onCancel: () => { this.setState({ modalVisible: false }); },
      footer: null,
    };
    return (
      <div>
        <a className="blue" onClick={this.showModal}>{value}</a>
        <BasicModal {...modalProps}>
          <Table
            className="m-table-customer"
            rowKey="ID"
            dataSource={tableData}
            columns={tableColumns}
            pagination={{
              className: 'm-paging',
              hideOnSinglePage: true,
            }}
          />
        </BasicModal>
      </div>
    );
  }
}

export default DrillContent;
