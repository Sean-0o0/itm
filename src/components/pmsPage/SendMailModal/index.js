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

class SendMailModal extends React.Component {
  state = {
    isSpinning: true,
    uploadFileParams: [],
    mailFileList: [],
    pbbgTurnRed: false,
    mailData: [],
  };

  componentDidMount() {
    this.queryEmail();
  }

  queryEmail = () => {
    return QueryEmail({
      queryType: "ALL",
    })
      .then(result => {
        const {code = -1, record = []} = result;
        console.log("record", record)
        if (code > 0) {
          this.setState({
            isSpinning: false,
            mailData: [...record]
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
        if (errs.includes('CS')) {
          message.warn('请选择邮件抄送人！');
          return;
        }
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
    return SendMail(this.handleParams(values))
      .then(result => {
        const {code = -1, record = []} = result;
        if (code > 0) {
          this.setState({
            isSpinning: false
          })
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
    let access = String(values.SJR).replace(",", ";")
    let others = String(values.CS).replace(",", ";")
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
    } = this.state;
    const {
      visible,
      dictionary: {},
      closeModal
    } = this.props;
    const {getFieldDecorator,} = this.props.form;
    const basicFormItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (
      <>
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
                              // initialValue: "外采项目"
                            })(<Select
                              showSearch
                              allowClear
                              // mode='multiple'
                              showArrow={false}
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
                              mode='multiple'
                              showArrow={false}
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
                              rules: [
                                {
                                  required: true,
                                  message: '请选择抄送人',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<Select
                              showSearch
                              allowClear
                              mode='multiple'
                              showArrow={false}
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
                            label="增加附件:"
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
