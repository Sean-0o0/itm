import React from 'react';
import { Table } from 'antd';

class TableContent extends React.Component {
  state = {
    data: [],
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ data: nextProps.data });
    }
  }

  getColumns = () => {
    const columns = [{
      title: '变量名',
      dataIndex: 'name',
      render: text => text || '--',
    }, {
      title: '最小值',
      dataIndex: 'minVal',
      render: text => text || '--',
    }, {
      title: '最大值',
      dataIndex: 'maxVal',
      render: text => text || '--',
    }, {
      title: '审核阈值',
      dataIndex: 'auditVal',
      render: text => text || '--',
    }];
    return columns;
  }

  getTableProps = () => {
    const { data = [] } = this.state;
    const tableProps = {
      rowKey: 'seq',
      columns: this.getColumns(),
      dataSource: data,
      locale: { emptyText: '暂无数据' },
      pagination: false,
    };
    return tableProps;
  }

  render() {
    const tableProps = this.getTableProps();
    return (
      <div className="m-pay-pt">
        <div className=" m-szyx-sec-title">变量</div>
        <Table
          className="m-table-customer m-table-border ant-table-wrapper"
          {...tableProps}
        />
      </div>
    );
  }
}

export default TableContent;
