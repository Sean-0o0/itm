import React, { useEffect, useState, useRef } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryProjectListInfo, QueryBudgetStatistics } from '../../../services/pmsServices';
import { message } from 'antd';
import moment from 'moment';

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
  const [isComplete, setIsComplete] = useState(false);
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [dateRange, setDateRange] = useState([moment().subtract(1, 'year'), moment()]); //日期区间

  const [isQueryDefaultDateRange, setIsQueryDefaultDateRange] = useState(true); // 是否在计算默认日期区间
  const defaultDateRangeRef = useRef([]);
  const [filterData, setFilterData] = useState({}); //点查询后的顶部筛选数据
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //用于查询后清空排序状态

  useEffect(() => {
    getTableData({});
    return () => {};
  }, []);

  useEffect(() => {
    setCurPage(1);
    setCurPageSize(20);
    setDateRange([moment().subtract(1, 'year'), moment()]);
    setFilterData({});
    setPrjMnger(undefined);
    setSortInfo({
      sort: undefined,
      columnKey: '',
    });
    return () => {};
  }, [cxlx]);
  //cxlx查询类型

  useEffect(() => {
    // console.log('🚀 ~ file: index.js:20 ~ useEffect ~ prjManager:', prjManager);
    if (prjManager !== undefined && isComplete) {
      getTableData({ projectManager: prjManager, cxlx });
      setQueryType(cxlx);
      if (cxlx === 'PARTICIPATE') {
        setFilterData(p => ({ ...p, prjMnger: String(prjManager) }));
      } else {
        setPrjMnger(String(prjManager));
        setFilterData(p => ({ ...p, prjMnger: String(prjManager) }));
      }
      setSortInfo({
        sort: undefined,
        columnKey: '',
      });
    }
    return () => {};
  }, [isComplete, prjManager, cxlx]);

  useEffect(() => {
    console.log('filterData', filterData);
    return () => {};
  }, [JSON.stringify(filterData)]);

  //获取表格数据
  const getTableData = async ({
    current = 1,
    pageSize = 20,
    projectManager = -1,
    cxlx = 'ALL',
    sort = 'XMNF DESC,ID DESC',
  }) => {
    setTableLoading(true);
    try {
      // if (isQueryDefaultDateRange === true) return;
      // if(isQueryDefaultYear === true) return;
      const defaultParams = {
        projectManager,
        current,
        pageSize,
        paging: 1,
        sort,
        total: -1,
        queryType: cxlx,
        // year: moment.isMoment(year) ? new Date(year.valueOf()).getFullYear() : ''
      };
      if (dateRange.length !== 0) {
        defaultParams.startTime = moment(dateRange[0]).format('YYYYMMDD');
        defaultParams.endTime = moment(dateRange[1]).format('YYYYMMDD');
      }
      const res = await QueryProjectListInfo(defaultParams);

      if (res?.success) {
        setTableData(p => [...JSON.parse(res.record)]);
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
        dateRange={dateRange}
        setDateRange={setDateRange}
        defaultDateRangeRef={defaultDateRangeRef}
        setFilterData={setFilterData}
        setSortInfo={setSortInfo}
      />
      <InfoTable
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        projectManager={params?.prjManager}
        cxlx={params?.cxlx}
        total={total}
        handleSearch={(v = {}) => {
          topConsoleRef?.current?.handleSearch({ ...filterData, ...v });
          console.log('🚀 ~ ProjectInfo ~ { ...filterData, ...v }:', v);
        }}
        handleReset={topConsoleRef?.current?.handleReset}
        curPage={curPage}
        curPageSize={curPageSize}
        queryType={queryType}
        sortInfo={sortInfo}
        setSortInfo={setSortInfo}
      />
    </div>
  );
}
