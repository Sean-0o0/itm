import React from 'react';
import { Table } from 'antd';
import { slice } from 'lodash';

class TradingUnitTableCont extends React.Component {
    state = {
        loading: false,
        pageParam: {
            selectedRow: {},
            selectedRowKeys: '',
        }
    }

    // componentWillReceiveProps() {
    //     const { selectedRowKeys = '' } = this.state;
    //     if (selectedRowKeys !== '') {
    //         const rows = document.getElementsByClassName("ant-table-row") || [];
    //         if (rows.length > selectedRowKeys) {
    //             rows[selectedRowKeys].classList.remove("select-rows")
    //         }
    //     }
    // }

    componentDidUpdate() {
        const { isDiff } = this.props;
        if (isDiff) {
            const table = document.getElementsByClassName('ant-table-scroll');
            const trList = table.length ? table[0].getElementsByClassName("ant-table-row") : [];
            const tableRight = document.getElementsByClassName('ant-table-fixed-right');
            const trFixList = tableRight.length ? tableRight[0].getElementsByClassName("ant-table-row") : [];
            for (let i = 0; i < trList.length; i++) {
                let flag = false
                const tr = trList[i];
                const tdList = tr.childNodes;
                for (let j = 0; j < tdList.length; j++) {
                    const td = tdList[j];
                    if (td && td.children.length > 0) {
                        if (td.children[0].classList.contains('bg-diff-left-single') ||
                            td.children[0].classList.contains('bg-diff-left-double') ||
                            td.children[0].classList.contains('bg-diff-right-single') ||
                            td.children[0].classList.contains('bg-diff-left-double')
                        ) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (!flag) {
                    tr.style.display = 'none';
                    if (trFixList[i]) {
                        trFixList[i].style.display = 'none';
                    }
                }
            }
        }

    }

    // onShowSizeChange = (page, pageSize) => {
    //     const { queryList } = this.props;
    //     if (queryList) {
    //         queryList({
    //             current: 1,
    //             pageSize: pageSize,
    //             paging: 1,
    //             total: -1,
    //         })
    //         this.setState({
    //             pageSize: pageSize,
    //             current: page,
    //         })
    //     }
    // }

    // onPagerChange = (page, pageSize) => {
    //     const { queryList } = this.props;
    //     if (queryList) {
    //         queryList({
    //             current: page,
    //             pageSize: pageSize,
    //             paging: 1,
    //             total: -1,
    //         })
    //         this.setState({
    //             pageSize: pageSize,
    //             current: page,
    //         })
    //     }
    // }

    handleTableChange = (pagination, filters, sorter) => {
        const { queryList } = this.props;
        const { order = '', field = '' } = sorter;
        if (queryList) {
            queryList({
                current: pagination.current,
                pageSize: pagination.pageSize,
                paging: 1,
                total: -1,
                sort: order? `${field.slice(-2)==='Mc'?field.slice(0,-2):field} ${order.slice(0,-3)}`:''
            })
        }
    };

    getName = (arr, text, key) => {
        let name = '';
        arr.forEach((item, index) => {
            const { ibm = '', note = '-' } = item;
            if (key === 'zhly') {
                const texts = text ? text.split(';') : [];

                texts.forEach((ele) => {
                    if (ele === ibm) {
                        if (name === '') {
                            name = note;
                        } else {
                            name = name + ';' + note;
                        }

                    }
                })
            } else {
                if (ibm === text) {
                    name = note
                    return
                }
            }

        })
        return name
    }

    handleModifyVisible = (record) => {
        const { changeSelectedRow } = this.props;
        if (changeSelectedRow) {
            changeSelectedRow(record);
        }
    }

    getColumns = () => {
        const { config = [], targetKeys = [], mockData = [], dictionary = {} } = this.props;
        const { ZYZHJYSC = [],
            ZYZHLYXT = [],
            ZYZHSYBM = [],
            ZYZHZHYT = [],
            ZYZHSYQK = [],
            ZYZHZHLY = [] } = dictionary;
        const option = [
            "jyscSc", "jyscLc", "lyxtSc", "lyxtLc", "sybmLc", "zhytLc", "syqkSc", "zhly"
        ]
        let columns = [];
        let keys = []
        mockData.forEach(element => {
            const { key = '', title = '' } = element;
            targetKeys.forEach((item, index) => {
                if (item === key && !keys.includes(key)) {
                    let temp = {
                        title: title,
                        dataIndex: key,
                        key: key,
                        sorter: true,
                        width: key === 'zqzh' ? '16rem' : '26rem'
                    };
                    temp.render = (text, record) => {
                        let dict = [];
                        const sccolums = Object.keys(config[0]);
                        const lccolums = Object.keys(config[1]);
                        let className = '';
                        let color = '#333';
                        if (sccolums.includes(key)) {
                            const scValue = record[key] || '-';
                            const lcValue = record[config[0][key]] || '-';
                            if (lcValue !== scValue) {
                                if ((index - 1) / 2 % 2 === 0) {
                                    className = 'bg-diff-left-single'
                                    // color = 'rgba(247, 137, 57, 1)'
                                    color = 'rgba(247, 80, 57, 1)'
                                } else {
                                    className = 'bg-diff-left-double'
                                    color = 'rgba(247, 80, 57, 1)'

                                }

                            }
                        }
                        if (lccolums.includes(key)) {
                            const lcValue = record[key] || '-';
                            const scValue = record[config[1][key]] || '-';

                            if (lcValue !== scValue) {
                                if (index / 2 % 2 === 0) {
                                    className = 'bg-diff-right-double'
                                    color = 'rgba(247, 80, 57, 1)'
                                } else {
                                    className = 'bg-diff-right-single'
                                    // color = 'rgba(247, 137, 57, 1)'
                                    color = 'rgba(247, 80, 57, 1)'
                                }
                            }
                        }

                        if (option.includes(key)) {

                            switch (key) {
                                case "jyscSc":
                                    dict = ZYZHJYSC;
                                    break;
                                case "jyscLc":
                                    dict = ZYZHJYSC;
                                    break;
                                case "lyxtSc":
                                    dict = ZYZHLYXT;
                                    break;
                                case "lyxtLc":
                                    dict = ZYZHLYXT;
                                    break;
                                case "sybmLc":
                                    dict = ZYZHSYBM;
                                    break;
                                case "zhytLc":
                                    dict = ZYZHZHYT;
                                    break;
                                case "syqkSc":
                                    dict = ZYZHSYQK;
                                    break;
                                case "zhly":
                                    dict = ZYZHZHLY;
                                    break;
                                default:
                                    break;
                            }
                            return (<div className={className}
                                title={key === "zhly" ? this.getName(dict, text, "zhly") : this.getName(dict, text, "")}
                                style={{
                                    // color: color ? color : '#333',
                                    color: color,
                                    fontWeight: color === '#333' ? 'normal' : 'bold',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>{key === "zhly" ? this.getName(dict, text, "zhly") : this.getName(dict, text, "")}</div>)
                        }
                        return (<div className={className}
                            title={text}
                            style={{
                                // color: key === 'zqzh' ? '#0073aa' : color ? color : '#333',
                                color: key === 'zqzh' ? '#0073aa' : color,
                                fontWeight: key === 'zqzh' || color === '#333' ? 'normal' : 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>{text}</div>)
                    };
                    columns.push(temp);
                    keys.push(key)
                }
            })
        });
        let tempOpr = {
            title: '操作',
            dataIndex: 'opr',
            key: 'opr',
            fixed: 'right',
            width: '15rem',
            align: 'center',
            render: (text, record) => {
                return <div className='opr-modify' onClick={() => { this.handleModifyVisible(record) }}>修改</div>
            }
        };
        columns.push(tempOpr);
        return columns
    }

    render() {
        const { loading } = this.state;
        const { isDiff = false, params = {}, data = [] } = this.props;
        const columns = this.getColumns();

        return (
            <div className='tradingunitlist-table-cont' style={{ marginBottom: isDiff && params.paging === 0 ? '5rem' : '0rem' }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{
                        x: `${columns.length * 20 - 5}rem`,
                        y: '62rem'
                    }}
                    // onRow={(record, index) => {
                    //     return {
                    //         onClick: event => {
                    //             const { selectedRowKeys: preIndex = '' } = this.state;
                    //             changeSelectedRow(record);
                    //             this.setState({
                    //                 selectedRowKeys: index
                    //             }, () => {
                    //                 const rows = document.getElementsByClassName("ant-table-row") || [];
                    //                 if (rows.length > index) {
                    //                     if (preIndex !== '') {
                    //                         rows[preIndex].classList.remove("select-rows")
                    //                     }
                    //                     rows[index].classList.add("select-rows")
                    //                 }
                    //             })

                    //         }
                    //     }
                    // }}
                    onChange={this.handleTableChange}
                    pagination={params.paging ? {
                        showQuickJumper: true,
                        showSizeChanger: true,
                        // onShowSizeChange: this.onShowSizeChange,
                        pageSize: params.pageSize,
                        current: params.current,
                        total: params.total,
                        showTotal: () => `共 ${params.total} 条`,
                        // onChange: this.onPagerChange,
                    } : false}
                />
            </div>
        );
    }
}

export default TradingUnitTableCont;