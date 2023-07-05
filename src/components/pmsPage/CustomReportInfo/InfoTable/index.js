import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Table, Popover, message, Tooltip } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import OprtModal from './OprtModal';

export default function InfoTable(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    tableLoading,
    tableData = {
      data: [], //表格数据
      current, //当前页码
      pageSize, //每页条数
      total: 0, //数据总数
    },
  } = dataProps;
  const { setFilterData, getTableData } = funcProps;
  const [newRptVisible, setNewRptVisible] = useState(false); //新增报告显隐
  const location = useLocation();

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current = 1, pageSize = 20 } = pagination;
    getTableData(current, pageSize);
    return;
  };

  //列配置
  const columns = [
    {
      title: '报告名称',
      dataIndex: 'BGMC',
      width: '22%',
      key: 'BGMC',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={
                {
                  // pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  //   JSON.stringify({ splId: row.ID }),
                  // )}`,
                  // state: {
                  //   routes: [{ name: '自定义报告', pathname: location.pathname }],
                  // },
                }
              }
              className="table-link-strong"
            >
              {ext}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'CJR',
      width: '8%',
      key: 'CJR',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/StaffDetail/${EncryptBase64(
                JSON.stringify({ ryid: row.CJRID }),
              )}`,
              state: {
                routes: [{ name: '自定义报告', pathname: location.pathname }],
              },
            }}
            className="table-link-strong"
          >
            {txt}
          </Link>
        );
      },
    },
    {
      title: '最近更新时间',
      dataIndex: 'ZJGXSJ',
      width: '12%',
      key: 'ZJGXSJ',
      ellipsis: true,
      // render: txt => (txt && moment()) || '',
    },
    {
      title: '创建日期',
      dataIndex: 'CJRQ',
      width: '12%',
      key: 'CJRQ',
      ellipsis: true,
      // render: txt => (txt && moment()) || '',
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      width: '12%',
      align: 'center',
      key: 'ZT',
      ellipsis: true,
      render: txt => <Switch size="small" loading />,
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: '12%',
      align: 'center',
      key: 'OPRT',
      ellipsis: true,
      render: () => (
        <Fragment>
          <a style={{ color: '#3361ff' }}>修改</a>
          <a style={{ color: '#3361ff', marginLeft: 6 }}>删除</a>
        </Fragment>
      ),
    },
  ];

  return (
    <div className="info-table">
      <OprtModal visible={newRptVisible} setVisible={setNewRptVisible} />
      <div className="btn-add-prj-box">
        <Button type="primary" className="btn-add-prj" onClick={() => setNewRptVisible(true)}>
          新增
        </Button>
      </div>
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'BGID'}
          dataSource={tableData.data}
          onChange={handleTableChange}
          pagination={{
            current: tableData.current,
            pageSize: tableData.pageSize,
            defaultCurrent: 1,
            pageSizeOptions: ['20', '40', '50', '100'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${tableData.total} 条数据`,
            total: tableData.total,
          }}
          bordered
        />
      </div>
    </div>
  );
}
