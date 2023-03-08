import React, { useEffect, useState, Fragment } from 'react';
import { Modal, Button, message } from 'antd';
import { QueryXWHYAFJ } from '../../../../services/pmsServices';
import { connect } from 'dva';
import LBDialog from 'livebos-frame/dist/LBDialog';
import moment from 'moment';
import { DecryptBase64 } from '../../../../components/Common/Encrypt';
import config from '../../../../utils/config';

const { api } = config;
const { pmsServices: { queryXWHYAFJ } } = api;
//提案附件
function AnnexExport(props) {
  const { submitOperate, closeDialog } = props;
  useEffect(() => {
    return () => {};
  }, []);
  // 获取url参数
  const getUrlParams = () => {
    const {
      match: {
        params: { params: encryptParams = '' },
      },
    } = props;
    const params = DecryptBase64(encryptParams);
    console.log('paramsparams', params);
    return params;
  };
  const handleOk = () => {
    // setVisible(false);
    let params = new URLSearchParams();
    params.append("exportPayload", getUrlParams());
    fetch(queryXWHYAFJ, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    }).then(res => {
      return res.blob();
    }).then(blob => {
      let fileName = `信委会议案附件(${new moment().format('YYYYMMDD')}).zip`;
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
      message.success('请求成功，正在导出中', 1);
    }).catch(e => {
      message.error('导出失败', 1);
      console.error('导出失败', e);
    });
    // const exportPayload = JSON.stringify({
    //   hyid: getUrlParams().hyid
    // });
    // const iframe = this.ifile; // iframe的dom
    // const actionUrl = queryZBYSFJ;
    // // 创建一个表单
    // const downloadForm = document.createElement('form');
    // downloadForm.id = 'downloadForm';
    // downloadForm.name = 'downloadForm';
    // // 创建一个输入框
    // const input = document.createElement('input');
    // input.type = 'text';
    // input.name = 'exportPayload';
    // input.value = exportPayload;
    // // 将该输入框插入到 form 中
    // downloadForm.appendChild(input);
    // // form 的提交方式
    // downloadForm.method = 'POST';
    // // form 提交路径
    // downloadForm.action = actionUrl;
    // // 添加到 body 中
    // iframe.appendChild(downloadForm);
    // // 对该 form 执行提交
    // downloadForm.submit();
    // // 删除该 form
    // iframe.removeChild(downloadForm);
    // // this.props.submitOperate();
    // //TODO 需获取表单回调后显示导出成功
    // setTimeout(message.success("导出成功"), 3000)
  };
  const handleCancel = () => {
    closeDialog();
    //  setVisible(false);
  };
  return (
    <Fragment>
      {/* <LBDialog trustedOrigin="*"> */}
        <div>
          <div style={{ padding: '16px 0 0 24px', fontSize: '14px' }}>是否确认导出？</div>
          <div style={{ textAlign: 'end', paddingTop: '8.9rem', paddingRight: '24px' }}>
            <Button className="ant-btn" onClick={handleCancel} style={{ marginRight: '8px' }}>
              取消
            </Button>
            <Button className="ant-btn ant-btn-primary" onClick={handleOk}>
              确定
            </Button>
          </div>
        </div>
      {/* </LBDialog> */}
    </Fragment>
  );
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(AnnexExport);
