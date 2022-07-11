import React, { Component ,Tooltip} from 'react'
export default class index extends Component {
    render() {
        const { zbhzData = [], chartConfig = [] } = this.props;
        return (
            <div className="overview-wrap pd10">
                <div className="forth-head">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                    {chartConfig.length && chartConfig[0].chartNote ?
                        (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                            <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                        </Tooltip>) : ''
                    }
                </div>
                <div className=" flex1 flex-r" style={{ justifyContent: "space-between", height: '6rem',boxShadow: '0 0 2rem #00acff80 inset',marginTop:'1rem' }}>
                    <div className="border-side">
                    </div>
                    <div className="border-middle flex-r" style={{ width: "65%" }}>
                        <div style={{ width: "15%", lineHeight:"4.5rem" }}>
                            <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 1rem" }} src={[require("../../../../image/total.png")]} alt="" />
                            <span className="fwsize">总任务数: {zbhzData[0]?zbhzData[0].TOTALTASKS:0}</span>
                        </div>
                        <div className="flex1 flex-r detail" style={{ marginLeft: '6rem' }}>
                            <div className="" style={{ position: "relative" }}>
                                <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 1rem" }} src={[require("../../../../image/circle2.png")]} alt="" />
                                <span className="fwsize">已完成</span>
                                <span style={{ margin: "0 2rem" }}>{zbhzData[0]?zbhzData[0].COMPLTASKS:0}</span>
                            </div>
                            <div className="box flex-r">
                                <div className="" style={{ position: "relative" }}>
                                    <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 2rem" }} src={[require("../../../../image/icon_completed.png")]} alt="" />
                                    <span className="fwsize" style={{color:'#00ACFF'}}>正常</span>
                                    <span style={{ margin: "0 2rem" }}>{zbhzData[0]?zbhzData[0].NORMALTASKS:0}</span>
                                </div>
                                <div className="">
                                    <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: ".2rem 1rem 0.4rem 2rem" }} src={[require("../../../../image/icon_abnormal.png")]} alt="" />
                                    <span className="fwsize" style={{color:"#D34643"}}>异常</span>
                                    <span style={{ margin: "0 2rem" }}>{zbhzData[0]?zbhzData[0].EXEPTTASKS:0}</span>
                                </div>
                                <div className="">
                                    <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: ".2rem 1rem 0.4rem 2rem" }} src={[require("../../../../image/icon_edit.png")]} alt="" />
                                    <span className="fwsize" style={{color:'#F7B432'}}>手工确认</span>
                                    <span style={{ margin: "0 2rem" }}>{zbhzData[0]?zbhzData[0].HANDTASKS:0}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "15%", lineHeight:"4.5rem" }}>
                            <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: ".2rem 1rem 0.4rem 1rem" }} src={[require("../../../../image/icon_nostart.png")]} alt="" />
                            <span className="fwsize" style={{color:'#AAAAAA'}}>未完成 :{zbhzData[0]?zbhzData[0].OUTSTTASKS:0}</span>
                        </div>
                    </div>
                    <div className="border-side">
                    </div>
                </div>
            </div>

        )
    }
}
