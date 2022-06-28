import React from 'react';
import ScrollToNormalTable from '../ScrollToNormalTable';
// import VTable from '../VTable';

class FakeTable extends React.Component {
  constructor(props) {
    super();
    const { pagination = { current: 1, pageSize: 10, total: 0 }, dataSource = [], columns } = props;
    const { pageSize = 10 } = pagination;
    const childrenData = [];
    for (let i = 0; i < pageSize; i++) {
      if (dataSource[i]) {
        const newData = dataSource[i];
        newData.rowKey = i + 1;
        childrenData.push(newData);
      }
    }
    this.state = {
      pagination: {
        ...pagination,
        total: dataSource.length, // 总条数
      },
      childrenData,
      columns,
      dataSource,
      scrollElement: null, // 滚动条容器
    };
  }
  componentWillReceiveProps(props) {
    const { columns, dataSource = [], pagination } = props;
    const { pageSize = 20 } = pagination;
    const childrenData = [];
    for (let i = 0; i < pageSize; i++) {
      if (dataSource[i]) {
        const newData = dataSource[i];
        newData.rowKey = i + 1;
        childrenData.push(newData);
      }
    }
    this.setState({ columns, childrenData, dataSource, pagination: { ...pagination, total: dataSource.length } });
  }
  _setScrollElement = (scrollElement) => {
    if (scrollElement) {
      this.setState({
        scrollElement,
      });
    }
  }
  handlePagerChange = (current, pageSize) => {
    const { dataSource, pagination } = this.state;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const childrenData = [];
    for (let i = start; i < end; i++) {
      if (dataSource[i]) {
        const newData = dataSource[i];
        newData.rowKey = i + 1;
        childrenData.push(newData);
      }
    }
    this.setState({ childrenData, pagination: { ...pagination, current, pageSize } });
  }
  render() {
    const { columns, childrenData = [], pagination = {
      current: 1,
      pageSize: 20,
      total: 0,
    } } = this.state;
    const { loading = false, fixedHeaderEnabled = true, rowKey = 'rowKey', fixedColumnCount = 0, ...otherColumnsProps } = this.props;
    pagination.onChange = this.handlePagerChange;
    const tableProps = {
      ...otherColumnsProps,
      loading,
      fixedHeaderEnabled,
      fixedColumnCount,
      rowKey,
      dataSource: childrenData,
      pagination: {
        ...pagination,
        onChange: this.handlePagerChange,
      },
      scrollElement: this.state.scrollElement,
    };
    return (
      <div ref={this._setScrollElement}>
        { this.state.scrollElement && <ScrollToNormalTable {...tableProps} columns={columns} /> }
      </div>
      // <VTable {...tableProps} />
    );
  }
}
export default FakeTable;
