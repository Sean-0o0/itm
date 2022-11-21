import React, { useState, useEffect, useRef } from 'react';
import XmbcTab from './xmbqTab';


export default function ProjectProfileTab() {
    const [currentTab, setCurrentTab] = useState('xmbq');
    
    const handleTabClick = (tab) => {
        console.log(tab);
        setCurrentTab(tab);
    };
    const tabActiveStyle = {
        color: '#fff',
        backgroundColor: '#3361FF',
        border: '0.1488rem solid #3361FF',
    };

    const getTabContent = (tab) => {
        const getXmbqTab = () => {
            return <XmbcTab/>;
        };
        const getLcbjdTab = () => {
            const getLcbItem = () => {
                return (
                    <div className='lcb-item'>
                        <img className='trapezoid' src={require('../../../../../image/pms/StatisticAnalysis/bg_trapezoid@2x.png')} alt=''></img>
                        <span className='lcb-item-txt'>{1}、{'市场及需求分析'}</span>
                        <span className='lcb-item-num'>15</span>
                    </div>
                );
            };
            const getIcon = (iconName, fontSize) => {
                return <i className={'iconfont icon-' + iconName} style={{ fontSize, color: '#bacaff', marginBottom: '2.232rem' }} />;
            };
            return (
                <div className='lcbjd-box'>
                    {getLcbItem()}
                    {getIcon('arrow-right1', '16px')}
                    {getLcbItem()}
                    {getIcon('arrow-right1', '16px')}
                    {getLcbItem()}
                    <i className='lcbjd-icon-down iconfont icon-arrow-down1' />
                    {getLcbItem()}
                    {getIcon('arrow-left1', '16px')}
                    {getLcbItem()}
                    {getIcon('arrow-left1', '16px')}
                    {getLcbItem()}
                </div>
            );
        };
        switch (tab) {
            case 'lcbjd':
                return getLcbjdTab();
            case 'xmbq':
                return getXmbqTab();
            default:
                return '';
        }
    };
    return (
        <div className='project-profile-box'>
            <div className='tab-top-box'>
                <div className='title'>项目概况</div>
                <div className='tab-btn-box'>
                    <div className='tab-btn-left'
                        style={currentTab === 'lcbjd' ? tabActiveStyle : {}}
                        onClick={() => handleTabClick('lcbjd')}>里程碑进度</div>
                    <div className='tab-btn-right'
                        style={currentTab === 'xmbq' ? tabActiveStyle : {}}
                        onClick={() => handleTabClick('xmbq')}>项目标签</div>
                </div>
            </div>
            <div className='tab-content-box'>
                {getTabContent(currentTab)}
            </div>
        </div>
    )
}
