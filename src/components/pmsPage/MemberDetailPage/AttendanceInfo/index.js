import React, {Component} from 'react';
import {Table, message, Popover, Pagination, Tooltip} from 'antd';
import moment from 'moment';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';

class AttendanceInfo extends Component {
  state = {};


  render() {
    const {
      data: {
        zc,
        qj,
        qjrq = [],
        jb,
        jbrq = [],
        yc,
        ycrq = [],
      }
    } = this.props;


    return (
      <div className="info-table">
        <div className="top-title">考勤信息</div>
        <div className="info-row-box">
          <div
            className="info-item"
            key="正常天数："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>正常天数：</div>
            <div style={{whiteSpace: 'break-spaces'}}>{zc}天</div>
          </div>
          <div
            className="info-item"
            key="请假天数："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>请假天数：</div>
            <div style={{whiteSpace: 'break-spaces'}}>{qj}天</div>
            <Popover
              overlayClassName="rq-more-popover"
              placement="bottomLeft"
              content={
                <div className="rq-more">
                  {qjrq.map((x, index) => (
                    <div key={index} className="rq-item">
                      {moment(x.RQ, "YYYY-MM-DD").format("YYYY-MM-DD")}
                    </div>
                  ))}
                </div>
              }
              title={null}
            >
              <a style={{color: '#3361ff'}}>&nbsp;&nbsp;查看详情</a>
            </Popover>
          </div>
          <div
            className="info-item"
            key="加班天数："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>加班天数：</div>
            <div style={{whiteSpace: 'break-spaces'}}>{jb}天</div>
            <Popover
              overlayClassName="rq-more-popover"
              placement="bottomLeft"
              content={
                <div className="rq-more">
                  {jbrq.map((x, index) => (
                    <div key={index} className="rq-item">
                      {moment(x.RQ, "YYYY-MM-DD").format("YYYY-MM-DD")}
                    </div>
                  ))}
                </div>
              }
              title={null}
            >
              <a style={{color: '#3361ff'}}>&nbsp;&nbsp;查看详情</a>
            </Popover>
          </div>
          <div
            className="info-item"
            key="考勤异常天数："
            style={{display: 'flex', height: 'unset'}}
          >
            <div style={{flexShrink: 0, color: '#909399'}}>考勤异常天数：</div>
            <div style={{whiteSpace: 'break-spaces'}}>{yc}天</div>
            <Popover
              overlayClassName="rq-more-popover"
              placement="bottomLeft"
              content={
                <div className="rq-more">
                  {ycrq.map((x, index) => (
                    <div key={index} className="rq-item">
                      {moment(x.RQ, "YYYY-MM-DD").format("YYYY-MM-DD")}
                    </div>
                  ))}
                </div>
              }
              title={null}
            >
              <a style={{color: '#3361ff'}}>&nbsp;&nbsp;查看详情</a>
            </Popover>
          </div>
        </div>
      </div>
    );
  }
}

export default AttendanceInfo;
