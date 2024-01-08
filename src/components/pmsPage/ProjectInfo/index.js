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
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [isComplete, setIsComplete] = useState(false);

  const [dateRange, setDateRange] = useState([moment().subtract(1, 'year'), moment()]) //日期区间

  const [isQueryDefaultDateRange, setIsQueryDefaultDateRange] = useState(true) // 是否在计算默认日期区间
  const defaultDateRangeRef = useRef([])


  /**
   * 查询默认日期区间
   */
  // const queryDefaultDateRange = async () => {
  //   setIsQueryDefaultDateRange(true)
  //   let curYear = new Date().getFullYear()
  //   const queryParams = {
  //     "budgetType": "ZB",
  //     "current": 1,
  //     "pageSize": 20,
  //     "paging": 1,
  //     "queryType": "YSTJ",
  //     "sort": "",
  //     "total": -1,
  //     'year': curYear
  //   }
  //   const res = await QueryBudgetStatistics(queryParams)
  //   if (res.code === 1) {
  //     const { budgetInfo } = res
  //     const obj = JSON.parse(budgetInfo)
  //     if (obj.length === 0) {
  //       curYear--;
  //     }
  //     const startDay = `${curYear}-01-01 00:00:00`
  //     const endDay = `${curYear}-12-31 23:59:59`
  //     const computedDateRange = [moment(startDay), moment(endDay)]
  //     setDateRange(computedDateRange)
  //     defaultDateRangeRef.current = computedDateRange
  //     setIsQueryDefaultDateRange(false)
  //   }
  // }

  // useEffect(() => {
  // queryDefaultDateRange().catch((err) => {
  //   message.error(`计算默认日期区间失败${err}`, 2)
  //   setIsQueryDefaultDateRange(false)
  // })
  // }, [])

  // useEffect(() => {
  //   getTableData({})
  // }, [isQueryDefaultDateRange])

  //TIP：——————————————————以下有关year的代码最好不要删；需求在变动，也许又改为按年份匹配；——————————————————
  // const [year, setYear] = useState() //年
  // const [isQueryDefaultYear, setIsQueryDefaultYear] = useState(true) // 是否在计算默认年份
  // const defaultYearRef = useRef(undefined)

  /** 查默认年 */
  // const queryDefaultYear = async () => {
  //   setIsQueryDefaultYear(true)
  //   let curYear = new Date().getFullYear()
  //   const queryParams = {
  //     "budgetType": "ZB",
  //     "current": 1,
  //     "pageSize": 20,
  //     "paging": 1,
  //     "queryType": "YSTJ",
  //     "sort": "",
  //     "total": -1,
  //     "year": curYear
  //   }
  //   const res = await QueryBudgetStatistics(queryParams)
  //   if (res.code === 1) {
  //     const { budgetInfo } = res
  //     const obj = JSON.parse(budgetInfo)
  //     if (obj.length === 0) {
  //       curYear--;
  //     }
  //     setYear(moment().year(curYear))
  //     defaultYearRef.current = moment().year(curYear)
  //     setIsQueryDefaultYear(false)
  //   }
  // }

  // useEffect(() => {
  //   queryDefaultYear().catch((err) => {
  //     message.error(`计算默认年份失败${err}`, 2)
  //     setIsQueryDefaultYear(false)
  //   })
  // }, [])

  // useEffect(() => {
  //   getTableData({})
  // }, [isQueryDefaultYear])


  useEffect(() => {
    getTableData({});
    return () => { };
  }, []);

  useEffect(() => {
    setCurPage(1);
    setCurPageSize(20);
    setDateRange([moment().subtract(1, 'year'), moment()]);
    return () => { };
  }, [cxlx]);
  //cxlx查询类型

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
    sort = 'XMNF DESC,XH DESC,ID DESC',
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
      }
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
        // year={year}
        // setYear={setYear}
        // defaultYearRef={defaultYearRef}
        dateRange={dateRange}
        setDateRange={setDateRange}
        defaultDateRangeRef={defaultDateRangeRef}
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
