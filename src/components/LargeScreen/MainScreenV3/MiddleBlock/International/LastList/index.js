import React, { Component } from 'react'

export class LastList extends Component {
    render() {
        return (
            <div className="flex1 flex-c" style={{ padding: '0 .5rem 0 1rem ' }}>
                <div className="flex1 flex-c" style={{ background: '#0b1a49', margin: '.5rem 0 0' }}>
                    <div className="flex1 flex-r" style={{paddingLeft:'1rem', alignItems: 'center', fontSize: '1.5rem'}}>穿仓客户数量 / 金额</div>
                    <div className="flex1 flex-r" style={{color: '#00ACFF', paddingLeft:'1rem', alignItems: 'center'}}><span style={{ fontSize: '1.833rem', fontWeight: 'bold' }}>5&nbsp;</span> 户 / <span style={{ fontSize: '1.833rem', fontWeight: 'bold' }}>&nbsp;2.23&nbsp;</span> 百万元</div>
                </div>
                <div className="flex1 flex-c" style={{ background: '#0b1a49', margin: '.5rem 0' }}>
                    <div className="flex1 flex-r" style={{paddingLeft:'1rem', alignItems: 'center', fontSize: '1.5rem'}}>达到强平状态客户数量 / 金额</div>
                    <div className="flex1 flex-r" style={{color: '#00ACFF', paddingLeft:'1rem', alignItems: 'center'}}><span style={{ fontSize: '1.833rem', fontWeight: 'bold' }}>5&nbsp;</span> 户 / <span style={{ fontSize: '1.833rem', fontWeight: 'bold' }}>&nbsp;2.23&nbsp;</span> 百万元</div>
                </div>
            </div>
        )
    }
}

export default LastList
