import React, { Component } from 'react'
import { Divider, Tooltip } from 'antd';
import CashSettlement from './CashSettlement';
import PermissionSetting from '../TopBlock/PermissionSetting';
import RegulatoryPush from '../TopBlock/RegulatoryPush';
export default class MiddleBlock extends Component {

	render() {

		const { moduleCharts = [], indexConfig = [], dispatch = [], FutursFundsettlement = [], FutursRegulatorySub = [], FutursPermissionsetting = [] } = this.props;
		let chartConfig = [];
		if (moduleCharts.length) {
			chartConfig = moduleCharts[10];
		}
		return (
			<div className="flex-c flex1 h100">
				<div className="wid100 pd10 h56">
					<CashSettlement chartConfig={moduleCharts[12]} futursFundsettlement={FutursFundsettlement} />
				</div>
				<div className="wid100 pd10 h44">
					<div className="flex-r h100">
						<div className='wid50'>
							{/*监管报送*/}
							<RegulatoryPush chartConfig={moduleCharts[2]} FutursRegulatorySub={FutursRegulatorySub} />
						</div>
						<div className='wid50 pl20'>
							{/*权限设置*/}
							<PermissionSetting chartConfig={moduleCharts[3]} FutursPermissionsetting={FutursPermissionsetting} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
