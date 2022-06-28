import React from 'react';
import classnames from 'classnames';
import { Table, Checkbox, Affix, Button } from 'antd';
import styles from './index.less';

export default class BasicDataTable extends React.Component {
  state = {
    affixed: false,
    checkboxCache: {
      selectAll: false,
      selectedRowKeys: [],
    },
  }
  componentWillMount() {
    const { isAffixed = false } = this.props;
    if (isAffixed) {
      this.hashCode = `${Math.floor(Math.random() * 10000)}-${new Date().getTime()}`;
    }
  }
  componentDidMount() {
    this.addHorizontalScroll();
  }
  componentWillReceiveProps(nextProps) {
    const { columns: nextColumns } = nextProps;
    const { columns } = this.props;
    if (columns.length !== nextColumns.length) {
      this.addHorizontalScroll();
    }
  }
  componentWillUnmount() {
    const { isAffixed = false } = this.props;
    // 如果定时器还在,那么就清除掉
    if (this.scrollTimer) {
      window.clearTimeout(this.scrollTimer);
    }
    // 取消事件的绑定,避免内存泄漏
    if (isAffixed && window.addEventListener) {
      if (this.mainTableScrollDom) {
        this.mainTableScrollDom.removeEventListener('scroll', this.mainTableScroll);
        this.mainTableScrollDom = null;
      }
      if (this.affixedTableScrollDom) {
        this.affixedTableScrollDom.removeEventListener('scroll', this.affixedTableScroll);
        this.affixedTableScrollDom = null;
      }
    }
  }
  addHorizontalScroll = () => {
    const { isAffixed = false } = this.props;
    if (isAffixed && window.addEventListener) {
      // 给dom节点绑定事件,监听dom节点的滚动事件
      const [mainTable = ''] = document.getElementsByClassName(`${styles.mainTable}-${this.hashCode}`) || [];
      const [affixedTable = ''] = document.getElementsByClassName(`${styles.affixedTable}-${this.hashCode}`) || [];
      if (mainTable) {
        const [mainTableScrollDom = ''] = mainTable.getElementsByClassName('ant-table-body');
        if (mainTableScrollDom) {
          this.mainTableScrollDom = mainTableScrollDom;
          this.mainTableScrollDom.addEventListener('scroll', this.mainTableScroll);
        }
      }
      if (affixedTable) {
        const [affixedTableScrollDom = ''] = affixedTable.getElementsByClassName('ant-table-body');
        if (affixedTableScrollDom) {
          this.affixedTableScrollDom = affixedTableScrollDom;
          this.affixedTableScrollDom.addEventListener('scroll', this.affixedTableScroll);
        }
      }
    }
  }
  mainTableScroll = (e) => {
    const { scrollLeft } = e.target;
    // 如果有定时器,那么就先把定时器给清除
    if (this.scrollTimer) {
      window.clearTimeout(this.scrollTimer);
    }
    if (this.affixedTableScrollDom) {
      // 然后把悬浮表头的滚动事件取消绑定
      this.affixedTableScrollDom.removeEventListener('scroll', this.affixedTableScroll);
      // 接着控制悬浮表头滚动
      if (typeof this.affixedTableScrollDom.scrollTo === 'function') {
        this.affixedTableScrollDom.scrollTo(scrollLeft, 0);
      } else {
        this.affixedTableScrollDom.scrollLeft = scrollLeft;
      }
      // 最后设置一个定时器,给悬浮表头绑定滚动事件
      this.scrollTimer = window.setTimeout(() => {
        this.affixedTableScrollDom.addEventListener('scroll', this.affixedTableScroll);
      }, 100);
    }
  }
  affixedTableScroll = (e) => {
    const { scrollLeft } = e.target;
    // 如果有定时器,那么就先把定时器给清除
    if (this.scrollTimer) {
      window.clearTimeout(this.scrollTimer);
    }
    if (this.mainTableScrollDom) {
      // 然后把主表的滚动事件取消绑定
      this.mainTableScrollDom.removeEventListener('scroll', this.mainTableScroll);
      // 接着主表滚动
      if (typeof this.mainTableScrollDom.scrollTo === 'function') {
        this.mainTableScrollDom.scrollTo(scrollLeft, 0);
      } else {
        this.mainTableScrollDom.scrollLeft = scrollLeft;
      }
      // 最后设置一个定时器,给主表绑定滚动事件
      this.scrollTimer = window.setTimeout(() => {
        this.mainTableScrollDom.addEventListener('scroll', this.mainTableScroll);
      }, 100);
    }
  }
  // 有支持跨页全选的checkbox的时候, 选中选项的keys存起来
  checkboxCache = { selectAll: false, selectedRowKeys: [] }
  // 获取rowKey对应的每条数据的值
  rowKeyValue = (record) => {
    const { rowKey = 'id' } = this.props;
    if (typeof rowKey === 'string') {
      return record[rowKey];
    } else if (typeof rowKey === 'function') {
      return rowKey(record);
    }
  }
  // 有支持跨页全选的checkbox的时候, 选中某一行
  handleSelect = (event, value) => {
    event.stopPropagation();// 阻止事件冒泡
    const { checked: selected } = event.target;// 选中/取消选中 的状态\
    const { dataSource,
      rowSelection: {
        onSelect,
        selectAll = this.state.checkboxCache.selectAll,
        selectedRowKeys = this.state.checkboxCache.selectedRowKeys,
      },
    } = this.props;
    let record = false;// 当前 选中/取消选中 的记录
    const currentSelectedRowKeys = [];// 当前所有的 选中/取消选中 的key值
    const selectedRows = [];// 当前所有的 选中/取消选中 的记录
    if ((selectAll && selected) || (!selectAll && !selected)) {
      // 如果勾选了全选, 选中该项后需要将selectedRowKeys中的该项去掉; 如果未勾选全选, 取消勾选该项后,也需要将selectedRowKeys中的该项去掉
      currentSelectedRowKeys.push(...selectedRowKeys);
      const index = selectedRowKeys.findIndex(item => item === value);
      currentSelectedRowKeys.splice(index, 1);
    } else if ((selectAll && !selected) || (!selectAll && selected)) {
      // 如果勾选了全选, 取消勾选该项后需要在selectedRowKeys中加上该项; 如果未勾选全选, 勾选该项后,也需要在selectedRowKeys中加上该项
      currentSelectedRowKeys.push(...selectedRowKeys);
      currentSelectedRowKeys.push(value);
    }

    dataSource.forEach((item) => {
      const key = this.rowKeyValue(item);
      // 获取当前的记录
      if (!record && key === value) {
        record = item;
      }
      // 获取所有 选中/取消选中 的记录
      const index = currentSelectedRowKeys.findIndex(val => val === key);
      if (index !== -1) {
        selectedRows.push(item);
      }
    });
    if (onSelect) {
      onSelect(record, selected, selectedRows);
    }
    this.handleSelectChange(currentSelectedRowKeys, selectedRows, selectAll);
  }
  // 有支持跨页全选的checkbox的时候, 全选表格记录
  handleSelectAll = (event) => {
    event.stopPropagation();// 阻止事件冒泡
    const { checked: selected } = event.target;// 全选/取消全选 的状态
    const { dataSource,
      rowSelection: {
        onSelectAll,
        selectAll = this.state.checkboxCache.selectAll,
        selectedRowKeys = this.state.checkboxCache.selectedRowKeys,
      },
    } = this.props;
    const currentSelectedRowKeys = [];// 当前所有的 选中/取消选中 的key值
    const selectedRows = [];// 当前所有的 选中/取消选中 的记录, 一般为空数组
    const changeRows = [];// 相比上次, 选中/取消选中 的记录中发生改变的记录
    if ((selectAll && selected) || (!selectAll && selected)) {
      if (selectedRowKeys.length > 0) {
        dataSource.forEach((item) => {
          const key = this.rowKeyValue(item);
          // 获取所有 选中/取消选中 的记录
          const index = selectedRowKeys.findIndex(val => val === key);
          if (index !== -1) {
            changeRows.push(item);
          }
        });
      }
    }
    if (onSelectAll) {
      onSelectAll(selected, selectedRows, changeRows);
    }
    this.handleSelectChange(currentSelectedRowKeys, selectedRows, selected);
  }
  handleSelectChange(currentSelectedRowKeys, selectedRows, selectAll) {
    this.setState({ checkboxCache: { selectedRowKeys: currentSelectedRowKeys, selectAll, selectedRows } });
    const { rowSelection: { onChange } } = this.props;
    if (onChange) {
      onChange(currentSelectedRowKeys, selectedRows, selectAll);
    }
  }

