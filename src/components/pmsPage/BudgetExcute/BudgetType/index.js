import React, { Component } from 'react'

class BudgetType extends Component {
    state = {}
    render() {
        const { wcz='', wcl='', mbz='', syz='', type = '', title='-' } = this.props;
        return (<div className='excute-detail' style={{width:type==='left'?'calc(50% - 36px)':'calc(100% - 48px)'}}>
            <div className='item-label'><i className="iconfont icon-money-dallar" />{title}</div>
            <div className='item-wc'><div style={{flex: '1'}}>{wcz}</div><div>{wcl+'%'}</div></div>
            <div className='item-process'><div className='jd' style={{width: wcl+'%'}}></div></div>
            <div className='item-mb'><div style={{flex:'1'}}>目标：{mbz}</div><div>剩余：{syz}</div></div>
        </div>);
    }
}

export default BudgetType;