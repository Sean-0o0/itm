import React from 'react';
import { connect } from 'dva';
import { Icon, Upload, message, Button } from 'antd';
import _array from 'lodash/array';
import { DeletMessageFile } from '../../../../services/basicservices/message';
// import htmlToDraft from 'html-to-draftjs';
import config from '../../../../utils/config';
import { getVersion } from '../../../../utils/request';

const { api } = config;
const { basicservices: {
  sendMessageFile,
  deletMessageFile,
  getMessageFile,
} } = api;

const sendMessageFileversion = getVersion(sendMessageFile); // 因为走蚂蚁的组件，需要在这边设置请求头

class FileUploadButton extends React.Component {
  constructor(props) {
    super(props);
    const { att = '', attPath } = this.props;
    const paths = attPath ? attPath.split(',') : [];
    const tempFileList = [];
    att.split(',').forEach((item, index) => {
      if (item) {
        const url = _array.nth(paths, index);
        let md5 = 0;
        if (url.indexOf('ATT') > 0) {
          md5 = url.substring(url.indexOf('Column=') + 7, url.indexOf('&'));
        }
        tempFileList.push({
          name: item,
          status: 'done',
          uid: md5,
          url: `${localStorage.getItem('livebos') || ''}${_array.nth(paths, index)}`,
          response: { data: { md5: `服务器附件${md5}` } },
        });
      }
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        fileList: tempFileList,
      });
    }
    this.state = {
      fileList: tempFileList,
    };
  }
  onRemove = async (file) => {
    const { response: tempResponse = {} } = file;
    const { data = {} } = tempResponse;
    const { md5 = '' } = data || {};
    // let result = true;
    if (md5) {
      const url = deletMessageFile + md5;
      DeletMessageFile(url);
    //   const responst = await DeletMessageFile(url).catch((error) => {
    //     // message.error(!error.success ? error.message : error.note);
    //     result = true;
    //   }) || {};
    //   const { code = 0 } = responst;
    //   if (code < 0) {
    //     // message.error(note);
    //     result = true;
    //   }
    }
    return true;
  }
  beforeUpload = (file) => {
    const isLt32M = file.size / 1024 / 1024 < 32;
    if (!isLt32M) {
      message.error('附件大小不能超过 32MB!');
    }
    return isLt32M;
  }
  resetFileList = (fileList) => {
    let tempFileList = [];
    const md5s = new Set();
    if (fileList.length > 3) {
      message.error('最多只能上传三个文件');
    }
    fileList.forEach((file, index) => {
      if (index <= 2) {
        const { response: tempResponse = {} } = file;
        const { data = {} } = tempResponse;
        const { md5 = '' } = data || {};
        md5s.add(md5);
      }
    });
    const tempMd5s = Array.from(md5s);
    tempMd5s.forEach((item) => {
      const tempIndex = fileList.findIndex((temp) => {
        const { response: tempResponse = {} } = temp;
        const { data = {} } = tempResponse;
        const { md5 = '' } = data || {};
        return item === md5;
      });
      if (tempIndex >= 0) {
        tempFileList.push(fileList[tempIndex]);
      }
    });
    tempFileList = tempFileList.length > 0 ? tempFileList : fileList;
    if (tempFileList.length > 3) {
      tempFileList.splice(0, 1);
    }
    this.setState({
      fileList: tempFileList,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        fileList: tempFileList,
      });
    }
  }
  handleChange = (info) => {
    const { file, fileList } = info;
    const { status = '', percent = 0, response = {} } = file || {};
    if (status !== 'uploading') {
      if (parseInt(percent, 10) === 100 || status === 'error') {
        const { message: fileMessage = '', code = -1, note = '' } = response;
        if (code < 0) {
          const { uid = '' } = file;
          if (uid) {
            const tempIndex = fileList.findIndex((item) => { return item.uid === uid; });
            if (tempIndex >= 0) {
              fileList.splice(tempIndex, 1);
            }
          }
          message.error(fileMessage || note || '文件上传错误');
        }
      }
    } else {
      // 校验大小
      const { sysParam = [] } = this.props;
      const tempIndex = sysParam.findIndex((item) => { return item.csmc === 'CRMII_MAIL_ATTACHMENT_MAXSIZE'; });
      const size = tempIndex >= 0 ? parseInt(sysParam[tempIndex].csz || 32, 10) : 32;
      const isLt32M = file.size / 1024 / 1024 < size;
      if (!isLt32M) {
        const { uid = '' } = file;
        if (uid) {
          const tempIndex1 = fileList.findIndex((item) => { return item.uid === uid; });
          if (tempIndex1 >= 0) {
            fileList.splice(tempIndex1, 1);
          }
        }
        message.error(`附件大小不能超过${size}MB!`);
      }
    }
    if (Array.isArray(fileList)) {
      this.resetFileList(fileList);
    }
    return true;
  }
  render() {
    const { fileList = [] } = this.state;
    const { disabled = false } = this.props;
    const tempFileList = [];
    fileList.forEach((item) => {
      const { response: tempResponse = {} } = item;
      const { data = {} } = tempResponse;
      const { md5 = '' } = data || {};
      if (md5.indexOf('服务器') < 0) {
        tempFileList.push({
          ...item,
          url: `${getMessageFile}${md5}`, // 下载地址
        });
      } else {
        tempFileList.push({
          ...item,
        });
      }
    });
    const upLoadProps = {
      showUploadList: true,
      // beforeUpload: this.beforeUpload,
      fileList: tempFileList,
      action: sendMessageFile,
      headers: {
        apiVersion: sendMessageFileversion,
      },
      onChange: this.handleChange,
      onRemove: this.onRemove,
    };
    return (
      <Upload
        {...upLoadProps}
      >
        {/* <div className={styles.m_icon}>
          <div className="rdw-option-wrapper" title="上传附件">
            <Icon type="upload" style={{ fontSize: 16, color: '#08c' }} />
          </div>
        </div> */}
        <Button disabled={disabled}>
          <Icon type="upload" /> 点击上传附件
        </Button>
      </Upload>
    );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(FileUploadButton);
