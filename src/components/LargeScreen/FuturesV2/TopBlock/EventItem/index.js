import React, { Component } from 'react'
import LeftBlock from '../../../InternationalV2/LeftBlock';

export default class EventItem extends Component {
	render() {
		const { item = {} } = this.props
		let status = "未开始";
        let color = "rgb(170, 170, 170)";
		let backColor = "#11276F";
		let icon = 'icon_nostart.png';
		if (item.STATE) {
			switch (item.STATE) {
				case '0':
					break;
				case '1':
					status = "进行中";
					color = "#F7B432";
					backColor = "rgba(247, 180, 50, .7)";
					icon = 'icon_underway.png';
					break;
				case '2':
					status = "已完成";
					color = "#00ACFF";
					icon = 'icon_completed.png';
					break;
				case '3':
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
			<div className="fs22 flex1 flex-r wid100" style={{fontWeight: '600'}}>
        {/*渐变色----background: `linear-gradient(90deg, ${backColor} 0%, rgba(17, 47, 111, 0) 100%)`*/}
				<div className="flex-r fs20 flex1" style={{ margin: '1.2rem 1px',padding: '0 1rem', width:'30rem', justifyContent: "space-between", borderRadius: '0.5rem',boxShadow: '0 0 1rem rgba(0, 172, 255, 0.6) inset',border: '1px solid rgba(0, 172, 255, 0.6)',
          position: 'relative' }}>
					<div className="flex-r flex1" style={{lineHeight: '1.2', paddingLeft: '1rem', alignItems: 'center', color: '#C6E2FF'}}>{item.IDX_NM}</div>
					<div className="flex-r tr" style={{color: color, alignItems: 'center', width:'10rem'}} > <img className="data-item-img" src={[require(`../../../../../image/${icon}`)]} alt="" />{status?status:'未开始'}</div>
				</div>
			</div>
		)
	}
}
