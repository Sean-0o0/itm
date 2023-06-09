import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Popconfirm, Icon, Spin } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import DemandInitiated from '../../HardwareItems/DemandInitiated/index.js';
import {
  OperateOutsourceRequirements,
  QueryOutsourceCostList,
  QueryOutsourceRequirementList,
  QueryUserRole,
} from '../../../../services/pmsServices/index.js';
import moment from 'moment';
import ExpenseCalucationModal from './ExpenseCalucationModal';
import ExpenseExportModal from './ExpenseExportModal';

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
    WBRYGW,
    setTableData,
    quarterData,
    getTableData,
  } = props; //表格数据
  const [visible, setVisible] = useState({
    calculation: false, //费用计算
    payment: false, //付款
    export: false, //导出
  }); //弹窗显隐
  const [currentXqid, setCurrentXqid] = useState(-1); //详情id
  const [currentXmid, setCurrentXmid] = useState(-1); //项目id
  const [currentXmmc, setCurrentXmmc] = useState(''); //项目名称
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); //默认展开行
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [isDock, setIsDock] = useState(false); //是否为外包项目对接人 - 权限控制
  const [userRole, setUserRole] = useState('普通人员'); //

  const location = useLocation();

  useEffect(() => {
    getIsDock();
    return () => {};
  }, []);

  useEffect(() => {
    if (xmid !== -2) {
      setExpandedRowKeys([xmid]);
    }
    // console.log('🚀 ~ file: index.js:32 ~ useEffect ~ d:', xmid);
    return () => {};
  }, [xmid]);

  //是否为外包项目对接人 - 权限控制
  const getIsDock = () => {
    QueryUserRole({
      userId: Number(LOGIN_USER_ID),
    })
      .then(res => {
        if (res.code === 1) {
          setIsDock(res.zyrole === '外包项目对接人');
          setUserRole(res.role);
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
      });
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const { current = 1, pageSize = 20 } = pagination;
    // getTableData({ current, pageSize });
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        handleSearch(current, pageSize, sorter.field + ' ASC,XMID ASC');
      } else {
        handleSearch(current, pageSize, sorter.field + ' DESC,XMID DESC');
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
      width: '19%',
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
                  routes: [{ name: '费用列表', pathname: location.pathname }],
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
      width: '10%',
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
                routes: [{ name: '费用列表', pathname: location.pathname }],
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
      title: '供应商名称',
      dataIndex: 'GYSMC',
      width: '18%',
      key: 'GYSMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  JSON.stringify({
                    splId: row.GYSID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '费用列表', pathname: location.pathname }],
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
      title: '季度',
      dataIndex: 'JD',
      key: 'JD',
      width: '21%',
      ellipsis: true,
      render: (txt, row) =>
        `${txt}(${row.KSSJ === undefined ? '' : moment(row.KSSJ).format('YYYY.MM')}-${
          row.JSSJ === undefined ? '' : moment(row.JSSJ).format('YYYY.MM')
        })`,
    },
    {
      title: '总费用(元)',
      dataIndex: 'ZFY',
      width: '12%',
      align: 'right',
      key: 'ZFY',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
    },
    {
      title: '总工时(人天)',
      dataIndex: 'ZGS',
      width: '12%',
      align: 'right',
      key: 'ZGS',
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
      width: '8%',
      render: (txt, row) => (
        <span
          style={{ color: '#3361ff', cursor: 'pointer' }}
          onClick={() => {
            if (String(LOGIN_USER_ID) === row.XMJLID) {
            } else {
              message.info('只有项目经理可以操作', 1);
            }
          }}
        >
          付款
        </span>
      ),
    },
  ];

  const expandedRowRender = record => {
    //嵌套子表格，每个宽度都要设
    const columns = [
      {
        title: '人员名称',
        dataIndex: 'RYMC',
        width: '8%',
        key: 'RYMC',
        ellipsis: true,
        render: (text, row, index) => {
          if (row.RYID === undefined) return text;
          return (
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/staffDetail/${EncryptBase64(
                  JSON.stringify({
                    ryid: row.RYID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '费用列表', pathname: location.pathname }],
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
        title: '人员需求',
        dataIndex: 'RYDJ',
        width: '10%',
        key: 'RYDJ',
        ellipsis: true,
        render: (txt, row) => {
          return (
            <Tooltip title={txt} placement="topLeft">
              <span style={{ cursor: 'default' }}>{txt}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '工作量(人天)',
        dataIndex: 'GZLRT',
        width: '12%',
        align: 'right',
        key: 'GZLRT',
        ellipsis: true,
        sorter: (a, b) => Number(a.GZLRT ?? 0) - Number(b.GZLRT ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '工作量(人月)',
        dataIndex: 'GZLRY',
        width: '12%',
        align: 'right',
        key: 'GZLRY',
        ellipsis: true,
        sorter: (a, b) => Number(a.GZLRY ?? 0) - Number(b.GZLRY ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '人员单价(元)',
        dataIndex: 'RYDJY',
        width: '12%',
        align: 'right',
        key: 'RYDJY',
        ellipsis: true,
        sorter: (a, b) => Number(a.RYDJY ?? 0) - Number(b.RYDJY ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '考核结果',
        dataIndex: 'KHJG',
        width: '10%',
        key: 'KHJG',
        ellipsis: true,
      },
      {
        title: '小计费用(元)',
        dataIndex: 'RYDJY',
        width: '12%',
        align: 'right',
        key: 'RYDJY',
        ellipsis: true,
        sorter: (a, b) => Number(a.RYDJY ?? 0) - Number(b.RYDJY ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '下季度支付(元)',
        dataIndex: 'XJDZF',
        width: '12%',
        align: 'right',
        key: 'XJDZF',
        ellipsis: true,
        sorter: (a, b) => Number(a.XJDZF ?? 0) - Number(b.XJDZF ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '本季度支付(元)',
        dataIndex: 'BJDZF',
        width: '12%',
        align: 'right',
        key: 'BJDZF',
        ellipsis: true,
        sorter: (a, b) => Number(a.BJDZF ?? 0) - Number(b.BJDZF ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '上季度未付(元)',
        dataIndex: 'SJDWF',
        width: '12%',
        align: 'right',
        key: 'SJDWF',
        ellipsis: true,
        sorter: (a, b) => Number(a.SJDWF ?? 0) - Number(b.SJDWF ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
      {
        title: '本季度小计应付(元)',
        dataIndex: 'BJDXJYF',
        width: '12%',
        align: 'right',
        key: 'BJDXJYF',
        ellipsis: true,
        sorter: (a, b) => Number(a.BJDXJYF ?? 0) - Number(b.BJDXJYF ?? 0),
        sortDirections: ['descend', 'ascend'],
        render: text => <span style={{ marginRight: 20 }}>{getAmountFormat(text)}</span>,
      },
    ];

    if (record.loading) return <Spin style={{ width: '100%' }} />;
    return (
      <Table
        className="sub-table-demand-info"
        columns={columns}
        rowKey="XQID"
        dataSource={subTableData[record.FYID]}
        pagination={false}
        bordered
        scroll={{ x: 1600 }}
      />
    );
  };

  const onExpand = async (expanded, record) => {
    // console.log(expanded, record);
    if (expanded) {
      // 正在加载的行设置 loading 状态
      record.loading = true;
      if (!expandedRowKeys.includes(record.FYID)) {
        setExpandedRowKeys(p => [...p, record.FYID]);
      }
      let res = await QueryOutsourceCostList({
        current: 1,
        cxlx: 'XQ',
        pageSize: 10,
        paging: -1,
        sort: '',
        total: -1,
        xmid: Number(record.XMID),
        gysid: Number(record.GYSID),
        jssj: Number(202306),
        kssj: Number(record.KSSJ),
        js: isDock ? '外包项目对接人' : userRole,
      });
      const data = JSON.parse(res.fyxq);
      // console.log("🚀 ~ file: index.js:321 ~ onExpand ~ data:", data)
      setSubTableData(p => {
        return {
          ...p,
          [record.FYID]: data,
        };
      });
      let arr = [...tableData];
      arr.forEach(x => {
        if (x.FYID === record.FYID) x.loading = false;
      });
      setTableData(arr);
    } else {
      //收起时置空
      setSubTableData(p => {
        return {
          ...p,
          [record.FYID]: [],
        };
      });
      setExpandedRowKeys(p => [...expandedRowKeys.filter(x => x !== record.FYID)]);
      record.loading = false;
    }
  };

  const handleCalculate = () => {
    setVisible(p => ({ ...p, calculation: true }));
  };
  const handleExport = () => setVisible(p => ({ ...p, export: true }));

  return (
    <div className="info-table">
      {visible.calculation && (
        <ExpenseCalucationModal
          visible={visible.calculation}
          setVisible={v => setVisible(p => ({ ...p, calculation: v }))}
          quarterData={quarterData}
          reflush={getTableData}
        />
      )}
      {visible.export && (
        <ExpenseExportModal
          visible={visible.export}
          setVisible={v => setVisible(p => ({ ...p, export: v }))}
          quarterData={quarterData}
          reflush={getTableData}
        />
      )}
      <div className="btn-add-prj-box">
        <Button type="primary" className="btn-add-prj" onClick={handleCalculate}>
          费用计算
        </Button>
        <Button type="primary" className="btn-add-prj btn-export" onClick={handleExport}>
          费用导出
        </Button>
      </div>
      <div className="project-info-table-box">
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={'FYID'}
          dataSource={tableData}
          onChange={handleTableChange}
          expandedRowRender={expandedRowRender}
          expandedRowKeys={expandedRowKeys}
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
