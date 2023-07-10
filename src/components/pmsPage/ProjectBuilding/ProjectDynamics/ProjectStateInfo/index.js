import React, {useEffect, useState, useRef} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {Breadcrumb, message} from 'antd';
import {QueryProjectDynamics} from "../../../../../services/pmsServices";
import {Link} from "react-router-dom";

const {Item} = Breadcrumb;

export default function ProjectStatisticsInfo(props) {
  const {cxlx, routes = []} = props;
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [curPage, setCurPage] = useState(1); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //每页数量
  const topConsoleRef = useRef(null);
  const [queryType, setQueryType] = useState('XWH'); //
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [prjName, setPrjName] = useState(undefined); //项目名称

  useEffect(() => {
    // console.log("1231231312",cxlx)
    if (cxlx !== '') {
      setQueryType(cxlx);
      getTableData(cxlx);
    }
    return () => {
    };
  }, [cxlx]);

  //获取表格数据
  const getTableData = (queryType) => {
    setCurPage(1)
    setCurPageSize(20)
    setTableLoading(true);
    //信委会，总办会，项目立项，合同签署，上线，付款，完结
    //ALL|查询全部；XWH|只查信委会过会；ZBH|只查总办会过会；XMLX|项目立项完成；HTQS|只查合同签署流程完成
    const payload = {
      "current": 1,
      // "manager": 0,
      "pageSize": 20,
      "paging": 1,
      // "projectID": 0,
      "queryType": queryType,
      "sort": "",
      "total": -1,
      "totalrowsFK": -1,
      "totalrowsHT": -1,
      "totalrowsLX": -1,
      "totalrowsSX": -1,
      "totalrowsWJ": -1,
      "totalrowsXWH": -1,
      "totalrowsZBH": -1,
      "year": 2023
    }
    QueryProjectDynamics({
      ...payload
    }).then(res => {
      const {
        code = 0,
        resultFK, resultHT, resultLX, resultSX, resultWJ, resultXWH, resultZBH,
        totalrowsFK, totalrowsHT, totalrowsLX, totalrowsSX, totalrowsWJ, totalrowsXWH, totalrowsZBH,
      } = res
      if (code > 0) {
        if (queryType === "XWH") {
          setTableData([...JSON.parse(resultXWH)]);
          setTotal(totalrowsXWH)
        }
        if (queryType === "ZBH") {
          setTableData([...JSON.parse(resultZBH)]);
          setTotal(totalrowsZBH)
        }
        if (queryType === "XMLX") {
          setTableData([...JSON.parse(resultLX)]);
          setTotal(totalrowsLX)
        }
        if (queryType === "HTQS") {
          setTableData([...JSON.parse(resultHT)]);
          setTotal(totalrowsHT)
        }
        if (queryType === "SXXM") {
          setTableData([...JSON.parse(resultSX)]);
          setTotal(totalrowsSX)
        }
        if (queryType === "FKXM") {
          setTableData([...JSON.parse(resultFK)]);
          setTotal(totalrowsFK)
        }
        if (queryType === "WJXM") {
          setTableData([...JSON.parse(resultWJ)]);
          setTotal(totalrowsWJ)
        }
        setTableLoading(false);
      } else {
        message.error(note)
        setTableLoading(false);
      }
    }).catch(err => {
      message.error("查询项目动态失败")
      setTableLoading(false);
    })
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
        setQueryType={setQueryType}
        prjMnger={prjMnger}
        setPrjMnger={setPrjMnger}
        prjName={prjName}
        setPrjName={setPrjName}
      />
    </div>
  );
}
