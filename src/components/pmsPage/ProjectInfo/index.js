import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryProjectListInfo } from '../../../services/pmsServices';
import { message } from 'antd';

export default function ProjectInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const { params = {} } = props;
  const { prjManager = -2, cxlx = 'ALL' } = params;
  const topConsoleRef = useRef(null);

  useEffect(() => {
    console.log('🚀 ~ file: index.js:20 ~ useEffect ~ prjManager:', prjManager);
    setCurPage(1);
    setTotal(0);
    if (prjManager === -2) {
      //无参数
      getTableData({});
    } else {
      setTimeout(() => {
        //有参数
        getTableData({ projectManager: prjManager, cxlx });
      });
    }

    return () => {};
  }, [prjManager, cxlx]);

  //获取表格数据
  const getTableData = ({
    current = 1,
    pageSize = 20,
    projectManager = -1,
    cxlx = 'ALL',
    sort = 'XH DESC,ID DESC',
  }) => {
    setTableLoading(true);
    QueryProjectListInfo({
      projectManager,
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
      queryType: cxlx,
    })
      .then(res => {
        if (res?.success) {
          setTableData(p => [...JSON.parse(res.record)]);
          console.log(res.totalrows);
          setTotal(res.totalrows);
          setTableLoading(false);
        }
        // console.log('🚀 ~ file: index.js ~ line 29 ~ getTableData ~ res', JSON.parse(res.record));
      })
      .catch(e => {
        // console.error('getTableData', e);
        message.error('表格数据查询失败', 1);
        setTableLoading(false);
      });
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
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        projectManager={params?.prjManager}
        cxlx={params?.cxlx}
        total={total}
        handleSearch={topConsoleRef?.current?.handleSearch}
        curPage={curPage}
        curPageSize={curPageSize}
      />
    </div>
  );
}
