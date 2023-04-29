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
  Radio,
  Divider,
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
import { PluginsUrl } from '../../../../utils/config';
import { connect } from 'dva';
import moment from 'moment';
import {
  FetchQueryHardwareTendersAndContract,
  FetchQueryInquiryComparisonInfo,
  GetDocumentByLiveBos,
  UpdateHardwareTenderInfo,
  UpdateInquiryComparisonInfo,
} from '../../../../services/projectManage';
import { DecryptBase64 } from '../../../Common/Encrypt';

const { confirm } = Modal;
const { Option, OptGroup } = Select;

class PollResultEnterModel extends React.Component {
  state = {
    pollInfo: {
      //中标信息
      name: '',
      flowId: [],
      XBBG: '',
      ID: '',
    },
    glxq: [],
    uploadFileParams: [],
    pollFileList: [],
    pbbgTurnRed: false,
    isSpinning: false, //弹窗加载状态
    isNoMoreData: false,
    currentPage: 1,
    demandName: '',
  };

  // componentDidMount() {
  //   this.fetchQueryInquiryComparisonInfo()
  // }

  componentDidMount = async () => {
    this.fetchQueryInquiryComparisonInfoLCXX();
  };

  // 获取url参数
  getUrlParams = () => {
    const {
      match: {
        params: { params: encryptParams = '' },
      },
    } = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    return params;
  };

  // 查询中标信息修改时的供应商下拉列表
  fetchQueryInquiryComparisonInfoLCXX = (demandName = '', current = 1) => {
    const { xmid } = this.props;
    FetchQueryInquiryComparisonInfo({
      flowId: '-1',
      projectId: xmid,
      queryType: 'GLXQ',
      paging: 1,
      current,
      demandName,
      pageSize: 4,
      total: -1,
      sort: '',
    }).then(res => {
      if (res.success) {
        const { lcxx } = res;
        let rec = [...JSON.parse(lcxx)];
        let arr = [...this.state.glxq];
        if (rec.length === 0) {
          this.setState({
            glxq: arr,
            isNoMoreData: true,
          });
          console.log('🚀 ~ file: index.js:103 ~ arr:', arr);
        } else {
          this.setState({
            glxq: [...arr, ...rec],
          });
          console.log('🚀 ~ file: index.js:107 ~ [...arr, ...rec]:', [...arr, ...rec]);
        }
      }
    });
  };

