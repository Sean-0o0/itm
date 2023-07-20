import {Table, Input, Button, Popconfirm, Form, Icon, Select, DatePicker, message} from 'antd';
import React from "react";
import moment from "moment";
import {connect} from "dva";
import {QueryMemberInfo, QueryProjectListPara} from "../../../../../../services/pmsServices";
import TreeUtils from "../../../../../../utils/treeUtils";
import {FetchQueryMemberInfo} from "../../../../../../services/projectManage";

const {Option} = Select;

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
    const {record, handleSave, formdecorate} = this.props;
    formdecorate.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      // this.toggleEdit();
      handleSave({...record, ...values});
    });
  };

  renderCell = form => {
    this.form = form;
    const {children, dataIndex, record, formdecorate, title} = this.props;
    const {editing} = this.state;
    return (
      <Form.Item style={{margin: 0}}>
        {this.renderItem(formdecorate, dataIndex, record)}
      </Form.Item>
      // ) : (
      //   <div
      //     className="editable-cell-value-wrap"
      //     style={{paddingRight: 24}}
      //     onClick={this.toggleEdit}
      //   >
      //     {children}
      //   </div>
    );
  };

  renderItem = (form, dataIndex, record) => {
    switch (dataIndex) {
      case 'ZDMC':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          // rules: [{
          //   required: true,
          //   message: '请输入字段名称'
          // }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'ZDLX':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          // rules: [{
          //   required: true,
          //   message: '请选择字段类型'
          // }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(<Select style={{textAlign: 'center'}}
                   ref={node => (this.input = node)}
                   onPressEnter={this.save}
                   onBlur={this.save}/>);
      default:
        return form.getFieldDecorator(dataIndex + record['ID'], {
          initialValue: String(record[dataIndex + record['ID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
    }
  }

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

const ZDLX = [{ibm: '1', note: '分类字段'}, {ibm: '2', note: '填写字段'}]
const ZDLX2 = [{ibm: '2', note: '填写字段'}]

class EditCusRepTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      //报告字段表格数据
      dataSource: [],
      count: 0,
    };
  }

  handleDelete = key => {
    //console.log("keykey-cc",key)
    const {presetFieldData, presetFieldDataCallback} = this.props;
    const dataSource = JSON.parse(JSON.stringify(presetFieldData));
    presetFieldDataCallback([...dataSource.filter(item => item.key !== key)]);
  };

  handleAdd = (index) => {
    const {presetFieldData, presetFieldDataCallback, count} = this.props;
    const arrData = JSON.parse(JSON.stringify(presetFieldData))
    let arrnew = [];
    presetFieldData.forEach(e => {
      arrnew.push(e.ID)
    })
    // console.log("arrnewarrnew", arrnew)
    let num = 0;
    if (arrnew.length > 0) {
      num = Number(Math.max(...arrnew)) + 1
    } else {
      num = num + 1
    }
    const newData = {
      key: num,
      ID: num,
      ['ZDMC' + num]: '',
      ['ZDLX' + num]: '',
    };
    arrData.splice(index + 1, 0, newData)
    console.log("arrnewarrnew", [...arrData])
    presetFieldDataCallback([...arrData]);
  };

  handleSave = row => {
    const {presetFieldData, presetFieldDataCallback} = this.props;
    const newData = JSON.parse(JSON.stringify(presetFieldData));
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log("newDatanewData", newData)
    presetFieldDataCallback([...newData]);
  };

  //表格数据变化回调方法
  callbackData = () => {
    const {presetFieldData, presetFieldDataCallback} = this.props;
    const arr = JSON.parse(JSON.stringify(presetFieldData));
    let newArr = [];
    arr.map((item) => {
      let obj = {
        key: String(item.ID),
        ID: String(item.ID),
        ZDMC: item['ZDMC' + item.ID],
        ZDLX: item['ZDLX' + item.ID],
      };
      newArr.push(obj);
    });
    presetFieldDataCallback([...newArr]);
  }

  ZDLXChange = (e, record, index) => {
    // //console.log("e record, index",e, record, index)
    const {presetFieldData, presetFieldDataCallback} = this.props;
    const arr = JSON.parse(JSON.stringify(presetFieldData));
    // //console.log("tableData",tableData)
    arr.map(item => {
      if (item.ID === record.ID) {
        item['ZDLX' + item.ID] = e;
      }
    })
    presetFieldDataCallback([...arr])
  }

  render() {
    const {presetFieldData = [], ZDLXflag = false} = this.props;
    const _this = this;
    let columns = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>字段名称</span>,
        dataIndex: 'ZDMC',
        editable: true,
        render(text, record, index) {
          return (<span>{text}</span>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>字段类型</span>,
        dataIndex: 'ZDLX',
        // width: '30%',
        ellipsis: true,
        render(text, record, index) {
          return (<Select style={{width: '100%'}} defaultValue={record['ZDLX' + record.ID]}
                          onChange={(e) => _this.ZDLXChange(e, record, index)}>
              {
                ZDLXflag ? (ZDLX2.length > 0 && ZDLX2.map((item, index) => {
                  return (
                    <Option key={item.ibm} value={item.ibm}>{item.note}</Option>
                  )
                })) : (ZDLX.length > 0 && ZDLX.map((item, index) => {
                  return (
                    <Option key={item.ibm} value={item.ibm}>{item.note}</Option>
                  )
                }))
              }
            </Select>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '140px',
        render: (text, record, index) =>
          presetFieldData.length >= 1 ? (
            <div style={{width: '100%'}}>
              <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
                <a style={{color: '#3361ff'}}>删除</a>
              </Popconfirm>
              <a style={{color: '#3361ff', marginLeft: 6}} onClick={() => this.handleAdd(index, record)}>下方插入行</a></div>
          ) : null,
      },
    ];
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    columns = columns.map(col => {
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
          key: col.key,
          formdecorate: this.props.form,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={presetFieldData}
          columns={columns}
          pagination={false}
        />
        {/*<div style={{*/}
        {/*  textAlign: 'center',*/}
        {/*  border: '1px dashed #e0e0e0',*/}
        {/*  lineHeight: '32px',*/}
        {/*  height: '32px',*/}
        {/*  cursor: 'pointer',*/}
        {/*  marginTop: '8px',*/}
        {/*}} onClick={() => this.handleAdd()}>*/}
        {/*<span className='addHover'>*/}
        {/*          <Icon type="plus" style={{fontSize: '12px'}}/>*/}
        {/*          <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增项目字段</span>*/}
        {/*        </span>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(EditCusRepTable));
