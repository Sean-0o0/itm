import React, { Component } from 'react'

class BudgetType extends Component {
    state = {}

    getAmountFormat = value => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    render() {
        const { wcz = '', wcl = '', mbz = '', syz = '', type = '', title = '-', remainLabel = '未立项' } = this.props;
        return (<div className='excute-detail' style={{ width: type === 'left' ? 'calc(50% - 36px)' : 'calc(100% - 48px)' }}>
            <div className='item-label'><i className="iconfont icon-money-dallar" />{title}</div>
            <div className='item-wc'><div style={{ flex: '1' }}>{this.getAmountFormat(wcz)}</div><div>{wcl + '%'}</div></div>
            <div className='item-process'><div className='jd' style={{ width: wcl + '%' }}></div></div>
            <div className='item-mb'><div style={{ flex: '1' }}>总数：{this.getAmountFormat(mbz)}</div><div>{remainLabel}：{this.getAmountFormat(syz)}</div></div>
        </div>);
    }
}

export default BudgetType;