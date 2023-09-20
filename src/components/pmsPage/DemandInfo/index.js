import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryOutsourceRequirementList } from '../../../services/pmsServices';
import { message } from 'antd';
import { set } from 'store';

export default function DemandInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {}, dictionary = {} } = props;
  const { WBRYGW } = dictionary;
  const { xmid = -2 } = params;
  const [subTableData, setSubTableData] = useState({}); //子表格数据
  const [isFinish, setIsFinish] = useState(false); //
  const topConsoleRef = useRef(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); //默认展开行

  useEffect(() => {
    getTableData();
    topConsoleRef?.current?.handleReset();
    return () => {};
  }, [xmid]);

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
      xmmc: xmid === -2 ? undefined : Number(xmid),
      // xqfqr: 0,
      // xqmc: 0,
      // yslx: 0,
      // ysxm: 0,
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xmxx);
          // console.log('🚀 ~ file: index.js:50 ~ getTableData ~ res:', data);
          setTableData(p => data);
          setTotal(res.totalrows);
          setTableLoading(false);
          if (xmid !== -2) getSubTableData(Number(xmid));
        }
      })
      .catch(e => {
        message.error('表格数据查询失败', 1);
        console.error('getTableData', e);
        setTableLoading(false);
      });
  };

  const getSubTableData = (xmid = undefined, xqid = undefined, xqfqr = undefined) => {
    QueryOutsourceRequirementList({
      current: 1,
      cxlx: 'XQ',
      pageSize: 10,
      paging: -1,
      sort: '',
      total: -1,
      xmmc: xmid,
      xqmc: xqid,
      xqfqr: xqfqr,
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
        getSubTableData={getSubTableData}
        setExpandedRowKeys={setExpandedRowKeys}
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
        expandedRowKeys={expandedRowKeys}
        setExpandedRowKeys={setExpandedRowKeys}
      />
    </div>
  );
}
