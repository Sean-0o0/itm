import React, { useEffect, useState, useRef, useContext } from 'react';
import { message, Button, Modal, Form, Row, Col, Tooltip, Select, Input, DatePicker, Table } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { } from '../../../../services/pmsServices';
import moment from "moment";
import * as Lodash from "lodash";

import { MemberInfoContext } from '../index'

/**
 * 表格
 * @param {*} props 
 * @returns 
 */
const TableBox = (props) => {

  const { isTableLoading, tableData, curPageNum, setCurPageNum, pageSize, setPageSize, total } = props

  const { dateFormater } = useContext(MemberInfoContext)

  /** 分页数据改变 */
  const paginationChangeHandle = (pagination, filters, sorter, extra) => {
    setCurPageNum(pagination.current)
    setPageSize(pagination.pageSize)
  };

  const columns = [
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '10%',
      key: 'RYMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/MemberDetail/${EncryptBase64(
                  JSON.stringify({ ryid: row.RYID }),
                )}`,
                state: {
                  routes: [{ name: '外包人员列表', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {text}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '负责人',
      width: '10%',
      dataIndex: 'FZR',
      key: 'FZR',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '所属供应商名称',
      dataIndex: 'SSGYS',
      width: '15%',
      key: 'SSGYS',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '入场日期',
      dataIndex: 'RCRQ',
      width: '10%',
      key: 'RCRQ',
      ellipsis: true,
      render: text => <span>{dateFormater(text)}</span>
    },
    {
      title: '离场日期',
      dataIndex: 'LCRQ',
      width: '10%',
      key: 'LCRQ',
      ellipsis: true,
      render: text => <span>{dateFormater(text)}</span>
    },
    {
      title: '人员说明',
      dataIndex: 'SM',
      width: '30%',
      key: 'SM',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
  ]


  return (
    <Table
      loading={isTableLoading}
      columns={columns}
      rowKey={(record, index) => {
        // return record.id
        return index
      }}
      dataSource={tableData}
      onChange={paginationChangeHandle}
      // scroll={{
      //   x: false,
      //   y: '50vh'
      // }}
      pagination={{
        current: curPageNum,
        pageSize: pageSize,
        // pageSizeOptions: ['20', '40', '50', '100'],
        showSizeChanger: true,
        hideOnSinglePage: false,
        showQuickJumper: true,
        total: total,
        showTotal: (val) => `共 ${val} 条数据`,
      }}
    >
    </Table>
  )

}

export default TableBox
