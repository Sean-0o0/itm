import React, { Component } from 'react'
import { Table, Pagination } from 'antd'
import moment from 'moment';
import { Link } from 'react-router-dom';
import 'moment/locale/zh-cn';
import { EncryptBase64 } from "../../../../Common/Encrypt";
class StaffTable extends Component {
    state = {

    }

    handleChange = (current, pageSize) => {
        const { fetchData, queryType, gwbm, pageParam } = this.props;
        if (fetchData) {
            fetchData(queryType, gwbm, {
                ...pageParam,
                current: current,
                pageSize: pageSize,
                total: -1,
            })
        }
    }

    //计算合并
    rowspan = (userData) => {
        let spanArr = [];
        let position = 0;
        userData.forEach((item, index) => {
            if (index === 0) {
                spanArr.push(1);
                position = 0;
            } else {
                //需要合并的地方判断
                if (userData[index].XMID === userData[index - 1].XMID) {
                    spanArr[position] += 1;
                    spanArr.push(0);
                } else {
                    spanArr.push(1);
                    position = index;
                }
            }
        });
        return spanArr
    }

    // renderContent = (value, row, index) => {
    //     const obj = {
    //         children: value,
    //         attrs: {}
    //     };
    //     const _row = spanArr[index];
    //     const _col = _row > 0 ? 1 : 0;
    //     obj.attrs = {
    //         rowSpan: _row,
    //         colSpan: _col
    //     };

    //     return obj;
    // };

    render() {
        const { tableLoading = false, bgxx: tableData = [], pageParam = {}, role, routes = [] } = this.props
        console.log('routes',routes)
        const { current = 1, pageSize = 10 } = pageParam;
        const rowspan = this.rowspan(tableData);
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
            title: '人员名称',
            dataIndex: 'RYMC',
            width: '10%',
            key: 'RYMC',
            ellipsis: true,
            render: (value, row, index) => {
                const { RYID = '' } = row;
                let obj = {
                    children: <div >
                        <Link
                            className='opr-btn'
                            to={{
                                pathname: `/pms/manage/staffDetail/${EncryptBase64(
                                    JSON.stringify({
                                      ryid: RYID,
                                    }),
                                  )}`,
                                state: {
                                    routes: routes,
                                },
                            }}

                        >
                            {value}
                        </Link></div>,
                    props: {
                    },
                };
                const _row = rowspan[index];
                obj.props.rowSpan = _row;
                return obj;
            },
        }, {
            title: '入职时间',
            dataIndex: 'RZSJ',
            width: '15%',
            key: 'RZSJ',
            ellipsis: true,
            render: (value, row, index) => {
                let obj = {
                    children: moment(value, 'YYYYMMDD').format('YYYY-MM-DD'),
                    props: {
                    },
                };
                const _row = rowspan[index];
                obj.props.rowSpan = _row;
                return obj;
            },
        }, {
            title: '所在项目',
            dataIndex: 'SZXM',
            width: '30%',
            key: 'SZXM',
            ellipsis: true,
            render: (text, row, index) => {
                const { XMID = '' } = row;
                return <div >
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
        },
        {
            title: '项目进度',
            dataIndex: 'XMJD',
            width: '12%',
            key: 'XMJD',
            ellipsis: true,
            render: (value, row, index) => {
                return value + '%';
            },
        }, {
            title: '岗位',
            dataIndex: 'GW',
            width: '12%',
            key: 'GW',
            ellipsis: true,
        }, {
            title: '工时情况(人员)',
            dataIndex: 'GS',
            width: '13%',
            key: 'GS',
            align: 'right',
            ellipsis: true,
        },
        {
            title: '评分',
            dataIndex: 'PJ',
            width: '5%',
            key: 'PJ',
            align: 'center',
            ellipsis: true,
        }
        ]

        return (<div className='table-box' style={{ height: (role === '信息技术事业部领导' || role === '一级部门领导') ? 'calc(100vh - 375px)' : 'calc(100vh - 235px)' }}>
            <div className="project-info-table-box">
                <Table
                    loading={tableLoading}
                    columns={columns}
                    rowKey={'id'}
                    dataSource={tableData}
                    onChange={this.handleTableChange}
                    pagination={false}
                />
            </div>
            <div className='page-individual'>
                <Pagination
                    onChange={this.handleChange}
                    onShowSizeChange={this.handleChange}
                    pageSize={pageParam.pageSize}
                    current={pageParam.current}
                    total={pageParam.total}
                    pageSizeOptions={['10', '20', '30', '40']}
                    showSizeChanger={true}
                    hideOnSinglePage={true}
                    showQuickJumper={true}
                    showTotal={total => `共 ${total} 条数据`}
                />

            </div>
        </div>);
    }
}

export default StaffTable;