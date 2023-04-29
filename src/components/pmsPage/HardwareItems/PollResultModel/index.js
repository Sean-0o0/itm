import React, { useCallback, useEffect, useState } from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import { QueryProjectListInfo } from '../../../../services/pmsServices';
import { message, Spin } from 'antd';
import { FetchQueryInquiryComparisonInfo } from '../../../../services/projectManage';
import { DecryptBase64 } from '../../../Common/Encrypt';

export default function PollResultModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [xmid, setXmid] = useState(-1); //表格数据-项目列表
  const [lcxxData, setLcxxData] = useState([]); //关联需求
  const [tableLoading, setTableLoading] = useState(true); //表格加载状态
  const [isSpinning, setIsSpinning] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [currentPage, setCurrentPage] = useState(1); //收款账户数据懒加载页号
  const [isNoMoreData, setIsNoMoreData] = useState(false); //没有更多数据了
  const [demandName, setDemandName] = useState(''); //

  const {
    match: {
      params: { params: encryptParams = '' },
    },
  } = props;
  const [params, setParams] = useState({ compareName: '', current: 1, pageSize: 10 });

  useEffect(() => {
    const params = getUrlParams();
    if (params.xmid && params.xmid !== -1) {
      console.log('paramsparams000000', params);
      // 修改项目操作
      setXmid(Number(params.xmid));
    }
    console.log('paramsparams', params);
    console.log('xmid', xmid);
    setTimeout(function() {
      if (xmid !== -1) {
        getTableData(params);
        fetchQueryInquiryComparisonInfoLCXX(demandName);
      }
    }, 300);
    return () => {};
  }, [xmid]);

  // 获取url参数
  const getUrlParams = () => {
    console.log('paramsparams', encryptParams);
    return JSON.parse(DecryptBase64(encryptParams));
  };

  //获取表格数据
  const getTableData = params => {
    console.log('11111111');
    setTableLoading(true);
    FetchQueryInquiryComparisonInfo({
      ...params,
      // projectId: "397",
      projectId: xmid,
      flowId: '-1',
      paging: 1,
      queryType: 'XBJG',
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          const { xbxx, lcxx, wjxx } = res;
          const wjxxJson = JSON.parse(wjxx);
          const xbxxJson = JSON.parse(xbxx);
          xbxxJson.map(item => {
            item.FileInfo = wjxxJson.filter(i => i.id == item.ID);
          });
          console.log('wjxxJson', wjxxJson);
          console.log('xbxxJson', xbxxJson);
          setTableData(p => [...xbxxJson]);
          setTotal(res.totalrows);
          // setTableLoading(false)
        }
        // console.log('🚀 ~ file: index.js ~ line 29 ~ getTableData ~ res', JSON.parse(res.record));
      })
      .catch(e => {
        message.error(e, 3);
        setTableLoading(false);
      });
  };

  const fetchQueryInquiryComparisonInfoLCXX = (demandName = '', current = 1) => {
    FetchQueryInquiryComparisonInfo({
      flowId: '-1',
      projectId: xmid,
      queryType: 'GLXQ',
      paging: 1,
      current,
      pageSize: 30,
      demandName,
      total: -1,
      sort: '',
    }).then(res => {
      if (res.success) {
        const { lcxx } = res;
        let rec = [...JSON.parse(lcxx)];
        let arr = [...lcxxData];
        if (rec.length === 0) {
          setLcxxData(p => [...arr]);
          setIsNoMoreData(true);
          console.log('🚀 ~ file: index.js:108 ~ fetchQueryInquiryComparisonInfoLCXX ~ [...arr]:', [
            ...arr,
          ]);
        } else {
          setCurrentPage(current);
          setLcxxData(p => [...arr, ...rec]);
          console.log(
            '🚀 ~ file: index.js:108 ~ fetchQueryInquiryComparisonInfoLCXX ~ [...arr, ...rec]:',
            [...arr, ...rec],
          );
        }
      }
    });
  };
  const handleReachBottom = e => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    // throttle(() => {
    if (scrollHeight - scrollTop - clientHeight <= 10) {
      let index = currentPage;
      index = index + 1;
      console.log('🚀 ~ file: index.js:122 ~ //throttle ~ isNoMoreData:', isNoMoreData, index);
      if (!isNoMoreData) {
        fetchQueryInquiryComparisonInfoLCXX(demandName, index);
      }
    }
  };
  const handleSltSearch = str => {
    FetchQueryInquiryComparisonInfo({
      flowId: '-1',
      projectId: xmid,
      queryType: 'GLXQ',
      paging: 1,
      current: 1,
      pageSize: 30,
      demandName: str,
      total: -1,
      sort: '',
    }).then(res => {
      if (res.success) {
        const { lcxx } = res;
        setCurrentPage(1);
        setIsNoMoreData(false);
        setDemandName(str);
        setLcxxData(p => [...JSON.parse(lcxx)]);
        console.log(
          '🚀 ~ file: index.js:151 ~ handleSltSearch ~ JSON.parse(lcxx):',
          JSON.parse(lcxx),
          str,
        );
      }
    });
  };

  const handleSltBlur = () => {
    setCurrentPage(1);
    setIsNoMoreData(false);
    setDemandName('');
    FetchQueryInquiryComparisonInfo({
      flowId: '-1',
      projectId: xmid,
      queryType: 'GLXQ',
      paging: 1,
      current: 1,
      pageSize: 30,
      demandName: '',
      total: -1,
      sort: '',
    }).then(res => {
      if (res.success) {
        const { lcxx } = res;
        setCurrentPage(1);
        setIsNoMoreData(false);
        setLcxxData(p => [...JSON.parse(lcxx)]);
      }
    });
  };

  const callBackParams = params => {
    console.log('params', params);
    setParams({ ...params });
    getTableData(params);
  };

  //点击查询
  const handleSearch = params => {
    setParams({ ...params });
    getTableData(params);
  };

  return (
    <div
      className="require-list-box"
      style={{ overflow: 'hidden', height: '540px', margin: '24px' }}
    >
      <Spin spinning={isSpinning} tip="加载中" size="large">
        <TopConsole params={params} handleSearch={handleSearch} callBackParams={callBackParams} />
        <InfoTable
          lcxxData={lcxxData}
          params={params}
          handleReachBottom={handleReachBottom}
          setTableLoading={setTableLoading}
          callBackParams={callBackParams}
          tableData={tableData}
          tableLoading={tableLoading}
          getTableData={getTableData}
          total={total}
          demandName={demandName}
          handleSltSearch={handleSltSearch}
          handleSltBlur={handleSltBlur}
        />
      </Spin>
    </div>
  );
}
