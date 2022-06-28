import React from 'react';
import { Button, Modal } from 'antd';
import config from '../../../../../../../../utils/config';

const { api } = config;
const { esa: { querySalaryCheckListExport } } = api;

class Export extends React.Component {
  showConfirm = () => {
    const { count = 0, queryParams = {} } = this.props;
    const iframe = this.ifile; // iframe的dom
    if (count <= 0) {
      Modal.info({ content: '暂无可导出数据!' });
      return;
    }
    Modal.confirm({
      title: '提示：',
      content: `是否导出数据（${count}条）？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const exportParams = JSON.stringify({
          mon: queryParams.mon || '',
          depClass: queryParams.depClass || '',
          orgNo: queryParams.orgNo || '',
          classId: queryParams.classId || '',
          levelId: queryParams.levelId || '',
          status: queryParams.status || '',
        });
        const actionUrl = querySalaryCheckListExport;
        // 创建一个表单
        const downloadForm = document.createElement('form');
        downloadForm.id = 'downloadForm';
        downloadForm.name = 'downloadForm';
        // 创建一个输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'exportParams';
        input.value = exportParams;
        // 将该输入框插入到 form 中
        downloadForm.appendChild(input);
        // form 的提交方式
        downloadForm.method = 'POST';
        // form 提交路径
        downloadForm.action = actionUrl;
        // 添加到 body 中
        iframe.appendChild(downloadForm);
        // 对该 form 执行提交
        downloadForm.submit();
        // 删除该 form
        iframe.removeChild(downloadForm);
      },
    });
  };

  render() {
    const { render } = this.props;
    return (
      render ||
      (
        <div style={{ display: 'inline' }}>
          <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.showConfirm}>导出</Button>
          <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        </div>
      )
    );
  }
}

export default Export;
