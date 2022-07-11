import React, { Fragment } from 'react';
import { Table } from 'antd';

class TradingUnitTableZYCont extends React.Component {
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
                title: '网关类型',
                dataIndex: 1,
                key: 1,
                width: '25rem',
            },
            {
                title: '网关号',
                dataIndex: 2,
                key: 2,
                width: '15rem',
            },
            {
                title: '网关状态',
                dataIndex: 3,
                key: 3,
                width: '15rem',
            },
            {
                title: '加入日期',
                dataIndex: 4,
                key: 4,
                width: '20rem',
            },
            {
                title: '离开网关日期',
                dataIndex: 5,
                key: 5,
                width: '20rem',
            },
            {
                title: '交易单元网关状态',
                dataIndex: 6,
                key: 6,
                width: '20rem',
            }
        ];
        const datas = [
            {
                "key": 1,
                "1": "交易通信网关",
                "2": "G1234190",
                "3": "已开",
                "4": "2022-04-29",
                "5": "2022-04-29",
                "6": "- -",
            },
            {
                "key": 4,
                "1": "交易通信网关",
                "2": "G1234190",
                "3": "已开",
                "4": "2022-04-29",
                "5": "2022-04-29",
                "6": "- -",
            },
            {
                "key": 3,
                "1": "交易通信网关",
                "2": "G1234190",
                "3": "已开",
                "4": "2022-04-29",
                "5": "2022-04-29",
                "6": "- -",
            },
            {
                "key": 5,
                "1": "交易通信网关",
                "2": "G1234190",
                "3": "已开",
                "4": "2022-04-29",
                "5": "2022-04-29",
                "6": "- -",
            },
            {
                "key": 7,
                "1": "交易通信网关",
                "2": "G1234190",
                "3": "已开",
                "4": "2022-04-29",
                "5": "2022-04-29",
                "6": "- -",
            },
            {
                "key": 6,
                "1": "交易通信网关",
                "2": "G1234190",
                "3": "已开",
                "4": "2022-04-29",
                "5": "2022-04-29",
                "6": "- -",
            },
            {
                "key": 9,
                "1": "交易通信网关",
                "2": "G1234190",
                "3": "已开",
                "4": "2022-04-29",
                "5": "2022-04-29",
                "6": "- -",
            },
        ]

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    网关信息
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

export default TradingUnitTableZYCont;