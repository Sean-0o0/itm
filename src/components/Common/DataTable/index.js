import React from 'react';
import classnames from 'classnames';
import BasicDataTable from '../BasicDataTable';

export default class DataTable extends React.Component {
  state={
    pagination: {
      current: 1, // 当前页数
      pageSize: 5, // 每页记录条数
      total: 0, // 总条数
    },
    selectDatas: {
      selectAll: false,
      selectedRowKeys: [],
    },
    chosenRowKey: '', // 单行选中记录的key
  }
  // 分页、排序、筛选变化时的操作
  onPFSChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
    this.setState({ pagination });
  }
  // 选择状态改变时的操作
  onSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    // 处理选则的回调
    const { rowSelection = {} } = this.props;
    const { onChange } = rowSelection;
    if (onChange) {
      onChange(currentSelectedRowKeys, selectedRows, currentSelectAll);
    }
    // 处理当前的选择状态效果
    const { selectDatas } = this.state;
    selectDatas.selectAll = currentSelectAll;
    selectDatas.selectedRowKeys = currentSelectedRowKeys;
    this.setState({ selectDatas });
  }
  onRow = (record) => {
    const { onRow = () => {} } = this.props;
    const onRowObj = onRow(record);
    const { onClick } = onRowObj || {};
    return {
      ...onRowObj,
      onClick: e => this.onRowClick(e, record, onClick),
    };
  }
  // 行点击事件
  onRowClick = (e, record, onClick) => {
    const { chosenRowKey: chosenRowKeyInState } = this.state;
    const chosenRowKey = this.rowKeyValue(record);
    if (chosenRowKeyInState !== chosenRowKey) {
      // 如果有回调,那么就触发回调
      if (onClick) {
        onClick(e, record);
      }
      this.setState({ chosenRowKey });
    }
  }
  // 行样式处理
  rowClassNameFunc = (record, chosenRowKey) => {
    const { rowClassName } = this.props;
    return classnames(
      this.rowKeyValue(record) === chosenRowKey ? 'active' : '',
      rowClassName && rowClassName(record)
    );
  }
  // 获取rowKey对应的每条数据的值
  rowKeyValue = (record) => {
    const { rowKey = 'id' } = this.props;
    if (typeof rowKey === 'string') {
      return record[rowKey];
    } else if (typeof rowKey === 'function') {
      return rowKey(record);
    }
  }
  render() {
    const { chosenRowKey: chosenRowKeyInState, pagination: paginationInState, selectDatas: selectDatasInstate } = this.state;
    const { rowKey = 'id', className = '', chosenRowKey = chosenRowKeyInState, pagination = paginationInState, rowSelection, ...restProps } = this.props;
    const basicDataTableProps = {
      ...restProps,
      rowKey,
      className: classnames('m-table-blue', className),
      pagination: pagination && {
        className: 'm-paging',
        showTotal: total => `共${total}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        ...pagination,
      },
      rowSelection: rowSelection && {
        type: 'checkbox',
        crossPageSelect: true, // checkbox默认开启跨页全选
        ...selectDatasInstate,
        ...rowSelection,
        onChange: this.onSelectChange, // 选择状态改变时的操作
      },
      rowClassName: record => this.rowClassNameFunc(record, chosenRowKey), // 选中行高亮
      onRow: record => this.onRow(record),
      onChange: this.onPFSChange, // 分页、排序、筛选变化时的操作
    };
    return (
      <BasicDataTable
        {...basicDataTableProps}
      />
    );
  }
}
