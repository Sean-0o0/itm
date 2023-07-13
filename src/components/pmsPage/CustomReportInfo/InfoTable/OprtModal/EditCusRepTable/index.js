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
          rules: [{
            required: true,
            message: '请输入字段名称'
          }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'ZDLX':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          rules: [{
            required: true,
            message: '请选择字段类型'
          }],
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

class EditCusRepTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: [],
      count: 0,
    };
  }

  componentDidMount() {
    const {ZDYBGMB = [], bgid = '-1',} = this.props;
    let data = []
    const dataSource = [];
    // console.log("bgidbgid", bgid)
    if (bgid && bgid === '-1') {
      data = JSON.parse(ZDYBGMB[0].note);
    }
    data.map((item, index) => {
      const num = Number(index) + 1
      dataSource.push({
        key: num,
        ID: num,
        ['ZDMC' + num]: item.ZDMC,
        ['ZDLX' + num]: item.ZDLX,
      })
    })
    this.setState({
      dataSource,
      count: data.length
    }, () => {
      this.callbackData()
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {ZDYBGMB = [], bgid = '-1', bgmb = [],} = this.props;
    // console.log("bgidbgid222", bgid)
    if (prevProps.bgid !== bgid || prevProps.bgmb !== bgmb) {
      let data = []
      let dataSource = [];
      if (bgid !== '-1') {
        data = bgmb;
      } else {
        data = JSON.parse(ZDYBGMB[0].note);
      }
      let count = data.length;
      data.map((item, index) => {
        const num = Number(index) + 1
        dataSource.push({
          key: num,
          ID: num,
          ['ZDMC' + num]: item.ZDMC,
          ['ZDLX' + num]: item.ZDLX,
        })
      })
      if (bgid === '') {
        dataSource = []
        count = 0
      }
      this.setState({
        dataSource,
        count,
      }, () => {
        this.callbackData()
      })
    }
  }

  handleDelete = key => {
    const {dataSourceCallback} = this.props;
    const dataSource = [...this.state.dataSource];
    this.setState({dataSource: dataSource.filter(item => item.key !== key)}, () => {
      this.callbackData()
    });
  };

  handleAdd = () => {
    const {count, dataSource} = this.state;
    let num = Number(count) + 1
    const newData = {
      key: num,
      ID: num,
      ['ZDMC' + num]: '',
      ['ZDLX' + num]: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: num,
    }, () => {
      this.callbackData()
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
    this.setState({dataSource: newData}, () => {
      this.callbackData();
    });
  };

  //表格数据变化回调方法
  callbackData = () => {
    const {dataSourceCallback} = this.props;
    const {dataSource} = this.state;
    const arr = JSON.parse(JSON.stringify(dataSource));
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
    // console.log("newArrnewArr-CCC", newArr)
    dataSourceCallback([...newArr]);
  }

  ZDLXChange = (e, record, index) => {
    // console.log("e record, index",e, record, index)
    const {dataSource} = this.state;
    const arr = JSON.parse(JSON.stringify(dataSource));
    // console.log("tableData",tableData)
    arr.map(item => {
      if (item.ID === record.ID) {
        item['ZDLX' + item.ID] = e;
      }
    })
    this.setState({dataSource: [...arr]}, () => {
      this.callbackData();
    })
  }

  render() {
    const {dataSource} = this.state;
    const _this = this;
    //分类字段最多3个
    let ZDLXflag = dataSource.filter(item => item['ZDLX' + item.ID] === '1').length > 2;
    let columns = [
      {
        title: '字段名称',
        dataIndex: 'ZDMC',
        editable: true,
      },
      {
        title: '字段类型',
        dataIndex: 'ZDLX',
        width: '30%',
        ellipsis: true,
        render(text, record, index) {
          const ZDLX = [{ibm: '1', note: '分类字段'}, {ibm: '2', note: '填写字段'}]
          const ZDLX2 = [{ibm: '2', note: '填写字段'}]
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
        width: '8%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
              <a style={{color: '#3361ff'}}>删除</a>
            </Popconfirm>
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
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <div style={{
          textAlign: 'center',
          border: '1px dashed #e0e0e0',
          lineHeight: '32px',
          height: '32px',
          cursor: 'pointer',
          marginTop: '8px',
        }} onClick={() => this.handleAdd()}>
        <span className='addHover'>
                  <Icon type="plus" style={{fontSize: '12px'}}/>
                  <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增项目字段</span>
                </span>
        </div>
      </div>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(EditCusRepTable));
