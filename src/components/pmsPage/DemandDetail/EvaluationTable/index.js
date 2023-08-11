import React, { useEffect, useState, useRef } from 'react';
import { Button, Tooltip, Table } from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import MoreOperationModal from './MoreOperationModal';

export default function EvaluationTable(props) {
  const { dtlData = {}, dictionary = {}, isAuth = false, xqid, getDtldata, fqrid, isDock } = props;
  const [modalVisible, setModalVisible] = useState(false); //更多操作弹窗显隐
  const { ZHPC = [], XQSX_ORIGIN = [] } = dtlData;
  const { DFZT, LYZT } = dictionary;
  const location = useLocation();

  useEffect(() => {
    return () => {};
  }, []);

  const columns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      width: '10%',
      // align: 'center',
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
      title: '供应商名称',
      dataIndex: 'GYSMC',
      width: isDock ? '11%' : '0',
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
      width: '8%',
      key: 'RYMC',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.RYID === undefined) return text;
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
      dataIndex: 'MSG',
      width: '10%',
      key: 'MSG',
      ellipsis: true,
      render: (txt, row) => {
        let nameArr = txt?.split(',');
        let idArr = row.MSGID?.split(',');
        if (nameArr?.length === 0) return '';
        return (
          <Tooltip title={nameArr?.join('、')} placement="topLeft">
            {nameArr?.map((x, i) => (
              <span>
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/staffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: idArr[i],
                      }),
                    )}`,
                    state: {
                      routes: [{ name: '需求详情', pathname: location.pathname }],
                    },
                  }}
                  className="table-link-strong-tagtxt"
                >
                  {x}
                </Link>
                {i === nameArr?.length - 1 ? '' : '、'}
              </span>
            ))}
          </Tooltip>
        );
      },
    },
    {
      title: '综合评测时间',
      dataIndex: 'ZHPCSJ',
      width: '24%',
      key: 'ZHPCSJ',
      ellipsis: true,
      render: txt => {
        return (
          <Tooltip title={txt} placement="topLeft" overlayStyle={{ maxWidth: 300 }}>
            <span style={{ cursor: 'default' }}>{txt}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '综合评测分数',
      dataIndex: 'ZHPCCJ',
      width: '10%',
      align: 'center',
      key: 'ZHPCCJ',
      ellipsis: true,
    },
    {
      title: '打分状态',
      dataIndex: 'DFZT',
      width: '10%',
      key: 'DFZT',
      ellipsis: true,
      render: txt => DFZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用状态',
      dataIndex: 'LYZT',
      width: '8%',
      key: 'LYZT',
      ellipsis: true,
      render: txt => LYZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用说明',
      dataIndex: 'LYSM',
      key: 'LYSM',
      ellipsis: true,
      render: text => (
        <Tooltip
          title={text?.replace(/<br>/g, '\n').replace(/\\n/g, '\n')}
          overlayClassName="pre-wrap-tooltip"
          placement="left"
        >
          <span style={{ cursor: 'default' }}>
            {text?.replace(/<br>/g, '').replace(/\\n/g, '')}
          </span>
        </Tooltip>
      ),
    },
  ];

  if (ZHPC.length === 0) return null;
  return (
    <div className="evaluation-table-box info-box">
      {modalVisible && (
        <MoreOperationModal
          visible={modalVisible}
          setVisible={setModalVisible}
          data={{
            tableData: ZHPC,
            DFZT,
            LYZT,
            xqid,
            reflush: () => {
              getDtldata(xqid, fqrid);
            },
            swzxid: XQSX_ORIGIN.filter(x => x.SWMC === '综合评测安排')[0]?.SWZXID,
            swzxid_email: XQSX_ORIGIN.filter(x => x.SWMC === '发送确认邮件')[0]?.SWZXID,
            isDock,
            fqrid,
          }}
          tableColumns={columns}
        />
      )}
      <div className="title">
        综合评测信息
        {isAuth && <span onClick={() => setModalVisible(true)}>更多操作</span>}
      </div>
      <div className="table-box">
        <Table
          columns={columns}
          rowKey={'ZHPCID'}
          dataSource={ZHPC}
          pagination={{
            pageSize: 5,
            defaultCurrent: 1,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${ZHPC.length} 条数据`,
            total: ZHPC.length,
          }}
          bordered
        />
      </div>
    </div>
  );
}
