/**
 * 合同签署流程发起弹窗页面
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
} from 'antd';

const { Option } = Select;
import React from 'react';
import { connect } from 'dva';
import { FetchQueryGysInZbxx, IndividuationGetOAResult } from '../../../../services/pmsServices';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import moment from 'moment';
import RichTextEditor from './RichTextEditor';
import { FetchQueryOrganizationInfo } from '../../../../services/projectManage';
import AssociatedFile from '../AssociatedFile';

class ContractSigning extends React.Component {
  state = {
    isSpinning: false,
    isSelectorOpen: false,
    addGysModalVisible: false,
    associatedFileVisible: false,
    pbbgTurnRed: true,
    fileList: [],
    uploadFileParams: {
      columnName: '',
      documentData: '',
      fileLength: '',
      fileName: '',
      filePath: '',
      id: 0,
      objectName: '',
    },
    // 基本信息是否折叠
    basicInfoCollapse: false,
    //合同信息是否折叠
    contractInfoCollapse: false,
    //附件信息是否折叠
    attachmentInfoCollapse: false,
    //关联流程是否折叠
    flowInfoCollapse: false,
    //紧急程度
    LCJJCD: [],
    //印章类型
    YZLX: [],
    loginUser: {},
    //表单信息
    // contractSigningFormInfo:{
    //   bm:'',
    //   BGRQ:'',
    //   ngr:'',
    //   lb:'',
    //   title:'',
    //   urgent:'',
    //   gys:'',
    //   htbh:'',
    //   HTMBLX:'',
    //   je:0,
    //   YZLX:'',
    //   YT:'',
    //   QSBGNR:'',
    //   filerela:"",
    // }
    processListData: [],
  };

  componentDidMount() {
    this.fetchQueryGysInZbxx();
    this.fetchQueryOrganizationInfo();
  }

  // 查询组织机构信息
  fetchQueryOrganizationInfo() {
    return FetchQueryOrganizationInfo({
      type: 'ZZJG',
    })
      .then(result => {
        const { code = -1, record = [] } = result;
        if (code > 0) {
          const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
          loginUser.id = String(loginUser.id);
          record.forEach(e => {
            // 获取登录用户的部门名称
            if (String(e.orgId) === String(loginUser.org)) {
              loginUser.orgName = e.orgName;
            }
          });
          this.setState({
            loginUser: loginUser,
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 查询供应商下拉列表
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
          gysData: [...rec],
        });
      }
    });
  };

  OnGysSuccess = () => {
    this.setState({ addGysModalVisible: false });
    this.fetchQueryGysInZbxx();
  };

  // 保存数据操作
  handleFormValidate = e => {
    e.preventDefault();
    const { currentXmid, currentXmmc } = this.props;
    console.log('currentXmid', currentXmid);
    console.log('currentXmmc', currentXmmc);
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('BGRQ')) {
          message.warn('请选择报告日期！');
          return;
        }
        if (errs.includes('title')) {
          message.warn('请输入标题！');
          return;
        }
        if (errs.includes('urgent')) {
          message.warn('请选择紧急程度！');
          return;
        }
        if (errs.includes('HTMBLX')) {
          message.warn('请选择合同模版类型！');
          return;
        }
        if (errs.includes('je')) {
          message.warn('请输入合同金额！');
          return;
        }
        if (errs.includes('YZLX')) {
          message.warn('请选择印章类型！');
          return;
        }
        if (errs.includes('YT')) {
          message.warn('请输入用途！');
          return;
        }
        if (errs.includes('QSBGNR')) {
          message.warn('请输入请示报告内容！');
          return;
        }
      } else {
        if (_this.state.pbbgTurnRed) {
          message.warn('请上传合同附件！');
          return;
        } else {
          _this.setState({
            isSpinning: true
          })
          _this.individuationGetOAResult(values);
        }
      }
    });
  };

  //发起流程到oa
  individuationGetOAResult = values => {
    // console.log("params", this.handleParams(values))
    return IndividuationGetOAResult(this.handleParams(values))
      .then(result => {
        const { code = -1, record = [] } = result;
        if (code > 0) {
          this.setState({
            isSpinning: false
          })
          this.props.closeContractModal();
          this.props.onSuccess('合同签署');
        }
      })
      .catch(error => {
        this.setState({
          isSpinning: false
        })
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleParams = values => {
    const { uploadFileParams, processListData } = this.state;
    const { currentXmid, currentXmmc } = this.props;
    const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
    loginUser.id = String(loginUser.id);
    let arr = [];
    arr = processListData?.map(item => {
      return item?.id;
    });
    //表单数据
    const formdata = {
      extinfo: {
        busdata: {
          BGRQ: moment(values.BGRQ).format('YYYYMMDD'), // 报告日期
          QSBGNR: values.QSBGNR, //请示报告内容
          LB: '1', //固定传1
          HTMBLX: values.HTMBLX, //合同模板类型id
          YZLX: String(values.YZLX), //印章类型字典id，多个用,隔开
          YT: values.YT, //用途
          BM1: '', //传空
          BM2: '', //传空
          NGR1: '', //传空
          NGR2: '', //传空
        },
      },
      //关联文件id，数组形式，多个id用“,”隔开，比如[102,102]
      filerela: arr,
      issend: 1, //是否直接送审，固定传1
      je: values.je, //金额
      loginname: loginUser.loginName, //登录用户userid
      title: values.title, //标题
      urgent: Number(values.urgent), //紧急程度id
    };
    //附件数据
    const attachments = [];
    let att = {};
    if (uploadFileParams !== {} && uploadFileParams !== undefined) {
      att = {
        content: uploadFileParams.documentData,
        nrtitle: uploadFileParams.fileName,
        nrtype: '1',
        filetype: '合同',
      };
    }
    attachments.push(att);
    const flowdata = {
      zt: currentXmmc + '合同签署流程', // 主题，格式为：项目名称+合同签署流程
      xmmc: String(currentXmid), //项目的id
      bm: String(loginUser.org), //部门id
      gys: values.gys, //供应商的id
    };
    const params = {
      objectclass: '合同签署流程',
      formdata: JSON.stringify(formdata),
      attachments,
      flowdata: JSON.stringify(flowdata),
    };
    return params;
  };

  //关联文件 - 打开
  handleAssociateFileOpen = () => {
    this.setState({ associatedFileVisible: true });
  };
  //关联文件 - 确认
  handleAssociateFileConfirm = (data = []) => {
    this.setState({
      associatedFileVisible: false,
      processListData: [...data],
    });
  };
  //关联流程 - 点击
  handleProcessItemClick = id => {
    window.open(
      'http://10.52.130.12/ZSZQOA/getURLSyncBPM.do?_BPM_FUNCCODE=C_FormSetFormData&_mode=4&_form_control_design=LABEL&_tf_file_id=' +
        id,
    );
  };
  //关联流程 - 删除
  handleProcessItemDelete = id => {
    this.setState({
      associatedFileVisible: false,
      processListData: [...data],
    });
  };

  render() {
    const {
      isSpinning = false,
      isSelectorOpen = false,
      gysData = [],
      addGysModalVisible = false,
      pbbgTurnRed = true,
      fileList = [],
      basicInfoCollapse = false,
      contractInfoCollapse = false,
      attachmentInfoCollapse = false,
      flowInfoCollapse = false,
      loginUser = {},
      associatedFileVisible,
      processListData,
    } = this.state;
    const {
      contractSigningVisible,
      xmbh,
      dictionary: { LCJJCD = [], YZLX = [] },
    } = this.props;
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
    const addGysModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新增供应商',
      width: '120rem',
      height: '90rem',
      style: { top: '20rem' },
      visible: addGysModalVisible,
      footer: null,
    };
    return (
      <>
        {/*供应商弹窗*/}
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
        {associatedFileVisible && (
          <AssociatedFile
            associatedFileVisible={associatedFileVisible}
            onConfirm={data => this.handleAssociateFileConfirm(data)}
            closeAssociatedFileModal={() => this.setState({ associatedFileVisible: false })}
            onSuccess={() => this.onSuccess('关联文件')}
            xmbh={xmbh}
          ></AssociatedFile>
        )}
        <Modal
          wrapClassName="editMessage-modify"
          style={{top: '10px'}}
          width={'860px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={this.props.closeContractModal}
          footer={<div className="modal-footer">
            <Button className="btn-default" onClick={this.props.closeContractModal}>
              取消
            </Button>
            {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
            <Button disabled={isSpinning} className="btn-primary" type="primary"
                    onClick={e => this.handleFormValidate(e)}>
              确定
            </Button>
          </div>}
          visible={contractSigningVisible}
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
            <strong>合同签署流程发起</strong>
          </div>
          <Spin spinning={isSpinning} style={{position: 'fixed'}} tip="加载中" size="large"
                wrapperClassName="contrast-signing-modal-spin">
            <div style={{padding: '0 3.5712rem'}}>
              <div className="steps-content">
                <React.Fragment>
                  <Form
                    {...basicFormItemLayout}
                    ref={e => (this.basicForm = e)}
                    style={{width: '98%'}}
                  >
                    <div className="title" style={{borderBottom: '1px solid #F1F1F1'}}>
                      <Icon
                        type={basicInfoCollapse ? 'caret-right' : 'caret-down'}
                        onClick={() => this.setState({ basicInfoCollapse: !basicInfoCollapse })}
                        style={{ fontSize: '2rem', cursor: 'pointer' }}
                      />
                      <span style={{ paddingLeft: '1.5rem', fontSize: '3rem', color: '#3461FF' }}>
                        基本信息
                      </span>
                    </div>
                    {!basicInfoCollapse && (
                      <div style={{ margin: '2rem 0 0 0' }}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item label="部门">
                              <Input
                                placeholder="请输入部门"
                                disabled={true}
                                value={loginUser.orgName}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="报告日期">
                              {getFieldDecorator('BGRQ', {
                                initialValue: moment(),
                                rules: [
                                  {
                                    required: true,
                                    message: '报告日期不允许空值',
                                  },
                                ],
                              })(<DatePicker style={{ width: '100%' }} />)}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item label="拟稿人">
                              <Input
                                placeholder="请输入拟稿人"
                                disabled={true}
                                value={loginUser.name}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="类别">
                              <Input
                                placeholder="请输入类别"
                                disabled={true}
                                value="总部部门发起"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item label="标题">
                              {getFieldDecorator('title', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入标题',
                                  },
                                ],
                                initialValue: '',
                              })(<Input placeholder="请输入标题" />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="紧急程度">
                              {getFieldDecorator('urgent', {
                                // initialValue: "一般"
                                rules: [
                                  {
                                    required: true,
                                    message: '紧急程度不允许空值',
                                  },
                                ],
                              })(
                                // <Select showSearch
                                //         filterOption={(input, option) =>
                                //           option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                //         }>
                                //   {
                                //     LCJJCD.length > 0 && LCJJCD.map((item, index) => {
                                //       return (
                                //         <Option key={index} value={item.ibm}>{item.note}</Option>
                                //       )
                                //     })
                                //   }
                                // </Select>
                                <Radio.Group>
                                  {LCJJCD.length > 0 &&
                                    LCJJCD.map((item, index) => {
                                      return <Radio value={item.ibm}>{item.note}</Radio>;
                                    })}
                                </Radio.Group>,
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    )}

                    <div className="title" style={{ borderBottom: '1px solid #F1F1F1' }}>
                      <Icon
                        type={contractInfoCollapse ? 'caret-right' : 'caret-down'}
                        onClick={() =>
                          this.setState({ contractInfoCollapse: !contractInfoCollapse })
                        }
                        style={{ fontSize: '2rem', cursor: 'pointer' }}
                      />
                      <span style={{ paddingLeft: '1.5rem', fontSize: '3rem', color: '#3461FF' }}>
                        合同信息
                      </span>
                    </div>
                    {!contractInfoCollapse && (
                      <div style={{ margin: '2rem 0 0 0' }}>
                        <Row gutter={24}>
                          <Col span={12} style={{display: 'flex', position: 'relative'}}>
                            <Form.Item label="供应商" style={{width: '100%'}}>
                              {getFieldDecorator('gys', {
                                // initialValue: '1',
                                // rules: [
                                //   {
                                //     required: true,
                                //     message: '供应商不允许空值',
                                //   },
                                // ],
                              })(
                                <Select
                                  style={{ width: '100%', borderRadius: '8px !important' }}
                                  placeholder="请选择供应商"
                                  className="skzh-box"
                                  showSearch
                                  allowClear
                                  open={isSelectorOpen}
                                  onDropdownVisibleChange={visible =>
                                    this.setState({ isSelectorOpen: visible })
                                  }
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {gysData?.map((item = {}, ind) => {
                                    return (
                                      <Option key={ind} value={item.id}>
                                        {item.gysmc}
                                      </Option>
                                    );
                                  })}
                                </Select>,
                              )}
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
                                right: '50px',
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
                                right: '22px',
                                color: '#c7c7c7',
                                fontSize: '20px',
                              }}
                            />
                          </Col>
                          <Col span={12} className="glys">
                            <Form.Item label="合同编号">
                              <Input placeholder="请输入合同编号" disabled={true}/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item label="合同模版类型">
                              {getFieldDecorator('HTMBLX', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请选择合同模版类型',
                                  },
                                ],
                                initialValue: '1',
                              })(
                                <Radio value={1} disabled defaultChecked>
                                  非模版合同
                                </Radio>,
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="合同金额">
                              {getFieldDecorator('je', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入合同金额',
                                  },
                                ],
                                // initialValue: "外采项目"
                              })(<Input placeholder="请输入合同金额" />)}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item label="印章类型">
                              {getFieldDecorator('YZLX', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请选择印章类型',
                                  },
                                ],
                                // initialValue: "外采项目"
                              })(
                                <Select
                                  showSearch
                                  showArrow={true}
                                  defaultValue={1}
                                  mode="multiple"
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {YZLX.length > 0 &&
                                    YZLX.map((item, index) => {
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
                        <Row gutter={24}>
                          <Col span={24}>
                            <Form.Item
                              label="用途"
                              labelCol={{ span: 4 }}
                              wrapperCol={{ span: 20 }}
                            >
                              {getFieldDecorator('YT', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入用途',
                                  },
                                ],
                                // initialValue: "外采项目"
                              })(<Input placeholder="请输入用途" />)}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={24}>
                            <Form.Item
                              label="请示报告内容"
                              labelCol={{ span: 4 }}
                              wrapperCol={{ span: 20 }}
                            >
                              {getFieldDecorator('QSBGNR', {
                                rules: [
                                  {
                                    required: true,
                                    message: '请输入请示报告内容',
                                  },
                                ],
                                // initialValue: "外采项目"
                              })(
                                <RichTextEditor className="w-e-menu w-e-text-container w-e-toolbar" />,
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    )}

                    <div className="title" style={{ borderBottom: '1px solid #F1F1F1' }}>
                      <Icon
                        type={attachmentInfoCollapse ? 'caret-right' : 'caret-down'}
                        onClick={() =>
                          this.setState({ attachmentInfoCollapse: !attachmentInfoCollapse })
                        }
                        style={{ fontSize: '2rem', cursor: 'pointer' }}
                      />
                      <span style={{ paddingLeft: '1.5rem', fontSize: '3rem', color: '#3461FF' }}>
                        附件
                      </span>
                    </div>
                    {!attachmentInfoCollapse && (
                      <div style={{ margin: '2rem 0 0 0' }}>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item
                              label="合同"
                              required
                              // help={pbbgTurnRed ? '请上传合同附件' : ''}
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
                                  console.log('fileList', fileList);
                                  console.log('uploadFileParams', this.state.uploadFileParams);
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
                                    // console.log('文件读取成功完成时触发', e.target.result.split(','));
                                    let urlArr = e.target.result.split(',');
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
                      </div>
                    )}

                    <div className="title" style={{ borderBottom: '1px solid #F1F1F1' }}>
                      <Icon
                        type={flowInfoCollapse ? 'caret-right' : 'caret-down'}
                        onClick={() => this.setState({ flowInfoCollapse: !flowInfoCollapse })}
                        style={{ fontSize: '2rem', cursor: 'pointer' }}
                      />
                      <span style={{ paddingLeft: '1.5rem', fontSize: '3rem', color: '#3461FF' }}>
                        关联流程
                      </span>
                      <Icon
                        type="plus-circle"
                        theme="filled"
                        onClick={() => this.handleAssociateFileOpen()}
                        style={{ color: '#3461FF', paddingLeft: '1rem', fontSize: '3rem' }}
                      />
                    </div>
                    <div style={{ overflow: 'hidden', overflowY: 'auto', maxHeight: '52.08rem' }}>
                      {!flowInfoCollapse &&
                        processListData.map((item, index) => (
                          <div style={{ margin: '2rem 7rem' }} key={index}>
                            <Row gutter={24}>
                              <Col
                                span={24}
                                className="contract-signing-process-item"
                                style={{ display: 'flex' }}
                              >
                                <a
                                  style={{ color: '#3361ff', marginRight: '1.2rem' }}
                                  F
                                  onClick={() => this.handleProcessItemClick(item.id)}
                                >
                                  {item?.title}
                                </a>
                                <Popconfirm
                                  title="确定要删除吗?"
                                  onConfirm={() => {
                                    const dataSource = [...processListData];
                                    this.setState({
                                      processListData: dataSource.filter(x => x.id !== item.id),
                                    });
                                  }}
                                >
                                  <a>
                                    <Icon style={{ color: 'red' }} type="close" />
                                  </a>
                                </Popconfirm>
                              </Col>
                            </Row>
                          </div>
                        ))}
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
}))(Form.create()(ContractSigning));
