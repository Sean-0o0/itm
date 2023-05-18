import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Popconfirm, Icon } from 'antd';
// import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import InfoOprtModal from '../../SupplierDetail/TopConsole/InfoOprtModal/index.js';

export default function InfoTable(props) {
  const {
    tableData,
    tableLoading,
    getTableData,
    XMJL = -1,
    total = 0,
    handleSearch,
    curPage,
    curPageSize,
    GYSLX,
  } = props; //表格数据
  const [visible, setVisible] = useState(false); //新增供应商弹窗显隐
  const location = useLocation();

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const { current = 1, pageSize = 20 } = pagination;
    // getTableData({ current, pageSize });
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        handleSearch(current, pageSize, sorter.field + ' ASC NULLS LAST,XMID ASC');
      } else {
        handleSearch(current, pageSize, sorter.field + ' DESC NULLS LAST,XMID DESC');
      }
    } else {
      handleSearch(current, pageSize);
    }
    return;
  };

  //金额格式化
  const getAmountFormat = (value = 0) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: 200,
      key: 'XMMC',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.projectStatus !== '草稿')
          return (
            <Tooltip title={text} placement="topLeft">
              <Link
                style={{ color: '#3361ff' }}
                to={{
                  pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                    JSON.stringify({
                      xmid: row.XMID,
                    }),
                  )}`,
                  state: {
                    routes: [{ name: '需求列表', pathname: location.pathname }],
                  },
                }}
                className="table-link-strong"
              >
                {text}
              </Link>
            </Tooltip>
          );
        return (
          <Tooltip title={text} placement="topLeft">
            <span style={{ cursor: 'default' }}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      // width: 90,
      width: '7%',
      key: 'XMJL',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.projectStatus !== '草稿')
          return (
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/staffDetail/${EncryptBase64(
                  JSON.stringify({
                    ryid: row.XMJLID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '需求列表', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {text}
            </Link>
          );
        return <span>{text}</span>;
      },
    },
    {
      title: '需求预算(元)',
      dataIndex: 'XQYS',
      width: '12%',
      align: 'right',
      key: 'XQYS',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => (
        <span style={{ marginRight: 20 }}>{text === undefined ? '' : getAmountFormat(text)}</span>
      ),
    },
    {
      title: '关联预算',
      dataIndex: 'GLYSXM',
      key: 'GLYSXM',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目金额(元)',
      dataIndex: 'XMJE',
      width: '12%',
      align: 'right',
      key: 'XMJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => (
        <span style={{ marginRight: 20 }}>{text === undefined ? '' : getAmountFormat(text)}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: '10%',
      render: (text, row, index) => {
        return (
          <div className="opr-colomn">
            <a className="sj">上架</a>
            <Popconfirm
              title="确定要下架吗?"
              onConfirm={() => {
                if (!dltData.includes(row.id)) {
                  setDltData(p => [...p, row.id]);
                  setEdited(true);
                }
              }}
            >
              <a className="xj">下架</a>
            </Popconfirm>
            <Icon type="ellipsis" rotate={90} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="info-table">
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'XMID'}
          dataSource={tableData}
          onChange={handleTableChange}
          // scroll={{ y: 500 }}
          pagination={{
            current: curPage,
            pageSize: curPageSize,
            defaultCurrent: 1,
            pageSizeOptions: ['20', '40', '50', '100'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${total} 条数据`,
            total: total,
          }}
          // bordered
        />
      </div>
    </div>
  );
}
