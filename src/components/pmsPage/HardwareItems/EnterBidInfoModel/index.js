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
    bidInfo: {
      //中标信息
      tenders: [],
      totalRows: 0,
      bidBond: '',
      performanceBond: '',
    },
    glgys: [],
    uploadFileParams: [],
    fileList: [],
    uploadFileParamsBD: [],
    //显示的文件数据
    fileListTempBD: [],
    pbbgTurnRed: false,
    tableDataSearch: [], //修改时-接口查询出来表格数据
    tableData: [], //实时的表格数据
    tableDataDel: [], //删除的表格数据
    addGysModalVisible: false,
    isSpinning: true, //弹窗加载状态
  };

  componentDidMount = async () => {
    const {xmid} = this.props;
    this.fetchQueryGysInZbxx(1, PASE_SIZE);
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
    const {tableDataDel, uploadFileParamsBD, fileListTempBD} = this.state;
    this.setState({
      isSpinning: true,
    });
    const dataSource = [...this.state.tableData];
    const del = this.state.tableDataSearch.filter(item => item.ID === id);
    //删除表格数据 表格附件数据也要删除
    //根据uid去重
    const map = new Map();
    console.log('uploadFileParamsBDNew000', uploadFileParamsBD);
    let uploadFileParamsBDNew = uploadFileParamsBD.filter(v => !map.has(v.uid) && map.set(v.uid, 1));
    uploadFileParamsBDNew = uploadFileParamsBDNew.filter(item => item.BDID !== id)
    console.log('uploadFileParamsBDNew', uploadFileParamsBDNew);
    console.log('newList000', fileListTempBD);
    let newList = fileListTempBD
    delete newList[id];
    console.log('newList', newList);
    this.setState({
      tableData: dataSource.filter(item => item.ID !== id),
      tableDataDel: [...del, ...tableDataDel],
      uploadFileParamsBD: uploadFileParamsBDNew,
      fileListTempBD: newList,
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
    const {tableData, tableDataDel, bidInfo, uploadFileParams, fileList, uploadFileParamsBD, fileListBD} = this.state;
    const {bidBond, performanceBond} = bidInfo;
    const {xmid} = this.props;
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
    let fileInfo = [];
    //评标报告
    uploadFileParams.map(item => {
      fileInfo.push({fileType: "评标报告", fileName: item.fileName, data: item.documentData});
    });
    console.log("uploadFileParamsBDuploadFileParamsBD", uploadFileParamsBD)
    //子表格附件
    //根据uid去重
    const map = new Map();
    const uploadFileParamsBDNew = uploadFileParamsBD.filter(v => !map.has(v.uid) && map.set(v.uid, 1));
    console.log('uploadFileParamsBDNew', uploadFileParamsBDNew);
    let number = -1
    //同一条子表格数据tenderId是一样的
    let bdidArr = []
    uploadFileParamsBDNew.map(item => {
      let flag = false;
      let tenderId = '';
      let bdid = '';
      bdidArr.map(i => {
        if (i.key === item.BDID) {
          flag = true;
          bdid = i.value
        }
      })
      if (flag) {
        tenderId = bdid;
      } else {
        tenderId = number;
        bdidArr.push({
          key: item.BDID,
          value: number,
        })
        number = number - 1
      }
      item.tenderId = tenderId,
        fileInfo.push({
          fileType: "标段文件",
          tenderId: tenderId,
          fileName: item.fileName,
          data: item.documentData
        });
    })
    console.log('uploadFileParamsBD', uploadFileParamsBD);
    console.log('tableData', tableData);
    //新增id要变成-1 字段名也需要变
    let tableDataNew = [];
    tableData.map(item => {
      let itm = {};
      const temp = uploadFileParamsBD.filter(i => i.BDID === item.ID)
      if (typeof item.ID === 'number') {
        itm.ID = temp.length > 0 ? String(temp[0].tenderId) : String(number);
        itm.BJLX = item['BJLX' + item.ID];
        itm.BJMC = item['BJMC' + item.ID];
        itm.ZBGYS = item['ZBGYS' + item.ID];
        itm.CZLX = 'ADD';
        if (uploadFileParamsBD.filter(i => i.BDID === item.ID).length > 0) {
          itm.SFYWJ = 'yes';
        } else {
          itm.SFYWJ = 'no';
        }
        if (temp.length === 0) {
          number = number - 1
        }
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
      fileData: [...fileInfo],
      tenders: JSON.stringify(tableDataNew),
      rowcount: tableDataNew.length,
      //ADD:新增，UPDATE:更新
      type: 'ADD',
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
        this.props.onSuccess("硬件中标信息录入");
      } else {
        this.setState({
          isSpinning: false,
        })
        this.props.closeModal();
        message.error("硬件中标信息录入失败！", 3);
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
      uploadFileParamsBD,
      fileListTempBD,
      pbbgTurnRed,
      glgys,
      addGysModalVisible,
      isSpinning,
    } = this.state;
    const {
      xmid,
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
              maxTagCount={1}
              maxTagTextLength={30}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 1}个`;
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
        title: '附件',
        dataIndex: 'FJ',
        key: 'FJ',
        ellipsis: true,
        render: (text, record) => {
          return <Upload
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
            multiple={true}
            onChange={info => {
              console.log('目前info', info);
              let fileList = [...info.fileList];
              this.setState({
                fileListTempBD: {...fileListTempBD, [record.ID]: [...fileList]}
              }, () => {
                console.log('目前fileList1111', fileListTempBD);
                console.log('目前fileList-cccc', fileList);
                let arr = [];
                fileList.forEach(item => {
                  let reader = new FileReader(); //实例化文件读取对象
                  reader.readAsDataURL(item.originFileObj); //将文件读取为 DataURL,也就是base64编码
                  reader.onload = e => {
                    let urlArr = e.target.result.split(',');
                    arr.push({
                      BDID: record.ID,
                      uid: item.uid,
                      fileName: item.name,
                      documentData: urlArr[1],
                    });
                    console.log("[...uploadFileParamsBD,...arr]-arrr000", arr)
                    if (arr.length === fileList.length) {
                      this.setState({
                        uploadFileParamsBD: [...uploadFileParamsBD, ...arr],
                      });
                    }
                  };
                });
              });
            }}
            beforeUpload={(file, fileList) => {
              let arr = [];
              console.log('目前fileList3333', fileList);
              fileList.forEach(item => {
                item.BDID = record.ID;
                let reader = new FileReader(); //实例化文件读取对象
                reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                console.log("item-cccc", item)
                console.log("record.ID", record.ID)
                reader.onload = e => {
                  let urlArr = e.target.result.split(',');
                  arr.push({
                    BDID: record.ID,
                    uid: item.uid,
                    fileName: item.name,
                    documentData: urlArr[1],
                  });
                  console.log("[...uploadFileParamsBD,...arr]-arrr", arr)
                  if (arr.length === fileList.length) {
                    this.setState({
                      uploadFileParamsBD: [...uploadFileParamsBD, ...arr],
                    });
                  }
                };
              });
            }}
            onRemove={(file, fileList) => {
              console.log('file.uid', file.uid);
              let newList = this.state.fileListTempBD
              for (let key in newList) {
                newList[key] = newList[key].filter(item => item.uid !== file.uid)
              }
              let newuploadFileList = this.state.uploadFileParamsBD
              newuploadFileList = newuploadFileList.filter(item => item.uid !== file.uid);
              console.log('fileListTempBD--cc-333', newList);
              console.log('uploadFileParamsBD--cc-333', newuploadFileList);
              this.setState({
                fileListTempBD: newList,
                uploadFileParamsBD: newuploadFileList
              })
            }}
            accept={'*'}
            fileList={fileListTempBD[record.ID]}
          >
            <Button type="dashed">
              <Icon type="upload"/>
              点击上传
            </Button>
          </Upload>
        }
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
          width={'1010px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
            height: '647px',
            overflow: 'hidden',
          }}
          onCancel={this.props.closeModal}
          maskClosable={false}
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
            <strong>硬件中标信息录入</strong>
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
                      multiple={true}
                      onChange={info => {
                        let fileList = [...info.fileList];
                        this.setState({fileList: [...fileList]}, () => {
                          console.log('目前fileList', this.state.fileList);
                          let arr = [];
                          console.log('目前fileList2222', fileList);
                          fileList.forEach(item => {
                            let reader = new FileReader(); //实例化文件读取对象
                            reader.readAsDataURL(item.originFileObj); //将文件读取为 DataURL,也就是base64编码
                            reader.onload = e => {
                              let urlArr = e.target.result.split(',');
                              arr.push({
                                fileName: item.name,
                                documentData: urlArr[1],
                              });
                              console.log('arrarr', arr);
                              if (arr.length === fileList.length) {
                                this.setState({
                                  uploadFileParams: [...arr],
                                });
                              }
                            };
                          });
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
                        let arr = [];
                        console.log('目前fileList2222', fileList);
                        fileList.forEach(item => {
                          let reader = new FileReader(); //实例化文件读取对象
                          reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                          reader.onload = e => {
                            let urlArr = e.target.result.split(',');
                            arr.push({
                              fileName: item.name,
                              documentData: urlArr[1],
                            });
                            if (arr.length === fileList.length) {
                              this.setState({
                                uploadFileParams: [...arr],
                              });
                            }
                          };
                        });
                        console.log('uploadFileParams-cccc', this.state.uploadFileParams);
                      }}
                      onRemove={file => {
                        console.log('file--cc-rrr', file);
                      }}
                      accept={'*'}
                      fileList={[...fileList]}
                    >
                      <Button type="dashed">
                        <Icon type="upload"/>
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
