import React from 'react';
import { Table } from 'antd';

class TradingUnitCalculate extends React.Component {
    state = {
        loading: false,
        pageParam: {
            selectedRow: {},
            selectedRowKeys: '',
        }
    }

    render() {
        const columns = [
            {
                title: "费用名称",
                dataIndex: 'mc',
                key: 'mc',
                width: '23rem',
                align: 'center'
            }, {
                title: "费用值",
                dataIndex: 'value',
                key: 'value',
                width: '18rem',
                align: 'center'
            }, {
                title: "计算公式",
                dataIndex: 'rule',
                key: 'rule',
                align: 'center'
            }
        ]

        const data = [
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            },
            {
                key: '1',
                mc: "深交所使用费",
                value: '1000',
                rule: '（当月使用交易单元数-席位数）×（交易单元使用费年费/12）'
            }
        ]

        const { changeSelectedRow } = this.props;

        return (
            <div className='cost-table'>
                <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{
                        y: '70rem'
                    }}
                    bordered = {true}
                    onRow={(record, index) => {
                        return {
                            onClick: event => {
                                const { selectedRowKeys: preIndex = '' } = this.state;
                                if(changeSelectedRow){
                                    changeSelectedRow(record);
                                }
                                this.setState({
                                    selectedRowKeys: index
                                }, () => {
                                    const rows = document.getElementsByClassName("ant-table-row") || [];
                                    if (rows.length > index) {
                                        if (preIndex !== '') {
                                            rows[preIndex].classList.remove("select-rows")
                                        }
                                        rows[index].classList.add("select-rows")
                                    }
                                })

                            }
                        }
                    }}
                    onChange={this.handleTableChange}
                    // pagination={{
                    //     showQuickJumper: true,
                    //     showSizeChanger: true,
                    //     pageSize: params.pageSize,
                    //     current: params.current,
                    //     total: params.total,
                    //     showTotal: () => `共 ${params.total} 条`,
                    // }}
                />
            </div>
        );
    }
}

export default TradingUnitCalculate;
