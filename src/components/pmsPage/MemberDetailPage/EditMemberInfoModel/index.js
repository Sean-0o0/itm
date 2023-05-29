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
  Icon, Tooltip,
} from 'antd';

const {Option} = Select;
const {TextArea} = Input;
import React from 'react';
import {connect} from 'dva';
import {
  FetchQueryGysInZbxx,
  FetchqueryOutsourceRequirement,
  OperateOutsourceRequirements, UpdateOutsourceMemberInfo,
} from '../../../../services/pmsServices';
import moment from 'moment';

class EditMemberInfoModel extends React.Component {
  state = {
    isSpinning: true,
    xqid: -1,
    rydjxxJson: [],
    glgys: [],
    uploadFileParams: [],
    jlFileList: [],
    pbbgTurnRed: false,
  };

  componentDidMount() {
    this.fetchqueryOutsourceRequirement();
    this.fetchQueryGysInZbxx();
    this.setState({
      isSpinning: false
    })
  }

  // 查询人员等级信息
  fetchqueryOutsourceRequirement = () => {
    FetchqueryOutsourceRequirement({xqid: 0, cxlx: 'RYDJ'}).then((result) => {
      const {code = -1, rydjxx} = result;
      const rydjxxJson = JSON.parse(rydjxx);
      if (code > 0) {
        this.setState({
          rydjxxJson,
        })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
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
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          this.setState({
            glgys: [...rec],
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
    const {operateType = ""} = _this.props
    _this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('rymc') && operateType === "bjxq") {
          message.warn('请输入人员名称！');
          return;
        }
        if (errs.includes('rydj') && operateType === "bjxq") {
          message.warn('请选择人员等级！');
          return;
        }
        if (errs.includes('gw') && operateType === "bjxq") {
          message.warn('请选择岗位！');
          return;
        }
        if (errs.includes('ssgys') && operateType === "bjxq") {
          message.warn('请选择所属供应商！');
          return;
        }
        if (errs.includes('syqkh') && operateType === "syqkh") {
          message.warn('请选择试用期考核情况！');
          return;
        }
        if (errs.includes('jl') && operateType === "bjxq") {
          message.warn('请上传简历！');
          return;
        }
      }
      _this.setState({
        isSpinning: true
      })
      _this.updateOutsourceMemberInfo(values);
    });
  };

  updateOutsourceMemberInfo = values => {
    // console.log("params", this.handleParams(values))
    return UpdateOutsourceMemberInfo(this.handleParams(values))
      .then(result => {
        const {code = -1, record = []} = result;
        if (code > 0) {
          this.setState({
            isSpinning: false
          });
          this.props.successCallBack();
          message.success("人员信息编辑完成!");
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
    console.log("values", values)
    const {uploadFileParams} = this.state;
    let fileInfo = [];
    uploadFileParams.map(item => {
      fileInfo.push({fileName: item.name, data: item.base64});
    });
    const {
      ryid, operateType, data: {
        XMID = "",
      }
    } = this.props;
    //只编辑试用期考核情况
    let params = {
      //新增传-1 重新发起也传-1
      ryid: Number(ryid),
      syqkh: Number(values.syqkh),
      //UPDATE|修改;UPDATEKHQK|修改试用期考核情况（只需传人员id和试用期考核情况，其他字段不用）;
      czlx: "UPDATEKHQK"
    };
    //编辑人员详情
    if (operateType === "bjxq") {
      params = {
        ...params,
        rymc: values.rymc,
        rydj: Number(values.rydj),
        gw: Number(values.gw),
        ssxm: Number(XMID),
        ssgys: Number(values.ssgys),
        jl: uploadFileParams[0].name,
        fileData: uploadFileParams[0].base64,
        czlx: "UPDATE"
      }
    }
    console.log("paramsparams", params)
    return params;
  };

  render() {
    const {
      isSpinning = false,
      jlFileList = [],
      rydjxxJson = [],
      glgys = [],
    } = this.state;
    const {
      visible,
      closeModal,
      xmmc,
      dictionary = {},
      data: {
        XB = "",
        GYSID = "",
        RYMC = "",
        GWID = "",
        DJID = "",
        XMID = "",
      },
      operateType = ""
    } = this.props;
    console.log("dictionary", dictionary)
    const {KHZT, WBRYGW} = dictionary;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
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
          wrapClassName="editMessage-modify xqfq-modal"
          style={{top: '10px'}}
          width={operateType === "syqkh" ? '600px' : '880px'}
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
              确定
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
            <strong>{operateType === "syqkh" ? "试用期考核情况编辑" : "人员信息编辑"}</strong>
          </div>
          <Spin spinning={isSpinning} style={{position: 'fixed'}} tip="加载中" size="large"
                wrapperClassName="contrast-signing-modal-spin">
            <div style={{padding: '0 24px'}}>
              <div className="steps-content">
                <React.Fragment>
                  <Form
                    {...basicFormItemLayout}
                    ref={e => (this.basicForm = e)}
                    style={{width: '98%'}}
                  >
                    <div style={{margin: '12px 0 0 0'}}>
                      <Row gutter={24} style={{display: operateType === "bjxq" ? '' : 'none'}}>
                        <Col span={12}>
                          <Form.Item label="人员名称"
                                     labelCol={{span: 8}}
                                     wrapperCol={{span: 16}}>
                            {getFieldDecorator('rymc', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入人员名称',
                                },
                              ],
                              initialValue: RYMC
                            })(<Input placeholder="请输入人员名称"/>)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="性别"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                          >
                            {getFieldDecorator('xb', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择性别',
                                },
                              ],
                              initialValue: XB
                            })(<Select
                              showSearch
                              allowClear
                              showArrow
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              <Option key={1} value="1">男</Option>
                              <Option key={2} value="2">女</Option>
                              <Option key={3} value="3">不详</Option>
                            </Select>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: operateType === "bjxq" ? '' : 'none'}}>
                        <Col span={12}>
                          <Form.Item
                            label="人员等级"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                          >
                            {getFieldDecorator('rydj', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择人员等级',
                                },
                              ],
                              initialValue: DJID
                            })(<Select
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
                            </Select>)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="岗位"
                                     labelCol={{span: 8}}
                                     wrapperCol={{span: 16}}>
                            {getFieldDecorator('gw', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择人员岗位',
                                },
                              ],
                              initialValue: GWID
                            })(<Select
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
                            </Select>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: operateType === "bjxq" ? '' : 'none'}}>
                        <Col span={12}>
                          <Form.Item
                            label="所属供应商"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                          >
                            {getFieldDecorator('ssgys', {
                              rules: [
                                {
                                  required: true,
                                  message: '所属供应商',
                                },
                              ],
                              initialValue: GYSID
                            })(<Select
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
                            </Select>)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="试用期考核情况"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                          >
                            {getFieldDecorator('syqkh', {
                              rules: [
                                {
                                  required: true,
                                  message: '试用期考核情况',
                                },
                              ],
                              // initialValue: ""
                            })(<Select
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
                            </Select>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: operateType === "bjxq" ? '' : 'none'}}>
                        <Col span={24}>
                          <Form.Item
                            label="简历:"
                            colon={false}
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                          >
                            {getFieldDecorator('jl', {
                              rules: [
                                {
                                  required: true,
                                  message: '请上传简历',
                                },
                              ],
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
                              // multiple={true}
                              onChange={info => {
                                let fileList = [...info.fileList];
                                this.setState({jlFileList: [...fileList]}, () => {
                                  console.log('目前fileList', this.state.jlFileList);
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
                              fileList={[...jlFileList]}
                            >
                              <Button type="dashed">
                                <Icon type="upload"/>
                                点击上传
                              </Button>
                            </Upload>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: operateType === "syqkh" ? '' : 'none'}}>
                        <Col span={24}>
                          <Form.Item
                            label="试用期考核情况"
                            labelCol={{span: 6}}
                            wrapperCol={{span: 18}}
                          >
                            {getFieldDecorator('syqkh', {
                              rules: [
                                {
                                  required: true,
                                  message: '试用期考核情况',
                                },
                              ],
                              // initialValue: ""
                            })(<Select
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
                            </Select>)}
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
}))(Form.create()(EditMemberInfoModel));
