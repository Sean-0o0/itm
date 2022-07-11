import React, { Component } from 'react';
import Tooltip from 'antd';
import NoTitleStyleModuleChart from '../../../ClearingPlace/ModuleChart/NoTitleStyleModuleChart';
import Tree from './Tree';
//清算业务
export default class ClearingBusiness extends Component {

	state = {
		firstMoudle: {},
		secondMoudle: {},
		thirdMoudle: {}
	}

	getClearingbusiness = (arr) => {
		arr = arr.filter((item) => {
			return item.IDX_GRD === '2';
		})
		let map = {};
		let myArr = [];
		for (let i = 0; i < arr.length; i++) {
			if (!map[arr[i].FID]) {
				myArr.push({
					FID: arr[i].FID,
					data: [arr[i]]
				});
				map[arr[i].FID] = arr[i]
			} else {
				for (let j = 0; j < myArr.length; j++) {
					if (arr[i].FID === myArr[j].FID) {
						myArr[j].data.push(arr[i]);
						break
					}
				}
			}
		}
		return myArr;
	}

	componentWillReceiveProps(nextProps) {
		const { futursClearingbusiness = [] } = nextProps;
		const { futursClearingbusiness: oldData = [] } = this.props;
		if (JSON.stringify(oldData) !== JSON.stringify(futursClearingbusiness)) {
			const clearingbusiness = this.getClearingbusiness(futursClearingbusiness);
			const secondIndex = futursClearingbusiness.filter((item) => {
				return item.IDX_GRD === '1';
			})

			clearingbusiness.forEach((item, index) => {
				secondIndex.forEach(elem => {
					if (item.FID === elem.ID) {
						clearingbusiness[index] = {
							...item,
							...elem,
						}
					}
				})
			})
			const [firstMoudle = {}, secondMoudle = {}, thirdMoudle = {}] = clearingbusiness;
			this.setState({
				firstMoudle,
				secondMoudle,
				thirdMoudle
			})
		}
	}

	render() {
		const { moduleCharts = [], indexConfig = [], dispatch = [], chartConfig = [] } = this.props;
		const { firstMoudle = {}, secondMoudle = {}, thirdMoudle = {} } = this.state;


		return (
			<div className="ax-card pos-r flex-c ">
				<div className="pos-r">
					<div className="card-title title-l">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
						{chartConfig.length && chartConfig[0].chartNote ?
							(<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
								<img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
							</Tooltip>) : ''
						}
					</div>
				</div>
				<div className="wid100  flex-c pd10" style={{height: 'calc(100% - 3.66rem)'}}>
					<div className="h50 flex-r wid100">
						<div className="wid33 flex-c h100" style={{alignItems: 'center', padding: '1rem 1rem 0'}}><Tree moudleInfo={firstMoudle}/></div>
						<div className="wid33 flex-c h100" style={{alignItems: 'center', padding: '1rem 1rem 0'}}><Tree moudleInfo={secondMoudle}/></div>
						<div className="wid33 flex-c h100" style={{alignItems: 'center', padding: '1rem 1rem 0'}}><Tree moudleInfo={thirdMoudle}/></div>
					</div>
					<div className="h50" style={{paddingTop: '.5rem'}}>
						<NoTitleStyleModuleChart
							records={moduleCharts[1]}
							indexConfig={indexConfig}
							tClass='title-c-nomage'
							dispatch={dispatch}
						/>
					</div>
				</div>
			</div>
		)
	}
}