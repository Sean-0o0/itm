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

class PollResultEditModel extends React.Component {
  state = {
    pbbgTurnRed: false,
    isSpinning: false, //弹窗加载状态
  };

  componentDidMount() {
  }

  handleSave = () => {
    const {handleSavePollInfo} = this.props;
    handleSavePollInfo();
  }

  handleDataCallback = (params) => {
    const {handleDataCallback} = this.props;
    handleDataCallback(params)
  }

  handleFileCallback = (params) => {
    console.log("当前文件信息", params)
    const {handleFileCallback} = this.props;
    handleFileCallback(params)
  }

  handleParamsCallback = (params = []) => {
    console.log("当前文件信息2222", params)
    const {handleParamsCallback} = this.props;
    handleParamsCallback(params)
  }

  render() {
    const {
      pbbgTurnRed,
      isSpinning,
    } = this.state;
    const {
      pollInfo,
      uploadFileParams,
      fileList,
      glxq,
    } = this.props;
    console.log("fileListfileList", fileList)
    const {getFieldDecorator, getFieldValue, setFieldsValue, validateFields} = this.props.form;
    return (
      <div className="poll-result-box" style={{overflow: 'hidden', height: "100%"}}>
        <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="PollResultEnterModel">
          <Form name="nest-messages">
            <Row>
              <Col span={12}>
                <Form.Item
                  label="询比项目名称" required
                  className="formItem"
                >
                  {getFieldDecorator('name', {
                    initialValue: pollInfo?.name,
                  })(<Input onChange={e => {
                    console.log("请输入询比项目名称", e.target.value)
                    this.handleDataCallback({name: e.target.value})
                    // this.setState({pollInfo: {...pollInfo, name: e.target.value}});
                  }} placeholder="请输入询比项目名称"/>)}
                </Form.Item>{' '}
              </Col>
              <Col span={12} style={{paddingLeft: '65px', paddingRight: '70px'}}>
                <Form.Item
                  label="关联需求" required
                  className="formItem"
                >
                  {getFieldDecorator('flowId', {
                    initialValue: pollInfo?.flowId ? pollInfo.flowId : null,
                  })(<Select
                    style={{borderRadius: '8px !important'}}
                    placeholder="请选择关联主流程"
                    mode='multiple'
                    // className="skzh-box"
                    showSearch
                    allowClear
                    onChange={e => {
                      console.log("请选择关联主流程", e)
                      this.handleDataCallback({flowId: e})
                      // this.setState({pollInfo: {...pollInfo, flowId: e}});
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
                <Form.Item label="询比报告" required
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
                    multiple={true}
                    onChange={(info) => {
                      let fileList = [...info.fileList];
                      console.log("fileListfileList", fileList)
                      let newArr = [];
                      fileList.forEach(item => {
                        console.log("item.originFileObj", item.originFileObj)
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
                              this.handleParamsCallback([...newArr])
                            }
                          };
                        }
                      });
                      this.handleFileCallback(fileList)
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
                            this.handleParamsCallback([...arr, ...uploadFileParams])
                          }
                        };
                      });
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
        </Spin>
      </div>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(PollResultEditModel));
