import React from 'react';
import { Table, Popconfirm } from 'antd';

class AddDepartmentPlanTable extends React.Component {
    state = {
        data: [],
    }

    componentDidMount() {
        const { data = [] } = this.props;
        data.push({ key: data.length + 1 + '' });
        this.setState({
            data: data
        })
    }

    handleDelete = (key) => {
        const data = [...this.state.data];
        this.setState({ data: data.filter(item => item.key !== key) });
    };

    addDeclare = () => {
        const { data = [] } = this.state;
        data.push({ key: new Date().toString() });
        this.setState({
            data: data
        })
    }

    render() {
        const { data = [] } = this.state;
        const { columnName = [], dataIndexList = [] } = this.props;

        const columns = columnName.map((item, current) => {
            const width = 200;
            let defaultCont = {
                title: item,
                dataIndex: dataIndexList.length > current ? dataIndexList[current] : '',
                align: 'center',
                render: (value, row, index) => {
                    const obj = {
                        children: value,
                        props: {
                        },
                    };
                    if (index === data.length - 1) {
                        if (current === 0) {
                            obj.children = <div className='dp-add-declare' onClick={this.addDeclare}>
                                < i className='iconfont icon-tianjia' style={{ fontSize: '1.333rem', marginRight: '1rem' }} />
                                    添加设计说明
                            </div >;
                            obj.props.colSpan = columnName.length + 1;
                        } else {
                            obj.props.colSpan = 0;
                        }
                        return obj;
                    }
                    return obj;
                },
            };
            if (current === 0) {
                defaultCont = {
                    ...defaultCont,
                    width: width
                };
            }
            return defaultCont;
        })
        columns.push({
            title: '',
            width: 100,
            dataIndex: 'operation',
            render: (value, row, index) => {
                if (index === data.length - 1) {
                    const obj = {
                        props: {
                            colSpan: 0
                        },
                    };
                    return obj;
                }
                return this.state.data.length >= 1 ? (
                    <Popconfirm title={`确定删除当前指标吗?`} onConfirm={() => this.handleDelete(row.key)}>
                        <a><i className='iconfont icon-delete1' style={{ fontSize: '1.333rem' }} /></a>
                    </Popconfirm>
                ) : null
            }
        })

        return (
            <div className='dp-index-table'>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false} />
            </div>
        );
    }
}
export default AddDepartmentPlanTable;
