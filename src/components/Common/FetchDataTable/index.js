import React from 'react';
import classnames from 'classnames';
import { message } from 'antd';
import BasicDataTable from '../BasicDataTable';
import ObjectUtils from '../../../utils/objectUtils';

export default class FetchDataTable extends React.Component {
  state={
    loading: true,
    pagination: {
      current: 1, // 当前页数
      pageSize: 5, // 每页记录条数
      total: -1, // 总条数
      ...(this.props.pagination || {}),
    },
    selectDatas: {
      selectAll: false,
      selectedRowKeys: [],
    },
    dataSource: [],
    chosenRowKey: '', // 单行选中记录的key
  }
  
  componentDidMount() {
    const { fetch = {} } = this.props;
    this.fetchTableData({ fetch });
    if(this.props.onRef){
      this.props.onRef(this);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pagination, fetch: { service, params = {} }, isPagination = true } = this.props;
    const { fetch: nextFetch = {} } = nextProps;
    const { service: nextService, params: nextParams = {} } = nextFetch;
    // 查询参数变化时,回归到第一页
    if (service !== nextService || !ObjectUtils.shallowEqual(params, nextParams)) {
      this.fetchTableData({
        pagination: isPagination ? {
          current: 1, // 当前页数
          pageSize: 5, // 每页记录条数
          total: -1, // 总条数
          ...pagination,
        } : null,
        fetch: nextFetch,
      });
    }
  }
  // 获取table的数据
  fetchTableData = ({ pagination = this.state.pagination, fetch }) => {
    const { isPagination = true, handleDataSource } = this.props;
    const { type = 1, service, params = {} } = fetch; // type为请求数据的方式,默认为1请求service,以后可以新增其它方式
    if (service) {
      const finalParams = { ...params, ...isPagination ? { paging: 1, total: -1, ...pagination } : {} };
      this.setState({ loading: true });
      if (type === 1) {
        service(finalParams).then((result) => {
          const { records, total = pagination.total, data } = result;
          const res = records || data || [];
          let dataSource = [];
          if (Array.isArray(res)) {
            res.forEach((item, index) => {
              if (!Reflect.has(item, 'id')) {
                dataSource.push({ ...item, id: index });
              } else {
                dataSource = res;
              }
            });
          }
          // 额外的数据处理方法
          if (handleDataSource) {
            dataSource = handleDataSource(dataSource);
          }
          const { current, pageSize } = finalParams;
          this.setState({ loading: false, dataSource, chosenRowKey: '', pagination: { ...pagination, current, pageSize, total } });
          const { getPagination } = this.props;
          if (getPagination && typeof getPagination === 'function') {
            getPagination(total);
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      }
    }
  }
  refreshTable = () => {
    const { fetch = {}, pageSize = 5 } = this.props;
    this.fetchTableData({ pagination: { current: 1, pageSize }, fetch });
  }
  // 分页、排序、筛选变化时的操作
  handlePFSChange = (pagination, filters, sorter) => {
    const { fetch, onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
    this.fetchTableData({ pagination, filters, sorter, fetch });
  }
  // 选择状态改变时的操作
  handleSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
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
  handleRow = (record) => {
    const { onRow = () => {} } = this.props;
    const onRowObj = onRow(record);
    const { onClick } = onRowObj || {};
    return {
      ...onRowObj,
      onClick: e => this.handleRowClick(e, record, onClick),
    };
  }
  // 行点击事件
  handleRowClick = (e, record, onClick) => {
    const { chosenRowKey: chosenRowKeyInState } = this.state;
    const { rowKey = 'id' } = this.props;
    let chosenRowKey = record[rowKey];
    if (!chosenRowKey && typeof rowKey === 'function') {
      chosenRowKey = rowKey(record);
    }
    if (chosenRowKeyInState !== chosenRowKey) {
      // 如果有回调,那么就触发回调
      if (onClick) {
        onClick(e, record);
      }
      this.setState({ chosenRowKey });
    }
  }
  // 行样式处理
  rowClassNameFunc = (record, rowKey, chosenRowKey) => {
    const { rowClassName } = this.props;

    let currentRowKey = record[rowKey];
    if (!currentRowKey && typeof rowKey === 'function') {
      currentRowKey = rowKey(record);
    }
    return classnames(
      currentRowKey === chosenRowKey ? 'active' : '',
      rowClassName && rowClassName(record, chosenRowKey)
    );
  }
  render() {
    const { rowClassName = true, chosenRowKey: chosenRowKeyInState, loading, pagination, selectDatas: selectDatasInstate, dataSource } = this.state;
    const { rowKey = 'id', className = '', chosenRowKey = chosenRowKeyInState, rowSelection, isPagination = true, ...restProps } = this.props;
    const basicDataTableProps = {
      ...restProps,
      loading,
      rowKey,
      className: classnames(className),
      dataSource,
      pagination: {
        className: 'm-paging',
        showTotal: total => `共${total}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        showSinglePager: false,
        ...pagination,
      },
      isPagination,
      rowSelection: rowSelection && {
        type: 'checkbox',
        crossPageSelect: true, // checkbox默认开启跨页全选
        ...selectDatasInstate,
        ...rowSelection,
        onChange: this.handleSelectChange, // 选择状态改变时的操作
      },
      rowClassName: rowClassName ? record => this.rowClassNameFunc(record, rowKey, chosenRowKey) : null, // 选中行高亮
      onRow: record => this.handleRow(record),
      onChange: this.handlePFSChange, // 分页、排序、筛选变化时的操作
    };
    return (
      <BasicDataTable
        {...basicDataTableProps}
      />
    );
  }
}
