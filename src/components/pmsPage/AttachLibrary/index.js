import React, { Component } from 'react'
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import { message } from 'antd'
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
        cxlx: 'FQCY',
        tableLoading: false
    }

    componentDidMount() {
        const LOGIN_USERID = JSON.parse(sessionStorage.getItem("user"))?.id;
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
                }
            })
        }
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState({
            pageParams: {
                ...this.state.pageParams,
                xmid: this.props.xmid
            }
        }, () => {
            this.handleSearch()
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
                        tableLoading: false,
                    })
                }
            }).catch((e) => {
                this.setState({
                    tableLoading: false,
                })
                message.error(!e.success ? e.message : e.note);
            });
    }

    render() {
        const { tableLoading = false, attachList = [], pageParams, cxlx } = this.state
        const { xmid } = pageParams
        const { dictionary, pathname } = this.props;
        return (<div className="attach-library-box">
            <TopConsole dictionary={dictionary} handleSearch={this.handleSearch} cxlx={cxlx} xmid={xmid} />
            <InfoTable pathname={pathname} tableData={attachList} tableLoading={tableLoading} pageParams={pageParams} handleSearch={this.handleSearch} />
        </div>);
    }
}

export default AttachLibrary;