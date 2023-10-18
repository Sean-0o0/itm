import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip, Table, Popover } from 'antd';
import moment from 'moment';
import config from '../../../../utils/config';
import axios from 'axios';

const { api } = config;
const {
  pmsServices: { queryFileStream, zipLivebosFilesRowsPost },
} = api;

export default function DemandTable(props) {
  const { dtlData = {}, fqrid, setIsSpinning, isDock, xqid } = props;
  const { XQNR = [], XQSX_ORIGIN = [], JLXX = [], XQXQ = [], XMXX = {} } = dtlData;
  useEffect(() => {
    return () => {};
  }, []);

  const getDateItem = (label, date) => {
    // console.log("🚀 ~ file: index.js:20 ~ getDateItem ~ date:", date)
    if (date !== undefined)
      return (
        <div className="date-item" key={label}>
          <span>{label}</span>
          {moment(date).format('YYYY-MM-DD')}
        </div>
      );
    return null;
  };

  const columns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      width: '10%',
      key: 'RYDJ',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Tooltip title={txt + ` | ` + row.GW} placement="topLeft">
            <span style={{ cursor: 'default' }}>{txt + ` | ` + row.GW}</span>
          </Tooltip>
        );
      },
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
        <Tooltip
          title={text?.replace(/<br>/g, '\n')}
          placement="topLeft"
          overlayClassName="pre-wrap-tooltip"
        >
          <span style={{ cursor: 'default' }}>{text?.replace(/<br>/g, '')}</span>
        </Tooltip>
      ),
    },
    {
      title: '备注',
      dataIndex: 'BZ',
      key: 'BZ',
      ellipsis: true,
      render: text => (
        <Tooltip
          title={text?.replace(/<br>/g, '\n')}
          placement="topLeft"
          overlayClassName="pre-wrap-tooltip"
        >
          <span style={{ cursor: 'default' }}>{text?.replace(/<br>/g, '')}</span>
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
        {getDateItem('供应商反馈期限：', XQNR[0]?.KFSFKQX)}
        {/* {getDateItem('预计初筛日期：', XQNR[0]?.CSRQ)} */}
        {getDateItem('预计综合评测日期：', XQNR[0]?.YJZHPCRQ)}
        {getDateItem('预计试用日期：', XQNR[0]?.YJSYRQ)}
        {getDateItem('需求上架日期：', XQNR[0]?.XQSJRQ)}
      </div>
      <div className="table-box">
        <Table columns={columns} rowKey={'XQNRID'} dataSource={XQNR} pagination={false} />
      </div>
    </div>
  );
}
