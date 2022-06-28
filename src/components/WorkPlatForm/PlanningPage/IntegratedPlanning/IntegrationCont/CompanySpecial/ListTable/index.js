import React from 'react';
import { connect } from 'dva'
import { Link } from 'dva/router';
import LBFrameModal from '../../../../../../Common/BasicModal/LBFrameModal'
import { FetchLivebosLink } from '../../../../../../../services/amslb/user'
import { Button, message, Table, Tooltip, Popover, Icon } from 'antd'
import { EncryptBase64 } from '../../../../../../Common/Encrypt'
class ListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: [],
            modModalVisible: false,
            deleteModalVisible: false,
            delUrl: '',
            modUrl: '',
        }
    }

    fetchLBDelUrl = (e) => {
        FetchLivebosLink({
            method: 'TSPECIAL_PLAN_DELETE',
            object: 'TSPECIAL_PLAN',
            params: {
                ID: e
            },
        }).then((ret = {}) => {
            const { data = '' } = ret;
            if (data) {
                this.setState({
                    delUrl: data,
                    deleteModalVisible: true
                });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    fetchLBModUrl = (e) => {
        FetchLivebosLink({
            method: 'TSPECIAL_PLAN_UPDATE',
            object: 'TSPECIAL_PLAN',
            params: {
                ID: e
            },
        }).then((ret = {}) => {
            const { data = '' } = ret;
            if (data) {
                this.setState({
                    modUrl: data,
                    modModalVisible: true
                });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    componentWillReceiveProps(nextProos) {
        const { authorities: { TSPECIAL_PLAN = [] } } = nextProos
        let columns = []
        if(TSPECIAL_PLAN.includes("TSPECIAL_PLAN_DELETE") || TSPECIAL_PLAN.includes("TSPECIAL_PLAN_UPDATE")){
            columns = [
                {
                    title: <span style={{ fontSize: '1.2rem' }}>年度</span>,
                    dataIndex: 'tyear',
                    width: '8%',
                    render: (text, row, index) => {
                        return <span style={{ fontSize: '1.2rem' }}>{text}</span>
    
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>主题</span>,
                    dataIndex: 'title',
                    // width: '22.5%',
                    render: (text, row, index) => {
                        const param = {
                            planId: row.tid,
                        }
                        return <Link to={'/esa/planning/CompanySpecialPlanning/' + EncryptBase64(JSON.stringify(param))}>
                            <span style={{ color: '#40a9ff', fontSize: '1.2rem' }}>{text}</span>
                        </Link>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>附件内容</span>,
                    dataIndex: 'remark',
                    width: '8%',
                    render: (text, row, index) => {
                        let files = JSON.parse(row.files);
                        let datas = files.items;
                        return <Popover content={datas.map((item) => {
                            return <p style={{ fontSize: '1.2rem' }}>
                                <a style={{ color: '#54A9DF' }} href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=FILES&PopupWin=false&Table=TSPECIAL_PLAN&operate=Download&Type=View&ID=${row.tid}&fileid=${item[0]}`}><Icon style={{ margin: '0 0.5rem' }} type="link" />{item[1]}
                                </a>
                            </p>;
                        })} title="附件列表">
                            <div style={{ color: '#54A9DF', fontSize: '1.2rem' }}>{datas.length}个附件</div>
                        </Popover>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>备注说明</span>,
                    dataIndex: 'remark',
                    // width: '22.5%',
                    render: (text, row, index) => {
                        let temArr = ''
                        if (text.length > 10) {
                            temArr = text.substring(0, 7) + "..."
                        }
                        return <Tooltip placement="right" title={text}>
                            <span style={{ fontSize: '1.2rem' }}>{temArr !== '' ? temArr : text}</span>
                        </Tooltip>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>操作人</span>,
                    dataIndex: 'opremp',
                    // width: '22.5%',
                    render: (text) => {
                        return <span style={{ fontSize: '1.2rem' }}>{text}</span>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>操作时间</span>,
                    dataIndex: 'oprtime',
                    // width: '22.5%',
                    render: (text) => {
                        return <span style={{ fontSize: '1.2rem' }}>{text}</span>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>操作</span>,
                    dataIndex: 'name',
                    width: '10%',
                    render: (text, row, index) => {
                        let node;
                        node = <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {
                                TSPECIAL_PLAN.includes("TSPECIAL_PLAN_UPDATE") &&
                                <Button className="fcbtn m-btn-border  m-btn-border-headColor btn-1c" size="small" onClick={
    
                                    (e) => {
                                        // console.log("row.tid", row.tid)
                                        this.fetchLBModUrl(row.tid)
                                    }}>修改</Button>
    
                            }
                            {
                                TSPECIAL_PLAN.includes("TSPECIAL_PLAN_DELETE") &&
                                <Button className="fcbtn m-btn-border  m-btn-border-headColor btn-1c" size="small" onClick={
                                    (e) => { this.fetchLBDelUrl(row.tid) }}>删除</Button>
                            }
                        </div>
                        return node
                    },
                },
            ];
        }else{
            columns = [
                {
                    title: <span style={{ fontSize: '1.2rem' }}>年度</span>,
                    dataIndex: 'tyear',
                    width: '8%',
                    render: (text, row, index) => {
                        return <span style={{ fontSize: '1.2rem' }}>{text}</span>
    
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>主题</span>,
                    dataIndex: 'title',
                    // width: '22.5%',
                    render: (text, row, index) => {
                        const param = {
                            planId: row.tid,
                        }
                        return <Link to={'/esa/planning/CompanySpecialPlanning/' + EncryptBase64(JSON.stringify(param))}>
                            <span style={{ color: '#40a9ff', fontSize: '1.2rem' }}>{text}</span>
                        </Link>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>附件内容</span>,
                    dataIndex: 'remark',
                    width: '8%',
                    render: (text, row, index) => {
                        let files = JSON.parse(row.files);
                        let datas = files.items;
                        return <Popover content={datas.map((item) => {
                            return <p style={{ fontSize: '1.2rem' }}>
                                <a style={{ color: '#54A9DF' }} href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=FILES&PopupWin=false&Table=TSPECIAL_PLAN&operate=Download&Type=View&ID=${row.tid}&fileid=${item[0]}`}><Icon style={{ margin: '0 0.5rem' }} type="link" />{item[1]}
                                </a>
                            </p>;
                        })} title="附件列表">
                            <div style={{ color: '#54A9DF', fontSize: '1.2rem' }}>{datas.length}个附件</div>
                        </Popover>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>备注说明</span>,
                    dataIndex: 'remark',
                    // width: '22.5%',
                    render: (text, row, index) => {
                        let temArr = ''
                        if (text.length > 10) {
                            temArr = text.substring(0, 7) + "..."
                        }
                        return <Tooltip placement="right" title={text}>
                            <span style={{ fontSize: '1.2rem' }}>{temArr !== '' ? temArr : text}</span>
                        </Tooltip>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>操作人</span>,
                    dataIndex: 'opremp',
                    // width: '22.5%',
                    render: (text) => {
                        return <span style={{ fontSize: '1.2rem' }}>{text}</span>
                    }
                },
                {
                    title: <span style={{ fontSize: '1.2rem' }}>操作时间</span>,
                    dataIndex: 'oprtime',
                    // width: '22.5%',
                    render: (text) => {
                        return <span style={{ fontSize: '1.2rem' }}>{text}</span>
                    }
                },
                // {
                //     title: <span style={{ fontSize: '1.2rem' }}>操作</span>,
                //     dataIndex: 'name',
                //     width: '10%',
                //     render: (text, row, index) => {
                //         let node;
                //         node = <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                //             {
                //                 TSPECIAL_PLAN.includes("TSPECIAL_PLAN_UPDATE") &&
                //                 <Button className="fcbtn m-btn-border  m-btn-border-headColor btn-1c" size="small" onClick={
    
                //                     (e) => {
                //                         // console.log("row.tid", row.tid)
                //                         this.fetchLBModUrl(row.tid)
                //                     }}>修改</Button>
    
                //             }
                //             {
                //                 TSPECIAL_PLAN.includes("TSPECIAL_PLAN_DELETE") &&
                //                 <Button className="fcbtn m-btn-border  m-btn-border-headColor btn-1c" size="small" onClick={
                //                     (e) => { this.fetchLBDelUrl(row.tid) }}>删除</Button>
                //             }
                //         </div>
                //         return node
                //     },
                // },
            ];
        }
        

        this.setState({
            columns,
        })
    }

    submitDelete = (messageObj) => {
        const { handleChange, title, year, } = this.props
        if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
            this.closeDeleteModal()
        } else { // 操作完成事件，对应 LiveBOS `operateCallback`
            this.closeDeleteModal()
            message.success('删除成功');
            handleChange(year, title)
        }
    }

    submitMod = (messageObj) => {
        const { handleChange, title, year, } = this.props
        if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
            this.closeModModal()
        } else { // 操作完成事件，对应 LiveBOS `operateCallback`
            this.closeModModal()
            message.success('修改成功');
            handleChange(year, title)
        }
    }

    closeDeleteModal = () => {
        this.setState({
            deleteModalVisible: false
        })
    }
    closeModModal = () => {
        this.setState({
            modModalVisible: false
        })
    }

    render() {
        const { columns = [], deleteModalVisible, modModalVisible, delUrl, modUrl } = this.state
        const { data } = this.props
        return (
            <div style={{ marginTop: '1rem' }}>
                {data.length > 0 ? <Table
                    className="changeFontSize"
                    columns={columns} dataSource={data}
                    key={'1'}
                    bodyStyle={{ minHeight: 'calc(100vh - 22.5rem)' }}
                    rowKey={record => record.tid}
                    scroll={{ x: 1300 }}
                /> : <Table
                    className="changeFontSize"
                    columns={columns} dataSource={data}
                    key={'1'}
                    // bodyStyle={{minHeight:'calc(100vh - 22.5rem)'}}
                    rowKey={record => record.tid}
                    scroll={{ x: 1300 }}
                />}
                <LBFrameModal
                    modalProps={{
                        style: { overflowY: 'auto', top: '10rem' },
                        destroyOnClose: true,
                        title: '删除',
                        width: '60rem',
                        height: '50rem',
                        visible: deleteModalVisible,
                        onCancel: this.closeDeleteModal,
                    }}
                    frameProps={{
                        height: '40rem',
                        src: `${localStorage.getItem('livebos') || ''}${delUrl}`,
                        onMessage: this.submitDelete,
                    }}
                />
                <LBFrameModal
                    modalProps={{
                        style: { overflowY: 'auto', top: '10rem' },
                        destroyOnClose: true,
                        title: '修改',
                        width: '60rem',
                        height: '50rem',
                        visible: modModalVisible,
                        onCancel: this.closeModModal,
                    }}
                    frameProps={{
                        height: '40rem',
                        src: `${localStorage.getItem('livebos') || ''}${modUrl}`,
                        onMessage: this.submitMod,
                    }}
                />


            </div>

        );
    }
}
export default connect(({ global = {} }) => ({
    authorities: global.authorities,
}))(ListTable);
