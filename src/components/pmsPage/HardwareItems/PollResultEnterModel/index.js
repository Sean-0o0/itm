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
import {
  FetchQueryHardwareTendersAndContract,
  FetchQueryInquiryComparisonInfo, GetDocumentByLiveBos, UpdateHardwareTenderInfo,
  UpdateInquiryComparisonInfo
} from "../../../../services/projectManage";
import {DecryptBase64} from "../../../Common/Encrypt";

const {confirm} = Modal;
const {Option, OptGroup} = Select;

class PollResultEnterModel extends React.Component {
  state = {
    xmid: '-1',
    operateType: 'ADD',
    pollInfo: {
      //中标信息
      name: '',
      flowId: '',
      XBBG: '',
      ID: '',
    },
    glxq: [],
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
    isSpinning: false, //弹窗加载状态
  };

  componentDidMount() {
    this.fetchQueryInquiryComparisonInfo()
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
    console.log("paramsparams", params)
    console.log("JSON.parse(params.record)",JSON.parse(params.record))
    const rec = JSON.parse(params.record);
    setTimeout(function () {
      _this.fetchQueryInquiryComparisonInfoLCXX()
      if (params.type === "UPDATE") {
        console.log("1111")
        _this.getDocumentByLiveBos(rec)
        _this.setState({
          pollInfo: {
            //中标信息
            name: rec?.XBXM,
            flowId: Number(rec?.GLXQ),
            // XBBG: rec?.XBBG,
            ID: rec?.ID,
          },
        });
      }
    }, 300);
  };


  // 获取url参数
  getUrlParams = () => {
    const {match: {params: {params: encryptParams = ''}}} = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    return params;
  }

  getDocumentByLiveBos = (rec) =>{
    const {items} = JSON.parse(rec.XBBG)
    GetDocumentByLiveBos({
      objectName: "TXMXX_YJXBJG",
      columnName: "XBBG",
      title: '22.txt',
      entryNo: '',
      id: 0
    }).then(res => {
      if (res.success) {
        console.log("resresresres",res)
      }
    });
  }


  // 查询中标信息修改时的供应商下拉列表
  fetchQueryInquiryComparisonInfoLCXX = () => {
    const {xmid} = this.state;
    FetchQueryInquiryComparisonInfo({
      flowId: "-1",
      projectId: xmid,
      queryType: "ALL"
    }).then(res => {
      if (res.success) {
        const {lcxx} = res
        this.setState({
          glxq: [...JSON.parse(lcxx)],
        });
      }
    });
  };

