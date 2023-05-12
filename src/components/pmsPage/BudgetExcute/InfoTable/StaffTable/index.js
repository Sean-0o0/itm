import React, { Component } from 'react'
import { Table, Pagination, message } from 'antd'
import moment from 'moment';
import { Link } from 'react-router-dom';
import 'moment/locale/zh-cn';
import { EncryptBase64 } from "../../../../Common/Encrypt";
import { QueryBudgetOverviewInfo } from '../../../../../services/pmsServices'
import { isNumber } from 'lodash';

class StaffTable extends Component {
    state = {
        subTabData: {},
        loading: {}
    }

    handleChange = (current, pageSize) => {
        const { fetchData, queryType, pageParam } = this.props;
        if (fetchData) {
            fetchData(queryType, {
                ...pageParam,
                current: current,
                pageSize: pageSize,
                total: -1,
            })
        }
    }

    queryBudgetOverviewInfo = (ysid) => {
        this.setState({
            loading: {
                ...this.state.loading,
                [ysid]: true,
            }
        })
        const { role, orgid, queryType } = this.props;
        QueryBudgetOverviewInfo({
            ysid: ysid,
            org: orgid,
            queryType: queryType,
            role: role,
        }).then(res => {
            const { code = 0, note = '', zbysxmxx, fzbysxmxx, kyysxmxx } = res
            if (code > 0) {
                let data = [];
                if (queryType === 'MX_ZB') {
                    data = JSON.parse(zbysxmxx)
                } else if (queryType === 'MX_FZB') {
                    data = JSON.parse(fzbysxmxx)
                } else if (queryType === 'MX_KY') {
                    data = JSON.parse(kyysxmxx)
                }
                this.setState({
                    subTabData: {
                        ...this.state.subTabData,
                        [ysid]: data,
                    },
                    loading: {
                        ...this.state.loading,
                        [ysid]: false,
                    }
                })
            } else {
                message.error(note)
                this.setState({
                    loading: {
                        ...this.state.loading,
                        [ysid]: false,
                    }
                })
            }
        }).catch(err => {
            this.setState({
                loading: {
                    ...this.state.loading,
                    [ysid]: false,
                }
            })
            message.error("查询项目详情失败")
        })
    }

    onExpand = (expanded, record) => {
        const { YSID } = record
        if (expanded === false) {
            // 因为如果不断的添加键值对，会造成数据过于庞大，浪费资源，
            // 因此在每次合并的时候讲相应键值下的数据清空
            console.log("合并！");
            this.setState({
                subTabData: {
                    ...this.state.subTabData,
                    [YSID]: [],
                }
            });
        } else {
            console.log("展开！");
            this.queryBudgetOverviewInfo(YSID)
        }
    }

    expandedRowRender = (record, index, indent, expanded) => {
        const { YSID } = record;
        const { routes } = this.props;
        const { subTabData = {}, loading = {} } = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'XMID',
                width: '5%',
                key: 'XMID',
                align: 'center',
                ellipsis: true,
                render: (value, row, index) => {
                    return ''
                },
            }, {
                title: '项目名称',
                dataIndex: 'XMMC',
                width: '25%',
                key: 'XMMC',
                ellipsis: true,
                render: (text, row, index) => {
                    const { XMID = '' } = row;
                    return <div title={text}>
                        <Link
                            className='opr-btn'
                            to={{
                                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                                    JSON.stringify({
                                        xmid: XMID,
                                    }),
                                )}`,
                                state: {
                                    routes: routes,
                                },
                            }}

                        >
                            {text}
                        </Link></div>
                }
            }, {
                title: '总预算(万元)',
                dataIndex: 'ZYS',
                width: '17%',
                key: 'ZYS',
                ellipsis: true,
                align: 'right',
            }, {
                title: '可执行预算(万元)',
                dataIndex: 'KZXYS',
                width: '17%',
                key: 'KZXYS',
                ellipsis: true,
                align: 'right',
                render: (value, row, index) => {
                    return value?value:0
                },
            },
            {
                title: '已执行预算(万元)',
                dataIndex: 'YZXYS',
                width: '17%',
                key: 'YZXYS',
                ellipsis: true,
                align: 'right',
                render: (value, row, index) => {
                    return value?value:0
                },
            }, {
                title: '预计执行率',
                dataIndex: 'YJZXL',
                width: '17%',
                key: 'YJZXL',
                align: 'right',
                ellipsis: true,
                render: (value, row, index) => {
                    const { YZXYS, KZXYS} = row
                    let rate = Number.parseFloat(YZXYS)*100/Number.parseFloat(KZXYS);
                    rate = rate&&!isNaN(rate)?rate.toFixed(2): '0'
                    return rate?rate + '%':''
                },
            }
        ];

        return <Table loading={loading[YSID]} showHeader={false}  columns={columns} dataSource={subTabData[YSID]} pagination={false} />;
    };

    render() {
        const { tableLoading = false, bgxx: tableData = [], pageParam = {} } = this.props
        const { current = 1, pageSize = 10 } = pageParam;
        const columns = [{
            title: '序号',
            dataIndex: 'RYID',
            width: '5%',
            key: 'RYID',
            align: 'center',
            ellipsis: true,
            render: (value, row, index) => {
                return (current - 1) * pageSize + index + 1;
            },
        }, {
            title: '项目名称',
            dataIndex: 'YSXMMC',
            width: '25%',
            key: 'YSXMMC',
            ellipsis: true,
        }, {
            title: '总预算(万元)',
            dataIndex: 'ZYS',
            width: '17%',
            key: 'ZYS',
            ellipsis: true,
            align: 'right',
            render: (value, row, index) => {
                return value?value:0
            },
        }, {
            title: '可执行预算(万元)',
            dataIndex: 'KZXYS',
            width: '17%',
            key: 'KZXYS',
            ellipsis: true,
            align: 'right',
            render: (value, row, index) => {
                return value?value:0
            },
        },
        {
            title: '已执行预算(万元)',
            dataIndex: 'YZXYS',
            width: '17%',
            key: 'YZXYS',
            ellipsis: true,
            align: 'right',
            render: (value, row, index) => {
                return value?value:0
            },
        }, {
            title: '预算执行率',
            dataIndex: 'YJZXL',
            width: '17%',
            key: 'YJZXL',
            align: 'right',
            ellipsis: true,
            render: (value, row, index) => {
                return value?value + '%':''
            },
        }
        ]

        return (<div className='table-box'>
            <div className="project-info-table-box">
                <Table
                    loading={tableLoading}
                    columns={columns}
                    class="components-table-demo-nested"
                    expandedRowRender={this.expandedRowRender}
                    onExpand={(expanded, record) => this.onExpand(expanded, record)}
                    expandIconColumnIndex={1}
                    expandIconAsCell={false}
                    rowKey={'YSXMMC'}
                    dataSource={tableData}
                    onChange={this.handleTableChange}
                    pagination={false}
                />
            </div>
            <div className='page-individual'>
               {tableData.length!==0&&<Pagination
                    onChange={this.handleChange}
                    onShowSizeChange={this.handleChange}
                    pageSize={pageParam.pageSize}
                    current={pageParam.current}
                    total={pageParam.total}
                    pageSizeOptions={['10', '20', '30', '40']}
                    showSizeChanger={true}
                    // hideOnSinglePage={true}
                    showQuickJumper={true}
                    showTotal={total => `共 ${total} 条数据`}
                />}

            </div>
        </div>);
    }
}

export default StaffTable;