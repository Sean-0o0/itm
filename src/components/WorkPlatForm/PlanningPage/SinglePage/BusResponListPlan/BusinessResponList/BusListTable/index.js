import React from 'react';
import { connect } from 'dva'
import { Link } from 'dva/router';
import LBFrameModal from '../../../../../../Common/BasicModal/LBFrameModal'
import { FetchLivebosLink } from '../../../../../../../services/amslb/user'
import { Button, message, Table, Tooltip } from 'antd'
import { EncryptBase64 } from '../../../../../../Common/Encrypt'
class BusListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: [],
            selectedRowKeys: [],
            selectRows:[],

            deleteModalVisible: false,
            url: ''
        }
    }

    // handleEdit = (row) => {
    //     //console.log('点击行的row', row)
    //     if (row && row.planType && row.planType === '1' || row.planType === '2') {
    //         //console.log("跳转到业务条线或者高管页面")
    //     } else if (row && row.planType && row.planType === '3') {
    //         //console.log("跳转到职能部门")
    //     }
    // }

    fetchLBUrl = (e) => {
        FetchLivebosLink({
            method: 'TASSESS_PLAN_BASEINFO_DELETE',
            object: 'TASSESS_PLAN_BASEINFO',
            params: {
                PLANID: e
            },
        }).then((ret = {}) => {
            const { data = '' } = ret;
            if (data) {
                this.setState({
                    url: data,
                    deleteModalVisible: true
                });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    componentWillReceiveProps(nextProos) {
        const { selectedRowKeys } = this.state
        const { authorities: { busResponList = [] }, reload = false,headState } = nextProos
        const columns = [
            // {
            //     title: <span style={{ fontSize: '1.2rem' }}>考核对象</span>,
            //     dataIndex: 'orgName',
            //     width: 150,
            //     render: (text) => {
            //         return <span style={{ fontSize: '1.2rem' }}>{text}</span>
            //     }
            // },
            {
                title: <span style={{ fontSize: '1.2rem' }}>责任状名称</span>,
                dataIndex: 'planName',
                width: '22.5%',
                render: (text, row, index) => {
                    const param = { planId: row.planId, planType: row.planType,planStatus:row.status,headState:headState,rollback:true, }
                    return <Link to={'/esa/planning/busResponDetail/' + EncryptBase64(JSON.stringify(param))}>
                        <span style={{ color: '#40a9ff', fontSize: '1.2rem' }}>{text}</span>
                    </Link>
                }
            },
            // {
            //     title: <span style={{ fontSize: '1.2rem' }}>负责人</span>,
            //     dataIndex: 'headName',
            //     width: 100,
            //     render: (text) => {
            //         return <span style={{ fontSize: '1.2rem' }}>{text}</span>
            //     }
            // },
            {
                title: <span style={{ fontSize: '1.2rem' }}>状态</span>,
                dataIndex: 'statusName',
                width: '22.5%',
                render: (text) => {
                    return <span style={{ fontSize: '1.2rem' }}>{text}</span>
                }
            },
            {
                title: <span style={{ fontSize: '1.2rem' }}>当前执行人</span>,
                dataIndex: 'auditEmp',
                width: '22.5%',
                render: (text, row, index) => {
                    let temArr = ''
                    if (text.length > 10) {
                        temArr = text.substring(0, 7) + "..."
                    }
                    return <Tooltip placement="right" title={text}>
                        <span style={{ fontSize: '1.2rem' }}>{temArr !== '' ? temArr : text}</span>
                    </Tooltip>
                    // return <span>{text}</span>
                }
            },
          {
                title: <span style={{ fontSize: '1.2rem' }}>未沟通意见数</span>,
                dataIndex: 'noDealOpt',
                width: '22.5%',
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
                {/* 通过auths的busResponList数组以及该行的status字段共同决定是否具有按钮权限 */}
                {/* 判断是否具有修改权限 */}
                {busResponList.includes("busResponModify") &&
                row && row.planType && (Number(row.status) <= 3 && Number(row.status) !== -1) &&
                //planType   departmentAssessPlanModify
                < Link to={`/esa/planning/bussinessResponseModify/${EncryptBase64(JSON.stringify({ planId: Number(row.planId) }))}`} >
                  <Button className="fcbtn m-btn-border  m-btn-border-headColor btn-1c" size="small" >修改</Button>
                </Link>
                }
                {/* 判断是否具有删除权限 */}
                {/* {busResponList.includes("assessPlanDelete") && (Number(row.status) < 2 && Number(row.status) !== -1)
                            && <Button className="fcbtn m-btn-border  m-btn-border-headColor btn-1c" size="small" onClick={
                                (e) => { this.fetchLBUrl(row.planId) }}>删除</Button>} */}

                {busResponList.includes("busResponDelete") &&  Number(row.status) !== -1
                && <Button className="fcbtn m-btn-border  m-btn-border-headColor btn-1c" size="small" onClick={
                  (e) => { this.fetchLBUrl(row.planId) }}>删除</Button>}

              </div>
              return node
            },
          },
        ];

        this.setState({
            selectedRowKeys: reload ? [] : selectedRowKeys,
            columns,
        })
    }

    submitDelete = (messageObj) => {
        const { reloadTable } = this.props
        if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
            this.closeDeleteModal()
        } else { // 操作完成事件，对应 LiveBOS `operateCallback`
            this.closeDeleteModal()
            message.success('删除成功');
            reloadTable()
        }
    }

    closeDeleteModal = () => {
        this.setState({
            deleteModalVisible: false
        })
    }

    //拼接planId
    onSelectChange = (selectedRowKeys,selectedRows) => {
        const { data, handlePlanIdStr } = this.props
        let planIdStr = 'PLANID='
        //选择数据的状态
        let palnStatus = '';
      selectedRowKeys.forEach((item) => {
            planIdStr += item + ";"
        })
      selectedRows.forEach((item) => {
        palnStatus += item.status + ";"
      })
        this.setState({ selectedRowKeys }, () => {
          handlePlanIdStr(planIdStr,palnStatus)
        });
    }

    render() {
        const { columns = [], selectedRowKeys,selectedRows, deleteModalVisible, url } = this.state
        const { data } = this.props
        const rowSelection = {
            selectedRows,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <div style={{ marginTop: '1rem' }}>
                <Table
                    className="changeFontSize"
                    rowSelection={rowSelection} columns={columns} dataSource={data}
                    key={'1'}
                    rowKey={record => record.planId}
                    scroll={{ x: 1300 }}
                />
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
                        src: `${localStorage.getItem('livebos') || ''}${url}`,
                        onMessage: this.submitDelete,
                    }}
                />


            </div>

        );
    }
}
export default connect(({ global = {} }) => ({
    authorities: global.authorities,
}))(BusListTable);
