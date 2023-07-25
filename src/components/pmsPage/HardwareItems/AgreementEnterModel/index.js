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
import {FetchQueryHardwareTendersAndContract, UpdateHardwareContractInfo} from "../../../../services/projectManage";
import {DecryptBase64} from "../../../Common/Encrypt";

const {Option, OptGroup} = Select;

const PASE_SIZE = 10; //关联供应商选择器分页长度
const Loginname = localStorage.getItem('firstUserID');
const {confirm} = Modal;

class AgreementEnterModel extends React.Component {
  state = {
    xmid: '-1',
    operateType: 'ADD',
    contractInfo: {
      amount: '',
      date: '',
      supplierId: '',
      flow: '',
      payDate: '-1',
    },
    glgys: [],
    lcxx: [],
    addGysModalVisible: false,
    isSpinning: false, //弹窗加载状态
  };

  componentDidMount() {
    // this.fetchQueryGysInZbxx(1, PASE_SIZE);
    // this.fetchQueryHardwareTendersAndContract()
  }

  componentDidMount = async () => {
    const {operateType, xmid} = this.props
    this.fetchQueryGysInZbxx(1, PASE_SIZE);
    this.fetchQueryHardwareTendersAndContract();
    if (operateType == "UPDATE") {
      this.fetchQueryHardwareContract();
    }
  };

  // 获取url参数
  getUrlParams = () => {
    console.log("paramsparams", this.props.match.params)
    const {match: {params: {params: encryptParams = ''}}} = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    return params;
  }

  // 查询硬件项目的招标信息，合同信息----查询相关流程
  fetchQueryHardwareTendersAndContract = () => {
    const {xmid, operateType} = this.props
    FetchQueryHardwareTendersAndContract({
      xmmc: xmid,
      flowId: -1,
      type: 'HTXX',
      flowType: operateType,
    }).then(res => {
      if (res.success) {
        const {lcxx} = res;
        const lcxxJson = JSON.parse(lcxx);
        console.log("lcxxJson", lcxxJson)
        this.setState({
          lcxx: lcxxJson,
        })
      }
    });
  };

  // 查询硬件项目的招标信息，合同信息---查询反显信息
  fetchQueryHardwareContract = () => {
    const {contractInfo} = this.state;
    const {xmid, operateType} = this.props
    FetchQueryHardwareTendersAndContract({
      xmmc: xmid,
      flowId: -1,
      type: 'HTXX',
      flowType: operateType,
    }).then(res => {
      if (res.success) {
        const {htxx} = res;
        const htxxJson = JSON.parse(htxx);
        console.log("htxxJson", htxxJson)
        this.setState({
          contractInfo: {
            ...contractInfo,
            amount: htxxJson[0].HTJE,
            date: htxxJson[0].QSRQ,
            supplierId: htxxJson[0].GYSID,
            payDate: htxxJson[0].FKRQ,
            flow: htxxJson[0].GLLC,
          },
        })
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
          glgys: [...rec],
        });
      }
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

  addItem = () => {
    console.log('addItem');
    this.setState({
      addGysModalVisible: true,
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
        _this.props.closeModal()
      },
      onCancel() {
      },
    });
  }

