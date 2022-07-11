import React from 'react';
import {Tooltip } from 'antd';
import TreeChild from './TreeChild';

class HaveClearing extends React.Component {

	render() {
		const { settleCompletion = [], chartConfig = [] } = this.props;
		let firstMoudle = {};
		let secondMoudle = {};
		let thirdMoudle = {};
		let lastMoudle = {};
		settleCompletion.forEach(item => {
			if (item.IDX_CODE === "XZQH0202") {
				firstMoudle = item;
			} else if (item.IDX_CODE === "XZQH0101") {
				secondMoudle = item;
			} else if (item.IDX_CODE === "XZQH0203") {
				thirdMoudle = item;
			} else if (item.IDX_CODE === "XZQH0207") {
				lastMoudle = item;
			}
		});
		let moudleClass = "";
		let backClass = "fs-item-normal2";
		let stateText = "未开始";
		let stateClass = "";
		let icon = "icon_nostart.png";
		if (lastMoudle !== {}) {
			switch (lastMoudle.STATE) {
				case '0':
					backClass = "fs-item-normal2";
					icon = "icon_nostart.png";
					stateText = "未开始";
					break;
				case '1':
					backClass = "fs-item-normal2";
					icon = "icon_underway.png";
					stateClass = "orange"
					stateText = "进行中";
					break;
				case '2':
					backClass = "fs-item-normal2";
					icon = "icon_completed.png";
					stateClass = "blue"
					stateText = "已完成";
					break;
				case '3':
					backClass = "fs-item-abnormal2";
					icon = "icon_abnormal.png";
					stateClass = "red"
					stateText = "异常";
					break;
				default:
					break;
			}
		}
		moudleClass = `fs-tree-item2 fs-item-weizhi4 ${backClass}`;

		return (
			<div className="ax-card pos-r flex-c">
				<div className="pos-r">
					<div className="card-title title-clearing">{chartConfig.length && chartConfig[0].chartTitle ?chartConfig[0].chartTitle: ''}
					{chartConfig.length && chartConfig[0].chartNote ?
                        (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map(item => { return <span>{item}<br /></span> })}</div>}>
                            <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                        </Tooltip>) : ''
                    }
					</div>
				</div>
				<div className="flex1 pos-r" style={{ minheight: "13rem" }}>
					<div className="fs-tree-bg fs-tree-bgimg">
						<TreeChild moudleInfo={firstMoudle} itemCode='0' weizhi="fs-item-weizhi1" />
						<TreeChild moudleInfo={secondMoudle} itemCode='1' weizhi="fs-item-weizhi2" />
						<TreeChild moudleInfo={thirdMoudle} itemCode='2' weizhi="fs-item-weizhi3" />
						<div className={moudleClass}>
							<div className="flex-r">
								<div className="flex1 fs-data-name">{lastMoudle.IDX_NM ? lastMoudle.IDX_NM : ""}</div>
								{
									icon === "" ? "" :
										(<div className={stateClass}><img className="fs-zjyw-img" src={[require("../../../../image/" + icon)]} alt="" />{stateText}</div>)
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default HaveClearing;
