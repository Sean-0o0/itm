import React, {useEffect, useState, useRef} from 'react';
import {
  FetchQueryCustomReportList,
  FetchQueryOwnerMessage,
  QueryProjectListInfo,
  QueryProjectTracking
} from '../../../services/pmsServices';
import {message, Progress} from 'antd';
import Reptabs from "./Reptabs";
import RepInfos from "./RepInfos";
import moment from "moment";

export default function CustomReports(props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [cusRepDataSC, setCusRepDataSC] = useState([]);
  const [cusRepDataCJ, setCusRepDataCJ] = useState([]);
  const [cusRepDataGX, setCusRepDataGX] = useState([]);
  const [cusRepDataCJR, setCusRepDataCJR] = useState([]);
  const [cusRepDataKJBB, setCusRepDataKJBB] = useState([]);
  const [totalSC, setSCTotal] = useState(0);
  const [totalCJ, setCJTotal] = useState(0);
  const [totalGX, setGXTotal] = useState(0);
  const [totalCJR, setCJRTotal] = useState(0);
  const [totalKJBB, setKJBBTotal] = useState(0);
  const [tabsKey, setTabsKey] = useState(1);
  const [params, setParams] = useState({cjr: '', bbmc: ''});

  useEffect(() => {
    // getCusRepData("CJR", 9999);
    // getCusRepData("KJBB", 9999);
    getCusRepData("SC", 12);
    getCusRepData("CJ", 12);
    return () => {
    };
  }, [props]);

  //获取报表数据
  const getCusRepData = (cxlx, pageSize) => {
    setIsSpinning(true);
    const payload = {
      current: 1,
      //SC|收藏的报表;WD|我的报表;GX|共享报表;CJ|我创建的报表;CJR|查询创建人;KJBB|可见报表
      cxlx,
      pageSize,
      paging: cxlx === "GX" ? -1 : 1,
      sort: "",
      total: -1
    }
    console.log("paramsparams", params)
    if (cxlx === "GX") {
      payload.bbmc = params.bbmc;
      payload.cjr = params.cjr;
      payload.pageSize = pageSize;
    }
    FetchQueryCustomReportList({...payload})
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryOwnerMessage ~ res', res.record);
          if (cxlx === "SC") {
            setCusRepDataSC(p => [...JSON.parse(res.result)]);
            setSCTotal(res.totalrows);
          }
          if (cxlx === "GX") {
            setCusRepDataGX(p => [...JSON.parse(res.result)]);
            setGXTotal(res.totalrows);
            const cjr = JSON.parse(res.result);
            const result = cjr.reduce((acc, curr) => {
              const index = acc.findIndex((item) => item.CJRID === curr.CJRID)
              if (index < 0) {
                acc.push(curr)
              }
              return acc
            }, [])
            console.log(result) // [1, 2, 3, 4]
            setCusRepDataCJR(p => [...result]);
            // setCJRTotal(res.totalrows);
          }
          if (cxlx === "CJ") {
            setCusRepDataCJ(p => [...JSON.parse(res.result)]);
            setCJTotal(res.totalrows);
          }
          // if (cxlx === "CJR") {
          //   setCusRepDataCJR(p => [...JSON.parse(res.result)]);
          //   setCJRTotal(res.totalrows);
          // }
          // if (cxlx === "KJBB") {
          //   setCusRepDataKJBB(p => [...JSON.parse(res.result)]);
          //   setKJBBTotal(res.totalrows);
          // }
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('FetchQueryOwnerMessage', e);
        message.error('报表信息查询失败', 1);
      });
  };

  const tabsCallback = (key) => {
    if (key === 1) {
      getCusRepData("SC", 12);
      getCusRepData("CJ", 12);
    }
    if (key === 2) {
      getCusRepData("GX", 28);
    }
    setTabsKey(key);
  }

  const paramsCallback = (par) => {
    console.log(par);
    setParams({...par})
  }


  return (
    <div className="custom-reports-box">
      <Reptabs
        tabsCallback={tabsCallback}
      />
      <RepInfos
        isSpinning={isSpinning}
        getCusRepData={getCusRepData}
        params={params}
        paramsCallback={paramsCallback}
        totalSC={totalSC}
        cusRepDataSC={cusRepDataSC}
        totalCJ={totalCJ}
        cusRepDataCJ={cusRepDataCJ}
        totalGX={totalGX}
        cusRepDataGX={cusRepDataGX}
        cusRepDataCJR={cusRepDataCJR}
        cusRepDataKJBB={cusRepDataGX}
        // totalCJR={totalCJR}
        // totalKJBB={totalKJBB}
        tabsKey={tabsKey}
      />
    </div>
  );
}
