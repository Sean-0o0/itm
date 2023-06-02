import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryOutsourceCostList } from '../../../services/pmsServices';
import { message } from 'antd';
import { set } from 'store';

export default function DemandInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {}, dictionary = {} } = props;
  const { WBRYGW } = dictionary;
  const { xmid = -2 } = params;
  const [subTableData, setSubTableData] = useState({}); //子表格数据
  const [isFinish, setIsFinish] = useState(false); //
  const topConsoleRef = useRef(null);

  useEffect(() => {
    if (xmid === -2) {
      //无参数
      getTableData();
      topConsoleRef?.current?.handleReset();
    } else {
      getTableData();
      topConsoleRef?.current?.handleReset();
    }
    return () => {};
  }, [xmid]);

  //获取表格数据
  const getTableData = (current = 1, pageSize = 20) => {
    setTableLoading(true);
    QueryOutsourceCostList({
      current,
      cxlx: 'XM',
      pageSize,
      paging: 1,
      sort: '',
      total: -1,
      // xmid: 0,
      // gysid: 0,
      // jssj: 0,
      // kssj: 0,
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

  const getSubTableData = (
    xmid = undefined,
    gysid = undefined,
    jssj = undefined,
    kssj = undefined,
  ) => {
    QueryOutsourceCostList({
      current: 1,
      cxlx: 'XQ',
      pageSize: 10,
      paging: -1,
      sort: '',
      total: -1,
      xmid,
      gysid,
      jssj,
      kssj,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xqxx);
          // console.log('🚀 ~ file: index.js:332 ~ onExpand ~ data:', data);
          setSubTableData(p => {
            return {
              ...p,
              [xmid]: data,
            };
          });
          setIsFinish(true);
        }
      })
      .catch(e => {
        message.error('子表格数据查询失败', 1);
        setTableLoading(false);
      });
  };

  return (
    <div className="demand-info-box">
      <TopConsole
        dictionary={dictionary}
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        setTotal={setTotal}
        ref={topConsoleRef}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        curPage={curPage}
        curPageSize={curPageSize}
        xmid={xmid}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        total={total}
        handleSearch={topConsoleRef?.current?.handleSearch}
        curPage={curPage}
        curPageSize={curPageSize}
        isFinish={isFinish}
        subTableData={subTableData}
        getSubTableData={getSubTableData}
        setSubTableData={setSubTableData}
        xmid={xmid}
        WBRYGW={WBRYGW}
        setTableData={setTableData}
      />
    </div>
  );
}
