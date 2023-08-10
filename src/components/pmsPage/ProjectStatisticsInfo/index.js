import React, {useEffect, useState, useRef} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo, QueryProjectStatisticsList} from '../../../services/pmsServices';
import {Breadcrumb, message} from 'antd';
import {Link} from "react-router-dom";

const {Item} = Breadcrumb;

export default function ProjectStatisticsInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const {cxlx, memberID, orgID, routes = []} = props;
  const topConsoleRef = useRef(null);
  const [queryType, setQueryType] = useState('BM'); //
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [prjType, setPrjType] = useState(undefined); //项目类型
  const [tabsKey, setTabsKey] = useState('0'); //项目类型
  const [isComplete, setIsComplete] = useState(false); //

  // useEffect(() => {
  //   getTableData({});
  //   return () => {
  //   };
  // }, []);

  useEffect(() => {
    console.log('🚀 ~ file: index.js:20 ~ useEffect ~ cxlx:', cxlx, orgID, memberID);
    if (cxlx !== '') {
      if (cxlx === 'BM' && orgID !== '') {
        getTableData({cxlx, memberID, orgID});
        setTabsKey('0')
        setQueryType(cxlx);
      }
      if (cxlx === 'RY' && memberID !== '') {
        getTableData({cxlx, memberID, orgID});
        setTabsKey('0')
        setQueryType(cxlx);
      }
    }
    return () => {
    };
  }, [props]);

  //获取表格数据
  const getTableData = async ({
                                current = 1,
                                pageSize = 20,
                                cxlx = 'BM',
                                sort = '',
                                tabsKey = '0',
                                memberID,
                                orgID,
                              }) => {
    setTableLoading(true);
    try {
      const payload = {
        current,
        pageSize,
        paging: 1,
        sort,
        total: -1,
      }
      if (cxlx !== '') {
        payload.queryType = cxlx;
        if (cxlx === 'BM') {
          payload.orgID = orgID
        }
        if (cxlx === 'RY') {
          payload.memberID = memberID
        }
      }
      if (tabsKey !== '0') {
        payload.tab = tabsKey;
      }
      const res = await QueryProjectStatisticsList({...payload});
      if (res?.success) {
        setTableData(p => [...JSON.parse(res.result)]);
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

  const tabsKeyCallBack = (activeKey) => {
    //重置顶部查询条件
    setPrjName(undefined); //项目名称
    setPrjMnger(undefined); //项目经理
    setPrjType(undefined); //项目类型
    setTabsKey(activeKey); //tab页
    getTableData({
      current: 1,
      pageSize: 20,
      cxlx,
      memberID,
      orgID,
      sort: '',
      tabsKey: activeKey,
    });
  }

  return (
    <div className="project-statistics-info-box">
      <Breadcrumb separator=">" style={{margin: '16px 24px 0 24px'}}>
        {routes?.map((item, index) => {
          const {name = item, pathname = ''} = item;
          const historyRoutes = routes.slice(0, index + 1);
          return (
            <Item key={index}>
              {index === routes.length - 1 ? (
                <>{name}</>
              ) : (
                <Link to={{pathname: pathname, state: {routes: historyRoutes}}}>{name}</Link>
              )}
            </Item>
          );
        })}
      </Breadcrumb>
      <TopConsole
        orgID={orgID}
        dictionary={props.dictionary}
        setTableData={setTableData}
        setTotal={setTotal}
        setTableLoading={setTableLoading}
        ref={topConsoleRef}
        setCurPage={setCurPage}
        setCurPageSize={setCurPageSize}
        curPage={curPage}
        curPageSize={curPageSize}
        queryType={queryType}
        setQueryType={setQueryType}
        prjMnger={prjMnger}
        setPrjMnger={setPrjMnger}
        prjName={prjName}
        setPrjName={setPrjName}
        prjType={prjType}
        setPrjType={setPrjType}
        tabsKey={tabsKey}
      />
      <InfoTable
        routes={routes}
        tableData={tableData}
        tableLoading={tableLoading}
        getTableData={getTableData}
        cxlx={cxlx}
        total={total}
        handleSearch={topConsoleRef?.current?.handleSearch}
        curPage={curPage}
        curPageSize={curPageSize}
        queryType={queryType}
        prjMnger={prjMnger}
        tabsKeyCallBack={tabsKeyCallBack}
        tabsKey={tabsKey}
      />
    </div>
  );
}
