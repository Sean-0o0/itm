import React from 'react';
import { Resizable } from 'react-resizable';
import BasicDataTable from '../BasicDataTable';
import styles from './index.less';
// import classnames from 'classnames';
// import styles from './ExampleTable.css';

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable width={width} height={0} onResize={onResize} draggableOpts={{ enableUserSelectHack: false }}>
      <th {...restProps} />
    </Resizable>
  );
};

class ScrollToNormalTabl extends React.Component {
  state = {
    columns: this.props.columns,
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: nextProps.columns,
    });
  }
  // 选择状态改变时的操作
  onSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    const { selectDatas } = this.state;
    selectDatas.selectAll = currentSelectAll;
    selectDatas.selectedRowKeys = currentSelectedRowKeys;
    this.setState({ selectDatas });
  }
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };
  handleResize = index => (e, { size }) => {
    e.stopPropagation();
    const widthTemp = size.width < 170 ? 170 : size.width;
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: widthTemp,
      };
      return { columns: nextColumns };
    });
    this.isResizeStop = true;
  };
  onChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, this.isResizeStop);
    }
    this.isResizeStop = false;
  }
  titleRender = (width, text) => {
    let titleTemp = text || '--';
    let charWidth = 18; // 文字宽度
    if (window.screen.height > 768) {
      charWidth = 20;
    }
    const sumWidth = (titleTemp.length * charWidth) + 40;
    if (sumWidth > width) {
      const countTemp = Math.floor((width - 40) / charWidth);
      titleTemp = titleTemp.substr(0, countTemp).concat('...');
    }
    return <span className="title" title={text}>{titleTemp}</span>;
  }
  textRender = (width, text) => {
    let titleTemp = text || '--';
    let flag = 15;
    if (/^\d+(\.\d+)?$/.test(text)) {
      flag = 10;
    }
    const sumWidth = (titleTemp.length * flag) + 40;
    if (sumWidth > width) {
      const countTemp = Math.floor((width - 40) / flag);
      titleTemp = titleTemp.substr(0, countTemp).concat('...');
    }
    return <span className="title" title={text}>{titleTemp}</span>;
  }

  transferColumns = (columns, fixedColumnCount, rightFixedColumnCount, resultCount = 0, isFixed = -1) => {
    const { isColumnDrag = -1 } = this.props;
    const tableColumns = [];
    columns.map((item, index) => {
      const { id, dataKey, label, cellRenderer, onHeaderCell, width = 185, render, ...otherColumnProps } = item;
      const tableItem = {
        ...otherColumnProps,
        title: typeof label === 'object' ? label : this.titleRender(width, label),
        dataIndex: dataKey,
        key: id,
        // width,
        width: index === columns.length - 1 ? '' : width,
        render: typeof render === 'function' ? render : text => <div title={text}>{this.textRender(width, text)}</div>,
        fixed: (index + 1 <= fixedColumnCount && resultCount !== 0 && isFixed === 0) ? 'left' : ((rightFixedColumnCount > 0 && rightFixedColumnCount >= (columns.length - index)) ? 'right' : false),
        onHeaderCell: column => ({
          width: column.width,
          onResize: isColumnDrag !== -1 ? this.handleResize(index) : '',
        }),
      };
      tableColumns.push(tableItem);
      return true;
    });
    return tableColumns;
  };
  // 计算表格宽度
  countWidth = (columns) => {
    let widths = 0;
    columns.forEach((col) => {
      widths += col.width || 185;
    });
    return widths;
  }
  render() {
    const { columns } = this.state;
    // table父dom元素 isScrollY：是否需要Y轴滚动条 maxPageTotals: 最大页码数
    // isColumnDrag 是否需要列拉伸 -1否|1是   isCheckboxFrz checkbox是否需要列固定
    const { dataSource = [], columns: columnsProp, isScrollY = -1, scrollHeight = 0, maxPageTotals = -1, fixedColumnCount = 0, rightFixedColumnCount = 0, scrollElement, pagination = {}, rowSelection, isColumnDrag = -1, isCheckboxFrz = -1, tableScrollWidth = 0, ...otherProps } = this.props;
    let isTableScrollX = false; // 是否需要X轴横向滚动
    let tableScrollX = tableScrollWidth; // 表格宽度
    let countWidthLength = this.countWidth(columns); // 计算表格总宽度
    if (tableScrollWidth === 0) {
      countWidthLength = rowSelection ? countWidthLength + 62 : countWidthLength; // 有选择的时候加上checkbox的宽度
      tableScrollX = ((scrollElement.clientWidth < countWidthLength) ? countWidthLength + 20 : scrollElement.clientWidth - 40); // 是否需要表格横向滚动条
      isTableScrollX = (scrollElement.clientWidth < countWidthLength);
    }
    const isFixed = (scrollElement.clientWidth > countWidthLength) ? -1 : 0; // 是否需要列固定
    let tableHeight = scrollHeight;
    if (isScrollY !== -1) {
      tableHeight = tableHeight !== 0 ? scrollHeight : (window.innerHeight - 60 - 80 - 60 - 60 - 90); // 计算表格scroll高度
    }
    // const scrollFlag = scrollElement.clientWidth < (columns.length * 185) ? 1 : -1; // 是否需要x轴滚动条 1: 需要| 0:不需要
    const tableColumns = this.transferColumns(columns || [], fixedColumnCount, rightFixedColumnCount, dataSource.length, isFixed); // 计算表格scroll宽度
    let tableRowSelection;
    if (rowSelection) {
      tableRowSelection = {
        ...rowSelection,
        fixed: isCheckboxFrz === 1 ? 'left' : '',
        columnWidth: 62,
      };
    }
    let maxPagers = pagination.total;
    if (maxPageTotals !== -1) {
      maxPagers = pagination.total > pagination.pageSize * maxPageTotals ? pagination.pageSize * maxPageTotals : pagination.total;
    }
    return (
      <BasicDataTable
        {...otherProps}
        className={`${dataSource.length === 0 ? styles.no_data_classs : ''} ${styles.myTable} ${styles.sorterSearch} m-table-customer`}
        components={(isColumnDrag === 1 && dataSource.length !== 0) ? this.components : {}}
        columns={tableColumns}
        dataSource={dataSource}
        scroll={{ x: isTableScrollX ? tableScrollX : '', y: isScrollY === -1 ? '' : tableHeight }}
        pagination={pagination.current ? {
          className: pagination.className || 'm-paging',
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: maxPagers,
          showQuickJumper: false,
          showTotal: () => `共${pagination.total}条`,
          onChange: pagination.onChange,
          style: { paddingBottom: '10px', paddingTop: '10px' },
        } :
        {
          className: pagination.className || 'm-paging',
          showQuickJumper: false,
          showTotal: total => `共${total}条`,
          style: { paddingBottom: '10px', paddingTop: '10px' },
        }
        }
        rowSelection={tableRowSelection}
        onChange={this.onChange}
      />
    );
  }
}
export default ScrollToNormalTabl;
