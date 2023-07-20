import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Form,
  message,
  Popconfirm,
  Tooltip,
  DatePicker,
  Select,
  TreeSelect,
  Drawer,
} from 'antd';
import { QueryBudgetStatistics } from '../../../../services/pmsServices';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import ExportModal from './ExportModal';
import { FetchQueryBudgetProjects } from '../../../../services/projectManage';
const { Option } = Select;

const TableBox = props => {
  const { dataProps = {}, funcProps = {} } = props;
  const { tableData = {}, filterData = {}, allowExport } = dataProps;
  const {
    setFilterData = () => {},
    queryTableData = () => {},
    setIsSpinning = () => {},
  } = funcProps;
  const [drawerData, setDrawerData] = useState({
    data: [],
    visible: false,
    loading: false,
  }); //项目付款详情抽屉
  const [exportModalVisible, setExportModalVisible] = useState(false); //导出弹窗显隐
  const location = useLocation();

  //列配置
  const columns = [
    {
      title: '预算类别',
      dataIndex: 'YSLB',
      key: 'YSLB',
      width: '13%',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '预算项目',
      dataIndex: 'YSXM',
      key: 'YSXM',
      width: '18%',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'FZR',
      // width: 90,
      width: '7%',
      key: 'FZR',
      ellipsis: true,
      render: (txt, row) => {
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
                routes: [{ name: '预算统计', pathname: location.pathname }],
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
      title: '总预算',
      dataIndex: 'ZTZ',
      width: '8%',
      align: 'right',
      key: 'ZTZ',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '可执行预算',
      dataIndex: 'SHHBNZF',
      width: '13%',
      align: 'right',
      key: 'SHHBNZF',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '预算执行金额',
      dataIndex: 'YSZXJE',
      width: '12%',
      align: 'right',
      key: 'YSZXJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '预算执行率',
      dataIndex: 'YSZXL',
      width: '10%',
      align: 'right',
      key: 'YSZXL',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{txt}</span>,
    },
    {
      title: '合同金额',
      dataIndex: 'HTJE',
      width: '9%',
      align: 'right',
      key: 'HTJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '涉及项目数',
      dataIndex: 'SJXMS',
      width: '10%',
      align: 'center',
      key: 'SJXMS',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (txt, row) => (
        <a style={{ color: '#3361ff' }} onClick={() => openDrawer(Number(row.YSID))}>
          {txt}
        </a>
      ),
    },
  ];

  const openDrawer = budgetId => {
    setIsSpinning(true);
    QueryBudgetStatistics({
      budgetId,
      current: 1,
      pageSize: 9999,
      paging: -1,
      queryType: 'FKXQ',
      sort: '',
      total: -1,
      year: filterData.year?.year(),
    })
      .then(res => {
        if (res?.success) {
          setDrawerData({
            data: JSON.parse(res.payInfo),
            visible: true,
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀付款详情', e);
        message.error('付款详情信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  const handleReset = () => {
    setFilterData(p => ({
      ...p,
      year: moment(),
      yearOpen: false,
      budgetCategory: undefined,
      budgetPrj: undefined,
    }));
  };

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const { current = 1, pageSize = 20 } = pagination;
    // getTableData({ current, pageSize });
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        queryTableData({
          current,
          pageSize,
          sort: sorter.field + ' ASC,YSID ASC',
          budgetCategory:
            filterData.budgetCategory !== undefined ? Number(filterData.budgetCategory) : undefined,
          budgetId: filterData.budgetPrj !== undefined ? Number(filterData.budgetPrj) : undefined,
        });
      } else {
        queryTableData({
          current,
          pageSize,
          sort: sorter.field + ' DESC,YSID DESC',
          budgetCategory:
            filterData.budgetCategory !== undefined ? Number(filterData.budgetCategory) : undefined,
          budgetId: filterData.budgetPrj !== undefined ? Number(filterData.budgetPrj) : undefined,
        });
      }
    } else {
      queryTableData({
        current,
        pageSize,
        budgetCategory:
          filterData.budgetCategory !== undefined ? Number(filterData.budgetCategory) : undefined,
        budgetId: filterData.budgetPrj !== undefined ? Number(filterData.budgetPrj) : undefined,
      });
    }
    return;
  };

  const handleBudgetPrjChange = (v, txt, node) => {
    // console.log("🚀 ~ file: index.js:189 ~ handleBudgetPrjChange ~ v, txt, node:", v, txt, node)
    setFilterData(p => ({ ...p, budgetPrj: v }));
  };

  const drawerColumns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: 90,
      // width: '20%',
      key: 'XMMC',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目阶段',
      dataIndex: 'XMJD',
      // width: 90,
      width: '12%',
      key: 'XMJD',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '合同金额(元)',
      dataIndex: 'HTJE',
      width: '15%',
      align: 'right',
      key: 'HTJE',
      ellipsis: true,
      sorter: (a, b) => Number(a.HTJE) - Number(b.HTJE),
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '已付款金额(元)',
      dataIndex: 'YFKJE',
      width: '20%',
      align: 'right',
      key: 'YFKJE',
      ellipsis: true,
      sorter: (a, b) => Number(a.YFKJE) - Number(b.YFKJE),
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '未付款金额(元)',
      dataIndex: 'WFKJE',
      width: '20%',
      align: 'right',
      key: 'WFKJE',
      ellipsis: true,
      sorter: (a, b) => Number(a.WFKJE) - Number(b.WFKJE),
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '付款时间',
      dataIndex: 'FKSJ',
      // width: 90,
      width: '15%',
      key: 'FKSJ',
      ellipsis: true,
      render: txt =>
        ['', ' ', -1, '-1', undefined, null].includes(txt) ? moment(txt).format('YYYY-MM-DD') : '',
    },
  ];

  const handleYearChange = d => {
    setFilterData(p => ({ ...p, year: d, yearOpen: false }));
    setIsSpinning(true);
    FetchQueryBudgetProjects({
      type: 'NF',
      year: d.year(),
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryBudgetProjects ~ res', res);
          let ysxmArr = (
            res.record?.filter(x => x.ysLXID === (budgetType === 'ZB' ? '1' : '2')) || []
          ).reduce((acc, cur) => {
            const index = acc.findIndex(item => item.value === cur.zdbm && item.title === cur.ysLB);
            if (index === -1) {
              acc.push({
                title: cur.ysLB,
                value: cur.zdbm,
                children: [
                  {
                    ...cur,
                    title: cur.ysName,
                    value: cur.ysID,
                  },
                ],
              });
            } else {
              acc[index].children.push({
                ...cur,
                title: cur.ysName,
                value: cur.ysID,
              });
            }
            return acc;
          }, []);
          // console.log(ysxmArr);
          setFilterData(p => ({
            ...p,
            budgetPrj: undefined,
            budgetPrjSlt: ysxmArr,
          }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀预算项目信息', e);
        message.error('预算项目获取失败', 1);
        setIsSpinning(false);
      });
  };

  return (
    <>
      <div className="table-box">
        <div className="filter-row">
          <div className="console-item">
            <div className="item-label">年份</div>
            <DatePicker
              mode="year"
              className="item-selector"
              value={filterData.year}
              open={filterData.yearOpen}
              placeholder="请选择年份"
              format="YYYY"
              allowClear={false}
              onChange={v => setFilterData(p => ({ ...p, year: v }))}
              onOpenChange={v => setFilterData(p => ({ ...p, yearOpen: v }))}
              onPanelChange={handleYearChange}
            />
          </div>
          <div className="console-item">
            <div className="item-label">预算类别</div>
            <Select
              className="item-selector"
              dropdownClassName={'item-selector-dropdown'}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              onChange={v => setFilterData(p => ({ ...p, budgetCategory: v }))}
              value={filterData.budgetCategory}
              placeholder="请选择"
            >
              {filterData.budgetCategorySlt?.map((x, i) => (
                <Option key={i} value={Number(x.ibm)}>
                  {x.note}
                </Option>
              ))}
            </Select>
          </div>
          <div className="console-item">
            <div className="item-label">预算项目</div>
            <TreeSelect
              allowClear
              showArrow
              className="item-selector"
              showSearch
              treeNodeFilterProp="title"
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeData={filterData.budgetPrjSlt}
              placeholder="请选择"
              onChange={handleBudgetPrjChange}
              value={filterData.budgetPrj}
              treeDefaultExpandAll
            />
          </div>
          <Button
            className="btn-search"
            type="primary"
            onClick={() =>
              queryTableData({
                budgetCategory:
                  filterData.budgetCategory !== undefined
                    ? Number(filterData.budgetCategory)
                    : undefined,
                budgetId:
                  filterData.budgetPrj !== undefined ? Number(filterData.budgetPrj) : undefined,
              })
            }
          >
            查询
          </Button>
          <Button className="btn-reset" onClick={() => handleReset()}>
            重置
          </Button>
        </div>
        <div className="export-row">
          <span className="table-unit">单位：万元</span>
          {allowExport && (
            <Button type="primary" onClick={() => setExportModalVisible(true)}>
              导出
            </Button>
          )}
        </div>
        <div className="project-info-table-box">
          <Table
            columns={columns}
            rowKey={'YSID'}
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
          />
        </div>
        <Drawer
          title="项目付款详情"
          width={800}
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
            bordered //记得注释
          />
        </Drawer>
        <ExportModal
          visible={exportModalVisible}
          setVisible={setExportModalVisible}
          columns={columns}
        />
      </div>
    </>
  );
};
export default Form.create()(TableBox);
