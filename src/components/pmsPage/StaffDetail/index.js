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
        tableLoading: false
    }

    componentDidMount() {
        this.handleSearch()
    }

    handleSearch = () => {
        this.setState({
            tableLoading: true,
        })
        QueryMemberDetailInfo({})
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
                    zbxm//专班项目
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
            attachList = [] } = this.state
        const { routes } = this.props

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
            <InfoTable tableData={attachList} tableLoading={tableLoading} routes={routes} />
        </div>);
    }
}

export default StaffDetail;