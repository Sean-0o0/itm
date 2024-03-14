import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip} from 'antd';
// import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import InfoOprtModal from '../../SupplierDetail/TopConsole/InfoOprtModal/index.js';

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
  const handleTableChange = (pagination) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const {current = 1, pageSize = 20} = pagination;
    // getTableData({ current, pageSize });
    handleSearch(current, pageSize);
  };

  //列配置
  const columns = [
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
      title: '外包人员账号',
      dataIndex: 'XTZH',
      width: '10%',
      key: 'XTZH',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{(text && text.split(',').join('、')) || ''}</span>
        </Tooltip>
      ),
    },
    {
      title: '人员等级',
      dataIndex: 'RYDJ',
      width: '8%',
      // align: 'right',
      key: 'RYDJ',
      ellipsis: true,
    },
    {
      title: '岗位',
      dataIndex: 'GW',
      width: '10%',
      key: 'GW',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '所属项目',
      dataIndex: 'SSXM',
      // width: '16%',
      key: 'SSXM',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '所属供应商',
      dataIndex: 'SSGYS',
      width: '15%',
      key: 'SSGYS',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '简历',
      dataIndex: 'JL',
      width: '12%',
      key: 'JL',
      ellipsis: true,
      render: (text, row) => <Tooltip title={text} placement="topLeft">
        <a style={{color: '#3361FF'}}
           href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=JL&PopupWin=false&Table=TWBRY_RYXX&operate=Download&Type=View&ID=${row.RYID}&fileid=0`}>
        {text}</a></Tooltip>,
    },
    {
      title: '保密协议',
      dataIndex: 'BMXY',
      width: '12%',
      key: 'BMXY',
      ellipsis: true,
      render: (text, row) => <Tooltip title={text} placement="topLeft">
        <a style={{color: '#3361FF'}}
           href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=BMXY&PopupWin=false&Table=TWBRY_RYXX&operate=Download&Type=View&ID=${row.RYID}&fileid=0`}>
        {text}</a></Tooltip>,
    },
    {
      title: '人员状态',
      dataIndex: 'RYZT',
      width: '8%',
      key: 'RYZT',
      ellipsis: true,
      // align: 'right',
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text || '暂无'}</span>,
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
          onChange={handleTableChange}
          // scroll={{ y: 500 }}
          pagination={{
            current: curPage,
            pageSize: curPageSize,
            defaultCurrent: 1,
            defaultPageSize: 5,
            // pageSizeOptions: ['20', '40', '50', '100'],
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
