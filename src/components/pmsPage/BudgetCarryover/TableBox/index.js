import React, { useState, useEffect, Fragment } from 'react';
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
  Icon,
  Input,
} from 'antd';
import {
  OperateCapitalBeginYearBudgetInfo,
  QueryBudgetStatistics,
  QueryCapitalBudgetCarryoverInfo,
} from '../../../../services/pmsServices';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import { EncryptBase64 } from '../../../Common/Encrypt';
import ExportModal from './ExportModal';
import { FetchQueryBudgetProjects } from '../../../../services/projectManage';
import { getNote } from '../../../../utils/pmsPublicUtils';
import CarryoverModal from './CarryoverModal';
import { useHistory } from 'react-router';
import SendBackModal from './SendBackModal';
const { Option } = Select;

const JZZT = [
  {
    ibm: 1,
    note: '新增',
  },
  {
    ibm: 2,
    note: '结转',
  },
];

const TBZT = [
  {
    ibm: 1,
    note: '负责人填写',
  },
  {
    ibm: 2,
    note: '统筹人审核',
  },
  {
    ibm: 3,
    note: '管理员审核',
  },
  {
    ibm: 4,
    note: '草稿',
  },
];



const TableBox = props => {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    tableData = {},
    filterData = {},
    activeKey,
    XMYSJZZT = [],
    YSFL = [],
    userRole = '',
    userBasicInfo = {},
    curSorter = '',
    defaultYear,
  } = dataProps;
  const {
    setFilterData = () => { },
    queryTableData = () => { },
    setSpinningData = () => { },
  } = funcProps;
  const [drawerData, setDrawerData] = useState({
    data: [],
    visible: false,
    spinning: false,
    curBudgetId: -1,
  }); //项目付款详情抽屉
  const [carryoverData, setCarryoverData] = useState({
    visible: false,
    type: 'JZ', //结转JZ，不结转BJZ，修改TJ
    data: {}, //行数据
  }); //弹窗显隐
  const [exportModalVisible, setExportModalVisible] = useState(false); //导出弹窗显隐
  const location = useLocation();
  const history = useHistory();
  const routes = [{ name: '预算结转', pathname: location.pathname }];
  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false
  const [sendBackData, setSendBackData] = useState({
    visible: false,
    data: {}, //行数据
    budgetId: -1, //最外头的预算ID
    tab: 'YSJZ',
  }); //退回弹窗


  const getSubmitType = (userRole = '', isFzr = false, type) => {
    //type ADD|新增；UPDATE|修改；DELETE|删除；SUBMIT|提交；BACK|退回
    //isSendBack 是否退回
    //负责人的新增和修改 传1，提交传2；统筹人审核的新增、修改传2，提交传3，退回传1；管理员的新增、修改传3，退回2
    let submitType = 1;
    if (userRole.includes('预算管理人')) {
      // if (['ADD', 'UPDATE'].includes(type)) {
      //   submitType = 3;
      // } else if (type === 'BACK') {
      //   submitType = 2;
      // }
      return 3;
    } else if (userRole.includes('预算统筹人')) {
      // if (['ADD', 'UPDATE'].includes(type)) {
      //   submitType = 2;
      // } else if (type === 'SUBMIT') {
      //   submitType = 3;
      // } else if (type === 'BACK') {
      //   submitType = 1;
      // }
      return 2;
    } else if (isFzr) {
      // if (['ADD', 'UPDATE'].includes(type)) {
      //   submitType = 1;
      // } else if (type === 'SUBMIT') {
      //   submitType = 2;
      // }
      return 1;
    }
    return submitType;
  };

  //列配置 - 资本性
  const columns = [
    {
      title: '年份',
      dataIndex: 'NF',
      key: 'NF',
      width: 80,
      // fixed: 'left',
      ellipsis: true,
    },
    {
      title: '预算类别',
      dataIndex: 'YSLB',
      key: 'YSLB',
      width: 150,
      ellipsis: true,
      // fixed: 'left',
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '预算项目名称',
      dataIndex: 'YSXMMC',
      key: 'YSXMMC',
      // width: 200,
      ellipsis: true,
      // fixed: 'left',
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'FZR',
      width: 80,
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
                routes: [{ name: '预算结转', pathname: location.pathname }],
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
      title: '填报状态',
      dataIndex: 'TBZT',
      width: 100,
      align: 'right',
      key: 'TBZT',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '总投资',
      dataIndex: 'ZTZ',
      width: 100,
      align: 'right',
      key: 'ZTZ',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '软件投资',
      dataIndex: 'RJTZ',
      width: 100,
      align: 'right',
      key: 'RJTZ',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '硬件投资总金额',
      dataIndex: 'YJTZ',
      width: 150,
      align: 'right',
      key: 'YJTZ',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => (
        <span style={{ marginRight: 20 }}>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>
      ),
    },
    {
      title: '结转项目详情',
      dataIndex: 'JZXMXQ',
      width: 120,
      align: 'center',
      key: 'JZXMXQ',
      ellipsis: true,
      render: (txt, row) => (
        <a
          style={{ color: '#3361ff', display: 'block' }}
          onClick={() =>
            openDrawer(Number(row.YSID), Number(userBasicInfo.id) === Number(row.FZRID))
          }
        >
          查看详情
        </a>
      ),
    },
    {
      title: '新增/结转项目',
      dataIndex: 'JZXZ',
      width: 120,
      align: 'right',
      key: 'JZXZ',
      ellipsis: true,
    },
    ...(
      // !userRole.includes('信息技术事业部领导') && !userRole.includes('一级领导')
      1 === 1
        ?
        [{
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: 150,
          fixed: 'right',
          render: (_, row) => (
            <div className="opr-column">
              {/**状态是负责人填写，负责人和登录用户相同，显示修改和提交*/}
              {Number(row.TBZTID) === 1 && Number(userBasicInfo.id) === Number(row.FZRID) && (
                <Fragment>
                  <span
                    onClick={() => {
                      history.push({
                        pathname: `/pms/manage/BudgetSubmit/${EncryptBase64(
                          JSON.stringify({
                            operateType: 'UPDATE',
                            submitType: getSubmitType(userRole, true, 'UPDATE'),
                            budgetId: Number(row.YSID),
                            routes: [{ name: '预算录入', pathname: location.pathname }],
                            refreshParams: {
                              ...filterData,
                              activeKey,
                              current: tableData.current,
                              pageSize: tableData.pageSize,
                              sort: curSorter,
                            },
                          }),
                        )}`,
                      });
                    }}
                  >
                    修改
                  </span>
                  {Number(row.CZR) !== 0 && (
                    <Popconfirm
                      title="是否确定提交？"
                      onConfirm={() =>
                        handleSubmit({
                          operateType: 'SUBMIT',
                          submitType: getSubmitType(userRole, true, 'SUBMIT'),
                          budgetId: Number(row.YSID),
                        })
                      }
                    >
                      <span>提交</span>
                    </Popconfirm>
                  )}
                </Fragment>
              )}
              {/**状态为统筹人审批，登录用户是统筹人，该预算的统筹人是当前登录用户的，显示详情、退回和提交*/}
              {Number(row.TBZTID) === 2 &&
                userRole.includes('预算统筹人') &&
                Number(userBasicInfo.id) === Number(row.YSTCR) && (
                  <Fragment>
                    <span
                      onClick={() => {
                        history.push({
                          pathname: `/pms/manage/BudgetSubmit/${EncryptBase64(
                            JSON.stringify({
                              operateType: 'XQ',
                              budgetId: Number(row.YSID),
                              routes: [{ name: '预算录入', pathname: location.pathname }],
                              refreshParams: {
                                ...filterData,
                                activeKey,
                                current: tableData.current,
                                pageSize: tableData.pageSize,
                                sort: curSorter,
                              },
                              sendBackParams: {
                                operateType: 'BACK',
                                submitType: getSubmitType(userRole, true, 'BACK'),
                                budgetId: Number(row.YSID),
                              },
                            }),
                          )}`,
                        });
                      }}
                    >
                      详情
                    </span>
                    <span
                      onClick={() =>
                        setSendBackData({
                          visible: true,
                          fromBudget: true, //外边表格的退回，false时是抽屉里的退回
                          data: {
                            operateType: 'BACK',
                            submitType: getSubmitType(userRole, true, 'BACK'),
                            budgetId: Number(row.YSID),
                            budgetName: row.YSXMMC,
                          },
                        })
                      }
                    >
                      退回
                    </span>
                    {Number(row.CZR) !== 0 && (
                      <Popconfirm
                        title="是否确定提交？"
                        onConfirm={() =>
                          handleSubmit({
                            operateType: 'SUBMIT',
                            submitType: getSubmitType(userRole, true, 'SUBMIT'),
                            budgetId: Number(row.YSID),
                          })
                        }
                      >
                        <span>提交</span>
                      </Popconfirm>
                    )}
                  </Fragment>
                )}
              {/**状态为管理员审批，登录用户是管理员，显示详情、退回和删除 */}
              {Number(row.TBZTID) === 3 && userRole.includes('预算管理人') && (
                <Fragment>
                  <span
                    onClick={() => {
                      history.push({
                        pathname: `/pms/manage/BudgetSubmit/${EncryptBase64(
                          JSON.stringify({
                            operateType: 'XQ',
                            budgetId: Number(row.YSID),
                            routes: [{ name: '预算录入', pathname: location.pathname }],
                            refreshParams: {
                              ...filterData,
                              activeKey,
                              current: tableData.current,
                              pageSize: tableData.pageSize,
                              sort: curSorter,
                            },
                            sendBackParams: {
                              operateType: 'BACK',
                              submitType: getSubmitType(userRole, true, 'BACK'),
                              budgetId: Number(row.YSID),
                            },
                          }),
                        )}`,
                      });
                    }}
                  >
                    详情
                  </span>
                  <span
                    onClick={() =>
                      setSendBackData({
                        visible: true,
                        fromBudget: true, //外边表格的退回，false时是抽屉里的退回
                        data: {
                          operateType: 'BACK',
                          submitType: getSubmitType(userRole, true, 'BACK'),
                          budgetId: Number(row.YSID),
                          budgetName: row.YSXMMC,
                        },
                      })
                    }
                  >
                    退回
                  </span>
                  <Popconfirm
                    title="是否确定删除？"
                    onConfirm={() =>
                      handleSubmit(
                        {
                          operateType: 'DELETE',
                          budgetId: Number(row.YSID),
                        },
                        '删除',
                      )
                    }
                  >
                    <span>删除</span>
                  </Popconfirm>
                </Fragment>
              )}
              {/**状态为草稿，登录用户是负责人，显示修改和删除 */}
              {Number(row.TBZTID) === 4 && Number(userBasicInfo.id) === Number(row.FZRID) && (
                <Fragment>
                  <span
                    onClick={() => {
                      history.push({
                        pathname: `/pms/manage/BudgetSubmit/${EncryptBase64(
                          JSON.stringify({
                            operateType: 'UPDATE',
                            submitType: getSubmitType(userRole, true, 'UPDATE'),
                            routes: [{ name: '预算录入', pathname: location.pathname }],
                            budgetId: Number(row.YSID),
                            refreshParams: {
                              ...filterData,
                              activeKey,
                              current: tableData.current,
                              pageSize: tableData.pageSize,
                              sort: curSorter,
                            },
                          }),
                        )}`,
                      });
                    }}
                  >
                    修改
                  </span>
                  <Popconfirm
                    title="是否确定删除？"
                    onConfirm={() =>
                      handleSubmit(
                        {
                          operateType: 'DELETE',
                          budgetId: Number(row.YSID),
                        },
                        '删除',
                      )
                    }
                  >
                    <span>删除</span>
                  </Popconfirm>
                </Fragment>
              )}
            </div>
          ),
        }]
        : []
    )
  ];

  //列配置 - 预算结转 
  const columns_YSJZ = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: 200,
      // fixed: true,
      key: 'XMMC',
      // ellipsis: true,
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
                  routes,
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
      title: '预算项目',
      dataIndex: 'YSXM',
      key: 'YSXM',
      width: 200,
      // fixed: true,
      // ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      width: 80,
      key: 'XMJL',
      ellipsis: true,
      render: (txt, row) => (
        <Link
          style={{ color: '#3361ff' }}
          to={{
            pathname: `/pms/manage/staffDetail/${EncryptBase64(
              JSON.stringify({
                ryid: row.XMJLID,
              }),
            )}`,
            state: {
              routes,
            },
          }}
          className="table-link-strong"
        >
          {txt}
        </Link>
      ),
    },
    {
      title: '合同金额',
      dataIndex: 'HTJE',
      width: 110,
      align: 'right',
      key: 'HTJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '已付款金额',
      dataIndex: 'FKJE',
      width: 120,
      align: 'right',
      key: 'FKJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => <span style={{ marginRight: 20 }}>{getAmountFormat(txt)}</span>,
    },
    {
      title: '未付款金额',
      dataIndex: 'WFKJE',
      width: 120,
      align: 'right',
      key: 'WFKJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => (
        <span style={{ marginRight: 20 }}>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>
      ),
    },
    {
      title: '结转金(万元)',
      dataIndex: 'JZJE',
      width: 120,
      align: 'right',
      key: 'JZJE',
      ellipsis: true,
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: txt => (
        <span style={{ marginRight: 20 }}>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>
      ),
    },
    {
      title: '结转说明',
      dataIndex: 'JZSM',
      width: 150,
      key: 'JZSM',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft" overlayClassName="pre-wrap-tooltip">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '结转状态',
      dataIndex: 'JZZT',
      width: 100,
      key: 'JZZT',
      ellipsis: true,
      render: txt => getNote(XMYSJZZT, txt),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, row) => (
        <div className="opr-column">
          {Number(userBasicInfo.id) === Number(row.XMJLID) && String(row.JZZT) === '1' ? (
            //未结转
            <Fragment>
              <span onClick={() => setCarryoverData({ visible: true, type: 'JZ', data: row })}>
                结转
              </span>
              <span onClick={() => setCarryoverData({ visible: true, type: 'BJZ', data: row })}>
                不结转
              </span>
            </Fragment>
          ) : Number(userBasicInfo.id) === Number(row.XMJLID) && String(row.JZZT) === '3' ? (
            //被退回
            <span onClick={() => setCarryoverData({ visible: true, type: 'TJ', data: row })}>
              重新结转
            </span>
          ) : (
            ''
          )}
        </div>
      ),
    },
  ];

  //提交、退回、删除
  const handleSubmit = (params, txt = '提交') => {
    // console.log('🚀 ~ file: index.js:457 ~ handleSubmit ~ params:', params, txt);
    OperateCapitalBeginYearBudgetInfo({ ...params, fileInfo: '[]' })
      .then(res => {
        if (res.success) {
          message.success(txt + '成功', 1);
          queryTableData({
            ...filterData,
            activeKey,
            sort: curSorter,
            current: tableData.current,
            pageSize: tableData.pageSize,
          });
        }
      })
      .catch(e => {
        console.error(txt + '失败', e);
        message.error(txt + '失败', 1);
        setIsSpinning(false);
      });
  };

  const openDrawer = (budgetId = -1, isFZR = false) => {
    setSpinningData(p => ({
      tip: '结转项目详情信息加载中',
      spinning: true,
    }));
    QueryCapitalBudgetCarryoverInfo({
      queryType: 'JZXQ',
      budgetId,
      current: 1,
      pageSize: 9999,
      paging: -1,
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          setDrawerData({
            data: JSON.parse(res.result),
            visible: true,
            curBudgetId: budgetId,
            isFZR, //结转项目详情里面的操作列，只有这个预算的负责人能看，其他人隐藏
          });
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀付款详情', e);
        message.error('付款详情信息获取失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  const handleReset = () => {
    setFilterData({ year: defaultYear });
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
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        queryTableData({
          current,
          pageSize,
          sort: sorter.field + ' ASC',
          ...filterData,
          activeKey,
        });
      } else {
        queryTableData({
          current,
          pageSize,
          sort: sorter.field + ' DESC',
          ...filterData,
          activeKey,
        });
      }
    } else {
      queryTableData({
        current,
        pageSize,
        ...filterData,
        activeKey,
        sort: '',
      });
    }
    return;
  };

  const drawerColumns = [
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
                  routes: [{ name: '预算结转', pathname: location.pathname }],
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
      title: '结转金额(万元)',
      dataIndex: 'JZJE',
      width: '20%',
      align: 'right',
      key: 'JZJE',
      ellipsis: true,
      sorter: (a, b) => Number(a.JZJE || 0) - Number(b.JZJE || 0),
      sortDirections: ['descend', 'ascend'],
      render: txt => (
        <span style={{ marginRight: 20 }}>{txt === '-1' ? '***' : getAmountFormat(txt)}</span>
      ),
    },
    {
      title: '结转说明',
      dataIndex: 'JZSM',
      width: '30%',
      key: 'JZSM',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '结转状态',
      dataIndex: 'JZZT',
      width: '15%',
      key: 'JZZT',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: drawerData.isFZR ? '操作' : '',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: drawerData.isFZR ? '12%' : 0,
      render: (_, row) =>
        drawerData.isFZR ? (
          <div className="opr-column">
            {Number(row.JZZTID) === 2 && (
              <span
                onClick={() =>
                  setSendBackData({
                    visible: true,
                    data: row,
                    budgetId: drawerData.curBudgetId,
                    fromBudget: false, //false时是抽屉里的退回
                  })
                }
              >
                退回
              </span>
            )}
          </div>
        ) : (
          ''
        ),
    },
  ];

  return (
    <>
      <div className="table-box">
        <CarryoverModal
          visible={carryoverData.visible}
          setVisible={v => setCarryoverData(p => ({ ...p, visible: v }))}
          type={carryoverData.type}
          data={carryoverData.data}
          refresh={() =>
            queryTableData({
              ...filterData,
              activeKey,
            })
          }
        />
        <SendBackModal
          visible={sendBackData.visible}
          setVisible={v => setSendBackData(p => ({ ...p, visible: v }))}
          data={sendBackData.data}
          budgetId={sendBackData.budgetId}
          fromBudget={sendBackData.fromBudget} //true时是外边表格的退回，false时是抽屉里的退回
          refresh={() => {
            //抽屉里的退回
            sendBackData.fromBudget === false && openDrawer(sendBackData.budgetId);
            queryTableData({
              ...filterData,
              activeKey,
              sort: curSorter,
              current: tableData.current,
              pageSize: tableData.pageSize,
            });
          }}
        />
        {activeKey === 'YSJZ' ? (
          <Fragment>
            <div className="item-box">
              <div className="console-item" key="关联预算项目">
                <div className="item-label">关联预算项目</div>
                <Input
                  value={filterData.budgetProject}
                  className="item-selector"
                  onChange={v => {
                    v.persist();
                    if (v.target.value === '') {
                      setFilterData(p => ({ ...p, budgetProject: undefined }));
                    } else {
                      setFilterData(p => ({ ...p, budgetProject: v.target.value }));
                    }
                  }}
                  placeholder={'请输入关联预算项目'}
                  allowClear={true}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="console-item" key="项目名称">
                <div className="item-label">项目名称</div>
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
                  placeholder={'请输入项目名称'}
                  allowClear={true}
                  style={{ width: '100%' }}
                />
              </div>
              <Button
                className="btn-search"
                type="primary"
                onClick={() =>
                  queryTableData({
                    ...filterData,
                    activeKey,
                  })
                }
              >
                查询
              </Button>
              <Button className="btn-reset" onClick={() => handleReset()}>
                重置
              </Button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="item-box">
              <div className="console-item" key="年份">
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
                  onPanelChange={d => setFilterData(p => ({ ...p, year: d, yearOpen: false }))}
                />
              </div>
              <div className="console-item" key="预算类别">
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
                  {YSFL.map((x, i) => (
                    <Option key={i} value={Number(x.ibm)}>
                      {x.note}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="console-item" key="预算项目名称">
                <div className="item-label">预算项目名称</div>
                <Input
                  value={filterData.budgetName}
                  className="item-selector"
                  onChange={v => {
                    v.persist();
                    if (v.target.value === '') {
                      setFilterData(p => ({ ...p, budgetName: undefined }));
                    } else {
                      setFilterData(p => ({ ...p, budgetName: v.target.value }));
                    }
                  }}
                  placeholder={'请输入关联预算项目'}
                  allowClear={true}
                  style={{ width: '100%' }}
                />
              </div>
              {filterFold && activeKey !== 'YSJZ' && (
                <div className="filter-unfold" onClick={() => setFilterFold(false)}>
                  更多
                  <i className="iconfont icon-down" />
                </div>
              )}
              <Button
                className="btn-search"
                type="primary"
                onClick={() =>
                  queryTableData({
                    ...filterData,
                    activeKey,
                  })
                }
              >
                查询
              </Button>
              <Button className="btn-reset" onClick={handleReset}>
                重置
              </Button>
            </div>
            {!filterFold && (
              <div className="item-box">
                <div className="console-item" key="负责人">
                  <div className="item-label">负责人</div>
                  <Input
                    value={filterData.headName}
                    className="item-selector"
                    onChange={v => {
                      v.persist();
                      if (v.target.value === '') {
                        setFilterData(p => ({ ...p, headName: undefined }));
                      } else {
                        setFilterData(p => ({ ...p, headName: v.target.value }));
                      }
                    }}
                    placeholder={'请输入负责人'}
                    allowClear={true}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="console-item" key="填报状态">
                  <div className="item-label">填报状态</div>
                  <Select
                    className="item-selector"
                    dropdownClassName={'item-selector-dropdown'}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    allowClear
                    onChange={v => setFilterData(p => ({ ...p, state: v }))}
                    value={filterData.state}
                    placeholder="请选择"
                  >
                    {TBZT.map((x, i) => (
                      <Option key={i} value={Number(x.ibm)}>
                        {x.note}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="console-item" key="新增/结转">
                  <div className="item-label">新增/结转</div>
                  <Select
                    className="item-selector"
                    dropdownClassName={'item-selector-dropdown'}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    showSearch
                    allowClear
                    onChange={v => setFilterData(p => ({ ...p, newOrCarryover: v }))}
                    value={filterData.newOrCarryover}
                    placeholder="请选择"
                  >
                    {JZZT.map((x, i) => (
                      <Option key={i} value={Number(x.ibm)}>
                        {x.note}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="filter-unfold" onClick={() => setFilterFold(true)}>
                  收起
                  <i className="iconfont icon-up" />
                </div>
              </div>
            )}
          </Fragment>
        )}

        <div className="export-row">
          {activeKey === 'ZB' && (
            <Button
              type="primary"
              onClick={() =>
                history.push({
                  pathname: `/pms/manage/BudgetSubmit/${EncryptBase64(
                    JSON.stringify({
                      operateType: 'ADD',
                      submitType: 1,
                      budgetId: -1,
                      defaultYear: defaultYear?.format('YYYY'),
                      routes: [{ name: '预算录入', pathname: location.pathname }],
                    }),
                  )}`,
                })
              }
            >
              填报预算
            </Button>
          )}
          <span></span>
          <span className="table-unit">单位：{activeKey === 'YSJZ' ? '元' : '万元'}</span>
        </div>
        <div
          className="project-info-table-box"
          style={
            filterFold
              ? {
                height: activeKey === 'ZB' ? 'calc(100% - 113px)' : 'calc(100% - 92px)',
                marginBottom: 0,
              }
              : { height: 'calc(100% - 164px)', marginBottom: 0 }
          }
        >
          <Table
            columns={activeKey === 'YSJZ' ? columns_YSJZ : columns}
            rowKey={(row, index) =>
              row[activeKey === 'YSJZ' ? 'ID' : 'YSID'] + '-' + index + '-' + activeKey
            }
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
            scroll={{
              x: activeKey === 'YSJZ' ? 1320 : 1350,
              y: filterFold
                ? activeKey === 'ZB'
                  ? 'calc(100vh - 367px)'
                  : 'calc(100vh - 350px)'
                : 'calc(100vh - 432px)',
            }}
            bordered //记得注释
          />
        </div>
        <Drawer
          title="结转项目详情"
          width={950}
          onClose={() =>
            setDrawerData({
              visible: false,
              data: [],
              curBudgetId: -1,
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
