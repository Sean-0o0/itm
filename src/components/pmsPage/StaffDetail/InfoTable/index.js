import React, { Component } from 'react';
import { Table, message, Popover, Pagination, Tooltip } from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';

class InfoTable extends Component {
  state = {};

  //获取标签数据
  getTagData = tag => {
    let arr = [];
    if (tag !== '' && tag !== null && tag !== undefined) {
      if (tag.includes(',')) {
        arr = tag.split(',');
      } else {
        arr.push(tag);
      }
    }
    return arr;
  };

  handleChange = (current, pageSize) => {
    const { handleSearch, ryid } = this.props;
    if (handleSearch) {
      handleSearch(
        {
          current: current,
          pageSize: pageSize,
          total: -1,
        },
        ryid,
      );
    }
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { handleSearch, ryid } = this.props;
    const { order = '', field = '' } = sorter;
    if (handleSearch) {
      handleSearch(
        {
          total: -1,
          sort: order ? `${field} ${order.slice(0, -3)}` : '',
        },
        ryid,
      );
    }
  };

  render() {
    const { tableLoading = false, tableData = [], pageParams = {}, routes = [] } = this.props;

    const columns = [
      {
        title: '年份',
        dataIndex: 'xmnf',
        width: '5%',
        key: 'xmnf',
        ellipsis: true,
        sorter: (a, b) => Number(a.xmnf) - Number(b.xmnf),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '项目名称',
        dataIndex: 'xmmc',
        width: '20%',
        key: 'xmmc',
        ellipsis: true,
        render: (text, row, index) => {
          const { xmid = '' } = row;
          return (
            <div>
              <Tooltip title={text} placement="topLeft">
                <Link
                  className="opr-btn"
                  to={{
                    pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                      JSON.stringify({
                        xmid: xmid,
                      }),
                    )}`,
                    state: {
                      routes: routes,
                    },
                  }}
                >
                  {text}
                </Link>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: '项目标签',
        dataIndex: 'xmbq',
        // width: 195,
        key: 'xmbq',
        ellipsis: true,
        render: (text, row, index) => {
          const { xmbqid = '' } = row;
          const ids = this.getTagData(xmbqid);
          const data = this.getTagData(text);
          return (
            <div className="prj-tags">
              {data.length !== 0 && (
                <>
                  {data?.slice(0, 3).map((x, i) => (
                    <div key={i} className="tag-item" title={x}>
                      <Link
                        to={{
                          pathname:
                            '/pms/manage/labelDetail/' +
                            EncryptBase64(
                              JSON.stringify({
                                bqid: ids[i],
                              }),
                            ),
                          state: {
                            routes: routes,
                          },
                        }}
                      >
                        {x}
                      </Link>
                    </div>
                  ))}
                  {data?.length > 3 && (
                    <Popover
                      overlayClassName="tag-more-popover"
                      content={
                        <div className="tag-more">
                          {data?.slice(3).map((x, i) => (
                            <div className="tag-item" key={i} title={x}>
                              <Link
                                to={{
                                  pathname:
                                    '/pms/manage/labelDetail/' +
                                    EncryptBase64(
                                      JSON.stringify({
                                        bqid: ids[i],
                                      }),
                                    ),
                                  state: {
                                    routes: routes,
                                  },
                                }}
                              >
                                {x}
                              </Link>
                            </div>
                          ))}
                        </div>
                      }
                      title={null}
                    >
                      <div className="tag-item">{data.length - 3}+</div>
                    </Popover>
                  )}
                </>
              )}
            </div>
          );
        },
      },
      {
        title: '项目进度',
        dataIndex: 'xmjd',
        width: '8%',
        key: 'xmjd',
        ellipsis: true,
        sorter: (a, b) => Number(a.xmjd) - Number(b.xmjd),
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        render: (text, row, index) => {
          return <div style={{ paddingRight: '20px' }}>{text}%</div>;
        },
      },
      {
        title: '项目阶段',
        dataIndex: 'dqlcb',
        width: '14%',
        key: 'xmpd',
        ellipsis: true,
      },
      {
        title: '承担岗位',
        dataIndex: 'cdgw',
        width: '12%',
        key: 'cdgw',
        ellipsis: true,
      },
      {
        title: '项目状态',
        dataIndex: 'xmzt',
        width: '8%',
        key: 'xmzt',
        ellipsis: true,
        sorter: (a, b) => Number(a.xmzt) - Number(b.xmzt),
        sortDirections: ['descend', 'ascend'],
      },
    ];

    return (
      <div className="info-table">
        <div className="project-info-table-box">
          <Table
            loading={tableLoading}
            columns={columns}
            rowKey={'xmid'}
            dataSource={tableData}
            onChange={this.handleTableChange}
            pagination={false}
            // pagination={{
            //     pageSizeOptions: ['10', '20', '30', '40'],
            //     showSizeChanger: true,
            //     showQuickJumper: true,
            //     showTotal: total => `共 ${tableData.length} 条数据`,
            // }}
          />
        </div>
        {pageParams.total !== -1 && pageParams.total !== 0 && (
          <div className="page-individual">
            {tableData.length !== 0 && (
              <Pagination
                onChange={this.handleChange}
                onShowSizeChange={this.handleChange}
                pageSize={pageParams.pageSize}
                current={pageParams.current}
                total={pageParams.total}
                pageSizeOptions={['20', '40', '50', '100']}
                showSizeChanger={true}
                showQuickJumper={true}
                showTotal={total => `共 ${total} 条数据`}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default InfoTable;
