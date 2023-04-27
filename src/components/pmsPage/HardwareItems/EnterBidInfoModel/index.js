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
  Divider,
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
import { connect } from 'dva';
import moment from 'moment';
import {
  FetchQueryHardwareTendersAndContract,
  UpdateHardwareTenderInfo,
} from '../../../../services/projectManage';
import { DecryptBase64 } from '../../../Common/Encrypt';

const { confirm } = Modal;
const { Option, OptGroup } = Select;

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
      ['BJLX' + record['ID'], 'BJMC' + record['ID'], 'ZBGYS' + record['ID']],
      (error, values) => {
        if (error && error[e.currentTarget.ID]) {
          return;
        }
        handleSave({ ID: record['ID'], ...values });
      },
    );
  };

  getTitle = dataIndex => {
    switch (dataIndex) {
      case 'BJLX':
        return '包件类型';
      case 'BJMC':
        return '包件名称';
      case 'ZBGYS':
        return '中标供应商';
      default:
        break;
    }
  };

  onGysChange = v => {
    const { record, handleSave, formdecorate } = this.props;
    let obj = {
      ['ZBGYS' + record['ID']]: v,
    };
    handleSave({ ID: record['ID'], ...obj });
  };

  getFormDec = (form, dataIndex, record) => {
    const { gysdata } = this.props;
    switch (dataIndex) {
      case 'BJLX':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          // rules: [{
          //   required: true,
          //   message: '请选择包件类型'
          // }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(
          <Input
            style={{ textAlign: 'center' }}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />,
        );
      case 'BJMC':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          // rules: [{
          //   required: true,
          //   message: '请输入包件名称'
          // }],
          initialValue: String(record[dataIndex + record['ID']]),
        })(
          <Input
            style={{ textAlign: 'center' }}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />,
        );
      case 'ZBGYS':
        return form.getFieldDecorator(dataIndex + record['ID'], {
          // rules: [
          //   {
          //     required: true,
          //     message: `${this.getTitle(dataIndex)}不允许空值`,
          //   },
          // ],
          initialValue: record[dataIndex + record['ID']],
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

let index = 0;

class EnterBidInfoModel extends React.Component {
  state = {
    xmid: -1,
    operateType: 'ADD',
    bidInfo: {
      //中标信息
      tenders: [],
      totalRows: 0,
      bidBond: '',
      performanceBond: '',
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
    tableDataSearch: [], //修改时-接口查询出来表格数据
    tableData: [], //实时的表格数据
    tableDataDel: [], //删除的表格数据
    addGysModalVisible: false,
    isSpinning: true, //弹窗加载状态
  };

  // componentDidMount() {
  //   this.fetchQueryGysInZbxx(1, PASE_SIZE);
  //   this.fetchQueryHardwareTendersAndContract();
  // }

  componentDidMount = async () => {
    const { operateType, xmid } = this.props;
    this.fetchQueryGysInZbxx(1, PASE_SIZE);
    if (operateType === 'UPDATE') {
      this.fetchQueryHardwareTendersAndContract();
    }
  };

  // 获取url参数
  getUrlParams = () => {
    console.log('paramsparams', this.props.match.params);
    const {
      match: {
        params: { params: encryptParams = '' },
      },
    } = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    return params;
  };

  // 查询硬件项目的招标信息，合同信息
  fetchQueryHardwareTendersAndContract = () => {
    const {
      dictionary: { BJLX = [] },
      xmid,
      operateType,
    } = this.props;
    const { glgys } = this.state;
    FetchQueryHardwareTendersAndContract({
      xmmc: xmid,
      flowId: -1,
      type: 'ZBXX',
    }).then(res => {
      if (res.success) {
        const { zbxx, wjxx } = res;
        const zbxxJson = JSON.parse(zbxx);
        const wjxxJson = JSON.parse(wjxx);
        console.log('zbxxzbxx', zbxxJson);
        let arr = [];
        for (let i = 0; i < zbxxJson.length; i++) {
          arr.push({
            //查询出来的id要为String类型 和新增的时间戳id number类型区分开来
            ID: String(zbxxJson[i]?.bdxxid),
            // ['BJLX' + zbxxJson[i]?.bdxxid]: BJLX?.filter(item => item.ibm == zbxxJson[i]?.bjlx)[0]?.note || '',
            ['BJLX' + zbxxJson[i]?.bdxxid]: zbxxJson[i]?.bjlx || '',
            ['BJMC' + zbxxJson[i]?.bdxxid]: zbxxJson[i]?.bjmc,
            ['ZBGYS' + zbxxJson[i]?.bdxxid]: zbxxJson[i]?.zbgys || '',
          });
        }
        this.setState({
          isSpinning: false,
          bidInfo: {
            bidBond: zbxxJson[0]?.tbbzj,
            performanceBond: zbxxJson[0]?.lybzj,
          },
          tableData: arr,
          tableDataSearch: arr,
          uploadFileParams: {
            columnName: 'PBBG',
            documentData: wjxxJson[0].data
              ? wjxxJson[0].data
              : 'DQoNCg0KDQoxMTExMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIxMTExMjExMTEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjExMTEyDQoyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy',
            fileLength: 0,
            filePath: '',
            fileName: wjxxJson[0]?.fileName ? wjxxJson[0]?.fileName : '测试.txt',
            id: 0,
            objectName: 'TXMXX_ZBXX',
          },
        });
        if (wjxxJson[0].url && wjxxJson[0].data && zbxxJson[0].pbbg) {
          let arrTemp = [];
          arrTemp.push({
            uid: Date.now(),
            name: wjxxJson[0].fileName,
            status: 'done',
            url: wjxxJson[0].url,
          });
          this.setState({
            fileList: [...this.state.fileList, ...arrTemp],
          });
        }
      }
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
          isSpinning: false,
          glgys: [...rec],
        });
      }
    });
  };

  //中标信息表格单行删除
  handleSingleDelete = id => {
    const {tableDataDel} = this.state;
    this.setState({
      isSpinning: true,
    });
    const dataSource = [...this.state.tableData];
    const del = this.state.tableDataSearch.filter(item => item.ID === id);
    this.setState({
      tableData: dataSource.filter(item => item.ID !== id),
      tableDataDel: [...del, ...tableDataDel],
      isSpinning: false,
    });
  };

  handleTableSave = row => {
    console.log('🚀row', row);
    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => row.ID === item.ID);
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

  zbgysChange = (e, record, index) => {
    console.log('e record, index', String(e), record, index);
    const { tableData } = this.state;
    // console.log("tableData",tableData)
    tableData.map(item => {
      if (item.ID === record.ID) {
        item['ZBGYS' + item.ID] = String(e);
      }
    });
    this.setState({
      ...tableData,
    });
  };

  addItem = () => {
    console.log('addItem');
    this.setState({
      addGysModalVisible: true,
    });
  };

  BJLXChange = (e, record, index) => {
    // console.log("e record, index",e, record, index)
    const { tableData } = this.state;
    // console.log("tableData",tableData)
    tableData.map(item => {
      if (item.ID === record.ID) {
        item['BJLX' + item.ID] = e;
      }
    });
    this.setState({
      ...tableData,
    });
  };

  handleCancel = () => {
    const _this = this;
    confirm({
      okText: '确认',
      cancelText: '取消',
      title: '提示',
      content: '确定要取消操作？',
      onOk() {
        _this.props.closeModal();
      },
      onCancel() {},
    });
  };

  handleSaveZbxx = () => {
    const { tableData, tableDataDel, bidInfo, uploadFileParams, fileList } = this.state;
    const { bidBond, performanceBond } = bidInfo;
    const {
      columnName,
      documentData,
      fileLength,
      fileName,
      filePath,
      id,
      objectName,
    } = uploadFileParams;
    const { xmid, operateType } = this.props;
    console.log('fileList', fileList);
    if (fileList.length === 0 || tableData.length === 0) {
      message.warn('中标信息未填写完整！');
      return;
    }
    this.setState({
      isSpinning: true,
    });
    let num = 0;
    if (tableData.length > 0) {
      tableData.map(item => {
        if (
          item['BJLX' + item.ID] === '' ||
          item['BJMC' + item.ID] === '' ||
          item['ZBGYS' + item.ID] === ''
        ) {
          num++;
        }
      });
      if (num !== 0) {
        message.warn('中标信息未填写完整！');
        return;
      }
    }
    //新增id要变成-1 字段名也需要变
    let tableDataNew = [];
    tableData.map(item => {
      let itm = {};
      if (typeof item.ID === 'number') {
        itm.ID = '-1';
        itm.BJLX = item['BJLX' + item.ID];
        itm.BJMC = item['BJMC' + item.ID];
        itm.ZBGYS = item['ZBGYS' + item.ID];
        itm.CZLX = 'ADD';
      } else {
        itm.ID = item.ID;
        itm.BJLX = item['BJLX' + item.ID];
        itm.BJMC = item['BJMC' + item.ID];
        itm.ZBGYS = item['ZBGYS' + item.ID];
        itm.CZLX = 'UPDATE';
      }
      tableDataNew.push(itm);
    });
    //添加删除的数据
    tableDataDel.map(item => {
      let itm = {};
      itm.ID = item.ID;
      itm.BJLX = item['BJLX' + item.ID];
      itm.BJMC = item['BJMC' + item.ID];
      itm.ZBGYS = item['ZBGYS' + item.ID];
      itm.CZLX = 'DELETE';
      tableDataNew.push(itm);
    });
    let submitdata = {
      projectId: xmid,
      bidBond: Number(bidBond),
      performanceBond: Number(performanceBond),
      fileData: [{ fileName, data: documentData }],
      tenders: JSON.stringify(tableDataNew),
      rowcount: tableDataNew.length,
      //ADD:新增，UPDATE:更新
      type: operateType,
    };
    console.log('🚀submitdata', submitdata);
    UpdateHardwareTenderInfo({
      ...submitdata,
    }).then(res => {
      if (res?.code === 1) {
        this.setState({
          isSpinning: false,
        })
        this.props.closeModal();
        this.props.onSuccess(operateType === "UPDATE" ? "硬件中标信息编辑" : "硬件中标信息录入");
        // message.info('信息' + operateType === "UPDATE" ? "编辑" : "录入" + '成功！', 3)
      } else {
        this.setState({
          isSpinning: false,
        })
        this.props.closeModal();
        message.error(operateType === "UPDATE" ? "硬件中标信息编辑" : "硬件中标信息录入" + '失败！', 3);
      }
    });
  };

  render() {
    const {
      tableData,
      tableDataDel,
      bidInfo,
      selectedRowIds,
      uploadFileParams,
      fileList,
      pbbgTurnRed,
      glgys,
      addGysModalVisible,
      isSpinning,
    } = this.state;
    const {
      xmid,
      operateType,
      visible,
      closeModal,
      onSuccess,
      dictionary: { BJLX = [] },
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;
    const _this = this;
    const tableColumns = [
      {
        title: (
          <span style={{ color: '#606266', fontWeight: 500 }}>
            <span
              style={{
                fontFamily: 'SimSun, sans-serif',
                color: '#f5222d',
                marginRight: '4px',
                lineHeight: 1,
              }}
            >
              *
            </span>
            包件类型
          </span>
        ),
        dataIndex: 'BJLX',
        key: 'BJLX',
        width: '13%',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <Select
              value={record['BJLX' + record.ID]}
              onChange={e => _this.BJLXChange(e, record, index)}
            >
              {BJLX.length > 0 &&
                BJLX.map((item, index) => {
                  return (
                    <Option key={item?.ibm} value={item?.ibm}>
                      {item?.note}
                    </Option>
                  );
                })}
            </Select>
          );
        },
      },
      {
        title: (
          <span style={{ color: '#606266', fontWeight: 500 }}>
            <span
              style={{
                fontFamily: 'SimSun, sans-serif',
                color: '#f5222d',
                marginRight: '4px',
                lineHeight: 1,
              }}
            >
              *
            </span>
            包件名称
          </span>
        ),
        dataIndex: 'BJMC',
        key: 'BJMC',
        width: '18%',
        ellipsis: true,
        editable: true,
      },
      {
        title: (
          <span style={{ color: '#606266', fontWeight: 500 }}>
            <span
              style={{
                fontFamily: 'SimSun, sans-serif',
                color: '#f5222d',
                marginRight: '4px',
                lineHeight: 1,
              }}
            >
              *
            </span>
            中标供应商
          </span>
        ),
        dataIndex: 'ZBGYS',
        key: 'ZBGYS',
        ellipsis: true,
        // editable: true,
        render(text, record, index) {
          return (
            <Select
              value={record['ZBGYS' + record.ID] ? record['ZBGYS' + record.ID].split(',') : []}
              showSearch
              showArrow={true}
              // onSearch={onSearch}
              maxTagCount={2}
              maxTagTextLength={30}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 2}个`;
              }}
              mode="multiple"
              onChange={e => {
                _this.zbgysChange(e, record, index);
              }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div
                    style={{margin: '4px 0', textAlign: 'center', color: '#3361ff', cursor: 'pointer'}}
                    onMouseDown={e => e.preventDefault()}
                    onClick={_this.addItem}
                  >
                    <Icon type="plus" /> 新增供应商
                  </div>
                </div>
              )}
            >
              {glgys.length > 0 &&
                glgys.map((item, index) => {
                  return (
                    <Option key={item?.id} value={item?.id}>
                      {item?.gysmc}
                    </Option>
                  );
                })}
            </Select>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        width: '75px',
        ellipsis: true,
        render: (text, record) =>
          this.state.tableData.length >= 1 ? (
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                return this.handleSingleDelete(record.ID);
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
      width: '800px',
      height: '500px',
      style: { top: '80px' },
      visible: addGysModalVisible,
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
              '/OperateProcessor?operate=View_GYSXX_ZBADD&Table=View_GYSXX'
            }
          />
        )}
        <Modal
          wrapClassName="editMessage-modify"
          style={{top: '10px', paddingBottom: '0'}}
          width={'1000px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
            height: '647px',
            overflow: 'hidden',
          }}
          onCancel={this.props.closeModal}
          footer={
            <div className="modal-footer">
              <Button className="btn-default" onClick={this.props.closeModal}>
                取消
              </Button>
              {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
              <Button
                disabled={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={this.handleSaveZbxx}
              >
                确定
              </Button>
            </div>
          }
          visible={visible}
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
              fontSize: '16px',
            }}
          >
            <strong>硬件中标信息{operateType === 'UPDATE' ? '编辑' : '录入'}</strong>
          </div>
          <Spin
            wrapperClassName='enterBid-box-style'
            spinning={isSpinning}
            tip="正在努力的加载中..."
            size="large"
            style={{ position: 'fixed' }}
            // wrapperClassName="enter-bid-info-modal-spin"
          >
            <Form name="nest-messages" style={{ padding: '24px', overflowY: 'auto' }}>
              <Row>
                <Col span={12} style={{ paddingRight: '24px' }}>
                  <Form.Item label="履约保证金金额（元）" className="formItem">
                    {getFieldDecorator('performanceBond', {
                      initialValue: bidInfo?.performanceBond,
                    })(
                      <Input
                        placeholder="请输入履约保证金金额（元）"
                        onChange={e => {
                          this.setState({
                            bidInfo: { ...bidInfo, performanceBond: e.target.value },
                          });
                        }}
                      />,
                    )}
                  </Form.Item>{' '}
                </Col>
                <Col span={12} style={{ paddingLeft: '24px' }}>
                  <Form.Item label="投标保证金（元）" className="formItem">
                    {getFieldDecorator('bidBond', {
                      initialValue: bidInfo?.bidBond,
                    })(
                      <Input
                        placeholder="请输入投标保证金（元）"
                        onChange={e => {
                          this.setState({ bidInfo: { ...bidInfo, bidBond: e.target.value } });
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="评标报告"
                    required
                    // help={pbbgTurnRed ? '请上传合同附件' : ''}
                    validateStatus={pbbgTurnRed ? 'error' : 'success'}
                  >
                    <Upload
                      className="uploadStyle"
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
                        this.setState({ fileList });
                      }}
                      beforeUpload={(file, fileList) => {
                        // //console.log("🚀 ~ file: index.js ~ line 674 ~ BidInfoUpdate ~ render ~ file, fileList", file, fileList)
                        let reader = new FileReader(); //实例化文件读取对象
                        reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                        reader.onload = e => {
                          //文件读取成功完成时触发
                          let urlArr = e.target.result.split(',');
                          //console.log('uploadFileParamsuploadFileParams', uploadFileParams);
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
                  <Form.Item label={'标段信息'} required>
                    <div className="tableBox2">
                      <Table
                        columns={columns}
                        components={components}
                        rowKey={record => record.ID}
                        rowClassName={() => 'editable-row'}
                        dataSource={tableData}
                        // rowSelection={rowSelection}
                        scroll={tableData.length > 4 ? { y: 260 } : {}}
                        pagination={false}
                        bordered
                        size="middle"
                        style={{ paddingBottom: '12px' }}
                      ></Table>
                      <div
                        style={{
                          textAlign: 'center',
                          border: '1px dashed #e0e0e0',
                          lineHeight: '32px',
                          height: '32px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          let arrData = tableData;
                          arrData.push({
                            ID: Date.now(),
                            ['BJLX' + Date.now()]: '1',
                            ['BJMC' + Date.now()]: '',
                            ['ZBGYS' + Date.now()]: '',
                          });
                          this.setState({ tableData: arrData });
                          setTimeout(() => {
                            const table = document.querySelectorAll(`.tableBox2 .ant-table-body`)[0];
                            table.scrollTop = table.scrollHeight;
                          }, 200);
                        }}
                      >
                        <span className="addHover">
                          <Icon type="plus" style={{ fontSize: '12px' }} />
                          <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增标段信息</span>
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

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(EnterBidInfoModel));
