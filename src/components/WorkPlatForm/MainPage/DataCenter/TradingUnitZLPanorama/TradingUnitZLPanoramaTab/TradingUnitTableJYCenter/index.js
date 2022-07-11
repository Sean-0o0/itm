import React, { Fragment } from 'react';
import { Table } from 'antd';

class TradingUnitTableJYCenter extends React.Component {
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
                title: '月份',
                dataIndex: 1,
                key: 1,
                width: '15rem',
            },
            {
                title: '净佣金（元）',
                dataIndex: 2,
                key: 2,
                width: '15rem',
            },
            {
                title: '委托笔数',
                dataIndex: 3,
                key: 3,
                width: '15rem',
            },
            {
                title: '下挂账户数',
                dataIndex: 4,
                key: 4,
                width: '15rem',
            },
            {
                title: '使用费',
                dataIndex: 5,
                key: 5,
                width: '10rem',
            },
            {
                title: '流量费',
                dataIndex: 6,
                key: 6,
                width: '20rem',
            },
        ];
        const datas = [
            {
                "key": 1,
                "1": "2022-04-29",
                "2": "168800.32",
                "3": "13566",
                "4": "10",
                "5": "188",
                "6": "221",
            },
            {
                "key": 4,
                "1": "2022-04-29",
                "2": "168800.32",
                "3": "13566",
                "4": "10",
                "5": "188",
                "6": "221",
            },
            {
                "key": 3,
                "1": "2022-04-29",
                "2": "168800.32",
                "3": "13566",
                "4": "10",
                "5": "188",
                "6": "221",
            },
            {
                "key": 5,
                "1": "2022-04-29",
                "2": "168800.32",
                "3": "13566",
                "4": "10",
                "5": "188",
                "6": "221",
            },
            {
                "key": 7,
                "1": "2022-04-29",
                "2": "168800.32",
                "3": "13566",
                "4": "10",
                "5": "188",
                "6": "221",
            },
            {
                "key": 6,
                "1": "2022-04-29",
                "2": "168800.32",
                "3": "13566",
                "4": "10",
                "5": "188",
                "6": "221",
            },
            {
                "key": 9,
                "1": "2022-04-29",
                "2": "168800.32",
                "3": "13566",
                "4": "10",
                "5": "188",
                "6": "221",
            },
        ]

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    交易单元交易情况
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

export default TradingUnitTableJYCenter;