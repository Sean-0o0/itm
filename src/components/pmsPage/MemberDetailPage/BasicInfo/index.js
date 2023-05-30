import React, {Component} from 'react';
import {Table, message, Popover, Pagination, Tooltip} from 'antd';
import moment from 'moment';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';

class BasicInfo extends Component {
  state = {};


  render() {
    const {
      data: {
        XTZH = "",
        JL = "",
        SYKH = "",
      }, ryid
    } = this.props;

    return (
      <div className="info-table">
        <div className="top-title">基本信息</div>
        <div className="info-row-box">
          <div
            className="info-item"
            key="系统账号："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>系统账号：</div>
            <div style={{whiteSpace: 'break-spaces'}}>{XTZH || "-"}</div>
          </div>
          <div
            className="info-item"
            key="简历："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>简历：</div>
            <a style={{color: '#3361FF'}}
               href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=JL&PopupWin=false&Table=TWBRY_RYXX&operate=Download&Type=View&ID=${ryid}&fileid=0`}>
              {JL || "-"}</a>
          </div>
          <div
            className="info-item"
            key="系统账号："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>试用期考核情况：</div>
            <div style={{whiteSpace: 'break-spaces'}}>{SYKH || "-"}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
