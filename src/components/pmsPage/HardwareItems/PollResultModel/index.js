import React, {useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo} from '../../../../services/pmsServices';
import {message, Modal} from 'antd';
import {FetchQueryInquiryComparisonInfo} from "../../../../services/projectManage";

export default function PollResultModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [lcxxData, setLcxxData] = useState([]); //关联需求
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const {visible = false, closeModal} = props;
  const [params, setParams] = useState({demand: '', current: 1, pageSize: 10});

  useEffect(() => {
    getTableData();
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
    <div>
      <Modal
        wrapClassName="poll-result-box"
        width={'1000px'}
        maskClosable={false}
        zIndex={100}
        cancelText={'取消'}
        okText={"保存"}
        bodyStyle={{
          padding: '0',
        }}
        style={{top: '45px'}}
        title={null}
        visible={visible}
        onCancel={() => {
          // this.setState({ tableData: [] });
          closeModal();
        }}
      >
        <div
          style={{
            height: '42px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#3361FF',
            color: 'white',
            padding: '0 24px',
            borderRadius: '8px 8px 0 0',
            fontSize: '2.333rem',
          }}
        >
          <strong>询比结果列表</strong>
        </div>
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
      </Modal>
    </div>
  );
}
