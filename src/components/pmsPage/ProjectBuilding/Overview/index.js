import React, { Component } from 'react'
import { Popover, message, Empty, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from "../../../Common/Encrypt";
import ddxm from '../../../../assets/projectBuilding/ddxm.png'
import ktxm from '../../../../assets/projectBuilding/ktxm.png'
import wcxm from '../../../../assets/projectBuilding/wcxm.png'
import xcxm from '../../../../assets/projectBuilding/xcxm.png'
import zbxm from '../../../../assets/projectBuilding/zbxm.png'
import zyxm from '../../../../assets/projectBuilding/zyxm.png'
import { QueryProjectGeneralInfo } from '../../../../services/pmsServices'

class Overview extends Component {
    state = {
        loading: true,
        list: []
    }

    fetchData = (name) => {
        const { role, orgid, order } = this.props;
        let queryType = '';
        let xmlxbq = name
        
        if (order === 0 || order === 1) {
            queryType = 'FC_XMLX'
        } else {
            queryType = 'FC_XMBQ'
            xmlxbq = name.slice(0,2)
        }
        this.setState({
            loading: true,
        })
        QueryProjectGeneralInfo({
            current: 1,
            pageSize: 10,
            paging: 0,
            sort: "",
            total: -1,
            xmlxbq: xmlxbq,
            org: orgid,
            queryType: queryType,
            role: role,
        }).then(res => {
            const { code = 0, note, xmxx } = res
            if (code > 0) {
                this.setState({
                    loading: false,
                    list: xmxx ? JSON.parse(xmxx) : []
                })
            } else {
                message.error(note)
                this.setState({
                    loading: false,
                })
            }
        }).catch(err => {
            message.error("查询" + name + "项目列表失败")
            this.setState({
                loading: false,
            })
        })
    }

    render() {
        const { data = {}, order = 0, routes = [] } = this.props;
        const { list = [], loading = false } = this.state;
        const { name = '-',
            total = 0,
            add = 0 } = data;

        let content = <div className={loading?'hover-cont loading-style':'hover-cont'}>
            {loading && <Spin />}
            {!loading && (list.length ?
                list.map((item, index) => {
                    const { XMMC: name = '', XMID: id = '' } = item;
                    return <div className='xm-item'><Link
                        className='opr-btn'
                        to={{
                            pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                                JSON.stringify({
                                    xmid: id,
                                }),
                            )}`,
                            state: {
                                routes: routes,
                            },
                        }}

                    >
                        {name}
                    </Link></div>
                })

                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

            )}
        </div >

        return (
            <div className='cont-block staff-overview' >
                <div className='basic-info'>
                    {order === 0 && <img src={zyxm} className='statistics-img' alt='' />}
                    {order === 1 && <img src={wcxm} className='statistics-img' alt='' />}
                    {order === 2 && <img src={zbxm} className='statistics-img' alt='' />}
                    {order === 3 && <img src={ddxm} className='statistics-img' alt='' />}
                    {order === 4 && <img src={xcxm} className='statistics-img' alt='' />}
                    {order === 5 && <img src={ktxm} className='statistics-img' alt='' />}
                    <div className='header-name'>
                        {name}
                        <div className='more' onClick={() => { this.fetchData(name) }}>
                            <Popover placement="bottomLeft" trigger="click" overlayClassName="main-tooltip" content={content} >
                                ···
                            </Popover>
                        </div>
                    </div>
                </div>
                <div className='total'>{total}</div>
                <div className='add'>
                    今日新增<span style={{ color: '#D70E19' }}> {add} </span>项
                </div>
            </div>
        );
    }
}

export default Overview;