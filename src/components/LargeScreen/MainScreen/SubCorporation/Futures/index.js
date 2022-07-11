import React from 'react';
import { message } from 'antd';
import TreeChild from './TreeChild';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';

class Futures extends React.Component {
	state = {
		accountMonitoring: [], // 兴证期货-账户监控
		futuresCompletionStatus: [], // 兴证期货-结算完成情况
	};

	componentDidMount() {
		const refreshWebPage = localStorage.getItem('refreshWebPage');
		this.fetchData();
		this.fetchInterval = setInterval(() => {
			const loginStatus = localStorage.getItem('loginStatus');
			if (loginStatus !== '1') {
				this.props.dispatch({
					type: 'global/logout',
				});
			}
			this.fetchData();
		}, Number.parseInt(refreshWebPage, 10) * 1000);
	}

	componentWillUnmount() {
		if (this.fetchInterval) {
			clearInterval(this.fetchInterval);
		}
	}

	//数据查询
	fetchData = () => {
		FetchQueryChartIndexData({
			chartCode: "AccountMonitoring"
		}).then((ret = {}) => {
			const { code = 0, data = [] } = ret;
			if (code > 0) {
				this.setState({ accountMonitoring: data });
			}
		}).catch(error => {
			message.error(!error.success ? error.message : error.note);
		});

		FetchQueryChartIndexData({
			chartCode: "Settlecompletion"
		}).then((ret = {}) => {
			const { code = 0, data = [] } = ret;
			if (code > 0) {
				this.setState({ futuresCompletionStatus: data });
			}
		}).catch(error => {
			message.error(!error.success ? error.message : error.note);
		});
	};

	render() {
		const { accountMonitoring = [], futuresCompletionStatus = [] } = this.state;
		const { futuresErrCounts = "", sumOfLine = 0, chartTitle = '--' } = this.props;
		let accMonitInfo = {};
		if (accountMonitoring[0]) {
			accMonitInfo = accountMonitoring[0];
		}

		let firstMoudle = {};
		let secondMoudle = {};
		let thirdMoudle = {};
		futuresCompletionStatus.forEach(item => {
			if (item.IDX_CODE === "XZQH0101") {
				firstMoudle = item;
			} else if (item.IDX_CODE === "XZQH0202") {
				secondMoudle = item;
			} else if (item.IDX_CODE === "XZQH0203") {
				thirdMoudle = item;
			}
		});

		return (
			<div className="flex1 pd6">
				<div className="ax-card pos-r flex-c">
					<div className="pos-r">
						<div className={"card-title " + (sumOfLine < 4 ? "title-c" : "title-c2")}>{chartTitle}</div>
						<div className="card-top-shuom">异常或重大事项报告&nbsp;<span className="red fs18">{futuresErrCounts}</span>&nbsp;项</div>
					</div>
					<div className="flex1 pos-r" style={{ minheight: "13rem" }}>
						<div className={sumOfLine === 2 ? "tree-bg1 tree-bg12" : (sumOfLine === 3 ? "tree-bg2 tree-bg22" : 'tree-bg3 tree-bg32')}>
							<TreeChild moudleInfo={firstMoudle} weizhi={sumOfLine === 2 ? "item-weizhi12" : (sumOfLine === 3 ? "item-weizhi22" : 'item-weizhi32')} />
							<TreeChild moudleInfo={secondMoudle} weizhi={sumOfLine === 2 ? "item-weizhi11" : (sumOfLine === 3 ? "item-weizhi21" : 'item-weizhi31')} />
							<TreeChild moudleInfo={thirdMoudle} weizhi={sumOfLine === 2 ? "item-weizhi15" : (sumOfLine === 3 ? "item-weizhi25" : 'item-weizhi35')} />

							<div className={"wid45 " + (sumOfLine === 2 ? " tree-data-box1" : (sumOfLine === 3 ? "tree-data-box2" : 'tree-data-box2'))}>
								<div className={sumOfLine === 2 ? "wid50 fl" : (sumOfLine === 3 ? "wid100 fr" : '')} style={{ marginLeft: 'auto' }}>
									<div className="fs16 lh20">穿仓客户数量&nbsp;/&nbsp;金额</div>
									<div className="tree-num pr10 mt5">{accMonitInfo.CCKHSL || '-'}&nbsp;<span className="fs16 fwn">户</span>&nbsp;/&nbsp;{accMonitInfo.CCKHJE ? Number.parseFloat(accMonitInfo.CCKHJE).toLocaleString() : '-'}&nbsp;<span className="fs16 fwn">万元</span></div>
								</div>
								<div className={sumOfLine === 2 ? "wid50 fl" : (sumOfLine === 3 ? "wid100 fr" : '')} style={{ marginLeft: 'auto' }}>
									<div className="fs16 lh20">达到强平状态客户数量&nbsp;/&nbsp;金额</div>
									<div className="tree-num pr10 mt5">{accMonitInfo.DDQPZTKHSL || '-'}&nbsp;<span className="fs16 fwn">户</span>&nbsp;/&nbsp;{accMonitInfo.DDQPZTKHJE ? Number.parseFloat(accMonitInfo.DDQPZTKHJE).toLocaleString() : '-'}&nbsp;<span className="fs16 fwn">万元</span></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Futures;
