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
  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const {current = 1, pageSize = 20} = pagination;
    // getTableData({ current, pageSize });
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        handleSearch(current, pageSize, sorter.field + ' ASC,ID ASC');
      } else {
        handleSearch(current, pageSize, sorter.field + ' DESC,ID DESC');
      }
    } else {
      handleSearch(current, pageSize);
    }
    return;
  };

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //联系人展示
  const getLxrinfContent = (arr = []) => {
    return (
      <div className="list">
        {arr.map(x => (
          <div className="item" key={x.ID}>
            <div className="top">
              <div>{x.LXR}</div>
              <div className="position-tag">{x.ZW}</div>
            </div>
            <div className="bottom">
              <span>电话：</span> {x.DH || '无'}
              <span className="email">｜ 邮箱：</span> {x.QTLXFS || '无'}
            </div>
          </div>
        ))}
      </div>
    );
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
      width: '6%',
      align: 'right',
      key: 'RYDJ',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text}</span>,
    },
    {
      title: '岗位',
      dataIndex: 'GW',
      width: '10%',
      key: 'GW',
      ellipsis: true,
      align: 'right',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text}</span>,
    },
    {
      title: '所属项目',
      dataIndex: 'SSXM',
      width: '22%',
      key: 'SSXM',
      ellipsis: true,
      align: 'right',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text}</span>,
    },
    {
      title: '所属供应商',
      dataIndex: 'SSGYS',
      width: '22%',
      key: 'SSGYS',
      ellipsis: true,
      align: 'right',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => <span style={{marginRight: 20}}>{text}</span>,
    },
    {
      title: '简历',
      dataIndex: 'JL',
      width: '10%',
      key: 'JL',
      ellipsis: true,
      align: 'right',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (text, row) => <span style={{marginRight: 20}}>
        <a style={{color: '#3361FF'}}
           href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?EVENT_SOURCE=Download&Table=TWBRY_RYXX&ID=${row.RYID}&Column=JL&Type=View&fileid=0`}>
        {text}</a></span>,
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
        <Button type="primary" className="btn-add-prj" onClick={() => setVisible(true)}>
          新增
        </Button>
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
