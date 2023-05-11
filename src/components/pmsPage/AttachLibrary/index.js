import React, { Component } from 'react'
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import { message, Spin } from 'antd'
import { QueryAttachLibraryList, QueryUserRole } from '../../../services/pmsServices'

class AttachLibrary extends Component {
    state = {
        attachList: [],
        pageParams: {
            current: 1,
            pageSize: 20,
            paging: 1,
            total: -1,
            sort: '',
        },
        cxlx: '',
        loading: false,
        tableLoading: false
    }

    componentDidMount() {
        const LOGIN_USERID = JSON.parse(sessionStorage.getItem("user"))?.id;
        this.setState({
            loading: true
        })
        if (LOGIN_USERID !== undefined) {
            QueryUserRole({
                userId: Number(LOGIN_USERID),
            }).then(res => {
                const { code = 0, role } = res
                if (code > 0) {
                    this.setState({
                        cxlx: role === '普通人员' ? 'FQCY' : 'BM'
                    }, () => {
                        this.handleSearch()
                    })
                }else{
                    this.setState({
                        loading: false
                    })
                }
            }).catch(err => {
                message.error("查询人员角色失败")
                this.setState({
                    loading: false
                })
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextprops) {
        const { xmid } = nextprops
        this.setState({
            pageParams: {
                ...this.state.pageParams,
                xmid: xmid
            }
        }, () => {
            // if(xmid!==oldXmid){
                this.handleSearch()
            // }
        })

    }

    handleSearch = async (params = {}) => {
        const { pageParams = {}, cxlx } = this.state
        this.setState({
            tableLoading: true,
            pageParams: {
                ...pageParams,
                ...params
            }
        })

        QueryAttachLibraryList({
            ...pageParams,
            ...params,
            total: -1,
            cxlx
        })
            .then((res = {}) => {
                const { code, record = [], total = 0 } = res;
                if (code > 0) {
                    this.setState({
                        loading: false,
                        attachList: record,
                        tableLoading: false,
                        pageParams: {
                            ...pageParams,
                            ...params,
                            total,
                        }
                    })
                } else {
                    this.setState({
                        loading: false,
                        tableLoading: false,
                    })
                }
            }).catch((e) => {
                this.setState({
                    loading: false,
                    tableLoading: false,
                })
                message.error(!e.success ? e.message : e.note);
            });
    }

    render() {
        const { tableLoading = false, attachList = [], pageParams, cxlx, loading } = this.state
        const { xmid } = pageParams
        const { dictionary, pathname } = this.props;
        return (<Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large"><div className="attach-library-box">
            <TopConsole  dictionary={dictionary} handleSearch={this.handleSearch} cxlx={cxlx} xmid={xmid} setSpin={(loading)=>{this.setState({loading})}}/>
            <InfoTable cxlx={cxlx} pathname={pathname} tableData={attachList} tableLoading={tableLoading} pageParams={pageParams} handleSearch={this.handleSearch} />
        </div></Spin>);
    }
}

export default AttachLibrary;