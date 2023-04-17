import {
  Row,
  Col,
  Popconfirm,
  Modal,
  Form,
  Input,
  Table,
  DatePicker,
  message,
  Upload,
  Button,
  Icon,
  Select,
  Pagination,
  Spin,
  Radio, Divider,
} from 'antd';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import React from 'react';
import {
  FetchQueryZBXXByXQTC,
  FetchQueryGysInZbxx,
  UpdateZbxx,
  CreateOperateHyperLink,
  QueryPaymentAccountList,
} from '../../../../services/pmsServices';
import {PluginsUrl} from '../../../../utils/config';
import {connect} from "dva";
import moment from "moment";

const {Option, OptGroup} = Select;

const PASE_SIZE = 10; //关联供应商选择器分页长度
const Loginname = localStorage.getItem('firstUserID');

function getID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

const EditableContext = React.createContext();
const EditableRow = ({form, index, ...props}) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
};
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
    isGysOpen: false,
    isSkzhOpen: false,
  };

  // toggleEdit = () => {
  //     const editing = !this.state.editing;
  //     this.setState({ editing }, () => {
  //         if (editing) {
  //             this.input.focus();
  //         }
  //     });
  // };

  save = e => {
    const {record, handleSave, formdecorate} = this.props;
    formdecorate.validateFields(
      ['glgys' + record['id'], 'gysmc' + record['id'], 'gysskzh' + record['id']],
      (error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        // this.toggleEdit();
        // handleSave({ ...record, ...values });
        handleSave({id: record['id'], ...values});
      },
    );
  };

  getTitle = dataIndex => {
    switch (dataIndex) {
      case 'gysmc':
        return '供应商名称';
      case 'gysskzh':
        return '供应商收款账号';
      default:
        break;
    }
  };

  onGysChange = v => {
    const {record, handleSave, formdecorate} = this.props;
    let obj = {
      ['gysmc' + record['id']]: v,
    };
    handleSave({id: record['id'], ...obj});
  };
  onSkzhChange = v => {
    const {record, handleSave, formdecorate} = this.props;
    let obj = {
      ['gysskzh' + record['id']]: v,
    };
    handleSave({id: record['id'], ...obj});
  };

  getFormDec = (form, dataIndex, record) => {
    const {skzhdata, gysdata} = this.props;
    switch (dataIndex) {
      case 'gysmc':
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              required: true,
              message: `${this.getTitle(dataIndex)}不允许空值`,
            },
          ],
          initialValue: record[dataIndex + record['id']],
        })(
          <Select
            style={{width: '100%', borderRadius: '1.1904rem !important'}}
            placeholder="请选择供应商"
            onChange={this.onGysChange}
            showSearch
            open={this.state.isGysOpen}
            onDropdownVisibleChange={visible => this.setState({isGysOpen: visible})}
          >
            {gysdata?.map((item = {}, ind) => {
              return (
                <Option key={ind} value={item.gysmc}>
                  {item.gysmc}
                </Option>
              );
            })}
          </Select>,
        );
      case 'gysskzh':
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              required: true,
              message: `${this.getTitle(dataIndex)}不允许空值`,
            },
          ],
          initialValue: String(record[dataIndex + record['id']]),
        })(
          <Select
            style={{width: '100%', borderRadius: '1.1904rem !important'}}
            placeholder="请选择供应商收款账号"
            onChange={this.onSkzhChange}
            showSearch
            open={this.state.isSkzhOpen}
            onDropdownVisibleChange={visible => this.setState({isSkzhOpen: visible})}
          >
            {skzhdata?.map((item = {}, ind) => {
              return (
                <Option key={ind} value={item.khmc}>
                  {item.khmc}
                  {this.state.isSkzhOpen && <div style={{fontSize: '0.6em'}}>{item.yhkh}</div>}
                </Option>
              );
            })}
          </Select>,
        );
      default:
        return (
          <Input
            style={{textAlign: 'center'}}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        );
    }
  };

  renderCell = form => {
    const {children, dataIndex, record, formdecorate} = this.props;
    return (
      <Form.Item style={{margin: 0}}>
        {this.getFormDec(formdecorate, dataIndex, record)}
      </Form.Item>
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

let index = 0;

class AgreementEnterModal extends React.Component {
  state = {
    isModalFullScreen: false,
    isTableFullScreen: false,
    bidInfo: {
      //中标信息
      glgys: [],
      totalRows: 0,
      zbgys: '',
      tbbzj: '',
      lybzj: '',
      zbgysskzh: '',
      pbbg: '',
    },
    glgys: [],
    uploadFileParams: {
      columnName: '',
      documentData: '',
      fileLength: '',
      fileName: '',
      filePath: '',
      id: 0,
      objectName: '',
    },
    fileList: [],
    pbbgTurnRed: false,
    tableData: [], //其他供应商表格表格
    selectedRowIds: [],
    isSelectorOpen1: false,
    isSelectorOpen2: false,
    addGysModalVisible: false,
    addSkzhModalVisible: false,
    addGysModalUrl: '',
    addSkzhModal: '',
    skzhData: [], //收款账号
    staticSkzhData: [],
    fetching: false, //在加载数据
    currentPage: 1, //收款账户数据懒加载页号
    currentKhmc: '', //款账户文本
    isNoMoreData: false, //没有更多数据了
    isSpinning: false, //弹窗加载状态
    radioValue: 1, //单选，默认1->公共账户
    timer: null,
    skzhId: '',
  };

  componentDidMount() {
    // this.fetchQueryPaymentAccountList();
    this.fetchQueryGysInZbxx(1, PASE_SIZE);
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  // 查询中标信息修改时的供应商下拉列表
  fetchQueryGysInZbxx = (current, pageSize) => {
    FetchQueryGysInZbxx({
      // paging: 1,
      paging: -1,
      sort: '',
      current,
      pageSize,
      total: -1,
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          glgys: [...rec],
        });
      }
    });
  };

  //中标信息表格单行删除
  handleSingleDelete = id => {
    const dataSource = [...this.state.tableData];
    this.setState({tableData: dataSource.filter(item => item.id !== id)});
  };
  //中标信息表格多行删除
  handleMultiDelete = ids => {
    const dataSource = [...this.state.tableData];
    for (let j = 0; j < dataSource.length; j++) {
      for (let i = 0; i < ids.length; i++) {
        if (dataSource[j].id === ids[i]) {
          dataSource.splice(j, 1);
        }
      }
    }
    this.setState({tableData: dataSource});
  };
  handleTableSave = row => {
    console.log('🚀row', row);
    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({tableData: newData}, () => {
      console.log('tableData', this.state.tableData);
    });
  };

  OnGysSuccess = () => {
    this.setState({addGysModalVisible: false});
    FetchQueryGysInZbxx({
      // paging: 1,
      paging: -1,
      sort: '',
      current: 1,
      pageSize: 10,
      total: -1,
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          glgys: [...rec],
        });
      }
    });
  };

  zbgysChange = (e, record, index) => {
    console.log("e record, index", e, record, index)
    if (e === "新增供应商") {
      const {tableData} = this.state;
      // console.log("tableData",tableData)
      tableData.map(item => {
        if (item.ID === record.ID) {
          item['zbgys' + item.ID] = undefined;
        }
      })
      this.setState({
        addGysModalVisible: true,
        ...tableData
      });
    } else {
      const {tableData} = this.state;
      // console.log("tableData",tableData)
      tableData.map(item => {
        if (item.ID === record.ID) {
          item['zbgys' + item.ID] = e;
        }
      })
      this.setState({
        ...tableData
      });
    }
  }

  ZSCQLXChange = (e, record, index) => {
    // console.log("e record, index",e, record, index)
    const {tableData} = this.state;
    // console.log("tableData",tableData)
    tableData.map(item => {
      if (item.ID === record.ID) {
        item['zbgys' + item.ID] = e;
      }
    })
    this.setState({
      ...tableData
    })
  }

  addItem = () => {
    console.log('addItem');
    this.setState({
      addGysModalVisible: true,
    });
  };

  render() {
    const {
      isTableFullScreen,
      isModalFullScreen,
      tableData,
      bidInfo,
      selectedRowIds,
      isSelectorOpen1,
      isSelectorOpen2,
      uploadFileParams,
      fileList,
      pbbgTurnRed,
      glgys,
      addGysModalVisible,
      addSkzhModalVisible,
      addGysModalUrl,
      addSkzhModalUrl,
      skzhData,
      isSpinning,
      radioValue,
    } = this.state;
    const {
      currentXmid,
      currentXmmc,
      visible,
      closeModal,
      onSuccess,
      dictionary: {HJRYDJ = [], ZSCQLX = []}
    } = this.props;
    console.log("glgysglgysglgys", this.state.glgys)
    const {getFieldDecorator, getFieldValue, setFieldsValue, validateFields} = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let newSelectedRowIds = [];
        selectedRows?.forEach(item => {
          newSelectedRowIds.push(item.id);
        });
        this.setState({selectedRowIds: newSelectedRowIds});
      },
    };
    const _this = this;
    const tableColumns = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>包含类型</span>,
        dataIndex: 'bhlx',
        key: 'bhlx',
        width: '18%',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          // console.log("recordrecord",record)
          return (<Select value={record['bhlx' + record.ID]}
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
        title: (
          <>
            包含名称
          </>
        ),
        dataIndex: 'bhmc',
        key: 'bhmc',
        width: '18%',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}><span style={{
          fontFamily: 'SimSun, sans-serif',
          color: '#f5222d',
          marginRight: '4px',
          lineHeight: 1
        }}>*</span>中标供应商</span>,
        dataIndex: 'zbgys',
        key: 'zbgys',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (<Select value={record['zbgys' + record.ID]}
                          showSearch
              // onSearch={onSearch}
                          onChange={(e) => {
                            _this.zbgysChange(e, record, index)
                          }}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          dropdownRender={menu => (
                            <div>
                              {menu}
                              <Divider style={{margin: '4px 0'}}/>
                              <div
                                style={{textAlign: 'center', color: '#3361ff', cursor: 'pointer'}}
                                onMouseDown={e => e.preventDefault()}
                                onClick={_this.addItem}
                              >
                                <Icon type="plus"/> 新增供应商
                              </div>
                            </div>
                          )}>
              {
                glgys.length > 0 && glgys.map((item, index) => {
                  return (
                    <Option key={item?.id} value={item?.gysmc}>{item?.gysmc}</Option>
                  )
                })
              }
            </Select>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: 102.81,
        ellipsis: true,
        render: (text, record) =>
          this.state.tableData.length >= 1 ? (
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                return this.handleSingleDelete(record.id);
              }}
            >
              <a style={{color: '#3361ff'}}>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];
    const columns = tableColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          return {
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            handleSave: this.handleTableSave,
            key: col.key,
            gysdata: [...glgys],
            skzhdata: [...skzhData],
            formdecorate: this.props.form,
          };
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
    const addGysModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新增供应商',
      width: '120rem',
      height: '90rem',
      style: {top: '20rem'},
      visible: addGysModalVisible,
      footer: null,
    };

    const basicFormItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };
    return (
      <>
        {addGysModalVisible && (
          <BridgeModel
            modalProps={addGysModalProps}
            onCancel={() => this.setState({addGysModalVisible: false})}
            onSucess={this.OnGysSuccess}
            src={
              localStorage.getItem('livebos') +
              '/OperateProcessor?operate=View_GYSXX_ADD&Table=View_GYSXX'
            }
          />
        )}
        <Modal
          wrapClassName="editMessage-modify"
          width={'1000px'}
          maskClosable={false}
          zIndex={100}
          cancelText={'取消'}
          okText={"保存"}
          bodyStyle={{
            padding: '0',
          }}
          title={null}
          visible={visible}
          onOk={() => {
            validateFields(err => {
              if (fileList.length !== 0) {
                //评标报告不为空
                if (!err) {
                  //表单部分必填不为空
                  let arr = [...tableData];
                  let newArr = [];
                  arr.map(item => {
                    let obj = {
                      GYSMC: String(
                        glgys?.filter(x => x.gysmc === item[`gysmc${item.id}`])[0]?.id || '',
                      ),
                      GYSFKZH: '-1',
                      // GYSFKZH: String(
                      //   skzhData?.filter(x => x.khmc === item[`gysskzh${item.id}`])[0]?.id || '',
                      // ),
                    };
                    newArr.push(obj);
                  });
                  newArr.push({});
                  const {zbgys, tbbzj, lybzj, zbgysskzh, pbbg} = bidInfo;
                  const {
                    columnName,
                    documentData,
                    fileLength,
                    fileName,
                    filePath,
                    id,
                    objectName,
                  } = uploadFileParams;
                  let submitdata = {
                    columnName: 'PBBG',
                    documentData,
                    fileLength,
                    glgys: 0,
                    gysfkzh: Number(
                      // skzhData?.filter(x => x.khmc === getFieldValue('zbgysskzh'))[0]?.id || '',
                      this.state.skzhId,
                    ),
                    ijson: JSON.stringify(newArr),
                    lybzj: Number(getFieldValue('lybzj')),
                    objectName: 'TXMXX_ZBXX',
                    pbbg: fileName,
                    rowcount: tableData.length,
                    tbbzj: Number(getFieldValue('tbbzj')),
                    xmmc: Number(currentXmid),
                    zbgys: Number(
                      glgys?.filter(x => x.gysmc === getFieldValue('zbgys'))[0]?.id || '',
                    ),
                  };
                  console.log('🚀submitdata', submitdata);
                  UpdateZbxx({
                    ...submitdata,
                  }).then(res => {
                    if (res?.code === 1) {
                      // message.success('中标信息修改成功', 1);
                      onSuccess();
                    } else {
                      message.error('信息修改失败', 1);
                    }
                  });
                  this.setState({tableData: []});
                  closeModal();
                }
              } else {
                this.setState({
                  pbbgTurnRed: true,
                });
              }
            });
          }}
          onCancel={() => {
            this.setState({tableData: []});
            closeModal();
          }}
        >
          <div
            style={{
              height: '42px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3361FF',
              color: 'white',
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '2.333rem',
            }}
          >
            <strong>合同信息录入</strong>
          </div>
          <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="agreementEnterModal">
            <Form {...basicFormItemLayout} name="nest-messages" style={{padding: '24px'}}>
              <Row>
                <Col span={12}>
                  <Form.Item label={<span><span style={{
                    textAlign: 'left',
                    fontFamily: 'SimSun, sans-serif',
                    color: '#f5222d',
                    marginRight: '4px',
                    lineHeight: 1
                  }}>*</span>合同金额（元）</span>} className="formItem">
                    {getFieldDecorator('contractValue', {
                      // rules: [{
                      //   required: true,
                      //   message: '请输入合同金额'
                      // }],
                      // initialValue: purchaseInfo.contractValue
                    })(
                      <Input type='number' placeholder="请输入合同金额" onChange={e => {
                        //console.log('请输入合同金额',e.target.value)
                        // this.setState({purchaseInfo: {...purchaseInfo, contractValue: e.target.value}});
                      }}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<span><span style={{
                    textAlign: 'left',
                    fontFamily: 'SimSun, sans-serif',
                    color: '#f5222d',
                    marginRight: '4px',
                    lineHeight: 1
                  }}>*</span>签署日期</span>} className="formItem">
                    {getFieldDecorator('signData', {
                      // rules: [{
                      //   required: true,
                      //   message: '请输入项目类型'
                      // }],
                      // initialValue: purchaseInfo.signData
                    })(
                      <div style={{
                        // width: '270px'
                      }} id="datePicker">
                        <DatePicker format="YYYY-MM-DD"
                                    allowClear={false}
                          // value={moment(purchaseInfo.signData, 'YYYY-MM-DD')}
                                    onChange={(date, dateString) => {
                                      //console.log("eeeeee", dateString)
                                      // this.setState({purchaseInfo: {...purchaseInfo, signData: dateString}});
                                    }}
                                    onFocus={() => this.setState({
                                      // isEditMile: true,
                                      // isCollapse: false
                                    })}/>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{position: 'relative'}}>
                  <Form.Item labelCol={{span: 3}} wrapperCol={{span: 21}} label={<span><span style={{
                    textAlign: 'left',
                    fontFamily: 'SimSun, sans-serif',
                    color: '#f5222d',
                    marginRight: '4px',
                    lineHeight: 1
                  }}>*</span>中标供应商</span>} className="formItem">
                    {getFieldDecorator('biddingSupplier', {
                      // rules: [{
                      //   required: true,
                      //   message: '请输入合同金额'
                      // }],
                      // initialValue: purchaseInfo.biddingSupplierName
                    })(<Select
                      style={{borderRadius: '8px !important'}}
                      placeholder="请选择供应商"
                      className="skzh-box"
                      showSearch
                      // allowClear
                      // open={isSelectorOpen}
                      // onChange={e => {
                      //   this.setState({purchaseInfo: {...purchaseInfo, biddingSupplier: e}});
                      // }}
                      // onDropdownVisibleChange={(visible) => this.setState({isSelectorOpen: visible})}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {/*{*/}
                      {/*  gysData?.map((item = {}, ind) => {*/}
                      {/*    return <Option key={ind} value={item.id}>*/}
                      {/*      {item.gysmc}*/}
                      {/*    </Option>*/}
                      {/*  })*/}
                      {/*}*/}
                    </Select>)}
                  </Form.Item>
                  <div
                    style={{
                      height: '20px',
                      width: '1px',
                      backgroundColor: '#c7c7c7',
                      // marginLeft: '8px',
                      marginTop: '10px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '35px',
                    }}
                  ></div>
                  <i
                    className="iconfont circle-add"
                    onClick={() => {
                      this.setState({addGysModalVisible: true});
                    }}
                    style={{
                      marginTop: '5px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '8px',
                      color: '#c7c7c7',
                      fontSize: '20px',
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{position: 'relative'}}>
                  <Form.Item labelCol={{span: 3}} wrapperCol={{span: 21}} label={<span><span style={{
                    textAlign: 'left',
                    fontFamily: 'SimSun, sans-serif',
                    color: '#f5222d',
                    marginRight: '4px',
                    lineHeight: 1
                  }}>*</span>付款主流程</span>} className="formItem">
                    {getFieldDecorator('biddingSupplier', {
                      // rules: [{
                      //   required: true,
                      //   message: '请输入合同金额'
                      // }],
                      // initialValue: purchaseInfo.biddingSupplierName
                    })(<Select
                      style={{borderRadius: '8px !important'}}
                      placeholder="请选择付款主流程"
                      className="skzh-box"
                      showSearch
                      // allowClear
                      // open={isSelectorOpen}
                      // onChange={e => {
                      //   this.setState({purchaseInfo: {...purchaseInfo, biddingSupplier: e}});
                      // }}
                      // onDropdownVisibleChange={(visible) => this.setState({isSelectorOpen: visible})}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {/*{*/}
                      {/*  gysData?.map((item = {}, ind) => {*/}
                      {/*    return <Option key={ind} value={item.id}>*/}
                      {/*      {item.gysmc}*/}
                      {/*    </Option>*/}
                      {/*  })*/}
                      {/*}*/}
                    </Select>)}
                  </Form.Item>
                  <div
                    style={{
                      height: '20px',
                      width: '1px',
                      backgroundColor: '#c7c7c7',
                      // marginLeft: '8px',
                      marginTop: '10px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '35px',
                    }}
                  ></div>
                  <i
                    className="iconfont circle-add"
                    onClick={() => {
                      this.setState({addGysModalVisible: true});
                    }}
                    style={{
                      marginTop: '5px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '8px',
                      color: '#c7c7c7',
                      fontSize: '20px',
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label={<span><span style={{
                    textAlign: 'left',
                    fontFamily: 'SimSun, sans-serif',
                    color: '#f5222d',
                    marginRight: '4px',
                    lineHeight: 1
                  }}>*</span>付款日期</span>} className="formItem">
                    {getFieldDecorator('signData', {
                      // rules: [{
                      //   required: true,
                      //   message: '请输入项目类型'
                      // }],
                      // initialValue: purchaseInfo.signData
                    })(
                      <div style={{
                        width: '270px'
                      }} id="datePicker">
                        <DatePicker format="YYYY-MM-DD"
                                    allowClear={false}
                          // value={moment(purchaseInfo.signData, 'YYYY-MM-DD')}
                                    onChange={(date, dateString) => {
                                      //console.log("eeeeee", dateString)
                                      // this.setState({purchaseInfo: {...purchaseInfo, signData: dateString}});
                                    }}
                                    onFocus={() => this.setState({
                                      // isEditMile: true,
                                      // isCollapse: false
                                    })}/>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={'付款详情'}
                    labelCol={{span: 3}} wrapperCol={{span: 21}}
                    required
                  >
                    <div className="tableBox2">
                      <Table
                        columns={columns}
                        components={components}
                        rowKey={record => record.id}
                        rowClassName={() => 'editable-row'}
                        dataSource={tableData}
                        // rowSelection={rowSelection}
                        scroll={tableData.length > 3 ? {y: 195} : {}}
                        pagination={false}
                        bordered
                        size="middle"
                        style={{paddingBottom: '12px',}}
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
                          ['bhlx' + Date.now()]: '',
                          ['bhmc' + Date.now()]: '',
                          ['zbgys' + Date.now()]: '',
                        });
                        this.setState({tableData: arrData})
                      }}>
                      <span className='addHover'>
                        <Icon type="plus" style={{fontSize: '12px'}}/>
                        <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增标段信息</span>
                      </span>
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(AgreementEnterModal));
