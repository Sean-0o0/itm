import {Form, Input, message, Popconfirm, Select, Table} from 'antd';
import React from "react";
import {QueryMemberInfo, QueryProjectListPara} from "../../../../../../services/pmsServices";

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
      case 'ZD1':
        return form.getFieldDecorator(record['ID'] + dataIndex, {
          // rules: [{
          //   required: true,
          //   message: '请输入字段名称'
          // }],
          initialValue: String(record[record['ID'] + dataIndex]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'GLXM':
        return form.getFieldDecorator(record['ID'] + dataIndex, {
          // rules: [{
          //   required: true,
          //   message: '请选择字段类型'
          // }],
          initialValue: String(record[record['ID'] + dataIndex]),
        })(<Select style={{textAlign: 'center'}}
                   ref={node => (this.input = node)}
                   onPressEnter={this.save}
                   onBlur={this.save}/>);
      // case 'TXR':
      //   return form.getFieldDecorator(record['ID'] + dataIndex, {
      //     // rules: [{
      //     //   required: true,
      //     //   message: '请选择字段类型'
      //     // }],
      //     initialValue: String(record[record['ID'] + dataIndex]),
      //   })(<Select style={{textAlign: 'center'}}
      //              ref={node => (this.input = node)}
      //              onPressEnter={this.save}
      //              onBlur={this.save}/>);
      default:
        return form.getFieldDecorator(record['ID'] + dataIndex, {
          initialValue: String(record[record['ID'] + dataIndex]),
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

class PresetTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffData: [],
      prjNameData: [],//关联项目
    };
  }

  componentDidMount() {
    //人员信息
    this.getStaffData();
    //关联项目
    this.getFilterData();
  }

  //获取人员数据
  getStaffData = (orgArr = []) => {
    QueryMemberInfo({
      type: 'XXJS',
    })
      .then(res => {
        if (res?.success) {
          let memberArr = JSON.parse(res.record);
          this.setState({
            staffData: [...memberArr]
          })
        }
      })
      .catch(e => {
        setMemberLoading(false);
        message.error('人员信息查询失败', 1);
        console.error('QueryMemberInfo', e);
      });
  };

  //顶部下拉框查询数据
  getFilterData = () => {
    QueryProjectListPara({
      current: 1,
      czr: 0,
      pageSize: 10,
      paging: 1,
      sort: 'string',
      total: -1,
      cxlx: 'XMLB',
    })
      .then(res => {
        if (res?.success) {
          this.setState({
            prjNameData: [...JSON.parse(res.projectRecord)]
          })
        }
      })
      .catch(e => {
        console.error('QueryProjectListPara', e);
        message.error('下拉框信息查询失败', 1);
      });
  };

  handleDelete = key => {
    const {setTableData} = this.props;
    const tableData = [...this.props.tableData];
    setTableData([...tableData.filter(item => item.key !== key)]);
  };

  handleAdd = (index, record) => {
    const {setTableData, columns} = this.props;
    const arrData = [...this.props.tableData];
    const keysArr = [];
    columns.map(c => {
      keysArr.push(c.dataIndex)
    })
    console.log("keysArrkeysArr", keysArr)
    console.log("keysArrkeysArr", keysArr)
    console.log("arrDataarrData", arrData)
    const newData = {}
    newData.ID = Date.now();
    newData.key = Date.now();
    newData.SYJL = '-1';
    // newData.GLXM = '';
    // newData.TXR = '';
    // newData.newDataFlag = true;
    keysArr.map(i => {
      if (i === 'GLXM' || i === 'TXR') {
        newData[i + newData.ID] = record[i + record.ID]
      } else {
        Object.assign(newData, {[newData.ID + i]: record[record.ID + i]})
      }
    })
    arrData.splice(index + 1, 0, newData)
    // console.log("arrDataarrData",arrData)
    setTableData([...arrData])
    this.callbackData([...arrData]);
  };

  //表格数据变化回调方法
  callbackData = (tableData) => {
    const {presetTablDataSourceCallback} = this.props;
    const arr = JSON.parse(JSON.stringify(tableData));
    console.log("arrarr", arr)
    //处理预设数据
    let newObj = null
    const newDataSource = [];
    arr.map((item) => {
      let keysArr = Object.keys(item)
      newObj = JSON.parse(JSON.stringify(item));
      keysArr.map(i => {
        //处理字段ZD
        if (i !== 'key' && i !== 'ID' && i !== 'YF' && i !== 'GXZT' && i !== 'SYJL' && !i.includes('GLXM') && !i.includes('TXR') && i !== 'newDataFlag') {
          let index = i.indexOf("Z");//获取第一个"Z"的位置
          let after1 = i.substring(index + 1);
          newObj["Z" + after1] = item[i];
          delete newObj[i];
        }
        if (i !== 'key' || i !== 'ID') {
          delete newObj['key'];
          delete newObj['ID'];
        }
        if (i.includes('GLXM')) {
          newObj["GLXM"] = item[i];
          delete newObj[i];
        }
        if (i.includes('TXR')) {
          newObj["TXR"] = item[i];
          delete newObj[i];
        }
        if (i === 'YF') {
          newObj["YF"] = item[i];
          delete item[i];
        }
        if (i === 'GXZT') {
          newObj["GXZT"] = item[i];
          delete item[i];
        }
        if (i === 'SYJL') {
          newObj["SYJL"] = item[i];
          delete item[i];
        }
      })
      newDataSource.push(newObj)
    })
    presetTablDataSourceCallback(newDataSource);
  }


  handleSave = row => {
    const {presetTablDataSourceCallback, tableData, setTableData} = this.props;
    const newData = [...tableData];
    console.log("newDatanewData", newData)
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    console.log("rowrow", row)
    console.log("itemitem", item)
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log("newDatanewData2222", newData)
    setTableData([...newData]);
    this.callbackData([...newData]);
  };

  ZDLXChange = (e, record, index, key) => {
    console.log("e record, index", e, record, index)
    const {presetTablDataSourceCallback, tableData, setTableData} = this.props;
    let arr = JSON.parse(JSON.stringify(tableData));
    console.log("arrarr", arr)
    arr.map(item => {
      if (item.ID === record.ID) {
        item[key + item.ID] = e;
      }
    })
    console.log("arr", arr)
    setTableData([...arr])
    this.callbackData([...arr]);
  }

  render() {
    const {staffData = [], prjNameData = []} = this.state;
    const {columns, tableData} = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const _this = this;
    if (columns.filter(item => item.title === '关联项目').length === 0) {
      columns.push({
        title: '关联项目',
        dataIndex: 'GLXM',
        // editable: true,
        ellipsis: true,
        ZDLX: '1',
        render(text, record, index) {
          return (<Select style={{width: '100%'}} defaultValue={record['GLXM' + record.ID]}
                          onChange={(e) => _this.ZDLXChange(e, record, index, 'GLXM')}>
              {prjNameData.map((x, i) => (
                <Option key={i} value={x.XMID}>
                  {x.XMMC}
                </Option>
              ))}
            </Select>
          )
        }
      })
    }
    if (columns.filter(item => item.title === '填写人').length === 0) {
      columns.push({
        title: '填写人',
        dataIndex: 'TXR',
        ellipsis: true,
        ZDLX: '1',
        render(text, record, index) {
          return (<Select style={{width: '100%'}} defaultValue={record['TXR' + record.ID]}
                          onChange={(e) => _this.ZDLXChange(e, record, index, 'TXR')}>
              {staffData.map((x, i) => (
                <Option key={i} value={x.id}>
                  {x.name}
                </Option>
              ))}
            </Select>
          )
        }
      })
    }
    ;
    let column = columns?.map(col => {
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
    //操作列
    const ext = [
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record, index) =>
          this.props.tableData.length >= 1 ? (
            <>
              <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
                <a style={{color: '#3361ff'}}>删除</a>
              </Popconfirm>
              <a style={{color: '#3361ff', marginLeft: 6}} onClick={() => this.handleAdd(index, record)}>下方插入行</a></>
          ) : null,
      }]
    column = [...column, ...ext];
    return (
      <div>
        <Table
          components={components}
          rowKey={record => record.ID}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={tableData}
          columns={column}
          scroll={{x: 1500}}
          pagination={false}
        />
      </div>
    );
  }
}

export default Form.create()(PresetTable);
