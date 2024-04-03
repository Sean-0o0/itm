import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, InputNumber, message, Select, Tooltip, Popconfirm } from 'antd';
import moment from 'moment';
import {
  FetchQueryGysInZbxx,
  FetchQueryOwnerProjectList,
  QueryUserRole,
  QueryXCContractInfo,
  QueryXCContractSubInfo,
} from '../../../../services/pmsServices';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';

//查询详情数据
const queryDetailData = (
  id, //原本合同编号，后来改成了id
  setData,
  setTableData,
  setIsSpinning,
  setData2,
  userId,
) => {
  setIsSpinning(true);
  //知识产权信息
  QueryXCContractInfo({
    id, //原本合同编号，后来改成了id
    current: 1,
    pageSize: 999,
    paging: -1,
    sort: '',
    total: -1,
    role: '合同管理员',
  })
    .then(res => {
      if (res?.success) {
        const htxx = JSON.parse(res.result ?? '[]')[0] ?? {};
        setData(htxx);

        QueryXCContractSubInfo({
          contractId: htxx.HTID,
        }).then(res => {
          if (res?.success) {
            setTableData(JSON.parse(res.result ?? '[]'));
            getUserRole(userId, setData2, setIsSpinning, {
              XMMC: htxx.XMMC,
              XMID: String(htxx.GLXM),
            });
          }
        });
      }
    })
    .catch(e => {
      console.error('🚀详情数据', e);
      message.error('详情数据获取失败', 1);
      setIsSpinning(false);
    });
};

//获取用户角色
const getUserRole = (userId, setData, setIsSpinning, obj) => {
  QueryUserRole({
    userId,
  })
    .then(res => {
      if (res?.code === 1) {
        const { testRole = '{}' } = res;
        getPrjNameData(
          JSON.parse(testRole).ALLROLE?.includes('合同管理员'),
          setData,
          setIsSpinning,
          obj,
        );
      }
    })
    .catch(e => {
      console.error('QueryUserRole', e);
      message.error('用户角色信息查询失败', 1);
    });
};

//项目名称下拉数据
const getPrjNameData = (isGLY, setData, setIsSpinning, obj) => {
  FetchQueryOwnerProjectList({
    paging: -1,
    total: -1,
    sort: '',
    cxlx: isGLY ? 'ALL' : 'GR',
  })
    .then(res => {
      if (res.code === 1) {
        function uniqueFunc(arr, uniId) {
          const res = new Map();
          return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
        }
        const arr = [...res.record].map(x => ({ XMMC: x.xmmc, XMID: x.xmid }));
        setData(p => ({ ...p, glxm: uniqueFunc([...arr, obj], 'XMID') }));
        fetchQueryGysInZbxx(setData, setIsSpinning);
      }
    })
    .catch(e => {
      console.error('FetchQueryOwnerProjectList', e);
      message.error('项目名称下拉框信息查询失败', 1);
      setIsSpinning(false);
    });
};

//信息块
const getInfoItem = ({ label, val = '-', style = {}, node }, isShow = false) => {
  return (
    <div className="info-item" key={label} style={{ ...style, display: isShow ? 'block' : 'none' }}>
      <span>{label}：</span>
      <Tooltip title={val === '-' ? '' : val} placement="topLeft">
        <div style={{ display: 'inline', cursor: 'default' }}>{node ?? val}</div>
      </Tooltip>
    </div>
  );
};

//跳转员工详情
const getStaffNode = (name, id, routes) => {
  let nameArr = name?.split(',') || [];
  let idArr = id?.split(',') || [];
  return (
    <Tooltip title={nameArr.join('、')} placement="topLeft">
      {nameArr.map((x, i) => (
        <Link
          style={{ color: '#3361ff', display: 'inline' }}
          key={idArr[i]}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: idArr[i],
              }),
            )}`,
            state: {
              routes,
            },
          }}
          className="table-link-strong"
        >
          {x + (i === nameArr.length - 1 || nameArr.length === 1 ? '' : '、')}
        </Link>
      ))}
    </Tooltip>
  );
};

//跳转项目详情
const getPrjNode = (sltData, xmid, routes) => {
  return (
    <Tooltip
      title={
        xmid !== undefined
          ? sltData.glxm.find(x => String(x.XMID) === String(xmid))?.XMMC || ''
          : ''
      }
      placement="topLeft"
    >
      <Link
        className="table-link-strong"
        style={{ color: '#3361ff' }}
        to={{
          pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
            JSON.stringify({
              xmid,
            }),
          )}`,
          state: {
            routes,
          },
        }}
      >
        {xmid !== undefined
          ? sltData.glxm.find(x => String(x.XMID) === String(xmid))?.XMMC || ''
          : ''}
      </Link>
    </Tooltip>
  );
};

