import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import ForthBlock from '../../ForthBlock';
import IndexItem from '../IndexItem';

export class LeftBlock extends Component {

  state = {
    serChk: [],
  };

  getSonGroupList = (arr) => {
    let map = {};
    let myArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (!map[arr[i].SUBGROUP]) {
        myArr.push({
          SUBGROUP: arr[i].SUBGROUP,
          data: [arr[i]],
        });
        map[arr[i].SUBGROUP] = arr[i];
      } else {
        for (let j = 0; j < myArr.length; j++) {
          if (arr[i].SUBGROUP === myArr[j].SUBGROUP) {
            myArr[j].data.push(arr[i]);
            break;
          }
        }
      }
    }
    return myArr;
  };

  render() {
    const { intqueryStat = [], dataList = [], dataList2 = [] } = this.props;
    //list1估值日常检查 list2估值清算前检查指标 list3估值清算后检查指标 list4自TA清算后检查 list5(O32系统清算流程)
    let list1 = [], list2 = [], list3 = [], list4 = [], list5 = [], list6 = [], list7 = [], list8 = [];
    if (dataList[0]) {
      if (dataList[0].GROUPNAME === '估值业务检查指标监控') {
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i]) {
            if (dataList[i].SUB_CODE === '04chk_GZRC') {
              list1.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_XZZG20') {
              list2.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_GZQSZ') {
              list3.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_XZZGQSH') {
              list4.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_QSQJC') {
              list5.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_QSZJC') {
              list6.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_QSHJC') {
              list7.push(dataList[i]);
            }
          }
        }
      } else {
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i]) {
            if (dataList[i].SUB_CODE === '04chk_XZZG101') {
              list1.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_XZZGRCJC') {
              list2.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_XZZG300') {
              list3.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_XZZGQSHJC') {
              list4.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_XZZG10') {
              list5.push(dataList[i]);
            } else if (dataList[i].SUB_CODE === '04chk_ZJQSJC') {
              list6.push(dataList[i]);
            }
          }
        }
      }
    }


    // let list9 = [], list10 = [], list11 = [], list12 = [], list13 = [];
    // for (let i = 0; i < dataList2.length; i++) {
    //   if (dataList2[i]) {
    //     if (dataList2[i].SUB_CODE === '04chk_XZZG101') {
    //       list9.push(dataList2[i]);
    //     } else if (dataList2[i].SUB_CODE === '04chk_XZZGRCJC') {
    //       list10.push(dataList2[i]);
    //     } else if (dataList2[i].SUB_CODE === '04chk_XZZG300') {
    //       list11.push(dataList2[i]);
    //     } else if (dataList2[i].SUB_CODE === '04chk_XZZGQSHJC') {
    //       list12.push(dataList2[i]);
    //     } else if (dataList2[i].SUB_CODE === '04chk_XZZG10') {
    //       list13.push(dataList2[i]);
    //     }
    //   }
    // }
    return (
      <div className='flex1 pd10'>
        <div className='ax-card flex-c'>
          <div className='pos-r'>
            <div className='card-title title-l'>{dataList[0] ? dataList[0].GROUPNAME : '------'}</div>
          </div>
          {/*<ForthBlock intqueryStat={intqueryStat} />*/}
          <Scrollbars
            autoHide
            style={{ width: '100%' }}
          >
            {
              dataList.length === 0 ?
                (<React.Fragment>
                  <div className='evrt-bg evrt-bgimg'></div>
                  <div className='tc pt10per blue'
                       style={{ fontSize: '1.633rem' }}>暂无{dataList[0] ? dataList[0].GROUPNAME : '------'}</div>
                </React.Fragment>) :
                dataList[0].GROUPNAME === '估值业务检查指标监控' ?
                  <div className='flex-r' style={{ padding: '3rem 0 1rem 3rem' }}>
                    <div className='in-side-sub flex-c' style={{ alignItems: 'flex-start', width: '33.33%' }}>
                      {
                        list1[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list1[0] ? list1[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list1.map(i => (<IndexItem itemData={i} />))}
                      {
                        list2[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list2[0] ? list2[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list2.map(i => (<IndexItem itemData={i} />))}
                      <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                        padding: '0 0 1rem 0',
                        lineHeight: '2rem',
                        fontSize: '1.725rem',
                      }}>{list3[0] ? list3[0].SUBGROUP : ''}</div>
                      {list3.map(i => (<IndexItem itemData={i} />))}
                    </div>
                    <div className='in-side-sub flex-c' style={{ alignItems: 'flex-start', width: '33.33%' }}>
                      <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                        padding: '0 0 1rem 0',
                        lineHeight: '2rem',
                        fontSize: '1.725rem',
                      }}>{list4[0] ? list4[0].SUBGROUP : ''}</div>
                      {list4.map(i => (<IndexItem itemData={i} />))}
                    </div>
                    <div className='in-side-sub flex-c' style={{ alignItems: 'flex-start', width: '33.33%' }}>
                      {
                        list5[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list5[0] ? list5[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list5.map(i => (<IndexItem itemData={i} />))}
                      {
                        list6[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list6[0] ? list6[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list6.map(i => (<IndexItem itemData={i} />))}
                      {
                        list7[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list7[0] ? list7[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list7.map(i => (<IndexItem itemData={i} />))}
                      <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                        padding: list7[0] ? '1rem 0 1rem 0' : '0rem 0 1.5rem 0',
                        lineHeight: '2rem',
                        fontSize: '1.725rem',
                      }}>{list8[0] ? list8[0].SUBGROUP : ''}</div>
                      {list8.map(i => (<IndexItem itemData={i} />))}
                    </div>
                  </div> :
                  <div className='flex-r' style={{ padding: '3rem 0 1rem 3rem' }}>
                    <div className='in-side-sub flex-c'
                         style={{ alignItems: 'flex-start', height: '100%', width: '33.33%' }}>
                      {
                        list2[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list2[0] ? list2[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list2.map(i => (<IndexItem itemData={i} />))}
                      <div className='in-side-sub-title in-side-sub-item' style={{
                        padding: '0 0 1rem 0',
                        fontWeight: '800',
                        lineHeight: '2rem',
                      }}>{list3[0] ? list3[0].SUBGROUP : ''}</div>
                      {list3.map(i => (<IndexItem itemData={i} />))}
                    </div>
                    <div className='in-side-sub flex-c'
                         style={{ alignItems: 'flex-start', height: '100%', width: '33.33%' }}>
                      {
                        list4[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list4[0] ? list4[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list4.map(i => (<IndexItem itemData={i} />))}
                      <div className='in-side-sub-title in-side-sub-item' style={{
                        padding: '0 0 1rem 0',
                        fontWeight: '800',
                        lineHeight: '2rem',
                      }}>{list5[0] ? list5[0].SUBGROUP : ''}</div>
                      {list5.map(i => (<IndexItem itemData={i} />))}
                    </div>
                    <div className='in-side-sub flex-c'
                         style={{ alignItems: 'flex-start', height: '100%', width: '33.33%' }}>
                      {
                        list1[0] ? <div className='in-side-sub-title in-side-sub-item fwsize' style={{
                            padding: '0 0 1rem 0',
                            lineHeight: '2rem',
                            fontSize: '1.725rem',
                          }}>{list1[0] ? list1[0].SUBGROUP : ''}</div> :
                          <div></div>
                      }
                      {list1.map(i => (<IndexItem itemData={i} />))}
                      <div className='in-side-sub-title in-side-sub-item' style={{
                        padding: '0 0 1rem 0',
                        fontWeight: '800',
                        lineHeight: '2rem',
                      }}>{list6[0] ? list6[0].SUBGROUP : ''}</div>
                      {list6.map(i => (<IndexItem itemData={i} />))}
                    </div>
                  </div>
            }
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default LeftBlock;
