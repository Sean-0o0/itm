import React from 'react'

export default function ContrastStatistic() {

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
                        <div className='data-contrast-num' style={{ color }}>{plusStr}{contrastNum}
                            <i className={'iconfont' + icon} style={{ fontSize: '2px' }}></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className='contrast-box'>
            {getContrastItem('项目数量', 1028, '个', 40, 1028, '个', 40)}
            {getContrastItem('总预算', 50000000, '万', 200)}
            {getContrastItem('队伍建设', 46, '人', -21)}
            {getContrastItem('项目数量', 1028, '个', 40)}
            {getContrastItem()}
        </div>
    )
}
