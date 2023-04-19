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
      payDate: '',
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
    const _this = this;
    const params = this.getUrlParams();
    if (params.xmid && params.xmid !== -1) {
      console.log("paramsparams", params)
      // 修改项目操作
      this.setState({
        operateType: params.type,
        xmid: Number(params.xmid)
      })
    }
    setTimeout(function () {
      _this.fetchQueryGysInZbxx(1, PASE_SIZE);
      _this.fetchQueryHardwareTendersAndContract();
      if (params.type == "UPDATE") {
        _this.fetchQueryHardwareContract();
      }
    }, 300);
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
    const {xmid, operateType} = this.state;
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
    const {xmid, contractInfo, operateType} = this.state;
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
        if (_this.state.operateType) {
          window.parent && window.parent.postMessage({operate: 'close'}, '*');
        } else {
          _this.props.closeDialog();
        }
      },
      onCancel() {
      },
    });
  }

  handleSaveHtxx = () => {
    const {contractInfo = [], xmid, operateType} = this.state;
    console.log("contractInfocontractInfo", contractInfo)
    if (contractInfo.amount == '' || contractInfo.date == '' || contractInfo.supplierId == '' || contractInfo.flow == '') {
      message.warn("合同信息未填写完整！", 1);
      return;
    }
    let submitdata = {
      projectId: Number(xmid),
      amount: Number(contractInfo.amount),
      date: Number(moment(contractInfo.date).format('YYYYMMDD')),
      supplierId: Number(contractInfo.supplierId),
      flow: Number(contractInfo.flow),
      payDate: Number(moment(contractInfo.payDate).format('YYYYMMDD')),
      type: operateType,
    };
    console.log('🚀submitdata', submitdata);
    UpdateHardwareContractInfo({
      ...submitdata,
    }).then(res => {
      if (res?.code === 1) {
        if (operateType) {
          window.parent && window.parent.postMessage({operate: 'close'}, '*');
        } else {
          this.props.closeDialog();
        }
      } else {
        message.error('信息修改失败', 1);
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
      xmid,
    } = this.state;
    const {
      visible,
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
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (
      <div className="enterAgreementModel" style={{overflow: 'hidden', height: "100%"}}>
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
        <Spin spinning={isSpinning} tip="正在努力的加载中..." size="large" style={{height: "100%"}}>
          <Form {...basicFormItemLayout} name="nest-messages" style={{padding: '24px'}}>
            <Row>
              <Col span={24}>
                <Form.Item labelCol={{span: 4}} wrapperCol={{span: 20}} label={<span><span style={{
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
                      // this.setState({contractInfo: {...contractInfo, flow: e}});
                      //流程变更 数据变更
                      FetchQueryHardwareTendersAndContract({
                        xmmc: xmid,
                        flowId: e,
                        type: 'HTXX',
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
                          } else {
                            this.setState({
                              operateType: 'ADD',
                              contractInfo: {
                                flow: e,
                                amount: '',
                                date: '',
                                supplierId: '',
                                payDate: '',
                              },
                            })
                          }
                        }
                      });
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
                <Form.Item label={<span><span style={{
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
                <Form.Item labelCol={{span: 4}} wrapperCol={{span: 20}} label={<span><span style={{
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
                    top: '0',
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
                    top: '0',
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
                      width: '270px'
                    }} id="datePicker">
                      <DatePicker format="YYYY-MM-DD"
                                  allowClear={false}
                                  value={contractInfo.payDate != '' ? moment(contractInfo.payDate, 'YYYY-MM-DD') : undefined}
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
          <div className="footer">
            <Divider/>
            <div style={{padding: '16px 24px'}}>
              <Button onClick={this.handleCancel}>取消</Button>
              <div className="steps-action">
                <Button style={{marginLeft: '12px', backgroundColor: '#3361FF'}} type="primary"
                        onClick={e => this.handleSaveHtxx()}>
                  保存
                </Button>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(AgreementEnterModel));
