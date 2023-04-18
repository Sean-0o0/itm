import React, {useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo} from '../../../../services/pmsServices';
import {message, Modal} from 'antd';
import {FetchQueryHardwareDemandInfo} from "../../../../services/projectManage";

export default function RequireModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const [params, setParams] = useState({demand: '', drafter: '', current: 1, pageSize: 10});
  const {visible = false, closeModal} = props;


  useEffect(() => {
    getTableData();
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
          <strong>需求列表</strong>
        </div>
        <TopConsole params={params} handleSearch={handleSearch} callBackParams={callBackParams}/>
        <InfoTable
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
