import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
import { FetchQueryListClassProgram } from '../../../../../../../services/EsaServices/gradeAssessment';
import FetchDataTable from '../../../../../../Common/FetchDataTable';
/**
 * 考核方案表格
 */
class AssessmentProgramTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {}, // 选中项
      keyWord: '', // 关键字
    };
  }

  // 修改关键字
  onChangeKeyWord = (e) => {
    this.setState({
      keyWord: e.target.value,
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
    return record.id === selectedItem.id ? 'clickRowStyle' : '';
  }

  // 配置表格列数据
  assembleColumns = () => {
    const columns = [
      { title: '营业部', dataIndex: 'orgName' },
      { title: '考核类别', dataIndex: 'className' },
      { title: '定级类别', dataIndex: 'rankTypeName' },
    ];
    return columns;
  }

  render() {
    const { orgId = '',versionId = '' } = this.props;
    const { keyWord = '' } = this.state;
    const tableProps = {
      style: { marginTop: '17px' },
      rowKey: 'id',
      columns: this.assembleColumns(),
      locale: { emptyText: '暂无数据' },
      onRow: (record) => {
        return {
          onClick: () => this.onClickRow(record),
        };
      },
      rowClassName: this.setRowClassName,
      fetch: {
        service: typeof (orgId) !== 'undefined' && orgId !== '' ? FetchQueryListClassProgram : null,
        params: {
          examClass: '',
          id: '',
          keyWord,
          orgNo: orgId,
          versionId,
        },
      },
      pagination: {
        pageSize: 10,
        size: 'small',
      },
      isPagination: true,
    };
    return (
      <Fragment>
        <Input.Search
          placeholder="输入关键字进行搜索"
          onChange={this.onChangeKeyWord}
        />
        <FetchDataTable {...tableProps} />
      </Fragment>
    );
  }
}

export default AssessmentProgramTable;
