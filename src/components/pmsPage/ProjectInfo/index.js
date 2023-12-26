import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryProjectListInfo } from '../../../services/pmsServices';
import { message } from 'antd';

export default function ProjectInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {} } = props;
  const { prjManager, cxlx } = params;
  const topConsoleRef = useRef(null);
  const [queryType, setQueryType] = useState('ALL'); //
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    getTableData({});
    return () => { };
  }, []);

  useEffect(() => {
    setCurPage(1);
    setCurPageSize(20);
    return () => { };
  }, [cxlx]);

  useEffect(() => {
    // console.log('🚀 ~ file: index.js:20 ~ useEffect ~ prjManager:', prjManager);
    if (prjManager !== undefined && isComplete) {
      getTableData({ projectManager: prjManager, cxlx });
      setQueryType(cxlx);
      setPrjMnger(String(prjManager));
    }
    return () => { };
  }, [isComplete, prjManager, cxlx]);

  //获取表格数据
  const getTableData = async ({
    current = 1,
    pageSize = 20,
    projectManager = -1,
    cxlx = 'ALL',
    sort = 'XH DESC,ID DESC',
  }) => {
    setTableLoading(true);
    try {
      const res = await QueryProjectListInfo({
        projectManager,
        current,
        pageSize,
        paging: 1,
        sort,
        total: -1,
        queryType: cxlx,
      });
      if (res?.success) {
        setTableData(p => [...JSON.parse(res.record)]);
        console.log(res.totalrows);
        setTotal(res.totalrows);
        setTableLoading(false);
        setIsComplete(true);
      }
    } catch (error) {
      message.error('表格数据查询失败', 1);
      setTableLoading(false);
    }
  };

  return (
    <div className="project-info-box">
      <TopConsole
        dictionary={props.dictionary}
        setTableData={setTableData}
        setTotal={setTotal}
        setTableLoading={setTableLoading}
        projectManager={params?.prjManager}
        ref={topConsoleRef}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        curPage={curPage}
        curPageSize={curPageSize}
        queryType={queryType}
        setQueryType={setQueryType}
        prjMnger={prjMnger}
        setPrjMnger={setPrjMnger}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        projectManager={params?.prjManager}
        cxlx={params?.cxlx}
        total={total}
        handleSearch={topConsoleRef?.current?.handleSearch}
        handleReset={topConsoleRef?.current?.handleReset}
        curPage={curPage}
        curPageSize={curPageSize}
        queryType={queryType}
        prjMnger={prjMnger}
      />
    </div>
  );
}
