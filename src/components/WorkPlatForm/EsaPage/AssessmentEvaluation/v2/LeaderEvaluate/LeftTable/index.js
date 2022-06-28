import React, { Component } from 'react';
import BasicDataTable from '../../../../../../Common/BasicDataTable'

/* 左侧表格 */
class LeftTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftColumns: [],  //左侧表格列
    };
  }
  componentDidMount() {
    const leftColumns = this.structLeftColumns();
    this.setState({
      leftColumns
    })
  }

  //构造左侧表格列
  structLeftColumns = () => {
    const { shuji = false, initialization } = this.props;
    const columns = shuji ? [
      {
        title: '职能部门/业务条线',
        dataIndex: 'orgName',
        width: '25%',
        render: (value, row, index) => {
          return (<span style={{ fontWeight: "600" }} title={initialization && value.length > 10 && value}>
            {initialization ? value.substr(0, 10) : value}{initialization && value.length > 10 && '...'}
          </span>)
        }
      },
      {
        title: '效率得分',
        dataIndex: 'effTotal',
        width: '15%',
        align: 'center',
      },
      {
        title: '总分',
        dataIndex: 'scorTotal',
        width: '15%',
        align: 'center',
      },
      {
        title: '评分状态',
        dataIndex: 'status',
        width: '15%',
        align: 'center',
        render: (value, row, index) => {
          return <span className='esa-evaluate-table-head-color' >{value}</span>
        }
      },
      {
        title: '评分进度',
        dataIndex: 'step',
        width: '30%',
        align: 'center',
      },
    ] : [
      {
        title: '职能部门/业务条线',
        dataIndex: 'orgName',
        width: '25%',
        render: (value, row, index) => {
          return (<span style={{ fontWeight: "600" }} title={initialization && value.length > 10 && value}>
            {initialization ? value.substr(0, 10) : value}{initialization && value.length > 10 && '...'}
          </span>)
        }
      },
      {
        title: '效率得分',
        dataIndex: 'effTotal',
        width: '12%',
        align: 'center',
      },
      {
        title: '质量得分',
        dataIndex: 'qltyTotal',
        width: '12%',
        align: 'center',
      },
      {
        title: '总分',
        dataIndex: 'scorTotal',
        width: '10%',
        align: 'center',
      },
      {
        title: '评分状态',
        dataIndex: 'status',
        width: '12%',
        align: 'center',
        render: (value, row, index) => {
          return <span className='esa-evaluate-table-head-color' >{value}</span>
        }
      },
      {
        title: '评分进度',
        dataIndex: 'step',
        width: '29%',
        align: 'center',
      },
    ];
    return columns;
  }


  //收缩之后的表格列
  structMinleftColumns = () => {
    const columns = [
      {
        title: '职能部门/业务条线',
        dataIndex: 'orgName',
        render: (value, row, index) => {
          return <span style={{ fontWeight: "600" }} title={value.length > 10 && value}>{value.substr(0, 10)}{value.length > 10 && '...'}</span>
        }
      },
    ];
    return columns;
  }

  //设置选中行样式
  setRowClassName = (record) => {
    const { selectedRow: { orgId = '', roleId = '' } } = this.props;
    return record.orgId === orgId && record.roleId === roleId ? 'clickRowStyle' : '';
  }
  // 选中行
  onClickRow = (record) => {
    return {
      onClick: () => {
        const { changeLeftColumnsStatus, changeSelectedRow, columnsMinStatus, selectedRow: { orgId = '', roleId = '' } } = this.props;
        if (record.orgId === orgId && record.roleId === roleId) {
          // 如果是收缩状态，再次点击 应该展开
          let leftColumns = []
          if (columnsMinStatus) {
            leftColumns = this.structLeftColumns();
          } else {
            leftColumns = this.structMinleftColumns();
          }
          if (typeof (changeLeftColumnsStatus) === "function") {
            changeLeftColumnsStatus(!columnsMinStatus)
          }
          this.setState({
            leftColumns
          })
        } else {
          let leftColumns = []
          if (columnsMinStatus) {
            leftColumns = this.structMinleftColumns();
          } else {
            leftColumns = this.structLeftColumns();
          }
          this.setState({
            leftColumns
          })
          if (typeof (changeSelectedRow) === "function") {
            changeSelectedRow(record)
          }
        }
      },
    };
  }

  render() {
    const { height, data: { records = [] }  } = this.props;
    const { leftColumns, } = this.state;
    return (
      // <Scrollbars
      //   autoHide
      //   style={{ height: height, minHeight: 270 }}
      //   renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}
      // >
        <BasicDataTable
          className="esa-evaluate-lender-left-table"
          columns={leftColumns}
          dataSource={records}
          pagination={false}
          bordered
          rowClassName={this.setRowClassName}
          onRow={this.onClickRow}
          // rowKey="orgId"
          scroll={{ y: height < (records.length + 1) * 40 && height - 40 }}
        />
      // </Scrollbars>
    );
  }
}

// export default BusEvaluate;
export default LeftTable;