  // 查询glxq
  fetchQueryInquiryComparisonInfo = () => {
    const {xmid} = this.state;
    FetchQueryInquiryComparisonInfo({
      flowId: "-1",
      projectId: xmid,
      queryType: "ALL"
    }).then(res => {
      if (res.success) {
        const {xbxx} = res
        const xbxxJson = JSON.parse(xbxx)
        this.setState({
          pollInfo: {
            //中标信息
            name: xbxxJson[0].XBXM,
            flowId: xbxxJson[0].GLXQ,
          },
        });
      }
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


  handleSavePollInfo = () => {
    const {xmid, operateType, uploadFileParams, pollInfo} = this.state;
    const {
      columnName,
      documentData,
      fileLength,
      fileName,
      filePath,
      id,
      objectName,
    } = uploadFileParams;
    let submitdata = {
      projectId: xmid,
      infoId: operateType == "UPDATE"?pollInfo.ID:'-1',
      name: pollInfo.name,
      flowId: String(pollInfo.flowId),
      fileInfo: [{fileName, data: documentData}],
      type: 'ADD',
    };
    console.log('🚀submitdata', submitdata);
    UpdateInquiryComparisonInfo({
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
      pollInfo,
      uploadFileParams,
      fileList,
      pbbgTurnRed,
      glxq,
      isSpinning,
    } = this.state;
    const {
      currentXmid,
      visible,
      closeModal,
      onSuccess,
    } = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue, validateFields} = this.props.form;
    return (
      <div className="poll-result-box" style={{overflow: 'hidden', height: "100%"}}>
        <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="PollResultEnterModel">
          <Form name="nest-messages" style={{padding: '24px'}}>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="询比项目名称" required
                  className="formItem"
                >
                  {getFieldDecorator('name', {
                    initialValue: pollInfo.name,
                  })(<Input onChange={e => {
                    console.log("请输入询比项目名称", e.target.value)
                    this.setState({pollInfo: {...pollInfo, name: e.target.value}});
                  }} placeholder="请输入询比项目名称"/>)}
                </Form.Item>{' '}
                </Col>
                <Col span={12} style={{paddingLeft: '65px', paddingRight: '70px'}}>
                  <Form.Item
                    label="关联需求" required
                    className="formItem"
                  >
                    {getFieldDecorator('flowId', {
                      initialValue: pollInfo.flowId ? pollInfo.flowId : null,
                    })(<Select
                      style={{borderRadius: '8px !important'}}
                      placeholder="请选择关联主流程"
                      mode='multiple'
                      // className="skzh-box"
                      showSearch
                      allowClear
                      onChange={e => {
                        console.log("请选择关联主流程", e)
                        this.setState({pollInfo: {...pollInfo, flowId: e}});
                      }}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {
                        glxq?.map((item = {}, ind) => {
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
                  <Form.Item label="评标报告" required
                    // help={pbbgTurnRed ? '请上传合同附件' : ''}
                             validateStatus={pbbgTurnRed ? 'error' : 'success'}
                  >
                    <Upload
                      className="uploadStyle"
                      action={'/api/projectManage/queryfileOnlyByupload'}
                      onDownload={(file) => {
                        if (!file.url) {
                          let reader = new FileReader();
                          reader.readAsDataURL(file.originFileObj);
                          reader.onload = (e) => {
                            var link = document.createElement('a');
                            link.href = e.target.result;
                            link.download = file.name;
                            link.click();
                            window.URL.revokeObjectURL(link.href);
                          }
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
                      onChange={(info) => {
                        let fileList = [...info.fileList];
                        fileList = fileList.slice(-1);
                        this.setState({fileList}, () => {
                          // //console.log('目前fileList', this.state.fileList);
                        });
                        if (fileList.length === 0) {
                          this.setState({
                            pbbgTurnRed: true
                          });
                        } else {
                          this.setState({
                            pbbgTurnRed: false
                          });
                        }
                      }}
                      beforeUpload={(file, fileList) => {
                        // //console.log("🚀 ~ file: index.js ~ line 674 ~ BidInfoUpdate ~ render ~ file, fileList", file, fileList)
                        let reader = new FileReader(); //实例化文件读取对象
                        reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                        reader.onload = (e) => { //文件读取成功完成时触发
                          let urlArr = e.target.result.split(',');
                          //console.log('uploadFileParamsuploadFileParams', uploadFileParams);
                          this.setState({
                            uploadFileParams: {
                              ...this.state.uploadFileParams,
                              documentData: urlArr[1],//获得文件读取成功后的DataURL,也就是base64编码
                              fileName: file.name,
                            }
                          });
                        }
                      }}
                      accept={'.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                      fileList={[...fileList]}>
                      <Button type="dashed">
                        <Icon type="upload"/>点击上传
                      </Button>
                    </Upload>
                  </Form.Item></Col>
              </Row>
          </Form>
          <div className="footer">
            <Divider/>
            <div style={{padding: '16px 24px'}}>
              <Button onClick={this.handleCancel}>取消</Button>
              <div className="steps-action">
                <Button style={{marginLeft: '12px', backgroundColor: '#3361FF'}} type="primary"
                        onClick={e => this.handleSavePollInfo()}>
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
}))(Form.create()(PollResultEnterModel));
