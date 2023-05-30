import {Table, Input, Button, Popconfirm, Form, Icon, DatePicker, Select, message, Tooltip} from 'antd';
import React, {Component} from "react";
import moment from "moment";
import {FetchqueryOutsourceRequirement, QueryPaymentAccountList} from "../../../../../services/pmsServices";
import {connect} from "dva";
import {FetchQueryProjectInfoAll} from "../../../../../services/projectManage";

const {Option} = Select
const {TextArea} = Input;

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
    formdecorate.validateFields(['RYDJ' + record['ID'], 'GW' + record['ID'], 'RYSL' + record['ID'], 'SC' + record['ID'], 'YQ' + record['ID']], (error, values) => {
      if (error && error[e.currentTarget.ID]) {
        return;
      }
      handleSave({...record, ...values});
    });

  };

  renderItem = (form, dataIndex, record) => {
    switch (dataIndex) {
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


class PersonnelNeeds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rydjxxJson: [],
      tableData: [
        {
          ID: Date.now(),
          ['RYDJ' + Date.now()]: '',
          ['GW' + Date.now()]: '',
          ['RYSL' + Date.now()]: '',
          ['SC' + Date.now()]: '',
          ['YQ' + Date.now()]: '',
        }
      ],
      //接口查出来是否存在获奖信息的数据
      hjxxRecordFlag: false,
    };
  }

  componentDidMount() {
    this.fetchqueryOutsourceRequirement();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.tableDataInit !== prevProps.tableDataInit && this.props.tableDataInit.length !== 0) {
      console.log("tableDataInit", this.props.tableDataInit)
      this.setState({
        tableData: this.props.tableDataInit,
      })
    }
  }

  // 查询其他项目信息
  fetchqueryOutsourceRequirement = () => {
    FetchqueryOutsourceRequirement({xqid: 0, cxlx: 'RYDJ'}).then((result) => {
      const {code = -1, rydjxx} = result;
      const rydjxxJson = JSON.parse(rydjxx);
      console.log("rydjxxJsonrydjxxJson", rydjxxJson)
      if (code > 0) {
        this.setState({
          rydjxxJson,
        })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

//----------------其他供应商-----------------//

  //合同信息修改付款详情表格删除
  handleDelete = (record) => {
    //评测状态不等于1 不能删除
    if (String(record.PCZT) !== "1") {
      message.warn("该需求已有评测信息，不可删除!")
      return;
    }
    const {tableData = [],} = this.state;
    const dataSource = [...tableData];
    this.setState({tableData: dataSource.filter(item => item.ID !== record.ID)}, () => {
      this.callbackData();
    });
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
    const {recordCallback, operateType} = this.props;
    const {tableData} = this.state;
    let newArr = [];
    tableData.map((item) => {
      let obj = {
        //重新发起xqid === -1
        XQID: operateType === "relaunch" ? "-1" : (typeof (item.ID) === "number" ? "-1" : item.ID),
        RYDJ: item['RYDJ' + item.ID],
        GW: item['GW' + item.ID],
        RYSL: item['RYSL' + item.ID],
        SC: item['SC' + item.ID],
        YQ: item['YQ' + item.ID],
      };
      newArr.push(obj);
    });
    // console.log('newArrnewArr', newArr);
    recordCallback(newArr)
  }

  GWChange = (e, record, index, key) => {
    // console.log("e record, index",e, record, index)
    const {tableData} = this.state;
    // console.log("tableData",tableData)
    tableData.map(item => {
      if (item.ID === record.ID) {
        item[key + item.ID] = e;
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
      tableData = [],
      rydjxxJson = [],
    } = this.state;
    const {dictionary: {WBRYGW = [],}} = this.props;
    const _this = this;
    const tableColumns = [
      {
        title: '人员等级',
        dataIndex: 'RYDJ',
        width: 100,
        align: 'center',
        key: 'RYDJ',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          // console.log("recordrecord",record)
          return (<Select defaultValue={record['RYDJ' + record.ID]}
                          onChange={(e) => _this.GWChange(e, record, index, 'RYDJ')}>
              {
                rydjxxJson.length > 0 && rydjxxJson.map((item, index) => {
                  return (
                    <Option key={item?.RYDJID} value={item?.RYDJID}>{item?.RYDJ}</Option>
                  )
                })
              }
            </Select>
          )
        }
      },
      {
        title: '岗位',
        dataIndex: 'GW',
        width: 120,
        align: 'center',
        key: 'GW',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          // console.log("recordrecord",record)
          return (<Select defaultValue={record['GW' + record.ID]}
                          onChange={(e) => _this.GWChange(e, record, index, 'GW')}>
              {
                WBRYGW.length > 0 && WBRYGW.map((item, index) => {
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
        title: '人员数量',
        dataIndex: 'RYSL',
        width: 100,
        align: 'center',
        key: 'RYSL',
        ellipsis: true,
        editable: true,
      },
      {
        title: '时长(人/月)',
        dataIndex: 'SC',
        width: '16%',
        align: 'center',
        key: 'SC',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{marginLeft: 12}}>要求</span>,
        dataIndex: 'YQ',
        key: 'YQ',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<Tooltip title={text} placement="topLeft">
            <TextArea defaultValue={record['YQ' + record.ID]}
                      autoSize={{minRows: 1, maxRows: 6}}
                      onChange={(e) => _this.GWChange(e.target.value, record, index, 'YQ')}
                      style={{cursor: 'default'}}>{text}</TextArea>
          </Tooltip>)
        },
      },
      {
        title: '操作',
        dataIndex: 'OPRT',
        align: 'center',
        width: '10%',
        key: 'OPRT',
        ellipsis: true,
        render: (text, record) => (
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => this.handleDelete(record)}
          >
            <a style={{color: '#3361ff'}}>删除</a>
          </Popconfirm>
        ),
      },
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
        <div className='ryxq-table-box'>
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
            size="middle"
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
              ['RYDJ' + Date.now()]: '',
              ['GW' + Date.now()]: '',
              ['RYSL' + Date.now()]: '',
              ['SC' + Date.now()]: '',
              ['YQ' + Date.now()]: '',
            });
            this.setState({tableData: arrData}, () => {
              this.callbackData();
            })
          }}>
                <span className='addHover'>
                  <Icon type="plus" style={{fontSize: '12px'}}/>
                  <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增人员需求</span>
                </span>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(PersonnelNeeds));
