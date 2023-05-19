import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Popconfirm, Icon } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import DemandInitiated from '../../HardwareItems/DemandInitiated/index.js';
import { QueryOutsourceRequirementList } from '../../../../services/pmsServices/index.js';
import moment from 'moment';

export default function InfoTable(props) {
  const {
    tableData,
    tableLoading,
    total = 0,
    handleSearch,
    curPage,
    curPageSize,
    subTableData,
    setSubTableData,
    getSubTableData,
    xmid = -2,
    isFinish,
  } = props; //表格数据
  const [visible, setVisible] = useState(false); //需求发起弹窗显隐
  const [currentXqid, setCurrentXqid] = useState(-1); //详情id
  const [currentXmid, setCurrentXmid] = useState(-1); //项目id
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); //默认展开行
  const location = useLocation();

  useEffect(() => {
    if (xmid !== -2) setExpandedRowKeys(p => [...p, xmid]);
    console.log('🚀 ~ file: index.js:32 ~ useEffect ~ d:', xmid);
    return () => {};
  }, [props]);

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
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      width: '30%',
      key: 'XMMC',
      ellipsis: true,
      render: (text, row, index) => {
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
      },
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      width: '7%',
      key: 'XMJL',
      ellipsis: true,
      render: (text, row, index) => {
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
      render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
    },
    {
      title: '关联预算',
      dataIndex: 'GLYSXM',
      key: 'GLYSXM',
      width: '29%',
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
      render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: '10%',
    },
  ];

  const expandedRowRender = record => {
    //嵌套子表格，每个宽度都要设
    const columns = [
      {
        title: '需求名称',
        dataIndex: 'XQMC',
        width: '30%',
        key: 'XQMC',
        ellipsis: true,
        render: (text, row, index) => {
          return (
            <Tooltip title={text} placement="topLeft">
              <Link
                style={{ color: '#3361ff' }}
                to={{
                  pathname: `/pms/manage/DemandDetail/${EncryptBase64(
                    JSON.stringify({
                      xqid: row.XQID,
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
        },
      },
      {
        title: '发起人',
        dataIndex: 'FQR',
        width: '7%',
        key: 'FQR',
        ellipsis: true,
        render: (text, row, index) => {
          return (
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/staffDetail/${EncryptBase64(
                  JSON.stringify({
                    ryid: row.FQRID,
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
        },
      },
      {
        title: '预估金额（元）',
        dataIndex: 'XQYGJE',
        width: '12%',
        align: 'right',
        key: 'XQYGJE',
        ellipsis: true,
        sorter: (a, b) => Number(a.XQYGJE ?? 0) - Number(b.XQYGJE ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '开发商反馈期限',
        dataIndex: 'KFSFKQX',
        key: 'KFSFKQX',
        width: '29%',
        ellipsis: true,
        render: text => <span>{text === undefined ? '' : moment(text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '预计综合评测日期',
        dataIndex: 'YJZHPCRQ',
        width: '12%',
        key: 'YJZHPCRQ',
        ellipsis: true,
        render: text => <span>{text === undefined ? '' : moment(text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '',
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
                  // if (!dltData.includes(row.id)) {
                  //   setDltData(p => [...p, row.id]);
                  //   setEdited(true);
                  // }
                }}
              >
                <a className="xj">下架</a>
              </Popconfirm>
              <Popover
                placement="bottomRight"
                title={null}
                content={
                  <div className="list">
                    <div
                      className="item"
                      onClick={() => {
                        setVisible(true);
                        setCurrentXqid(Number(row.XQID));
                        setCurrentXmid(Number(row.XMID));
                      }}
                    >
                      修改
                    </div>
                    <div className="item" onClick={() => {}}>
                      重新发起
                    </div>
                  </div>
                }
                overlayClassName="tc-btn-more-content-popover"
              >
                <Icon type="ellipsis" rotate={90} />
              </Popover>
            </div>
          );
        },
      },
    ];

    return (
      <Table columns={columns} dataSource={subTableData[record.XMID]} pagination={false} bordered />
    );
  };

  const onExpand = (expanded, record) => {
    // console.log(expanded, record);
    if (expanded) {
      getSubTableData(record.XMID);
    } else {
      //收起时置空
      setSubTableData(p => {
        return {
          ...p,
          [record.XMID]: [],
        };
      });
    }
  };
  if (xmid === -2)
    return (
      <div className="info-table">
        {visible && (
          <DemandInitiated
            xqid={currentXqid}
            closeModal={() => setVisible(false)}
            visible={visible}
            successCallBack={() => {
              setVisible(false);
              getSubTableData(currentXmid);
            }}
          />
        )}
        <div className="project-info-table-box">
          <Table
            loading={tableLoading}
            columns={columns}
            rowKey={'XMID'}
            dataSource={tableData}
            onChange={handleTableChange}
            expandedRowRender={expandedRowRender}
            onExpand={onExpand}
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
  return (
    <div className="info-table">
      {visible && (
        <DemandInitiated
          xqid={currentXqid}
          closeModal={() => setVisible(false)}
          visible={visible}
          successCallBack={() => {
            setVisible(false);
            getSubTableData(currentXmid);
          }}
        />
      )}
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'XMID'}
          dataSource={tableData}
          onChange={handleTableChange}
          expandedRowRender={expandedRowRender}
          defaultExpandedRowKeys={[String(xmid)]}
          onExpand={onExpand}
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
