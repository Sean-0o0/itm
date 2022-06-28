/* eslint-disable react/sort-comp */
import React, { Component, Fragment } from 'react';
import { message, Table, Input } from 'antd';
import { fetchObject } from '../../../../../../../services/sysCommon';
/**
 * 考核级别表格
 */
class AssessmentLevelTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {}, // 选择行
      keyWord: '', // 搜索关键字
      staffLevelData: [], // 人员级别数据
      total: '', // 数据总数
      current: 1, // 当前页
    };
  }
  componentDidMount() {
    this.fetchData();
  }

  // 获取人员级别数据
  fetchData = () => {
    const { classId = '' } = this.props;
    if (typeof (classId) !== 'undefined' && classId !== '') {
      const { keyWord = '' } = this.state;
      const condition = {
        level: keyWord,
        class_id: classId,
      }
      fetchObject('RYJBDY',{ condition }).then((res) => {
        const { note, code, records, total } = res;
        if (code > 0) {
          this.setState({ staffLevelData: records, total });
        } else {
          message.error(note);
        }
      }).catch((e) => {
        message.error(!e.success ? e.message : e.note);
      });
    } else {
      this.setState({
        staffLevelData: [],
      });
    }
  }

  // 修改关键字
  onChangeKeyWord = (e) => {
    this.setState({
      keyWord: e.target.value,
      current: 1,
    },()=>{
      this.fetchData();
    });
  }

  onPageChange = (page) => {
    this.setState({
      current: page,
    });
  }

  // 点击行
  onClickRow = (record) => {
    const { onClickRow } = this.props;
    if (typeof onClickRow === 'function') {
      this.props.onClickRow(record);
    }
    this.setState({
      selectedItem: record,
    });
  }

  // 设置选中行样式
  setRowClassName = (record = {}) => {
    const { selectedItem = {} } = this.state;
    return record.ID === selectedItem.ID ? 'clickRowStyle' : '';
  }

  // 配置表格列数据
  assembleColumns = () => {
    const { classId = '', className = '' } = this.props;
    const columns = [
      { title: '类别编码', dataIndex: 'CLASS_NO', render: () => { return classId; } },
      { title: '类别名称', dataIndex: 'CLASS_NAME', render: () => { return className; } },
      { title: '级别编码', dataIndex: 'LEVEL_NO' },
      { title: '级别名称', dataIndex: 'LEVEL_NAME' },
    ];
    return columns;
  }
  render() {
    const { staffLevelData = [], total, current } = this.state;
    const tableProps = {
      className: 'mb20',
      style: { marginTop: '17px' },
      columns: this.assembleColumns(),
      dataSource: staffLevelData,
      rowKey: 'ID',
      onRow: (record) => {
        return {
          onClick: () => this.onClickRow(record),
        };
      },
      rowClassName: this.setRowClassName,
      pagination: {
        total,
        current,
        className: 'm-paging',
        size: 'small',
        showLessItems: true,
        hideOnSinglePage: true,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.onPageChange,
      },
    };
    return (
      <Fragment>
        <Input.Search
          placeholder="输入关键字进行搜索"
          onChange={this.onChangeKeyWord}
        />
        {/* 内部对象无分页参数不适用FetchDataTable */}
        <Table {...tableProps} />
      </Fragment>
    );
  }
}

export default AssessmentLevelTable;
