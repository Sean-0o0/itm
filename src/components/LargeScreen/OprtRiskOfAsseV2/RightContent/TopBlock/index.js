import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';

export class TopBlock extends Component {

  state = {
    tmpl: [],
  };

  //将数组按INDEXNO顺序排序
  getSortList = (arr) => {
    let teml = arr;
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
  };

  bgColor = (state) => {
    if (state === '1') {
      return '#C6E2FF';
    } else if (state === '2') {
      return '#D34643';
    } else if (state === '3') {
      return '#F7B432';
    } else {
      return '#AAAAAA';
    }
  };

  getBackGround = (indexStatus) => {
    let background = 'squreKey pos-r';
    if (indexStatus === '2') {
      background = 'squreRed pos-r';
    }
    return background;
  };

  getIcon = (state) => {
    if (state === '1') {
      return <img className='jk-side-img2' src={[require('../../../../../image/icon_completed.png')]} alt='' />;
    } else if (state === '2') {
      return <img className='jk-side-img2' src={[require('../../../../../image/icon_abnormal.png')]} alt='' />;
    } else if (state === '3') {
      return <img className='jk-side-img2' src={[require('../../../../../image/icon_edit.png')]} alt='' />;
    } else {
      return <img className='jk-side-img2' src={[require('../../../../../image/icon_nostart.png')]} alt='' />;
    }
  };

  stateTxt = (state) => {
    if (state === '1') {
      return '检查正常';
    } else if (state === '2') {
      return '检查异常';
    } else if (state === '3') {
      return '手工确认';
    } else {
      return '未开始';
    }
  };

  render() {
    const { chartConfig = [], operCheck = [] } = this.props;
    const sortList = this.getSortList(operCheck);
    return (
      <div className='wid100 h100 pd10'>
        <div className='ax-card pos-r flex-c'>
          <div className='pos-r'>
            <div
              className='card-title title-r'>{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
              {chartConfig.length && chartConfig[0].chartNote ?
                (<Tooltip placement='top' title={<div>{chartConfig[0].chartNote.split('\n').map((item, index) => {
                  return <span key={index}>{item}<br /></span>;
                })}</div>}>
                  <img className='title-tip' src={[require('../../../../../image/icon_tip.png')]} alt='' />
                </Tooltip>) : ''
              }
            </div>
          </div>
          {/*<Scrollbars*/}
          {/*  autoHide*/}
          {/*  style={{ width: '100%' }}*/}
          {/*>*/}
            {
              operCheck.length === 0 ?
                (<React.Fragment>
                  <div className='evrt-bg evrt-bgimg'></div>
                  <div className='tc pt10per blue'
                       style={{ fontSize: '1.633rem' }}>暂无{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}</div>
                </React.Fragment>) :
                <div className='flex-c h100' style={{justifyContent: 'center'}}>
                  <div className='flex-r' style={{
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    padding: '0rem 1.5rem',
                    height: '45%',
                    alignItems: 'center'
                  }}>
                    {
                      sortList.map((e, idx) => {
                        const { INDEXNAME: indexName, INDEXSTATUS: indexStatus, INDEXSTATUSN: indexStatusN } = e;
                        if (idx < 3) {
                          return (
                            <div className='pd6 h100' style={{ width: '32%', alignItems: 'center',height: '90%' }}>
                              <div className={`${this.getBackGround(indexStatus)}`} style={{ height: '100%' }}>
                                <div className='flex-c' style={{ justifyContent: 'center' }}>
                                  <div className='fwsize' style={{ position: 'absolute', top: '20%',textAlign: 'center',width: '100%',fontSize: '1.633rem' }}>{indexName}</div>
                                  <div className='' style={{ position: 'absolute', top: '65%',textAlign: 'center',width: '100%' }}>
                                      <div className='fwsize' style={{ color: `${this.bgColor(indexStatus)}`,fontSize: '1.633rem' }}>{this.getIcon(indexStatus)} {this.stateTxt(indexStatus)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })
                    }
                  </div>
                  <div className='flex-r' style={{
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    padding: '0rem 1.5rem',
                    height: '45%',
                    alignItems: 'center'
                  }}>
                    {
                      sortList.map((e, idx) => {
                        const { INDEXNAME: indexName, INDEXSTATUS: indexStatus, INDEXSTATUSN: indexStatusN } = e;
                        if (idx >= 3 && idx < 6) {
                          return (
                            <div className='pd6 h100' style={{ width: '32%', alignItems: 'center',height: '90%' }}>
                              <div className={`${this.getBackGround(indexStatus)}`} style={{ height: '100%' }}>
                                <div className='flex-c' style={{ justifyContent: 'center'}}>
                                  <div className='fwsize' style={{ position: 'absolute', top: '20%',textAlign: 'center',width: '100%',fontSize: '1.633rem' }}>{indexName}</div>
                                  <div className='' style={{ position: 'absolute', top: '65%',textAlign: 'center',width: '100%' }}>
                                    <div className='fwsize' style={{ color: `${this.bgColor(indexStatus)}`,fontSize: '1.633rem' }}>{this.getIcon(indexStatus)} {this.stateTxt(indexStatus)}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })
                    }
                  </div>
                </div>
            }
          {/*</Scrollbars>*/}
        </div>
      </div>
    );
  }
}

export default TopBlock;
