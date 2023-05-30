import { Popover, Table, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import { QuerySupplierDetailInfo } from '../../../../services/pmsServices';
const { TabPane } = Tabs;

export default function TableTabs(props) {
  const { data = [], getData, total = 0, loading = false, role, routes = [] } = props;
  const [curPage, setCurPage] = useState(0); //当前页码
  const [curPageSize, setCurPageSize] = useState(20); //数据长度
  const [curTab, setCurTab] = useState('MX_ALL'); //当前tab
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const location = useLocation();

  useEffect(() => {
    setCurPage(1);
    setCurPageSize(10);
    return () => {};
  }, []);

  const handleTabsChange = key => {
    setCurPage(1);
    setCurPageSize(10);
    getData({ role, queryType: key });
    setCurTab(key);
  };

  //表格操作后更新数据
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { current = 1, pageSize = 10 } = pagination;
    setCurPage(current);
    setCurPageSize(pageSize);
    getData({ current, pageSize, role, queryType: curTab });
    return;
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

  //列配置
  const tableClm = [
    {
      title: '序号',
      dataIndex: 'XH',
      width: '5%',
      align: 'center',
      key: 'XH',
      render: (a, b, i) => i + 1,
    },
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      key: 'XMMC',
      ellipsis: true,
      className: 'supplier-situation-table-elipsis',
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
      title: '供应商',
      dataIndex: 'GYSMC',
      width: '20%',
      key: 'GYSMC',
      ellipsis: true,
      className: 'supplier-situation-table-elipsis',
      render: (txt, row, index) => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  JSON.stringify({
                    splId: row.GYSID,
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
      title: '立项时间',
      dataIndex: 'LXSJ',
      width: '9%',
      key: 'LXSJ',
      ellipsis: true,
      render: (txt, row) => (txt && moment(txt).format('YYYY-MM-DD')) || '--',
    },
    {
      title: '项目类型',
      dataIndex: 'XMLX',
      width: '13%',
      key: 'XMLX',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目进度',
      dataIndex: 'JD',
      key: 'JD',
      width: '7%',
      ellipsis: true,
      render: txt => txt + '%',
    },
    {
      title: '当前里程碑',
      dataIndex: 'DQLCB',
      key: 'DQLCB',
      width: '15%',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目标签',
      dataIndex: 'XMBQ',
      width: '16%',
      key: 'XMBQ',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <div className="prj-tags">
            {getTagData(text, row.XMBQID).length > 0 && (
              <>
                {getTagData(text, row.XMBQID)
                  ?.slice(0, 1)
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
                            routes: [{ name: '供应商情况', pathname: location.pathname }],
                          },
                        }}
                        className="prj-info-table-link-strong"
                      >
                        {x.name}
                      </Link>
                    </div>
                  ))}
                {getTagData(text, row.XMBQID)?.length > 1 && (
                  <Popover
                    overlayClassName="tag-more-popover"
                    content={
                      <div className="tag-more">
                        {getTagData(text, row.XMBQID)
                          ?.slice(1)
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
                                    routes: [{ name: '供应商情况', pathname: location.pathname }],
                                  },
                                }}
                                className="prj-info-table-link-strong"
                              >
                                {x.name}
                              </Link>
                            </div>
                          ))}
                      </div>
                    }
                    title={null}
                  >
                    <div className="tag-item" style={{ cursor: 'default' }}>
                      {getTagData(text, row.XMBQID)?.length - 1}+
                    </div>
                  </Popover>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  //表格配置
  const getTableContent = ({ columns = [], rowKey = 'ID', dataSourse = [], loading = false }) => {
    return (
      <div className="table-box">
        <Table
          columns={columns}
          rowKey={rowKey}
          dataSource={dataSourse}
          // size="middle"
          pagination={{
            current: curPage,
            pageSize: curPageSize,
            defaultCurrent: 1,
            pageSizeOptions: ['10', '20', '30', '40'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: () => `共 ${total} 条数据`,
            total: total,
          }}
          onChange={handleTableChange}
          loading={loading}
        />
      </div>
    );
  };
  return (
    <div className="table-tabs-box">
      <Tabs onChange={handleTabsChange} type="card">
        <TabPane tab={`全部项目`} key="MX_ALL">
          {getTableContent({
            columns: tableClm,
            rowKey: 'XMID',
            dataSourse: data,
            loading,
          })}
        </TabPane>
        <TabPane tab={`技术采购项目`} key="MX_JSCG">
          {getTableContent({
            columns: tableClm,
            rowKey: 'XMID',
            dataSourse: data,
            loading,
          })}
        </TabPane>
        <TabPane tab={`人力外包项目`} key="MX_RLWB">
          {getTableContent({
            columns: tableClm,
            rowKey: 'XMID',
            dataSourse: data,
            loading,
          })}
        </TabPane>
      </Tabs>
    </div>
  );
}
