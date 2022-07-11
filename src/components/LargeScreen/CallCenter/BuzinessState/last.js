import React from 'react';
import { Tooltip } from 'antd';
import PieType from '../../ClearingPlace/ModuleChart/PieType';

class BuzinessState extends React.Component {
	render () {
		const { callIn = '', callCen = [], chartConfig = [], indexConfig = {}, netDevVid = '' } = this.props;
		let moduleCharts = {};
		let callCenArr = [];
		for (let i = 0; i < callCen.length; i++) {
			callCenArr.push();
		}
		if (chartConfig.length && chartConfig[3].length) {
			moduleCharts = chartConfig[3][0];
		}
		callCen.forEach(element => {
			const code = element.IDX_CODE;
			switch (code) {
				case 'HJZX005':
					callCenArr[0] = element;
					break;
				case 'HJZX004':
					callCenArr[1] = element;
					break;
				case 'HJZX002':
					callCenArr[2] = element;
					break;
				case 'HJZX001':
					callCenArr[3] = element;
					break;
				case 'HJZX006':
					callCenArr[4] = element;
					break;
				case 'HJZX007':
					callCenArr[5] = element;
					break;
				case 'HJZX003':
					callCenArr[6] = element;
					break;
				default:
					break;
			}
		});

		return (
			<div className="ax-card pos-r flex-c">
				<div className="flex1 tc flex-c" style={{ minheight: "13rem" }}>
					<div className="h33 co-busi-box flex-c">
						<div className="fs22 fwb">{moduleCharts.chartCode ? moduleCharts.chartTitle : ''}
							{chartConfig[3] && chartConfig[3][0] && chartConfig[3][0].chartNote ?
								(<Tooltip placement="top" title={<div>{chartConfig[3][0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
									<img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
								</Tooltip>) : ''
							}
						</div>
						<div className="chart-box  flex1">
							<div style={{ height: '100%' }}>
								<PieType
									configData={moduleCharts}
									indexConfig={indexConfig}
								/>
							</div>
						</div>
					</div>
					<div className="co-box-split"></div>
					<div className="h34 co-busi-box-inner flex-c">
						<div className="fs22 fwb">
							{chartConfig[4] && chartConfig[4][0] && chartConfig[4][0].chartTitle ? chartConfig[4][0].chartTitle : ''
							}
							{chartConfig[4] && chartConfig[4][0] && chartConfig[4][0].chartNote ?
								(<Tooltip placement="top" title={<div>{chartConfig[4][0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
									<img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
								</Tooltip>) : ''
							}
						</div>
						<div className="flex1 flex-c co-all-data">
							<div className="flex1 flex-r">
								<div className="flex1 flex-c co-data-box">
									<div className="co-data-label">{callCenArr[0] && callCenArr[0].IDX_NM ? callCenArr[0].IDX_NM : '-'}<span>&nbsp;/&nbsp;</span>{callCenArr[1] && callCenArr[1].IDX_NM ? callCenArr[1].IDX_NM : '-'}</div>
									<div className="cc-data-value">
										{callCenArr[0] && callCenArr[0].RESULT ? parseInt(callCenArr[0].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span>
										<span>&nbsp;/&nbsp;</span>
										{callCenArr[1] && callCenArr[1].RESULT ? parseInt(callCenArr[1].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span>
									</div>
								</div>
								<div className="flex1 flex-c co-data-box">
									<div className="co-data-label">{callCenArr[2] && callCenArr[2].IDX_NM ? callCenArr[2].IDX_NM : '-'}<span>&nbsp;/&nbsp;</span>{callCenArr[3] && callCenArr[3].IDX_NM ? callCenArr[3].IDX_NM : '-'}</div>
									<div className="cc-data-value">
										{callCenArr[2] && callCenArr[2].RESULT ? parseInt(callCenArr[2].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span>
										<span>&nbsp;/&nbsp;</span>
										{callCenArr[3] && callCenArr[3].RESULT ? parseInt(callCenArr[3].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span>
									</div>
								</div>
							</div>
							{/* <div className="flex1 flex-r">
                                <div className="flex1 flex-c co-all-data">
                                    <div className="co-data-label">{callCenArr[2] && callCenArr[2].IDX_NM ? callCenArr[2].IDX_NM : ''}</div>
                                    <div className="cc-data-value">{callCenArr[2] && callCenArr[2].RESULT ? parseInt(callCenArr[2].RESULT) : ''}<span className="co-data-text">&nbsp;笔</span></div>
                                </div>
                                <div className="flex1 flex-c co-all-data">
                                    <div className="co-data-label">{callCenArr[3] && callCenArr[3].IDX_NM ? callCenArr[3].IDX_NM : ''}</div>
                                    <div className="cc-data-value">{callCenArr[3] && callCenArr[3].RESULT ? parseInt(callCenArr[3].RESULT) : ''}<span className="co-data-text">&nbsp;笔</span></div>
                                </div>
                            </div> */}
						</div>
					</div>
					<div className="co-box-split"></div>
					<div className="h33 co-busi-box-inner flex-c">
						<div className="fs22 fwb">
							{chartConfig[5] && chartConfig[5][0] && chartConfig[5][0].chartTitle ? chartConfig[5][0].chartTitle : '-'}
							{chartConfig[5] && chartConfig[5][0] && chartConfig[5][0].chartNote ?
								(<Tooltip placement="top" title={<div>{chartConfig[5][0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
									<img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
								</Tooltip>) : ''
							}
						</div>
						<div className="flex1 flex-r cc-all-data">
							<div className="flex1 flex-c">
								<div className="co-data-label">呼入呼叫服务</div>
								<div className="cc-data-value">{callIn}<span className="co-data-text">&nbsp;笔</span></div>
							</div>
							<div className="flex1 flex-c">
								<div className="co-data-label">{callCenArr[5] && callCenArr[5].IDX_NM ? callCenArr[5].IDX_NM : '-'}</div>
								{/* <div className="cc-data-value">{callCenArr[5] && callCenArr[5].RESULT ? parseInt(callCenArr[5].RESULT) : ''}<span className="co-data-text">&nbsp;笔</span></div> */}
								<div className="cc-data-value">{netDevVid}<span className="co-data-text">&nbsp;笔</span></div>
							</div>
							<div className="flex1 flex-c">
								<div className="co-data-label">{callCenArr[6] && callCenArr[6].IDX_NM ? callCenArr[6].IDX_NM : '-'}</div>
								<div className="cc-data-value">{callCenArr[6] && callCenArr[6].RESULT ? parseInt(callCenArr[6].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
							</div>
						</div>
					</div>
					{/* <div className="flex1 co-busi-box flex-c">
                        
                    </div> */}
				</div>
			</div>
		);
	}
}
export default BuzinessState;
