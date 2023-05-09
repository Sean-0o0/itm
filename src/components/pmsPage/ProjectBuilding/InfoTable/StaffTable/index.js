import React, { Component } from 'react'
import { Table, Pagination, Popover } from 'antd'
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

    //获取标签数据
    getTagData = tag => {
        let arr = [];
        if (tag !== '' && tag !== null && tag !== undefined) {
            if (tag.includes(',')) {
                arr = tag.split(',');
            } else {
                arr.push(tag);
            }
        }
        return arr;
    };

    render() {
        const { tableLoading = false, bgxx: tableData = [], pageParam = {}, routes = [] } = this.props
        const { current = 1, pageSize = 10 } = pageParam;
        const columns = [{
            title: '序号',
            dataIndex: 'ID',
            width: '5%',
            key: 'ID',
            align: 'center',
            ellipsis: true,
            render: (value, row, index) => {
                return (current - 1) * pageSize + index + 1;
            },
        }, {
            title: '项目名称',
            dataIndex: 'XMMC',
            width: '19%',
            key: 'XMMC',
            ellipsis: true,
            render: (value, row, index) => {
                const { XMID = '' } = row;
                return <div title={value}>
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
                        {value}
                    </Link></div>
            },
        }, {
            title: '项目经理',
            dataIndex: 'XMJL',
            width: '8%',
            key: 'XMJL',
            ellipsis: true,
            render: (value, row, index) => {
                const { RYID = '' } = row;
                return <div title={value}>
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
                    </Link></div>
            },
        }, {
            title: '立项时间',
            dataIndex: 'LXSJ',
            width: '10%',
            key: 'LXSJ',
            ellipsis: true,
            render: (text, row, index) => {
                return text?moment(text, 'YYYYMMDD').format('YYYY-MM-DD'): ''
            }
        },
        {
            title: '项目类型',
            dataIndex: 'XMLX',
            width: '10%',
            key: 'XMLX',
            ellipsis: true,
        }, {
            title: '项目进度',
            dataIndex: 'XMJD',
            width: '8%',
            key: 'XMJD',
            align: 'right',
            ellipsis: true,
            render: (value, row, index) => {
                return <div className='opr-btn-box' title={value + '%'}>{value + '%'}</div>
            },
        }, {
            title: '当前里程碑',
            dataIndex: 'DQLCB',
            width: '13%',
            key: 'DQLCB',
            // align: 'right',
            ellipsis: true,
        }, {
            title: '项目标签',
            dataIndex: 'XMBQ',
            key: 'XMBQ',
            ellipsis: true,
            render: (text, row, index) => {
                const { XMBQID = '' } = row;
                const ids = this.getTagData(XMBQID);
                const data = this.getTagData(text);
                return <div className="prj-tags">
                    {data.length !== 0 && (
                        <>
                            {data?.slice(0, 3)
                                .map((x, i) => (
                                    <div key={i} className="tag-item">
                                        <Link
                                            to={{
                                                pathname:
                                                    '/pms/manage/labelDetail/' +
                                                    EncryptBase64(
                                                        JSON.stringify({
                                                            bqid: ids[i],
                                                        }),
                                                    ),
                                                state: {
                                                    routes: routes,
                                                },
                                            }}
                                        >
                                            {x}
                                        </Link>
                                    </div>
                                ))}
                            {data?.length > 3 && (
                                <Popover
                                    overlayClassName="tag-more-popover"
                                    content={
                                        <div className="tag-more">
                                            {data?.slice(3)
                                                .map((x, i) => (
                                                    <div key={i} className="tag-item">
                                                        <Link
                                                            to={{
                                                                pathname:
                                                                    '/pms/manage/labelDetail/' +
                                                                    EncryptBase64(
                                                                        JSON.stringify({
                                                                            bqid: ids[i],
                                                                        }),
                                                                    ),
                                                                state: {
                                                                    routes: routes,
                                                                },
                                                            }}
                                                        >
                                                            {x}
                                                        </Link>
                                                    </div>
                                                ))}
                                        </div>
                                    }
                                    title={null}
                                >
                                    <div className="tag-item">...</div>
                                </Popover>
                            )}
                        </>
                    )}
                </div>
            }
        }
        ]

        return (<div className='table-box' style={{ height: 'calc(100vh - 296px)' }}>
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
                    // hideOnSinglePage={true}
                    showQuickJumper={true}
                    showTotal={total => `共 ${total} 条数据`}
                />

            </div>
        </div>);
    }
}

export default StaffTable;