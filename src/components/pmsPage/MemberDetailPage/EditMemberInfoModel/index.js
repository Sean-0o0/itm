/**
 * 需求发起弹窗页面
 */
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
  Select,
  Spin,
  Radio,
  TreeSelect,
  InputNumber,
  Upload,
  Button,
  Icon,
  Tooltip,
} from 'antd';

const { Option } = Select;
const { TextArea } = Input;
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  FetchQueryGysInZbxx,
  FetchqueryOutsourceRequirement,
  OperateOutsourceRequirements,
  UpdateOutsourceMemberInfo,
} from '../../../../services/pmsServices';
import moment from 'moment';

const getUuid = () => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  let uuid = s.join('');
  return uuid;
};
class EditMemberInfoModel extends React.Component {
  state = {
    isSpinning: true,
    xqid: -1,
    rydjxxJson: [],
    glgys: [],
    uploadFileParams: [],
    fileList: [],
    pbbgTurnRed: false,
    uploadFileParams2: [], //保密协议
    fileList2: [],
    pbbgTurnRed2: false,
  };

  componentDidMount() {
    this.fetchqueryOutsourceRequirement();
    this.fetchQueryGysInZbxx();
    const { data = {} } = this.props;
    console.log('🚀 ~ file: index.js:66 ~ EditMemberInfoModel ~ componentDidMount ~ data:', data);
    if (data.jldata && data.bmxydata) {
      // console.log("jldata", data.jldata)
      let arrTemp = [];
      let arrTemp2 = [];
      arrTemp.push({
        uid: getUuid(),
        name: data.jldata.fileName,
        status: 'done',
        url: data.jldata.url,
        base64: data.jldata.data,
      });
      arrTemp2.push({
        base64: data.jldata.data,
        name: data.jldata.fileName,
      });
      this.setState({
        fileList: arrTemp,
        uploadFileParams: arrTemp2,
        fileList2: [
          {
            uid: getUuid(),
            name: data.bmxydata.fileName,
            status: 'done',
            url: data.bmxydata.url,
            base64: data.bmxydata.data,
          },
        ],
        uploadFileParams2: [
          {
            base64: data.bmxydata.data,
            name: data.bmxydata.fileName,
          },
        ],
      });
    }
  }

