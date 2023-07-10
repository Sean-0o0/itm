import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip, Modal, Tabs} from 'antd';
import {EncryptBase64} from '../../../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import moment from "moment";

const {TabPane} = Tabs;

export default function InfoTable(props) {
  const [sortedInfo, setSortedInfo] = useState({}); //金额排序
  const [src_fileAdd, setSrc_fileAdd] = useState({}); //项目信息修改弹窗显示
  const [visible, setVisible] = useState(false); //类型弹窗显隐
  const {
    tableData,
    tableLoading,
    getTableData,
    // projectManager = -1,
    queryType,
    setQueryType,
    total,
    handleSearch,
    curPage,
    curPageSize,
    setPrjMnger,
    setPrjName,
    routes,
  } = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)

  useEffect(() => {
    return () => {
    };
  }, [queryType, tableData]);

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
    console.log('handleTableChange', pagination, filters, sorter, extra);
    const {current = 1, pageSize = 20} = pagination;
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        handleSearch(current, pageSize, queryType);
      } else {
        handleSearch(current, pageSize, queryType);
      }
    } else {
      handleSearch(current, pageSize, queryType);
    }
    return;
  };

  //列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      // width: 200,
      width: '20%',
      key: 'XMMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{color: '#3361ff'}}
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
              {text}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      // width: 90,
      width: '8%',
      key: 'XMJL',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Link
            style={{color: '#3361ff'}}
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
            {text}
          </Link>
        );
      },
    },
    {
      title: '阶段完成时间',
      dataIndex: 'SJ',
      width: '12%',
      key: 'SJ',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{text ? moment(text, 'YYYY-MM-DD').format('YYYY-MM-DD') : '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目进度',
      dataIndex: 'XMJD',
      width: '12%',
      align: 'right',
      key: 'XMJD',
      ellipsis: true,
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: text => (
        <span style={{marginRight: 20}}>{text}%</span>
      ),
    },
    {
      title: '项目金额（元）',
      dataIndex: 'XMJE',
      width: '12%',
      key: 'XMJE',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目标签',
      dataIndex: 'XMBQ',
      // width: '18%',
      key: 'XMBQ',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <div className="prj-tags">
            {getTagData(text, row.XMBQID).length > 0 && (
              <>
                {getTagData(text, row.XMBQID)
                  ?.slice(0, 2)
                  .map(x => (
                    <div key={x.id} className="tag-item">
                      <Link
                        style={{color: '#3361ff'}}
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
                {getTagData(text, row.XMBQID)?.length > 2 && (
                  <Popover
                    overlayClassName="tag-more-popover"
                    content={
                      <div className="tag-more">
                        {getTagData(text, row.XMBQID)
                          ?.slice(2)
                          .map(x => (
                            <div key={x.id} className="tag-item">
                              <Link
                                style={{color: '#3361ff'}}
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
                      {getTagData(text, row.XMBQID)?.length - 2}+
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

  const handleTabsKeyChange = (activeKey) => {
    console.log("activeKey", activeKey)
    setQueryType(activeKey)
    setPrjName(undefined); //项目名称
    setPrjMnger(undefined); //项目经理
    getTableData(activeKey);
  }

  console.log("queryTypequeryType", queryType)
  console.log("tabledata", tableData)

  return (
    <div className="info-table">
      <Tabs type="card" activeKey={queryType} onChange={handleTabsKeyChange}>
        {/*ALL|查询全部；XWH|只查信委会过会；ZBH|只查总办会过会；XMLX|项目立项完成；HTQS|只查合同签署流程完成*/}
        <TabPane tab="信委会过会" key="XWH">
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              rowKey={'projectId'}
              dataSource={tableData}
              onChange={handleTableChange}
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
        </TabPane>
        <TabPane tab="总办会过会" key="ZBH">
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              rowKey={'projectId'}
              dataSource={tableData}
              onChange={handleTableChange}
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
        </TabPane>
        <TabPane tab="立项申请完成" key="XMLX">
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              rowKey={'projectId'}
              dataSource={tableData}
              onChange={handleTableChange}
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
        </TabPane>
        <TabPane tab="合同签署完成" key="HTQS">
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              rowKey={'projectId'}
              dataSource={tableData}
              onChange={handleTableChange}
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
        </TabPane>
        <TabPane tab="项目上线" key="SXXM">
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              rowKey={'projectId'}
              dataSource={tableData}
              onChange={handleTableChange}
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
        </TabPane>
        <TabPane tab="项目付款" key="FKXM">
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              rowKey={'projectId'}
              dataSource={tableData}
              onChange={handleTableChange}
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
        </TabPane>
        <TabPane tab="完结项目" key="WJXM">
          <div className="project-info-table-box">
            <Table
              loading={tableLoading}
              columns={columns}
              rowKey={'projectId'}
              dataSource={tableData}
              onChange={handleTableChange}
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
        </TabPane>
      </Tabs>
    </div>
  );
}
