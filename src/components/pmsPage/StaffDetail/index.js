import React, { Component } from 'react';
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import { message } from 'antd'
import { QueryAttachLibraryList } from '../../../services/pmsServices'

class StaffDetail extends Component {
    state = {
        attachList: [],
        pageParams: {
            current: 1,
            pageSize: 10,
            paging: 1,
            total: -1,
            sort: ''
        },
        tableLoading: false
    }

    componentDidMount() {
        this.handleSearch()
    }

    handleSearch = (params = {}) => {
        const { pageParams = {} } = this.state
        this.setState({
            tableLoading: true,
        })
        QueryAttachLibraryList({
            ...pageParams,
            ...params,
            total: -1,
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
                }else {
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
        const { tableLoading = false, attachList = [], pageParams } = this.state
        const { dictionary } = this.props;
        return (<div className="staff-detail-box">
            <TopConsole dictionary={dictionary} />
            <InfoTable tableData={attachList} tableLoading={tableLoading} pageParams={pageParams} handleSearch={this.handleSearch} />
        </div>);
    }
}
 
export default StaffDetail;