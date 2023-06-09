import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip} from 'antd';
// import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import InfoOprtModal from '../../SupplierDetail/TopConsole/InfoOprtModal/index.js';
import moment from "moment";

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

  //列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      width: '16%',
      key: 'XMMC',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text}</span>,
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '8%',
      key: 'RYMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{color: '#3361ff'}}
              to={{
                pathname: `/pms/manage/MemberDetail/${EncryptBase64(
                  JSON.stringify({ryid: row.RYID}),
                )}`,
                state: {
                  routes: [{name: '外包人员列表', pathname: location.pathname}],
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
      title: '上班时间',
      dataIndex: 'SBSJ',
      width: '12%',
      key: 'SBSJ',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{moment(text).format('YYYY-MM-DD hh:mm:ss') || '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '下班时间',
      dataIndex: 'XBSJ',
      width: '12%',
      // align: 'right',
      key: 'XBSJ',
      ellipsis: true,
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{moment(text).format('YYYY-MM-DD hh:mm:ss') || '-'}</span>,
    },
    {
      title: '工时',
      dataIndex: 'GS',
      width: '6%',
      key: 'GS',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text || '-'}</span>,
    },
    {
      title: '状态',
      dataIndex: 'ZT',
      width: '6%',
      key: 'ZT',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text || '-'}</span>,
    },
    {
      title: '是否有效',
      dataIndex: 'SFYX',
      width: '6%',
      key: 'SFYX',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text || '-'}</span>,
    },
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
        {/*<Button type="primary" className="btn-add-prj" onClick={() => setVisible(true)}>*/}
        {/*  新增*/}
        {/*</Button>*/}
      </div>
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'RYID'}
          dataSource={tableData}
          // onChange={handleTableChange}
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
