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

const {Option, OptGroup} = Select;

class PollResultEnterModel extends React.Component {
  state = {
    isModalFullScreen: false,
    isTableFullScreen: false,
    bidInfo: {
      //中标信息
      glgys: [],
      totalRows: 0,
      zbgys: '',
      tbbzj: '',
      lybzj: '',
      zbgysskzh: '',
      pbbg: '',
    },
    glgys: [],
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
    tableData: [], //其他供应商表格表格
    selectedRowIds: [],
    isSelectorOpen1: false,
    isSelectorOpen2: false,
    addGysModalVisible: false,
    addSkzhModalVisible: false,
    addGysModalUrl: '',
    addSkzhModal: '',
    skzhData: [], //收款账号
    staticSkzhData: [],
    fetching: false, //在加载数据
    currentPage: 1, //收款账户数据懒加载页号
    currentKhmc: '', //款账户文本
    isNoMoreData: false, //没有更多数据了
    isSpinning: false, //弹窗加载状态
    radioValue: 1, //单选，默认1->公共账户
    skzhId: '',
  };

  componentDidMount() {
    // this.fetchQueryPaymentAccountList();
  }

  componentWillUnmount() {
  }


  render() {
    const {
      tableData,
      bidInfo,
      uploadFileParams,
      fileList,
      pbbgTurnRed,
      glgys,
      isSpinning,
    } = this.state;
    const {
      currentXmid,
      visible,
      closeModal,
      onSuccess,
    } = this.props;
    console.log("glgysglgysglgys", this.state.glgys)
    const {getFieldDecorator, getFieldValue, setFieldsValue, validateFields} = this.props.form;
    return (
      <>
        <Modal
          wrapClassName="editMessage-modify"
          width={'1000px'}
          maskClosable={false}
          zIndex={100}
          cancelText={'取消'}
          okText={"保存"}
          bodyStyle={{
            padding: '0',
          }}
          title={null}
          visible={visible}
          onOk={() => {
            validateFields(err => {
              if (fileList.length !== 0) {
                //评标报告不为空
                if (!err) {
                  //表单部分必填不为空
                  let arr = [...tableData];
                  let newArr = [];
                  arr.map(item => {
                    let obj = {
                      GYSMC: String(
                        glgys?.filter(x => x.gysmc === item[`gysmc${item.id}`])[0]?.id || '',
                      ),
                      GYSFKZH: '-1',
                      // GYSFKZH: String(
                      //   skzhData?.filter(x => x.khmc === item[`gysskzh${item.id}`])[0]?.id || '',
                      // ),
                    };
                    newArr.push(obj);
                  });
                  newArr.push({});
                  const {zbgys, tbbzj, lybzj, zbgysskzh, pbbg} = bidInfo;
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
                    columnName: 'PBBG',
                    documentData,
                    fileLength,
                    glgys: 0,
                    gysfkzh: Number(
                      // skzhData?.filter(x => x.khmc === getFieldValue('zbgysskzh'))[0]?.id || '',
                      this.state.skzhId,
                    ),
                    ijson: JSON.stringify(newArr),
                    lybzj: Number(getFieldValue('lybzj')),
                    objectName: 'TXMXX_ZBXX',
                    pbbg: fileName,
                    rowcount: tableData.length,
                    tbbzj: Number(getFieldValue('tbbzj')),
                    xmmc: Number(currentXmid),
                    zbgys: Number(
                      glgys?.filter(x => x.gysmc === getFieldValue('zbgys'))[0]?.id || '',
                    ),
                  };
                  console.log('🚀submitdata', submitdata);
                  UpdateZbxx({
                    ...submitdata,
                  }).then(res => {
                    if (res?.code === 1) {
                      // message.success('中标信息修改成功', 1);
                      onSuccess();
                    } else {
                      message.error('信息修改失败', 1);
                    }
                  });
                  this.setState({tableData: []});
                  closeModal();
                }
              } else {
                this.setState({
                  pbbgTurnRed: true,
                });
              }
            });
          }}
          onCancel={() => {
            this.setState({tableData: []});
            closeModal();
          }}
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
              fontSize: '2.333rem',
            }}
          >
            <strong>询比结果录入</strong>
          </div>
          <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="PollResultEnterModel">
            <Form name="nest-messages" style={{padding: '24px'}}>
              <Row>
                <Col span={12}>
                  <Form.Item
                    label="询比项目名称" required
                    className="formItem"
                  >
                    {getFieldDecorator('lybzj', {
                      initialValue: String(bidInfo?.lybzj),
                    })(<Input placeholder="请输入询比项目名称"/>)}
                  </Form.Item>{' '}
                </Col>
                <Col span={12} style={{paddingLeft: '65px', paddingRight: '70px'}}>
                  <Form.Item
                    label="关联需求" required
                    className="formItem"
                  >
                    {getFieldDecorator('tbbzj', {
                      initialValue: String(bidInfo?.tbbzj),
                    })(<Input placeholder="请选择关联需求"/>)}
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
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(PollResultEnterModel));
