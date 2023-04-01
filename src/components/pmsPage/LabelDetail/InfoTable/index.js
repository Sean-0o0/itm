import React, {Component} from 'react'
import {Table, message, Popover, Pagination} from 'antd'
import moment from 'moment';


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

  render() {
    const {tableLoading = false, tableData = [], pageParams = {}} = this.props;
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
          return <div className='opr-btn'>{text}</div>
        }
      },
      {
        title: '项目标签',
        dataIndex: 'XMBQ',
        width: 195,
        key: 'XMBQ',
        ellipsis: true,
        render: (text, row, index) => {
          const data = this.getTagData(text)
          return <div className="prj-tags">
            {data.length !== 0 && (
              <>
                {data?.slice(0, 2)
                  .map((x, i) => (
                    <div key={i} className="tag-item">
                      {x}
                    </div>
                  ))}
                {data?.length > 2 && (
                  <Popover
                    overlayClassName="tag-more-popover"
                    content={
                      <div className="tag-more">
                        {data?.slice(2)
                          .map((x, i) => (
                            <div key={i} className="tag-item">
                              {x}
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
