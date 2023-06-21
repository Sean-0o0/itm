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
  const [cusRepDataWD, setCusRepDataWD] = useState([]);
  const [cusRepDataCJ, setCusRepDataCJ] = useState([]);
  const [cusRepDataGX, setCusRepDataGX] = useState([]);
  const [totalWD, setWDTotal] = useState(0);
  const [totalCJ, setCJTotal] = useState(0);
  const [totalGX, setGXTotal] = useState(0);
  const [tabsKey, setTabsKey] = useState(1);
  const [params, setParams] = useState({cjr: '', bbmc: ''});

  useEffect(() => {
    getCusRepData("WD", 12);
    getCusRepData("CJ", 12);
    return () => {
    };
  }, []);

  //获取待办数据
  const getCusRepData = (cxlx, pageSize) => {
    setIsSpinning(true);
    const payload = {
      current: 1,
      //WD|我的报表;GX|共享报表;CJ|我创建的报表
      cxlx,
      pageSize,
      paging: 1,
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
          if (cxlx === "WD") {
            setCusRepDataWD(p => [...JSON.parse(res.result)]);
            setWDTotal(res.totalrows);
          }
          if (cxlx === "GX") {
            setCusRepDataGX(p => [...JSON.parse(res.result)]);
            setGXTotal(res.totalrows);
          }
          if (cxlx === "CJ") {
            setCusRepDataCJ(p => [...JSON.parse(res.result)]);
            setCJTotal(res.totalrows);
          }
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
      getCusRepData("WD", 12);
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
        getCusRepData={getCusRepData}
        params={params}
        paramsCallback={paramsCallback}
        totalWD={totalWD}
        cusRepDataWD={cusRepDataWD}
        totalCJ={totalCJ}
        cusRepDataCJ={cusRepDataCJ}
        totalGX={totalGX}
        cusRepDataGX={cusRepDataGX}
        tabsKey={tabsKey}
      />
    </div>
  );
}
