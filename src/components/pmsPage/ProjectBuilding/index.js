import React, { Component } from 'react'
import TopConsole from './TopConsole'
import Overview from './Overview'
import InfoTable from './InfoTable'
import { message } from 'antd'
import { QueryMemberOverviewInfo, QueryUserRole } from '../../../services/pmsServices'

class ProjectBuilding extends Component {
    state = {
        role: '',
        orgid: '',
        bmry: [],
        wbry: [],
        gwfb: [],
        bgxx: [],
        tableLoading: false,
        pageParam: {
            current: 1,
            pageSize: 10,
            paging: 1,
            sort: "",
            total: -1
        }
    }

    componentDidMount() {
        // this.fetchRole();
    }

    fetchRole = () => {
        const LOGIN_USERID = JSON.parse(sessionStorage.getItem("user"))?.id;
        if (LOGIN_USERID !== undefined) {
            QueryUserRole({
                userId: Number(LOGIN_USERID),
            }).then(res => {
                const { code = 0, role } = res
                if (code > 0) {
                    this.setState({
                        role: role,
                        orgid: JSON.parse(sessionStorage.getItem("user"))?.org
                    }, () => {
                        const { pageParam = {} } = this.state;
                        this.queryMemberOverviewInfo('MX_ALL_ONE', '', pageParam)
                    })
                }
            }).catch(err => {
                message.error("查询人员角色失败")
            })
        }
    }

    queryMemberOverviewInfo = (queryType, gwbm, param) => {
        const { role, orgid, pageParam } = this.state;
        this.setState({
            tableLoading: true,
        })
        QueryMemberOverviewInfo({
            org: orgid,
            orgStation: gwbm,
            queryType: queryType,
            role: role,
            ...param
        }).then(res => {
            const { code = 0, bmry, wbry, gwfb, bgxx, note, total } = res
            if (code > 0) {
                if (queryType === 'MX_ALL_ONE') {
                    this.setState({
                        bmry: JSON.parse(bmry),
                        wbry: JSON.parse(wbry),
                        gwfb: JSON.parse(gwfb),
                        bgxx: JSON.parse(bgxx),
                        tableLoading: false,
                        pageParam: {
                            ...pageParam,
                            ...param,
                            total
                        }
                    })
                } else {
                    this.setState({
                        bgxx: JSON.parse(bgxx),
                        tableLoading: false,
                        pageParam: {
                            ...pageParam,
                            ...param,
                            total
                        }
                    })
                }

            } else {
                message.error(note)
                this.setState({
                    tableLoading: false,
                })
            }
        }).catch(err => {
            message.error("查询人员列表失败")
            this.setState({
                tableLoading: false,
            })
        })
    }

    render() {
        const { routes } = this.props
        const { role = '',
            gwfb = [],
            bgxx = [],
            tableLoading,
            pageParam
        } = this.state
        const data = [{
            name: '自研项目',
            total: 15,
            add: 3
        },{
            name: '外采项目',
            total: 15,
            add: 3
        },{
            name: '专项项目',
            total: 15,
            add: 3
        },{
            name: '迭代项目',
            total: 15,
            add: 3
        },{
            name: '信创项目',
            total: 15,
            add: 3
        },{
            name: '课题项目',
            total: 15,
            add: 3
        }]

        return (<div className="project-build-box cont-box">
            <TopConsole routes={routes} />
            <div className="overview-box">
                {data.map((item, index)=>{
                    return <Overview key={index} data={item} order={index}/>
                })
                }
            </div>
            <InfoTable routes={routes} role={role} pageParam={pageParam} tableLoading={tableLoading} gwfb={gwfb} bgxx={bgxx} fetchData={this.queryMemberOverviewInfo} />
        </div>);
    }
}

export default ProjectBuilding;