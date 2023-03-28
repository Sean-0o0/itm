import React, { Component } from 'react';
import TopConsole from './TopConsole'
import InfoTable from './InfoTable'
import { message } from 'antd'
import { QueryMemberDetailInfo } from '../../../services/pmsServices'

class StaffDetail extends Component {
    state = {
        xmxx: '-', //项目列表
        bm: '-',//部门
        cyxm: '-',//参与项目
        dh: '-',//电话
        fqxm: '-',//发起项目
        gw: '-',//岗位
        jrts: '-',//加入天数
        ktxm: '-',//课题项目
        rymc: '-',//人员名称
        xb: '-',//性别
        zbxm: '-',//专班项目
        attachList: [],
        tableLoading: false,
        pageParams: {
            current: 1,
            pageSize: 10,
            paging: 1,
            total: -1,
            sort: '',
        },
    }

    componentDidMount() {
        const { ryid } = this.props;
        this.handleSearch({}, ryid)
    }

    componentWillReceiveProps(nextProps) {
        const { ryid } = nextProps
        this.setState({
            xmxx: '-', //项目列表
            bm: '-',//部门
            cyxm: '-',//参与项目
            dh: '-',//电话
            fqxm: '-',//发起项目
            gw: '-',//岗位
            jrts: '-',//加入天数
            ktxm: '-',//课题项目
            rymc: '-',//人员名称
            xb: '-',//性别
            zbxm: '-',//专班项目
            pageParams: {
                current: 1,
                pageSize: 10,
                paging: 1,
                total: -1,
                sort: '',
                ryid
            }
        }, () => {
            this.handleSearch({}, ryid)
        })
    }

    handleSearch = (params = {}, ryid) => {
        const { pageParams = {} } = this.state
        this.setState({
            tableLoading: true,
        })
        let param = {
            ...pageParams,
            ...params,
            total: -1
        }
        if(ryid){
            param = {
                ...param,
                ryid
            }
        }
        QueryMemberDetailInfo(param)
            .then((res = {}) => {
                const { code = 0,
                    xmxx, //项目列表
                    bm,//部门
                    cyxm,//参与项目
                    dh,//电话
                    fqxm,//发起项目
                    gw,//岗位
                    jrts,//加入天数
                    ktxm,//课题项目
                    rymc,//人员名称
                    xb,//性别
                    zbxm,//专班项目
                    totalrows = 0
                } = res;
                if (code > 0) {
                    this.setState({
                        attachList: [...JSON.parse(xmxx)],
                        xmxx, //项目列表
                        bm,//部门
                        cyxm,//参与项目
                        dh,//电话
                        fqxm,//发起项目
                        gw,//岗位
                        jrts,//加入天数
                        ktxm,//课题项目
                        rymc,//人员名称
                        xb,//性别
                        zbxm,//专班项目
                        tableLoading: false,
                        pageParams: {
                            ...pageParams,
                            ...params,
                            total: totalrows,
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
        const { xmxx = '-', //项目列表
            bm = '-',//部门
            cyxm = '-',//参与项目
            dh = '-',//电话
            fqxm = '-',//发起项目
            gw = '-',//岗位
            jrts = '-',//加入天数
            ktxm = '-',//课题项目
            rymc = '-',//人员名称
            xb = '-',//性别
            zbxm = '-',//专班项目
            tableLoading = false,
            attachList = [],
            pageParams = {}
        } = this.state
        const { routes, ryid } = this.props

        return (<div className="staff-detail-box">
            <TopConsole
                routes={routes}
                data={{
                    xmxx, //项目列表
                    bm,//部门
                    cyxm,//参与项目
                    dh,//电话
                    fqxm,//发起项目
                    gw,//岗位
                    jrts,//加入天数
                    ktxm,//课题项目
                    rymc,//人员名称
                    xb,//性别
                    zbxm,//专班项目
                }}
            />
            <InfoTable ryid={ryid} tableData={attachList} pageParams={pageParams} tableLoading={tableLoading} routes={routes} handleSearch={this.handleSearch} />
        </div>);
    }
}

export default StaffDetail;