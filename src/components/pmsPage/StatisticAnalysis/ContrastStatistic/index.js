import React from 'react'

export default function ContrastStatistic() {
    const getContrastItem = () => {
        return (
            <div className='contrast-item'>
                <div className='contrast-item-txt'>项目数量</div>
                <img className='trapezoid' src={require('../../../../image/pms/StatisticAnalysis/bg_trapezoid@2x.png')} alt=''></img>
                <div className='contrast-item-data'>
                    <div className='data-txt'>
                        <div className='data-txt-num'>1028</div>
                        个
                    </div>
                    <div className='data-contrast'>较去年:
                        {/*绿色 #46CB9F */}
                        <div className='data-contrast-num' style={{color: '#F06270'}}>+200
                            <i className='iconfont icon-rise' style={{ fontSize: '2px' }}></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className='contrast-box'>
            {getContrastItem()}
            {getContrastItem()}
            {getContrastItem()}
            {getContrastItem()}
            {getContrastItem()}
        </div>
    )
}