  handleSaveHtxx = () => {
    const {contractInfo = [], lcxx} = this.state;
    const {xmid, operateType} = this.props;
    console.log("contractInfocontractInfo", contractInfo)
    if (contractInfo.amount == '' || contractInfo.date == '' || contractInfo.supplierId == '' || contractInfo.flow == '') {
      message.warn("合同信息未填写完整！", 1);
      return;
    }
    if (lcxx[0]?.LCHTJE) {
      if (Number(contractInfo.amount) > Number(lcxx[0]?.LCHTJE)) {
        message.warn("合同金额超过流程合同金额(" + Number(lcxx[0]?.LCHTJE) + ")！", 1);
        return;
      }
    }
    this.setState({
      isSpinning: true,
    })
    let submitdata = {
      projectId: Number(xmid),
      amount: Number(contractInfo.amount),
      date: Number(moment(contractInfo.date).format('YYYYMMDD')),
      supplierId: Number(contractInfo.supplierId),
      flow: Number(contractInfo.flow),
      payDate: contractInfo.payDate === '-1' ? '-1' : Number(moment(contractInfo.payDate).format('YYYYMMDD')),
      type: operateType,
    };
    console.log('🚀submitdata', submitdata);
    UpdateHardwareContractInfo({
      ...submitdata,
    }).then(res => {
      if (res?.code === 1) {
        this.setState({
          isSpinning: false,
        })
        this.props.closeModal();
        this.props.onSuccess(operateType === "UPDATE" ? "合同信息编辑" : "合同信息录入");
        // message.info('信息' + operateType === "UPDATE" ? "编辑" : "录入" + '成功！', 3);
      } else {
        this.setState({
          isSpinning: false,
        })
        this.props.closeModal();
        message.error(operateType === "UPDATE" ? "合同信息编辑" : "合同信息录入" + '失败！', 3);
      }
    });
  }

  render() {
    const {
      addGysModalVisible,
      isSpinning,
      contractInfo,
      glgys,
      lcxx,
    } = this.state;
    const {
      xmid,
      visible,
      operateType,
      closeModal,
      onSuccess,
      dictionary: {}
    } = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue, validateFields} = this.props.form;

