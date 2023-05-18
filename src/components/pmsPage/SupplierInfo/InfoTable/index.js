import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip } from 'antd';
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
    projectManager = -1,
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
  const getAmountFormat = (value = 0) => {
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
      title: '供应商名称',
      dataIndex: 'GYSMC',
      width: '22%',
      key: 'GYSMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  JSON.stringify({ splId: row.ID }),
                )}`,
                state: {
                  routes: [{ name: '供应商列表', pathname: location.pathname }],
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
      title: '供应商类型',
      dataIndex: 'GYSLX',
      width: '12%',
      key: 'GYSLX',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{(text && text.split(',').join('、')) || ''}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目金额(元)',
      dataIndex: 'XMJE',
      width: '13%',
      align: 'right',
      key: 'XMJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
    },
    {
      title: '项目数量',
      dataIndex: 'XMSL',
      width: '10%',
      key: 'XMSL',
      ellipsis: true,
      align: 'right',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => <span style={{ marginRight: 20 }}>{text}</span>,
    },
    {
      title: '联系人信息',
      dataIndex: 'LXRINFO',
      width: '26%',
      key: 'LXRINFO',
      ellipsis: true,
      render: arr =>
        arr.length === 0 ? (
          '无'
        ) : (
          <div className="lxr-info">
            <div className="lxr-txt">
              {arr[0]?.LXR}({arr[0]?.ZW}){arr[0]?.DH}
            </div>
            {arr.length > 1 && (
              <Popover
                title={null}
                content={getLxrinfContent(arr.slice(1))}
                placement="bottomRight"
                overlayClassName="lxr-info-popover"
              >
                <span>更多</span>
              </Popover>
            )}
          </div>
        ),
    },
    {
      title: '是否黑名单或淘汰供应商',
      dataIndex: 'SFHMD',
      key: 'SFHMD',
      ellipsis: true,
      render: (text, row, index) => {
        let arr = [];
        if (row.SFTT === '1') {
          arr.push('淘汰');
        }
        if (row.SFHMD === '1') {
          arr.push('黑名单');
        }
        if (arr.length === 0) return '否';
        return <span>{arr.join('、')}</span>;
      },
    },
  ];

  return (
    <div className="info-table">
      {visible && (
        <InfoOprtModal
          visible={visible}
          setVisible={setVisible}
          oprtType={'ADD'}
          GYSLX={GYSLX}
          getTableData={getTableData}
        />
      )}
      <div className="btn-add-prj-box">
        <Button type="primary" className="btn-add-prj" onClick={() => setVisible(true)}>
          新增
        </Button>
      </div>
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'ID'}
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
