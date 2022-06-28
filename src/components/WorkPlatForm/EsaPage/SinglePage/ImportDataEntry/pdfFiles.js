/* eslint-disable react/no-string-refs */
import React, { Fragment } from 'react';
import { Button, Upload, message, Icon } from 'antd';
import config from '../../../../../utils/config';

const { api } = config;
const { esa: { docsUpload, assessmentDataImport } } = api;

class pdfFiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaValList: '',  // 附件信息
      excelData: '',  // 附件内容
    };
  }

  componentDidMount() {
  }

  // 删除附件
  delArea = () => {
    this.setState({ areaValList: '', excelData: '' });
  };

  // 提供给父组件调用的一个方法
  funToReturnList = () => {
    const { areaValList, excelData } = this.state;
    return [areaValList, excelData];
  }

  // 渲染附件
  renderArea = () => {
    const { areaValList } = this.state;
    let commHtml = '';
    if (areaValList) {
      commHtml =
        <div className="ant-upload-list ant-upload-list-text">
          <div className="ant-upload-list-item ant-upload-list-item-done">
            <div className="ant-upload-list-item-info" style={{ lineHeight: '22px', height: '22px' }}>
              <a><span>{areaValList.name}</span></a>
              <a style={{ position: 'relative', top: '2px', left: '6px' }} onClick={(e) => { this.delArea(); e.stopPropagation(); }}><i className=" iconfont icon-shut" /></a>
            </div>
          </div>
        </div>
    }
    return commHtml;
  }

  // 导入操作
  handleExcelImport = (resp, file) => {
    const formdata = new FormData();
    formdata.append('file', file);
    const url = docsUpload;
    fetch(url, {
      method: 'POST',
      body: formdata,
    }).then((response) => {
      return response.json();
    }).then((res) => {
      const { data, code } = res;
      if (code === 1) {
        this.setState({ areaValList: data })
        const { fj = '', note } = resp;
        if (resp.code > 0) {
          this.setState({excelData: fj})
          message.success("文件导入成功");
        } else {
          message.error(note);
          this.delArea();
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.delArea();
    });
  }

  render() {
    const { areaValList } = this.state;
    const uploadProps = {
      name: 'file',
      accept: '.xls,.xlsx',
      action: assessmentDataImport,
      showUploadList: false,
      onSuccess: this.handleExcelImport,
    };
    return (
      <Fragment>
        <div>
          <Upload {...uploadProps}>
            <Button className="tg-add-btn">
              <Icon type="file-pdf" style={{ fontSize: '16px' }} className="tg-default" /><span>点击添加附件</span>
            </Button>
          </Upload>
          {this.renderArea()}
        </div>
      </Fragment>
    );
  }
}
export default pdfFiles;
