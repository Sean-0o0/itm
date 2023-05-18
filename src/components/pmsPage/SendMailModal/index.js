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
import {IndividuationGetOAResult} from '../../../services/pmsServices';
import moment from 'moment';
import RichTextEditor from './RichTextEditor';

class SendMailModal extends React.Component {
  state = {
    isSpinning: false,
  };

  componentDidMount() {

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
        if (errs.includes('issend')) {
          message.warn('请选择是否直接送审！');
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
        console.log("Number(xmjbxxRecord[0]?.lxlcje)", Number(xmjbxxRecord[0]?.LXLCJE))
        console.log("xmjbxxRecordxmjbxxRecord", xmjbxxRecord)
        console.log("Number(xmjbxxRecord[0]?.ysje)", Number(xmjbxxRecord[0]?.YSJE))
        if (_this.state.pbbgTurnRed) {
          message.warn('请上传合同附件！');
          return;
        }
        if (xmjbxxRecord[0]?.LXLCJE && Number(xmjbxxRecord[0]?.LXLCJE) > 0) {
          if (Number(values.je) > Number(xmjbxxRecord[0]?.LXLCJE)) {
            message.warn('合同金额不能超过立项流程金额(' + Number(xmjbxxRecord[0]?.LXLCJE) + ')！');
            return;
          } else {
            _this.setState({
              isSpinning: true
            })
            _this.individuationGetOAResult(values);
          }
        }
        if (xmjbxxRecord[0]?.LXLCJE && Number(xmjbxxRecord[0]?.LXLCJE) === 0) {
          if (Number(values.je) > Number(xmjbxxRecord[0]?.YSJE)) {
            message.warn('合同金额不能超过预算金额(' + Number(xmjbxxRecord[0]?.YSJE) + ')！');
            return;
          } else {
            _this.setState({
              isSpinning: true
            })
            _this.individuationGetOAResult(values);
          }
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
        const {code = -1, record = []} = result;
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
    const {uploadFileParams, processListData} = this.state;
    const {currentXmid, currentXmmc} = this.props;
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
      issend: Number(values.issend), //是否直接送审
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


  render() {
    const {
      isSpinning = false,
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
            <div style={{padding: '0 24px'}}>
              <div className="sendMail-box">
                <React.Fragment>
                  <Form
                    ref={e => (this.basicForm = e)}
                    style={{width: '98%'}}
                  >
                    <div style={{margin: '12px 0 0 0'}}>
                      <Row gutter={24} style={{height: '40px'}}>
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
                                  message: '请输入发件人',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<Input style={{border: 'none'}}/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider style={{margin: '2px 0'}}/>
                      <Row gutter={24} style={{height: '40px'}}>
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
                                  message: '请输入主题',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<Input style={{border: 'none'}}/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider style={{margin: '2px 0'}}/>
                      <Row gutter={24} style={{height: '40px'}}>
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
                                  message: '请输入主题',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<Input style={{border: 'none'}}/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Divider style={{margin: '2px 0'}}/>
                      <Row gutter={24} style={{height: '40px'}}>
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
                      <Row gutter={24} className="fj-box">
                        <Col span={24}>
                          <Form.Item
                            label="增加附件"
                            colon={false}
                            // labelCol={{ span: 2 }}
                            // wrapperCol={{ span: 22 }}
                          >
                            {getFieldDecorator('FJ', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入主题',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<Input/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label=""
                            labelCol={{span: 0}}
                            wrapperCol={{span: 24}}
                          >
                            {getFieldDecorator('NR', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: '请输入请示报告内容',
                              //   },
                              // ],
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