  handleReachBottom = e => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    // throttle(() => {
    const { isNoMoreData, currentPage, demandName } = this.state;
    if (scrollHeight - scrollTop - clientHeight <= 10) {
      let index = currentPage;
      index = index + 1;
      // console.log('🚀 ~ file: index.js:122 ~ //throttle ~ isNoMoreData:', isNoMoreData, index);
      if (!isNoMoreData) {
        this.setState(
          {
            currentPage: index,
          },
          () => {
            this.fetchQueryInquiryComparisonInfoLCXX(demandName, index);
          },
        );
      }
    }
  };

  handleSltSearch = str => {
    const { xmid } = this.props;
    FetchQueryInquiryComparisonInfo({
      flowId: '-1',
      projectId: xmid,
      queryType: 'GLXQ',
      paging: 1,
      current: 1,
      pageSize: 4,
      demandName: str,
      total: -1,
      sort: '',
    }).then(res => {
      if (res.success) {
        const { lcxx } = res;
        this.setState({
          currentPage: 1,
          isNoMoreData: false,
          demandName: str,
          glxq: [...JSON.parse(lcxx)],
        });
      }
    });
  };

  handleSltBlur = () => {
    const { xmid } = this.props;
    FetchQueryInquiryComparisonInfo({
      flowId: '-1',
      projectId: xmid,
      queryType: 'GLXQ',
      paging: 1,
      current: 1,
      pageSize: 4,
      demandName: '',
      total: -1,
      sort: '',
    }).then(res => {
      if (res.success) {
        const { lcxx } = res;
        this.setState({
          currentPage: 1,
          isNoMoreData: false,
          demandName: '',
          glxq: [...JSON.parse(lcxx)],
        });
      }
    });
  };

  // 查询glxq
  fetchQueryInquiryComparisonInfo = () => {
    const { xmid } = this.props;
    FetchQueryInquiryComparisonInfo({
      flowId: '-1',
      projectId: xmid,
      queryType: 'GLXQ',
    }).then(res => {
      if (res.success) {
        const { xbxx } = res;
        const xbxxJson = JSON.parse(xbxx);
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
        _this.props.closeModal();
      },
      onCancel() {},
    });
  };

  handleSavePollInfo = () => {
    const { uploadFileParams, pollInfo, pollFileList } = this.state;
    const {
      columnName,
      documentData,
      fileLength,
      fileName,
      filePath,
      id,
      objectName,
    } = uploadFileParams;
    const { xmid } = this.props;
    if (pollInfo.name == '' || pollInfo.flowId == '' || pollFileList.length == 0) {
      message.warn('询比信息未填写完整！', 1);
      return;
    }
    this.setState({
      isSpinning: true,
    });
    let fileInfo = [];
    uploadFileParams.map(item => {
      fileInfo.push({ fileName: item.name, data: item.base64 });
    });
    let submitdata = {
      projectId: xmid,
      infoId: '-1',
      name: pollInfo.name,
      flowId: String(pollInfo.flowId),
      fileInfo: [...fileInfo],
      type: 'ADD',
    };
    console.log('🚀submitdata', submitdata);
    UpdateInquiryComparisonInfo({
      ...submitdata,
    }).then(res => {
      if (res?.code === 1) {
        this.setState({
          isSpinning: false,
        });
        this.props.closeModal();
        this.props.onSuccess('询比结果编辑');
        // message.info('信息修改成功！', 3);
      } else {
        this.setState({
          isSpinning: false,
        });
        message.error('信息修改失败！', 3);
      }
    });
  };

  render() {
    const { pollInfo, uploadFileParams, pollFileList, pbbgTurnRed, glxq, isSpinning } = this.state;
    const { visible, closeModal } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;
    return (
      <>
        <Modal
          wrapClassName="editMessage-modify"
          style={{ top: '60px', paddingBottom: '0' }}
          width={'760px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
            height: '260px',
          }}
          onCancel={this.props.closeModal}
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
                onClick={this.handleSavePollInfo}
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
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
            }}
          >
            <strong>询比结果录入</strong>
          </div>
          <Spin
            spinning={isSpinning}
            tip="加载中"
            size="large"
            wrapperClassName="PollResultEnterModel"
            style={{ position: 'fixed' }}
          >
            <Form name="nest-messages" style={{ padding: '24px' }}>
              <Row>
                <Col span={12} style={{ paddingRight: '24px' }}>
                  <Form.Item label="询比项目名称" required className="formItem">
                    {getFieldDecorator('name', {
                      initialValue: pollInfo.name,
                    })(
                      <Input
                        onChange={e => {
                          console.log('请输入询比项目名称', e.target.value);
                          this.setState({ pollInfo: { ...pollInfo, name: e.target.value } });
                        }}
                        placeholder="请输入询比项目名称"
                      />,
                    )}
                  </Form.Item>{' '}
                </Col>
                <Col span={12} style={{ paddingLeft: '24px' }}>
                  <Form.Item label="关联需求" required className="formItem">
                    {getFieldDecorator('flowId', {
                      initialValue: pollInfo.flowId ? pollInfo.flowId : null,
                    })(
                      <Select
                        style={{ borderRadius: '8px !important' }}
                        placeholder="请选择关联设备采购无合同流程"
                        // mode='multiple'
                        showArrow={true}
                        // className="skzh-box"
                        showSearch
                        dropdownMenuStyle={{ height: 100 }}
                        onPopupScroll={this.handleReachBottom}
                        onSearch={this.handleSltSearch}
                        onBlur={this.handleSltBlur}
                        allowClear
                        onChange={e => {
                          console.log('请选择关联主流程', e);
                          this.setState({ pollInfo: { ...pollInfo, flowId: e } });
                        }}
                        filterOption={false}
                        optionLabelProp="children"
                        // filterOption={(input, option) =>
                        //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                      >
                        {glxq?.map((item = {}, ind) => {
                          return (
                            <Option key={item.ID} value={item.ID}>
                              {item.BT}
                            </Option>
                          );
                        })}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} style={{ paddingRight: '24px' }}>
                  <Form.Item
                    label="询比报告"
                    required
                    // help={pbbgTurnRed ? '请上传合同附件' : ''}
                    validateStatus={pbbgTurnRed ? 'error' : 'success'}
                  >
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
                      multiple={true}
                      onChange={info => {
                        let fileList = [...info.fileList];
                        this.setState({ pollFileList: [...fileList] }, () => {
                          console.log('目前fileList', this.state.pollFileList);
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
                      fileList={[...pollFileList]}
                    >
                      <Button type="dashed">
                        <Icon type="upload" />
                        点击上传
                      </Button>
                    </Upload>
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

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(PollResultEnterModel));
