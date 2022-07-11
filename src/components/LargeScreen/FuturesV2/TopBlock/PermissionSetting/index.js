import React, { Component } from 'react'
import { Tooltip } from 'antd';
import EventItem from '../EventItem';
//权限设置
export default class PermissionSetting extends Component {
	state = {
	};
	render() {
		const { chartConfig = [], FutursPermissionsetting = [] } = this.props;

		return (
			<div className="ax-card pos-l flex-c ">

				<div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
					{chartConfig.length && chartConfig[0].chartNote ?
						(<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
							<img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
						</Tooltip>) : ''
					}
				</div>
				<div className="flex1 flex-c" style={{ padding: "1rem 3rem"}}>
					{FutursPermissionsetting.length === 0 ?
						(<React.Fragment>
							<div className="evrt-bg evrt-bgimg"></div>
							<div className="tc pt10per blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
						</React.Fragment>) :
						<>
							{FutursPermissionsetting.map((item, index) => (
								<EventItem item={item} key={index}></EventItem>
							))}
						</>}
				</div>

			</div>
		)
	}
}
