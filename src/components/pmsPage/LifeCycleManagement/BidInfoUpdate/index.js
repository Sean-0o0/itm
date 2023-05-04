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
  Radio,
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
import { PluginsUrl } from '../../../../utils/config';
import LODASH from 'lodash';
const { Option } = Select;

const PASE_SIZE = 10; //关联供应商选择器分页长度
const Loginname = localStorage.getItem('firstUserID');
function getID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => {
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

  save = e => {
    const { record, handleSave, formdecorate } = this.props;
    formdecorate.validateFields(
      ['glgys' + record['id'], 'gysmc' + record['id'], 'gysskzh' + record['id']],
      (error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        handleSave({ id: record['id'], ...values });
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
    const { record, handleSave, formdecorate } = this.props;
    let obj = {
      ['gysmc' + record['id']]: v,
    };
    handleSave({ id: record['id'], ...obj });
  };
  onSkzhChange = v => {
    const { record, handleSave, formdecorate } = this.props;
    let obj = {
      ['gysskzh' + record['id']]: v,
    };
    handleSave({ id: record['id'], ...obj });
  };

  getFormDec = (form, dataIndex, record) => {
    const { skzhdata, gysdata } = this.props;
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
            style={{ width: '100%', borderRadius: '8px !important' }}
            placeholder="请选择供应商"
            onChange={this.onGysChange}
            showSearch
            open={this.state.isGysOpen}
            onDropdownVisibleChange={visible => this.setState({ isGysOpen: visible })}
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
            style={{ width: '100%', borderRadius: '8px !important' }}
            placeholder="请选择供应商收款账号"
            onChange={this.onSkzhChange}
            showSearch
            open={this.state.isSkzhOpen}
            onDropdownVisibleChange={visible => this.setState({ isSkzhOpen: visible })}
          >
            {skzhdata?.map((item = {}, ind) => {
              return (
                <Option key={ind} value={item.khmc}>
                  {item.khmc}
                  {this.state.isSkzhOpen && <div style={{ fontSize: '0.6em' }}>{item.yhkh}</div>}
                </Option>
              );
            })}
          </Select>,
        );
      default:
        return (
          <Input
            style={{ textAlign: 'center' }}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        );
    }
  };

  renderCell = form => {
    const { children, dataIndex, record, formdecorate } = this.props;
    return (
      <Form.Item style={{ margin: 0 }}>
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

let timer = null;
class BidInfoUpdate extends React.Component {
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
    isSpinning: true, //弹窗加载状态
    radioValue: 1, //单选，默认1->公共账户
    skzhId: -1,
    initialSkzhId: -1,
    initialSkzhMc: '',
  };

  componentDidMount() {
    this.fetchQueryGysInZbxx(1, PASE_SIZE);
  }

  componentWillUnmount() {
    clearTimeout(timer);
  }

  // 获取中标信息
  fetchQueryZBXXByXQTC = () => {
    const { currentXmid } = this.props;
    FetchQueryZBXXByXQTC({
      xmmc: currentXmid,
    }).then(res => {
      let rec = res.record;
      // console.log('🚀 ~ file: index.js:228 ~ BidInfoUpdate ~ res.record:', res.record);
      this.firstTimeQueryPaymentAccountList(rec[0].zbgysfkzhmc);
      this.setState({
        initialSkzhMc: rec[0].zbgysfkzhmc || '',
        initialSkzhId: Number(rec[0].zbgysfkzh),
        skzhId: rec[0].zbgysfkzh,
        bidInfo: {
          zbgys: this.state.glgys.filter(x => x.id === rec[0].zbgys)[0]?.gysmc || '',
          tbbzj: Number(rec[0].tbbzj),
          lybzj: Number(rec[0].lybzj),
          zbgysskzh: rec[0].zbgysfkzhmc || '',
          pbbg: rec[0].pbbg,
        },
        uploadFileParams: {
          columnName: 'PBBG',
          documentData: res.base64,
          fileLength: '',
          filePath: '',
          fileName: rec[0].pbbg,
          id: rec[0].zbxxid,
          objectName: 'TXMXX_ZBXX',
        },
      });
      if (res.url && res.base64 && rec[0].pbbg) {
        let arrTemp = [];
        arrTemp.push({
          uid: Date.now(),
          name: rec[0].pbbg,
          status: 'done',
          url: res.url,
        });
        this.setState({
          fileList: [...this.state.fileList, ...arrTemp],
        });
      }
      let arr = [];
      for (let i = 0; i < rec.length; i++) {
        let id = getID();
        arr.push({
          id,
          [`gysmc${id}`]: this.state.glgys.filter(x => x.id === rec[i].gysmc)[0]?.gysmc || '',
          // [`gysskzh${id}`]: this.state.skzhData.filter(x => x.id === rec[i].gysfkzh)[0]?.khmc || '',
        });
      }
      this.setState({
        tableData: [...this.state.tableData, ...arr],
        isSpinning: false,
      });
    });
  };

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
        this.fetchQueryZBXXByXQTC();
      }
    });
  };

  firstTimeQueryPaymentAccountList = (khmc = '') => {
    QueryPaymentAccountList({
      type: 'UPDATEQUERY',
      current: 1,
      pageSize: 10,
      paging: 1,
      sort: '1',
      total: -1,
      khmc,
      zhid: -1,
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          currentPage: 1,
          skzhData: [...rec],
          isNoMoreData: false,
        });
      }
    });
  };

  initialQueryPaymentAccountList = () => {
    QueryPaymentAccountList({
      type: 'UPDATEQUERY',
      current: 1,
      pageSize: 10,
      paging: 1,
      sort: '1',
      total: -1,
      khmc: this.state.initialSkzhMc,
      zhid: -1,
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          currentPage: 1,
          skzhData: [...rec],
          currentKhmc: '',
          isNoMoreData: false,
        });
      }
    });
  };

  fetchQueryPaymentAccountList = (khmc = '', current = 1, zhid = -1) => {
    this.setState({
      fetching: true,
    });
    QueryPaymentAccountList({
      type: 'ALL',
      current,
      pageSize: 10,
      paging: 1,
      sort: '1',
      total: -1,
      khmc,
      zhid,
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        let arr = [...this.state.skzhData];
        if (res.totalrows <= 10) {
          this.setState({
            skzhData: [...rec],
            fetching: false,
            isNoMoreData: true,
          });
        } else if (rec.length === 0) {
          this.setState({
            skzhData: [...arr],
            fetching: false,
            isNoMoreData: true,
          });
        } else {
          this.setState({
            skzhData: [...arr, ...rec],
            fetching: false,
          });
          // console.log('🚀 ~ file: index.js:375 ~ BidInfoUpdate ~ [...arr, ...rec]:', [
          //   ...arr,
          //   ...rec,
          // ]);
        }
      }
    });
  };

  debounce = (fn, waits = 500) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn();
    }, waits);
  };

  handleSkzhSearch = khmc => {
    this.debounce(() => {
      QueryPaymentAccountList({
        type: 'ALL',
        current: 1,
        pageSize: 10,
        paging: 1,
        sort: '1',
        total: -1,
        khmc,
        zhid: -1,
      }).then(res => {
        if (res.success) {
          let rec = res.record;
          this.setState({
            currentPage: 1,
            skzhData: [...rec],
            currentKhmc: khmc,
            isNoMoreData: false,
          });
        }
      });
    });
  };

  handleSkzhScroll = e => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight <= 10) {
      const { currentPage, isNoMoreData, currentKhmc, initialSkzhId } = this.state;
      let index = currentPage;
      index = index + 1;
      if (!isNoMoreData) {
        this.setState({
          currentPage: index,
        });
        this.fetchQueryPaymentAccountList(
          currentKhmc,
          index,
          currentKhmc === '' ? initialSkzhId : -1,
        );
      }
    }
  };
  //收款账户变化
  handleSkzhChange = v => {
    console.log(v);
    const obj = this.state.skzhData?.filter(x => x.khmc === v)[0];
    this.setState({
      currentPage: 1,
      isNoMoreData: false,
      skzhId: obj?.id,
    });
  };

  //中标信息表格单行删除
  handleSingleDelete = id => {
    const dataSource = [...this.state.tableData];
    this.setState({ tableData: dataSource.filter(item => item.id !== id) });
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
    this.setState({ tableData: dataSource });
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
    this.setState({ tableData: newData }, () => {
      console.log('tableData', this.state.tableData);
    });
  };

  OnGysSuccess = () => {
    this.setState({ addGysModalVisible: false });
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
  OnSkzhSuccess = () => {
    this.setState({ addSkzhModalVisible: false });
    QueryPaymentAccountList({
      type: 'ALL',
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          skzhData: [...rec],
        });
      }
    });
  };
  // OnRadioChange = e => {
  //   let rec = [...this.state.staticSkzhData];
  //   let tempArr = rec.filter(x => {
  //     let arr = x.ssr?.split(';');
  //     return arr?.includes(String(this.props.loginUserId));
  //   });
  //   let finalArr = Number(e.target.value) === 1 ? [...rec] : [...tempArr];
  //   this.setState({
  //     radioValue: e.target.value,
  //     skzhData: [...finalArr],
  //   });
  // };
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
      // radioValue,
    } = this.state;
    const {
      currentXmid,
      currentXmmc,
      bidInfoModalVisible,
      closeBidInfoModal,
      onSuccess,
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let newSelectedRowIds = [];
        selectedRows?.forEach(item => {
          newSelectedRowIds.push(item.id);
        });
        this.setState({ selectedRowIds: newSelectedRowIds });
      },
    };
    const tableColumns = [
      {
        title: (
          <>
            <span style={{ color: 'red' }}>*</span>供应商名称
          </>
        ),
        dataIndex: 'gysmc',
        key: 'gysmc',
        ellipsis: true,
        editable: true,
      },
      // {
      //   title: (
      //     <>
      //       <span style={{ color: 'red' }}>*</span>供应商收款账号
      //     </>
      //   ),
      //   dataIndex: 'gysskzh',
      //   key: 'gysskzh',
      //   ellipsis: true,
      //   editable: true,
      // },
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
              <a style={{ color: '#3361ff' }}>删除</a>
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
      width: '720px',
      height: '460px',
      style: { top: '120px' },
      visible: addGysModalVisible,
      footer: null,
    };
    const addSkzhModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新增收款账号',
      width: '720px',
      height: '460px',
      style: { top: '120px' },
      visible: addSkzhModalVisible,
      footer: null,
    };
    return (
      <>
        {addGysModalVisible && (
          <BridgeModel
            modalProps={addGysModalProps}
            onCancel={() => this.setState({ addGysModalVisible: false })}
            onSucess={this.OnGysSuccess}
            src={
              localStorage.getItem('livebos') +
              '/OperateProcessor?operate=View_GYSXX_ADD&Table=View_GYSXX'
            }
          />
        )}
        {addSkzhModalVisible && (
          <BridgeModel
            modalProps={addSkzhModalProps}
            onCancel={() => this.setState({ addSkzhModalVisible: false })}
            onSucess={this.OnSkzhSuccess}
            src={
              localStorage.getItem('livebos') +
              '/OperateProcessor?operate=View_SKZH_ADD&Table=View_SKZH '
            }
          />
        )}
        <Modal
          wrapClassName="editMessage-modify"
          width={'860px'}
          maskClosable={false}
          zIndex={100}
          cancelText={'关闭'}
          style={{
            top: '10px',
          }}
          bodyStyle={{
            padding: '0',
          }}
          title={null}
          visible={bidInfoModalVisible}
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
                  const { zbgys, tbbzj, lybzj, zbgysskzh, pbbg } = bidInfo;
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
                    czlx: 'UPDATE',
                    documentData,
                    fileLength,
                    glgys: 0,
                    gysfkzh: -1,
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
                  this.setState({ tableData: [] });
                  closeBidInfoModal();
                }
              } else {
                this.setState({
                  pbbgTurnRed: true,
                });
              }
            });
          }}
          onCancel={() => {
            this.setState({ tableData: [] });
            closeBidInfoModal();
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
              marginBottom: '16px',
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '15px',
            }}
          >
            <strong>中标信息修改</strong>
          </div>
          <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="diy-style-spin">
            <Form name="nest-messages" style={{ padding: '0 24px' }}>
              <Row>
                <Col span={12}>
                  <Form.Item label="项目名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <div
                      style={{
                        width: '100%',
                        height: '32px',
                        backgroundColor: '#F5F5F5',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        marginTop: '5px',
                        lineHeight: '32px',
                        paddingLeft: '10px',
                        fontSize: '14px',
                      }}
                    >
                      {currentXmmc}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="中标供应商" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    {getFieldDecorator('zbgys', {
                      initialValue: String(bidInfo?.zbgys),
                      rules: [
                        {
                          required: true,
                          message: '中标供应商不允许空值',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%', borderRadius: '8px !important' }}
                        showSearch
                        placeholder="请选择中标供应商"
                        className="skzh-box"
                        optionFilterProp="children"
                        onChange={this.handleGysChange}
                        filterOption={(input, option) =>
                          option.props.children?.toLowerCase().includes(input.toLowerCase())
                        }
                        open={isSelectorOpen1}
                        onDropdownVisibleChange={visible => {
                          this.setState({ isSelectorOpen1: visible });
                        }}
                      >
                        {glgys.map((item = {}, ind) => {
                          return (
                            <Select.Option key={ind} value={item.gysmc}>
                              {item.gysmc}
                            </Select.Option>
                          );
                        })}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <div
                  style={{
                    height: '20px',
                    width: '1px',
                    backgroundColor: '#c7c7c7',
                    marginLeft: '8px',
                    marginTop: '10px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '0',
                    right: '38px',
                  }}
                ></div>
                <i
                  className="iconfont circle-add"
                  onClick={() => this.setState({ addGysModalVisible: true })}
                  style={{
                    marginTop: '6px',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '0',
                    right: '8px',
                    color: '#c7c7c7',
                    fontSize: '20px',
                  }}
                />
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="履约保证金(元)"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('lybzj', {
                      initialValue: String(bidInfo?.lybzj),
                      rules: [
                        {
                          required: true,
                          message: '履约保证金金额(元)不允许空值',
                        },
                        {
                          pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
                          message: '最多不超过13位数字且小数点后数字不超过2位',
                        },
                      ],
                    })(<Input placeholder="请输入履约保证金金额(元)" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="投标保证金(元)"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {getFieldDecorator('tbbzj', {
                      initialValue: String(bidInfo?.tbbzj),
                      rules: [
                        {
                          required: true,
                          message: '投标保证金(元)不允许空值',
                        },
                        {
                          pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
                          message: '最多不超过13位数字且小数点后数字不超过2位',
                        },
                      ],
                    })(<Input placeholder="请输入投标保证金(元)" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="供应商收款账号"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('zbgysskzh', {
                      initialValue: String(bidInfo?.zbgysskzh),
                      rules: [
                        {
                          required: true,
                          message: '供应商收款账号不允许空值',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%', borderRadius: '8px !important' }}
                        showSearch
                        placeholder="请输入开户名称或账号"
                        onChange={this.handleSkzhChange}
                        notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={this.handleSkzhSearch}
                        onPopupScroll={this.handleSkzhScroll}
                        optionLabelProp="children"
                        className="skzh-box"
                        onBlur={() => this.initialQueryPaymentAccountList()}
                      >
                        {skzhData?.map((item = {}, ind) => {
                          return (
                            <Select.Option key={item.id} value={item.khmc}>
                              <i
                                className="iconfont icon-bank"
                                style={{ fontSize: '1em', marginRight: '4px', color: '#3361ff' }}
                              />
                              {item.khmc} - {item.yhkh} - {item.wdmc}
                            </Select.Option>
                          );
                        })}
                        {this.state.isNoMoreData && (
                          <Select.Option
                            key={'无更多数据'}
                            value={'无更多数据'}
                            style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.65)' }}
                            disabled={true}
                          >
                            无更多数据
                          </Select.Option>
                        )}
                      </Select>,
                    )}
                  </Form.Item>
                  <div
                    style={{
                      height: '20px',
                      width: '1px',
                      backgroundColor: '#c7c7c7',
                      marginLeft: '8px',
                      marginTop: '10px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '38px',
                    }}
                  ></div>
                  <i
                    className="iconfont circle-add"
                    onClick={() => this.setState({ addSkzhModalVisible: true })}
                    style={{
                      marginTop: '6px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '8px',
                      color: '#c7c7c7',
                      fontSize: '20px',
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="评标报告"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    required
                    help={pbbgTurnRed ? '评标报告不允许空值' : ''}
                    validateStatus={pbbgTurnRed ? 'error' : 'success'}
                  >
                    <Upload
                      action={'/api/projectManage/queryfileOnlyByupload'}
                      onDownload={file => {
                        if (!file.url) {
                          let reader = new FileReader();
                          reader.readAsDataURL(file.originFileObj);
                          reader.onload = e => {
                            var link = document.createElement('a');
                            link.href = e.target.result;
                            link.download = file.name;
                            link.click();
                            window.URL.revokeObjectURL(link.href);
                          };
                        } else {
                          // window.location.href=file.url;
                          var link = document.createElement('a');
                          link.href = file.url;
                          link.download = file.name;
                          link.click();
                          window.URL.revokeObjectURL(link.href);
                        }
                      }}
                      showUploadList={{
                        showDownloadIcon: true,
                        showRemoveIcon: true,
                        showPreviewIcon: true,
                      }}
                      onChange={info => {
                        let fileList = [...info.fileList];
                        fileList = fileList.slice(-1);
                        this.setState({ fileList }, () => {
                          // console.log('目前fileList', this.state.fileList);
                        });
                        if (fileList.length === 0) {
                          this.setState({
                            pbbgTurnRed: true,
                          });
                        } else {
                          this.setState({
                            pbbgTurnRed: false,
                          });
                        }
                      }}
                      beforeUpload={(file, fileList) => {
                        // console.log("🚀 ~ file: index.js ~ line 674 ~ BidInfoUpdate ~ render ~ file, fileList", file, fileList)
                        let reader = new FileReader(); //实例化文件读取对象
                        reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                        reader.onload = e => {
                          //文件读取成功完成时触发
                          let urlArr = e.target.result.split(',');
                          // console.log('uploadFileParamsuploadFileParams', uploadFileParams);
                          this.setState({
                            uploadFileParams: {
                              ...this.state.uploadFileParams,
                              documentData: urlArr[1], //获得文件读取成功后的DataURL,也就是base64编码
                              fileName: file.name,
                            },
                          });
                        };
                      }}
                      accept={
                        '.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                      }
                      fileList={[...fileList]}
                    >
                      <Button type="dashed">
                        <Icon type="upload" />
                        点击上传
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={'其他投标供应商'}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    <div className="tableBox2">
                      <Table
                        columns={columns}
                        components={components}
                        rowKey={record => record.id}
                        rowClassName={() => 'editable-row'}
                        dataSource={tableData}
                        scroll={tableData.length > 3 ? { y: 195 } : {}}
                        pagination={false}
                        bordered
                        size="middle"
                      />
                      <div
                        className="table-add-row"
                        onClick={() => {
                          let arrData = tableData;
                          let id = getID();
                          arrData.push({
                            id,
                            [`glgys${id}`]: '',
                            [`gysmc${id}`]: '',
                            [`gysskzh${id}`]: '',
                          });
                          this.setState({ tableData: arrData }, () => {
                            let table2 = document.querySelectorAll(`.tableBox2 .ant-table-body`)[0];
                            table2.scrollTop = table2.scrollHeight;
                          });
                        }}
                      >
                        <span>
                          <Icon type="plus" style={{ fontSize: '12px' }} />
                          <span style={{ paddingLeft: '6px', fontSize: '14px' }}>
                            新增投标供应商
                          </span>
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
export default Form.create()(BidInfoUpdate);
