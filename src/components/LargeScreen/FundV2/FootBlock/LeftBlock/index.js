import React, { Component,Tooltip } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import OverView from '../OverView';
import IndexItem from '../IndexItem';

export class LeftBlock extends Component {

  state = {
    serChk: []
  };

  handleData = (qsywData) => {
    let map = {};
    let myArr = [];
    for (let i = 0; i < qsywData.length; i++) {
      if (!map[qsywData[i].SUBGROUP]) {
        myArr.push({
          FGROUP: qsywData[i].FGROUP,
          SUBGROUP: qsywData[i].SUBGROUP,
          data: [qsywData[i]]
        });
        map[qsywData[i].SUBGROUP] = qsywData[i]
      } else {
        for (let j = 0; j < myArr.length; j++) {
          if (qsywData[i].SUBGROUP === myArr[j].SUBGROUP) {
            myArr[j].data.push(qsywData[i]);
            break
          }
        }
      }
    }
    return myArr;
  }

  render() {
    //coreBusIndex 估值指标监控 metricsIndex O32投资系统指标监控 saleIndex 直销系统指标监控 taIndex TA指标监控
    const { overview = [], coreBusIndex = [], metricsIndex = [], saleIndex = [], taIndex = [],chartConfig = [] } = this.props
    let list1 = [], list2 = [], list7 = [], list8 = [];
    for (let i = 0; i < coreBusIndex.length; i++) {//这块数据要按指定顺序排列，所以要处理一下
      if (coreBusIndex[i]) {
        if (coreBusIndex[i].SUBGROUP === '估值资金划拨监控') {
          list1.push(coreBusIndex[i]);
        } else if (coreBusIndex[i].SUBGROUP === '估值场外交易监控') {
          list2.push(coreBusIndex[i]);
        } else if (coreBusIndex[i].SUBGROUP === '估值核算监控') {
          list7.push(coreBusIndex[i]);
        } else {
          list8.push(coreBusIndex[i]);
        }
      }
    }
    const metricsList = this.handleData(metricsIndex);
    const saleList = this.handleData(saleIndex);
    const taList = this.handleData(taIndex);
    return (
      <div className='flex1 pd10'>
        <div className="ax-card flex-c">
          <div className="pos-r">
            <div className="card-title title-c">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                {chartConfig.length && chartConfig[0].chartNote ?
                    (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                        <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                    </Tooltip>) : ''
                }
            </div>
          </div>
          <OverView intqueryStat={overview} />
          <Scrollbars
            autoHide
            style={{ width: '100%' }}
          >
            {/* 样式一*/}
             {
              coreBusIndex.length === 0 && metricsIndex.length === 0 && saleIndex.length === 0 && taIndex.length === 0 ?
                (<React.Fragment>
                  <div className="evrt-bg evrt-bgimg"></div>
                  <div className="tc pt10per blue" style={{ fontSize: '1.633rem' }}>暂无指标数据</div>
                </React.Fragment>) :
                (
                  <React.Fragment>
                    {/* <div className='flex-r h100'>
                      <div className='wid67 flex-c h100 '>
                        {
                          coreBusIndex.length > 0 ?
                            (
                              <React.Fragment>
                                <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{coreBusIndex[0] ? coreBusIndex[0].FGROUP : ''}</div>
                                <div className='flex-r' style={{ padding: '3rem 0 1rem 3rem' }}>
                                  <div className='in-side-sub flex-c'
                                    style={{ height: '100%', width: '33%' }}
                                  >
                                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list7[0] ? list7[0].SUBGROUP : ''}</div>
                                    {list7.map(i => (
                                      <IndexItem itemData={i} />))}
                                  </div>
                                  <div className='in-side-sub flex-c'
                                    style={{ height: '100%', width: '34%', paddingLeft: '8rem' }}>
                                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list8[0] ? list8[0].SUBGROUP : ''}
                                    </div>
                                    {list8.map(i => (
                                      <IndexItem itemData={i} />))}
                                  </div>
                                  <div className='in-side-sub flex-c'
                                    style={{ height: '100%', width: '33%', paddingLeft: '8rem' }}>
                                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list1[0] ? list1[0].SUBGROUP : ''}</div>
                                    {list2.map(i => (
                                      <IndexItem itemData={i} />))}
                                    <div className='in-side-sub-title in-side-sub-item' style={{ padding: '1.5rem 0 1.5rem 0' }}>{list2[0] ? list2[0].SUBGROUP : ''}</div>
                                    {list1.map(i => (
                                      <IndexItem itemData={i} />))}
                                  </div>
                                </div>
                              </React.Fragment>

                            ) : ''
                        }
                        <div className='flex-r h100 '>
                          <div className='wid50 flex-c h100 '>
                            {
                              metricsList.length > 0 ?
                                (
                                  <React.Fragment>
                                    <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{metricsList[0] ? metricsList[0].FGROUP : ''}</div>
                                    <div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>
                                      {metricsList.map(item => (
                                        <div className="in-side-sub flex-c" style={{ alignItems: "flex-start", width: '25%' }}>
                                          {item.data ? item.data.map(i => (<IndexItem itemData={i} />)) : ''}
                                        </div>
                                      ))}
                                    </div>
                                  </React.Fragment>
                                ) : ''
                            }
                          </div>
                          <div className='wid50 flex-c h100 '>
                            {
                              saleList.length > 0 ?
                                (
                                  <React.Fragment>
                                    <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{saleList[0] ? saleList[0].FGROUP : ''}</div>
                                    <div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>
                                      {saleList.map(item => (
                                        <div className="in-side-sub flex-c" style={{ alignItems: "flex-start", width: '25%' }}>
                                          {item.data ? item.data.map(i => (<IndexItem itemData={i} />)) : ''}
                                        </div>
                                      ))}
                                    </div>
                                  </React.Fragment>
                                ) : ''
                            }
                          </div>
                        </div>
                      </div>
                      <div className='h100 wid33 flex-c'>
                        {
                          taList.length > 0 ?
                            (
                              <React.Fragment>
                                <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{taList[0] ? taList[0].FGROUP : ''}</div>
                                <div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>
                                  <div className="flex-c wid50">
                                    {taList.map(item => (
                                      item && item.SUBGROUP !== 'TA重要业务监控' ?
                                        <div className="in-side-sub flex-c" style={{ alignItems: "flex-start", width: '25%' }}>
                                          <div className='in-side-sub-title in-side-sub-item fwsize' style={{ padding: '0 0 1.5rem 0', lineHeight: '2rem', fontSize: '1.725rem' }}>{item ? item.SUBGROUP : ''}</div>
                                          {item.data ? item.data.map(i => (<IndexItem itemData={i} />)) : ''}
                                        </div> : ''
                                    ))}
                                  </div>
                                  <div className="flex-c wid50">
                                    {taList.map(item => (
                                      item && item.SUBGROUP === 'TA重要业务监控' ?
                                        <div className="in-side-sub flex-c" style={{ alignItems: "flex-start", width: '25%' }}>
                                          <div className='in-side-sub-title in-side-sub-item fwsize' style={{ padding: '0 0 1.5rem 0', lineHeight: '2rem', fontSize: '1.725rem' }}>{item ? item.SUBGROUP : ''}</div>
                                          {item.data ? item.data.map(i => (<IndexItem itemData={i} />)) : ''}
                                        </div> : ''
                                    ))}
                                  </div>
                                </div>
                              </React.Fragment>
                            ) : ''
                        }
                      </div>
                    </div> */}
                    <div className='flex-c h100'>
                    {
                          coreBusIndex.length > 0 ?
                            (
                              <React.Fragment>
                                <div className='flex-r wid100 pos-r'>
                                  <div className='flex-c wid60'>
                                    <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{coreBusIndex[0] ? coreBusIndex[0].FGROUP : ''}</div>
                                    <div className='flex-r' style={{ padding: '3rem 0 1rem 3rem' }}>
                                      <div className='in-side-sub flex-c'
                                        style={{ height: '100%', width: '34%' }}
                                      >
                                        <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list7[0] ? list7[0].SUBGROUP : ''}</div>
                                        {list7.map(i => (
                                          <IndexItem itemData={i} />))}
                                      </div>
                                      <div className='in-side-sub flex-c'
                                        style={{ height: '100%', width: '34%'}}>
                                        <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list8[0] ? list8[0].SUBGROUP : ''}
                                        </div>
                                        {list8.map(i => (
                                          <IndexItem itemData={i} />))}
                                      </div>
                                      {/* <div className='in-side-sub flex-c'
                                        style={{ height: '100%', width: '20%'}}>
                                        <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list8[0] ? list8[0].SUBGROUP : ''}
                                        </div>
                                        {list2.map(i => (
                                          <IndexItem itemData={i} />))}
                                      </div>
                                      <div className='in-side-sub flex-c'
                                        style={{ height: '100%', width: '20%'}}>
                                        <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list8[0] ? list8[0].SUBGROUP : ''}
                                        </div>
                                        {list1.map(i => (
                                          <IndexItem itemData={i} />))}
                                      </div> */}
                                      

                                      <div className='in-side-sub flex-c' style={{ height: '100%', width: '33%'}}>
                                        <div className='in-side-sub-title in-side-sub-item' style={{ padding: '0 0 1.5rem 0' }}>{list1[0] ? list1[0].SUBGROUP : ''}</div>
                                        {list2.map(i => (
                                          <IndexItem itemData={i} />))}
                                        <div className='in-side-sub-title in-side-sub-item' style={{ padding: '1.5rem 0 1.5rem 0' }}>{list2[0] ? list2[0].SUBGROUP : ''}</div>
                                        {list1.map(i => (
                                          <IndexItem itemData={i} />))}
                                      </div>
                                    </div>
                                  </div>
                                  <img src={[require("../../../../../image/jx.png")]} alt="" className="pos-a" style={{width:'1px', height:'24rem',left: '60%', top: 'calc(50% - 11rem)' }} />
                                  <div className='flex-c wid20'>
                                  {
                                    metricsList.length > 0 ?
                                      (
                                        <React.Fragment>
                                          <div className="fwsize" style={{ padding: '1rem 0px 1rem 3.5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{metricsList[0] ? metricsList[0].FGROUP : ''}</div>
                                          <div className="flex-r" style={{ padding: '3rem 0 1rem 1rem' }}>
                                            {metricsList.map(item => (
                                              <div className="in-side-sub flex-c" style={{ alignItems: "flex-start", width: '25%' }}>
                                                <div className='in-side-sub-title in-side-sub-item fwsize' style={{ padding: '0 0 1.5rem 0', lineHeight: '2rem', fontSize: '1.725rem' }}>{item ? item.SUBGROUP : ''}</div>
                                                {item.data ? item.data.map(i => (<IndexItem itemData={i} />)) : ''}
                                              </div>
                                            ))}
                                          </div>
                                        </React.Fragment>
                                      ) : ''
                                  }
                                  </div>
                                  <img src={[require("../../../../../image/jx.png")]} alt="" className="pos-a" style={{width:'1px', height:'24rem', left: '80%', top: 'calc(50% - 11rem)' }} />

                                  <div className='flex-c wid20'>
                                  {
                                    saleList.length > 0 ?
                                      (
                                        <React.Fragment>
                                          <div className="fwsize" style={{ padding: '1rem 0px 1rem 3.5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{saleList[0] ? saleList[0].FGROUP : ''}</div>
                                          <div className="flex-r" style={{ padding: '3rem 0 1rem 1rem' }}>

                                            {saleList.map(item => (
                                              <div className="in-side-sub flex-c" style={{ alignItems: "flex-start", width: '25%' }}>
                                                <div className='in-side-sub-title in-side-sub-item fwsize' style={{ padding: '0 0 1.5rem 0', lineHeight: '2rem', fontSize: '1.725rem' }}>{item ? item.SUBGROUP : ''}</div>
                                                {item.data ? item.data.map(i => (<IndexItem itemData={i} />)) : ''}
                                              </div>
                                            ))}
                                          </div>
                                        </React.Fragment>
                                      ) : ''
                                  }
                                  </div>
                                </div>
                                

                              </React.Fragment>

                            ) : ''
                        }
                        {
                          taList.length > 0 ?
                            (
                              <React.Fragment>
                                <div className='flex-c wid100'>
                                  <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{taList[0] ? taList[0].FGROUP : ''}</div>
                                  <div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>
                                      {taList.map(item => (
                                        <div className="in-side-sub flex-c" style={{ alignItems: "flex-start", width: '20%' }}>
                                        <div className='in-side-sub-title in-side-sub-item fwsize' style={{ padding: '0 0 1.5rem 0', lineHeight: '2rem', fontSize: '1.725rem' }}>{item ? item.SUBGROUP : ''}</div>
                                        {item.data ? item.data.map(i => (<IndexItem itemData={i} />)) : ''}
                                        </div> 
                                      ))}
                                  </div>
                                </div>
                                
                              </React.Fragment>
                            ) : ''
                        }
                        {/* {
                            metricsList.length > 0 ?
                              (
                                <React.Fragment>
                                  <div className='flex-c wid100'>
                                    <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{metricsList[0] ? metricsList[0].FGROUP : ''}</div>
                                    <div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>
                                        {metricsList.map(item => (
                                          <div className="in-side-sub flex-r wid100" style={{ alignItems: "flex-start" }}>
                                            {item.data ? item.data.map(i => (
                                              <div className = 'wid20'>
                                                <IndexItem itemData={i} />
                                              </div>
                                            )) : ''}
                                          </div> 
                                        ))}
                                    </div>
                                  </div>
                                  
                                </React.Fragment>
                              ) : ''
                          }
                          {
                            saleList.length > 0 ?
                              (
                                <React.Fragment>
                                  <div className='flex-c wid10'>
                                    <div className="fwsize" style={{ padding: '1rem 0px 1rem 5rem', lineHeight: '4.167rem', fontSize: '2rem', height: '4.167rem', fontWeight: '800' }}>{saleList[0] ? saleList[0].FGROUP : ''}</div>
                                    <div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>
                                        {saleList.map(item => (
                                          <div className="in-side-sub flex-r wid100" style={{ alignItems: "flex-start" }}>
                                            {item.data ? item.data.map(i => (
                                              <div className = 'wid20'>
                                                <IndexItem itemData={i} />
                                              </div>
                                            )) : ''}
                                          </div> 
                                        ))}
                                    </div>
                                  </div>
                                  
                                </React.Fragment>
                              ) : ''
                          } */}
                    </div>
                  </React.Fragment>
                )
            } 
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default LeftBlock;
