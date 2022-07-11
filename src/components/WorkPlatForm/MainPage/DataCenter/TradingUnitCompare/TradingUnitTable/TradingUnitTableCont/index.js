import React from 'react';
import { Table } from 'antd';

class TradingUnitTableCont extends React.Component {
    state = {
        loading: false,
        pageParam: {
            selectedRow: {},
            selectedRowKeys: '',
        }
    }

    onShowSizeChange = (page, pageSize) => {
        const { queryList } = this.props;
        if (queryList) {
            queryList({
                current: 1,
                pageSize: pageSize,
                paging: 1,
                total: -1,
            })
        }
    }

    onPagerChange = (page, pageSize) => {
        const { queryList } = this.props;
        if (queryList) {
            queryList({
                current: page,
                pageSize: pageSize,
                paging: 1,
                total: -1,
            })
        }
    }

    getDiffColumns = () => {
        const { config = [], targetKeys = [], mockData = [] } = this.props;
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
                        width: key === 'mkucode' ? '19rem' : '26rem'
                    };
                    temp.render = (text, record) => {
                        const sccolums = Object.keys(config[0]);
                        const lccolums = Object.keys(config[1]);
                        let className = '';
                        let color = '#333';
                        if (sccolums.includes(key)) {
                            const scValue = record[key] || '';
                            const lcValue = record[config[0][key]] || '';
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
                            const lcValue = record[key] || '';
                            const scValue = record[config[1][key]] || '';

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

                        return (<div className={className}
                            title={text}
                            style={{
                                // color: key === 'zqzh' ? '#0073aa' : color ? color : '#333',
                                color: key === 'mkucode' ? '#0073aa' : color,
                                fontWeight: key === 'mkucode' || color === '#333' ? 'normal' : 'bold',
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
        return columns
    }

    getColumns = () => {
        const { targetKeys = [], mockData = [] } = this.props;
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
                        width: key === 'mkucode' ? '19rem' : '26rem'
                    };
                    temp.render = (text, record) => {
                        return (<div
                            title={text}
                            style={{
                                color: key === 'mkucode' ? '#0073aa' : '#333',
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
        return columns
    }

    render() {

        const { params = {}, data = [], isDiff = false } = this.props;
        let columns = [];
        if(isDiff){
            columns = this.getDiffColumns();
        }else{
            columns = this.getColumns();
        }
        

        return (
            <div className='tradingunitlist-table-cont'>
                <Table
                    columns={columns}
                    dataSource={data}
                    // loading={loading}
                    scroll={{
                        x: `${columns.length*20-5}rem`,
                        y: '62rem'
                    }}
                    pagination={ {
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                        pageSize: params.pageSize,
                        current: params.current,
                        total: params.total,
                        // total: data.length,
                        showTotal: () => `共 ${params.total} 条`,
                        onChange: this.onPagerChange,
                    }}
                />
            </div>
        );
    }
}

export default TradingUnitTableCont;