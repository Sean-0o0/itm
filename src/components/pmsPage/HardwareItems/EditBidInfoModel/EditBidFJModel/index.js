/**
 * 项目跟踪信息编辑弹窗页面
 */
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  message,
  Select,
  Spin,
  Button, Icon, Upload,
} from 'antd';

const {Option} = Select;
import React from 'react';
import {connect} from 'dva';
import {FetchQueryHWTenderFile} from "../../../../../services/projectManage";

class EditBidFJModel extends React.Component {
  state = {
    isSpinning: false,
    fileListTempBD: {},
    uploadFileParamsBD: [],
  };

  componentDidMount() {
    const {bdid, uploadFileParams, fileListTemp} = this.props
    if (typeof (bdid) !== 'number') {
      this.queryFileInfo(bdid)
    } else {
      this.setState({
        isSpinning: false,
        uploadFileParamsBD: [...uploadFileParams],
        fileListTempBD: {...fileListTemp}
      })
    }
  }

  getUuid = () => {
    var s = [];
    var hexDigits = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    let uuid = s.join('');
    return uuid;
  };

  queryFileInfo = (id) => {
    const {uploadFileParams, fileListTemp} = this.props
    this.setState({
      isSpinning: true,
    })
    //查询标段信息的附件信息
    //存放子表格附件数据
    let arr1 = [];
    let arr2 = [];
    //存放子表格附件数据
    let uploadBDtemp = [];
    let fileListtemp = {};
    FetchQueryHWTenderFile({
      id,
    }).then(r => {
      if (r.success) {
        const FileInfo = JSON.parse(r.fileInfo)
        if (FileInfo.length > 0) {
          FileInfo.map(item => {
            const uuid = this.getUuid();
            arr1.push({
              BDID: id,
              uid: uuid,
              name: item.fileName,
              status: 'done',
              url: item.url,
              base64: item.data,
            });
            arr2.push({
              SFYWJ: 'no',
              uid: uuid,
              BDID: id,
              documentData: item.data,
              fileName: item.fileName,
            });
          });
          console.log("arrTemp2arrTemp2", arr1)
          console.log("arrTemparrTemp", arr2)
        }
        fileListtemp[id] = [...arr1]
        uploadBDtemp.push(...arr2);
        // console.log("cccccc-1111",fileListtemp)
        // console.log("cccccc-2222",uploadBDtemp)
        // console.log("uploadFileParamsuploadFileParams",uploadFileParams)
        // console.log("fileListTempfileListTemp",fileListTemp)
        this.setState({
          isSpinning: false,
          uploadFileParamsBD: [...uploadBDtemp, ...uploadFileParams],
          fileListTempBD: {...fileListtemp, ...fileListTemp}
        })
      }
    })
  }

  handleParamsCallback = () => {
    const {handleParamsCallback} = this.props
    const {uploadFileParamsBD} = this.state;
    console.log("uploadFileParamsBD-back", uploadFileParamsBD)
    handleParamsCallback && handleParamsCallback(uploadFileParamsBD)
  }

  handleFileCallback = () => {
    const {handleFileCallback} = this.props
    const {fileListTempBD} = this.state;
    console.log("fileListTempBD-back", fileListTempBD)
    handleFileCallback && handleFileCallback(fileListTempBD)
  }

  handleOnOk = () => {
    const {closeModal} = this.props;
    this.handleParamsCallback()
    this.handleFileCallback()
    closeModal && closeModal();
  }

