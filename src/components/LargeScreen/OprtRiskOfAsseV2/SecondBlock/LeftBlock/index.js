import React, { Component } from 'react'
import { Tooltip } from 'antd';
export class LeftBlock extends Component {

    state = {
        serviceCheck: []
    };

    render() {
        const { data = [], chartConfig = [] } = this.props
        return (
            <div className="wid100 h100 pd10 check">
                <div className="ax-card pos-r flex-c">
                    {/* <div className="pos-r">
                        <div className="card-title title-l">运营业务检查指标监控</div>
                    </div> */}
                    <div className="pos-r" style={{ marginBottom: "1rem" }}>
                        <div className="card-title title-l">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                            {chartConfig.length && chartConfig[0].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                    </div>
                    {
                        data.length === 0 ? (<React.Fragment>
                            <div className="evrt-bg evrt-bgimg"></div>
                            <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
                        </React.Fragment>) :
                            (<div className="flex1 flex-r">
                                {
                                    data.map((e, idx) => {
                                        const { GROUPNAME: groupName, TOTALTASKS: totalTasks, NORMALTASKS: normalTasks, EXEPTTASKS: exeptTasks, HANDTASKS: handTasks, OUTSTTASKS: OutstTasks } = e
                                        return (
                                            <div className={idx === 0 ? "flex-c wid50 dotLine sec-pos" : "flex-c wid50 sec-pos"}>
                                                <div className="txt fs16">
                                                    <span style={{ float: "left", color: "#00ACFF", fontSize: '1.71rem' }}>{groupName}</span>
                                                    <span style={{ float: "right" }}>完成进度:<span className="fs24" style={{ fontWeight: "bold" }}>{totalTasks - OutstTasks}</span>/{totalTasks}</span>
                                                </div>
                                                <div className="flex-r" style={{ height: ".4rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                    <div style={{ width: `${100 - 100 * OutstTasks / totalTasks}%`, backgroundColor: "#157EF4", display: "inline", borderRadius: "2px 0px 0px 2px" }}></div>
                                                    <div style={{ width: `${100 * OutstTasks / totalTasks}%`, backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 2px 2px 0px" }}></div>
                                                </div>
                                                <div className="flex-r" style={{ height: "1.2rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                    <div style={{ width: `${100 * normalTasks / totalTasks}%`, backgroundColor: "#157EF4", display: "inline", borderRadius: "6px 0px 0px 6px" }}></div>
                                                    <div style={{ width: `${100 * exeptTasks / totalTasks}%`, backgroundColor: "#E23C39", display: "inline" }}></div>
                                                    <div style={{ width: `${100 * handTasks / totalTasks}%`, backgroundColor: "#F7B432", display: "inline" }}></div>
                                                    <div style={{ width: `${100 * OutstTasks / totalTasks}%`, backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 6px 6px 0px" }}></div>
                                                </div>
                                                <div className="flex1 flex-r" style={{ marginTop: "2rem", justifyContent: "space-between", height: "5.3rem" }}>
                                                    <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                        <div className="topTxt" style={{ display: "flex", direction: 'row', marginLeft: '3.33rem' }}>
                                                            <div>
                                                                <span><img className="jk-side-img"
                                                                    src={[require("../../../../../image/icon_completed.png")]}
                                                                    alt="" />
                                                                </span>
                                                            </div>
                                                            <div>正常</div>
                                                        </div>
                                                        <div className="bottomTxt">{normalTasks}</div>
                                                    </div>
                                                    <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                        <div className="topTxt" style={{ display: "flex", direction: 'row', marginLeft: '3.33rem' }}>
                                                            <div>
                                                                <span><img className="jk-side-img"
                                                                    src={[require("../../../../../image/icon_abnormal.png")]}
                                                                    alt="" />
                                                                </span>
                                                            </div>
                                                            <div style={{ color: "#E23C39" }}>异常</div>
                                                        </div>
                                                        <div className="bottomTxt">{exeptTasks}</div>
                                                    </div>
                                                    <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                        <div className="topTxt" style={{ display: "flex", direction: 'row', marginLeft: '1.633rem' }}>
                                                            <div>
                                                                <span><img className="jk-side-img"
                                                                    src={[require("../../../../../image/icon_edit.png")]}
                                                                    alt="" />
                                                                </span>
                                                            </div>
                                                            <div style={{ color: "#F7B432" }}>手工登记</div>
                                                        </div>
                                                        <div className="bottomTxt">{handTasks}</div>
                                                    </div>
                                                    <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                        <div className="topTxt" style={{ display: "flex", direction: 'row', marginLeft: '2.33rem' }}>
                                                            <div>
                                                                <span><img className="jk-side-img"
                                                                    src={[require("../../../../../image/icon_nostart.png")]}
                                                                    alt="" />
                                                                </span>
                                                            </div>
                                                            <div style={{ color: "#666666" }}>未完成</div>
                                                        </div>
                                                        <div className="bottomTxt">{OutstTasks}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            // <div className={idx === 0 ? "flex-c wid50 dotLine sec-pos" : "flex-c wid50 sec-pos"}>
                                            //     <div className="txt fs16">
                                            //         <span style={{ float: "left", color: "#00ACFF", fontSize: '2rem' }}>{groupName}</span>
                                            //         <span style={{ float: "right" }}>完成进度:<span className="fs24" style={{ fontWeight: "bold" }}>{totalTasks - OutstTasks}</span>/{totalTasks}</span>
                                            //     </div>
                                            //     <div className="flex-r" style={{ height: ".4rem", borderRadius: "2px", margin: "1rem 0" }}>
                                            //         <div style={{ width: `${100 - 100 * OutstTasks / totalTasks}%`, backgroundColor: "#157EF4", display: "inline", borderRadius: "2px 0px 0px 2px" }}></div>
                                            //         <div style={{ width: `${100 * OutstTasks / totalTasks}%`, backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 2px 2px 0px" }}></div>
                                            //     </div>
                                            //     <div className="flex-r" style={{ height: "1.2rem", borderRadius: "2px", margin: "1rem 0" }}>
                                            //         <div style={{ width: `${100 * normalTasks / totalTasks}%`, backgroundColor: "#157EF4", display: "inline", borderRadius: "6px 0px 0px 6px" }}></div>
                                            //         <div style={{ width: `${100 * exeptTasks / totalTasks}%`, backgroundColor: "#E23C39", display: "inline" }}></div>
                                            //         <div style={{ width: `${100 * handTasks / totalTasks}%`, backgroundColor: "#F7B432", display: "inline" }}></div>
                                            //         <div style={{ width: `${100 * OutstTasks / totalTasks}%`, backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 6px 6px 0px" }}></div>
                                            //     </div>
                                            //     <div className="flex1 flex-r" style={{ marginTop: "2rem", justifyContent: "space-between", height: "5.3rem" }}>
                                            //         <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                            //             <div className="topTxt">正常</div>
                                            //             <div className="bottomTxt">{normalTasks}</div>
                                            //         </div>
                                            //         <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                            //             <div className="topTxt" style={{ display: "flex", direction: 'row', marginLeft: '3.33rem' }}>
                                            //                 <div>
                                            //                     <span><img className="jk-side-img"
                                            //                         src={[require("../../../../../image/icon_abnormal.png")]}
                                            //                         alt="" />
                                            //                     </span>
                                            //                 </div>
                                            //                 <div style={{ color: "#E23C39" }}>异常</div>
                                            //             </div>
                                            //             <div className="bottomTxt">{exeptTasks}</div>
                                            //         </div>
                                            //         <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                            //             <div className="topTxt" style={{ color: "#F7B432" }}>手工登记</div>
                                            //             <div className="bottomTxt">{handTasks}</div>
                                            //         </div>
                                            //         <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                            //             <div className="topTxt" style={{ color: "#666666" }}>未完成</div>
                                            //             <div className="bottomTxt">{OutstTasks}</div>
                                            //         </div>
                                            //     </div>
                                            // </div>
                                        )
                                    })
                                }
                                {
                                    data.length === 1 ?
                                        <div className="flex-c wid50 dotLine sec-pos">
                                            <div className="txt fs16">
                                                <span style={{ float: "left", color: "#00ACFF", fontSize: '1.71rem' }}>{'------------'}</span>
                                                <span style={{ float: "right" }}>完成进度:<span className="fs24" style={{ fontWeight: "bold" }}>{'-'}</span>/{'-'}</span>
                                            </div>
                                            <div className="flex-r" style={{ height: ".4rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                <div style={{ width: "100%", backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 2px 2px 0px" }}></div>
                                            </div>
                                            <div className="flex-r" style={{ height: "1.2rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                <div style={{ width: "100%", backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 6px 6px 0px" }}></div>
                                            </div>
                                            <div className="flex1 flex-r" style={{ marginTop: "2rem", justifyContent: "space-between", height: "5.3rem" }}>
                                                <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                    <div className="topTxt">正常</div>
                                                    <div className="bottomTxt">{'-'}</div>
                                                </div>
                                                <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                    <div className="topTxt">异常</div>
                                                    <div className="bottomTxt">{'-'}</div>
                                                </div>
                                                <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                    <div className="topTxt">手工登记</div>
                                                    <div className="bottomTxt">{'-'}</div>
                                                </div>
                                                <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                    <div className="topTxt">未完成</div>
                                                    <div className="bottomTxt">{'-'}</div>
                                                </div>
                                            </div>
                                        </div> :
                                        data.length === 0 ?
                                            <div className="flex1 flex-r">
                                                <div className="flex-c wid50 dotLine sec-pos">
                                                    <div className="txt fs16">
                                                        <span style={{ float: "left", color: "#00ACFF", fontSize: '1.71rem' }}>{'------------'}</span>
                                                        <span style={{ float: "right" }}>完成进度:<span className="fs24" style={{ fontWeight: "bold" }}>{'-'}</span>/{'-'}</span>
                                                    </div>
                                                    <div className="flex-r" style={{ height: ".4rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                        <div style={{ width: "100%", backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 2px 2px 0px" }}></div>
                                                    </div>
                                                    <div className="flex-r" style={{ height: "1.2rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                        <div style={{ width: "100%", backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 6px 6px 0px" }}></div>
                                                    </div>
                                                    <div className="flex1 flex-r" style={{ marginTop: "2rem", justifyContent: "space-between" }}>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">正常</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">异常</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">手工登记</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">未完成</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-c wid50 sec-pos">
                                                    <div className="txt fs16" >
                                                        <span style={{ float: "left", color: "#00ACFF" }}>{'------------'}</span>
                                                        <span style={{ float: "right" }}>完成进度:<span className="fs24" style={{ fontWeight: "bold" }}>{'-'}</span>/{'-'}</span>
                                                    </div>
                                                    <div className="flex-r" style={{ height: ".4rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                        <div style={{ width: "100%", backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 2px 2px 0px" }}></div>
                                                    </div>
                                                    <div className="flex-r" style={{ height: "1.2rem", borderRadius: "2px", margin: "1rem 0" }}>
                                                        <div style={{ width: "100%", backgroundColor: "#383F5F", display: "inline", borderRadius: "0px 6px 6px 0px" }}></div>
                                                    </div>
                                                    <div className="flex1 flex-r" style={{ marginTop: "2rem", justifyContent: "space-between" }}>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">正常</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">异常</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">手工登记</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                        <div className="squre pos-r" style={{ height: "5.3rem" }}>
                                                            <div className="topTxt">未完成</div>
                                                            <div className="bottomTxt">{'-'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> :
                                            <div></div>
                                }
                            </div>
                            )
                    }

                </div>
            </div>
        )
    }
}
export default LeftBlock
