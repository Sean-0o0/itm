/*
 * @Author: 钟海秀(创新业务产品部) zhonghaixiu12534@apexsoft.com.cn
 * @Date: 2024-02-06 14:00:19
 * @LastEditTime: 2024-02-28 18:50:10
 * @FilePath: \pro-pms-fe\src\components\pmsPage\InnovationContract\IterationContractInfo\index.js
 * @Descripttion: 迭代合同信息tab
 */
import React, { useState, useEffect } from 'react';
import { Table, message, Tooltip, Select, Drawer, Input, Button } from 'antd';
import { QueryBudgetStatistics, QueryIteContractInfoList } from '../../../../services/pmsServices';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import FileDownload from '../../IntelProperty/FileDownload';
import { connect } from 'dva';
import IterationContract from '../../ProjectDetail/MileStone/ItemBtn/IterationContract';

const IterationContractInfo = connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(props => {
  const { dataProps = {}, funcProps = {}, userBasicInfo = {} } = props;
  const { tableData = {}, filterData = {}, sortInfo = {}, searchData = {} } = dataProps;
  const {
    setFilterData = () => {},
    queryDDHTTableData = () => {},
    setIsSpinning = () => {},
    setSortInfo = () => {},
    setSearchData = () => {},
  } = funcProps;
  const [drawerData, setDrawerData] = useState({
    data: [],
    visible: false,
    spinning: false,
  }); //项目付款详情抽屉
  const location = useLocation();
  const DJLX = [
    {
      note: '人日',
      ibm: '1',
    },
    {
      note: '人月',
      ibm: '2',
    },
  ];
  const [modalData, setModalData] = useState({
    visible: false,
    type: 'UPDATE',
    xmid: -1,
  }); //编辑弹窗数据
  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false

  //列配置
  const columns = [
    {
      title: '合同编码',
      dataIndex: 'HTBH',
      key: 'HTBH',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '合同名称',
      dataIndex: 'HTMC',
      key: 'HTMC',
      width: 160,
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '关联项目',
      dataIndex: 'XMMC',
      key: 'XMMC',
      ellipsis: true,
      width: 150,
      render: (txt, row) => (
        <div title={txt}>
          <Tooltip title={txt} placement="topLeft">
            <Link
              className="table-link-strong"
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: row.XMID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '合同列表', pathname: location.pathname }],
                },
              }}
            >
              {txt}
            </Link>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '供应商',
      dataIndex: 'GYSMC',
      width: 150,
      key: 'GYSMC',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  JSON.stringify({ splId: row.GYSID }),
                )}`,
                state: {
                  routes: [{ name: '合同列表', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {txt}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '单价类型',
      dataIndex: 'DJLX',
      key: 'DJLX',
      width: 80,
      ellipsis: true,
      render: txt => getNote(DJLX, txt),
    },
    {
      title: '人力单价',
      dataIndex: 'RLDJ',
      width: 100,
      align: 'right',
      key: 'RLDJ',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'RLDJ' ? sortInfo.order : undefined, //排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false
      sortDirections: ['descend', 'ascend'],
      render: txt => (
        <span style={{ marginRight: 20 }}>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>
      ),
    },
    {
      title: '今年付款金额',
      dataIndex: 'JNFKJE',
      width: 150,
      align: 'right',
      key: 'JNFKJE',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'JNFKJE' ? sortInfo.order : undefined, //排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '历史付款金额',
      dataIndex: 'LNFKJE',
      width: 150,
      align: 'right',
      key: 'LNFKJE',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'LNFKJE' ? sortInfo.order : undefined, //排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend' false
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '附件',
      dataIndex: 'FJ',
      key: 'FJ',
      width: 80,
      ellipsis: true,
      render: (txt, row) => (
        <FileDownload
          fileStr={txt}
          params={{
            objectName: 'TXMXX_DDXM_HTXX',
            columnName: 'FJ',
            id: row.HTID,
          }}
        />
      ),
    },
    {
      title: '录入人',
      dataIndex: 'LRR',
      width: 80,
      key: 'LRR',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.LRRID,
                }),
              )}`,
              state: {
                routes: [{ name: '合同列表', pathname: location.pathname }],
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
      title: '付款明细',
      dataIndex: 'FKMX',
      width: 100,
      key: 'FKMX',
      ellipsis: true,
      render: (_, row) => (
        <a
          style={{ color: '#3361ff', display: 'block' }}
          onClick={() => openDrawer(Number(row.HTID))}
        >
          查看明细
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: 80,
      align: 'center',
      key: 'OPRT',
      fixed: 'right',
      ellipsis: true,
      render: (txt, row) => (
        <div className="opr-column">
          {String(row.LRRID) === String(userBasicInfo.id) && (
            <span onClick={() => handleEdit(row.XMID)}>编辑</span>
          )}
        </div>
      ),
    },
  ];

  //编辑
  const handleEdit = xmid => {
    setModalData({
      visible: true,
      type: 'UPDATE',
      xmid,
    });
  };

  //获取字典note
  const getNote = (data = [], ibm) =>
    ibm !== undefined ? data.find(x => x.ibm === String(ibm))?.note || '' : '';

  //打开明细抽屉
  const openDrawer = id => {
    setIsSpinning(true);
    QueryIteContractInfoList({
      id,
      current: 1,
      pageSize: 9999,
      paging: -1,
      sort: '',
      total: -1,
      queryType: 'DETAIL',
    })
      .then(res => {
        if (res?.success) {
          setDrawerData({
            data: JSON.parse(res.result),
            visible: true,
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀付款明细', e);
        message.error('付款明细获取失败', 1);
        setIsSpinning(false);
      });
  };

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current = 1, pageSize = 20 } = pagination;
    setSortInfo(sorter);
    let sort = '';
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        sort = sorter.field + ' ASC';
      } else {
        sort = sorter.field + ' DESC';
      }
    }
    queryDDHTTableData({
      current,
      pageSize,
      sort,
      ...searchData,
    });
    return;
  };

  const drawerColumns = [
    {
      title: '年份',
      dataIndex: 'XMNF',
      width: '10%',
      key: 'XMNF',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: '20%',
      key: 'XMMC',
      ellipsis: true,
      render: (txt, row, index) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              onClick={() =>
                setDrawerData(p => ({
                  ...p,
                  visible: false,
                }))
              }
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: row.XMID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '合同列表', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {txt}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      width: '20%',
      key: 'XMJL',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          onClick={() =>
            setDrawerData(p => ({
              ...p,
              visible: false,
            }))
          }
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.XMJLID,
              }),
            )}`,
            state: {
              routes: [{ name: '合同列表', pathname: location.pathname }],
            },
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '付款金额(元)',
      dataIndex: 'FKJE',
      width: '20%',
      align: 'right',
      key: 'FKJE',
      ellipsis: true,
      sorter: (a, b) => Number(a.FKJE || 0) - Number(b.FKJE || 0),
      sortDirections: ['descend', 'ascend'],
      render: txt => (
        <span style={{ marginRight: 20 }}>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>
      ),
    },
    {
      title: '付款时间',
      dataIndex: 'FKSJ',
      width: '20%',
      key: 'FKSJ',
      ellipsis: true,
      sorter: (a, b) => Number(a.FKSJ || 0) - Number(b.FKSJ || 0),
      sortDirections: ['descend', 'ascend'],
      render: txt =>
        !['', ' ', -1, '-1', undefined, null].includes(txt)
          ? moment(String(txt)).format('YYYY-MM-DD')
          : '',
    },
  ];

  return (
    <>
      <div className="table-box">
        {/* 迭代合同信息录入、编辑弹窗 */}
        <IterationContract
          dataProps={{ modalData: { ...modalData } }}
          funcProps={{
            setModalData,
            refresh: () =>
              queryDDHTTableData({
                current: tableData.current,
                pageSize: tableData.pageSize,
                sort: tableData.sort,
                ...searchData,
              }),
          }}
        />
        <div className="top-console">
          <div className="item-box">
            <div className="console-item" key="关联项目">
              <div className="item-label">关联项目</div>
              <Input
                value={filterData.projectName}
                className="item-selector"
                onChange={v => {
                  v.persist();
                  if (v.target.value === '') {
                    setFilterData(p => ({ ...p, projectName: undefined }));
                  } else {
                    setFilterData(p => ({ ...p, projectName: v.target.value }));
                  }
                }}
                placeholder={'请输入关联项目'}
                allowClear={true}
                style={{ width: '100%' }}
              />
            </div>
            <div className="console-item" key="合同名称">
              <div className="item-label">合同名称</div>
              <Input
                value={filterData.contractName}
                className="item-selector"
                onChange={v => {
                  v.persist();
                  if (v.target.value === '') {
                    setFilterData(p => ({ ...p, contractName: undefined }));
                  } else {
                    setFilterData(p => ({ ...p, contractName: v.target.value }));
                  }
                }}
                placeholder={'请输入合同名称'}
                allowClear={true}
                style={{ width: '100%' }}
              />
            </div>
            <div className="console-item" key="供应商">
              <div className="item-label">供应商</div>
              <Input
                value={filterData.vendor}
                className="item-selector"
                onChange={v => {
                  v.persist();
                  if (v.target.value === '') {
                    setFilterData(p => ({ ...p, vendor: undefined }));
                  } else {
                    setFilterData(p => ({ ...p, vendor: v.target.value }));
                  }
                }}
                placeholder={'请输入供应商'}
                allowClear={true}
                style={{ width: '100%' }}
              />
            </div>
            {filterFold && (
              <div className="filter-unfold" onClick={() => setFilterFold(false)}>
                更多
                <i className="iconfont icon-down" />
              </div>
            )}
            <Button
              className="btn-search"
              type="primary"
              onClick={() => {
                setSortInfo({ sort: undefined, columnKey: '' });
                queryDDHTTableData(filterData, setSearchData);
              }}
            >
              查询
            </Button>
            <Button className="btn-reset" onClick={() => setFilterData({})}>
              重置
            </Button>
          </div>
          {!filterFold && (
            <div className="item-box">
              <div className="console-item" key="录入人">
                <div className="item-label">录入人</div>
                <Input
                  value={filterData.entrant}
                  className="item-selector"
                  onChange={v => {
                    v.persist();
                    if (v.target.value === '') {
                      setFilterData(p => ({ ...p, entrant: undefined }));
                    } else {
                      setFilterData(p => ({ ...p, entrant: v.target.value }));
                    }
                  }}
                  placeholder={'请输入录入人'}
                  allowClear={true}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="filter-unfold" onClick={() => setFilterFold(true)}>
                收起
                <i className="iconfont icon-up" />
              </div>
            </div>
          )}
        </div>
        <div className="export-row">
          <span className="table-unit">单位：元</span>
        </div>
        <div
          className="project-info-table-box"
          style={filterFold ? { height: 'calc(100% - 129px)' } : { height: 'calc(100% - 194px)' }}
        >
          <Table
            columns={columns}
            rowKey={'HTID'}
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
            bordered //记得注释
            scroll={{
              x: 1410,
              y:
                window.innerWidth < 1440
                  ? filterFold
                    ? 'calc(100vh - 362px)'
                    : 'calc(100vh - 410px)'
                  : filterFold
                  ? 'calc(100vh - 345px)'
                  : 'calc(100vh - 393px)',
            }}
          />
        </div>
        <Drawer
          title="付款明细"
          width={700}
          onClose={() =>
            setDrawerData({
              visible: false,
              data: [],
            })
          }
          visible={drawerData.visible}
          className="budget-payment-drawer"
          maskClosable={true}
          zIndex={101}
          destroyOnClose={true}
          maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
        >
          <Table
            columns={drawerColumns}
            rowKey={'XMMC'}
            dataSource={drawerData.data}
            pagination={false}
            // bordered //记得注释
          />
        </Drawer>
      </div>
    </>
  );
});
export default IterationContractInfo;
