import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Modal } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

export default function InfoTable(props) {
  const { tableData = {}, columns = [], getTableData = () => {}, getSQL = () => {} } = props; //表格数据
  const location = useLocation();

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //获取项目标签数据
  const getTagData = (tag, idtxt) => {
    // console.log("🚀 ~ file: index.js:52 ~ getTagData ~ tag, idtxt:", tag, idtxt)
    let arr = [];
    let arr2 = [];
    if (
      tag !== '' &&
      tag !== null &&
      tag !== undefined &&
      idtxt !== '' &&
      idtxt !== null &&
      idtxt !== undefined
    ) {
      if (tag.includes(',')) {
        arr = tag.split(',');
        arr2 = idtxt.split(',');
      } else {
        arr.push(tag);
        arr2.push(idtxt);
      }
    }
    let arr3 = arr.map((x, i) => {
      return {
        name: x,
        id: arr2[i],
      };
    });
    // console.log('🚀 ~ file: index.js ~ line 73 ~ arr3 ~ arr3 ', arr3, arr, arr2);
    return arr3;
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const { current = 1, pageSize = 20 } = pagination;
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        getSQL({ current, pageSize, sort: sorter.field + ' DESC,XMID DESC' });
      } else {
        getSQL({ current, pageSize, sort: sorter.field + ' ASC,XMID DESC' });
      }
    } else {
      getSQL({ current, pageSize });
    }
    return;
  };

  return (
    <div className="project-info-table-box">
      <Table
        columns={columns}
        rowKey={'projectId'}
        dataSource={tableData.data}
        onChange={handleTableChange}
        pagination={{
          current: tableData.curPage,
          pageSize: tableData.curPageSize,
          defaultCurrent: 1,
          pageSizeOptions: ['20', '40', '50', '100'],
          showSizeChanger: true,
          hideOnSinglePage: false,
          showQuickJumper: true,
          showTotal: t => `共 ${tableData.total} 条数据`,
          total: tableData.total,
        }}
        scroll={{ x: true }}
        // bordered
      />
    </div>
  );
}
