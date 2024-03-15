/*
 * @Author: 钟海秀(创新业务产品部) zhonghaixiu12534@apexsoft.com.cn
 * @Date: 2024-03-08 14:47:05
 * @LastEditTime: 2024-03-13 21:56:55
 * @FilePath: \pro-pms-fe\src\components\pmsPage\HomePage\PrjDynamic\index.js
 * @Descripttion: 项目动态
 */
import React, { useEffect, useState, useRef } from 'react';
import { Button, message, Pagination, Tooltip } from 'antd';
import moment from 'moment';

export default function PrjDynamic(props) {
  const { dynamicData = [], setDynamicData = () => {} } = props;
  const { data = [], current = 1, pageSize = 5, total = -1 } = dynamicData;
  useEffect(() => {
    //要记得去掉
    setDynamicData(p => ({ ...p, data: Array.from({ length: 5 }, (_, i) => i), total: 1000 }));
    return () => {};
  }, []);
  const handlePageChange = (current, pageSize) => {
    setDynamicData(p => ({ ...p, current, pageSize }));
  };
  return (
    <div className="prj-dynamic-box">
      <div className="home-card-title-box" style={{ marginBottom: 9 }}>
        项目动态
        <span>
          <a
            to={{
              // pathname: `/pms/manage/SupplierSituation`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            }}
          >
            全部
            <i className="iconfont icon-right" />
          </a>
        </span>
      </div>
      <div className="dynamic-box">
        {data.map(x => getDynamicItem())}
        <div className="page-row">
          <Pagination
            size="small"
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showLessItems
          />
        </div>
      </div>
    </div>
  );
}

//项目动态子块
const getDynamicItem = () => {
  return (
    <div className="dynamic-item">
      <div className="info-row">
        <div className="gray-dot"></div>
        <div className="info-name">朱燕朱燕</div>
        <div className="info-opr">发起了</div>
        <div className="process-name">
          <Tooltip title={'合同签署流程'} placement="topLeft">
            合同签署流程合同签署流程合同签署流程合同签署流程
          </Tooltip>
        </div>
        <div className="info-time">{timeFormatter()}</div>
      </div>
      <div className="prj-row">
        <div className="prj-name">
          <Tooltip title={'项目名称项目名称项目名称项目名称'} placement="topLeft">
            项目名称项目名称项目名称项目名称项目名称项目名称项目名称项目名称
          </Tooltip>
        </div>
        <i className="iconfont icon-right" />
      </div>
    </div>
  );
};

// 格式化时间
const timeFormatter = (timeStr = moment().format('YYYYMMDDHHmmss')) => {
  // const timeStr = '2019-08-19 16:19:23';
  const Now = moment().format('YYYYMMDDHHmmss'); // 当前时间
  const EOTs = moment(Now).diff(timeStr, 'seconds', true); // 时差--秒
  const EOTm = moment(Now).diff(timeStr, 'minutes', true); // 时差--分钟
  let timeDiff = '--';
  if (timeStr) {
    if (parseInt(Now.slice(0, 4), 10) > parseInt(timeStr.slice(0, 4), 10)) {
      timeDiff = `${moment(timeStr, 'YYYYMMDDHHmmss').format('YYYYMMDD')}`;
    } else if (EOTs < 60) {
      timeDiff = '刚刚';
    } else if (EOTm >= 1 && EOTm < 60) {
      timeDiff = `${Math.round(EOTm)}分钟前`;
    } else if (
      EOTm >= 60 &&
      moment(timeStr, 'YYYYMMDDHHmmss') > moment().startOf('day') &&
      moment(timeStr, 'YYYYMMDDHHmmss') < moment().endOf('day')
    ) {
      timeDiff = `${Math.round(EOTm / 60)}小时前`;
    } else if (
      moment(timeStr, 'YYYYMMDDHHmmss') >
        moment()
          .subtract(1, 'd')
          .startOf('day') &&
      moment(timeStr, 'YYYYMMDDHHmmss') <
        moment()
          .subtract(1, 'd')
          .endOf('day')
    ) {
      timeDiff = `昨天${moment(timeStr, 'YYYYMMDDHHmmss').format('HH:mm')}`;
    } else if (moment(timeStr, 'YYYYMMDDHHmmss').year() === moment().year()) {
      timeDiff = `${moment(timeStr, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}`;
    } else {
      timeDiff = `${moment(timeStr, 'YYYYMMDDHHmmss').format('MM-DD')}`;
    }
  }
  return timeDiff;
};