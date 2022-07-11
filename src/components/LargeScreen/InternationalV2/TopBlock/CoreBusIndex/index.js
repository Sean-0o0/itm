import React, { Component } from 'react';
import { Tooltip } from 'antd';
import IndexItem from './IndexItem';
import { Scrollbars } from 'react-custom-scrollbars';
import ZgywItem from './ZgywItem'

export class CoreBusIndex extends Component {
	render() {
    const { chartConfig = [], data = [] } = this.props;
    let list1 = [], list2 = [], list3 = [], list4 = [], list5 = [], list6 = [] , list7 = [], list8 = [];
    for(let i = 0; i < data.length; i++){
      if(data[i]){
        if(data[i].SUBGROUPCODE === '02ach_GPQS'){
          list1.push(data[i]);
        }else if(data[i].SUBGROUPCODE === '02ach_QHQQ'){
          list2.push(data[i]);
        }else if(data[i].SUBGROUPCODE === '02ach_ZQDZ'){
          list3.push(data[i]);
        }else if(data[i].SUBGROUPCODE === '02ach_GSXW'){
          list4.push(data[i]);
        }else if(data[i].SUBGROUPCODE === '02ach_CWCP') {
          list5.push(data[i]);
        }else if(data[i].SUBGROUPCODE === '02ach_ZJYW') {
          list6.push(data[i]);
        }else if(data[i].SUBGROUPCODE === '02ach_ZGYW') {
          list7.push(data[i]);
        }else if(data[i].SUBGROUPCODE === '02ach_JGYW') {
          list8.push(data[i]);
        }

      }
    }
		return (
      <div className="flex1 pd10">
        	<div className="ax-card flex-c">
       	<div className="pos-r">
        	<div className="card-title title-l">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
        	{chartConfig.length && chartConfig[0].chartNote ?
          					(<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
          						<img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
          					</Tooltip>) : ''
          				}
          			</div>
          		</div>
              {data.length === 0 ?
                (<React.Fragment>
                  <div className="evrt-bg evrt-bgimg"></div>
                  <div className="tc blue" style={{fontSize:'1.633rem'}}>暂无数据</div>
                </React.Fragment>) :
              (<Scrollbars
                autoHide
                style={{ width: '100%' }}>
                <div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>
                    <div className="in-side-sub flex-c"
                         style={{ height: '100%',width: '25%' }}>
                      <div className="in-side-sub-title in-side-sub-item"
                           style={{  padding: '0 0 1rem 0' }}>{list1[0]?list1[0].SUBGROUP:''}{list1[0]?" "+list1[0].SUBGROUPNUM:''} </div>
                        <IndexItem item={list1}  />
                      <div className="in-side-sub-title in-side-sub-item"
                           style={{  padding: '1rem 0 1rem 0' }}>{list2[0]?list2[0].SUBGROUP:''}{list2[0]?" "+list2[0].SUBGROUPNUM:''} </div>
                      <IndexItem item={list2}  />
                    </div>
                  <div className="in-side-sub flex-c"
                       style={{ width: '25%' }}>
                    <div className="in-side-sub-title in-side-sub-item"
                         style={{ padding: '0 0 1rem 0' }}>{list5[0]?list5[0].SUBGROUP:''}{list5[0]?" "+list5[0].SUBGROUPNUM:''} </div>
                    <IndexItem item={list5}  />
                    <div className="in-side-sub-title in-side-sub-item"
                         style={{  padding: '1rem 0 1rem 0' }}>{list3[0]?list3[0].SUBGROUP:''}{list3[0]?" "+list3[0].SUBGROUPNUM:''} </div>
                    <IndexItem item={list3}  />
                  </div>
                  <div className="in-side-sub flex-c"
                       style={{ width: '25%' }}>
                    <div className="in-side-sub-title in-side-sub-item"
                         style={{ padding: '0 0 1rem 0' }}>{list8[0]?list8[0].SUBGROUP:''}{list8[0]?" "+list8[0].SUBGROUPNUM:''} </div>
                    <IndexItem item={list8}  />
                    <div className="in-side-sub-title in-side-sub-item"
                         style={{  padding: '1rem 0 1rem 0' }}>{list4[0]?list4[0].SUBGROUP:''}{list4[0]?" "+list4[0].SUBGROUPNUM:''} </div>
                    <IndexItem item={list4}  />
                  </div>
                  <div className="in-side-sub flex-c"
                       style={{ width: '25%' }}>
                    <div className="in-side-sub-title in-side-sub-item"
                         style={{ padding: '0 0 1rem 0' }}>{list6[0]?list6[0].SUBGROUP:''}{list6[0]?" "+list6[0].SUBGROUPNUM:''} </div>
                    <IndexItem item={list6}  />
                    <div className="in-side-sub-title in-side-sub-item"
                         style={{  padding: '1rem 0 1rem 0' }}>{list7[0]?list7[0].SUBGROUP:''} {list7[0]?" "+list7[0].SUBGROUPNUM:''}</div>
                    <IndexItem item={list7}  />
                  </div>
                </div>
                {/*<div style={{ padding: '0rem 0 1rem 3rem' }}>*/}
                {/*  <div className="in-side-sub">*/}
                {/*<div className="in-side-sub-title in-side-sub-item"*/}
                {/*     style={{  padding: '0 0 1rem 0' }}>{list7[0]?list7[0].SUBGROUP:''} {list7[0]?" "+list7[0].SUBGROUPNUM:''}</div>*/}
                {/*<IndexItem item={list7}  />*/}
                {/*  </div>*/}
                {/*</div>*/}

                {/*循环遍历输出*/}
                {/*<div className="flex-r" style={{ padding: '3rem 0 1rem 3rem' }}>*/}
                {/*  {taskStateList.map((item, index) => (*/}
                {/*    <div className="in-side-sub flex-c"*/}
                {/*         style={{ width: '25%' }}>*/}
                {/*      <div className="in-side-sub-title in-side-sub-item"*/}
                {/*           style={{ padding: '0 0 1.5rem 0' }}>{taskStateList[index] ? taskStateList[index].SUBGROUP : ''} </div>*/}
                {/*      <IndexItem item={item.data} />*/}
                {/*    </div>*/}
                {/*  ))}*/}
                {/*</div>*/}
              </Scrollbars>)}
          </div>
      </div>

		)
	}
}

export default CoreBusIndex
