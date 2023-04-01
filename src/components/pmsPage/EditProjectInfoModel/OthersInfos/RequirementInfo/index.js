import {Table, Input, Button, Popconfirm, Form, Icon, DatePicker, Select, message} from 'antd';
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
    formdecorate.validateFields(['XQBT' + record['XQID'], 'XQNR' + record['XQID'], 'XQRQ' + record['XQID'],], (error, values) => {
      if (error && error[e.currentTarget.XQID]) {
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
        return form.getFieldDecorator(dataIndex + record['XQID'], {
          initialValue: moment(record[dataIndex + record['XQID']]) || null,
        })(<DatePicker ref={node => (this.input = node)}
                       onChange={(data, dataString) => {
                         const {record, handleSave} = this.props;
                         form.validateFields(['XQBT' + record['XQID'], 'XQNR' + record['XQID'], 'XQRQ' + record['XQID'],], (error, values) => {
                           // console.log('values', values);
                           if (error && error[e.currentTarget.XQID]) {
                             return;
                           }
                           let newValues = {};
                           newValues = {...values};
                           for (let i in newValues) {
                             if (i === 'XQRQ' + record['XQID']) {
                               newValues[i] = dataString;
                             }
                           }
                           // this.toggleEdit();
                           handleSave({...record, ...newValues});
                         });
                       }}
        />);
      case 'XQBT':
        return form.getFieldDecorator(dataIndex + record['XQID'], {
          initialValue: String(record[dataIndex + record['XQID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      case 'XQNR':
        return form.getFieldDecorator(dataIndex + record['XQID'], {
          initialValue: String(record[dataIndex + record['XQID']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      default:
        return form.getFieldDecorator(dataIndex + record['XQID'], {
          initialValue: String(record[dataIndex + record['XQID']]),
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


class RequirementInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
    };
  }

  componentDidMount() {
    this.fetchQueryProjectInfoAll();
  }

//----------------其他供应商-----------------//

  //合同信息修改付款详情表格多行删除
  handleMultiDelete = (ids) => {
    const dataSource = [...this.state.tableData];
    for (let j = 0; j < dataSource.length; j++) {
      for (let i = 0; i < ids.length; i++) {
        if (dataSource[j].XQID === ids[i]) {
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
    this.setState({tableData: dataSource.filter(item => item.XQID !== id)}, () => {
      this.callbackData();
    })
  };

  handleTableSave = row => {
    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => row.XQID === item.XQID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,//old row
      ...row,//rew row
    });
    console.log('tableData', newData);
    this.setState({tableData: newData}, () => {
      this.callbackData();
    })
  };

  //表格数据变化回调方法
  callbackData = () => {
    const {xqxxRecordCallback} = this.props;
    const {tableData} = this.state;
    //表格数据变化后存全局
    sessionStorage.setItem("xqxxTableData", JSON.stringify(tableData));
    sessionStorage.setItem("xqxxTableDataFlag", "true");
    let newArr = [];
    tableData.map((item) => {
      let obj = {
        XQID: String(item.XQID),
        XQBT: String(item['XQBT' + item.XQID]),
        XQRQ: String(moment(item['XQRQ' + item.XQID]).format('YYYYMMDD')),
        XQNR: item['XQNR' + item.XQID] ? String(item['XQNR' + item.XQID]) : "",
      };
      newArr.push(obj);
    });
    xqxxRecordCallback(newArr)
  }

  // 查询其他项目信息
  fetchQueryProjectInfoAll = () => {
    const {tableData = []} = this.state;
    let flag = sessionStorage.getItem("xqxxTableDataFlag")
    if (flag === "true") {
      this.setState({
        tableData: JSON.parse(sessionStorage.getItem("xqxxTableData"))
      })
    } else {
      FetchQueryProjectInfoAll({cxlx: 'QT', xmid: 334}).then((result) => {
        const {code = -1, xqxxRecord = [], hjxxRecord = [], ktxxRecord = []} = result;
        if (code > 0) {
          let data = JSON.parse(xqxxRecord);
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            arr.push({
              XQID: String(data[i]?.XQID),
              ['XQBT' + data[i]?.XQID]: String(data[i]?.XQBT),
              ['XQNR' + data[i]?.XQID]: String(data[i]?.XQNR),
              ['XQRQ' + data[i]?.XQID]: String(data[i]?.XQRQ),
            });
          }
          this.setState({
            tableData: arr,
          }, () => {
            this.callbackData();
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
    const tableColumns = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>需求标题</span>,
        dataIndex: 'XQBT',
        width: '13%',
        key: 'XQBT',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>需求内容</span>,
        dataIndex: 'XQNR',
        key: 'XQNR',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>需求日期</span>,
        dataIndex: 'XQRQ',
        width: '17%',
        key: 'XQRQ',
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
              return this.handleSingleDelete(record.XQID)
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
        <div style={{padding: '0 0 18px 0'}}>
          <span style={{
            paddingLeft: '6px',
            fontSize: '14px',
            lineHeight: '19px',
            fontWeight: 'bold',
            color: '#333333',
            display: 'flex',
          }}><div style={{
            width: '4px',
            height: '12px', background: '#3461FF', lineHeight: '19px', margin: '3.5px 3.5px 0 0'
          }}> </div>需求信息</span>
        </div>
        <div>
          <div className='tableBox4'>
            <Table
              columns={columns}
              components={components}
              rowKey={record => record.XQID}
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
                XQID: String(Date.now()),
                ['XQBT' + Date.now()]: "",
                ['XQNR' + Date.now()]: "",
                ['XQRQ' + Date.now()]: moment().format('YYYY-MM-DD'),
              });
              this.setState({tableData: arrData})
            }}>
                <span className='addHover'>
                  <Icon type="plus" style={{fontSize: '12px'}}/>
                  <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增需求信息</span>
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
}))(Form.create()(RequirementInfo));
