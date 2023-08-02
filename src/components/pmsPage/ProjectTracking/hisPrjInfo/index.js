import React, {useCallback, useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo, QueryProjectTracking} from '../../../../services/pmsServices';
import {Button, message, Modal, Spin} from 'antd';
import {FetchQueryInquiryComparisonInfo} from '../../../../services/projectManage';
import {DecryptBase64} from '../../../Common/Encrypt';

export default function HisPrjInfo(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(true); //表格加载状态
  const [total, setTotal] = useState(0); //数据总数
  const [currentPage, setCurrentPage] = useState(1); //收款账户数据懒加载页号

  const {
    xmid,
    xmzq,
    visible,
    closeModal,
  } = props;
  const [params, setParams] = useState({startTime: '', endTime: '', current: 1, pageSize: 5});

  useEffect(() => {
    if (xmid !== -1) {
      getTableData(params);
    }
  }, [xmid]);

  //获取表格数据
  const getTableData = (params) => {
    setTableLoading(true);
    const payload = {
      current: params.current,
      // cycle: 0,
      // endTime: 0,
      // org: 0,
      pageSize: params.pageSize,
      paging: 1,
      projectId: xmid,
      queryType: "GZZB",
      sort: "",
      // startTime: 0,
      total: -1
    }
    if (params.startTime > 0 && params.startTime !== '') {
      payload.startTime = params.startTime
    }
    if (params.endTime > 0 && params.endTime !== '') {
      payload.endTime = params.endTime
    }
    QueryProjectTracking({...payload})
      .then(res => {
        if (res?.success) {
          setTableLoading(false)
          setTotal(res.totalrows)
          setTableData([...JSON.parse(res.result)])
        }
      })
      .catch(e => {
        setTableLoading(false)
        message.error('接口信息获取失败', 1);
      });
  };

  const callBackParams = params => {
    console.log('params', params);
    setParams({...params});
    getTableData(params);
  };

  //点击查询
  const handleSearch = params => {
    setParams({...params});
    getTableData(params);
  };

  return (
    <Modal
      wrapClassName="editMessage-modify"
      style={{top: '10px'}}
      width={'1080px'}
      title={null}
      zIndex={100}
      bodyStyle={{
        padding: '0',
      }}
      onCancel={closeModal}
      maskClosable={false}
      footer={null}
      visible={visible}
    >
      <div
        style={{
          height: '42px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#3361FF',
          color: 'white',
          // marginBottom: '16px',
          padding: '0 24px',
          borderRadius: '8px 8px 0 0',
          fontSize: '15px',
        }}
      >
        <strong>项目历史情况</strong>
      </div>
      <div
        className="his-list-box"
        style={{padding: '24px'}}
      >
        <TopConsole params={params} handleSearch={handleSearch} callBackParams={callBackParams}/>
        <InfoTable
          xmzq={xmzq}
          params={params}
          tableData={tableData}
          tableLoading={tableLoading}
          callBackParams={callBackParams}
          total={total}
        />
      </div>
    </Modal>
  );
}
