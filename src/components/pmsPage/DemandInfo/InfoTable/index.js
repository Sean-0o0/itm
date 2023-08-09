import React, { Fragment, useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Popconfirm, Icon, Spin } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import DemandInitiated from '../../HardwareItems/DemandInitiated/index.js';
import {
  OperateOutsourceRequirements,
  QueryOutsourceRequirementList,
  QueryUserRole,
} from '../../../../services/pmsServices/index.js';
import moment from 'moment';
import DemandPublish from './DemandPublish';
import SendMailModal from '../../SendMailModal';

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
    expandedRowKeys,
    setExpandedRowKeys,
  } = props; //表格数据
  const [visible, setVisible] = useState({
    update: false,
    relaunch: false,
  }); //需求发起弹窗显隐
  const [demandPublishVisible, setDemandPublishVisible] = useState(false); //需求上架显隐
  const [currentXqid, setCurrentXqid] = useState(-1); //详情id
  const [currentXmid, setCurrentXmid] = useState(-1); //项目id
  const [currentXmmc, setCurrentXmmc] = useState(''); //项目名称
  const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [isDock, setIsDock] = useState(false); //是否为外包项目对接人 - 权限控制
  const [sendMailVisible, setSendMailVisible] = useState(false); //发送邮件

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
          console.log('外包项目对接人', res.zyrole === '外包项目对接人');
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
      width: '29%',
      key: 'XMMC',
      ellipsis: true,
      render: (text, row) => {
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
              className="table-link-strong new-demand-exsit-box"
            >
              {row.CZWSJXQ === '1' && <div className="new-demand-exsit">新</div>}
              <span>{text}</span>
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
      width: '27%',
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
      width: '13%',
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
      width: '12%',
    },
  ];

  const expandedRowRender = record => {
    //嵌套子表格，每个宽度都要设
    const columns = [
      {
        title: '需求名称',
        dataIndex: 'XQMC',
        width: '34%',
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
                      fqrid: row.FQRID,
                      routes: [{ name: '需求列表', pathname: location.pathname }],
                    }),
                  )}`,
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
        width: '10%',
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
        title: '预估金额(元)',
        dataIndex: 'XQYGJE',
        width: '14%',
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
        width: '13%',
        ellipsis: true,
        render: text => <span>{text === undefined ? '' : moment(text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '预计综合评测日期',
        dataIndex: 'YJZHPCRQ',
        width: '14%',
        key: 'YJZHPCRQ',
        ellipsis: true,
        render: text => <span>{text === undefined ? '' : moment(text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: '18%',
        render: (text, row, index) => {
          // 1|未上架;2|上架中;3|下架 SJZT
          return (
            <div className="opr-colomn">
              {row.SJZT === '1' && isDock && (
                <a
                  className="sj"
                  onClick={() => {
                    setDemandPublishVisible(true);
                    setCurrentXqid(Number(row.XQID));
                    setCurrentXmid(Number(row.XMID));
                  }}
                >
                  上架
                </a>
              )}
              {row.SJZT === '2' && isDock && (
                <Popconfirm
                  title="确定要下架吗?"
                  onConfirm={() => {
                    OperateOutsourceRequirements({
                      xqid: Number(row.XQID),
                      czlx: 'XJ',
                    })
                      .then(res => {
                        if (res?.success) {
                          message.success('下架成功', 1);
                          getSubTableData(Number(row.XMID)); //刷新
                        }
                      })
                      .catch(e => {
                        message.error('下架失败', 1);
                      });
                  }}
                >
                  <a className="xj">下架</a>
                </Popconfirm>
              )}
              {/* {row.SJZT === '3' && isDock && (
                <a
                  className="xj"
                  onClick={() => {
                      setSendMailVisible(true);
                      setCurrentXmid(Number(row.XMID));
                  }}
                >
                  发送邮件
                </a>
              )} */}
              {row.SJZT !== '3' && (LOGIN_USER_ID === Number(row.FQRID) || isDock) && (
                <a
                  style={{ color: '#3361ff' }}
                  onClick={() => {
                    setVisible(p => {
                      return {
                        ...p,
                        update: true,
                      };
                    });
                    setCurrentXqid(Number(row.XQID));
                    setCurrentXmid(Number(row.XMID));
                    setCurrentXmmc(tableData.filter(x => x.XMID === row.XMID)[0]?.XMMC);
                  }}
                >
                  修改
                </a>
              )}
              {LOGIN_USER_ID === Number(row.FQRID) && (
                <a
                  style={{ color: '#3361ff' }}
                  onClick={() => {
                    setVisible(p => {
                      return {
                        ...p,
                        relaunch: true,
                      };
                    });
                    setCurrentXqid(Number(row.XQID));
                    setCurrentXmid(Number(row.XMID));
                    setCurrentXmmc(tableData.filter(x => x.XMID === row.XMID)[0]?.XMMC);
                  }}
                >
                  重新发起
                </a>
              )}
            </div>
          );
        },
      },
    ];

    if (record.loading) return <Spin style={{ width: '100%' }} />;
    return (
      <Table
        className="sub-table-demand-info"
        columns={columns}
        rowKey="XQID"
        dataSource={subTableData[record.XMID]}
        pagination={false}
        bordered
      />
    );
  };

  const onExpand = async (expanded, record) => {
    // console.log(expanded, record);
    if (expanded) {
      // 正在加载的行设置 loading 状态
      record.loading = true;
      if (!expandedRowKeys.includes(record.XMID)) {
        setExpandedRowKeys(p => [...p, record.XMID]);
      }
      let res = await QueryOutsourceRequirementList({
        current: 1,
        cxlx: 'XQ',
        pageSize: 10,
        paging: -1,
        sort: '',
        total: -1,
        xmmc: Number(record.XMID),
      });
      const data = JSON.parse(res.xqxx);
      setSubTableData(p => {
        return {
          ...p,
          [record.XMID]: data,
        };
      });
      let arr = [...tableData];
      arr.forEach(x => {
        if (x.XMID === record.XMID) x.loading = false;
      });
      setTableData(arr);
    } else {
      //收起时置空
      setSubTableData(p => {
        return {
          ...p,
          [record.XMID]: [],
        };
      });
      setExpandedRowKeys(p => [...expandedRowKeys.filter(x => x !== record.XMID)]);
      record.loading = false;
    }
  };
  return (
    <div className="info-table">
      {sendMailVisible && (
        <SendMailModal
          closeModal={() => setSendMailVisible(false)}
          visible={sendMailVisible}
          successCallBack={() => {
            setSendMailVisible(false);
            getSubTableData(currentXmid);
          }}
        />
      )}
      {/* 上架 */}
      {demandPublishVisible && (
        <DemandPublish
          visible={demandPublishVisible}
          setVisible={setDemandPublishVisible}
          xqid={currentXqid}
          WBRYGW={WBRYGW}
          reflush={() => getSubTableData(currentXmid)}
        />
      )}
      {/* 修改 */}
      {visible.update && (
        <DemandInitiated
          xmmc={currentXmmc}
          xqid={currentXqid}
          closeModal={() =>
            setVisible(p => {
              return {
                ...p,
                update: false,
              };
            })
          }
          visible={visible}
          successCallBack={() => {
            setVisible(p => {
              return {
                ...p,
                update: false,
              };
            });
            getSubTableData(currentXmid);
          }}
        />
      )}
      {/* 重新发起 */}
      {visible.relaunch && (
        <DemandInitiated
          xmmc={currentXmmc}
          xmid={Number(currentXmid)}
          operateType="relaunch"
          xqid={Number(currentXqid)}
          closeModal={() =>
            setVisible(p => {
              return {
                ...p,
                relaunch: false,
              };
            })
          }
          visible={visible.relaunch}
          successCallBack={() => {
            setVisible(p => {
              return {
                ...p,
                relaunch: false,
              };
            });
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
