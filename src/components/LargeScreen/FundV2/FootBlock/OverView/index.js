import React, { Component } from 'react'

export class OverView extends Component {
    render() {
        //const { TOTALTASKS:totalTasks, COMPLTASKS:complTasks, NORMALTASKS:normalTasks, EXEPTTASKS:exeptTasks , HANDTASKS:handTasks, OUTSTTASKS:outstTasks } = this.props.intqueryStat
        const { intqueryStat = []} = this.props
        return (
            <div className="flex-r">
                <div className="wid100 pd10 h100">
                    {/* <div className="forth-head">资管运营检查指标监控表</div> */}
                    {/* <div className="pos-r">
                        <div className="forth-head">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                            {chartConfig.length && chartConfig[0].chartNote ?
                                (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                    <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                                </Tooltip>) : ''
                            }
                        </div>
                    </div> */}
                  {
                    intqueryStat.length === 0 ?
                      <div></div> :
                      intqueryStat.map((e) => {
                        const { TOTALTASKS: totalTasks = 0, COMPLTASKS: complTasks = 0, NORMALTASKS: normalTasks = 0, EXEPTTASKS: exeptTasks = 0, HANDTASKS: handTasks = 0, OUTSTTASKS: outstTasks = 0 } = e
                        return (
                          <div className=" flex1 flex-r" style={{ justifyContent: "space-between", height: '6rem' }}>
                            <div className="border-side">
                            </div>
                            <div className="border-middle flex-r" style={{ width: "64%",alignItems:'center' }}>
                              <div style={{ width: "17%", margin: "1rem 0rem" }}>
                                <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 1rem" }} src={[require("../../../../../image/total.png")]} alt="" />
                                <span className="fwsize">总任务数: </span>
                                <span style={{ margin: "0 2rem" }}>{totalTasks}</span>
                              </div>
                              <div className="flex1 flex-r detail" style={{justifyContent:'center',alignItems:'center'}}>
                                <div className="" style={{ position: "relative" }}>
                                  <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 1rem" }} src={[require("../../../../../image/circle2.png")]} alt="" />
                                  <span className="fwsize">已完成:</span>
                                  <span style={{ margin: "0 2rem" }}>{complTasks === undefined ? '-' : complTasks}</span>
                                </div>
                                <div className="box flex-r">
                                  <div className="" style={{ position: "relative" }}>
                                    <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 2rem" }} src={[require("../../../../../image/icon_completed.png")]} alt="" />
                                    <span className="fwsize" style={{color:'#00ACFF'}}>正常:</span>
                                    <span style={{ margin: "0 2rem" }}>{normalTasks === undefined ? '-' : normalTasks}</span>
                                  </div>
                                  <div className="">
                                    <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 2rem" }} src={[require("../../../../../image/icon_abnormal.png")]} alt="" />
                                    <span className="fwsize" style={{color:"#E23C39"}}>异常:</span>
                                    <span style={{ margin: "0 2rem" }}>{exeptTasks === undefined ? '-' : exeptTasks}</span>
                                  </div>
                                  <div className="">
                                    <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 2rem" }} src={[require("../../../../../image/icon_edit.png")]} alt="" />
                                    <span className="fwsize" style={{color:'#F7B432'}}>手工确认:</span>
                                    <span style={{ margin: "0 2rem" }}>{handTasks === undefined ? '-' : handTasks}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-r" style={{ width: "17%", margin: "1rem 0rem",justifyContent:'flex-end',alignItems:'center' }}>
                                <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 1rem" }} src={[require("../../../../../image/icon_nostart.png")]} alt="" />
                                <span className="fwsize" style={{color:'#AAAAAA'}}>未完成: </span>
                                <span style={{ margin: "0 2rem" }}>{outstTasks}</span>
                              </div>
                            </div>
                            <div className="border-side">
                            </div>
                          </div>
                        )
                      })
                  }
                </div>

            </div>
        )
    }
}

export default OverView
