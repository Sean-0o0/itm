import React from 'react';
import MemberSingleSelect from '../../components/Common/MemberSingleSelect';

const dataSource = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '5',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '6',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '7',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '8',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '9',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '10',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '11',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '12',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '13',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '14',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  // render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}];

export default class MemberSingleSelectDemo extends React.Component {
  state={
    value: '',
  }
  // 每行点击事件
  onRowClick = (e, record) => {
    const { key: value } = record;
    this.setState({ value });
    // console.info(value, record);
  }
  // 分页页签点击事件
  handleTableChange = (pagination, keyword) => {
    console.info(pagination, keyword);  // eslint-disable-line
  }
  // 搜索事件
  handleSearch = (keyword) => {
    console.info(keyword);  // eslint-disable-line
  }
  render() {
    const { value } = this.state;
    const tableProps = {
      rowKey: 'key',
      value,
      columns,
      dataSource,
      onRowClick: this.onRowClick,
      onChange: this.handleTableChange,
      handleSearch: this.handleSearch,
    };
    return (
      <MemberSingleSelect {...tableProps} />
    );
  }
}
