import React from 'react';
import { Table, Input } from 'antd';

const { Search } = Input;

class MemberSingleSlect extends React.Component {
  state = {
    keyword: '',
  }
  // 分页页签点击事件
  onChange = (pagination) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, this.state.keyword);
    }
  }
  // 每行点击事件
  defaultClick = (e, record) => {
    const { onRowClick } = this.props;
    if (onRowClick) {
      onRowClick(e, record);
    }
  }
  // 搜索事件
  searchClick = (value) => {
    const { handleSearch } = this.props;
    this.setState({ keyword: value });
    if (handleSearch) {
      handleSearch(value);
    }
  }
  render() {
    const { columns, dataSource, rowKey } = this.props;
    const tableProps = {
      columns,
      dataSource,
      rowKey,
      onChange: this.onChange,
      onRow: (record) => {
        return {
          onClick: e => this.defaultClick(e, record),
        };
      },
    };
    return (
      <div>
        <div style={{ paddingLeft: '1rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
          关键字：<Search
            placeholder="请输入..."
            onSearch={(value) => { this.searchClick(value); }}
            style={{ width: '15rem' }}
          />
        </div>
        <Table {...tableProps} />
      </div>
    );
  }
}

export default MemberSingleSlect;
