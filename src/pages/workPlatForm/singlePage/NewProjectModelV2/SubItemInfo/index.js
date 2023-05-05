import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Icon,
  DatePicker,
  Select,
  message,
  TreeSelect,
  InputNumber,
  Tooltip
} from 'antd';
import React, {Component} from "react";
import moment from "moment";
import {QueryPaymentAccountList} from "../../../../../services/pmsServices";
import {connect} from "dva";
import {
  FetchQueryBudgetProjects,
  FetchQueryProjectInfoAll,
  FetchQuerySubProjectsInfo
} from "../../../../../services/projectManage";

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
    formdecorate.validateFields(
      ['SUBXMMC' + record['ID'],
        'SUBXMJL' + record['ID'],
        'SUBXMLX' + record['ID'],
        // 'SUBGLRJ' + record['ID'],
        'SUBYYBM' + record['ID'],
        'SUBCGFS' + record['ID'],
        'SUBGLYS' + record['ID'],
        'SUBYSJE' + record['ID'],
        'SUBRJYSJE' + record['ID'],
        'SUBSFBHYJ' + record['ID'],
        'SUBSFYJRW' + record['ID'],
        'SUBKJCGJE' + record['ID'],
        'SUBDDCGJE' + record['ID']],
      (error, values) => {
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


class SubItemInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [{
        ID: Date.now(),
        ['SUBXMMC' + Date.now()]: '',
        ['SUBXMJL' + Date.now()]: '',
        ['SUBXMLX' + Date.now()]: '',
        // ['SUBGLRJ' + Date.now()]: '',
        ['SUBYYBM' + Date.now()]: [],
        ['SUBCGFS' + Date.now()]: '',
        ['SUBGLYS' + Date.now()]: '',
        ['GLYSLX' + Date.now()]: '',
        ['SUBYSJE' + Date.now()]: '',
        ['SUBYSJE-TOTAL' + Date.now()]: '0',
        ['SUBRJYSJE' + Date.now()]: '0',
        ['SUBSFBHYJ' + Date.now()]: '2',
        ['SUBSFYJRW' + Date.now()]: '1',
        ['SUBKJCGJE' + Date.now()]: '0',
        ['SUBDDCGJE' + Date.now()]: '0',
        ['SUBZYS' + Date.now()]: '0',
        ['SUBKZXYS' + Date.now()]: '0',
        ['SUBSYYS' + Date.now()]: '0',
      }],
      tableDataSearch: [],
      tableDataDel: [],
    };
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.xmid !== prevProps.xmid && this.props.xmid != '-1' && this.props.budgetProjectList.length > 0) {
      console.log("xmidxmid", this.props.xmid)
      this.fetchQuerySubProjectsInfo();
    }
  }

  // componentDidMount = () => {
  //   console.log("xmidxmid",this.props.xmid)
  //   this.fetchQuerySubProjectsInfo();
  // }

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
    const {tableDataDel, tableDataSearch} = this.state;
    const dataSource = [...this.state.tableData];
    const del = tableDataSearch.filter(item => item.ID === id);
    // console.log(dataSource);
    this.setState({
      tableData: dataSource.filter(item => item.ID !== id),
      tableDataDel: [...del, ...tableDataDel],
    }, () => {
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
    console.log('tableData', newData);
    this.setState({tableData: newData}, () => {
      this.callbackData();
    })
  };

  //表格数据变化回调方法
  callbackData = () => {
    const {subItemRecordCallback} = this.props;
    const {tableData, tableDataSearch, tableDataDel,} = this.state;
    //表格数据变化后存全局
    // sessionStorage.setItem("subItemTableData", JSON.stringify(tableData));
    // sessionStorage.setItem("subItemTableDataFlag", "true");
    let newArr = [];
    console.log('tableDatatableData', tableData);
    tableData.map((item) => {
      let XMID;
      let CZLX;
      if (typeof (item.ID) === 'string') {
        XMID = item.ID
        CZLX = 'UPDATE'
      } else {
        XMID = '-1'
        CZLX = 'ADD'
      }
      let obj = {
        XMID,
        XMMC: item['SUBXMMC' + item.ID],
        XMJL: item['SUBXMJL' + item.ID],
        XMLX: String(item['SUBXMLX' + item.ID]),
        // SUBGLRJ: item['SUBGLRJ' + item.ID],
        YYBM: String(item['SUBYYBM' + item.ID]),
        CGFS: String(item['SUBCGFS' + item.ID]),
        GLYS: item['SUBGLYS' + item.ID],
        GLYSLX: item['GLYSLX' + item.ID],
        XMYS: item['SUBSFBHYJ' + item.ID] == '2' ? String(item['SUBYSJE' + item.ID]) : String(item['SUBYSJE-TOTAL' + item.ID]),
        RJYS: String(item['SUBRJYSJE' + item.ID]),
        SFBHYJ: item['SUBSFBHYJ' + item.ID],
        SFWYJRWNXQ: item['SUBSFYJRW' + item.ID],
        KJCGJE: String(item['SUBKJCGJE' + item.ID]),
        DDCGJE: String(item['SUBDDCGJE' + item.ID]),
        CZLX,
      };
      newArr.push(obj);
    });
    tableDataDel.map(item => {
      let itm = {};
      itm.XMID = item.ID;
      itm.XMMC = item['SUBXMMC' + item.ID];
      itm.XMJL = item['SUBXMJL' + item.ID];
      itm.XMLX = String(item['SUBXMLX' + item.ID]);
      // SUBGLRJ = item['SUBGLRJ' + item.ID];
      itm.YYBM =  String(item['SUBYYBM' + item.ID]);
      itm.CGFS = String(item['SUBCGFS' + item.ID]);
      itm.GLYS = item['SUBGLYS' + item.ID];
      itm.GLYSLX = item['GLYSLX' + item.ID];
      itm.XMYS = String(item['SUBYSJE' + item.ID]);
      itm.RJYS = String(item['SUBRJYSJE' + item.ID]);
      itm.SFBHYJ = item['SUBSFBHYJ' + item.ID];
      itm.SFWYJRWNXQ = item['SUBSFYJRW' + item.ID];
      itm.KJCGJE = String(item['SUBKJCGJE' + item.ID]);
      itm.DDCGJE = String(item['SUBDDCGJE' + item.ID]);
      itm.CZLX = 'DELETE';
      newArr.push(itm);
    });
    // console.log('newArrnewArr', newArr);
    subItemRecordCallback(newArr)
  }

  // 查询其他项目信息
  fetchQuerySubProjectsInfo = () => {
    const {xmid} = this.props;
    FetchQuerySubProjectsInfo({parentId: xmid}).then((result) => {
      const {code = -1, xmxx} = result;
      if (code > 0) {
        let data = JSON.parse(xmxx);
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          let SUBGLYSTXT = '';
          let SUBZYS = 0;
          let SUBKZXYS = 0;
          let SUBSYYS = 0;
          this.props.budgetProjectList.forEach(item => {
            item?.children?.forEach(ite => {
              if (String(data[i]?.GLYSXM) === 0) {
                SUBGLYSTXT = '备用预算'
                SUBZYS = 0;
                SUBKZXYS = ite.ysKZX;
                SUBSYYS = 0;
              }
              ite?.children?.forEach(ie => {
                if (String(data[i]?.GLYSXM) === ie.ysID) {
                  SUBGLYSTXT = ie.ysName;
                  SUBZYS = Number(ie.ysZJE);
                  SUBKZXYS = Number(ie.ysKZX);
                  SUBSYYS = Number(ie.ysKGL);
                }
              })
            })
          })
          arr.push({
            ID: String(data[i]?.ID),
            ['SUBXMMC' + data[i]?.ID]: data[i]?.XMMC,
            ['SUBXMJL' + data[i]?.ID]: String(data[i]?.XMJL),
            ['SUBXMLX' + data[i]?.ID]: data[i]?.XMLX,
            // ['SUBGLRJ' + data[i]?.ID]: data[i]?.JXMC,
            ['SUBYYBM' + data[i]?.ID]: data[i]?.BM.split(';'),
            ['SUBCGFS' + data[i]?.ID]: data[i]?.ZBFS,
            ['SUBGLYS' + data[i]?.ID]: String(data[i]?.GLYSXM),
            ['SUBGLYSTXT' + data[i]?.ID]: SUBGLYSTXT,
            ['GLYSLX' + data[i]?.ID]: data[i]?.YSLX,
            ['SUBYSJE' + data[i]?.ID]: data[i]?.YSJE ? data[i]?.YSJE : 0,
            ['SUBRJYSJE' + data[i]?.ID]: data[i]?.RJYSJE ? data[i]?.RJYSJE : 0,
            ['SUBSFBHYJ' + data[i]?.ID]: String(data[i]?.SFBHYJ ? data[i]?.SFBHYJ : '2'),
            ['SUBSFYJRW' + data[i]?.ID]: String(data[i]?.SFYJRW ? data[i]?.SFYJRW : '1'),
            ['SUBKJCGJE' + data[i]?.ID]: data[i]?.KJCGJE ? data[i]?.KJCGJE : 0,
            ['SUBDDCGJE' + data[i]?.ID]: data[i]?.DDCGJE ? data[i]?.DDCGJE : 0,
            ['SUBZYS' + data[i]?.ID]: SUBZYS,
            ['SUBKZXYS' + data[i]?.ID]: SUBKZXYS,
            ['SUBSYYS' + data[i]?.ID]: SUBSYYS,
            ['SUBYSJE-TOTAL' + data[i]?.ID]: Number(data[i]?.RJYSJE) + Number(data[i]?.KJCGJE) + Number(data[i]?.DDCGJE)
          });
        }
        this.setState({
          tableData: arr,
          tableDataSearch: arr,
        }, () => {
          this.callbackData();
        })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  itemChange = (e, record, index, key) => {
    console.log("e,record,index,key:", e, record, index, key)
    console.log("this.props.budgetProjectList", this.props.budgetProjectList)
    const {tableData} = this.state;
    if (key === 'SUBGLYS') {
      let ysID = '';
      let ysName = '';
      let ysLX = '';
      let SUBZYS = 0;
      let SUBKZXYS = 0;
      let SUBSYYS = 0;
      this.props.budgetProjectList.forEach(item => {
        item?.children?.forEach(ite => {
          if (e === '0备用预算') {
            ysID = ite.ysID
            ysName = "备用预算"
            ysLX = "资本性预算"
            SUBZYS = 0;
            SUBKZXYS = ite.ysKZX;
            SUBSYYS = 0;
          }
          ite?.children?.forEach(i => {
            if (i.value === e) {
              ysID = i.ysID
              ysName = i.ysName
              ysLX = i.ysLX
              SUBZYS = Number(i.ysZJE);
              SUBKZXYS = Number(i.ysKZX);
              SUBSYYS = Number(i.ysKGL);
            }
          })
        })
      })
      tableData.map(item => {
        if (item.ID === record.ID) {
          item[key + item.ID] = ysID;
          item['GLYSLX' + item.ID] = ysLX;
          item['SUBGLYSTXT' + item.ID] = ysName;
          item['SUBZYS' + item.ID] = SUBZYS;
          item['SUBKZXYS' + item.ID] = SUBKZXYS;
          item['SUBSYYS' + item.ID] = SUBSYYS;
        }
      })
    } else {
      tableData.map(item => {
        if (item.ID === record.ID) {
          item[key + item.ID] = e;
        }
      })
    }
    if (key === 'SUBSFBHYJ') {
      if (e === "1") {
        tableData.map(item => {
          if (item.ID === record.ID) {
            item['SUBYSJE' + item.ID] = 0;
          }
        })
      } else {
        //是否包含硬件选否 后面填写的数据清空
        tableData.map(item => {
          if (item.ID === record.ID) {
            item['SUBSFBHYJ' + item.ID] = '2';
            item['SUBSFYJRW' + item.ID] = '1';
            item['SUBKJCGJE' + item.ID] = '0';
            item['SUBDDCGJE' + item.ID] = '0';
            item['SUBRJYSJE' + item.ID] = '0';
          }
        })
      }
    }
    //软件预算金额/单独采购金额/框架金额变化时-XMYS为三者之和
    if (key === 'SUBRJYSJE' || key === 'SUBKJCGJE' || key === 'SUBDDCGJE') {
      tableData.map(item => {
        if (item.ID === record.ID) {
          item['SUBYSJE-TOTAL' + item.ID] = Number(item['SUBRJYSJE' + item.ID]) + Number(item['SUBKJCGJE' + item.ID]) + Number(item['SUBDDCGJE' + item.ID]);
        }
      })
    }
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
    const {
      orgExpendKeys = [],
      organizationTreeList = [],
      projectTypeList = [],
      staffList = [],
      budgetProjectList = [],
      bindMethodData = [],
      softwareList = [],
      projectTypeZY = []
    } = this.props;
    console.log("projectTypeZY", projectTypeZY)
    const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
    const tableColumns = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>项目名称</span>,
        dataIndex: 'SUBXMMC',
        key: 'SUBXMMC',
        width: '250px',
        fixed: 'left',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>项目经理</span>,
        dataIndex: 'SUBXMJL',
        key: 'SUBXMJL',
        width: '200px',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          let title = null
          let member = staffList.filter(item => item.id == record['SUBXMJL' + record.ID])
          if (member.length > 0) {
            title = member[0].name + '(' + member[0].orgName + ')';
          }
          return (<Tooltip title={title}><Select
              allowClear
              placeholder="请输入名字搜索人员"
              // value={jobStaffName.length > 0 ? jobStaffName[9] : []}
              // onBlur={}
              showSearch
              value={record['SUBXMJL' + record.ID]}
              filterOption={(input, option) =>
                option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(e) => _this.itemChange(e, record, index, 'SUBXMJL')}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              style={{width: '100%'}}
            >
              {
                staffList.length > 0 && staffList.map((item, index) => {
                  //console.log("searchStaffList", searchStaffList)
                  return (
                    <Select.Option key={index}
                                   value={item.id}>{item.name}({item.orgName ? item.orgName : loginUser.orgName})</Select.Option>
                  )
                })
              }
            </Select>
            </Tooltip>
          )
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>项目类型</span>,
        dataIndex: 'SUBXMLX',
        width: '160px',
        key: 'SUBXMLX',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<TreeSelect
              allowClear
              // multiple
              showSearch
              treeNodeFilterProp="title"
              style={{width: '100%'}}
              value={record['SUBXMLX' + record.ID]}
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{maxHeight: 300, overflowX: 'hidden'}}
              treeData={projectTypeList}
              // treeCheckable
              placeholder="请选择项目类型"
              treeDefaultExpandAll
              // treeDefaultExpandedKeys={orgExpendKeys}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              onChange={(e) => _this.itemChange(e, record, index, 'SUBXMLX')}
            />
          )
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>应用部门</span>,
        dataIndex: 'SUBYYBM',
        width: '250px',
        key: 'SUBYYBM',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<TreeSelect
            allowClear
            multiple
            showSearch
            defaultValue={record['SUBYYBM' + record.ID]}
            treeNodeFilterProp="title"
            style={{width: '100%'}}
            maxTagCount={3}
            maxTagTextLength={42}
            maxTagPlaceholder={extraArr => {
              return `等${extraArr.length + 3}个`;
            }}
            dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
            treeData={organizationTreeList}
            placeholder="请选择应用部门"
            // treeCheckable
            // treeDefaultExpandAll
            // getPopupContainer={triggerNode => triggerNode.parentNode}
            // onDropdownVisibleChange={(open) => this.onOrgDropdown(open)}
            treeDefaultExpandedKeys={orgExpendKeys}
            onChange={(e) => _this.itemChange(String(e), record, index, 'SUBYYBM')}
          />)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>采购方式</span>,
        dataIndex: 'SUBCGFS',
        width: '140px',
        key: 'SUBCGFS',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<TreeSelect
              allowClear
              showSearch
              disabled={projectTypeZY.filter(item => item.ID == record['SUBXMLX' + record.ID]).length > 0}
              value={record['SUBCGFS' + record.ID]}
              dropdownClassName="newproject-treeselect"
              treeNodeFilterProp="title"
              style={{width: '100%'}}
              dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
              treeData={bindMethodData}
              placeholder="请选择采购方式"
              // treeCheckable
              // treeDefaultExpandAll
              // getPopupContainer={triggerNode => triggerNode.parentNode}
              // treeDefaultExpandedKeys={orgExpendKeys}
              onChange={(e) => _this.itemChange(e, record, index, 'SUBCGFS')}
            />
          )
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>关联预算项目</span>,
        dataIndex: 'SUBGLYS',
        width: '300px',
        key: 'SUBGLYS',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<TreeSelect
              allowClear
              showSearch
              // defaultValue={record['SUBGLYSTXT' + record.ID]}
              value={record['SUBGLYSTXT' + record.ID]}
              treeNodeFilterProp="title"
              style={{width: '100%'}}
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
              treeData={budgetProjectList}
              placeholder="请选择关联预算项目"
              // treeDefaultExpandAll
              onChange={(e) => _this.itemChange(e, record, index, 'SUBGLYS')}
            />
          )
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>总预算(元)</span>,
        dataIndex: 'SUBZYS',
        width: '155px',
        key: 'SUBZYS',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <InputNumber disabled={true}
                         style={{width: '100%'}}
                         value={record['SUBZYS' + record.ID]} style={{width: '100%'}}
                         precision={0}/>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>可执行预算(元)</span>,
        dataIndex: 'SUBKZXYS',
        width: '155px',
        key: 'SUBKZXYS',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <InputNumber disabled={true}
                         style={{width: '100%'}}
                         value={record['SUBKZXYS' + record.ID]} style={{width: '100%'}}
                         precision={0}/>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>剩余预算(元)</span>,
        dataIndex: 'SUBSYYS',
        width: '155px',
        key: 'SUBSYYS',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <InputNumber disabled={true}
                         style={{width: '100%'}}
                         value={record['SUBSYYS' + record.ID]} style={{width: '100%'}}
                         precision={0}/>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>预算金额(元)</span>,
        dataIndex: 'SUBYSJE',
        width: '155px',
        key: 'SUBYSJE',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <InputNumber disabled={record['SUBSFBHYJ' + record.ID] === '' || record['SUBSFBHYJ' + record.ID] === "1"}
                         style={{width: '100%'}}
                         value={record['SUBYSJE' + record.ID]} style={{width: '100%'}}
                         onChange={(e) => _this.itemChange(e, record, index, 'SUBYSJE')}
                         precision={0}/>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>是否包含硬件</span>,
        dataIndex: 'SUBSFBHYJ',
        width: '155px',
        key: 'SUBSFBHYJ',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<Select disabled={record['SUBXMLX' + record.ID] != '1'}
                          value={record['SUBSFBHYJ' + record.ID]} style={{width: 120}}
                          onChange={(e) => _this.itemChange(e, record, index, 'SUBSFBHYJ')}>
            <Option value="1">是</Option>
            <Option value="2">否</Option>
          </Select>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>是否为硬件入围内需求</span>,
        dataIndex: 'SUBSFYJRW',
        width: '200px',
        key: 'SUBSFYJRW',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<Select disabled={record['SUBSFBHYJ' + record.ID] !== "1"}
                          value={record['SUBSFYJRW' + record.ID]} style={{width: 120}}
                          defaultValue={record['SUBSFYJRW' + record.ID]}
                          onChange={(e) => _this.itemChange(e, record, index, 'SUBSFYJRW')}>
            <Option value="1">是</Option>
            <Option value="2">否</Option>
          </Select>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>软件预算金额(元)</span>,
        dataIndex: 'SUBRJYSJE',
        width: '170px',
        key: 'SUBRJYSJE',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <InputNumber disabled={record['SUBSFBHYJ' + record.ID] === '' || record['SUBSFBHYJ' + record.ID] === "2"}
                         style={{width: '100%'}}
                         value={record['SUBRJYSJE' + record.ID]} style={{width: '100%'}}
                         onChange={(e) => _this.itemChange(e, record, index, 'SUBRJYSJE')}
                         precision={0}/>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>框架采购金额(元)</span>,
        dataIndex: 'SUBKJCGJE',
        width: '170px',
        key: 'SUBKJCGJE',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <InputNumber disabled={record['SUBSFBHYJ' + record.ID] === '' || record['SUBSFBHYJ' + record.ID] === "2"}
                         value={record['SUBKJCGJE' + record.ID]} style={{width: '100%'}}
                         onChange={(e) => _this.itemChange(e, record, index, 'SUBKJCGJE')}
                         precision={0}/>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>单独采购金额(元)</span>,
        dataIndex: 'SUBDDCGJE',
        width: '170px',
        key: 'SUBDDCGJE',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <InputNumber disabled={record['SUBSFBHYJ' + record.ID] === '' || record['SUBSFBHYJ' + record.ID] === "2"}
                         value={record['SUBDDCGJE' + record.ID]} style={{width: '100%'}}
                         onChange={(e) => _this.itemChange(e, record, index, 'SUBDDCGJE')}
                         precision={0}/>)
        }
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>操作</span>,
        dataIndex: 'operator',
        key: 'operator',
        width: '80px',
        fixed: 'right',
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
        <div>
          <div className='tableBox4' style={{margin: '0 12px'}}>
            <Table
              columns={columns}
              components={components}
              rowKey={record => record.ID}
              rowClassName={() => 'editable-row'}
              dataSource={tableData}
              // rowSelection={rowSelection}
              scroll={tableData.length > 3 ? {x: 1520, y: 195} : {x: 1520}}
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
                ['SUBXMMC' + Date.now()]: '',
                ['SUBXMJL' + Date.now()]: '',
                ['SUBXMLX' + Date.now()]: '',
                // ['SUBGLRJ' + Date.now()]: '',
                ['SUBYYBM' + Date.now()]: [],
                ['SUBCGFS' + Date.now()]: '',
                ['SUBGLYS' + Date.now()]: '',
                ['GLYSLX' + Date.now()]: '',
                ['SUBYSJE' + Date.now()]: '',
                ['SUBYSJE-TOTAL' + Date.now()]: '0',
                ['SUBRJYSJE' + Date.now()]: '0',
                ['SUBSFBHYJ' + Date.now()]: '2',
                ['SUBSFYJRW' + Date.now()]: '1',
                ['SUBKJCGJE' + Date.now()]: '0',
                ['SUBDDCGJE' + Date.now()]: '0',
                ['SUBZYS' + Date.now()]: '0',
                ['SUBKZXYS' + Date.now()]: '0',
                ['SUBSYYS' + Date.now()]: '0',
              });
              this.setState({tableData: arrData}, () => {
                this.callbackData();
              })
            }}>
                <span className='addHover'>
                  <Icon type="plus" style={{fontSize: '12px'}}/>
                  <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增子项目</span>
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
}))(Form.create()(SubItemInfo));
