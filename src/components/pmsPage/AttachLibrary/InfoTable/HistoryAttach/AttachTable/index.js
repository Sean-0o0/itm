import React, { Component } from 'react'
import { Table, Popover, Empty, message } from 'antd'
import axios from 'axios';
import config from '../../../../../../utils/config';
import moment from 'moment';
const { api } = config;
const { pmsServices: { queryFileStream } } = api;

class AttachTable extends Component {
    state = {}

    handleTableChange = (pagination, filters, sorter) => {
        const { handleSearch } = this.props;
        const { order = '', field = '' } = sorter;
        if (handleSearch) {
            handleSearch({
                current: pagination.current,
                pageSize: pagination.pageSize,
                paging: 1,
                total: -1,
                sort: order ? `${field} ${order.slice(0, -3)}` : ''
            })
        }
    };

    downlown = (id, title, wdid) => {
        axios({
            method: 'POST',
            url: queryFileStream,
            responseType: 'blob',
            data: {
                objectName: 'TWD_XM',
                columnName: 'DFJ',
                id: wdid,
                title: title,
                extr: id
            }
        }).then(res => {
            const href = URL.createObjectURL(res.data)
            const a = document.createElement('a')
            a.download = title
            a.href = href
            a.click()
        }).catch(err => {
            message.error(err)
        })
    }

    downlownRow = (record = {}) => {
        const { wdid = '', fj = '' } = record;
        if (fj) {
            const list = JSON.parse(fj)
            const { items = [] } = list;
            items.forEach(element => {
                const [id, title] = element;
                axios({
                    method: 'post',
                    url: queryFileStream,
                    responseType: 'blob',
                    data: {
                        objectName: 'TWD_XM',
                        columnName: 'DFJ',
                        id: wdid,
                        title: title,
                        extr: id
                    }
                }).then(res => {
                    const href = URL.createObjectURL(res.data)
                    const a = document.createElement('a')
                    a.download = title
                    a.href = href
                    a.click()
                }).catch(err => {
                    message.error(err)
                })
            });
        } else {
            message.error('未选中文件！')
        }
    }

    render() {
        const { tableLoading = false, tableData = [], pageParams = {} } = this.props;

        const columns = [
            {
                title: '附件',
                dataIndex: 'fj',
                width: '40%',
                key: 'fj',
                ellipsis: true,
                render: (text, record) => {
                    if (text) {
                        const { wdid = '' } = record;
                        const wdmc = JSON.parse(text)
                        const { items = [] } = wdmc;
                        let content = <div className='fj-box'>
                            <div className='fj-header'>
                                <div className='fj-title flex1'>附件</div>
                                <div className='fj-header-btn' onClick={() => this.downlownRow(record)}>全部下载</div>
                            </div>
                            {items.length ?
                                <div
                                    style={{ height: 'auto', width: 320 }}
                                >
                                    {items.map((item, index) => {
                                        const [id, title] = item;
                                        return <div className='fj-item flex-r'>
                                            <div className='fj-title flex1'><i className='iconfont icon-file-word' />&nbsp;{title}</div>
                                            <div className='fj-btn' onClick={() => this.downlown(id, title, wdid)}><i className='iconfont icon-download' /></div>
                                        </div>
                                    })
                                    }
                                </div> :
                                <div className='empty-box'><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无风险信息" /></div>

                            }
                        </div>
                        return <Popover placement="bottomLeft" overlayClassName="main-tooltip" content={content} >
                            <div className='opr-btn-box'>
                                {
                                    items.map((item, index) => {
                                        const [id, title] = item;
                                        return <a key={id} className='opr-btn' onClick={() => { this.downlown(id, title, wdid) }}>{title};&nbsp;</a>
                                    })
                                }
                            </div>
                        </Popover>
                    } else {
                        return ''
                    }
                }
            },
            {
                title: '版本',
                dataIndex: 'bb',
                width: '10%',
                key: 'bb',
                ellipsis: true,
            },
            {
                title: '上传人',
                dataIndex: 'scr',
                width: '10%',
                key: 'scr',
                ellipsis: true,
            },
            {
                title: '上传时间',
                dataIndex: 'scsj',
                width: '20%',
                key: 'scsj',
                ellipsis: true,
                sorter: true,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '操作',
                width: '20%',
                key: 'opr',
                render: (text, record) => {
                    if (record.lcId !== '-') {
                        return <div className='opr-btn' onClick={() => { this.downlownRow(record) }}>下载</div>
                    }

                }
            }]

        return (<div className="table-box">
            <Table
                loading={tableLoading}
                columns={columns}
                rowKey={'projectId'}
                dataSource={tableData}
                onChange={this.handleTableChange}
                pagination={{
                    pageSize: pageParams.pageSize,
                    current: pageParams.current,
                    total: pageParams.total,
                    pageSizeOptions: ['10', '20', '30', '40'],
                    showSizeChanger: true,
                    hideOnSinglePage: true,
                    showQuickJumper: true,
                    showTotal: total => `共 ${total} 条数据`,
                }}
            />
        </div>);
    }
}

export default AttachTable;