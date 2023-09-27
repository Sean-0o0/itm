import React, { Component } from 'react';
import { Table, message, Popover, Pagination, Tooltip } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';

class BasicInfo extends Component {
  state = {};

  render() {
    const {
      data: { XTZH = '', JL = '', SYKH = '', RYZT = '', BMXY = '', RCSJ = null, LCSJ = null },
      ryid,
    } = this.props;

    return (
      <div className="info-table">
        <div className="top-title">基本信息</div>
        <div className="info-row-box">
          <div className="info-item" key="系统账号：" style={{ display: 'flex', height: 'unset' }}>
            <div style={{ flexShrink: 0, color: '#909399' }}>系统账号：</div>
            <div style={{ whiteSpace: 'break-spaces' }}>{XTZH || '暂无'}</div>
          </div>
          <div className="info-item" key="简历：" style={{ display: 'flex', height: 'unset' }}>
            <div style={{ flexShrink: 0, color: '#909399' }}>简历：</div>
            <Tooltip title={JL || <span style={{ color: '#303133' }}>暂无</span>}>
              <a
                style={{ color: '#3361FF' }}
                href={`${localStorage.getItem('livebos') ||
                  ''}/OperateProcessor?Column=JL&PopupWin=false&Table=TWBRY_RYXX&operate=Download&Type=View&ID=${ryid}&fileid=0`}
              >
                {JL.length > 18
                  ? JL.slice(0, 7) +
                    '...' +
                    JL.split('.')[0].slice(JL.split('.')[0].length - 7, JL.split('.')[0].length) +
                    '.' +
                    JL.split('.')[1]
                  : JL || <span style={{ color: '#303133' }}>暂无</span>}
              </a>
              {/*{JL || <span style={{color: '#303133'}}>暂无</span>}</a>*/}
            </Tooltip>
          </div>
          <div className="info-item" key="保密协议：" style={{ display: 'flex', height: 'unset' }}>
            <div style={{ flexShrink: 0, color: '#909399' }}>保密协议：</div>
            <Tooltip title={BMXY || <span style={{ color: '#303133' }}>暂无</span>}>
              <a
                style={{ color: '#3361FF' }}
                href={`${localStorage.getItem('livebos') ||
                  ''}/OperateProcessor?Column=BMXY&PopupWin=false&Table=TWBRY_RYXX&operate=Download&Type=View&ID=${ryid}&fileid=0`}
              >
                {BMXY || <span style={{ color: '#303133' }}>暂无</span>}
              </a>
            </Tooltip>
          </div>
          <div
            className="info-item"
            key="试用期考核情况："
            style={{ display: 'flex', height: 'unset' }}
          >
            <div style={{ flexShrink: 0, color: '#909399' }}>试用期考核情况：</div>
            <div style={{ whiteSpace: 'break-spaces' }}>{SYKH || '暂无'}</div>
          </div>
          <div className="info-item" key="人员状态：" style={{ display: 'flex', height: 'unset' }}>
            <div style={{ flexShrink: 0, color: '#909399' }}>人员状态：</div>
            <div style={{ whiteSpace: 'break-spaces' }}>{RYZT || '暂无'}</div>
          </div>
          <div className="info-item" key="入场时间：" style={{ display: 'flex', height: 'unset' }}>
            <div style={{ flexShrink: 0, color: '#909399' }}>入场时间：</div>
            <div style={{ whiteSpace: 'break-spaces' }}>
              {(RCSJ && RCSJ.format('YYYY年MM月DD日')) || '暂无'}
            </div>
          </div>
          {RYZT === '离场' && (
            <div
              className="info-item"
              key="离场时间："
              style={{ display: 'flex', height: 'unset' }}
            >
              <div style={{ flexShrink: 0, color: '#909399' }}>离场时间：</div>
              <div style={{ whiteSpace: 'break-spaces' }}>
                {(LCSJ && LCSJ.format('YYYY年MM月DD日')) || '暂无'}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BasicInfo;