//获取字典note
const getNote = (data = [], ibm) =>
  ibm !== undefined ? data.find(x => String(x.ibm) === String(ibm))?.note || '' : '';

//金额格式化
const getAmountFormat = value => {
  if ([undefined, null, '', ' ', NaN].includes(value)) return '-';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

//列配置
const columns = ({ getNote, sltData, SFXC, xc_cat_1, xc_cat_2, routes, glxm }) => [
  {
    title: '大类',
    dataIndex: 'XCDL',
    key: 'XCDL',
    width: 100,
    ellipsis: true,
    render: txt => getNote(xc_cat_1, txt),
  },
  {
    title: '小类',
    dataIndex: 'XCXL',
    key: 'XCXL',
    width: 120,
    ellipsis: true,
    render: txt => getNote(xc_cat_2, txt),
  },
  {
    title: '数量',
    dataIndex: 'SL',
    key: 'SL',
    width: 80,
    ellipsis: true,
  },
  {
    title: '单位',
    dataIndex: 'DW',
    key: 'DW',
    width: 80,
    ellipsis: true,
  },
  {
    title: '单价',
    dataIndex: 'DJ',
    key: 'DJ',
    width: 110,
    ellipsis: true,
  },
  {
    title: '总金额',
    dataIndex: 'ZJE',
    key: 'ZJE',
    width: 110,
    ellipsis: true,
    render: (txt, row) =>
      String(glxm) === String(row.GLXM) ? (txt !== undefined ? getAmountFormat(txt) : '') : '***',
  },
  {
    title: '产品名称',
    dataIndex: 'CPMC',
    key: 'CPMC',
    width: 150,
    ellipsis: true,
    render: txt => (
      <Tooltip title={txt} placement="topLeft">
        <span style={{ cursor: 'default' }}>{txt}</span>
      </Tooltip>
    ),
  },
  {
    title: '产品型号',
    dataIndex: 'CPXH',
    key: 'CPXH',
    width: 120,
    ellipsis: true,
    render: txt => (
      <Tooltip title={txt} placement="topLeft">
        <span style={{ cursor: 'default' }}>{txt}</span>
      </Tooltip>
    ),
  },
  {
    title: '配置详情',
    dataIndex: 'PZXQ',
    key: 'PZXQ',
    width: 160,
    ellipsis: true,
    render: txt => (
      <Tooltip title={txt} placement="topLeft">
        <span style={{ cursor: 'default' }}>{txt}</span>
      </Tooltip>
    ),
  },
  {
    title: '关联项目',
    dataIndex: 'GLXM',
    key: 'GLXM',
    ellipsis: true,
    width: 160,
    render: txt => getPrjNode(sltData, txt, routes),
  },
  {
    title: '是否信创',
    dataIndex: 'SFXC',
    key: 'SFXC',
    width: 80,
    ellipsis: true,
    render: txt => getNote(SFXC, txt),
  },
  {
    title: '生产厂商',
    dataIndex: 'SCCS',
    key: 'SCCS',
    width: 150,
    ellipsis: true,
    render: txt => (
      <Tooltip title={txt} placement="topLeft">
        <span style={{ cursor: 'default' }}>{txt}</span>
      </Tooltip>
    ),
  },
];

// 查询供应商下拉列表
const fetchQueryGysInZbxx = (setData, setIsSpinning) => {
  FetchQueryGysInZbxx({
    paging: -1,
    sort: '',
    current: 1,
    pageSize: 20,
    total: -1,
  })
    .then(res => {
      if (res.success) {
        let rec = res.record;
        setData(p => ({ ...p, gys: rec }));
        setIsSpinning(false);
      }
    })
    .catch(e => {
      console.error('供应商信息查询失败', e);
      message.error('供应商信息查询失败', 1);
      setIsSpinning(false);
    });
};

export {
  queryDetailData,
  getPrjNameData,
  getInfoItem,
  getStaffNode,
  getNote,
  columns,
  getAmountFormat,
  getPrjNode,
};