  render() {
    const {
      isSpinning = false,
      fileListTempBD,
      uploadFileParamsBD,
    } = this.state;
    const {
      closeModal,
      bdid,
    } = this.props;
    return (
      <>
        <Modal
          wrapClassName="editMessage-modify"
          style={{top: '80px'}}
          width={'860px'}
          height={'860px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={closeModal}
          maskClosable={false}
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
                onClick={() => this.handleOnOk()}
              >
                确定
              </Button>
            </div>
          }
          visible={closeModal}
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
            <strong>修改标段附件</strong>
          </div>
          <Spin
            spinning={isSpinning}
            style={{position: 'fixed'}}
            tip="加载中"
            size="large"
            wrapperClassName="contrast-signing-modal-spin"
          >
            <div style={{padding: '16px 24px'}}>
              <div className="steps-content">
                <React.Fragment>
                  标段附件:&nbsp;&nbsp;
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
                      console.log('目前info', info);
                      let fileList = [...info.fileList];
                      let newArr = [];
                      if (fileList.filter(item => item.originFileObj !== undefined).length === 0) {
                        fileList.forEach(item => {
                          newArr.push({
                            SFYWJ: 'yes',
                            BDID: bdid,
                            uid: item.uid,
                            fileName: item.name,
                            documentData: item.base64,
                          });
                        });
                        if (newArr.length === fileList.length) {
                          this.setState({
                            uploadFileParamsBD: [...newArr],
                          })
                          // this.handleParamsCallback([...newArr]);
                        }
                      } else {
                        fileList.forEach(item => {
                          console.log('item.originFileObj', item.originFileObj);
                          if (item.originFileObj === undefined) {
                            newArr.push({
                              BDID: bdid,
                              uid: item.uid,
                              fileName: item.name,
                              documentData: item.base64,
                              // name: item.name,
                              // base64: item.base64,
                            });
                          } else {
                            let reader = new FileReader(); //实例化文件读取对象
                            reader.readAsDataURL(item.originFileObj); //将文件读取为 DataURL,也就是base64编码
                            reader.onload = e => {
                              let urlArr = e.target.result.split(',');
                              newArr.push({
                                SFYWJ: 'yes',
                                BDID: bdid,
                                uid: item.uid,
                                fileName: item.name,
                                documentData: urlArr[1],
                                // name: item.name,
                                // base64: urlArr[1],
                              });
                              if (newArr.length === fileList.length) {
                                this.setState({
                                  uploadFileParamsBD: [...newArr],
                                })
                                // this.handleParamsCallback([...newArr]);
                              }
                            };
                          }
                        });
                      }

                      this.setState({
                        fileListTempBD: {[bdid]: [...fileList]},
                      })
                      // this.handleFileCallback(fileList);
                    }}
                    beforeUpload={(file, fileList) => {
                      let arr = [];
                      console.log('目前fileList3333', fileList);
                      fileList.forEach(item => {
                        item.BDID = bdid;
                        let reader = new FileReader(); //实例化文件读取对象
                        reader.readAsDataURL(item); //将文件读取为 DataURL,也就是base64编码
                        console.log("item-cccc", item)
                        console.log("bdid", bdid)
                        reader.onload = e => {
                          let urlArr = e.target.result.split(',');
                          arr.push({
                            SFYWJ: 'yes',
                            BDID: bdid,
                            uid: item.uid,
                            fileName: item.name,
                            documentData: urlArr[1],
                          });
                          console.log("[...uploadFileParamsBD,...arr]-arrr", arr)
                          if (arr.length === fileList.length) {
                            this.setState({
                              uploadFileParamsBD: [...uploadFileParamsBD, ...arr],
                            });
                          }
                        };
                      });
                    }}
                    onRemove={(file, fileList) => {
                      console.log('file.uid', file.uid);
                      let newList = this.state.fileListTempBD
                      for (let key in newList) {
                        newList[key] = newList[key].filter(item => item.uid !== file.uid)
                      }
                      let newuploadFileList = this.state.uploadFileParamsBD
                      newuploadFileList = newuploadFileList.filter(item => item.uid !== file.uid);
                      console.log('fileListTempBD--cc-333', newList);
                      console.log('uploadFileParamsBD--cc-333', newuploadFileList);
                      this.setState({
                        fileListTempBD: newList,
                        uploadFileParamsBD: newuploadFileList
                      })
                    }}
                    accept={
                      '.zip,.rar,.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    }
                    fileList={fileListTempBD[bdid]}
                  >
                    <Button type="dashed">
                      <Icon type="upload"/>
                      点击上传
                    </Button>
                  </Upload>
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
}))(Form.create()(EditBidFJModel));
