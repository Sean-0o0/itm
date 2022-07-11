import React, { Component } from 'react'
//金额
export default class index extends Component {
	render() {
		const { item = {}, unit = "亿元" } = this.props

		return (
			<div className="flex1 fs22 flex-r h100 FundSettlement" style={{color:'#C6E2FF',padding:'0rem 0rem 0rem 0.5rem'}}>
        {/*渐变色----background: 'linear-gradient(90deg, #11276F 0%, rgba(17, 47, 111, 0) 100%)'*/}
				<div className="flex1 flex-r fs20" style={{ padding: '0 1rem', margin: '1.7rem 1px', justifyContent: "space-between", borderRadius: '0.5rem',boxShadow: '0 0 1rem rgba(0, 172, 255, 0.6) inset',border: '1px solid rgba(0, 172, 255, 0.6)',
          position: 'relative' }}>
					<div className="flex1 flex-r" style={{lineHeight:'1.2', padding: '.2rem', alignItems: 'center',}}>{item.INDEXNAME?item.INDEXNAME:'-'}</div>
					<div className="blue1 wfb flex-r" style={{alignItems: 'center',width: '14rem',flexDirection: 'row-reverse'}}>{unit}<span style={{fontWeight:'bold', fontSize: '2rem'}}>{item.INDEXVALUE!==undefined?item.INDEXVALUE:'-'}&nbsp;</span></div>
				</div>
			</div>
		)
	}
}
