import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router';
import {Pagination, Table} from "antd";
import moment from "moment";

export default function InfoTable(props) {
  const {
    total,
    tableData,
    tableLoading,
    params,
    callBackParams,
  } = props; //表格数据
  const location = useLocation();
  console.log('🚀 ~ tableData:', tableData);


  const columns = [
    {
      title: '项目周期',
      dataIndex: 'XMZQ',
      key: 'XMZQ',
      width: 88,
      render: text => (
        <span>第{text}周</span>
      ),
    },
    {
      title: '时间',
      dataIndex: 'SJ',
      key: 'SJ',
      width: 150,
      render: (text, row) => (
        <span>{moment(row.KSSJ, "YYYY-MM-DD").format("YYYY-MM-DD")}至{moment(row.JSSJ, "YYYY-MM-DD").format("YYYY-MM-DD")}</span>
      ),
    },
    {
      title: '当前进度',
      dataIndex: 'DQJD',
      key: 'DQJD',
      width: 170,
    },
    {
      title: '当前状态',
      dataIndex: 'DQZT',
      key: 'DQZT',
      width: 104,
    },
    {
      title: '重要事项说明',
      dataIndex: 'ZYSXSM',
      key: 'ZYSXSM',
      width: 175,
    },
    {
      title: '本周工作内容',
      dataIndex: 'BZGZNR',
      key: 'BZGZNR',
      width: 192,
    },
    {
      title: '下周工作安排',
      dataIndex: 'XZGZAP',
      key: 'XZGZAP',
      width: 192,
    },
  ];

  //表格操作后更新数据
  const handleTableChange = (current, pageSize) => {
    console.log('handleTableChange', current, pageSize);
    callBackParams({...params, current, pageSize});
  };

  return (
    <div className="prj-table-info">
      <Table loading={tableLoading} scroll={{y: 390}} columns={columns} rowKey={'XMID'} onChange={handleTableChange}
             dataSource={tableData} pagination={false}/>
      <div className='page-individual'>
        {(total !== -1 && total !== 0) && <Pagination
          onChange={handleTableChange}
          onShowSizeChange={handleTableChange}
          pageSize={params.pageSize}
          current={params.current}
          total={total}
          pageSizeOptions={['5', '10', '20', '100']}
          showSizeChanger={true}
          // hideOnSinglePage={true}
          showQuickJumper={true}
          showTotal={total => `共 ${total} 条数据`}
        />}

      </div>
    </div>
  );
}
