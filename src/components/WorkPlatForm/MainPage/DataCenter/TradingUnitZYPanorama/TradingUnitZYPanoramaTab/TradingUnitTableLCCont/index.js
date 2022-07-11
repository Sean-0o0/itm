import React, { Fragment } from 'react';
import { Table } from 'antd';

class TradingUnitTableLCCont extends React.Component {
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
                title: '申请日期',
                dataIndex: 1,
                key: 1,
                width: '15rem',
            },
            {
                title: '主题',
                dataIndex: 2,
                key: 2,
                width: '15rem',
            },
            {
                title: '详情',
                dataIndex: 3,
                key: 3,
                width: '25rem',
            },
            {
                title: '申请部门',
                dataIndex: 4,
                key: 4,
                width: '25rem',
            },
            {
                title: '申请人',
                dataIndex: 5,
                key: 5,
                width: '20rem',
            },
            {
                title: '加入日期',
                dataIndex: 6,
                key: 6,
                width: '15rem',
            },
            {
                title: '离开网关日期',
                dataIndex: 7,
                key: 7,
                width: '15rem',
            },
            {
                title: '交易单元网关状态',
                dataIndex: 8,
                key: 8,
                width: '20rem',
            }
        ];
        const datas = [
            {
                "key": 1,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
            {
                "key": 8,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            }, {
                "key": 2,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            }, {
                "key": 3,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            }, {
                "key": 4,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            }, {
                "key": 5,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            }, {
                "key": 6,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            }, {
                "key": 7,
                "1": "2022-04-29",
                "2": "这里是主题名称",
                "3": "这里是详情内容的长度",
                "4": "销售交易总部",
                "5": "国信资格一号租赁",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
        ]

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    流程消息
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

export default TradingUnitTableLCCont;