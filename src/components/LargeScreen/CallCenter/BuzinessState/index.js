import React from 'react';
import { Tooltip } from 'antd';
import LableLinePieType from '../../ClearingPlace/ModuleChart/LableLinePieType';

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
                    callCenArr[0] = element;   //网开视频处理数
                    break;
                case 'HJZX004':
                    callCenArr[1] = element;   //网开视频通过数
                    break;
                case 'HJZX002':
                    callCenArr[2] = element;   //网开复核处理数
                    break;
                case 'HJZX001':
                    callCenArr[3] = element;   //网开复核通过数
                    break;
                case 'HJZX006':
                    callCenArr[4] = element;   //呼叫呼入待处理数
                    break;
                case 'HJZX007':
                    callCenArr[5] = element;   //网开视频待处理数
                    break;
                case 'HJZX003':
                    callCenArr[6] = element;   //网开复核待处理数
                    break;
                case 'HJZX008':
                    callCenArr[7] = element;   //单向视频审核处理数
                    break;
                case 'HJZX009':
                    callCenArr[8] = element;   //单向视频审核通过数
                    break;
                case 'HJZX0010':
                    callCenArr[9] = element;    //单向网开审核数
                    break;
                default:
                    break;
            }
        });

        return (
            <div className="ax-card pos-r flex-c">
                <div className="flex1 tc flex-c" style={{ minheight: "13rem" }}>
                    <div className="h34 co-busi-box flex-c">
                        <div className="fs20l fwb" >{moduleCharts.chartCode ? moduleCharts.chartTitle : ''}
                            {chartConfig[3] && chartConfig[3][0] && chartConfig[3][0].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[3][0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                        <div className="chart-box  flex1">
                            <div style={{ height: '100%' }}>
                                <LableLinePieType
                                    configData={moduleCharts}
                                    indexConfig={indexConfig}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="co-box-split"></div>
                    <div className="h33 cc-busi-box-inner flex-c">
                        <div className="fs22 fwb cc-subtitle-style">
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
                                <div className="flex1 flex-c" style={{background:'#042474',margin:'1rem 1rem',borderRadius:'1.5rem'}}>
                                    <div className="flex1 flex-c">
                                        <div className="flex1 flex-r cc-data-label" style={{color:'#00ACFF',fontWeight:'600'}}>网开视频</div>
                                    </div>
                                    <div className="flex1 flex-c" style={{paddingBottom: '1rem'}}>
                                        <div className="flex-r cc-data-label">处理数/通过数</div>
                                        <div className="flex2 cc-data-value" style={{paddingTop:'1.8rem'}}> {callCenArr[0] && callCenArr[0].RESULT ? parseInt(callCenArr[0].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span> / {callCenArr[1] && callCenArr[1].RESULT ? parseInt(callCenArr[1].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
                                    </div>

                                </div>
                                <div className="flex1 flex-c" style={{background:'#042474',margin:'1rem 1rem',borderRadius:'1.5rem'}}>
                                    <div className="flex1 flex-c">
                                        <div className="flex1 flex-r cc-data-label" style={{color:'#00ACFF',fontWeight:'600'}}>网开单向审核</div>
                                    </div>
                                    <div className="flex1 flex-c" style={{paddingBottom: '1rem'}}>
                                        <div className="flex-r cc-data-label">处理数/通过数</div>
                                        <div className="flex2 cc-data-value" style={{paddingTop:'1.8rem'}}> {callCenArr[7] && callCenArr[7].RESULT ? parseInt(callCenArr[7].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span> / {callCenArr[8] && callCenArr[8].RESULT ? parseInt(callCenArr[8].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
                                    </div>
                                </div>
                                <div className="flex1 flex-c" style={{background:'#042474',margin:'1rem 1rem',borderRadius:'1.5rem'}}>
                                    <div className="flex1 flex-c">
                                        <div className="flex1 flex-r cc-data-label" style={{color:'#00ACFF',fontWeight:'600'}}>网开复核</div>
                                    </div>
                                    <div className="flex1 flex-c" style={{paddingBottom: '1rem'}}>
                                        <div className=" flex-r cc-data-label">处理数/通过数</div>
                                        <div className="flex2 cc-data-value" style={{paddingTop:'1.8rem'}}> {callCenArr[2] && callCenArr[2].RESULT ? parseInt(callCenArr[2].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span> / {callCenArr[3] && callCenArr[3].RESULT ? parseInt(callCenArr[3].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="co-box-split"></div>
                    <div className="h33 cc-busi-box-inner flex-c">
                        <div className=" fs22 fwb cc-subtitle-style">
                            {chartConfig[5] && chartConfig[5][0] && chartConfig[5][0].chartTitle ? chartConfig[5][0].chartTitle : '-'}
                            {chartConfig[5] && chartConfig[5][0] && chartConfig[5][0].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[5][0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                        <div className="flex1 flex-c co-all-data">
                            <div className="flex1 flex-r">
                                <div className="flex1 flex-c">
                                    <div className="flex1 flex-c" style={{background:'#042474',margin:'1rem',borderRadius:'1.5rem',paddingTop:'1rem'}}>
                                        {/* <div className="cc-data-label">{callCenArr[4] && callCenArr[4].IDX_NM ? callCenArr[4].IDX_NM : '-'}</div>
                                    <div className="cc-data-value"> {callCenArr[4] && callCenArr[4].RESULT ? parseInt(callCenArr[4].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div> */}
                                        <div className="flex1 flex-r cc-data-label">呼入咨询服务</div>
                                        <div className="flex1 cc-data-value">{callIn ? callIn : '-'}<span className="co-data-text">&nbsp;笔</span></div>
                                    </div>
                                    <div className="flex1 flex-c" style={{background:'#042474',margin:'1rem',borderRadius:'1.5rem',paddingTop:'1rem'}}>
                                        <div className="flex1 flex-r cc-data-label">{callCenArr[5] && callCenArr[5].IDX_NM ? callCenArr[5].IDX_NM : '-'}</div>
                                        <div className="flex1 cc-data-value"> {callCenArr[5] && callCenArr[5].RESULT ? parseInt(callCenArr[5].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
                                    </div>
                                </div>
                                <div className="flex1 flex-c">
                                    <div className="flex1 flex-c" style={{background:'#042474',margin:'1rem',borderRadius:'1.5rem',paddingTop:'1rem'}}>
                                        <div className="flex1 flex-r cc-data-label">{callCenArr[9] && callCenArr[9].IDX_NM ? callCenArr[9].IDX_NM : '-'}</div>
                                        <div className="flex1 cc-data-value"> {callCenArr[9] && callCenArr[9].RESULT ? parseInt(callCenArr[9].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
                                    </div>
                                    <div className="flex1 flex-c" style={{background:'#042474',margin:'1rem',borderRadius:'1.5rem',paddingTop:'1rem'}}>
                                        <div className="flex1 flex-r cc-data-label">{callCenArr[6] && callCenArr[6].IDX_NM ? callCenArr[6].IDX_NM : '-'}</div>
                                        <div className="flex1 cc-data-value"> {callCenArr[6] && callCenArr[6].RESULT ? parseInt(callCenArr[6].RESULT) : '-'}<span className="co-data-text">&nbsp;笔</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BuzinessState;
