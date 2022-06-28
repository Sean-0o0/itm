import React from 'react';
import classnames from 'classnames';
import { Button } from 'antd';
import { InfiniteTable, Order, Column } from 'react-virtualized-table';
import CheckboxColumn from './checkboxColumn';
import RadioColumn from './radioColumn';
import PaginationBox from './paginationBox';
import styles from './index.less';

export default class BasicDataTable extends React.Component {
  state={
    rowKey: this.props.rowKey || 'key',
    pagination: this.props.pagination || {
      current: 1, // 当前页数
      pageSize: 20, // 每页记录条数
      total: 0, // 总条数
    },
  }
  // 页数切换
  onPageChange = (current) => {
    const { pagination = {} } = this.props;
    const { pageSize = 20, onPageChange } = pagination;
    if (onPageChange) {
      onPageChange(current);
    }
    this.onPagerChange(current, pageSize);
  }
  // 每页显示条数切换
  onPageSizeChange = (current, pageSize) => {
    const { pagination = {} } = this.props;
    const { onPageSizeChange } = pagination;
    if (onPageSizeChange) {
      onPageSizeChange(pageSize);
    }
    this.onPagerChange(current, pageSize);
  }
  // 页数变化时触发
  onPagerChange = (current, pageSize) => {
    const { pagination = {} } = this.props;
    const { onChange } = pagination;
    if (onChange) {
      onChange(current, pageSize);
    }
  }
  // 点击全选后的操作
  onCheckAll = (allChecked) => {
    const { rowSelection = {} } = this.props;
    const { crossPageSelect = true, onCheckAll } = rowSelection;
    if (onCheckAll) {
      onCheckAll(allChecked);
    }
    if (crossPageSelect) { // 开启跨页选择
      // 不管全选还是取消全选,
      this.onCheckChange(allChecked, []);
    } else {
      let selectedRowKeys = [];
      if (allChecked) {
        const { rowKey, dataSource } = this.props;
        selectedRowKeys = dataSource.map(item => item[rowKey]);
      }
      this.onCheckChange(allChecked, selectedRowKeys);
    }
  }
  // 选中每行的checkbox的操作
  onRowCheck = (checked, { rowData }) => {
    const { rowKey } = this.state;
    const { rowSelection = {} } = this.props;
    const { crossPageSelect = true, selectAll = false, selectedRowKeys = [], onRowCheck } = rowSelection;
    const selectedRowKey = rowData[rowKey];
    if (onRowCheck) {
      onRowCheck(checked, selectedRowKey, rowData);
    }
    // 获取新的选中信息
    const newSelectedRowKeys = [...selectedRowKeys];
    if (crossPageSelect) { // 开启跨页全选
      if ((selectAll && !checked) || (!selectAll && checked)) {
        newSelectedRowKeys.push(selectedRowKey);
      } else {
        const index = newSelectedRowKeys.indexOf(selectedRowKey);
        if (index >= 0) {
          newSelectedRowKeys.splice(index, 1);
        }
      }
    } else if (checked) {
      newSelectedRowKeys.push(selectedRowKey);
    } else {
      const index = newSelectedRowKeys.indexOf(selectedRowKey);
      if (index >= 0) {
        newSelectedRowKeys.splice(index, 1);
      }
    }
    this.onCheckChange(selectAll, newSelectedRowKeys);
  }
  onRadioRowCheck = (checked, { rowData }) => {
    const { rowKey } = this.state;
    const { rowSelection = {} } = this.props;
    const { onRowCheck } = rowSelection;
    const selectedRowKey = rowData[rowKey];
    if (onRowCheck) {
      onRowCheck(checked, selectedRowKey, rowData);
    }
    // 获取新的选中信息
    const newSelectedRowKeys = [];
    if (checked) {
      newSelectedRowKeys.push(selectedRowKey);
    }
    this.onCheckChange(false, newSelectedRowKeys);
  }
  // 选中状态改变触发事件
  onCheckChange = (selectAll, selectedRowKeys) => {
    const { rowSelection = {} } = this.props;
    const { onChange } = rowSelection;
    if (onChange) {
      onChange(selectAll, selectedRowKeys);
    }
  }
  // 判断全选checkbox的选中状态
  isAllChecked = () => {
    const { rowSelection = {}, pagination = {} } = this.props;
    const { total = 0 } = pagination;
    const { crossPageSelect = true, selectAll = false, selectedRowKeys = [] } = rowSelection;
    if (crossPageSelect) {
      return selectAll && selectedRowKeys.length < total;
    }
    // 非跨页全选判断全选需要判断当前展示的项中是否全部被勾选
    const { rowKey, dataSource } = this.props;
    let realAllSelect = true;
    dataSource.forEach((item) => {
      if (!selectedRowKeys.includes(item[rowKey])) {
        realAllSelect = false;
        return false;
      }
    });
    return selectAll && realAllSelect;
  }
  // 判断全选checkbox的indeterminate状态
  isAllIndeterminate = () => {
    const { rowSelection = {}, pagination = {} } = this.props;
    const { total = 0 } = pagination;
    const { crossPageSelect = true, selectAll = false, selectedRowKeys = [] } = rowSelection;
    if (crossPageSelect) {
      return (selectAll && selectedRowKeys.length > 0) || (!selectAll && selectedRowKeys.length > 0 && selectedRowKeys.length < total);
    }
    const { rowKey, dataSource } = this.props;
    let realAllSelect = true;
    let curentHasCheck = false;
    dataSource.forEach((item) => {
      if (!selectedRowKeys.includes(item[rowKey])) {
        realAllSelect = false;
        return false;
      }
      curentHasCheck = true;
    });
    return !realAllSelect && curentHasCheck;
  }
  // 判断行checkbox的选中状态
  isCellChecked = ({ rowData }) => {
    const { rowKey } = this.state;
    const { rowSelection = {} } = this.props;
    const { crossPageSelect = true, selectAll = false, selectedRowKeys = [] } = rowSelection;
    const selectedRowKey = rowData[rowKey];
    if (crossPageSelect) {
      if ((selectAll && !selectedRowKeys.includes(selectedRowKey)) || (!selectAll && selectedRowKeys.includes(selectedRowKey))) {
        return true;
      }
      return false;
    }
    if (selectedRowKeys.includes(selectedRowKey)) {
      return true;
    }
    return false;
  }
  isRadioCellChecked = ({ rowData }) => {
    const { rowKey } = this.state;
    const { rowSelection = {} } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    const selectedRowKey = rowData[rowKey];
    if (selectedRowKeys.includes(selectedRowKey)) {
      return true;
    }
    return false;
  }
  // 拖拽表头结束后触发的操作
  handleDragEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }
    const { rowSelection = {}, onDragEnd } = this.props;
    const { type } = rowSelection;
    let realOldIndex = oldIndex;
    let realNewIndex = newIndex;
    if (type === 'checkbox' || type === 'radio') {
      if (newIndex === 0) {
        return;
      }
      realOldIndex--;
      realNewIndex--;
    }
    if (onDragEnd) {
      onDragEnd(realOldIndex, realNewIndex);
    }
  }
  // 排序
  handleRequestSort = (property) => {
    const { sorters = {}, onSortersChange } = this.props;
    let direction = sorters[property] || 'asc';

    if (direction === 'desc') {
      direction = 'asc';
    } else if (direction === 'asc') {
      direction = 'desc';
    }

    if (onSortersChange) {
      onSortersChange(property, direction);
    }
  };
  // 判断是否加载更多
  isShowLoadMore = ({ current = 0, pageSize = 0, total = 0 }) => {
    const { dataSource } = this.props;
    // 如果没有数据,那么就加载数据
    if (current === 0) {
      return true;
    }

    const rowCount = dataSource.length;
    const maxRowCount = pageSize * 3;
    const currentCount = current * pageSize;

    if (rowCount < maxRowCount && currentCount < total) {
      return true;
    }

    return false;
  }
  // 渲染checkbox列
  renderCheckBoxColumn = (crossPageSelect) => {
    if (crossPageSelect) { // 默认开启跨页多选功能
      return (
        <CheckboxColumn
          key="checkbox"
          headerChecked={this.isAllChecked}
          headerIndeterminate={this.isAllIndeterminate}
          cellChecked={this.isCellChecked}
          onCheckHeader={this.onCheckAll}
          onCheckCell={this.onRowCheck}
        />
      );
    }
    return (
      <CheckboxColumn
        key="checkbox"
        headerChecked={this.isAllChecked}
        headerIndeterminate={this.isAllIndeterminate}
        cellChecked={this.isCellChecked}
        onCheckHeader={this.onCheckAll}
        onCheckCell={this.onRowCheck}
      />
    );
  }
  renderRadioColumn = () => {
    return (
      <RadioColumn
        key="radio"
        headerChecked={() => false}
        headerIndeterminate={() => false}
        cellChecked={this.isRadioCellChecked}
        onCheckHeader={() => {}}
        onCheckCell={this.onRadioRowCheck}
      />
    );
  }
  // 渲染表格的列信息
  renderColumn = (columnData) => {
    const { type: columnType, dataKey } = columnData;
    if (columnType === 'order') {
      const { sorters = {} } = this.props;
      // 支持排序的列
      return (
        <Order
          {...columnData}
          key={dataKey}
          orderBy={dataKey}
          orderDirection={sorters[dataKey]}
          onRequestSort={this.handleRequestSort}
        />
      );
    }
    // 普通列
    return (
      <Column {...columnData} key={dataKey} />
    );
  }
  // 渲染底部"加载更多"和分页组件
  renderFooter = (loading, current, pageSize, total, onLoadMore) => {
    // 如果有提供onLoadMore方法,并且符合条件,那么就显示"加载更多""
    if (loading || (onLoadMore && this.isShowLoadMore({ current, pageSize, total }))) {
      const hasMoreRows = total > (current * pageSize);
      let showText = '';
      if (loading) {
        showText = '加载中';
      } else if (hasMoreRows) {
        showText = '点击加载更多';
      } else {
        showText = '没有更多了';
      }
      return (
        <Button
          className="load-more"
          size="large"
          loading={loading}
          onClick={(!loading && hasMoreRows) ? onLoadMore : null}
        >
          {showText}
        </Button>
      );
    }
    const { rowSelection = {} } = this.props;
    const { showSelectedCount = false, showSelectedText, crossPageSelect = true, selectAll = false, selectedRowKeys = [] } = rowSelection;
    let selectedCount = 0;
    let selectedContent = null;
    if (showSelectedCount) {
      if (crossPageSelect && selectAll) {
        selectedCount = total - selectedRowKeys.length;
      } else {
        selectedCount = selectedRowKeys.length;
      }
      if (showSelectedText) {
        selectedContent = showSelectedText(selectedCount);
      }
    }
    if (total <= 0) { // 如果总条数为0,那么就是无数据,显示无数据字样
      return <div className={styles.footer} style={{ width: '100%', textAlign: 'center' }}>暂无数据!</div>;
    }
    return (
      <PaginationBox
        showSelectedCount={showSelectedCount}
        selectedCount={selectedCount}
        selectedContent={selectedContent}
        current={current}
        pageSize={pageSize}
        total={total}
        onPageChange={this.onPageChange}
        onPageSizeChange={this.onPageSizeChange}
      />
    );
  }
  render() {
    const { rowKey, pagination: paginationInState } = this.state;
    const {
      className = '',
      loading = false,
      // chosenRowKey = chosenRowKeyInState,
      pagination = paginationInState,
      columns = [],
      rowSelection = {},
      dataSource,
      fixedHeaderEnabled = false, // 是否固定表头,默认不固定
      scrollElement, // 指定滚动的上层容器,默认为windows
      onTopReachedThreshold, // 指定滚动到距离容器的位置触发固定表头行为的临界值,默认为0
      fixedHeaderStyle, // 指定固定表头的样式,常用来指定top样式,以实现距离容器顶端一定位置固定的效果
      onLoadMore, // 加载更多触发的操作,一般用来加载更多的数据
      onEndReachedThreshold = 350, // 距离容器底部距离多少时触发自动加载操作
      fixedColumnCount, // 固定表头的个数,一般从columns数组的第一项开始,如果有checkbox,那么checkbox也需要固定,也需要占一个
      onDragEnd, // 是否有拖拽列效果,如果有,则传入一个改变columns的顺序的函数
      onRowClick, // 行点击事件
    } = this.props;
    const { current, pageSize, total } = pagination;
    const { type, crossPageSelect = true, selectAll = false, selectedRowKeys = [] } = rowSelection;
    // 基础的表格参数
    const basicProps = {
      className,
      loading,
      current, // 当前页数
      pageSize, // 每页条数
      total, // 总条数
      selectAll, // 是否全选(虽然组件内部没有用到,但是也要传入,触发组件的重新渲染)
      selectedRowKeys, // 选中/取消选中的记录数(只是传进去,如果有变化就会触发组件重新渲染)
      onRowClick, // 行点击事件
    };
    // 判断表格是否有固定表头
    if (fixedHeaderEnabled) {
      if (scrollElement) {
        basicProps.scrollElement = scrollElement;
      }
      if (onTopReachedThreshold) {
        basicProps.onTopReachedThreshold = onTopReachedThreshold;
      }
      if (fixedHeaderStyle) {
        basicProps.fixedHeaderStyle = fixedHeaderStyle;
      }
    } else {
      basicProps.fixedHeaderEnabled = false;
    }
    // 判断是否有"加载更多"
    if (onLoadMore) {
      basicProps.showLoadMore = this.isShowLoadMore;
      basicProps.onLoadMore = onLoadMore;
      if (onEndReachedThreshold) {
        basicProps.onEndReachedThreshold = onEndReachedThreshold;
      }
      // 滚动事件绑定给相应的dom节点
      if (!basicProps.scrollElement && scrollElement) {
        basicProps.scrollElement = scrollElement;
      }
    }
    // 判断是否有拖拽
    if (onDragEnd) {
      basicProps.onSortEnd = this.handleDragEnd;
    }
    // 判断是否有checkbox或者radio
    const tableColumn = [];
    if (type && type === 'checkbox') {
      tableColumn.push(this.renderCheckBoxColumn(crossPageSelect));
    } else if (type && type === 'radio') {
      tableColumn.push(this.renderRadioColumn());
    }
    tableColumn.push(columns.map((columnData) => { return this.renderColumn(columnData); }));
    return (
      <div className={classnames('m-virtualized-table', styles.vtable)}>
        <InfiniteTable
          {...basicProps}
          rowHeight={60}
          headerHeight={60}
          keyExtractor={record => record[rowKey]} // 主键
          data={dataSource} // 表格数据
          renderFooter={() => this.renderFooter(loading, current, pageSize, total, onLoadMore)}
          fixedColumnCount={fixedColumnCount}
        >
          {tableColumn}
        </InfiniteTable>
      </div>
    );
  }
}
