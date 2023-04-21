import React, { Component } from 'react'
import { Table, Pagination } from 'antd'

class StaffTable extends Component {
    state = {
        tableLoading: false
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
                if (userData[index].xh === userData[index - 1].xh) {
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
        const { tableLoading } = this.state
        const tableData = [{
            id: 1,
            xh: '1',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 2,
            xh: '2',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 3,
            xh: '3',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 4,
            xh: '3',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 5,
            xh: '3',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 6,
            xh: '4',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 7,
            xh: '4',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 8,
            xh: '5',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 9,
            xh: '6',
            rymc: '张三',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        },
        {
            id: 10,
            xh: '6',
            rymc: '张三1',
            rzsj: '2022-01-01',
            szxm: 'ADM备份恢复验证软件',
            xmjd: '20%',
            gw: '项目经理',
            gzqk: '4.5',
            pf: '8.8'
        }]
        const rowspan = this.rowspan(tableData);
        const columns = [{
            title: '序号',
            dataIndex: 'xh',
            width: '5%',
            key: 'xh',
            ellipsis: true,
        }, {
            title: '人员名称',
            dataIndex: 'rymc',
            width: '10%',
            key: 'rymc',
            ellipsis: true,
            render: (value, row, index) => {
                let obj = {
                  children: value,
                  props: {
                  },
                };
                const _row = rowspan[index];
                obj.props.rowSpan = _row;
                return obj;
              },
        }, {
            title: '入职时间',
            dataIndex: 'rzsj',
            width: '15%',
            key: 'rzsj',
            ellipsis: true,
            render: (value, row, index) => {
                let obj = {
                  children: value,
                  props: {
                  },
                };
                const _row = rowspan[index];
                obj.props.rowSpan = _row;
                return obj;
              },
        }, {
            title: '所在项目',
            dataIndex: 'szxm',
            width: '30%',
            key: 'szxm',
            ellipsis: true,
        },
        {
            title: '项目进度',
            dataIndex: 'xmjd',
            width: '12%',
            key: 'xmjd',
            ellipsis: true,
        }, {
            title: '岗位',
            dataIndex: 'gw',
            width: '12%',
            key: 'gw',
            ellipsis: true,
        }, {
            title: '工作情况(人员)',
            dataIndex: 'gzqk',
            width: '13%',
            key: 'gzqk',
            ellipsis: true,
        },
        {
            title: '评分',
            dataIndex: 'pf',
            width: '5%',
            key: 'pf',
            ellipsis: true,
        }
        ]

        return (<div className='table-box' style={{height: 'calc(100vh - 375px)'}}>
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
                    pageSize={10}
                    current={1}
                    total={11}
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