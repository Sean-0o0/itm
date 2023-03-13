import React, { Component } from 'react'
import { Button, Table } from 'antd'
import HistoryAttach from './HistoryAttach'

class InfoTable extends Component {
    state = {
        modalVisible: false,
        record: {}
    }
    handleTableChange = () => {

    }

    handleModifyVisible = (record) =>{
        this.setState({
            record: record,
            modalVisible: true
        })
    }

    closeModalVisible = () =>{
        this.setState({
            modalVisible: false
        })
    }

    openVisible = () =>{

    }

    render() {
        let { tableLoading = false, tableData = [] } = this.props;

        tableData = [
            {
                projectId: '1',
                projectName: '测试项目2423',
                attachType: '信委会议案',
                attach: '这是很长很长很长很长很长的一个附件很长的一个附件',
                version: '1.0',
                uploader: '张三',
                uploadTime: '20231201',
                remarks: '这是一段备注文字',
            }
        ] 
        const { modalVisible = false } = this.state;

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User',
                name: record.name,
            }),
        };

        const columns = [
            {
                title: '项目名称',
                dataIndex: 'projectName',
                width: '17%',
                key: 'projectName',
                ellipsis: true,
            },
            {
                title: '文档类型',
                dataIndex: 'attachType',
                width: '10%',
                key: 'attachType',
                ellipsis: true,
            },
            {
                title: '附件',
                dataIndex: 'attach',
                width: '23%',
                key: 'attach',
                ellipsis: true,
                render: (text, record) => {
                    if (record.lcId !== '-') {
                        return <div className='opr-btn' onClick={() => { this.handleModifyVisible(record)}} >{text}</div>
                    }
    
                }
            },
            {
                title: '版本',
                dataIndex: 'version',
                width: '7%',
                key: 'version',
                ellipsis: true,
            },
            {
                title: '上传人',
                dataIndex: 'uploader',
                width: '9%',
                key: 'uploader',
                ellipsis: true,
                sorter: true,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '上传时间',
                dataIndex: 'uploadTime',
                width: '10%',
                key: 'uploadTime',
                ellipsis: true,
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                width: '14%',
                key: 'remarks',
                ellipsis: true
            },
            {
                title: '操作',
                width: '10%',
                key: 'opr',
                render: (text, record) => {
                    if (record.lcId !== '-') {
                        return <div className='opr-btn' onClick={() => { this.handleModifyVisible(record) }}>查看历史</div>
                    }
    
                }
            },
        ];

        return (
            <div className="info-table">
                {modalVisible&&<HistoryAttach modalVisible={modalVisible} closeModalVisible={this.closeModalVisible} />}
                <div className="btn-add-prj-box">
                    <Button type="primary" className="btn-add-prj" onClick={this.openVisible}>
                        批量下载
                    </Button>
                </div>
                <div className="project-info-table-box">
                    <Table
                        loading={tableLoading}
                        columns={columns}
                        rowKey={'projectId'}
                        dataSource={tableData}
                        onChange={this.handleTableChange}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        pagination={{
                            pageSizeOptions: ['10', '20', '30', '40'],
                            showSizeChanger: true,
                            hideOnSinglePage: true,
                            showQuickJumper: true,
                            showTotal: total => `共 ${total} 条数据`,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default InfoTable;