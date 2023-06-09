import React, {Component, useEffect} from 'react';
import {Table, message, Popover, Pagination, Tooltip} from 'antd';
import moment from 'moment';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';

export default function AttendanceInfo(props) {
  const {
    data: {
      zc,
      zcrq = [],
      qj,
      qjrq = [],
      jb,
      jbrq = [],
      yc,
      ycrq = [],
      ryid = '',
      xmid = '',
    }, routes = []
  } = props;
  const location = useLocation();
  useEffect(() => {
    return () => {
    };
  }, [props])
  console.log("routes-jjj", routes)

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
          <div>{zc || 0}天</div>
          {
            zcrq.length > 0 &&
            // <Popover
            //   overlayClassName="rq-more-popover"
            //   placement="bottomLeft"
            //   content={
            //     <div className="rq-more">
            //       {zcrq.map((x, index) => (
            //         <div key={index} className="rq-item">
            //           {moment(x.RQ, "YYYY-MM-DD").format("YYYY-MM-DD")}
            //         </div>
            //       ))}
            //     </div>
            //   }
            //   title={null}
            // >
            <Link
              style={{color: '#3361ff'}}
              to={{
                pathname: `/pms/manage/AttendanceListInfo/${EncryptBase64(
                  JSON.stringify({
                    xmid,
                    ryid,
                    //1|正常；2|请假；3|加班；4|考勤异常
                    lxid: '1',
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
              className="table-link-strong"
            >
              &nbsp;&nbsp;查看详情
            </Link>
            // </Popover>
          }
        </div>
        <div
          className="info-item"
          key="请假天数："
          style={{display: 'flex', height: 'unset'}}
        >
          <div style={{flexShrink: 0, color: '#909399'}}>请假天数：</div>
          <div>{qj || 0}天</div>
          {
            qjrq.length > 0 &&
            // <Popover
            //   overlayClassName="rq-more-popover"
            //   placement="bottomLeft"
            //   content={
            //     <div className="rq-more">
            //       {qjrq.map((x, index) => (
            //         <div key={index} className="rq-item">
            //           {moment(x.RQ, "YYYY-MM-DD").format("YYYY-MM-DD")}
            //         </div>
            //       ))}
            //     </div>
            //   }
            //   title={null}
            // >
            <Link
              style={{color: '#3361ff'}}
              to={{
                pathname: `/pms/manage/AttendanceListInfo/${EncryptBase64(
                  JSON.stringify({
                    xmid,
                    ryid,
                    lxid: '2',
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
              className="table-link-strong"
            >
              &nbsp;&nbsp;查看详情
            </Link>
            // </Popover>
          }
        </div>
        <div
          className="info-item"
          key="加班天数："
          style={{display: 'flex', height: 'unset'}}
        >
          <div style={{flexShrink: 0, color: '#909399'}}>加班天数：</div>
          <div>{jb || 0}天</div>
          {
            jbrq.length > 0 &&
            // <Popover
            //   overlayClassName="rq-more-popover"
            //   placement="bottomLeft"
            //   content={
            //     <div className="rq-more">
            //       {jbrq.map((x, index) => (
            //         <div key={index} className="rq-item">
            //           {moment(x.RQ, "YYYY-MM-DD").format("YYYY-MM-DD")}
            //         </div>
            //       ))}
            //     </div>
            //   }
            //   title={null}
            // >
            <Link
              style={{color: '#3361ff'}}
              to={{
                pathname: `/pms/manage/AttendanceListInfo/${EncryptBase64(
                  JSON.stringify({
                    xmid,
                    ryid,
                    lxid: '3',
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
              className="table-link-strong"
            >
              &nbsp;&nbsp;查看详情
            </Link>
            // </Popover>
          }
        </div>
        <div
          className="info-item"
          key="考勤异常天数："
          style={{display: 'flex', height: 'unset'}}
        >
          <div style={{flexShrink: 0, color: '#909399'}}>考勤异常天数：</div>
          <div>{yc || 0}天</div>
          {
            ycrq.length > 0 &&
            // <Popover
            //   overlayClassName="rq-more-popover"
            //   placement="bottomLeft"
            //   content={
            //     <div className="rq-more">
            //       {ycrq.map((x, index) => (
            //         <div key={index} className="rq-item">
            //           {moment(x.RQ, "YYYY-MM-DD").format("YYYY-MM-DD")}
            //         </div>
            //       ))}
            //     </div>
            //   }
            //   title={null}
            // >
            <Link
              style={{color: '#3361ff'}}
              to={{
                pathname: `/pms/manage/AttendanceListInfo/${EncryptBase64(
                  JSON.stringify({
                    xmid,
                    ryid,
                    lxid: '4',
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
              className="table-link-strong"
            >
              &nbsp;&nbsp;查看详情
            </Link>
            // </Popover>
          }
        </div>
      </div>
    </div>
  );
}
