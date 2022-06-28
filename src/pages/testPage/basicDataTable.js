import React from 'react';
import BasicDataTable from '../../components/Common/BasicDataTable';

const ds = [
  { id: 1, name: '王泽昊1' },
  { id: 2, name: '王泽昊2' },
  { id: 3, name: '王泽昊3' },
  { id: 4, name: '王泽昊4' },
  { id: 5, name: '王泽昊5' },
];

export default class BasicDataTableTestPage extends React.Component {
  state={
    tableDatas: {
      rowKey: 'id',
      columns: [
        { dataIndex: 'id', title: '客户号' },
        { dataIndex: 'name', title: '姓名' },
      ],
      dataSource: ds,
      pagination: {
        current: 1, // 当前页数
        pageSize: 5, // 每页记录条数
        total: 100, // 总条数
      },
      selectDatas: {
        selectAll: false,
        selectedRowKeys: [],
      },
      chosenRowKey: '', // 单行选中记录的key
    },
  }
  // 选择状态改变时的操作
  onSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    const { tableDatas } = this.state;
    tableDatas.selectDatas.selectAll = currentSelectAll;
    tableDatas.selectDatas.selectedRowKeys = currentSelectedRowKeys;
    this.setState({ tableDatas });
  }
  // 分页、排序、筛选变化时的操作
  onPFSChange = (pagination, filters, sorter) => {
    console.info(pagination, filters, sorter); // eslint-disable-line
    // 人工造数据
    const { tableDatas } = this.state;
    tableDatas.pagination = pagination;// 修改页数
    // 修改id和name
    const { current } = pagination;
    const dataSource = ds.map((item, index) => {
      return {
        ...item,
        id: index + (5 * (current - 1)),
        name: `${item.name.substring(0, 3)}${index + (5 * (current - 1))}`,
      };
    });
    tableDatas.dataSource = dataSource;
    this.setState({ tableDatas });
  }
  onRowClick = (e, record) => {
    console.info(record); // eslint-disable-line
    const { tableDatas } = this.state;
    const { rowKey = 'id' } = tableDatas;
    const chosenRowKey = record[rowKey];
    tableDatas.chosenRowKey = chosenRowKey;
    this.setState({ tableDatas });
  }
  render() {
    const { tableDatas: { rowKey, pagination, columns, dataSource, chosenRowKey, selectDatas: { selectAll, selectedRowKeys } } } = this.state;
    const tableProps = {
      rowKey,
      columns,
      dataSource,
      pagination,
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: true, // checkbox开启跨页全选
        selectAll, // 是否全选
        selectedRowKeys, // 选中(未全选)/取消选中(全选)的rowkey值
        onChange: this.onSelectChange, // 选择状态改变时的操作
      },
      rowClassName: record => (record[rowKey] === chosenRowKey ? 'active' : ''), // 选中行高亮
      onRow: record => ({
        onClick: e => this.onRowClick(e, record),
      }),
      onChange: this.onPFSChange, // 分页、排序、筛选变化时的操作
    };
    return (
      <div style={{ padding: 10 }}>
        <BasicDataTable
          {...tableProps}
        />
      </div>
    );
  }
}

