import {Table, Input, Button, Popconfirm, Form, Icon, DatePicker, Select, message, InputNumber} from 'antd';
import React, {Component} from "react";
import moment from "moment";
import {QueryPaymentAccountList} from "../../../../../services/pmsServices";
import {connect} from "dva";
import {FetchQueryProjectInfoAll} from "../../../../../services/projectManage";

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
    formdecorate.validateFields(['XMKT' + record['KTID'], 'JD' + record['KTID'], 'JJ' + record['KTID'], 'DQJZ' + record['KTID']], (error, values) => {
      if (error && error[e.currentTarget.KTID]) {
        return;
      }
      handleSave({...record, ...values});
    });

  };

  renderItem = (form, dataIndex, record) => {
    // console.log("recordrecord",record)
    // console.log("dataIndexdataIndex",dataIndex)
    switch (dataIndex) {
      case 'XQRQ':
        return form.getFieldDecorator(dataIndex + record['KTID'], {
          initialValue: moment(record[dataIndex + record['KTID']]) || null,
        })(<DatePicker ref={node => (this.input = node)}
                       onChange={(data, dataString) => {
                         const {record, handleSave} = this.props;
                         form.validateFields(['XQBT' + record['KTID'], 'XQNR' + record['KTID'], 'XQRQ' + record['KTID'],], (error, values) => {
                           // console.log('values', values);
                           if (error && error[e.currentTarget.KTID]) {
                             return;
                           }
                           let newValues = {};
                           newValues = {...values};
                           for (let i in newValues) {
                             if (i === 'XQRQ' + record['KTID']) {
                               newValues[i] = dataString;
                             }
                           }
                           // this.toggleEdit();
                           handleSave({...record, ...newValues});
                         });
                       }}
        />);
      case 'XMKT':
        return form.getFieldDecorator(dataIndex + record['KTID'], {
          initialValue: String(record[dataIndex + record['KTID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'JD':
        return form.getFieldDecorator(dataIndex + record['KTID'], {
          initialValue: String(record[dataIndex + record['KTID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'JJ':
        return form.getFieldDecorator(dataIndex + record['KTID'], {
          initialValue: String(record[dataIndex + record['KTID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'DQJZ':
        return form.getFieldDecorator(dataIndex + record['KTID'], {
          initialValue: String(record[dataIndex + record['KTID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      default:
        return form.getFieldDecorator(dataIndex + record['KTID'], {
          initialValue: String(record[dataIndex + record['KTID']]),
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


class TopicInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
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
        if (dataSource[j].KTID === ids[i]) {
          dataSource.splice(j, 1);
        }
      }
    }
    this.setState({tableData: dataSource}, () => {
      this.callbackData();
    });
  };

  //合同信息修改付款详情表格单行删除
  handleSingleDelete = (id) => {
    const dataSource = [...this.state.tableData];
    // console.log(dataSource);
    this.setState({tableData: dataSource.filter(item => item.KTID !== id)}, () => {
      this.callbackData();
    })
  };

  handleTableSave = row => {
    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => row.KTID === item.KTID);
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
    const {ktxxRecordCallback} = this.props;
    const {tableData} = this.state;
    let newArr = [];
    //表格数据变化后存全局
    sessionStorage.setItem("ktxxTableData", JSON.stringify(tableData));
    sessionStorage.setItem("ktxxTableDataFlag", "true");
    tableData.map((item) => {
      let obj = {
        KTID: String(item.KTID),
        XMKT: item['XMKT' + item.KTID],
        JD: item['JD' + item.KTID],
        JJ: item['JJ' + item.KTID],
        DQJZ: item['DQJZ' + item.KTID],
      };
      newArr.push(obj);
    });
    ktxxRecordCallback(newArr)
  }

  JDChange = (e,record, index) =>{
    console.log("e record, index",e, record, index)
    const {tableData} = this.state;
    console.log("tableData",tableData)
    tableData.map(item => {
      if(item.KTID === record.KTID){
        item['JD' + item.KTID] = e;
      }
    })
    console.log("tableData222",tableData)
    this.setState({
      ...tableData
    }, () => {
      this.callbackData();
    })
  }


  // 查询其他项目信息
  fetchQueryProjectInfoAll = () => {
    const {xmid} = this.props;
    let flag = sessionStorage.getItem("ktxxTableDataFlag")
    if (flag === "true") {
      this.setState({
        tableData: JSON.parse(sessionStorage.getItem("ktxxTableData"))
      })
    } else {
      FetchQueryProjectInfoAll({cxlx: 'QT', xmid: xmid}).then((result) => {
        const {code = -1, xqxxRecord = [], hjxxRecord = [], ktxxRecord = []} = result;
        if (code > 0) {
          let data = JSON.parse(ktxxRecord);
          // console.log("datadata2222",data)
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              KTID: data[i]?.KTID,
              ['XMKT' + data[i]?.KTID]: data[i]?.XMKT,
              ['JJ' + data[i]?.KTID]: data[i]?.JJ,
              ['JD' + data[i]?.KTID]: data[i]?.JD,
              ['DQJZ' + data[i]?.KTID]: data[i]?.DQJZ,
            });
          }
          this.setState({
            tableData: arr,
          })
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  render() {
    const {
      tableData = [],    //付款详情表格
    } = this.state;
    const _this = this;
    const tableColumns = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>项目标题</span>,
        dataIndex: 'XMKT',
        width: '13%',
        key: 'XMKT',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>进度(%)</span>,
        dataIndex: 'JD',
        key: 'JD',
        width: '8%',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          console.log("record",record)
          return (<InputNumber style={{width: '100%'}} value={record['JD' + record.KTID]}  onChange={(e) => _this.JDChange(e,record, index)}
                               precision={0}/>
          )
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>简介</span>,
        dataIndex: 'JJ',
        width: '23%',
        key: 'JJ',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>当前进展</span>,
        dataIndex: 'DQJZ',
        width: '17%',
        key: 'DQJZ',
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
              return this.handleSingleDelete(record.KTID)
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
          }}> </div>课题信息</span>
        </div>
        <div>
          <div className='tableBox4'>
            <Table
              columns={columns}
              components={components}
              rowKey={record => record.KTID}
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
                KTID: Date.now(),
                ['XMKT' + Date.now()]: '',
                ['JD' + Date.now()]: '',
                ['JJ' + Date.now()]: '',
                ['DQJZ' + Date.now()]: '',
              });
              this.setState({tableData: arrData})
            }}>
                <span className='addHover'>
                  <Icon type="plus" style={{fontSize: '12px'}}/>
                  <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增项目课题</span>
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
}))(Form.create()(TopicInfo));
