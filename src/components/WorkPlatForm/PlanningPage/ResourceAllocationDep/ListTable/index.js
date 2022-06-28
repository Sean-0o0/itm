import React from 'react';
import { connect } from 'dva';
import { Form, Input, Table, Pagination, Tooltip } from 'antd';
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

class ListTableDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      data: [],
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
        title: "组织机构",
        dataIndex: 'orgName',
        // width: '15%',
        // editable: true,
      },
      {
        title: "资源类别",
        dataIndex: 'resClassName',
        // width: '15%',
        // editable: true,
      },
      {
        title: "当前实际情况",
        dataIndex: 'nowNum',
        // width: '15%',
        editable: true,
      },
      {
        title: "计划情况",
        dataIndex: 'planNum',
        // width: '15%',
        editable: true,
      },
      {
        title: "拟增配情况",
        dataIndex: 'addNum',
        // width: '15%',
        editable: true,
      },
      {
        title: "备注",
        dataIndex: 'remark',
        // width: '20%',
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
    const { changeTableData } = this.props;
    changeTableData('', '', record, '', '','');
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
      current: page,
    })
    const { handlPageChangeStr } = this.props;
    handlPageChangeStr(page === 0 ? 1 : page, pageSize);
  }


  render() {
    const { columns = [], data, current } = this.state;
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
            bodyStyle={{ minHeight: '37rem' }}
            components={components}
            rowClassName={() => 'editable-row'}
            columns={column}
            dataSource={data}
            pagination={{
              simple: false,
              current: current,
              total: total,
              pageSize: 5,
              showQuickJumper: true,
              showTotal: (count = total) => {
                return '共 ' + count + ' 条'
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
            scroll={{ x: 1200 }}
          /> : <Table
            onRow={record => {
              return {
                // 点击行
                onClick: e => {
                  this.FetchQueryResourceAllocationDetail(record);
                },
              };
            }}
            // bodyStyle={{ minHeight: '37rem' }}
            components={components}
            rowClassName={() => 'editable-row'}
            columns={column}
            dataSource={data}
            pagination={false}
            key={'1'}
            rowKey={record => record.fid}
            scroll={{ x: 1200 }}
          />
        }
        {/* <Pagination style={{ padding: '2rem', textAlign: 'right', }} size="small" total={total} defaultPageSize={5} showQuickJumper showTotal={this.showTotal} onChange={this.handlPageChange} onShowSizeChange={this.handlPageChange} /> */}
      </div>

    );
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(ListTableDetail);
