import { Table, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import { QuerySupplierDetailInfo } from '../../../../services/pmsServices';
const { TabPane } = Tabs;

export default function TableTabs(props) {
  const { WBRYGW = [], splId } = props;
  const [prjPurchase, setPrjPurchase] = useState([]); //采购项目
  const [HROutsource, setHROutsource] = useState([]); //人力外包
  const [splEvaluation, setSplEvaluation] = useState([]); //供应商评价
  const [tableLoading, setTableLoading] = useState(false); //表格加载状态
  const [curPage, setCurPage] = useState(0); //当前页码
  const [curPageSize, setCurPageSize] = useState(10); //数据长度
  const [total, setTotal] = useState(0); //数据总量
  const [curTab, setCurTab] = useState('CGXM'); //当前tab
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const location = useLocation();

  useEffect(() => {
    getTableData(1, 10, 'CGXM');
    return () => {};
  }, []);

  const handleTabsChange = key => {
    setCurPage(1);
    setCurPageSize(10);
    setTableLoading(true);
    if (key === '1') {
      getTableData(1, 10, 'CGXM');
      setCurTab('CGXM');
    } else if (key === '2') {
      getTableData(1, 10, 'RLWB');
      setCurTab('RLWB');
    } else {
      getTableData(1, 10, 'GYSPJ');
      setCurTab('GYSPJ');
    }
  };

  //金额格式化
  const getAmountFormat = (value = 0) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current = 1, pageSize = 10 } = pagination;
    getTableData(current, pageSize, curTab);
    return;
  };

  const getTableData = (current = 1, pageSize = 10, queryType = 'CGXM') => {
    QuerySupplierDetailInfo({
      current,
      pageSize,
      paging: 1,
      queryType,
      sort: 'string',
      supplierId: splId,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          if (queryType === 'CGXM') {
            setPrjPurchase(JSON.parse(res.cgxmRecord));
          } else if (queryType === 'RLWB') {
            setHROutsource(JSON.parse(res.rlwbRecord));
          } else {
            setSplEvaluation(JSON.parse(res.gyspjRecord));
          }
          setTotal(res.totalrows);
          setTableLoading(false);
        }
      })
      .catch(e => {
        console.error('QuerySupplierDetailInfo', e);
      });
  };

  //采购项目-列配置
  const prjPurchaseClm = [
    {
      title: '年份',
      dataIndex: 'NF',
      width: '7%',
      key: 'NF',
      ellipsis: true,
      sorter: (a, b) => Number(a.NF) - Number(b.NF),
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{txt}</span>,
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      key: 'XMMC',
      ellipsis: true,
      render: (txt, row, index) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: row.XMID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '供应商详情', pathname: location.pathname }],
                },
              }}
              className="prj-info-table-link-strong"
            >
              {txt}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'FZR',
      width: '10%',
      key: 'FZR',
      ellipsis: true,
      render: (txt, row, index) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.FZRID,
                }),
              )}`,
              state: {
                routes: [{ name: '供应商详情', pathname: location.pathname }],
              },
            }}
            className="prj-info-table-link-strong"
          >
            {txt}
          </Link>
        );
      },
    },
    {
      title: '项目金额(元)',
      dataIndex: 'ZF',
      width: '14%',
      align: 'right',
      key: 'ZF',
      ellipsis: true,
      sorter: (a, b) => Number(a.ZF) - Number(b.ZF),
      sortDirections: ['descend', 'ascend'],
      render: (txt, row) =>
        String(LOGIN_USER_INFO.id) === String(row.FZRID) ? (
          <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>
        ) : (
          '***'
        ),
    },
    {
      title: '已支付金额(元)',
      dataIndex: 'YZFJE',
      width: '14%',
      align: 'right',
      key: 'YZFJE',
      ellipsis: true,
      sorter: (a, b) => Number(a.YZFJE || 0) - Number(b.YZFJE || 0),
      sortDirections: ['descend', 'ascend'],
      render: (txt, row) =>
        String(LOGIN_USER_INFO.id) === String(row.FZRID) ? (
          <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>
        ) : (
          '***'
        ),
    },
    {
      title: '项目开始结束时间',
      dataIndex: 'XMKSSJ',
      width: '18%',
      key: 'XMKSSJ',
      ellipsis: true,
      render: (txt, row) => (
        <span>
          {(txt && moment(txt).format('YYYY-MM-DD')) || '--'}至
          {(row.XMJSSJ && moment(row.XMJSSJ).format('YYYY-MM-DD')) || '--'}
        </span>
      ),
    },
  ];
  //人力外包-列配置
  const HROutsourceClm = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      key: 'XMMC',
      ellipsis: true,
      render: (txt, row, index) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: row.XMID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '供应商详情', pathname: location.pathname }],
                },
              }}
              className="prj-info-table-link-strong"
            >
              {txt}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'SSFZR',
      width: '10%',
      key: 'SSFZR',
      ellipsis: true,
      render: (txt, row, index) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.SSFZRID,
                }),
              )}`,
              state: {
                routes: [{ name: '供应商详情', pathname: location.pathname }],
              },
            }}
            className="prj-info-table-link-strong"
          >
            {txt}
          </Link>
        );
      },
    },
    {
      title: '人员名称',
      dataIndex: 'WBRYMC',
      width: '10%',
      key: 'WBRYMC',
      ellipsis: true,
    },
    {
      title: '岗位',
      dataIndex: 'GW',
      width: '14%',
      key: 'GW',
      ellipsis: true,
      render: id => {
        let arr = WBRYGW.filter(x => x.ibm === id);
        if (arr.length !== 0) return arr[0]?.note;
        return '';
      },
    },
    {
      title: '人员等级',
      dataIndex: 'RYDJ',
      width: '7%',
      key: 'RYDJ',
      ellipsis: true,
    },
    {
      title: '入场时间',
      dataIndex: 'RCSJ',
      width: '9%',
      key: 'RCSJ',
      ellipsis: true,
      render: txt => (txt && moment(txt).format('YYYY-MM-DD')) || '--',
    },
    {
      title: '离场时间',
      dataIndex: 'LCSJ',
      width: '9%',
      key: 'LCSJ',
      ellipsis: true,
      render: txt => (txt && moment(txt).format('YYYY-MM-DD')) || '--',
    },
  ];
  //供应商评价-列配置
  const splEvaluationClm = [
    {
      title: '年份',
      dataIndex: 'NF',
      width: '7%',
      key: 'NF',
      ellipsis: true,
      sorter: (a, b) => Number(a.NF) - Number(b.NF),
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{txt}</span>,
    },
    {
      title: '评分人',
      dataIndex: 'PFR',
      width: '10%',
      key: 'PFR',
      ellipsis: true,
    },
    {
      title: '评价类别',
      dataIndex: 'PJLB',
      width: '10%',
      key: 'PJLB',
      ellipsis: true,
      render: txt => {
        if (txt === '1') return '产品评价';
        else if (txt === '2') return '服务评价';
        else return '--';
      },
    },
    {
      title: '总分',
      dataIndex: 'ZF',
      // width: 120,
      width: '10%',
      align: 'right',
      key: 'ZF',
      ellipsis: true,
      sorter: (a, b) => Number(a.ZF) - Number(b.ZF),
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{txt}</span>,
    },
    {
      title: '评级',
      dataIndex: 'PJDJ',
      key: 'PJDJ',
      ellipsis: true,
    },
  ];

  //表格配置
  const getTableContent = ({
    columns = [],
    rowKey = 'ID',
    dataSourse = [],
    tableLoading = false,
  }) => {
    return (
      <div className="table-box">
        <Table
          columns={columns}
          rowKey={rowKey}
          dataSource={dataSourse}
          size="middle"
          pagination={{
            current: curPage,
            pageSize: curPageSize,
            defaultCurrent: 1,
            pageSizeOptions: ['10', '20', '30', '40'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${total} 条数据`,
            total: total,
          }}
          scroll={dataSourse.length > 10 ? { y: 397 } : {}}
          onChange={handleTableChange}
          loading={tableLoading}
          // bordered
        />
      </div>
    );
  };
  return (
    <div className="table-tabs-box">
      <Tabs onChange={handleTabsChange} type="card">
        <TabPane tab="采购项目" key="1">
          {getTableContent({
            columns: prjPurchaseClm,
            rowKey: 'XMID',
            dataSourse: prjPurchase,
            tableLoading,
          })}
        </TabPane>
        <TabPane tab="人力外包" key="2">
          {getTableContent({
            columns: HROutsourceClm,
            rowKey: 'WBXMID',
            dataSourse: HROutsource,
            tableLoading,
          })}
        </TabPane>
        <TabPane tab="供应商评价" key="3">
          {getTableContent({
            columns: splEvaluationClm,
            rowKey: 'PJID',
            dataSourse: splEvaluation,
            tableLoading,
          })}
        </TabPane>
      </Tabs>
    </div>
  );
}
