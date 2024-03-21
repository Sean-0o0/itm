import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message, Tooltip, Modal, Tabs } from 'antd';
import { EncryptBase64 } from '../../../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';

const { TabPane } = Tabs;

export default function InfoTable(props) {
  const {
    tableData,
    tableLoading,
    handleSearch,
    routes,
    tabsData = {},
    curStage,
    setCurStage,
    filterData = {},
    setFilterData,
    sortInfo = { sort: undefined, columnKey: '' },
    setSortInfo,
  } = props; //表格数据
  const location = useLocation();

  //获取项目标签数据
  const getTagData = (tag, idtxt) => {
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
    return arr3;
  };

  //表格操作后更新数据
  const handleTableChange = (pagination = {}, _, sorter = {}) => {
    const { current = 1, pageSize = 20 } = pagination;
    setSortInfo(sorter);
    if (sorter.order !== undefined) {
      handleSearch({
        current,
        pageSize,
        sort: sorter.field + (sorter.order === 'ascend' ? ' ASC' : ' DESC'),
        ...filterData,
      });
    } else {
      handleSearch({
        current,
        pageSize,
        ...filterData,
      });
    }
    return;
  };

  const getTagClassName = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return 'yellow-tag';
    else if (tagTxt.includes('集合')) return 'purple-tag';
    else if (tagTxt.includes('专班')) return 'red-tag';
    else return '';
  };
  const getTagTxtColor = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return '#F1A740';
    else if (tagTxt.includes('集合')) return '#757CF7';
    else if (tagTxt.includes('专班')) return '#F0978C';
    else return '#3361ff';
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
            {text}
          </Link>
        );
      },
    },
    {
      title: '阶段完成时间',
      dataIndex: 'ZXSJ',
      width: '15%',
      key: 'ZXSJ',
      ellipsis: true,
      render: text => text ?? '-',
    },
    {
      title: '项目进度',
      dataIndex: 'XMJD',
      width: '10%',
      align: 'right',
      key: 'XMJD',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'XMJD' ? sortInfo.order : undefined,
      render: text => <span style={{ marginRight: 20 }}>{text}%</span>,
    },
    {
      title: '项目金额（元）',
      dataIndex: 'XMJE',
      width: '12%',
      key: 'XMJE',
      ellipsis: true,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'XMJE' ? sortInfo.order : undefined,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
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
                    <div key={x.id} className={'tag-item ' + getTagClassName(x.name)}>
                      <Link
                        style={{ color: getTagTxtColor(x.name) }}
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
                            <div key={x.id} className={'tag-item ' + getTagClassName(x.name)}>
                              <Link
                                style={{ color: getTagTxtColor(x.name) }}
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
                              >
                                {x.name}
                              </Link>
                            </div>
                          ))}
                      </div>
                    }
                    title={null}
                  >
                    <div className="tag-item">{getTagData(text, row.XMBQID)?.length - 2}+</div>
                  </Popover>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  const handleTabsKeyChange = activeKey => {
    setCurStage(activeKey);
    setFilterData({});
    handleSearch({ stage: activeKey });
    setSortInfo({
      sort: undefined,
      columnKey: '',
    });
  };

  return (
    <div className="info-table">
      <Tabs type="card" activeKey={curStage} onChange={handleTabsKeyChange}>
        {tabsData.map(x => (
          <TabPane tab={x.note} key={x.ibm}>
            <div className="project-info-table-box">
              <Table
                loading={tableLoading}
                columns={columns}
                rowKey={'ID'}
                dataSource={tableData.data || []}
                onChange={handleTableChange}
                pagination={{
                  current: tableData.current,
                  pageSize: tableData.pageSize,
                  pageSizeOptions: ['20', '40', '50', '100'],
                  showSizeChanger: true,
                  hideOnSinglePage: false,
                  showQuickJumper: true,
                  showTotal: t => `共 ${tableData.total} 条数据`,
                  total: tableData.total,
                }}
                // bordered
              />
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
