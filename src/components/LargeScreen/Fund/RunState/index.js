import React from 'react';
import { Tooltip } from 'antd';
import TreeChild from './TreeChild';

class RunState extends React.Component {

	render() {
		const { xzjjSettleCompletion = [], chartConfig = [] } = this.props;
		const tmpl = [];
		const taskItem = [];
		xzjjSettleCompletion.forEach(item => {
			if (item.IDX_GRD === '1') {
				taskItem.push([]);
				tmpl.push(item);
			}
		});
		xzjjSettleCompletion.forEach(item => {
			for (let i = 0; i < tmpl.length; i++) {
				if (item.FID === tmpl[i].ID) {
					taskItem[i].push(item);
				}
			}
		});

		return (
			<div className="ax-card pos-r flex-c">
				<div className="pos-r">
					<div className="card-title title-clearing">{chartConfig.length && chartConfig[0].chartTitle ?chartConfig[0].chartTitle: ''}
					{chartConfig.length && chartConfig[0].chartNote?
							(<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br/></span> })}</div>}>
								<img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
							</Tooltip>) : ''
						}
					</div>
				</div>
				<div className="flex1 pos-r" style={{ minheight: "13rem" }}>
					<div className="fd-tree-bg fd-tree-bgimg">
						<TreeChild business={tmpl[3]} moudleInfo={taskItem[3]} weizhi="fd-item-weizhi1" />
						<TreeChild business={tmpl[0]} moudleInfo={taskItem[0]} weizhi="fd-item-weizhi2" />
						<TreeChild business={tmpl[1]} moudleInfo={taskItem[1]} weizhi="fd-item-weizhi3" />
						<TreeChild business={tmpl[2]} moudleInfo={taskItem[2]} weizhi="fd-item-weizhi4" />
					</div>
				</div>
			</div>
		);
	}
}
export default RunState;
