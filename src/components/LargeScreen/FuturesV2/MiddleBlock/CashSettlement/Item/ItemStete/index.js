import React, { Component } from 'react'
//类型已完成 未完成等类型
export default class ItemStete extends Component {
	render() {
		const { item = {} } = this.props;
		let status = "未开始";
        let color = "rgb(170, 170, 170)";
		let backColor = "#11276F";
		let icon = 'icon_nostart.png';
		if (item.INDEXVALUE) {
			switch (item.INDEXVALUE) {
				case '0.0':
					break;
				case '1.0':
					status = "进行中";
					color = "#F7B432";
					backColor = "rgba(247, 180, 50, .7)";
					icon = 'icon_underway.png';
					break;
				case '2.0':
					status = "已完成";
					color = "#00ACFF";
					icon = 'icon_completed.png';
					break;
				case '3.0':
					status = "异常";
					color = "#d34643";
					backColor = "rgba(226, 60, 57, .7)";
					icon = 'icon_abnormal.png';
					break;
				default:
					break;
			}
		}
		return (
			<div className="flex1 fs22 flex-r h100" style={{color:'#C6E2FF',padding:'0rem 0rem 0rem 0.5rem'}}>
        {/*渐变色----background: `linear-gradient(90deg, ${backColor} 0%, rgba(17, 47, 111, 0) 100%)`*/}
				<div className=" flex1 flex-r fs20" style={{width:'30rem', padding: '0 1rem', margin: '1.7rem 1px', justifyContent: "space-between", borderRadius: '0.5rem',boxShadow: '0 0 1rem rgba(0, 172, 255, 0.6) inset',border: '1px solid rgba(0, 172, 255, 0.6)',
          position: 'relative' }}>
					<div className="flex1 flex-r" style={{lineHeight:'1.2', padding: '.2rem', alignItems: 'center',}}>{item.INDEXNAME?item.INDEXNAME:'-'}</div>
					<div className="flex-r" style={{alignItems: 'center',color: color, width: '10rem', flexDirection: 'row-reverse'}} > {status}<img className="data-item-img" src={[require(`../../../../../../../image/${icon}`)]} alt="" /></div>
				</div>
			</div>
		)
	}
}
