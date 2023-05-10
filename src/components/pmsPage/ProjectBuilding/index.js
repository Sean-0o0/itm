import React, { Component } from 'react'
import TopConsole from './TopConsole'
import Overview from './Overview'
import InfoTable from './InfoTable'
import { message } from 'antd'
import { QueryProjectGeneralInfo, QueryUserRole } from '../../../services/pmsServices'

class ProjectBuilding extends Component {
    state = {
        role: '普通人员',
        orgid: '',
        fxxx: [],
        jrxz: [],
        ryxx: [],
        xmxx: [],
        data: [{
            name: '自研项目',
            total: 0,
            add: 0
        }, {
            name: '外采项目',
            total: 0,
            add: 0
        }, {
            name: '专项项目',
            total: 0,
            add: 0
        }, {
            name: '迭代项目',
            total: 0,
            add: 0
        }, {
            name: '信创项目',
            total: 0,
            add: 0
        }, {
            name: '课题项目',
            total: 0,
            add: 0
        }],
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
        this.fetchRole();
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
                        this.queryProjectGeneralInfo('MX_ALL_ONE', '', pageParam)
                    })
                }
            }).catch(err => {
                message.error("查询人员角色失败")
            })
        }
    }

    queryProjectGeneralInfo = (queryType, xmzt, param) => {
        const { role, orgid, pageParam } = this.state;
        this.setState({
            tableLoading: true,
        })
        QueryProjectGeneralInfo({
            xmzt: xmzt,
            org: orgid,
            queryType: queryType,
            role: role,
            ...pageParam,
            ...param
        }).then(res => {
            const { code = 0, fxxx, jrxz, ryxx, xmxx, note, totalrows: total } = res
            if (code > 0) {
                if (queryType === 'MX_ALL_ONE') {
                    this.handleData(fxxx, ryxx, jrxz)
                    this.setState({
                        xmxx: JSON.parse(xmxx),
                        tableLoading: false,
                        pageParam: {
                            ...pageParam,
                            ...param,
                            total
                        }
                    })
                } else {
                    this.setState({
                        xmxx: JSON.parse(xmxx),
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
            message.error("查询项目列表失败")
            this.setState({
                tableLoading: false,
            })
        })
    }

    handleData = (fxxx, ryxx, jrxz) => {
        const zy = {
            name: '自研项目',
            total: 0,
            add: 0
        };
        const wc = {
            name: '外采项目',
            total: 0,
            add: 0
        };
        const zb = {
            name: '专班项目',
            total: 0,
            add: 0
        }
        const dd = {
            name: '迭代项目',
            total: 0,
            add: 0
        }
        const xc = {
            name: '信创项目',
            total: 0,
            add: 0
        }
        const kt = {
            name: '课题项目',
            total: 0,
            add: 0
        }
        const fxxxInfo = JSON.parse(fxxx);
        const ryxxInfo = JSON.parse(ryxx);
        const jrxzInfo = JSON.parse(jrxz);
        fxxxInfo.forEach(item => {
            const { BQNAME, XMSL } = item;
            switch (BQNAME) {
                case '迭代项目':
                    dd.total = Number.parseInt(XMSL);
                    break;
                case '信创项目':
                    xc.total = Number.parseInt(XMSL);
                    break;
                case '课题项目':
                    kt.total = Number.parseInt(XMSL);
                    break;
                default:
                    zb.total += Number.parseInt(XMSL);
                    break;
            }
        })
        ryxxInfo.forEach(item => {
            const { LXNAME, XMSL } = item;
            switch (LXNAME) {
                case '普通自研项目':
                    zy.total = Number.parseInt(XMSL);
                    break;
                default:
                    wc.total += Number.parseInt(XMSL);
                    break;
            }
        })
        const [one] = jrxzInfo;
        const keys = Object.keys(one||{});
        keys.forEach(item => {
            const XMSL = one[item]
            switch (item) {
                case 'JRZY':
                    zy.add = Number.parseInt(XMSL);
                    break;
                case 'JRWC':
                    wc.add = Number.parseInt(XMSL);
                    break;
                case 'JRZB':
                    zb.add = Number.parseInt(XMSL);
                    break;
                case 'JBDD':
                    dd.add = Number.parseInt(XMSL);
                    break;
                case 'JBXC':
                    xc.add = Number.parseInt(XMSL);
                    break;
                case 'JBKT':
                    kt.add = Number.parseInt(XMSL);
                    break;
                default:
                    break;
            }
        });
        this.setState({
            data:[
                zy,wc,zb,dd,xc,kt
            ]
        })
    }

    render() {
        const { routes } = this.props
        const { role = '',
            orgid = '',
            tableLoading,
            pageParam,
            data,
            xmxx = []
        } = this.state


        return (<div className="project-build-box cont-box">
            <TopConsole routes={routes} />
            <div className="overview-box">
                {data.map((item, index) => {
                    return <Overview routes={routes} role={role} orgid={orgid} key={index} data={item} order={index} />
                })
                }
            </div>
            <InfoTable xmxx={xmxx} routes={routes} role={role} pageParam={pageParam} tableLoading={tableLoading} fetchData={this.queryProjectGeneralInfo} />
        </div>);
    }
}

export default ProjectBuilding;