import React, {useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo} from '../../../../services/pmsServices';
import {message, Spin,} from 'antd';
import {FetchQueryHardwareDemandInfo} from "../../../../services/projectManage";

export default function RequireModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [FRQData, setFRQData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [isSpinning, setIsSpinning] = useState(true); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [params, setParams] = useState({demand: '', drafter: '', current: 1, pageSize: 10});
  const {visible = false, closeModal} = props;


  useEffect(() => {
    getTableData(params);
    setIsSpinning(false)
    return () => {
    };
  }, []);

  //获取表格数据
  const getTableData = (params) => {
    setTableLoading(true);
    FetchQueryHardwareDemandInfo({
      ...params,
      paging: 1,
      sort: "",
      total: -1
    })
      .then(res => {
        if (res?.success) {
          setFRQData([...JSON.parse(res.fqrResult)])
          setTableData([...JSON.parse(res.result)]);
          setTotal(res.totalrows);
          setTableLoading(false);
        }
        console.log('🚀 ~ file: index.js ~ line 29 ~ getTableData ~ res', JSON.parse(res.result));
      })
      .catch(e => {
        // console.error('getTableData', e);
        setTableLoading(false);
      });
  };

  const callBackParams = (params) => {
    setParams({...params})
    getTableData(params);
  }

  //点击查询
  const handleSearch = (params) => {
    setParams({...params})
    getTableData(params);
  };

  return (
    <div className="require-list-box" style={{overflow: 'hidden', height: "540px", margin: '24px'}}>
      <Spin spinning={isSpinning} tip="加载中" size="large">
        <TopConsole FRQData={FRQData} params={params} handleSearch={handleSearch} callBackParams={callBackParams}/>
        <InfoTable
          FRQData={FRQData}
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
