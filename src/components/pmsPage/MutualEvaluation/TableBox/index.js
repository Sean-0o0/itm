import React, { useEffect, useCallback, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import ScoreSlider from '../ScoreSlider';
import { isEqual } from 'lodash';

export default function TableBox(props) {
  const { curPrj = {}, tableData, setTableData, routes = [], handleScoreChange } = props;

  useEffect(() => {
    return () => { };
  }, [JSON.stringify(tableData.data)]);

  //右侧表配置
  const columns = [
    // {
    //   title: '项目名称',
    //   dataIndex: 'XMMC',
    //   // width: '20%',
    //   key: 'XMMC',
    //   ellipsis: true,
    //   render: (txt, row, index) => {
    //     return (
    //       <Tooltip title={txt} placement="topLeft">
    //         <Link
    //           style={{ color: '#3361ff' }}
    //           to={{
    //             pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
    //               JSON.stringify({
    //                 xmid: row.XMID,
    //               }),
    //             )}`,
    //             state: {
    //               routes,
    //             },
    //           }}
    //           className="table-link-strong"
    //         >
    //           {txt}
    //         </Link>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '12%',
      key: 'RYMC',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.RYMCID,
              }),
            )}`,
            state: {
              routes,
            },
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '项目角色',
      dataIndex: 'GW',
      width: '38%',
      key: 'GW',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '分数',
      dataIndex: 'PF',
      width: '50%',
      key: 'PF',
      ellipsis: true,
      render: (txt, x) => (
        <ScoreSlider
          score={txt}
          onChange={v => handleScoreChange(v, x)}
          disabled={curPrj.done || !curPrj.open || txt !== undefined}
          key={`${x.RYMCID}-${txt}`}
        />
      ),
    },
  ];

  //表格操作后更新数据
  const handleTableChange = useCallback((pagination = {}) => {
    const { current = 1, pageSize = 20 } = pagination;
    setTableData(p => ({ ...p, current, pageSize }));
    return;
  }, []);

  return (
    <div className="table-box">
      <Table
        loading={tableData.loading}
        rowKey={row => `${curPrj.id}-${row.RYMCID}`}
        columns={columns}
        dataSource={tableData.data}
        // onChange={handleTableChange}
        // pagination={{
        //   current: tableData.current,
        //   pageSize: tableData.pageSize,
        //   defaultCurrent: 1,
        //   pageSizeOptions: ['10', '20', '30', '40'],
        //   showSizeChanger: true,
        //   hideOnSinglePage: false,
        //   showTotal: t => `共 ${tableData.data.length} 条数据`,
        //   total: tableData.data.length,
        // }}
        pagination={false}
      />
    </div>
  );
}
