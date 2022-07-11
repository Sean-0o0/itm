import React, { Component } from 'react'

export class ForthBlock extends Component {
  render() {
    const { intqueryStat = []} = this.props
    return (
      <div className="flex-r pd10">
        <div className="wid100 h100 ax-card">
          <div className='pos-r'>
            <div className='card-title title-c'>{'资管运营检查指标监控表'}</div>
          </div>
          {
            intqueryStat.length === 0 ?
              <div></div> :
              intqueryStat.map((e) => {
                const { TOTALTASKS: totalTasks = 0, COMPLTASKS: complTasks = 0, NORMALTASKS: normalTasks = 0, EXEPTTASKS: exeptTasks = 0, HANDTASKS: handTasks = 0, OUTSTTASKS: outstTasks = 0, NOTENABLETASKS : notEnableTasks =0, NOTYETHAPPEN : notYetHappen = 0} = e
                return (
                  <div className=" flex1 flex-r" style={{ justifyContent: "space-between", height: '6rem',padding: '4rem 0rem' }}>
                    <div className="border-side">
                    </div>
                    <div className="border-middle flex-r" style={{ width: "64%",alignItems:'center',justifyContent: 'space-around' }}>
                      <div style={{ margin: "1rem 0rem" }}>
                        <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 1rem" }} src={[require("../../../../image/total.png")]} alt="" />
                        <span className="fwsize">总任务数: </span>
                        <span style={{ margin: "0 2rem" }}>{totalTasks}</span>
                      </div>
                      <div className="flex-r detail" style={{alignItems:'center'}}>
                        <div className="" style={{ position: "relative" }}>
                          <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 1rem" }} src={[require("../../../../image/circle2.png")]} alt="" />
                          <span className="fwsize">已完成:</span>
                          <span style={{ margin: "0 2rem" }}>{complTasks === undefined ? '-' : complTasks}</span>
                        </div>
                        <div className="box flex-r">
                          <div className="" style={{ position: "relative" }}>
                            <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 2rem" }} src={[require("../../../../image/icon_completed.png")]} alt="" />
                            <span className="fwsize" style={{color:'#00ACFF'}}>正常:</span>
                            <span style={{ margin: "0 2rem" }}>{normalTasks === undefined ? '-' : normalTasks}</span>
                          </div>
                          <div className="">
                            <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 2rem" }} src={[require("../../../../image/icon_abnormal.png")]} alt="" />
                            <span className="fwsize" style={{color:"#D34643"}}>异常:</span>
                            <span style={{ margin: "0 2rem" }}>{exeptTasks === undefined ? '-' : exeptTasks}</span>
                          </div>
                          <div className="">
                            <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0px 1rem 0.4rem 2rem" }} src={[require("../../../../image/icon_edit.png")]} alt="" />
                            <span className="fwsize" style={{color:'#F7B432'}}>手工确认:</span>
                            <span style={{ margin: "0 2rem" }}>{handTasks === undefined ? '-' : handTasks}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-r" style={{ margin: "1rem 0rem",alignItems:'center' }}>
                        <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0.3rem 1rem 0.4rem 1rem" }} src={[require("../../../../image/icon_nostart.png")]} alt="" />
                        <span className="fwsize" style={{color:'#AAAAAA'}}>未完成: </span>
                        <span style={{ margin: "0 2rem" }}>{outstTasks}</span>
                      </div>
                      <div className="flex-r" style={{ margin: "1rem 0rem",alignItems:'center' }}>
                        <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0.3rem 1rem 0.4rem 1rem" }} src={[require("../../../../image/icon_wfs.png")]} alt="" />
                        <span className="fwsize" style={{color:'#7e8ccc'}}>未发生: </span>
                        <span style={{ margin: "0 2rem" }}>{notYetHappen}</span>
                      </div>
                      <div className="flex-r" style={{ margin: "1rem 0rem",alignItems:'center' }}>
                        <img className="" style={{ height: "1.5rem", width: "1.5rem", margin: "0.3rem 1rem 0.4rem 1rem" }} src={[require("../../../../image/notEnable.png")]} alt="" />
                        <span className="fwsize" style={{color:'#7e8ccc'}}>未启用: </span>
                        <span style={{ margin: "0 2rem" }}>{notEnableTasks}</span>
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

export default ForthBlock
