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
        let order = 1
        userData.forEach((item, index) => {
            let obj = {}
            if (index === 0) {
                obj.num = 1;
                position = 0;
            } else {
                //需要合并的地方判断
                if (userData[index].RYID === userData[index - 1].RYID) {
                    spanArr[position].num += 1;
                    obj.num = 0;

                } else {
                    obj.num = 1;
                    position = index;
                    order++;
                }
            }
            obj.order = order;
            spanArr.push(obj)
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
        const { current = 1, pageSize = 10 } = pageParam;
        const rowspan = this.rowspan(tableData);
        const columns = [{
            title: '序号',
            dataIndex: 'XH',
            width: '5%',
            key: 'XH',
            align: 'center',
            ellipsis: true,
            render: (value, row, index) => {
                let obj = {
                    children: value,
                    props: {
                    },
                };
                const _row = rowspan[index].num;
                obj.props.rowSpan = _row;
                return obj;
            },
        }, {
            title: '人员名称',
            dataIndex: 'RYMC',
            width: '10%',
            key: 'RYMC',
            ellipsis: true,
            // onCell: (record, index) => { // 传入两个形参，分别为行内容record与行index
            //     const _row = rowspan[index];
            //     if (_row > 1) { 
            //         return {
            //             style: {
            //                 borderLeft: '1px solid #e8e8e8', //此处需注意
            //             },
            //         };
            //     }
            // },
            render: (value, row, index) => {
                const { RYID = '' } = row;
                let obj = {
                    children: <div title={value}>
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
                const _row = rowspan[index].num;
                obj.props.rowSpan = _row;
                return obj;
            },
        }, {
            title: '入职时间',
            dataIndex: 'RZSJ',
            width: '13%',
            key: 'RZSJ',
            ellipsis: true,
            onCell: (record, index) => { // 传入两个形参，分别为行内容record与行index
                const _row = rowspan[index].num;
                if (_row > 1) {
                    return {
                        style: {
                            borderRight: '1px solid #e8e8e8', //此处需注意
                        },
                    };
                }
            },
            render: (value, row, index) => {
                const result = value?moment(value, 'YYYYMMDD').format('YYYY-MM-DD'):value
                let obj = {
                    children: <div className='opr-btn-box' title={result}>{result}</div>,
                    props: {
                    },
                };
                const _row = rowspan[index].num;
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
                return text&&text!=-1?<div title={text}>
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
                    </Link></div>:'暂无'
            }
        },
        {
            title: '项目进度',
            dataIndex: 'XMJD',
            width: '12%',
            key: 'XMJD',
            ellipsis: true,
            render: (value, row, index) => {
                return value&&value!=-1?<div className='opr-btn-box' title={value + '%'}>{value + '%'}</div>:'暂无'
            },
        }, {
            title: '岗位',
            dataIndex: 'GW',
            width: '14%',
            key: 'GW',
            ellipsis: true,
            render: (text, row, index) => {
                return text&&text!=-1?text : '暂无'
            }
        }, {
            title: '工时(人天)',
            dataIndex: 'GS',
            width: '13%',
            key: 'GS',
            align: 'right',
            ellipsis: true,
            render: (text, row, index) => {
                return text&&text!=-1?text : '暂无'
            }
        },
        {
            title: '评分',
            dataIndex: 'PJ',
            width: '5%',
            key: 'PJ',
            align: 'center',
            ellipsis: true,
            render: (text, row, index) => {
                return text&&text!=-1?text : '暂无'
            }
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
                    pagination={{
                        pageSizeOptions:  ['10', '20', '30', '40'],
                        showSizeChanger:  true,
                        showQuickJumper:  true,
                        showTotal: total => `共 ${tableData.length} 条数据`
                    }}
                />
            </div>
            {/* <div className='page-individual'>
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

            </div> */}
        </div>);
    }
}

export default StaffTable;