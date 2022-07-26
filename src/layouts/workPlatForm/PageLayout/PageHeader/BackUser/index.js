import React from 'react';
import { Modal, message } from 'antd';
import { FetchTokenAuth } from '../../../../../services/token';
import { AES } from '../../../../../utils/aes_utils';
import { APP_SECRET, CLIENTID } from '../../../../../utils/config';

const { confirm } = Modal;
export default class BackUser extends React.PureComponent {

  showConfirm = () => {
    const userId = localStorage.getItem('firstUserID') || '';
    confirm({
      title: '提示：',
      content: `是否切回初始用户{${userId}}？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const obj = { timestamp: new Date().getTime(), target: userId };
        let objJson = '{}';
        try {
          objJson = JSON.stringify(obj);
        } catch (e) {
        // do not
        }
        AES.setSecret(APP_SECRET);
        const config = {
          headers: { 'X-Auth-Token': AES.encryptBase64(objJson) },
        };
        FetchTokenAuth({
          CLIENTID,
        }, config).then((result) => {
          const { code = -1 } = result;
          if (code) {
            window.location.href = '';
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() {},
    });
  }
  render() {
    return (
      <span className="m-dropdown">
        <div className="m-dropdown-title ant-dropdown-trigger">
          <a onClick={this.showConfirm} title="切回初始账户" style={{ display: 'inline-block', width: '100%', height: '100%' }}>
            <i className="iconfont icon-down-solid-arrow"/>
          </a>
        </div>
      </span>
    );
  }
}
