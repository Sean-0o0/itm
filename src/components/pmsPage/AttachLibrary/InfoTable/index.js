import React, { Component } from 'react'
import { Button, Table, Popover, Empty, message, Pagination, Tooltip } from 'antd'
import HistoryAttach from './HistoryAttach'
import axios from 'axios';
import config from '../../../../utils/config';
import moment from 'moment';
import { EncryptBase64 } from "../../../Common/Encrypt";
import { Link } from 'react-router-dom';
import { InsertFileDownloadRecord, QueryAttachLibraryList } from '../../../../services/pmsServices'
const { api } = config;
const { pmsServices: { queryFileStream, zipLivebosFilesRowsPost } } = api;
const LOGIN_USER_NAME = JSON.parse(sessionStorage.getItem('user')).name;


class InfoTable extends Component {
    state = {
        modalVisible: false,
        record: {},
        selectedRows: [],
        selectedRowKeys: []
    }

    handleChange = (current, pageSize) => {
        const { handleSearch } = this.props;
        if (handleSearch) {
            handleSearch({
                current: current,
                pageSize: pageSize,
                total: -1,
            })
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        const { handleSearch } = this.props;
        const { order = '', field = '' } = sorter;
        if (handleSearch) {
            handleSearch({
                total: -1,
                sort: order ? `${field} ${order.slice(0, -3)}` : ''
            })
        }
    };

    handleModifyVisible = (record) => {
        this.setState({
            record: record,
            modalVisible: true
        })
    }

    closeModalVisible = () => {
        this.setState({
            modalVisible: false
        })
    }

    openVisible = () => {

    }

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
            //记录下载历史
            this.inSertHistorySingle(wdid);
        }).catch(err => {
            message.error(err)
        })
    }

    downlownRow = (items = [], wdid) => {
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
                //记录下载历史
                this.inSertHistorySingle(wdid);
            }).catch(err => {
                message.error(err)
            })
        });
    }

    //批量插入项目文档下载记录
    inSertHistoryBatch = (idArr = []) => {
      try {
        const promiseArr = idArr.map(x =>
          InsertFileDownloadRecord({
            fileId: Number(x),
            userName: LOGIN_USER_NAME,
          }),
        );
        Promise.all(promiseArr) 
      } catch (e) {
        console.error('🚀文档下载记录保存失败', e);
        message.error('文档下载记录保存失败', 1);
      }
    };

    //单个插入项目文档下载记录
    inSertHistorySingle = id => {
      InsertFileDownloadRecord({
        fileId: Number(id),
        userName: LOGIN_USER_NAME,
      }).catch(e => {
        console.error('🚀文档下载记录保存失败', e);
        message.error('文档下载记录保存失败', 1);
      });
    };


    downlownRows = () => {
        const { selectedRows } = this.state
        let param = {
            objectName: 'TWD_XM',
            columnName: 'DFJ',
            title: '文档库-' + moment().format('YYYYMMDD') + '.zip'
        }
        let attBaseInfos = []
        selectedRows.forEach((ele, index) => {
            const { wdid, wdmc } = ele;
            if (wdmc) {
                const list = JSON.parse(wdmc)
                const { items = [] } = list;
                items.forEach((item, index) => {
                    const [id, title] = item;
                    attBaseInfos.push({
                        id: id,
                        rowid: wdid,
                        title: title
                    })
                })
            }
        })
        param.attBaseInfos = attBaseInfos;
        if (attBaseInfos.length) {
            axios({
                method: 'POST',
                url: zipLivebosFilesRowsPost,
                responseType: 'blob',
                data: param
            }).then(res => {
                const href = URL.createObjectURL(res.data)
                const a = document.createElement('a')
                a.download = '文档库-' + moment().format('YYYYMMDD') + '.zip'
                a.href = href
                a.click()
                //批量记录下载历史
                this.inSertHistoryBatch(selectedRows.map(x => x.wdid));
            }).catch(err => {
                message.error(err)
            })
        } else {
            message.error('未选中文件！')
        }
    }

    onSelectHandle = (record, selected, selectedRow) => {
        const {selectedRowKeys, selectedRows} = this.state;
        let arr = [];
        let list = [];
        if (selected) {
            arr = Array.from(new Set([...selectedRowKeys, record.wdid]));
            list = Array.from(new Set([...selectedRows, record]));
        } else {
            arr = selectedRowKeys.filter(item => {
                return item !== record.wdid
            });
            list = selectedRows.filter(item => item.wdid !== record.wdid)
        }
        this.setState({selectedRowKeys: arr, selectedRows: list});
    }

    handleSearch = () => {
        const { pageParams = {}, cxlx } = this.props
        QueryAttachLibraryList({
            ...pageParams,
            paging: -1,
            cxlx
        })
            .then((res = {}) => {
                const { code, record = []} = res;
                if (code > 0) {
                    this.setState({
                        selectedRows: record,
                        selectedRowKeys: record.map(item=>item.wdid)
                    })
                }
            }).catch((e) => {
                message.error(!e.success ? e.message : e.note);
            });
    }

    onSelectAll = (selected, selectedRow, changeRows) => {
        if (selected) {
            this.handleSearch()
        } else {
            this.setState({
                selectedRows: [],
                selectedRowKeys: []
            })
        }
    }

    render() {
        const { tableLoading = false, tableData = [], pageParams = {}, pathname = '' } = this.props;
        const { selectedRowKeys = [], modalVisible = false, record, } = this.state;

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            getCheckboxProps: (record) => ({
                name: record.name,
            }),
            onSelect: (record, selected) => {
                this.onSelectHandle(record, selected)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.onSelectAll(selected, selectedRows, changeRows);
            }
        };

        const columns = [
            {
                title: '项目名称',
                dataIndex: 'xmmc',
                width: '14%',
                key: 'xmmc',
                ellipsis: true,
                render: (text, row, index) => {
                    const { xmid = '' } = row;
                    return <div >
                        <Tooltip title={text} placement="topLeft">
                        <Link
                            className='opr-btn'
                            to={{
                                pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                                    JSON.stringify({
                                        xmid: xmid,
                                    }),
                                )}`,
                                state: {
                                    routes: [{ name: '文档列表', pathname: pathname }],
                                },
                            }}

                        >
                            {text}
                        </Link>
                        </Tooltip>
                        </div>
                }
            },
            {
                title: '文档类型',
                dataIndex: 'wdlx',
                width: '15%',
                key: 'wdlx',
                ellipsis: true,
            },
            {
                title: '附件',
                dataIndex: 'wdmc',
                width: '23%',
                key: 'wdmc',
                ellipsis: true,
                render: (text, record) => {
                    if (text) {
                        const { wdid = '' } = record;
                        const wdmc = JSON.parse(text)
                        const { items = [] } = wdmc;
                        let content = <div className='fj-box'>
                            <div className='fj-header'>
                                <div className='fj-title flex1'>附件</div>
                                <div className='fj-header-btn' onClick={() => this.downlownRow(items, wdid)}>全部下载</div>
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
                width: '7%',
                key: 'bb',
                ellipsis: true,
            },
            {
                title: '上传人',
                dataIndex: 'scr',
                width: '9%',
                key: 'scr',
                ellipsis: true,
            },
            {
                title: '上传时间',
                dataIndex: 'scsj',
                width: '10%',
                key: 'scsj',
                ellipsis: true,
                sorter: true,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '备注',
                dataIndex: 'bz',
                width: '12%',
                key: 'bz',
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
                {modalVisible && <HistoryAttach record={record} modalVisible={modalVisible} closeModalVisible={this.closeModalVisible} />}
                <div className="btn-add-prj-box">
                    <Button type="primary" className="btn-add-prj" onClick={this.downlownRows}>
                        批量下载
                    </Button>
                </div>
                <div className="project-info-table-box">
                    <Table
                        loading={tableLoading}
                        columns={columns}
                        rowKey={'wdid'}
                        dataSource={tableData}
                        onChange={this.handleTableChange}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        pagination={false}
                    />
                </div>
                <div className='page-individual'>
                    {(pageParams.total!==-1&&pageParams.total!==0)&&<Pagination
                        onChange={this.handleChange}
                        onShowSizeChange={this.handleChange}
                        pageSize={pageParams.pageSize}
                        current={pageParams.current}
                        total={pageParams.total}
                        pageSizeOptions={['20', '40', '50', '100']}
                        showSizeChanger={true}
                        // hideOnSinglePage={true}
                        showQuickJumper={true}
                        showTotal={total => `共 ${total} 条数据`}
                    />}

                </div>
            </div>
        );
    }
}

export default InfoTable;