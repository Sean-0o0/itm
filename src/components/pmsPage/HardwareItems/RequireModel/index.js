import React, {useEffect, useState} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo} from '../../../../services/pmsServices';
import {message, Modal} from 'antd';

export default function RequireModel(props) {
  const [tableData, setTableData] = useState([]); //表格数据-项目列表
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0); //数据总数
  const {params = {}, visible = false, closeModal} = props;
  const {prjManager = -2, cxlx = 'ALL'} = params;

  useEffect(() => {
    if (prjManager === -2) {
      //无参数
      getTableData({});
    } else {
      //有参数
      // console.log('prjManager, cxlx', prjManager, cxlx);
      getTableData({projectManager: prjManager, cxlx});
    }
    return () => {
    };
  }, [prjManager, cxlx]);

  //获取表格数据
  const getTableData = ({current = 1, pageSize = 10, projectManager = -1, cxlx = 'ALL'}) => {
    setTableLoading(true);
    QueryProjectListInfo({
      projectManager,
      current,
      pageSize,
      paging: 1,
      sort: 'string',
      total: -1,
      queryType: cxlx,
    })
      .then(res => {
        if (res?.success) {
          setTableData(p => [...JSON.parse(res.record)]);
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
        <TopConsole/>
        <InfoTable
          tableData={tableData}
          tableLoading={tableLoading}
          getTableData={getTableData}
          projectManager={params?.prjManager}
          total={total}
        />
      </Modal>
    </div>
  );
}
