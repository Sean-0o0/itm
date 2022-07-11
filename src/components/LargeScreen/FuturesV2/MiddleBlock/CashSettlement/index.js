import React, { Component } from 'react';
import Tooltip from 'antd';
import ItemMoney from './Item/ItemMoney';
import ItemNumber from './Item/ItemNumber';
import ItemStete from './Item/ItemStete';

// 资金交收
export default class CashSettlement extends Component {

	getFundsettlement = (arr) => {
		let map = {};
		let myArr = [];
		for (let i = 0; i < arr.length; i++) {
			if (!map[arr[i].GROUPNAME]) {
				myArr.push({
					GROUPNAME: arr[i].GROUPNAME,
					data: [arr[i]]
				});
				map[arr[i].GROUPNAME] = arr[i]
			} else {
				for (let j = 0; j < myArr.length; j++) {
					if (arr[i].GROUPNAME === myArr[j].GROUPNAME) {
						myArr[j].data.push(arr[i]);
						break
					}
				}
			}
		}
		return myArr
	}

	getItem = (object, pos) => {
		const { data = [] } = object;
		let item = {};
		item = data.length > pos ? data[pos] : {};
		if (pos === 0) {
			if (data.length > 1) {
				item = data[0];
			}
		} else if (pos === 1) {
			if (data.length > 1) {
				item = data[1];
			}
		} else if (pos === 2) {
			if (data.length > 1) {
				item = data[2];
			}
		}
		return item;
	}

	render() {
		const { chartConfig = [], futursFundsettlement = [] } = this.props;
		const fundsettlement = this.getFundsettlement(futursFundsettlement);
		const [handleArr = {}, fundArr = {}, monitorArr = {}, manageArr = {}] = fundsettlement;

		return (
			<div className="ax-card pos-r flex-c h100">
				<div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
					{chartConfig.length && chartConfig[0].chartNote ?
						(<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
							<img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
						</Tooltip>) : ''
					}
				</div>
				<div className="flex-c" style={{ height: 'calc(100% - 4.167rem)', padding: '1rem 1rem', fontWeight: '600' }}>
					{futursFundsettlement.length === 0 ?
						(<React.Fragment>
							<div className="evrt-bg evrt-bgimg"></div>
							<div className="tc pt10per blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
						</React.Fragment>) :
						<>
							<div className="flex-r h64">
								<div className="wid33 h100 flex-c">
									<div className="tc" style={{fontSize: "1.733rem", height: '2rem'}}>{handleArr.GROUPNAME ? handleArr.GROUPNAME : "-"}</div>
									{/* {this.getArr(handleArr).map((item, index) => ( */}
									<ItemNumber item={this.getItem(handleArr, 0)} />
									<ItemMoney item={this.getItem(handleArr, 1)} unit="万元"/>
								</div>
								<div className="wid34 h100 flex-c">
									<div className="tc" style={{fontSize: "1.733rem", height: '2rem'}}>{fundArr.GROUPNAME ? fundArr.GROUPNAME : "-"}</div>
									<ItemMoney item={this.getItem(fundArr, 0)} />
									<ItemMoney item={this.getItem(fundArr, 1)} />
								</div>
								<div className="wid33 h100 flex-c">
									<div className="tc" style={{fontSize: "1.733rem", height: '2rem'}}>{monitorArr.GROUPNAME ? monitorArr.GROUPNAME : "-"}</div>
									{monitorArr.data && monitorArr.data.length ? monitorArr.data.map((item, index) => (
										<ItemStete item={item} key={index} />
									)) : null}
								</div>
							</div>
							<div className="flex-c h36">
								<div className="wid100 h100 flex-c">
									<div className="tc" style={{fontSize: "1.733rem", height: '2rem'}}>{manageArr.GROUPNAME ? manageArr.GROUPNAME : "-"}</div>
									<div className="flex1 flex-r" style={{ alignItems: 'center'}}>
										{manageArr.data && monitorArr.data.length ? manageArr.data.map((item, index) => (
											index === 1 ?
												<div className="wid34 h100" key={index}>
													<ItemMoney item={item} />
												</div> : <div className="wid33 h100" key={index} >
													<ItemMoney item={item} />
												</div>
										)) : null}
									</div>
								</div>
							</div>
						</>}
				</div>
			</div>
		)
	}
}