  handleAffixChange = (affixed) => {
    this.setState({ affixed });
  }

  handleBackTopClick = () => {
    window.scrollTo(0, 0);
  }

  render() {
    const { affixed } = this.state;
    const { className, rowSelection, pagination: paginationInprops, rowKey = 'id', columns, dataSource, isAffixed = false, affixOffsetTop = 0, showBackTop = false, backTopClassName, ...restProps } = this.props;
    const finalColumns = [];
    // 如果是checkbox且需要支持"跨页全选"",那么就禁用默认的选择器,自定义checkbox选择器
    let confirmCrossPageSelect = false;// 判断是否是跨页全选
    const { type = 'checkbox', crossPageSelect = false, fixed = '', width = 62 } = rowSelection || {};
    if (rowSelection && type === 'checkbox' && crossPageSelect && dataSource.length > 0) {
      confirmCrossPageSelect = true;
      const { selectAll = this.state.checkboxCache.selectAll, selectedRowKeys = this.state.checkboxCache.selectedRowKeys } = rowSelection;

      const _this = this;
      // 添加一列用于渲染checkbox选择框
      finalColumns[0] = {
        width,
        fixed,
        className: 'ant-table-selection-column',
        title: <Checkbox
          indeterminate={selectedRowKeys.length > 0}
          checked={selectAll}
          onChange={_this.handleSelectAll}
        />,
        colSpan: dataSource.length > 0 ? 1 : 0,
        dataIndex: 'checkbox',
        key: 'checkbox',
        render(val, record) {
          const value = _this.rowKeyValue(record);
          return (
            <a onClick={(e) => { e.stopPropagation(); /** 阻止事件冒泡,防止onRowClick先于checkbox的change事件执行 * */ }}>
              <Checkbox
                value={value}
                checked={(selectAll && !selectedRowKeys.includes(value)) || (!selectAll && selectedRowKeys.includes(value))}
                onChange={event => _this.handleSelect(event, value)}
              />
            </a>
          );
        },
      };
    }
    // 将其它列放到finalColumns中
    finalColumns.push(...columns);
    // 当总条数小于pageSize的时候不显示分页
    const { autoHide = true, showSinglePager = true, pageSize = '', total = '' } = paginationInprops || {};
    let pagination = paginationInprops;
    if (autoHide && !showSinglePager && pageSize !== '' && total !== '' && total <= pageSize) {
      pagination = false;
    }
    if (!isAffixed) {
      return (
        <Table
          {...restProps}
          className={`${classnames(styles.table, className)} m-table-customer`}
          rowKey={rowKey}
          columns={finalColumns}
          dataSource={dataSource}
          pagination={pagination}
          rowSelection={confirmCrossPageSelect || dataSource.length === 0 ? null : rowSelection}
        />
      );
    }
    // 固定表头
    return (
      <div>
        <Affix offsetTop={affixOffsetTop} onChange={this.handleAffixChange} target={() => this.props.affixContainer || window}>
          <Table
            {...restProps}
            className={`${classnames(styles.table, styles.affixedTable, `${styles.affixedTable}-${this.hashCode}`, affixed && 'affixed', className)} m-table-customer`}
            rowKey={rowKey}
            columns={finalColumns}
            dataSource={dataSource.length > 0 ? [dataSource[0]] : []}
            pagination={false}
            rowSelection={confirmCrossPageSelect || dataSource.length === 0 ? null : rowSelection}
          />
          {showBackTop && (
            <div
              className={classnames(backTopClassName)}
              style={{ position: 'absolute', top: '0', width: '100%', textAlign: 'center', visibility: affixed ? 'visible' : 'hidden' }}
            >
              <Button
                shape="circle"
                style={{ border: 'none', background: 'transparent', width: '20px', height: '20px', fontSize: '12px' }}
                icon="up"
                size="small"
                onClick={this.handleBackTopClick}
              />
            </div>
          )}
        </Affix>
        <Table
          {...restProps}
          className={`${classnames(styles.table, styles.mainTable, `${styles.mainTable}-${this.hashCode}`, affixed && 'affixed', className)} m-table-customer`}
          rowKey={rowKey}
          columns={finalColumns}
          dataSource={dataSource}
          pagination={pagination}
          rowSelection={confirmCrossPageSelect || dataSource.length === 0 ? null : rowSelection}
        />
      </div>
    );
  }
}
