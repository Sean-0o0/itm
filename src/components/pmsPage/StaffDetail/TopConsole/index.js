import React, { Component } from 'react'
import { Route } from 'dva/router';
import { Breadcrumb } from 'antd'
import boyImg from '../../../../assets/staffDetail/img_boy.png';
import girlImg from '../../../../assets/staffDetail/img_girl.png';

class ToConsole extends Component {
    state = {
    }

    render() {

        return (<div className="top-console">
            <div className="back-img">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <a href="">首页</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">项目列表</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="">项目详情</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>人员详情</Breadcrumb.Item>
                </Breadcrumb>
                <div className='staff-info-header flex-r'>
                    <div className='header-left flex-r'>
                        <img src={boyImg} className='staff-img'/>
                        <div className='staff-info-cont flex-c'>
                            <div className='staff-line-import'>
                                <span className='staff-name'>王建军</span>
                                <span className='staff-experience'>&nbsp;已加入浙商证券999天</span>
                            </div>
                            <div className='staff-line flex1 flex-r'>
                                <span className='staff-label'>营业部：</span>
                                <span className='staff-value'>上海南京路营业部</span>
                            </div>
                            <div className='staff-line flex1 flex-r'>
                                <span className='staff-label'>岗位：</span>
                                <span className='staff-value'>项目经理&nbsp;&nbsp;</span>
                                <span className='staff-label'>|&nbsp;&nbsp;电话：</span>
                                <span className='staff-value'>18758954454</span>
                            </div>
                        </div>
                    </div>
                    <div className='header-right'>

                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ToConsole;