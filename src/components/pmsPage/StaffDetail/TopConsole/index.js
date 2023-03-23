import React, { Component } from 'react'
import { Link } from 'dva/router';
import { Breadcrumb } from 'antd'
import boyImg from '../../../../assets/staffDetail/img_boy.png';
import girlImg from '../../../../assets/staffDetail/img_girl.png';
import fqImg from '../../../../assets/staffDetail/img_fq.png';
import cyImg from '../../../../assets/staffDetail/img_cy.png';
import zbImg from '../../../../assets/staffDetail/img_zb.png';
import ktImg from '../../../../assets/staffDetail/img_kt.png';

class ToConsole extends Component {
    state = {
    }

    render() {
        const { routes = [],
            data: {
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
            } } = this.props;

        return (<div className="top-console">
            <div className="back-img">
                <Breadcrumb separator=">">
                    {routes.map((item, index) => {
                        const { name = item, pathname = '' } = item
                        const historyRoutes = routes.slice(0, index + 1)
                        return <Breadcrumb.Item>
                            {index === routes.length - 1 ? <Breadcrumb.Item>{name}</Breadcrumb.Item> :
                                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>
                                    {name}
                                </Link>}
                        </Breadcrumb.Item>
                    })

                    }
                </Breadcrumb>
                <div className='staff-info-header flex-r'>
                    <div className='header-left flex-r'>
                        <img src={boyImg} className='staff-img' />
                        <div className='staff-info-cont flex-c'>
                            <div className='staff-line-import'>
                                <span className='staff-name'>{rymc}</span>
                                <span className='staff-experience'>&nbsp;已加入浙商证券{jrts}天</span>
                            </div>
                            <div className='staff-line flex1 flex-r'>
                                <span className='staff-label'>营业部：</span>
                                <span className='staff-value'>{bm}</span>
                            </div>
                            <div className='staff-line flex1 flex-r'>
                                <span className='staff-label'>岗位：</span>
                                <span className='staff-value'>{gw}&nbsp;&nbsp;&nbsp;</span>
                                <span className='staff-label'>|&nbsp;&nbsp;&nbsp;电话：</span>
                                <span className='staff-value'>{dh}</span>
                            </div>
                        </div>
                    </div>
                    <div className='header-right flex-r flex1'>
                        <div className='statistics-block'>
                            <div className='statistics-label'>
                                <img src={fqImg} className='statistics-img' />
                                &nbsp;&nbsp;发起项目
                            </div>
                            <div className='statistics-value'>{fqxm}</div>
                        </div>
                        <div className='statistics-block'>
                            <div className='statistics-label'>
                                <img src={cyImg} className='statistics-img' />
                                &nbsp;&nbsp;参与项目
                            </div>
                            <div className='statistics-value'>{cyxm}</div>
                        </div>
                        <div className='statistics-block'>
                            <div className='statistics-label'>
                                <img src={zbImg} className='statistics-img' />
                                &nbsp;&nbsp;专班项目
                            </div>
                            <div className='statistics-value'>{zbxm}</div>
                        </div>
                        <div className='statistics-block'>
                            <div className='statistics-label'>
                                <img src={ktImg} className='statistics-img' />
                                &nbsp;&nbsp;课题项目
                            </div>
                            <div className='statistics-value'>{ktxm}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ToConsole;