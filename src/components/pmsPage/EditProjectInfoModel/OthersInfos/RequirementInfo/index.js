import {Table, Input, Button, Popconfirm, Form, Icon} from 'antd';
import React, {Component} from "react";

const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({editing}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const {record, handleSave} = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({...record, ...values});
    });
  };

  renderCell = form => {
    this.form = form;
    const {children, dataIndex, record, title} = this.props;
    const {editing} = this.state;
    return editing ? (
      <Form.Item style={{margin: 0}}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}/>)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{paddingRight: 24}}
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

class RequirementInfo extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '需求标题',
        dataIndex: 'name',
        width: '30%',
      },
      {
        title: '需求内容',
        dataIndex: 'age',
      },
      {
        title: '需求日期',
        dataIndex: 'address',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [
        {
          key: '0',
          name: '项目立项',
          age: '风险标题1',
          address: '2022-02-06',
        },
      ],
      count: 1,
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({dataSource: dataSource.filter(item => item.key !== key)});
  };

  handleAdd = () => {
    const {count, dataSource} = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({dataSource: newData});
  };

  render() {
    const {dataSource} = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
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
      <div>
        <div style={{padding: '0 0 18px 0'}}>
          {/*<Icon type="caret-down" onClick={() => this.setState({basicInfoCollapse: !basicInfoCollapse})}*/}
          {/*      style={{fontSize: '2rem', cursor: 'pointer'}}/>*/}
          <span style={{
            paddingLeft: '6px',
            fontSize: '14px',
            lineHeight: '19px',
            fontWeight: 'bold',
            color: '#333333',
            display: 'flex',
            // borderLeft: '4px solid #3461FF'
          }}><div style={{
            width: '4px',
            height: '12px', background: '#3461FF', lineHeight: '19px', margin: '3.5px 3.5px 0 0'
          }}> </div>变更类或计划外需求</span>
        </div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          style={{paddingBottom: '12px',}}
        />
        <div style={{
          textAlign: 'center',
          border: '1px dashed #e0e0e0',
          lineHeight: '1.5',
          cursor: 'pointer'
        }} onClick={this.handleAdd}>
          <Icon type="plus" style={{fontSize: '12px'}}/><span
          style={{paddingLeft: '6px', fontSize: '14px'}}>新增需求</span>
        </div>
      </div>
    );
  }
}

export default RequirementInfo;