    const addGysModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新增供应商',
      width: '800px',
      height: '500px',
      style: {top: '30px'},
      visible: addGysModalVisible,
      footer: null,
    };

    const basicFormItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
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
          style={{top: '60px', paddingBottom: '0'}}
          width={'760px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
            height: '428px',
          }}
          onCancel={this.props.closeModal}
          maskClosable={false}
          footer={<div className="modal-footer">
            <Button className="btn-default" onClick={this.props.closeModal}>
              取消
            </Button>
            {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
            <Button disabled={isSpinning} className="btn-primary" type="primary" onClick={this.handleSaveHtxx}>
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
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
            }}
          >
            <strong>硬件合同信息{operateType === "UPDATE" ? "编辑" : "录入"}</strong>
          </div>
          <Spin wrapperClassName='agreement-box-style' spinning={isSpinning} tip="正在努力的加载中..." size="large"
                style={{height: "100%", position: 'fixed'}}>
            <Form name="nest-messages" style={{padding: '24px'}}>
              <Row>
                <Col span={24}>
                  <Form.Item label={<span><span style={{
                    textAlign: 'left',
                    fontFamily: 'SimSun, sans-serif',
                    color: '#f5222d',
                    marginRight: '4px',
                    lineHeight: 1
                  }}>*</span>设备采购有合同流程</span>} className="formItem">
                    {getFieldDecorator('flow', {
                      // rules: [{
                      //   required: true,
                      //   message: '请输入合同金额'
                    // }],
                    initialValue: contractInfo.flow
                  })(<Select
                    style={{borderRadius: '8px !important'}}
                    placeholder="请选择关联主流程"
                    // className="skzh-box"
                    showSearch
                    allowClear
                    onChange={e => {
                      console.log("请选择关联主流程", e)
                      this.setState({contractInfo: {...contractInfo, flow: e}});
                      //流程变更 数据变更
                      if (operateType == 'UPDATE') {
                        FetchQueryHardwareTendersAndContract({
                          xmmc: xmid,
                          flowId: e,
                          type: 'HTXX',
                          flowType: 'UPDATE',
                        }).then(res => {
                          if (res.success) {
                            const {htxx} = res;
                            const htxxJson = JSON.parse(htxx);
                            console.log("htxxJson", htxxJson)
                            if (htxxJson.length > 0) {
                              this.setState({
                                operateType: 'UPDATE',
                                contractInfo: {
                                  flow: e,
                                  amount: htxxJson[0].HTJE,
                                  date: htxxJson[0].QSRQ,
                                  supplierId: htxxJson[0].GYSID,
                                  payDate: htxxJson[0].FKRQ,
                                },
                              })
                            }
                          }
                        });
                      }

                    }}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {
                      lcxx?.map((item = {}, ind) => {
                        return <Option key={item.ID} value={item.ID}>
                          {item.BT}
                        </Option>
                      })
                    }
                  </Select>)}
                </Form.Item>
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
                }}>*</span>合同金额（元）</span>} className="formItem">
                  {getFieldDecorator('amount', {
                    // rules: [{
                    //   required: true,
                    //   message: '请输入合同金额'
                    // }],
                    initialValue: contractInfo.amount
                  })(
                    <Input type='number' placeholder="请输入合同金额" onChange={e => {
                      console.log('请输入合同金额', e.target.value)
                      this.setState({contractInfo: {...contractInfo, amount: e.target.value}});
                    }}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item style={{paddingLeft: '24px'}} label={<span><span style={{
                  textAlign: 'left',
                  fontFamily: 'SimSun, sans-serif',
                  color: '#f5222d',
                  marginRight: '4px',
                  lineHeight: 1
                }}>*</span>签署日期</span>} className="formItem">
                  {getFieldDecorator('date', {
                    // rules: [{
                    //   required: true,
                    //   message: '请输入项目类型'
                    // }],
                    initialValue: contractInfo.date
                  })(
                    <div style={{
                      // width: '270px'
                    }} id="datePicker">
                      <DatePicker format="YYYY-MM-DD"
                                  style={{width: '100%'}}
                                  allowClear={false}
                                  value={contractInfo.date != '' ? moment(contractInfo.date, 'YYYY-MM-DD') : undefined}
                                  onChange={(date, dateString) => {
                                    console.log("签署日期", dateString)
                                    this.setState({contractInfo: {...contractInfo, date: dateString}});
                                  }}/>
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{position: 'relative'}}>
                <Form.Item label={<span><span style={{
                  textAlign: 'left',
                  fontFamily: 'SimSun, sans-serif',
                  color: '#f5222d',
                  marginRight: '4px',
                  lineHeight: 1
                }}>*</span>采购供应商</span>} className="formItem">
                  {getFieldDecorator('supplierId', {
                    // rules: [{
                    //   required: true,
                    //   message: '请输入合同金额'
                    // }],
                    initialValue: contractInfo.supplierId
                  })(<Select
                    style={{borderRadius: '8px !important'}}
                    placeholder="请选择采购供应商"
                    className="skzh-box"
                    showSearch
                    // allowClear
                    onChange={e => {
                      console.log("请选择采购供应商", e)
                      this.setState({contractInfo: {...contractInfo, supplierId: e}});
                    }}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {
                      glgys?.map((item = {}, ind) => {
                        return <Option key={item.id} value={item.id}>
                          {item.gysmc}
                        </Option>
                      })
                    }
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
                    top: '23px',
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
                    top: '23px',
                    right: '8px',
                    color: '#c7c7c7',
                    fontSize: '20px',
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label={<span>付款日期</span>} className="formItem">
                  {getFieldDecorator('payDate', {
                    // rules: [{
                    //   required: true,
                    //   message: '请输入项目类型'
                    // }],
                    initialValue: contractInfo.payDate
                  })(
                    <div style={{
                      // width: '100%'
                    }} id="datePicker">
                      <DatePicker format="YYYY-MM-DD"
                                  style={{width: '100%'}}
                                  allowClear={false}
                                  value={contractInfo.payDate != '-1' ? moment(contractInfo.payDate, 'YYYY-MM-DD') : undefined}
                                  onChange={(date, dateString) => {
                                    console.log("付款日期", dateString)
                                    this.setState({contractInfo: {...contractInfo, payDate: dateString}});
                                  }}/>
                    </div>
                  )}
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
}))(Form.create()(AgreementEnterModel));
