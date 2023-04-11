import {Table, Input, Button, Popconfirm, Form, Icon, DatePicker, Select, message} from 'antd';
import React, {Component} from "react";
import moment from "moment";
import {QueryPaymentAccountList} from "../../../../../services/pmsServices";
import {connect} from "dva";
import {FetchQueryProjectInfoAll} from "../../../../../services/projectManage";
const {Option} = Select

//-----------付款详情--------------//
const EditableContext = React.createContext(1);

const EditableRow = ({form, index, ...props}) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  )
};
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  save = e => {
    const {record, handleSave, formdecorate} = this.props;
    formdecorate.validateFields(['JXMC' + record['ID'], 'RYDJ' + record['ID'], 'ZSCQLX' + record['ID'], 'HJSJ' + record['ID']], (error, values) => {
      if (error && error[e.currentTarget.ID]) {
        return;
      }
      handleSave({...record, ...values});
    });

  };

  renderItem = (form, dataIndex, record) => {
    switch (dataIndex) {
      case 'HJSJ':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          rules: [{
            required: true,
            message: '请选择获奖时间'
          }],
          initialValue: moment(record[dataIndex + record['ID']]) || null,
        })(<DatePicker ref={node => (this.input = node)}
                       onChange={(data, dataString) => {
                         const {record, handleSave} = this.props;
                         form.validateFields(['JXMC' + record['ID'], 'RYDJ' + record['ID'], 'ZSCQLX' + record['ID'], 'HJSJ' + record['ID']], (error, values) => {
                           // console.log('values', values);
                           if (error && error[e.currentTarget.id]) {
                             return;
                           }
                           let newValues = {};
                           newValues = {...values};
                           for (let i in newValues) {
                             if (i === 'HJSJ' + record['ID']) {
                               newValues[i] = dataString;
                             }
                           }
                           // this.toggleEdit();
                           handleSave({...record, ...newValues});
                         });
                       }}
        />);
      case 'JXMC':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          rules: [{
            required: true,
            message: '请输入奖项名称'
          }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'RYDJ':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          rules: [{
            required: true,
            message: '请选择荣誉等级'
          }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'ZSCQLX':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          rules: [{
            required: true,
            message: '请选择知识产权类型'
          }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(<Input style={{textAlign: 'center'}}
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
  renderCell = form => {
    // this.form = form;
    const {dataIndex, record, children, formdecorate, index} = this.props;
    const {editing} = this.state;
    return (true ? (
        <Form.Item style={{margin: 0}}>
          {this.renderItem(formdecorate, dataIndex, record)}
        </Form.Item>) :
      <div
        className="editable-cell-value-wrap"
        // onClick={this.toggleEdit}
      >
        {children}
      </div>);
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

function getID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


class PrizeInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      //接口查出来是否存在获奖信息的数据
      hjxxRecordFlag: false,
    };
  }

  componentDidMount = () => {
    this.fetchQueryProjectInfoAll();
  }

//----------------其他供应商-----------------//

  //合同信息修改付款详情表格多行删除
  handleMultiDelete = (ids) => {
    const dataSource = [...this.state.tableData];
    for (let j = 0; j < dataSource.length; j++) {
      for (let i = 0; i < ids.length; i++) {
        if (dataSource[j].ID === ids[i]) {
          dataSource.splice(j, 1);
        }
      }
    }
    this.setState({tableData: dataSource});
    this.callbackData();
  };

  //合同信息修改付款详情表格单行删除
  handleSingleDelete = (id) => {
    const dataSource = [...this.state.tableData];
    // console.log(dataSource);
    this.setState({tableData: dataSource.filter(item => item.ID !== id)}, () => {
      this.callbackData();
    })
  };

  handleTableSave = row => {
    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,//old row
      ...row,//rew row
    });
    // console.log('tableData', newData);
    this.setState({tableData: newData}, () => {
      this.callbackData();
    })
  };

  //表格数据变化回调方法
  callbackData = () => {
    const {hjxxRecordCallback} = this.props;
    const {tableData, hjxxRecordFlag} = this.state;
    //表格数据变化后存全局
    sessionStorage.setItem("hjxxTableData", JSON.stringify(tableData));
    sessionStorage.setItem("hjxxTableDataFlag", "true");
    let newArr = [];
    tableData.map((item) => {
      let obj = {
        ID: String(item.ID),
        JXMC: item['JXMC' + item.ID],
        RYDJ: item['RYDJ' + item.ID],
        ZSCQLX: item['ZSCQLX' + item.ID],
        HJSJ: moment(item['HJSJ' + item.ID]).format('YYYYMMDD'),
      };
      newArr.push(obj);
    });
    // console.log('newArrnewArr', newArr);
    hjxxRecordCallback(newArr, hjxxRecordFlag)
  }

  // 查询其他项目信息
  fetchQueryProjectInfoAll = () => {
    const { dictionary: { HJRYDJ = [],ZSCQLX = [] } } = this.props;
    const {xmid} = this.props;
    let flag = sessionStorage.getItem("hjxxTableDataFlag")
    if (flag === "true") {
      this.setState({
        tableData: JSON.parse(sessionStorage.getItem("hjxxTableData"))
      })
    } else {
      FetchQueryProjectInfoAll({cxlx: 'QT', xmid: xmid}).then((result) => {
        const {code = -1, xqxxRecord = [], hjxxRecord = [], ktxxRecord = []} = result;
        if (code > 0) {
          let data = JSON.parse(hjxxRecord);
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              ID: data[i]?.ID,
              ['JXMC' + data[i]?.ID]: data[i]?.JXMC,
              ['RYDJ' + data[i]?.ID]: data[i]?.RYDJ,
              ['RYDJNAME' + data[i]?.ID]: HJRYDJ?.filter(item => item.ibm == data[i]?.RYDJ)[0]?.note || '',
              ['ZSCQLX' + data[i]?.ID]: data[i]?.ZSCQLX,
              ['ZSCQLXNAME' + data[i]?.ID]: ZSCQLX?.filter(item => item.ibm == data[i]?.ZSCQLX)[0]?.note || '',
              ['HJSJ' + data[i]?.ID]: data[i]?.HJSJ,
            });
          }
          let hjxxRecordFlag = false;
          if (data.length > 0) {
            hjxxRecordFlag = true;
          }
          this.setState({
            tableData: arr,
            hjxxRecordFlag,
          }, () => {
            this.callbackData();
          })
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  RYDJChange = (e,record, index) =>{
    // console.log("e record, index",e, record, index)
    const {tableData} = this.state;
    // console.log("tableData",tableData)
    tableData.map(item => {
      if(item.ID === record.ID){
        item['RYDJ' + item.ID] = e;
      }
    })
    this.setState({
      ...tableData
    }, () => {
      this.callbackData();
    })
  }

  ZSCQLXChange = (e,record, index) =>{
    // console.log("e record, index",e, record, index)
    const {tableData} = this.state;
    // console.log("tableData",tableData)
    tableData.map(item => {
      if(item.ID === record.ID){
        item['ZSCQLX' + item.ID] = e;
      }
    })
    this.setState({
      ...tableData
    }, () => {
      this.callbackData();
    })
  }

  render() {
    const {
      tableData = [],    //付款详情表格
    } = this.state;
    const _this = this;
    const { dictionary: { HJRYDJ = [],ZSCQLX = [] } } = this.props;
    const tableColumns = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>获奖名称</span>,
        dataIndex: 'JXMC',
        key: 'JXMC',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>荣誉等级</span>,
        dataIndex: 'RYDJ',
        key: 'RYDJ',
        width: '18%',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          // console.log("recordrecord",record)
          return (<Select style={{width: 120}} defaultValue={record['RYDJNAME' + record.ID]}
                          onChange={(e) => _this.RYDJChange(e, record, index)}>
              {
                HJRYDJ.length > 0 && HJRYDJ.map((item, index) => {
                  return (
                    <Option key={item?.ibm} value={item?.ibm}>{item?.note}</Option>
                  )
                })
              }
            </Select>
          )
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>知识产权类型</span>,
        dataIndex: 'ZSCQLX',
        width: '18%',
        key: 'ZSCQLX',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<Select style={{width: 120}} defaultValue={record['ZSCQLXNAME' + record.ID]}
                          onChange={(e) => _this.ZSCQLXChange(e, record, index)}>
              {
                ZSCQLX.length > 0 && ZSCQLX.map((item, index) => {
                  return (
                    <Option key={item?.ibm} value={item?.ibm}>{item?.note}</Option>
                  )
                })
              }
            </Select>
          )
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>获奖时间</span>,
        dataIndex: 'HJSJ',
        width: '17%',
        key: 'HJSJ',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>操作</span>,
        dataIndex: 'operator',
        key: 'operator',
        width: '10%',
        // fixed: 'right',
        ellipsis: true,
        render: (text, record) =>
          this.state.tableData.length >= 1 ? (
            <Popconfirm title="确定要删除吗?" onConfirm={() => {
              return this.handleSingleDelete(record.ID)
            }}>
              <a style={{color: '#3361ff'}}>删除</a>
            </Popconfirm>
          ) : null,
      }
    ];
    const columns = tableColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          return ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            handleSave: this.handleTableSave,
            key: col.key,
            formdecorate: this.props.form,
          })
        },
      };
    });
    //覆盖默认table元素
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    return (
      <div>
        <div style={{padding: '24px 0 18px 0'}}>
          <span style={{
            fontSize: '14px',
            lineHeight: '19px',
            fontWeight: 'bold',
            color: '#333333',
            display: 'flex',
          }}><div style={{
            width: '4px',
            height: '12px', background: '#3461FF', lineHeight: '19px', margin: '3.5px 3.5px 0 0'
          }}> </div>获奖信息</span>
        </div>
        <div>
          <div className='tableBox4'>
            <Table
              columns={columns}
              components={components}
              rowKey={record => record.ID}
              rowClassName={() => 'editable-row'}
              dataSource={tableData}
              // rowSelection={rowSelection}
              scroll={tableData.length > 3 ? {y: 195} : {}}
              pagination={false}
              style={{paddingBottom: '12px',}}
              bordered
            ></Table>
            <div style={{
              textAlign: 'center',
              border: '1px dashed #e0e0e0',
              lineHeight: '32px',
              height: '32px',
              cursor: 'pointer'
            }} onClick={() => {
              let arrData = tableData;
              arrData.push({
                ID: Date.now(),
                ['JXMC' + Date.now()]: '',
                ['RYDJ' + Date.now()]: '',
                ['ZSCQLX' + Date.now()]: '',
                ['HJSJ' + Date.now()]: moment().format('YYYY-MM-DD'),
              });
              this.setState({tableData: arrData}, () => {
                this.callbackData();
              })
            }}>
                <span className='addHover'>
                  <Icon type="plus" style={{fontSize: '12px'}}/>
                  <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增获奖信息</span>
                </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(PrizeInfo));
