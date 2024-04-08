import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Table, Tooltip, message } from 'antd';
import moment from 'moment';
import { getNote } from '../../../../../../../utils/pmsPublicUtils';
import { QueryShortlistedSuppliers } from '../../../../../../../services/pmsServices';

export default function SupplierConfirm(props) {
  const {
    setTableData,
    setEditData,
    tableData = [],
    editData = [],
    RLRWHTQSZT = [],
    curStep = 0,
    setIsSpinning,
    prjYear = moment().year(), //项目年份
    ZDTSNRPZ = [],
  } = props;
  useEffect(() => {
    if (curStep === 1) {
      let str = tableData.map(x => x['GYS' + x.ID]).join(',');
      if (str !== '') {
        getRwgysData(str);
      }
    }
    return () => {};
  }, [curStep]);

  //获取入围供应商信息
  const getRwgysData = vendorList => {
    setIsSpinning(true);
    QueryShortlistedSuppliers({ vendorList, year: Number(prjYear) })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ queryShortlistedSuppliers ~ res', JSON.parse(res.result));
          // let arr = JSON.parse(JSON.stringify(tableData))
          let arr = JSON.parse(res.result).map(x => {
            let obj = tableData.find(y => Number(y['GYS' + y.ID]) === Number(x.GYSID)) || {};
            return {
              ...x,
              ...obj,
              QSZT: obj['QSZT' + obj.ID],
            };
          });
          let editArr = editData.map(x => ({
            ...x,
            ...(JSON.parse(res.result).find(y => Number(y.GYSID) === Number(x['GYS' + y.ID])) ||
              {}),
          }));
          // console.log('🚀 ~ queryShortlistedSuppliers ~ arr, editArr:', arr, editArr);
          setTableData(arr);
          setEditData(editArr);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀入围供应商信息', e);
        message.error('入围供应商信息获取失败', 1);
        setIsSpinning(false);
      });
  };
  const columns = [
    {
      title: '入围年份',
      dataIndex: 'RWNF',
      key: 'RWNF',
      width: 100,
      ellipsis: true,
      render: txt => (txt ? txt : moment().year()),
    },
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      key: 'GYSMC',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          {txt ? txt : '-'}
        </Tooltip>
      ),
    },
    {
      title: '签署状态',
      dataIndex: 'QSZT',
      key: 'QSZT',
      width: 100,
      ellipsis: true,
      sorter: (a, b) => Number(a.QSZT ?? 0) - Number(b.QSZT ?? 0),
      sortDirections: ['descend', 'ascend'],
      render: txt => getNote(RLRWHTQSZT, txt),
    },
    {
      title: '账号信息',
      dataIndex: 'XTZH',
      key: 'XTZH',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          {txt ? txt : '-'}
        </Tooltip>
      ),
    },
    {
      title: '帐号状态',
      dataIndex: 'ZHZT',
      key: 'ZHZT',
      width: 100,
      ellipsis: true,
      render: (txt, row = {}) => {
        /**
         * ●签署状态为签署成功的，有历史账号信息的展示其账号信息，账号状态为正常使用；无历史账号信息的，账号状态为暂无账号
         * ●签署状态为签署失败的，有历史账号信息的展示其账号信息，账号状态为暂停使用；无历史账号信息的，账号状态为暂无账号
         */
        if (String(row.QSZT) === '1') {
          if (row.XTZH !== undefined) return '正常使用';
          else return '暂无账号';
        } else {
          if (row.XTZH !== undefined) return '暂停使用';
          else return '暂无账号';
        }
      },
    },
  ];

  //获取问号提示
  const getQesTip = (txt = '') => {
    return ZDTSNRPZ.find(x => x.cbm === txt)?.note ?? '';
  };

  return (
    <Fragment>
      <div className="top-tips">
        <span>tips：</span>
        {getQesTip('人力服务入围合同录入tips')}
      </div>
      <Table
        columns={columns}
        rowKey={'ID'}
        dataSource={tableData}
        pagination={false}
        size="middle"
      />
    </Fragment>
  );
}
