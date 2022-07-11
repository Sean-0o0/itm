import React, { Component } from 'react'
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

export class RightBlock extends Component {

  state = {
    tmpl: []
  };

  //将数组按INDEXNO顺序排序
  getSortList = (arr) => {
    let teml = arr
    let len = teml.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        // 相邻元素两两对比，元素交换，大的元素交换到后面
        if (teml[j].INDEXNO > teml[j + 1].INDEXNO) {
          let temp = teml[j];
          teml[j] = teml[j + 1];
          teml[j + 1] = temp;
        }
      }
    }
    return teml;
  }

  render() {
    const { chartConfig = [], operCheck = [] } = this.props;
    const sortList = this.getSortList(operCheck)
    return (
      <div className="wid100 h100 pd10">
        <div className="ax-card pos-r flex-c">
          <div className="pos-r">
            <div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
              {chartConfig.length && chartConfig[0].chartNote ?
                (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                  <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                </Tooltip>) : ''
              }
            </div>
          </div>
          <Scrollbars
            autoHide
            style={{ width: '100%' }}
          >
            {
              operCheck.length === 0 ?
                (<React.Fragment>
                  <div className="evrt-bg evrt-bgimg"></div>
                  <div className="tc pt10per blue" style={{ fontSize: '1.633rem' }}>暂无关键运营检查指标</div>
                </React.Fragment>) :
                <div className="flex-r" style={{ justifyContent: "space-around", flexWrap: "wrap" }}>
                  {
                    sortList.map((e) => {
                      const { INDEXNAME: indexName, INDEXSTATUS: indexStatus, INDEXSTATUSN: indexStatusN } = e
                      return (
                        <div className="wid45 pd6">
                          <span className="txt fs20" style={{ paddingLeft: '0.5833rem' }}>{indexName}</span>
                          <div className="pd6 fs18"
                            style={
                              indexStatus === '0' ?
                                { background: 'linear-gradient(-90deg, #11276F 0%, rgba(17, 47, 111, 0) 100%)' } :
                                indexStatus === '1' ?
                                  { background: 'linear-gradient(-90deg, #11276F 0%, rgba(17, 47, 111, 0) 100%)' } :
                                  indexStatus === '2' ?
                                    { background: 'linear-gradient(-90deg,rgba(226, 60, 57, 0.8) 0%, rgba(226, 60, 57, 0) 100%' } :
                                    { background: 'linear-gradient(-90deg, #F7B432 0%, rgba(247, 180, 50, 0) 100%' }
                            }>
                            <span><img className="jk-side-img"
                              src={
                                indexStatus === '0' ?
                                  [require("../../../../../image/icon_nostart.png")] :
                                  indexStatus === '1' ?
                                    [require("../../../../../image/icon_completed.png")] :
                                    indexStatus === '2' ?
                                      [require("../../../../../image/icon_abnormal.png")] :
                                      [require("../../../../../image/icon_edit.png")]
                              }
                              alt="" /></span>
                            {/* 0未开始,1已完成，2异常，3手工确认 */}
                            <span className="txt fs20"
                              style={indexStatus === '0' ?
                                { color: "#666666",fontWeight:'800',lineHeight:'2rem' } :
                                indexStatus === '1' ?
                                  { fontWeight:'800',lineHeight:'2rem' } :
                                  indexStatus === '2' ?
                                    { color: "#E23C39",fontWeight:'800',lineHeight:'2rem' } :
                                    { color: "#F7B432",fontWeight:'800',lineHeight:'2rem' }}>
                              {indexStatusN}</span>
                          </div>
                          {/* #00ACFF */}
                        </div>
                      )
                    })
                  }
                </div>
            }
          </Scrollbars>
        </div>
      </div>
    )
  }
}
export default RightBlock
