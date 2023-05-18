import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryOutsourceRequirementList } from '../../../services/pmsServices';
import { setCommentRange } from 'typescript';
import { message } from 'antd';

export default function DemandInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [gysData, setGysData] = useState([]); //供应商下拉框数据
  const [lxrData, setLxrData] = useState([]); //联系人下拉框数据
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {}, dictionary = {} } = props;
  const { supplierId = -2 } = params;
  const { GYSLX } = dictionary;
  const topConsoleRef = useRef(null);

  useEffect(() => {
    if (supplierId === -2) {
      //无参数
      getTableData();
      topConsoleRef?.current?.handleReset();
    }
    return () => {};
  }, [props]);

  //获取表格数据
  const getTableData = (current = 1, pageSize = 20) => {
    setTableLoading(true);
    QueryOutsourceRequirementList({
      current,
      cxlx: 'XM',
      pageSize,
      paging: 1,
      sort: 'XMID DESC',
      total: -1,
      // xmjl: 0,
      // xmmc: 0,
      // xqfqr: 0,
      // xqmc: 0,
      // yslx: 0,
      // ysxm: 0,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xmxx);
          console.log('🚀 ~ file: index.js:50 ~ getTableData ~ res:', data);
          setTableData(p => data);
          setTotal(res.totalrows);
          setTableLoading(false);
        }
      })
      .catch(e => {
        message.error('表格数据查询失败', 1);
        console.error('getTableData', e);
        setTableLoading(false);
      });
  };

  return (
    <div className="demand-info-box">
      <TopConsole
        dictionary={dictionary}
        gysData={gysData}
        lxrData={lxrData}
        gyslxData={GYSLX}
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        setTotal={setTotal}
        ref={topConsoleRef}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        curPage={curPage}
        curPageSize={curPageSize}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        total={total}
        handleSearch={topConsoleRef?.current?.handleSearch}
        curPage={curPage}
        curPageSize={curPageSize}
        GYSLX={GYSLX}
      />
    </div>
  );
}