  // 查询人员等级信息
  fetchqueryOutsourceRequirement = () => {
    FetchqueryOutsourceRequirement({ xqid: 0, cxlx: 'RYDJ' })
      .then(result => {
        const { code = -1, rydjxx } = result;
        const rydjxxJson = JSON.parse(rydjxx);
        if (code > 0) {
          this.setState({
            rydjxxJson,
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
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
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          this.setState({
            glgys: [...rec],
            isSpinning: false,
          });
        }
      })
      .catch(e => {
        message.error('供应商信息查询失败', 1);
      });
  };

  // 保存数据操作
  handleFormValidate = e => {
    e.preventDefault();
    const _this = this;
    const { operateType = '' } = _this.props;
    console.log('operateType', operateType);
    _this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('rymc') && operateType === 'bjxq') {
          message.warn('请输入人员名称！');
          return;
        }
        if (errs.includes('rydj') && operateType === 'bjxq') {
          message.warn('请选择人员等级！');
          return;
        }
        if (errs.includes('gw') && operateType === 'bjxq') {
          message.warn('请选择岗位！');
          return;
        }
        if (errs.includes('ssgys') && operateType === 'bjxq') {
          message.warn('请选择所属供应商！');
          return;
        }
        // if (errs.includes('syqkh') && operateType === "syqkh") {
        //   message.warn('请选择试用期考核情况！');
        //   return;
        // }
        if (errs.includes('ryzt') && operateType === 'bjxq') {
          message.warn('请选择人员状态！');
          return;
        }
        if (errs.includes('rcsj') && operateType === 'bjxq') {
          message.warn('请选择入场时间！');
          return;
        }
        if (errs.includes('lcsj') && operateType === 'bjxq' && values.ryzt === '4') {
          message.warn('请选择离场时间！');
          return;
        }
        if (errs.includes('jl') && operateType === 'bjxq') {
          message.warn('请上传简历！');
          return;
        }
        if (errs.includes('bmxy') && operateType === 'bjxq') {
          message.warn('请上传保密协议！');
          return;
        }
      }
      if ((operateType === 'syqkh' && values.syqkh === '') || values.syqkh === undefined) {
        message.warn('请选择试用期考核情况！');
        return;
      }
      if (this.state.fileList.length === 0 && operateType === 'bjxq') {
        message.warn('请上传简历！');
        return;
      }
      if (this.state.fileList2.length === 0 && operateType === 'bjxq') {
        message.warn('请上传保密协议！');
        return;
      }
      _this.setState({
        isSpinning: true,
      });
      console.log('kkk', values);
      _this.updateOutsourceMemberInfo(values);
    });
  };

  updateOutsourceMemberInfo = values => {
    console.log('params', this.handleParams(values));
    return UpdateOutsourceMemberInfo(this.handleParams(values))
      .then(result => {
        const { code = -1, record = [] } = result;
        if (code > 0) {
          this.setState({
            isSpinning: false,
          });
          this.props.successCallBack();
          message.success('人员信息编辑完成!');
        }
      })
      .catch(error => {
        this.setState({
          isSpinning: false,
        });
        message.error(!error.success ? error.message : error.note);
      })
      .finally(() => {
        this.setState({
          isSpinning: true,
        });
      });
  };

  handleParams = values => {
    console.log('values', values);
    const { uploadFileParams, uploadFileParams2 } = this.state;
    let fileInfo = [];
    uploadFileParams.map(item => {
      fileInfo.push({ fileName: item.name, data: item.base64 });
    });
    const {
      ryid,
      operateType,
      data: { XMID = '' },
    } = this.props;
    //只编辑试用期考核情况
    let params = {
      //新增传-1 重新发起也传-1
      ryid: Number(ryid),
      syqkh: Number(values.syqkh),
      //UPDATE|修改;UPDATEKHQK|修改试用期考核情况（只需传人员id和试用期考核情况，其他字段不用）;
      czlx: 'UPDATEKHQK',
    };
    //编辑人员详情
    if (operateType === 'bjxq') {
      params = {
        ...params,
        xb: Number(values.xb),
        rymc: values.rymc,
        rydj: Number(values.rydj),
        gw: Number(values.gw),
        ssxm: Number(XMID),
        ssgys: Number(values.ssgys),
        jl: uploadFileParams[0].name,
        fileData: uploadFileParams[0].base64,
        bmxy: uploadFileParams2[0].name,
        bmxyFileData: uploadFileParams2[0].base64,
        ryzt: values.ryzt,
        rcsj: values.rcsj ? Number(values.rcsj?.format('YYYYMMDD')) : undefined,
        lcsj:
          values.ryzt === '4' && values.lcsj ? Number(values.lcsj?.format('YYYYMMDD')) : undefined,
        czlx: 'UPDATE',
      };
    }
    console.log('paramsparams', params);
    return params;
  };

  render() {
    const {
      isSpinning = false,
      fileList = [],
      uploadFileParams = [],
      rydjxxJson = [],
      glgys = [],
      fileList2 = [],
      uploadFileParams2 = [],
    } = this.state;
    const {
      visible,
      closeModal,
      xmmc,
      dictionary = {},
      data: {
        XB = '',
        GYSID = '',
        RYMC = '',
        GWID = '',
        DJID = '',
        SYKHID = '',
        RYZT = '',
        RCSJ = null,
        LCSJ = null,
      },
      operateType = '',
      isDock = false, //是否外包项目对接人
    } = this.props;

    const { KHZT, WBRYGW } = dictionary;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const basicFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <>
        <Modal
          wrapClassName="editMessage-modify xqfq-modal"
          style={{ top: operateType === 'syqkh' ? '40px' : '10px' }}
          width={operateType === 'syqkh' ? '600px' : '880px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={closeModal}
          maskClosable={false}
          footer={
            <div className="modal-footer">
              <Button className="btn-default" onClick={closeModal}>
                取消
              </Button>
              {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
              <Button
                disabled={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={e => this.handleFormValidate(e)}
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
              // marginBottom: '16px',
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '15px',
            }}
          >
            <strong>{operateType === 'syqkh' ? '试用期考核情况编辑' : '人员信息编辑'}</strong>
          </div>
          <Spin spinning={isSpinning} tip="加载中" wrapperClassName="contrast-signing-modal-spin">
            <div style={{ padding: '0 24px' }}>
              <div className="steps-content">
                <React.Fragment>
                  <Form
                    {...basicFormItemLayout}
                    ref={e => (this.basicForm = e)}
                    style={{ width: '98%' }}
                  >
                    <div style={{ margin: '12px 0 0 0' }}>
                      <Row gutter={24} style={{ display: operateType === 'bjxq' ? '' : 'none' }}>
                        <Col span={12}>
                          <Form.Item
                            label="人员名称"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            {getFieldDecorator('rymc', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入人员名称',
                                },
                              ],
                              initialValue: RYMC,
                            })(<Input placeholder="请输入人员名称" />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="性别" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('xb', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择性别',
                                },
                              ],
                              initialValue: XB,
                            })(
                              <Select
                                showSearch
                                allowClear
                                showArrow
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                <Option key={1} value="1">
                                  男
                                </Option>
                                <Option key={2} value="2">
                                  女
                                </Option>
                                {/*<Option key={3} value="3">不详</Option>*/}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{ display: operateType === 'bjxq' ? '' : 'none' }}>
                        <Col span={12}>
                          <Form.Item
                            label="人员等级"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            {getFieldDecorator('rydj', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择人员等级',
                                },
                              ],
                              initialValue: DJID,
                            })(
                              <Select
                                showSearch
                                allowClear
                                showArrow
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {rydjxxJson.length > 0 &&
                                  rydjxxJson.map((item, index) => {
                                    return (
                                      <Option key={index} value={item.RYDJID}>
                                        {item.RYDJ}
                                      </Option>
                                    );
                                  })}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="岗位" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('gw', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择人员岗位',
                                },
                              ],
                              initialValue: GWID,
                            })(
                              <Select
                                showSearch
                                allowClear
                                showArrow
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {WBRYGW.length > 0 &&
                                  WBRYGW.map((item, index) => {
                                    return (
                                      <Option key={index} value={item.ibm}>
                                        {item.note}
                                      </Option>
                                    );
                                  })}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{ display: operateType === 'bjxq' ? '' : 'none' }}>
                        <Col span={12}>
                          <Form.Item
                            label="所属供应商"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            {getFieldDecorator('ssgys', {
                              rules: [
                                {
                                  required: true,
                                  message: '所属供应商',
                                },
                              ],
                              initialValue: GYSID,
                            })(
                              <Select
                                showSearch
                                allowClear
                                showArrow
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {glgys.map((item = {}, ind) => {
                                  return (
                                    <Select.Option key={ind} value={item.id}>
                                      {item.gysmc}
                                    </Select.Option>
                                  );
                                })}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="试用期考核情况"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            {getFieldDecorator('syqkh', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: '试用期考核情况',
                              //   },
                              // ],
                              initialValue: SYKHID,
                            })(
                              <Select
                                showSearch
                                allowClear
                                showArrow
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {KHZT.length > 0 &&
                                  KHZT.map((item, index) => {
                                    return (
                                      <Option key={index} value={item.ibm}>
                                        {item.note}
                                      </Option>
                                    );
                                  })}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{ display: operateType === 'bjxq' ? '' : 'none' }}>
                        {isDock && (
                          <Fragment>
                            <Col span={12}>
                              <Form.Item
                                label="人员状态"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                              >
                                {getFieldDecorator('ryzt', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择人员状态',
                                    },
                                  ],
                                  initialValue: RYZT,
                                })(
                                  <Select
                                    showSearch
                                    allowClear
                                    showArrow
                                    filterOption={(input, option) =>
                                      option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    <Option key={1} value="1">
                                      正常
                                    </Option>
                                    <Option key={2} value="4">
                                      离场
                                    </Option>
                                  </Select>,
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                label="入场时间"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                              >
                                {getFieldDecorator('rcsj', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择入场时间',
                                    },
                                  ],
                                  initialValue: RCSJ,
                                })(
                                  <DatePicker
                                    style={{ width: '100%' }}
                                    allowClear
                                    // placeholder="请选择入场时间"
                                  />,
                                )}
                              </Form.Item>
                            </Col>
                            {getFieldValue('ryzt') === '4' && (
                              <Col span={12}>
                                <Form.Item
                                  label="离场时间"
                                  labelCol={{ span: 8 }}
                                  wrapperCol={{ span: 16 }}
                                >
                                  {getFieldDecorator('lcsj', {
                                    rules: [
                                      {
                                        required: true,
                                        message: '请选择离场时间',
                                      },
                                    ],
                                    initialValue: RYZT === '4' ? LCSJ : null,
                                  })(
                                    <DatePicker
                                      style={{ width: '100%' }}
                                      allowClear
                                      // placeholder="请选择离场时间"
                                    />,
                                  )}
                                </Form.Item>
                              </Col>
                            )}
                          </Fragment>
                        )}
                        <Col span={12}>
                          <Form.Item
                            label="简历:"
                            colon={false}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            {getFieldDecorator('jl', {
                              rules: [
                                {
                                  required: true,
                                  message: '请上传简历',
                                },
                              ],
                              initialValue: fileList,
                            })(
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
                                // multiple={true}
                                onChange={info => {
                                  let fileList = [...info.fileList];
                                  fileList = fileList.slice(-1);
                                  this.setState({ fileList });
                                  console.log('fileListfileList', fileList);
                                  let newArr = [];
                                  if (
                                    fileList.filter(item => item.originFileObj !== undefined)
                                      .length === 0
                                  ) {
                                    fileList.forEach(item => {
                                      newArr.push({
                                        name: item.name,
                                        base64: item.base64,
                                      });
                                    });
                                    if (newArr.length === fileList.length) {
                                      this.setState({
                                        uploadFileParams: [...newArr],
                                      });
                                    }
                                  } else {
                                    fileList.forEach(item => {
                                      console.log('item.originFileObj', item.originFileObj);
                                      if (item.originFileObj === undefined) {
                                        newArr.push({
                                          name: item.name,
                                          base64: item.base64,
                                        });
                                      } else {
                                        let reader = new FileReader(); //实例化文件读取对象
                                        reader.readAsDataURL(item.originFileObj); //将文件读取为 DataURL,也就是base64编码
                                        reader.onload = e => {
                                          let urlArr = e.target.result.split(',');
                                          newArr.push({
                                            name: item.name,
                                            base64: urlArr[1],
                                          });
                                          if (newArr.length === fileList.length) {
                                            this.setState({
                                              uploadFileParams: [...newArr],
                                            });
                                          }
                                        };
                                      }
                                    });
                                  }

                                  this.setState({
                                    fileList,
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
                                  console.log('目前file', file);
                                  console.log('目前fileList2222', fileList);
                                  console.log('目前fileList333', this.props.fileList);
                                  fileList.forEach(item => {
                                    let reader = new FileReader(); //实例化文件读取对象
                                    reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                                    reader.onload = e => {
                                      let urlArr = e.target.result.split(',');
                                      arr.push({
                                        name: item.name,
                                        base64: urlArr[1],
                                      });
                                      if (arr.length === fileList.length) {
                                        // console.log('arrarrarr', arr);
                                        this.setState({
                                          uploadFileParams: [...arr, ...uploadFileParams],
                                        });
                                      }
                                    };
                                  });
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
                              </Upload>,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="保密协议:"
                            colon={false}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                          >
                            {getFieldDecorator('bmxy', {
                              rules: [
                                {
                                  required: true,
                                  message: '请上传保密协议',
                                },
                              ],
                              initialValue: fileList2,
                            })(
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
                                // multiple={true}
                                onChange={info => {
                                  let fileList = [...info.fileList];
                                  fileList = fileList.slice(-1);
                                  this.setState({ fileList2: fileList });
                                  console.log('fileListfileList', fileList);
                                  let newArr = [];
                                  if (
                                    fileList.filter(item => item.originFileObj !== undefined)
                                      .length === 0
                                  ) {
                                    fileList.forEach(item => {
                                      newArr.push({
                                        name: item.name,
                                        base64: item.base64,
                                      });
                                    });
                                    if (newArr.length === fileList.length) {
                                      this.setState({
                                        uploadFileParams2: [...newArr],
                                      });
                                    }
                                  } else {
                                    fileList.forEach(item => {
                                      console.log('item.originFileObj', item.originFileObj);
                                      if (item.originFileObj === undefined) {
                                        newArr.push({
                                          name: item.name,
                                          base64: item.base64,
                                        });
                                      } else {
                                        let reader = new FileReader(); //实例化文件读取对象
                                        reader.readAsDataURL(item.originFileObj); //将文件读取为 DataURL,也就是base64编码
                                        reader.onload = e => {
                                          let urlArr = e.target.result.split(',');
                                          newArr.push({
                                            name: item.name,
                                            base64: urlArr[1],
                                          });
                                          if (newArr.length === fileList.length) {
                                            this.setState({
                                              uploadFileParams2: [...newArr],
                                            });
                                          }
                                        };
                                      }
                                    });
                                  }

                                  this.setState({
                                    fileList2: fileList,
                                  });
                                  if (fileList.length === 0) {
                                    this.setState({
                                      pbbgTurnRed2: true,
                                    });
                                  } else {
                                    this.setState({
                                      pbbgTurnRed2: false,
                                    });
                                  }
                                }}
                                beforeUpload={(file, fileList) => {
                                  let arr = [];
                                  console.log('目前file', file);
                                  console.log('目前fileList2222', fileList);
                                  console.log('目前fileList333', this.props.fileList);
                                  fileList.forEach(item => {
                                    let reader = new FileReader(); //实例化文件读取对象
                                    reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                                    reader.onload = e => {
                                      let urlArr = e.target.result.split(',');
                                      arr.push({
                                        name: item.name,
                                        base64: urlArr[1],
                                      });
                                      if (arr.length === fileList.length) {
                                        // console.log('arrarrarr', arr);
                                        this.setState({
                                          uploadFileParams2: [...arr, ...uploadFileParams2],
                                        });
                                      }
                                    };
                                  });
                                }}
                                accept={
                                  '.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                }
                                fileList={[...fileList2]}
                              >
                                <Button type="dashed">
                                  <Icon type="upload" />
                                  点击上传
                                </Button>
                              </Upload>,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      {/* <Row gutter={24} > */}
                      {/* </Row> */}
                      <Row gutter={24} style={{ display: operateType === 'syqkh' ? '' : 'none' }}>
                        <Col span={24}>
                          <Form.Item
                            label={
                              <span>
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
                                试用期考核情况
                              </span>
                            }
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                          >
                            {getFieldDecorator('syqkh', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: '试用期考核情况',
                              //   },
                              // ],
                              initialValue: SYKHID,
                            })(
                              <Select
                                showSearch
                                allowClear
                                showArrow
                                filterOption={(input, option) =>
                                  option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {KHZT.length > 0 &&
                                  KHZT.map((item, index) => {
                                    return (
                                      <Option key={index} value={item.ibm}>
                                        {item.note}
                                      </Option>
                                    );
                                  })}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                  {/*</Form>*/}
                </React.Fragment>
              </div>
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(EditMemberInfoModel));
