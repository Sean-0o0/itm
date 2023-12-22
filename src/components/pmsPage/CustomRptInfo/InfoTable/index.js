import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Modal, Pagination } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import { CopyCustomReport, QueryUserRole } from '../../../../services/pmsServices';

export default function InfoTable(props) {
  const {
    tableData = {},
    columns = [],
    handleExport = () => {},
    exportExcelFile,
    getSQL = () => {},
    data,
    routes,
    bbid,
    setIsSpinning,
    cjrid,
  } = props; //表格数据
  const location = useLocation();
  const [tableColumns, setTableColumns] = useState([]); //处理过的列配置信息
  let LOGIN_USERID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);

  useEffect(() => {
    if (columns.length > 0) {
      QueryUserRole({
        userId: LOGIN_USERID,
      })
        .then(res => {
          if (res.success) {
            const isLeader = res.role !== '普通人员';
            const isBudgetMnger = res.zyrole === '预算管理人'; //是否预算管理人
            let arr = [];
            arr = columns.map(x => {
              switch (x.dataIndex) {
                //金额类型
                case 'XMYSJE':
                case 'YSXMJE':
                case 'HTJE':
                case 'LVBZJ':
                case 'TBBZJ':
                case 'YFKFY':
                case 'WFKFY':
                  return {
                    title: x.title,
                    dataIndex: x.dataIndex,
                    key: x.dataIndex,
                    width: (x.title?.length || 4) * 22,
                    align: 'right',
                    ellipsis: true,
                    sorter: true,
                    sortDirections: ['descend', 'ascend'],
                    render: (txt, row) => (
                      <span style={{ marginRight: 30 }}>
                        {isLeader || LOGIN_USERID === Number(row.XMJLID) || isBudgetMnger
                          ? getAmountFormat(txt)
                          : '***'}
                      </span>
                    ),
                  };
                //日期类型
                case 'LXSJ':
                case 'QSRQ':
                case 'FKSJ':
                  return {
                    title: x.title,
                    dataIndex: x.dataIndex,
                    key: x.dataIndex,
                    width: (x.title?.length || 4) * 28,
                    align: 'left',
                    ellipsis: true,
                    render: txt =>
                      ['', null, undefined, ' '].includes(txt)
                        ? ''
                        : moment(txt).format('YYYY-MM-DD'),
                  };
                //跳转类型
                case 'XMMC':
                case 'GYSMC':
                  return {
                    title: x.title,
                    dataIndex: x.dataIndex,
                    key: x.dataIndex,
                    width: 170,
                    align: 'left',
                    ellipsis: true,
                    render: (txt, row) => {
                      let pathname = `/pms/manage/ProjectDetail/${EncryptBase64(
                        JSON.stringify({
                          xmid: row[x.jumpId],
                        }),
                      )}`;
                      if (x.dataIndex === 'GYSMC') {
                        pathname = `/pms/manage/SupplierDetail/${EncryptBase64(
                          JSON.stringify({
                            splId: row[x.jumpId],
                          }),
                        )}`;
                      }
                      return (
                        <Tooltip title={txt} placement="topLeft">
                          <Link
                            style={{ color: '#3361ff' }}
                            to={{
                              pathname,
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
                  };
                case 'XMJL':
                  return {
                    title: x.title,
                    dataIndex: x.dataIndex,
                    key: x.dataIndex,
                    width: 110,
                    align: 'left',
                    ellipsis: true,
                    render: (txt, row) => {
                      let pathname = `/pms/manage/staffDetail/${EncryptBase64(
                        JSON.stringify({
                          ryid: row[x.jumpId],
                        }),
                      )}`;
                      return (
                        <Link
                          style={{ color: '#3361ff' }}
                          to={{
                            pathname,
                            state: {
                              routes,
                            },
                          }}
                          className="table-link-strong"
                        >
                          {txt}
                        </Link>
                      );
                    },
                  };
                //特殊类型
                case 'XMBQ':
                  return {
                    title: x.title,
                    dataIndex: x.dataIndex,
                    key: x.dataIndex,
                    width: 260,
                    align: 'left',
                    ellipsis: true,
                    render: (txt, row) => {
                      return (
                        <div className="prj-tags">
                          {getTagData(txt, row[x.jumpId]).length > 0 && (
                            <>
                              {getTagData(txt, row[x.jumpId])
                                ?.slice(0, 2)
                                .map(x => (
                                  <div key={x.id} className="tag-item">
                                    <Link
                                      style={{ color: '#3361ff' }}
                                      to={{
                                        pathname: `/pms/manage/labelDetail/${EncryptBase64(
                                          JSON.stringify({
                                            bqid: x.id,
                                          }),
                                        )}`,
                                        state: {
                                          routes,
                                        },
                                      }}
                                      className="table-link-strong"
                                    >
                                      {x.name}
                                    </Link>
                                  </div>
                                ))}
                              {getTagData(txt, row[x.jumpId])?.length > 2 && (
                                <Popover
                                  overlayClassName="tag-more-popover"
                                  content={
                                    <div className="tag-more">
                                      {getTagData(txt, row[x.jumpId])
                                        ?.slice(2)
                                        .map(x => (
                                          <div key={x.id} className="tag-item">
                                            <Link
                                              style={{ color: '#3361ff' }}
                                              to={{
                                                pathname: `/pms/manage/labelDetail/${EncryptBase64(
                                                  JSON.stringify({
                                                    bqid: x.id,
                                                  }),
                                                )}`,
                                                state: {
                                                  routes,
                                                },
                                              }}
                                              className="table-link-strong"
                                            >
                                              {x.name}
                                            </Link>
                                          </div>
                                        ))}
                                    </div>
                                  }
                                  title={null}
                                >
                                  <div className="tag-item">
                                    {getTagData(txt, row[x.jumpId])?.length - 2}+
                                  </div>
                                </Popover>
                              )}
                            </>
                          )}
                        </div>
                      );
                    },
                  };
                default:
                  return {
                    title: x.title,
                    dataIndex: x.dataIndex,
                    key: x.dataIndex,
                    width: 150,
                    align: 'left',
                    ellipsis: true,
                    render: txt => (
                      <Tooltip title={txt} placement="topLeft">
                        <span style={{ cursor: 'default' }}>{txt}</span>
                      </Tooltip>
                    ),
                  };
              }
            });
            setTableColumns(arr);
            console.log("🚀 ~ file: index.js:246 ~ useEffect ~ arr:", arr)
          }
        })
        .catch(e => {});
      // console.log('🚀 ~ file: index.js:21 ~ useEffect ~ columns:', columns);
    }
    return () => {};
  }, [JSON.stringify(columns)]);

  //金额格式化
  const getAmountFormat = value => {
    if ([undefined, null, '', ' ', NaN].includes(value)) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  //获取项目标签数据
  const getTagData = (tag, idtxt) => {
    // console.log("🚀 ~ file: index.js:52 ~ getTagData ~ tag, idtxt:", tag, idtxt)
    let arr = [];
    let arr2 = [];
    if (
      tag !== '' &&
      tag !== null &&
      tag !== undefined &&
      idtxt !== '' &&
      idtxt !== null &&
      idtxt !== undefined
    ) {
      if (tag.includes(',')) {
        arr = tag.split(',');
        arr2 = idtxt.split(',');
      } else {
        arr.push(tag);
        arr2.push(idtxt);
      }
    }
    let arr3 = arr.map((x, i) => {
      return {
        name: x,
        id: arr2[i],
      };
    });
    // console.log('🚀 ~ file: index.js ~ line 73 ~ arr3 ~ arr3 ', arr3, arr, arr2);
    return arr3;
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        getSQL(
          {
            current: tableData.curPage,
            pageSize: tableData.curPageSize,
            sort: sorter.field + ' DESC',
          },
          data,
        );
      } else {
        getSQL(
          {
            current: tableData.curPage,
            pageSize: tableData.curPageSize,
            sort: sorter.field + ' ASC,XMID DESC',
          },
          data,
        );
      }
    } else {
      getSQL({ current: tableData.curPage, pageSize: tableData.curPageSize }, data);
    }
    return;
  };

  //复制自定义报表
  const handleCopy = () => {
    Modal.confirm({
      title: '提示：',
      content: `是否确定复制该报表？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setIsSpinning(true);
        CopyCustomReport({
          reportId: Number(bbid),
        })
          .then(res => {
            if (res?.success) {
              message.success('操作成功', 1);
              setIsSpinning(false);
            }
          })
          .catch(e => {
            console.error('🚀复制自定义报表', e);
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
      },
    });
  };

  return (
    <div className="info-table">
      <div className="btn-export-box">
        {LOGIN_USERID !== cjrid && (
          <Button
            type="primary"
            className="btn-export"
            style={{ marginRight: 8 }}
            onClick={handleCopy}
          >
            保存至我的
          </Button>
        )}
        <Button type="primary" className="btn-export" onClick={handleExport}>
          导出
        </Button>
      </div>
      <div
        className="project-info-table-box"
        style={tableData.data.length === 0 ? { border: 0 } : {}}
      >
        <Table
          columns={tableColumns}
          rowKey={row => row.XMID + String(bbid)}
          dataSource={tableData.data}
          onChange={handleTableChange}
          // pagination={{
          //   current: tableData.curPage,
          //   pageSize: tableData.curPageSize,
          //   defaultCurrent: 1,
          //   pageSizeOptions: ['20', '40', '50', '100'],
          //   showSizeChanger: true,
          //   hideOnSinglePage: false,
          //   showQuickJumper: true,
          //   showTotal: t => `共 ${tableData.total} 条数据`,
          //   total: tableData.total,
          // }}
          pagination={false}
          // bordered
        />
      </div>
      {tableData.data.length !== 0 && (
        <Pagination
          {...{
            current: tableData.curPage,
            pageSize: tableData.curPageSize,
            defaultCurrent: 1,
            pageSizeOptions: ['20', '40', '50', '100'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${tableData.total} 条数据`,
            total: tableData.total,
          }}
          onChange={(p, ps) => {
            getSQL({ current: p, pageSize: ps }, data);
          }}
          onShowSizeChange={(cur, size) => {
            getSQL({ current: cur, pageSize: size }, data);
          }}
        />
      )}
    </div>
  );
}
