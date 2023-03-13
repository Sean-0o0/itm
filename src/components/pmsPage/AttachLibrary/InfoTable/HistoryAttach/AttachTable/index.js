import React, { Component } from 'react'
import { Table } from 'antd'

class AttachTable extends Component {
    state = {}
    render() {
        const { tableLoading = false } = this.props;
        const tableData = [{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.1',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.2',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.3',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        },
        {
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        },{
            attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
        }]
        const columns = [
        {
            title: '附件',
            dataIndex: 'attach',
            width: '40%',
            key: 'attach',
            ellipsis: true,
            // render: (text, record) => {
            //     if (record.lcId !== '-') {
            //         return <div className='opr-btn'>{text}</div>
            //     }

            // }
        },
        {
            title: '版本',
            dataIndex: 'version',
            width: '10%',
            key: 'version',
            ellipsis: true,
        },
        {
            title: '上传人',
            dataIndex: 'uploader',
            width: '10%',
            key: 'uploader',
            ellipsis: true,
        },
        {
            title: '上传时间',
            dataIndex: 'uploadTime',
            width: '20%',
            key: 'uploadTime',
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
                    return <div className='opr-btn' onClick={() => { this.handleModifyVisible(record) }}>下载</div>
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