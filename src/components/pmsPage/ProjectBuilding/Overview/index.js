import React, { Component } from 'react'
import { Popover } from 'antd';
import { Link } from 'react-router-dom';
import { EncryptBase64 } from "../../../Common/Encrypt";
import ddxm from '../../../../assets/projectBuilding/ddxm.png'
import ktxm from '../../../../assets/projectBuilding/ddxm.png'
import wcxm from '../../../../assets/projectBuilding/ddxm.png'
import xcxm from '../../../../assets/projectBuilding/ddxm.png'
import zbxm from '../../../../assets/projectBuilding/ddxm.png'
import zyxm from '../../../../assets/projectBuilding/ddxm.png'

class Overview extends Component {
    state = {}

    render() {
        const { data = [], order = 0, routes = [] } = this.props;
        const list = [
            {
                id: '1',
                name: 'ADM备份回复验证软件'
            },
            {
                id: '1',
                name: 'ADM备份回复验证软件'
            },
            {
                id: '1',
                name: 'ADM备份回复验证软件'
            },
            {
                id: '1',
                name: 'ADM备份回复验证软件'
            },
            {
                id: '1',
                name: 'ADM备份回复验证软件'
            },
            {
                id: '1',
                name: 'ADM备份回复验证软件'
            }
        ]

        let content = <div className='hover-cont'>
            {list.map((item, index) => {
                const { name = '', id = '' } = item;
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
            })}
        </div>

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
                        {order === 0 && '自研项目'}
                        {order === 1 && '外采项目'}
                        {order === 2 && '专班项目'}
                        {order === 3 && '迭代项目'}
                        {order === 4 && '信创项目'}
                        {order === 5 && '课题项目'}
                        <div className='more'>
                            <Popover placement="bottomLeft" trigger="click" overlayClassName="main-tooltip" content={content} >
                                ···
                            </Popover>
                        </div>
                    </div>
                </div>
                <div className='total'>15</div>
                <div className='add'>
                    今日新增<span style={{ color: '#D70E19' }}>2</span>项
                </div>
            </div>
        );
    }
}

export default Overview;