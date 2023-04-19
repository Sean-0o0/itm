import React, {useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo} from '../../../../services/pmsServices';
import {message, Spin} from 'antd';
import {FetchQueryInquiryComparisonInfo} from "../../../../services/projectManage";

export default function PollResultModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [lcxxData, setLcxxData] = useState([]); //关联需求
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [isSpinning, setIsSpinning] = useState(true); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const {visible = false, closeModal} = props;
  const [params, setParams] = useState({demand: '', current: 1, pageSize: 10});

  useEffect(() => {
    getTableData();
    setIsSpinning(false);
    return () => {
    };
  }, []);

  //获取表格数据
  const getTableData = () => {
    setTableLoading(true);
    FetchQueryInquiryComparisonInfo(
      {
        ...params,
        projectId: "397",
        flowId: "-1",
        paging: 1,
        queryType: "ALL",
        sort: "",
        total: -1
      })
      .then(res => {
        if (res?.success) {
          const {xbxx, lcxx} = res
          setTableData(p => [...JSON.parse(xbxx)]);
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
