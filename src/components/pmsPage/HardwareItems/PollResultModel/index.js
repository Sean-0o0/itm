import React, {useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo} from '../../../../services/pmsServices';
import {message, Spin} from 'antd';
import {FetchQueryInquiryComparisonInfo} from "../../../../services/projectManage";
import {DecryptBase64} from "../../../Common/Encrypt";

export default function PollResultModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [xmid, setXmid] = useState(-1); //表格数据-项目列表
  const [lcxxData, setLcxxData] = useState([]); //关联需求
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [isSpinning, setIsSpinning] = useState(true); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const {match: {params: {params: encryptParams = ''}}} = props;
  const [params, setParams] = useState({compareName: '', current: 1, pageSize: 10});

  useEffect(() => {
    const params = getUrlParams();
    if (params.xmid && params.xmid !== -1) {
      console.log("paramsparams000000", params)
      // 修改项目操作
      setXmid(Number(params.xmid));
    }
    console.log("paramsparams", params)
    console.log("xmid", xmid)
    setTimeout(function () {
      getTableData();
      setIsSpinning(false);
    }, 300);
    return () => {
    };
  }, [xmid]);

  // 获取url参数
  const getUrlParams = () => {
    console.log("paramsparams", encryptParams)
    return JSON.parse(DecryptBase64(encryptParams));
  }

  //获取表格数据
  const getTableData = () => {
    setTableLoading(true);
    FetchQueryInquiryComparisonInfo(
      {
        ...params,
        // projectId: "397",
        projectId: xmid,
        flowId: "-1",
        paging: 1,
        queryType: "ALL",
        sort: "",
        total: -1
      })
      .then(res => {
        if (res?.success) {
          const {xbxx, lcxx, wjxx} = res
          const wjxxJson = JSON.parse(wjxx)
          const xbxxJson = JSON.parse(xbxx)
          xbxxJson.map(item => {
            item.FileInfo = wjxxJson.filter(i => i.id == item.ID)
          })
          console.log("wjxxJson", wjxxJson)
          console.log("xbxxJson", xbxxJson)
          setTableData(p => [...xbxxJson]);
          setLcxxData(p => [...JSON.parse(lcxx)]);
          setTotal(res.totalrows);
          setTableLoading(false);
        }
        // console.log('🚀 ~ file: index.js ~ line 29 ~ getTableData ~ res', JSON.parse(res.record));
      })
      .catch(e => {
        // console.error('getTableData', e);
        setTableLoading(false);
      });
  };

  const callBackParams = (params) => {
    setParams({...params})
  }

  //点击查询
  const handleSearch = (params) => {
    setParams({...params})
    getTableData(params);
  };

  return (
    <div className="require-list-box" style={{overflow: 'hidden', height: "100%"}}>
      <Spin spinning={isSpinning} tip="加载中" size="large">
        <TopConsole params={params} handleSearch={handleSearch} callBackParams={callBackParams}/>
        <InfoTable
          lcxxData={lcxxData}
          params={params}
          callBackParams={callBackParams}
          tableData={tableData}
          tableLoading={tableLoading}
          getTableData={getTableData}
          total={total}
        />
      </Spin>
    </div>
  );
}
