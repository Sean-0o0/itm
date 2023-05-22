import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip, Table } from 'antd';
import moment from 'moment';

export default function DemandTable(props) {
  const { dtlData = {} } = props;
  const { XQNR = [] } = dtlData;
  useEffect(() => {
    return () => {};
  }, []);

  const getDateItem = (label, date) => {
    return (
      <div className="date-item" key={label}>
        <span>{label}</span>
        {moment(date).format('YYYY-MM-DD')}
      </div>
    );
  };

  const columns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      width: '10%',
      key: 'RYDJ',
      ellipsis: true,
      render: (txt, row) => txt + ` | ` + row.GW,
    },
    {
      title: '人员数量',
      dataIndex: 'RYSL',
      width: '10%',
      align: 'right',
      key: 'RYSL',
      ellipsis: true,
    },
    {
      title: '人员时长(人/月)',
      dataIndex: 'SC',
      width: '12%',
      align: 'right',
      key: 'SC',
      ellipsis: true,
    },
    {
      title: '需求内容',
      dataIndex: 'YQ',
      key: 'YQ',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '预估预算(元)',
      dataIndex: 'YGYS',
      width: '10%',
      align: 'right',
      key: 'YGYS',
      ellipsis: true,
    },
  ];

  if (XQNR.length === 0) return null;
  return (
    <div className="demand-table-box info-box">
      <div className="title">需求信息</div>
      <div className="date-row">
        {getDateItem('开发商反馈期限：', XQNR[0]?.KFSRQ)}
        {getDateItem('预计初筛日期：', XQNR[0]?.CSRQ)}
        {getDateItem('预计综合评测日期：', XQNR[0]?.PCRQ)}
        {getDateItem('预计试用日期：', XQNR[0]?.SYRQ)}
      </div>
      <div className="table-box">
        <Table columns={columns} rowKey={'XQNRID'} dataSource={XQNR} pagination={false} />
      </div>
    </div>
  );
}
