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
            <div style={{whiteSpace: 'break-spaces'}}>{XTZH}</div>
          </div>
          <div
            className="info-item"
            key="简历："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>简历：</div>
            <a style={{color: '#3361FF'}}
               href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?EVENT_SOURCE=Download&Table=TWBRY_RYXX&ID=${ryid}&Column=JL&Type=View&fileid=0`}>
              {JL}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
