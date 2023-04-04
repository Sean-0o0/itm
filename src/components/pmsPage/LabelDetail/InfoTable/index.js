import React, {Component} from 'react'
import {Table, Popover, Pagination} from 'antd'
import moment from 'moment';
import {EncryptBase64} from "../../../Common/Encrypt";
import {Link} from 'react-router-dom';


class InfoTable extends Component {
  state = {}

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
    const {handleSearch, bqid} = this.props;
    if (handleSearch) {
      handleSearch({
        current: current,
        pageSize: pageSize,
        total: -1,
      }, bqid)
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    const {handleSearch, bqid} = this.props;
    const {order = '', field = ''} = sorter;
    if (handleSearch) {
      handleSearch({
        total: -1,
        sort: order ? `${field} ${order.slice(0, -3)}` : ''
      }, bqid)
    }
  };

  jumpToDetail = id => {
    // console.log("cccc-jjjj")
    window.location.href = `/#/pms/manage/ProjectDetail/${EncryptBase64(
      JSON.stringify({
        routes: [{name: '首页', pathname: location.pathname}],
        xmid: id,
      }),
    )}`;
  };

  render() {
    const {tableLoading = false, tableData = [], pageParams = {}, routes = []} = this.props;
    const columns = [
      {
        title: '年份',
        dataIndex: 'XMNF',
        width: '9%',
        key: 'XMNF',
        ellipsis: true,
        sorter: (a, b) => Number(a.xmnf) - Number(b.xmnf),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '项目名称',
        dataIndex: 'XMMC',
        width: '20%',
        key: 'XMMC',
        ellipsis: true,
        render: (text, row, index) => {
          const {XMID = ''} = row;
          return <div className='opr-btn' onClick={() => this.jumpToDetail(XMID)}>{text}</div>
        }
      },
      {
        title: '项目标签',
        dataIndex: 'XMBQ',
        width: 195,
        key: 'XMBQ',
        ellipsis: true,
        render: (text, row, index) => {
          // console.log("rowrow",row)
          const {XMBQID = ''} = row;
          const ids = this.getTagData(XMBQID);
          const data = this.getTagData(text);
          return <div className="prj-tags">
            {data.length !== 0 && (
              <>
                {data?.slice(0, 3)
                  .map((x, i) => (
                    <div key={i} className="tag-item">
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
                        {data?.slice(3)
                          .map((x, i) => (
                            <div key={i} className="tag-item">
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
                    <div className="tag-item">...</div>
                  </Popover>
                )}
              </>
            )}
          </div>
        }
      },
      {
        title: '项目进度',
        dataIndex: 'XMJD',
        width: '10%',
        key: 'XMJD',
        ellipsis: true,
        sorter: (a, b) => Number(a.xmjd) - Number(b.xmjd),
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        render: (text, row, index) => {
          return <div style={{paddingRight: '20px'}}>
            {text}%
          </div>
        }
      },
      {
        title: '项目阶段',
        dataIndex: 'DQLCB',
        width: '15%',
        key: 'DQLCB',
        ellipsis: true,
      },
      {
        title: '项目状态',
        dataIndex: 'XMZT',
        width: '12%',
        key: 'XMZT',
        ellipsis: true,
        sorter: (a, b) => a.XMZT.localeCompare(b.XMZT),
        sortDirections: ['descend', 'ascend']
      }
    ];
    // console.log("tableDatatableData", tableData)
    return (
      <div className="info-table">
        <div className="project-info-table-box">
          <Table
            loading={tableLoading}
            columns={columns}
            rowKey={'XMID'}
            dataSource={tableData}
            onChange={this.handleTableChange}
            pagination={false}
          />
        </div>
        <div className='page-individual'>
          <Pagination
            onChange={this.handleChange}
            pageSize={pageParams.pageSize}
            current={pageParams.current}
            total={pageParams.total}
            pageSizeOptions={['10', '20', '30', '40']}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={total => `共 ${total} 条数据`}
          />

        </div>
      </div>
    );
  }
}

export default InfoTable;
