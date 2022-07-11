import React from 'react';
import { Table } from 'antd';

class TradingUnitTableCont extends React.Component {
    state = {
        loading: false,
        pageParam: {
            selectedRow: {},
            selectedRowKeys: '',
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        const { queryList } = this.props;
        const { order = '', field = '' } = sorter;
        if (queryList) {
            queryList({
                current: pagination.current,
                pageSize: pagination.pageSize,
                paging: 1,
                total: -1,
                sort: order? `${field.slice(-2)==='nm'?field.slice(0,-2):field} ${order.slice(0,-3)}`:''
            })
        }
    };

    handleModifyVisible = (record) => {
        const { changeSelectedRow } = this.props;
        if (changeSelectedRow) {
            changeSelectedRow(record);
        }
    }

    getColumns = () => {
        const { targetKeys = [], mockData = [] } = this.props;
        let columns = [];
        let keys = []
        mockData.forEach(element => {
            const { key = '', title = '' } = element;
            targetKeys.forEach((item, index) => {
                if (item === key && !keys.includes(key)) {
                    let temp = {
                        title: title,
                        dataIndex: key,
                        key: key,
                        sorter: true,
                        width: key === 'mkucode' ? '19rem' : '26rem'
                    };
                    temp.render = (text, record) => {
                        return (<div
                            title={text}
                            style={{
                                color: key === 'mkucode' ? '#0073aa' : '#333',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>{text}</div>)
                    };
                    columns.push(temp);
                    keys.push(key)
                }
            })
        });
        let tempOpr = {
            title: '操作',
            dataIndex: 'opr',
            key: 'opr',
            fixed: 'right',
            width: '15rem',
            align: 'center',
            render: (text, record) => {
                return <div className='opr-modify' onClick={() => { this.handleModifyVisible(record) }}>修改</div>
            }
        };
        columns.push(tempOpr);
        return columns
    }

    render() {

        const { params = {}, data = [] } = this.props;
        const columns = this.getColumns();

        return (
            <div className='tradingunitlist-table-cont'>
                <Table
                    columns={columns}
                    dataSource={data}
                    // loading={loading}
                    scroll={{
                        x: `${columns.length * 20 - 5}rem`,
                        y: '62rem'
                    }}
                    onChange={this.handleTableChange}
                    pagination={{
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSize: params.pageSize,
                        current: params.current,
                        total: params.total,
                        showTotal: () => `共 ${params.total} 条`,
                    }}
                />
            </div>
        );
    }
}

export default TradingUnitTableCont;