import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Popconfirm } from 'antd';
// import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import InfoOprtModal from '../../SupplierDetail/TopConsole/InfoOprtModal/index.js';
import moment from 'moment';

export default function InfoTable(props) {
  const {
    tableData,
    tableLoading,
    getTableData,
    total = 0,
    handleSearch,
    curPage,
    curPageSize,
    GYSLX,
  } = props; //表格数据
  const [visible, setVisible] = useState(false); //新增供应商弹窗显隐
  const location = useLocation();

  //表格操作后更新数据
  const handleTableChange = pagination => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const { current = 1, pageSize = 20 } = pagination;
    // getTableData({ current, pageSize });
    handleSearch(current, pageSize);
  };

  //列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: '16%',
      key: 'XMMC',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ marginRight: 20, cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '8%',
      key: 'RYMC',
      ellipsis: true,
    },
    {
      title: '日期',
      dataIndex: 'CZRQ',
      width: '12%',
      key: 'CZRQ',
      ellipsis: true,
      render: text => (
        <span style={{ cursor: 'default' }}>
          {(text && moment(String(text)).format('YYYY-MM-DD')) || '-'}
        </span>
      ),
    },
    {
      title: '上班时间',
      dataIndex: 'SBSJ',
      width: '18%',
      key: 'SBSJ',
      ellipsis: true,
      render: text => (
        <span style={{ cursor: 'default' }}>
          {(text && moment(text).format('YYYY-MM-DD HH:mm:ss')) || '-'}
        </span>
      ),
    },
    {
      title: '下班时间',
      dataIndex: 'XBSJ',
      width: '18%',
      // align: 'right',
      key: 'XBSJ',
      ellipsis: true,
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => (
        <span style={{ marginRight: 20 }}>
          {(text && moment(text).format('YYYY-MM-DD HH:mm:ss')) || '-'}
        </span>
      ),
    },
    {
      title: '工时',
      dataIndex: 'GS',
      width: '8%',
      key: 'GS',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{ marginRight: 20 }}>{text ?? '-'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      width: '12%',
      key: 'ZT',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{ marginRight: 20 }}>{text || '-'}</span>,
    },
    // {
    //   title: '是否有效',
    //   dataIndex: 'SFYX',
    //   width: '6%',
    //   key: 'SFYX',
    //   ellipsis: true,
    //   // align: 'right',
    //   // sorter: true,
    //   // sortDirections: ['descend', 'ascend'],
    //   render: text => <span style={{marginRight: 20}}>{text || '-'}</span>,
    // },
  ];

  return (
    <div className="info-table">
      {/*{visible && (*/}
      {/*  <InfoOprtModal*/}
      {/*    visible={visible}*/}
      {/*    setVisible={setVisible}*/}
      {/*    oprtType={'ADD'}*/}
      {/*    GYSLX={GYSLX}*/}
      {/*    getTableData={getTableData}*/}
      {/*  />*/}
      {/*)}*/}
      <div className="btn-add-prj-box">
        <Popconfirm
          title="是否确定导出当前查询数据？"
          onConfirm={() => handleSearch(1, curPageSize, 'ID ASC', columns)}
        >
          <Button type="primary" className="btn-add-prj">
            导出
          </Button>
        </Popconfirm>
      </div>
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'KQID'}
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
