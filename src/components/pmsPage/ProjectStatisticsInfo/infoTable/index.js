import React, {useEffect, useState} from 'react';
import {Button, Table, Popover, message, Tooltip, Modal, Tabs} from 'antd';
import InfoDetail from '../InfoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';
import {useLocation} from 'react-router';
import PrjTypeModal from '../../HomePage/ShortcutCard/PrjTypeModal';
import NewProjectModelV2 from '../../../../pages/workPlatForm/singlePage/NewProjectModelV2';
import EditProjectInfoModel from '../../EditProjectInfoModel';
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
    queryType = 'BM',
    total,
    handleSearch,
    curPage,
    curPageSize,
    prjMnger,
    tabsKeyCallBack,
    tabsKey,
    routes,
  } = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)

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
    console.log('handleTableChange', pagination, filters, sorter, extra);
    const {current = 1, pageSize = 20} = pagination;
    if (sorter.order !== undefined) {
      if (sorter.order === 'ascend') {
        handleSearch(current, pageSize, queryType, '', tabsKey);
      } else {
        handleSearch(current, pageSize, queryType, '', tabsKey);
      }
    } else {
      handleSearch(current, pageSize, queryType, '', tabsKey);
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
      title: '立项时间',
      dataIndex: 'LXSJ',
      width: '10%',
      key: 'LXSJ',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{text ? moment(text, 'YYYY-MM-DD').format('YYYY-MM-DD') : '-'}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目类型',
      dataIndex: 'XMLX',
      width: '12%',
      key: 'XMLX',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{cursor: 'default'}}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '项目进度',
      dataIndex: 'XMJD',
      width: '10%',
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
      title: '当前里程碑',
      dataIndex: 'DQLCB',
      width: '14%',
      key: 'DQLCB',
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
    tabsKeyCallBack(activeKey)
  }


  return (
    <div className="info-table">
      <Tabs activeKey={tabsKey} type="card" onChange={handleTabsKeyChange}>
        <TabPane tab="所有项目" key="0">
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
        <TabPane tab="专班项目" key="专班项目">
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
        <TabPane tab="课题项目" key="课题项目">
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
        <TabPane tab="获奖项目" key="获奖项目">
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
