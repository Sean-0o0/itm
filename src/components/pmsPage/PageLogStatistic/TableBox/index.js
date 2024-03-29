import React, { useEffect, useCallback, useState } from 'react';
import { Button, Dropdown, Menu, message, Popover, Spin, Table, Tooltip } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { CreateOperateHyperLink, QueryOperateDetail } from '../../../../services/pmsServices';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

export default function TableBox(props) {
  const { tableData = {}, getTableData, searchData = {}, sortInfo = {}, setSortInfo } = props;

  const location = useLocation();

  const [czmxData, setCzmxData] = useState([]); //操作明细数据
  const [czmxLoading, setCzmxLoading] = useState(false); //操作明细加载状态

  useEffect(() => {
    return () => {};
  }, [JSON.stringify(tableData.data)]);

  //表配置
  const columns = [
    {
      title: '页面名称',
      dataIndex: 'CZYM',
      width: '15%',
      key: 'CZYM',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '操作类型',
      dataIndex: 'CZLX',
      width: '10%',
      key: 'CZLX',
      ellipsis: true,
    },
    {
      title: '访问次数',
      dataIndex: 'FWCS',
      width: '12%',
      key: 'FWCS',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'FWCS' ? sortInfo.order : undefined,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '操作明细',
      dataIndex: 'CZMX',
      width: '10%',
      key: 'CZMX',
      ellipsis: true,
      render: (txt, row) => (
        <Tooltip title={txt} placement="topLeft">
          <Popover
            trigger="click"
            title={null}
            content={getCzmxContent(czmxData)}
            placement="bottomRight"
            arrowPointAtCenter
            overlayClassName="page-log-statistic-box-popover"
          >
            <span
              className='table-link-detail'
              onClick={() => getCzmxData(row)}
            >
              查看详情
            </span>
          </Popover>
        </Tooltip>
      ),
    },
    {
      title: '操作人',
      dataIndex: 'CZR',
      width: '8%',
      key: 'CZR',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.CZRID,
              }),
            )}`,
            state: {
              routes: [{ name: '页面埋点统计', pathname: location.pathname }],
            },
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '最近操作时间',
      dataIndex: 'ZJCZSJ',
      // width: '15%',
      key: 'ZJCZSJ',
      ellipsis: true,
      render: txt =>
        txt ? moment(String(txt), 'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : '',
    },
  ];

  const getCzmxContent = (data = []) => {
    return (
      <div className="list">
        {czmxLoading ? (
          <Spin size="small" />
        ) : (
          data.map(x => (
            <div className="item" key={x.id}>
              {x.time
                ? moment(String(x.time), 'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                : ''}
              <span>{x.operateType}</span>
            </div>
          ))
        )}
      </div>
    );
  };

  const getCzmxData = async (row = {}) => {
    try {
      setCzmxLoading(true);
      const res = await QueryOperateDetail({
        pageName: row.CZYM,
        operatorID: Number(row.CZRID),
        operateType: row.CZLX,
        startTime: searchData.startTime,
        endTime: searchData.endTime,
      });
      setCzmxData(JSON.parse(res.result));
      setCzmxLoading(false);
    } catch (e) {
      console.error('🚀 ~ getCzmxData ~ e:', e);
      setCzmxLoading(false);
    }
  };

  //表格操作后更新数据
  const handleTableChange = (pagination = {}, _, sorter = {}) => {
    const { current = 1, pageSize = 20 } = pagination;
    setSortInfo(sorter);
    if (sorter.order !== undefined) {
      getTableData({
        current,
        pageSize,
        sort: sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
      });
    } else {
      getTableData({
        current,
        pageSize,
      });
    }
    return;
  };

  return (
    <div className="table-box">
      <div className="btn-row">
        <span className="opr-times">
          访问次数共计：<span className="opr-times-num">{tableData.fwcs}</span>
        </span>
      </div>
      <div className="table-wrapper">
        <Table
          rowKey={'ID'}
          columns={columns}
          dataSource={tableData.data}
          onChange={handleTableChange}
          pagination={{
            current: tableData.current,
            pageSize: tableData.pageSize,
            defaultCurrent: 1,
            pageSizeOptions: ['20', '40', '50', '100'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showTotal: t => `共 ${tableData.total} 条数据`,
            total: tableData.total,
          }}
        />
      </div>
    </div>
  );
}
