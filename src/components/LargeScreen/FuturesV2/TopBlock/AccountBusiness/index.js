import React, { Component } from 'react';
import Tooltip from 'antd';
import NoTitleStyleModuleChart from '../../../ClearingPlace/ModuleChart/NoTitleStyleModuleChart';
//账户业务
export default class AccountBusiness extends Component {
	render() {
		const { chartConfig = [], moduleCharts = [], indexConfig = [], dispatch = [] } = this.props;

		return (
			<div className="ax-card pos-r flex-c h100">
				<div className="pos-r">
					<div className="card-title title-r">账户业务
						{chartConfig.length && chartConfig[0].chartNote ?
							(<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
								<img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
							</Tooltip>) : ''
						}
					</div>
				</div>
				<div className=" flex1 pd10 flex-c">
					<div className="flex-r h33">
						<div className="flex1 wid50 ">
							<NoTitleStyleModuleChart
								records={moduleCharts[4]}
								indexConfig={indexConfig}
								tClass='title-c-nomage'
								dispatch={dispatch}
							/>
						</div>
						<div className="flex1 wid50 ">
							<NoTitleStyleModuleChart
								records={moduleCharts[5]}
								indexConfig={indexConfig}
								tClass='title-c-nomage'
								dispatch={dispatch}
							/>
						</div>
					</div>
					<div className="flex-r h33">
						<div className="flex1 wid50 ">
							<NoTitleStyleModuleChart
								records={moduleCharts[6]}
								indexConfig={indexConfig}
								tClass='title-c-nomage'
								dispatch={dispatch}
							/>
						</div>
						<div className="flex1 wid50 ">
							<NoTitleStyleModuleChart
								records={moduleCharts[7]}
								indexConfig={indexConfig}
								tClass='title-c-nomage'
								dispatch={dispatch}
							/>
						</div>
					</div>
					<div className="flex-r h34">
						<div className="flex1 wid50 ">
							<NoTitleStyleModuleChart
								records={moduleCharts[8]}
								indexConfig={indexConfig}
								tClass='title-c-nomage'
								dispatch={dispatch}
							/>
						</div>
						<div className="flex1 wid50 ">
							<NoTitleStyleModuleChart
								records={moduleCharts[9]}
								indexConfig={indexConfig}
								tClass='title-c-nomage'
								dispatch={dispatch}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
