import React from 'react';
import { Tooltip } from 'antd';

class BuzinessStateV2 extends React.Component {

	render () {
		const { cenOpr = [], chartConfig = [] } = this.props;
		let cenOprArr = [];
		for (let i = 0; i < cenOpr.length; i++) {
			cenOprArr.push({});
		}
		cenOpr.forEach(element => {
			const code = element.IDX_CODE;
			switch (code) {
				case 'JZYY01':
					cenOprArr[0] = element;
					break;
				case 'JZYY0101':
					cenOprArr[1] = element;
					break;
				case 'JZYY0102':
					cenOprArr[2] = element;
					break;
				case 'JZYY0103':
					cenOprArr[3] = element;
					break;
				case 'JZYY0104':
					cenOprArr[4] = element;
					break;
				case 'JZYY0105':
					cenOprArr[5] = element;
					break;
				case 'JZYY0106':
					cenOprArr[6] = element;
					break;
				case 'JZYY0107':
					cenOprArr[7] = element;
					break;
				case 'JZYY02':
					cenOprArr[8] = element;
					break;
				case 'JZYY0201':
					cenOprArr[9] = element;
					break;
				case 'JZYY0202':
					cenOprArr[10] = element;
					break;
				case 'JZYY0203':
					cenOprArr[11] = element;
					break;
				case 'JZYY0204':
					cenOprArr[12] = element;
					break;
				case 'JZYY0205':
					cenOprArr[13] = element;
					break;
				case 'JZYY0206':
					cenOprArr[14] = element;
					break;
				case 'JZYY0207':
					cenOprArr[15] = element;
					break;
				case 'JZYY0208':
					cenOprArr[16] = element;
					break;
				default:
					break;
			}
		});
		return (
			<div className="ax-card pos-r flex-c ">
				<div className="pos-r">
					<div className="card-title title-clearing">业务情况
						{chartConfig.length && chartConfig[0].chartNote ?
							(<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
								<img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
							</Tooltip>) : ''
						}
					</div>
				</div>
				<div className="flex1 tc flex-c">
					<div className="co-busi-box flex-c h47">
						<div className="co-subtile-name">{cenOprArr[0] && cenOprArr[0].IDX_NM ? cenOprArr[0].IDX_NM : '-'}</div>
						<div className="co-xzgj-num">{cenOprArr[0] && cenOprArr[0].RESULT ? parseInt(cenOprArr[0].RESULT) : '-'}&nbsp;<span className="co-data-text">笔</span></div>
						<div className="flex1 flex-c">
							<div className="flex1 flex-r" style={{ alignItems: 'center' }}>
								<div className="flex1 flex-r co-all-data mr24">
									<div className="co-data-label">{cenOprArr[1] && cenOprArr[1].IDX_NM ? cenOprArr[1].IDX_NM : '-'}/{cenOprArr[2] && cenOprArr[2].IDX_NM ? cenOprArr[2].IDX_NM : '-'}</div>
									<div className="co-data-value">{cenOprArr[1] && cenOprArr[1].RESULT ? parseInt(cenOprArr[1].RESULT) : '-'}<span className="co-data-text ">&nbsp;笔&nbsp;/&nbsp;</span><span className="red">{cenOprArr[2] && cenOprArr[2].RESULT ? parseInt(cenOprArr[2].RESULT) : '-'}</span><span className="co-data-text red">&nbsp;笔</span></div>
								</div>
								<div className="flex1 flex-r co-all-data ml12">
									<div className="co-data-label">{cenOprArr[3] && cenOprArr[3].IDX_NM ? cenOprArr[3].IDX_NM : '-'}/{cenOprArr[4] && cenOprArr[4].IDX_NM ? cenOprArr[4].IDX_NM : '-'}</div>
									<div className="co-data-value">{cenOprArr[3] && cenOprArr[3].RESULT ? parseInt(cenOprArr[3].RESULT) : '-'}<span className="co-data-text">&nbsp;笔&nbsp;/&nbsp;</span>{cenOprArr[4] && cenOprArr[4].RESULT ? parseInt(cenOprArr[4].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
								</div>
							</div>
							<div className="flex1 flex-r" style={{ alignItems: 'center' }}>
								<div className="flex1 flex-r co-all-data mr24">
									<div className="co-data-label">{cenOprArr[5] && cenOprArr[5].IDX_NM ? cenOprArr[5].IDX_NM : '-'}</div>
									<div className="co-data-value">{cenOprArr[5] && cenOprArr[5].RESULT ? parseInt(cenOprArr[5].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
								</div>
								{/*slice(0, -1)}/机构)  */}
								<div className="flex1 flex-r co-all-data ml12">
									<div className="co-data-label">{(cenOprArr[6] && cenOprArr[6].IDX_NM ? cenOprArr[6].IDX_NM : '-')}</div>
									<div className="co-data-value">{cenOprArr[6] && cenOprArr[6].RESULT ? parseInt(cenOprArr[6].RESULT) : '-'}<span className="co-data-text">&nbsp;笔&nbsp;/&nbsp;</span>{cenOprArr[7] && cenOprArr[7].RESULT ? parseInt(cenOprArr[7].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
								</div>
							</div>
						</div>
					</div>
					<div className="co-box-split"></div>
					<div className="flex1 co-busi-box flex-c">
						<div className="co-subtile-name">{cenOprArr[8] && cenOprArr[8].IDX_NM ? cenOprArr[8].IDX_NM : '-'}</div>
						<div className="co-xzgj-num">{cenOprArr[8] && cenOprArr[8].RESULT ? parseInt(cenOprArr[8].RESULT) : '-'}&nbsp;<span className="co-data-text">笔</span></div>
						<div className="flex1 flex-c" >
							<div className="flex1 flex-r" style={{ alignItems: 'center' }}>
								<div className="flex1 flex-r co-all-data mr24" >
									<div className="co-data-label">{cenOprArr[9] && cenOprArr[9].IDX_NM ? cenOprArr[9].IDX_NM : '-'}</div>
									<div className="co-data-value">{cenOprArr[9] && cenOprArr[9].RESULT ? parseInt(cenOprArr[9].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
								</div>
								<div className="flex1 flex-r co-all-data ml12">
									<div className="co-data-label">{cenOprArr[10] && cenOprArr[10].IDX_NM ? cenOprArr[10].IDX_NM : '-'}</div>
									<div className="co-data-value">{cenOprArr[10] && cenOprArr[10].RESULT ? parseInt(cenOprArr[10].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
								</div>
							</div>

							<div className="flex1 flex-r " style={{ alignItems: 'center' }} >
								<div className="flex1 flex-r mr24 co-all-data ">
									<div className="co-data-label">{cenOprArr[15] && cenOprArr[15].IDX_NM ? cenOprArr[15].IDX_NM : '-'}</div>
									<div className="co-data-value">{cenOprArr[11] && cenOprArr[11].RESULT ? parseInt(cenOprArr[11].RESULT) : '-'}<span className="co-data-text">&nbsp;笔&nbsp;/&nbsp;</span>{cenOprArr[12] && cenOprArr[12].RESULT ? parseInt(cenOprArr[12].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
								</div>
								<div className="flex1 flex-r ml12  co-all-data">
									<div className="co-data-label">{cenOprArr[16] && cenOprArr[16].IDX_NM ? cenOprArr[16].IDX_NM : '-'}</div>
									<div className="co-data-value">{cenOprArr[13] && cenOprArr[13].RESULT ? parseInt(cenOprArr[13].RESULT) : '-'}<span className="co-data-text">&nbsp;笔&nbsp;/&nbsp;</span>{cenOprArr[14] && cenOprArr[14].RESULT ? parseInt(cenOprArr[14].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default BuzinessStateV2;
