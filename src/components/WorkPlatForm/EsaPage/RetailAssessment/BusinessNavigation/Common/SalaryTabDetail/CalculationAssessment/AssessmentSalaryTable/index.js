import React, { Fragment } from 'react';
import FetchDataTable from '../../../../../../../../Common/FetchDataTable';
import { FetchqueryExamResultTabList } from '../../../../../../../../../services/EsaServices/navigation';

/**
 *  证券经纪人考核薪酬-计算考核表格组件
 */

class AssessmentSalaryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectData: {},
    };
  }
  // 选中行
  onClickRow = (record) => {
    const { selectData } = this.state;
    const { selectRowData } = this.props;
    if (selectData.id !== record.id) {
      this.setState({
        selectData: record,
      });
      if (typeof selectRowData === 'function') {
        selectRowData(record);
      }
    }
  }
  setRowClassName = (record) => {
    return record.id === this.state.selectData.id ? 'clickRowStyle' : '';
  }
  fetchColumns = () => {
    const columns = [
      {
        title: '考核月份',
        dataIndex: 'mon',
        key: 'mon',
        align: 'center',
      },
      {
        title: '营业部',
        dataIndex: 'orgName',
        key: 'orgName',
        align: 'center',
      },
      {
        title: '人员',
        dataIndex: 'empName',
        key: 'empName',
        render: (_value, row) => {
          return <span>{row.empName}/{row.empNo}</span>;
        },
        align: 'center',
      },
      {
        title: '人员类别',
        dataIndex: 'origClassName',
        key: 'origClassName',
        align: 'center',
      },
      {
        title: '原级别',
        dataIndex: 'origLevelName',
        key: 'origLevelName',
        align: 'center',
      },
      {
        title: '升降',
        dataIndex: 'upDownName',
        key: 'upDownName',
        align: 'center',
      },
      {
        title: '应调级别',
        dataIndex: 'trueLevelName',
        key: 'trueLevelName',
        align: 'center',
      },
      {
        title: '实际调整级别',
        dataIndex: 'trueLevelName',
        key: 'trueLevelName',
        align: 'center',
      },
      {
        title: '原状态',
        dataIndex: 'statusName',
        key: 'statusName',
        align: 'center',
      },
      {
        title: '原辅助状态',
        dataIndex: 'assisStsName',
        key: 'assisStsName',
        align: 'center',
      },
      {
        title: '应调状态',
        dataIndex: 'realStatusName',
        key: 'realStatusName',
        align: 'center',
      },
      {
        title: '应调辅助状态',
        dataIndex: 'realAssisStsName',
        key: 'realAssisStsName',
        align: 'center',
      },
      {
        title: '说明',
        dataIndex: 'remk',
        key: 'remk',
        align: 'left',
      },
    ];
    return columns;
  }
  render() {
    const { mon, orgNo, depClass, refreshNum } = this.props;
    const tableProps = {
      style: { marginTop: '17px' },
      rowKey: 'id',
      columns: this.fetchColumns(),
      locale: { emptyText: '暂无数据' },
      onRow: (record) => {
        return {
          onClick: () => this.onClickRow(record),
        };
      },
      rowClassName: this.setRowClassName,
      fetch: {
        service: orgNo ? FetchqueryExamResultTabList : null,
        params: {
          mon,
          orgNo,
          depClass,
          paging: 0,
          refreshNum,
        },
      },
      isPagination: true,
    };
    return (
      <Fragment>
        <FetchDataTable {...tableProps} />
      </Fragment >
    );
  }
}
export default AssessmentSalaryTable;
