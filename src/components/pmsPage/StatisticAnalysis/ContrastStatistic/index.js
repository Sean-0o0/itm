import React, { useEffect, useRef, useState } from 'react';

export default function ContrastStatistic(props) {
    const { constrastData } = props;
    const { xmsl, xmsljqn, zys, zysjqn, kzxys, kzxysjqn, dwjs, dwjsjqn, wbry, wbryjqn } = constrastData

    const getContrastItem = (dataTxt = '--', dataNum = '--', unit = '', contrastNum = '--') => {
        dataNum = `${dataNum}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        contrastNum = contrastNum === 0 ? '--' : contrastNum;
        const plusStr = contrastNum > 0 ? '+' : '';
        const icon = contrastNum > 0 ? ' icon-rise' : contrastNum < 0 ? ' icon-fall' : '';
        const color = contrastNum > 0 ? '#F06270' : contrastNum < 0 ? '#46CB9F' : '#909399';
        return (
            <div className='contrast-item'>
                <div className='contrast-item-txt'>{dataTxt}</div>
                <img className='trapezoid' src={require('../../../../image/pms/StatisticAnalysis/bg_trapezoid@2x.png')} alt=''></img>
                <div className='contrast-item-data'>
                    <div className='data-txt' style={dataNum === '--' ? { alignItems: 'center' } : {}}>
                        <div className='data-txt-num'>{dataNum}</div>
                        {unit}
                    </div>
                    <div className='data-contrast'>较去年:
                        <div className='data-contrast-num' style={{ color }}>{plusStr}{contrastNum}</div>
                        <i className={'iconfont' + icon} style={{ color, fontSize: '2px' }}></i>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className='contrast-box'>
            {getContrastItem('项目数量', xmsl, '个', xmsljqn)}
            {getContrastItem('总预算', zys / 10000, '万', zysjqn / 10000)}
            {getContrastItem('可执行预算', kzxys / 10000, '万', kzxysjqn / 10000)}
            {getContrastItem('队伍建设', dwjs, '人', dwjsjqn)}
            {getContrastItem('外部人员', wbry, '人', wbryjqn)}
        </div>
    )
}
