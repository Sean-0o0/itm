import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip, Table } from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

export default function EvaluationTable(props) {
  const { dtlData = {}, dictionary = {} } = props;
  const { ZHPC = [] } = dtlData;
  const { DFZT, LYZT } = dictionary;
  const location = useLocation();

  useEffect(() => {
    return () => {};
  }, []);

  const columns = [
    {
      title: '人员需求',
      dataIndex: 'RYXQ',
      width: '10%',
      // align: 'center',
      key: 'RYXQ',
      ellipsis: true,
    },
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      width: '20%',
      key: 'GYSMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              to={{
                pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  JSON.stringify({ splId: row.GYSID }),
                )}`,
                state: {
                  routes: [{ name: '需求详情', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {text}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '7%',
      key: 'RYMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.RYID,
                }),
              )}`,
              state: {
                routes: [{ name: '需求详情', pathname: location.pathname }],
              },
            }}
            className="table-link-strong"
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: '评测人员',
      dataIndex: 'PCRY',
      width: '12%',
      key: 'PCRY',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '综合评测时间',
      dataIndex: 'ZHPCSJ',
      width: '13%',
      key: 'ZHPCSJ',
      ellipsis: true,
      render: (txt, row) => (txt && moment(txt).format('YYYY-MM-DD HH:mm')) || '--',
    },
    {
      title: '综合评测分数',
      dataIndex: 'ZHPCFS',
      width: '10%',
      align: 'center',
      key: 'ZHPCFS',
      ellipsis: true,
    },
    {
      title: '打分状态',
      dataIndex: 'DFZT',
      width: '8%',
      key: 'DFZT',
      ellipsis: true,
      render: txt => DFZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用状态',
      dataIndex: 'LYZT',
      width: '7%',
      key: 'LYZT',
      ellipsis: true,
      render: txt => LYZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用说明',
      dataIndex: 'LYSM',
      align: 'center',
      key: 'LYSM',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  if (ZHPC.length === 0) return null;
  return (
    <div className="evaluation-table-box info-box">
      <div className="title">
        综合评测信息
        <span>更多操作</span>
      </div>
      <div className="table-box">
        <Table columns={columns} rowKey={'ZHPCID'} dataSource={ZHPC} pagination={false} bordered />
      </div>
    </div>
  );
}
