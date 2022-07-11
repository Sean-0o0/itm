import React, { Fragment } from 'react';
import { Table } from 'antd';

class TradingUnitTableZYCenter extends React.Component {
    state = {
        loading: false,
        pageParam: {
            pageSize: 10,
            current: 1,
            total: 100,
            selectedRow: {},
            selectedRowKeys: ''
        }
    }

    render() {
        const { loading, pageParam } = this.state;
        const { } = this.props;
        let columns = [
            {
                title: '主发宽带广播登记编号',
                dataIndex: 1,
                key: 1,
                width: '20rem',
            },
            {
                title: '广播IP地址',
                dataIndex: 2,
                key: 2,
                width: '20rem',
            },
            {
                title: '协发登记编号',
                dataIndex: 3,
                key: 3,
                width: '20rem',
            },
            {
                title: '协发IP',
                dataIndex: 4,
                key: 4,
                width: '20rem',
            },
        ];
        const datas = [
            {
                "key": 1,
                "1": "1434433",
                "2": "125.34.23.42",
                "3": "12313123129038",
                "4": "125.34.67.42",
            },
            {
                "key": 4,
                "1": "1434433",
                "2": "125.34.23.42",
                "3": "12313123129038",
                "4": "125.34.67.42",
            },
            {
                "key": 3,
                "1": "1434433",
                "2": "125.34.23.42",
                "3": "12313123129038",
                "4": "125.34.67.42",
            },
            {
                "key": 5,
                "1": "1434433",
                "2": "125.34.23.42",
                "3": "12313123129038",
                "4": "125.34.67.42",
            },
            {
                "key": 7,
                "1": "1434433",
                "2": "125.34.23.42",
                "3": "12313123129038",
                "4": "125.34.67.42",
            },
            {
                "key": 6,
                "1": "1434433",
                "2": "125.34.23.42",
                "3": "12313123129038",
                "4": "125.34.67.42",
            },
            {
                "key": 9,
                "1": "1434433",
                "2": "125.34.23.42",
                "3": "12313123129038",
                "4": "125.34.67.42",
            },
        ]

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    宽广信息
                </div>
                <div className='tradingunitlist-table-cont' >
                    <Table
                        columns={columns}
                        dataSource={datas}
                        loading={loading}
                        // bordered
                        pagination={{
                            showQuickJumper: true,
                            // hideOnSinglePage: true,
                            defaultCurrent: 1,
                            pageSize: pageParam.pageSize,
                            current: pageParam.current,
                            total: pageParam.total,
                            showTotal: () => `共${pageParam.total}条`,
                            // onChange: this.onPagerChange,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default TradingUnitTableZYCenter;