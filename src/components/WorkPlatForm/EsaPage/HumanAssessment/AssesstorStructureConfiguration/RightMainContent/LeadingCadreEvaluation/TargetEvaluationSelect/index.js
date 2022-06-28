/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Table, Input, Pagination } from 'antd';

const { Search } = Input;
/**
 * 右侧配置主要内容
 */

class TargetEvaluationSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowId: '',
      data: [],
      current: 1,
      pageSize: 8,
      dataSource: [],
    };
  }
  componentDidMount() {
    this.fetchState();
  }

  componentWillReceiveProps() {

  }
  fetchState = () => {
    const { current, pageSize } = this.state;
    const data = [
      { id: '0', rybh: '10020001', rymc: '赵某某' },
      { id: '1', rybh: '10020002', rymc: '钱某某' },
      { id: '2', rybh: '10020003', rymc: '孙某某' },
      { id: '3', rybh: '10020004', rymc: '李某某' },
      { id: '4', rybh: '10020005', rymc: '周某某' },
      { id: '5', rybh: '10020006', rymc: '吴某某' },
      { id: '6', rybh: '10020007', rymc: '郑某某' },
      { id: '7', rybh: '10020008', rymc: '王某某' },
      { id: '8', rybh: '10020009', rymc: '冯某某' },
      { id: '9', rybh: '10020010', rymc: '陈某某' },
      { id: '10', rybh: '10020011', rymc: '诸某某' },
      { id: '11', rybh: '10020012', rymc: '卫某某' },
      { id: '12', rybh: '10020013', rymc: '蒋某某' },
      { id: '13', rybh: '10020014', rymc: '沈某某' },
      { id: '14', rybh: '10020015', rymc: '韩某某' },
      { id: '15', rybh: '10020016', rymc: '杨某某' },
    ];
    const dataSource = data.slice((current - 1) * pageSize, pageSize);
    this.setState({
      data,
      dataSource,
    });
  }

  // 关键字搜索
  handleOnkeyWord = (value) => {
    const keyWord = value;

    // 筛选数据
    const { data } = this.state;
    const newData = data.filter((item) => {
      if (item.rybh.indexOf(keyWord) !== -1 || item.rymc.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });
    this.setState({
      current: 1,
      dataSource: newData,
    });
  }
  fetchColums = () => {
    const columns = [
      {
        title: '人员编号',
        dataIndex: 'rybh',
        key: 'rybh',
        width: '50%',
        textAlign: 'left',
      },
      {
        title: '人员名称',
        dataIndex: 'rymc',
        key: 'rymc',
        width: '50%',
        textAlign: 'left',
      },
    ];
    return columns;
  }
  handlePageChange = (page) => { // 页码改变时的回调
    const { data, pageSize } = this.state;
    const newData = data.slice((page - 1) * pageSize, page * pageSize);
    this.setState({
      current: page,
      dataSource: newData,
    });
  }
  // 选中行
  onClickRow = (record) => {
    return {
      onClick: () => {
        const { kpdxSelect } = this.props;
        if (kpdxSelect) {
          kpdxSelect(record);
        }
        let rowId = '';
        if (this.state.rowId !== record.id) {
          rowId = record.id;
        }
        this.setState({
          rowId,
        });
      },
    };
  }
  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyle' : '';
  }
  render() {
    const { data, current, pageSize, dataSource } = this.state;
    return (
      <Fragment>
        <Search placeholder="输入关键字进行搜索" onSearch={value => this.handleOnkeyWord(value)} enterButton style={{ width: '300px', marginBottom: '10px' }} />
        <Table
          className="tg-table"
          style={{ minWidth: '300px' }}
          columns={this.fetchColums()}
          dataSource={dataSource}
          pagination={false}
          size="middle "
          bordered={false}
          onRow={this.onClickRow}
          rowClassName={this.setRowClassName}
        />
        <div style={{ textAlign: 'right', margin: '10px' }}>
          <Pagination
            total={data.length}
            current={current}
            showTotal={total => `共 ${total} 条`}
            showQuickJumper
            defaultPageSize={pageSize}
            onChange={this.handlePageChange}
          />
        </div>
      </Fragment>
    );
  }
}

export default TargetEvaluationSelect;
