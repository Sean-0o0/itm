import React, { Fragment } from 'react';
import { Table } from 'antd';

class TradingUnitTableZYButtom extends React.Component {
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
                title: '权限种类',
                dataIndex: 1,
                key: 1,
                width: '20rem',
            },
            {
                title: '开通时间',
                dataIndex: 2,
                key: 2,
                width: '20rem',
            },
            {
                title: '权限关闭时间',
                dataIndex: 3,
                key: 3,
                width: '20rem',
            },
            {
                title: '产品号',
                dataIndex: 4,
                key: 4,
                width: '20rem',
            },
        ];
        const datas = [
            {
                "key": 1,
                "1": "ETF/LOF",
                "2": "2022-04-29",
                "3": "2022-04-29",
                "4": "12317839123123",
            },
            {
                "key": 4,
                "1": "ETF/LOF",
                "2": "2022-04-29",
                "3": "2022-04-29",
                "4": "12317839123123",
            },
            {
                "key": 3,
                "1": "ETF/LOF",
                "2": "2022-04-29",
                "3": "2022-04-29",
                "4": "12317839123123",
            },
            {
                "key": 5,
                "1": "ETF/LOF",
                "2": "2022-04-29",
                "3": "2022-04-29",
                "4": "12317839123123",
            },
            {
                "key": 7,
                "1": "ETF/LOF",
                "2": "2022-04-29",
                "3": "2022-04-29",
                "4": "12317839123123",
            },
            {
                "key": 6,
                "1": "ETF/LOF",
                "2": "2022-04-29",
                "3": "2022-04-29",
                "4": "12317839123123",
            },
            {
                "key": 9,
                "1": "ETF/LOF",
                "2": "2022-04-29",
                "3": "2022-04-29",
                "4": "12317839123123",
            },
        ]

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    权限信息表
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

export default TradingUnitTableZYButtom;