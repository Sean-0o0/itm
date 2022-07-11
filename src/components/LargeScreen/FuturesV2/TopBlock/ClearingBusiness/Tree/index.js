import React, { Component } from 'react';
import TaskItem from './TaskItem';
export default class Tree extends Component {
	render() {
		const { moudleInfo = {} } = this.props;
		const { data = [], STATE: status = '0' } = moudleInfo;
		let moudleClass = "";
		let timeClass = "";
		let icon = 'icon_nostart.png';
		let backClass = 'new-fs-item-normal';
		let color = '#fff';
		let textStatus = "未开始";
		let text = '';
		if (status === '1') {
			icon = 'icon_underway.png';
			textStatus = "进行中";
			color = '#F7B432';
		} else if (status === '2') {
			icon = 'icon_completed.png';
			textStatus = "已完成";
			color = '#fff';
		} else if (status === '3') {
			icon = 'icon_abnormal.png';
			textStatus = "异常";
			timeClass = "yellow"
			color = '#fff';
			text = '超时';
			timeClass = "yellow"
			backClass = 'new-fs-item-abnormal';
		}

		moudleClass = `new-fs-tree-item ${backClass}`;
		timeClass = `pt24 fs-data-time ${timeClass}`;

		return (
			<React.Fragment>
				<div className={moudleClass}>
					<div className="flex-r">
						<div className="flex1 fs-data-name">{moudleInfo.IDX_NM ? moudleInfo.IDX_NM : ""}</div>
						<div className="nwp" style={{ color: color }}><img className="fs-zjyw-img" src={[require(`../../../../../../image/${icon}`)]} alt="" />{textStatus}</div>
					</div>
					<div className={timeClass}>{text} {moudleInfo.STARTDATE ? moudleInfo.STARTDATE.slice(11, 19) : "--:--:--"} — {moudleInfo.ENDDATE ? moudleInfo.ENDDATE.slice(11, 19) : "--:--:--"}</div>
					<ul className="timeline-wrapper mt20">
						{data.map((item, index) =>
							(<TaskItem status={status} infoItem={item} key={index} />))}
					</ul>
				</div>
			</React.Fragment >
		);
	}
}
