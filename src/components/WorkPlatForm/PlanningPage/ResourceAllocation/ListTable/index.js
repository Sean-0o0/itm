import React from 'react';
import { connect } from 'dva';
import { Form, Input, Table, Pagination, Tooltip } from 'antd';
import { FetchQueryResourceAllocation } from '../../../../../services/planning/planning';


const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
    current: 1,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class ListTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yr: 2022,
      resClass: 1,
      columns: [],
      data: [],
      selectRows: [],
      selectedRowKeys: [],
    };
  }

  componentWillReceiveProps(nextProos) {
    const { data = [] } = nextProos;
    if (nextProos !== this.props) {
      this.setState({
        data,
      })
    }
    const columns = [
      {
        title: "年份",
        dataIndex: 'yr',
        // width: '8%',
      },
      {
        title: "资源类别",
        dataIndex: 'resClassName',
        // width: '18.4%',
        // editable: true,
      },
      {
        title: "当前实际情况",
        dataIndex: 'nowNum',
        // width: '18.4%',
        editable: true,
      },
      {
        title: "计划情况",
        dataIndex: 'planNum',
        // width: '18.4%',
        editable: true,
      },
      {
        title: "拟增配情况",
        dataIndex: 'addNum',
        // width: '18.4%',
        editable: true,
      },
      {
        title: "备注",
        dataIndex: 'remark',
        // width: '18.4%',
        editable: true,
        render: (text) => {
          return <Tooltip title={text}><span style={{ display: 'flex' }}>{text.length > 8 ? text.slice(0, 8) + '...' : text}</span></Tooltip>
        }
      },
    ];

    this.setState({
      columns,
    });
  }

  //查询资源明细情况 部门资源得时候传orgid=1
  FetchQueryResourceAllocationDetail = (record) => {
    const { changeTableData, page, pageSize } = this.props;
    FetchQueryResourceAllocation({
      //VIEWTYPE入参为3时，查询资源明细情况。
      'viewType': 3,
      'orgId': 1,
      //查询资源明细 Restype= 点击的父列表里返回的 resClass
      'resType': record?.resClass,
      //查询资源明细 yr= 点击的父列表里返回的 yr
      'yr': record?.yr,
      'current': page,
      'pageSize': pageSize,
      'total': -1,
      'paging': 1,
      'sort': ''
    }).then((res) => {
      changeTableData('', res.records, record, res.records[0], '', '', res.totalrows);
    });
  };

  //拼接planId
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { handlePlanIdStr } = this.props;
    this.setState({ selectedRowKeys }, () => {
      handlePlanIdStr(selectedRows);
    });
  };

  handleSave = row => {
    const newData = [...this.state.data];
    const { handlePlanIdStr } = this.props;
    const index = newData.findIndex(item => row.fid === item.fid);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ data: newData }, () => {
      handlePlanIdStr(newData);
    });
  };

  showTotal = (total) => {
    return `共 ${total} 条`;
  }

  handlPageChange = (page, pageSize) => {
    this.setState({
      current:page,
    })
    const { handlPageChangeStr } = this.props;
    handlPageChangeStr(page === 0 ? 1 : page, pageSize);
  }

  render() {
    const { columns = [], data,current } = this.state;
    const { total } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const column = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div style={{ marginTop: '1rem' }}>
        {
          data.length > 0 ? <Table
            onRow={record => {
              return {
                // 点击行
                onClick: e => {
                  this.FetchQueryResourceAllocationDetail(record);
                },
              };
            }}
            bodyStyle={{ minHeight: '27rem' }}
            components={components}
            rowClassName={() => 'editable-row'}
            // className='esa-evaluate-lender-left-table'
            // rowSelection={rowSelection}
            columns={column}
            dataSource={data}
            pagination={{
              simple: false,
              current: current,
              total: total,
              pageSize: 5,
              showQuickJumper: true,
              showTotal: (count = total) => {
                return '共 '+ count + ' 条'
              },
              //onChange:ChangePage(),
              onChange: (page, pageSize) => {
                this.handlPageChange(page, pageSize)
              },
              onShowSizeChange: (current, size) => {
                this.handlPageChange(current, size)
              }
            }}
            key={'1'}
            rowKey={record => record.fid}
          // scroll={{ x: 1000 }}
          /> : <Table
            onRow={record => {
              return {
                // 点击行
                onClick: e => {
                  this.FetchQueryResourceAllocationDetail(record);
                },
              };
            }}
            components={components}
            rowClassName={() => 'editable-row'}
            // className='esa-evaluate-lender-left-table'
            // rowSelection={rowSelection}
            columns={column}
            dataSource={data}
            pagination={false}
            key={'1'}
            rowKey={record => record.fid}
          // scroll={{ x: 1000 }}
          />
        }
        {/* <Pagination style ={{padding: '2rem',textAlign: 'right',}} size="small" total={total} defaultPageSize={5} showQuickJumper showTotal={this.showTotal} onChange={this.handlPageChange} onShowSizeChange={this.handlPageChange}/> */}
      </div>
    );
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(ListTable);
