/**
 * 邮件发送弹窗页面
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
  Icon, Divider,
} from 'antd';

const {Option} = Select;
import React from 'react';
import {connect} from 'dva';
import {IndividuationGetOAResult, QueryEmail, SendMail} from '../../../services/pmsServices';
import moment from 'moment';
import RichTextEditor from './RichTextEditor';
import BridgeModel from "../../Common/BasicModal/BridgeModel";

class SendMailModal extends React.Component {
  state = {
    isSpinning: true,
    uploadFileParams: [],
    mailFileList: [],
    pbbgTurnRed: false,
    //所有邮箱数据
    mailDataAll: [],
    //收件人/抄送人邮箱数据
    mailData: [],
    //默认发件人
    contactsID: "",
    //收件人
    sjrFocus: false,
    //抄送人
    csFocus: false,
    //新增收件人弹窗
    addMailModalVisible: false,
    //弹窗标题
    title: "新增收件人"
  };

  componentDidMount() {
    this.queryEmail();
  }

  queryEmail = () => {
    const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
    loginUser.id = String(loginUser.id);
    return QueryEmail({
      queryType: "ALL",
    })
      .then(result => {
        const {code = -1, record = []} = result;
        console.log("record", record)
        if (code > 0) {
          this.setState({
            isSpinning: false,
            mailDataAll: [...record],
            mailData: [...record.filter(item => item.emailType === "2")],
            contactsID: record.filter(item => String(item.contactsID) === String(loginUser.id))[0]?.email
          })
        }
      })
      .catch(error => {
        this.setState({
          isSpinning: false
        })
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 保存数据操作
  handleFormValidate = e => {
    e.preventDefault();
    const {currentXmid, currentXmmc, xmjbxxRecord} = this.props;
    console.log('currentXmid', currentXmid);
    console.log('currentXmmc', currentXmmc);
    const _this = this;
    _this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('FJR')) {
          message.warn('请输入发件人！');
          return;
        }
        if (errs.includes('SJR')) {
          message.warn('请选择邮件收件人！');
          return;
        }
        // if (errs.includes('CS')) {
        //   message.warn('请选择邮件抄送人！');
        //   return;
        // }
        if (errs.includes('ZT')) {
          message.warn('请输入邮件主题！');
          return;
        }
        if (errs.includes('NR')) {
          message.warn('请输入邮件内容！');
          return;
        }
      } else {
        _this.sendMail(values);
      }
    });
  };

  //发起流程到oa
  sendMail = values => {
    // console.log("params", this.handleParams(values))
    // return;
    this.setState({
      isSpinning: true
    })
    return SendMail(this.handleParams(values))
      .then(result => {
        const {code = -1, record = []} = result;
        if (code > 0) {
          this.setState({
            isSpinning: false
          })
          //关闭弹窗
          this.props.closeContractModal();
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
    const {uploadFileParams} = this.state;
    const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
    loginUser.id = String(loginUser.id);
    let fileInfo = [];
    uploadFileParams.map(item => {
      fileInfo.push({fileName: item.name, data: item.base64});
    });
    //邮箱正则校验
    const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
    let access = String(values.SJR).replaceAll(",", ";")
    const accessArr = access.split(';');
    if (accessArr.filter(item => reg.test(item) === false).length > 0) {
      message.warn("请输入正确格式的接收人邮箱！")
      return;
    }
    let others = ""
    let othersArr;
    // console.log("values.CS",values.CS)
    if (values.CS !== "" && values.CS !== undefined) {
      others = String(values.CS).replaceAll(",", ";")
      othersArr = others.split(';');
    }
    // console.log("othersArr",othersArr)
    if (othersArr.length > 0) {
      if (othersArr.filter(item => reg.test(item) === false).length > 0) {
        message.warn("请输入正确格式的抄送人邮箱！")
        return;
      }
    }
    //表单数据
    const params = {
      access,
      content: values.NR,
      others,
      sender: values.FJR,
      title: values.ZT,
      fileInfo: [...fileInfo],
    };
    console.log("邮件发送参数{}", params)
    return params;
  };


  render() {
    const {
      isSpinning = false,
      mailFileList = [],
      mailData = [],
      mailDataAll = [],
      csFocus = false,
      sjrFocus = false,
      addMailModalVisible = false,
      title = "",
      contactsID = "",
    } = this.state;
    const {
      visible,
      dictionary: {},
      closeModal
    } = this.props;
    const {getFieldDecorator,} = this.props.form;

    const editMessageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '40%',
      height: '350px',
      title: title,
      style: {top: '40px'},
      visible: addMailModalVisible,
      footer: null,
    };

    const addMailModalUrl = `${localStorage.getItem('livebos') || ''}/OperateProcessor?operate=TWBGL_YXXXB_ADD&Table=TWBGL_YXXXB`;

    return (
      <>
        {/*修改密码*/}
        {
          addMailModalVisible &&
          <BridgeModel
            modalProps={editMessageModalProps}
            onSucess={() => this.onSuccess('新增收件人')}
            onCancel={() => this.setState({
              addMailModalVisible: false
            })}
            src={addMailModalUrl}
          />
        }
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
          onCancel={closeModal}
          maskClosable={false}
          footer={<div className="modal-footer">
            <Button className="btn-default" onClick={closeModal}>
              取消
            </Button>
            {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
            <Button disabled={isSpinning} className="btn-primary" type="primary"
                    onClick={e => this.handleFormValidate(e)}>
              发送
            </Button>
          </div>}
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
            <strong>邮件发送</strong>
          </div>
          <Spin spinning={isSpinning} style={{position: 'fixed'}} tip="加载中" size="large"
                wrapperClassName="sendMail-box-spin">
            <div style={{padding: '0 24px 24px 24px'}}>
              <div className="sendMail-box">
                <React.Fragment>
                  <Form
                    ref={e => (this.basicForm = e)}
                  >
                    <div style={{margin: '12px 0 0 0'}}>
                      <Row gutter={24} style={{height: 'auto'}}>
                        <Col span={24} style={{height: '100%'}}>
                          <Form.Item
                            label="发件人"
                            labelCol={{span: 2}}
                            wrapperCol={{span: 22}}
                          >
                            {getFieldDecorator('FJR', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择发件人',
                                },
                              ],
                              initialValue: contactsID || "zhukantest@stocke.com.cn"
                            })(<Select
                              showSearch
                              allowClear
                              className="fjr-select"
                              disabled={true}
                              // mode='multiple'
                              showArrow={false}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {mailDataAll.length > 0 &&
                              mailDataAll.map((item, index) => {
                                return (
                                  <Option key={index} value={item.email}>
                                    {item.email}
                                  </Option>
                                );
                              })}
                            </Select>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider style={{margin: '2px 0'}}/>
                      <Row gutter={24} style={{height: 'auto'}}>
                        <Col span={24} style={{height: '100%'}}>
                          <Form.Item
                            label="收件人"
                            labelCol={{span: 2}}
                            wrapperCol={{span: 22}}
                          >
                            {getFieldDecorator('SJR', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择收件人',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<Select
                              showSearch
                              allowClear
                              mode="tags"
                              tokenSeparators={[',']}
                              showArrow={false}
                              className="sandmail-box-clear"
                              onFocus={() => {
                                this.setState({
                                  sjrFocus: true
                                })
                              }}
                              onBlur={() => {
                                this.setState({
                                  sjrFocus: false
                                })
                              }}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {mailData.length > 0 &&
                              mailData.map((item, index) => {
                                return (
                                  <Option key={index} value={item.email}>
                                    {item.email}
                                  </Option>
                                );
                              })}
                            </Select>)}
                          </Form.Item>
                          <div
                            style={{
                              display: sjrFocus ? '' : 'none',
                              height: '20px',
                              width: '1px',
                              backgroundColor: '#c7c7c7',
                              // marginLeft: '8px',
                              marginTop: '11px',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '0',
                              right: '39px',
                            }}
                          ></div>
                          <i
                            className="iconfont circle-add"
                            onClick={() => {
                              this.setState({
                                addMailModalVisible: true,
                                title: "新增收件人",
                              });
                            }}
                            style={{
                              display: sjrFocus ? '' : 'none',
                              marginTop: '6px',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '0',
                              right: '15px',
                              color: '#c7c7c7',
                              fontSize: '20px',
                            }}
                          />
                        </Col>
                      </Row>
                      <Divider style={{margin: '2px 0'}}/>
                      <Row gutter={24} style={{height: 'auto'}}>
                        <Col span={24} style={{height: '100%'}}>
                          <Form.Item
                            label="抄送"
                            labelCol={{span: 2}}
                            wrapperCol={{span: 22}}
                          >
                            {getFieldDecorator('CS', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: '请选择抄送人',
                              //   },
                              // ],
                              // initialValue: "外采项目"
                            })(<Select
                              showSearch
                              allowClear
                              mode="tags"
                              tokenSeparators={[',']}
                              showArrow={false}
                              onFocus={() => {
                                this.setState({
                                  csFocus: true
                                })
                              }}
                              onBlur={() => {
                                this.setState({
                                  csFocus: false
                                })
                              }}
                              className="sandmail-box-clear"
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {mailData.length > 0 &&
                              mailData.map((item, index) => {
                                return (
                                  <Option key={index} value={item.email}>
                                    {item.email}
                                  </Option>
                                );
                              })}
                            </Select>)}
                          </Form.Item>
                          <div
                            style={{
                              display: csFocus ? "" : "none",
                              height: '20px',
                              width: '1px',
                              backgroundColor: '#c7c7c7',
                              // marginLeft: '8px',
                              marginTop: '11px',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '0',
                              right: '39px',
                            }}
                          ></div>
                          <i
                            className="iconfont circle-add"
                            onClick={() => {
                              this.setState({
                                addMailModalVisible: true,
                                title: "新增抄送人",
                              });
                            }}
                            style={{
                              display: csFocus ? "" : "none",
                              marginTop: '6px',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '0',
                              right: '15px',
                              color: '#c7c7c7',
                              fontSize: '20px',
                            }}
                          />
                        </Col>
                      </Row>
                      <Divider style={{margin: '2px 0'}}/>
                      <Row gutter={24} style={{height: 'auto'}}>
                        <Col span={24} style={{height: '100%'}}>
                          <Form.Item
                            label="主题"
                            labelCol={{span: 2}}
                            wrapperCol={{span: 22}}
                          >
                            {getFieldDecorator('ZT', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入主题',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<Input style={{border: 'none'}}/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider style={{margin: '2px 0'}}/>
                      <Row gutter={24} style={{paddingTop: '6px'}}>
                        <Col span={24}>
                          <Form.Item
                            label="附件:"
                            colon={false}
                            labelCol={{span: 2}}
                            wrapperCol={{span: 22}}
                          >
                            {getFieldDecorator('FJ', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: '请输入主题',
                              //   },
                              // ],
                              // initialValue: "外采项目"
                            })(<Upload
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
                                this.setState({mailFileList: [...fileList]}, () => {
                                  console.log('目前fileList', this.state.mailFileList);
                                  let arr = [];
                                  console.log('目前fileList2222', fileList);
                                  fileList.forEach(item => {
                                    let reader = new FileReader(); //实例化文件读取对象
                                    reader.readAsDataURL(item.originFileObj); //将文件读取为 DataURL,也就是base64编码
                                    reader.onload = e => {
                                      let urlArr = e.target.result.split(',');
                                      arr.push({
                                        name: item.name,
                                        base64: urlArr[1],
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
                                      name: item.name,
                                      base64: urlArr[1],
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
                              accept={
                                '.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                              }
                              fileList={[...mailFileList]}
                            >
                              <Button type="dashed">
                                <Icon type="upload"/>
                                点击上传
                              </Button>
                            </Upload>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{paddingTop: '6px'}}>
                        <Col span={24}>
                          <Form.Item
                            label=""
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}
                          >
                            {getFieldDecorator('NR', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入内容',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(
                              <RichTextEditor className="w-e-menu w-e-text-container w-e-toolbar"/>,
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

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(SendMailModal));
