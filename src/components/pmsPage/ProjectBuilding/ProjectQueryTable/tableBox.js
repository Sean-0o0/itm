import React, { useEffect, useState, useRef, useContext } from 'react';
import { message, Button, Modal, Form, Row, Col, Tooltip, Select, Input, DatePicker, Table, Popover } from 'antd';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from "moment";
import * as Lodash from "lodash";



/**
 * 表格
 * @param {*} props 
 * @returns 
 */
const TableBox = (props) => {

  const { isTableLoading, tableData, curPageNum, setCurPageNum, pageSize, setPageSize, total } = props

  const location = useLocation();

  /** 获取项目标签数据 */
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
    return arr3
  }

  /** 获取标签类名 */
  const getTagClassName = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return 'yellow-tag';
    else if (tagTxt.includes('集合')) return 'purple-tag';
    else if (tagTxt.includes('专班')) return 'red-tag';
    else return '';
  };

  /** 获取标签颜色 */
  const getTagTxtColor = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return '#F1A740';
    else if (tagTxt.includes('集合')) return '#757CF7';
    else if (tagTxt.includes('专班')) return '#F0978C';
    else return '#3361ff';
  };

  /** 分页数据改变 */
  const paginationChangeHandle = (pagination, filters, sorter, extra) => {
    setCurPageNum(pagination.current)
    setPageSize(pagination.pageSize)
  }


  //列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'XMMC',
      width: '17%',
      key: 'XMMC',
      ellipsis: true,
      render: (text, record, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                  JSON.stringify({
                    xmid: record.XMID,
                  }),
                )}`,
                state: {
                  routes: [{ name: '项目建设情况', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {text}
            </Link>
          </Tooltip>
        )
      }
    },
    {
      title: '项目经理',
      dataIndex: 'XMJL',
      width: '10%',
      key: 'XMJL',
      ellipsis: true,
      render: (text, record, index) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: record.XMJLID,
                }),
              )}`,
              state: {
                routes: [{ name: '项目建设情况', pathname: location.pathname }],
              },
            }}
            className="table-link-strong"
          >
            {text}
          </Link>
        )
      }
    },
    {
      title: '完成事项',
      dataIndex: 'WCSX',
      width: '13%',
      key: 'WCSX',
      ellipsis: true,
      render: (text, record, index) => {
        return <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      }
    },
    {
      title: '完成时间',
      dataIndex: 'WCSJ',
      width: '10%',
      key: 'WCSJ',
      ellipsis: true,
      render: (text, record, index) => {
        return <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      }
    },
    {
      title: '当前里程碑',
      dataIndex: 'DQLCB',
      width: '10%',
      key: 'DQLCB',
      ellipsis: true,
      render: (text, record, index) => {
        return <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      }
    },
    {
      title: '项目标签',
      dataIndex: 'XMBQ',
      width: '18%',
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
                            routes: [{ name: '项目建设情况', pathname: location.pathname }],
                          },
                        }}
                      // className="table-link-strong"
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
                                    routes: [{ name: '项目建设情况', pathname: location.pathname }],
                                  },
                                }}
                              // className="table-link-strong"
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
  ]


  return (
    <Table
      loading={isTableLoading}
      columns={columns}
      rowKey={(record, index) => {
        // return record.id
        return index
      }}
      dataSource={tableData}
      onChange={paginationChangeHandle}
      // scroll={{
      //   x: false,
      //   y: '50vh'
      // }}
      pagination={{
        current: curPageNum,
        pageSize: pageSize,
        // pageSizeOptions: ['20', '40', '50', '100'],
        showSizeChanger: true,
        hideOnSinglePage: false,
        showQuickJumper: true,
        total: total,
        showTotal: (val) => `共 ${val} 条数据`,
      }}
    >
    </Table>
  )

}

export default TableBox
