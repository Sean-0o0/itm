import React, { Fragment } from 'react';
import { Table } from 'antd';

class TradingUnitTableZLCont extends React.Component {
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
                title: '使用单位（承租方）',
                dataIndex: 1,
                key: 1,
                width: '25rem',
            },
            {
                title: '委托单位（委托方）',
                dataIndex: 2,
                key: 2,
                width: '15rem',
            },
            {
                title: '业务对手名称',
                dataIndex: 3,
                key: 3,
                width: '25rem',
            },
            {
                title: '对手证件号码',
                dataIndex: 4,
                key: 4,
                width: '15rem',
            },
            {
                title: '佣金率',
                dataIndex: 5,
                key: 5,
                width: '10rem',
            },
            {
                title: '交易租用开始时间',
                dataIndex: 6,
                key: 6,
                width: '20rem',
            },
            {
                title: '交易租用结束时间',
                dataIndex: 7,
                key: 7,
                width: '20rem',
            }
        ];
        const datas = [
            {
                "key": 1,
                "1": "华安财保资产管理有限责任公司",
                "2": "招商银行",
                "3": "华安财保资产管理有限责任公司",
                "4": "223341",
                "5": "0.08",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
            {
                "key": 4,
                "1": "华安财保资产管理有限责任公司",
                "2": "招商银行",
                "3": "华安财保资产管理有限责任公司",
                "4": "223341",
                "5": "0.08",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
            {
                "key": 3,
                "1": "华安财保资产管理有限责任公司",
                "2": "招商银行",
                "3": "华安财保资产管理有限责任公司",
                "4": "223341",
                "5": "0.08",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
            {
                "key": 5,
                "1": "华安财保资产管理有限责任公司",
                "2": "招商银行",
                "3": "华安财保资产管理有限责任公司",
                "4": "223341",
                "5": "0.08",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
            {
                "key": 7,
                "1": "华安财保资产管理有限责任公司",
                "2": "招商银行",
                "3": "华安财保资产管理有限责任公司",
                "4": "223341",
                "5": "0.08",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
            {
                "key": 6,
                "1": "华安财保资产管理有限责任公司",
                "2": "招商银行",
                "3": "华安财保资产管理有限责任公司",
                "4": "223341",
                "5": "0.08",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
            {
                "key": 9,
                "1": "华安财保资产管理有限责任公司",
                "2": "招商银行",
                "3": "华安财保资产管理有限责任公司",
                "4": "223341",
                "5": "0.08",
                "6": "2022-04-29",
                "7": "2022-05-29",
            },
        ]

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    租赁信息
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

export default TradingUnitTableZLCont;