import React, {Component} from 'react';
import {Table, message, Popover, Pagination, Tooltip} from 'antd';
import moment from 'moment';
import {EncryptBase64} from '../../../Common/Encrypt';
import {Link} from 'react-router-dom';

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
    const {handleSearch, ryid} = this.props;
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
    const {handleSearch, ryid} = this.props;
    const {order = '', field = ''} = sorter;
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
    const {tableLoading = false, tableData = [], pageParams = {}, routes = []} = this.props;

    const columns = [
      {
        title: '月份',
        dataIndex: 'YF',
        width: '10%',
        key: 'YF',
        ellipsis: true,
        sorter: (a, b) => Number(a.YF) - Number(b.YF),
        sortDirections: ['descend', 'ascend'],
        render: (text, row, index) => {
          return <div style={{paddingRight: '20px'}}>{moment(text, "YYYY-MM").format("YYYY-MM")}</div>;
        },
      },
      {
        title: '评分',
        dataIndex: 'PF',
        width: '10%',
        key: 'PF',
        ellipsis: true,
        sorter: (a, b) => Number(a.PF) - Number(b.PF),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '综合评分',
        dataIndex: 'ZHPF',
        width: '10%',
        key: 'ZHPF',
        ellipsis: true,
        sorter: (a, b) => Number(a.ZHPF) - Number(b.ZHPF),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '附件',
        dataIndex: 'FJ',
        width: '20%',
        key: 'FJ',
        ellipsis: true,
        align: 'right',
        sortDirections: ['descend', 'ascend'],
        render: (text, row) => <span style={{marginRight: 20}}>
        <a style={{color: '#3361FF'}}
           href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?EVENT_SOURCE=Download&Table=TWBRY_YDKH&ID=${row.KHID}&Column=FJ&Type=View&fileid=0`}>
        {text}</a></span>,
      },
      {
        title: '日期',
        dataIndex: 'RQ',
        width: '14%',
        key: 'RQ',
        ellipsis: true,
        sorter: (a, b) => Number(a.RQ) - Number(b.RQ),
        align: 'right',
        render: (text, row, index) => {
          return <div style={{paddingRight: '20px'}}>{moment(text, "YYYY-MM-DD").format("YYYY-MM-DD")}</div>;
        },
      },
    ];

    return (
      <div className="info-table">
        <div className="top-title">月度考核</div>
        <div className="member-detail-table-box">
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
