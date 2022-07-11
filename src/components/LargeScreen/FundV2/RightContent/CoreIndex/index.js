import React, { Component } from 'react';
import { Tooltip } from 'antd';
// import IndexStatus from './IndexStatus';
// import { Scrollbars } from 'react-custom-scrollbars';

export class CoreIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

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

    componentDidMount() {

    }

    render() {
        const { chartConfig = [], dataList = [] } = this.props;
        return (
            <div className="ax-card flex-c">
                <div className="pos-r">
                    <div className="card-title title-r">{chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                        {chartConfig.length && chartConfig[0].chartNote ?
                            (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                <img className="title-tip" src={[require("../../../../../image/icon_tip.png")]} alt="" />
                            </Tooltip>) : ''
                        }
                    </div>
                </div>
                {dataList.length === 0 ?
                    (<React.Fragment>
                        <div className="evrt-bg evrt-bgimg"></div>
                        <div className="tc blue" style={{ fontSize: '1.633rem' }}>暂无数据</div>
                    </React.Fragment>) :
                    // (<Scrollbars
                    //     autoHide
                    //     style={{ width: '100%' }}
                    // >
                    //     <div className="flex-r" style={{ justifyContent: "space-between", flexWrap: "wrap",padding:"0 1.5rem" }}>
                    //         {
                    //             dataList.map(item =>
                    //                 <IndexStatus content={item} />
                    //             )
                    //         }
                    //     </div>

                    // </Scrollbars>)
                    <div className='flex-c h100' style={{justifyContent: 'center'}}>
                  <div className='flex-r' style={{
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    padding: '0rem 1.5rem',
                    height: '45%',
                    alignItems: 'center'
                  }}>
                    {
                      dataList.map((e, idx) => {
                        const { IDX_NM: indexName, STATE: indexStatus } = e;
                        if (idx < 3) {
                          return (
                            <div className='pd6 h100' style={{ width: '30%', alignItems: 'center',height: '90%' }}>
                              <div className={`${this.getBackGround(indexStatus)}`} style={{ height: '100%' }}>
                                <div className='flex-c' style={{ justifyContent: 'center' }}>
                                  <div className='fwsize' style={{ position: 'absolute', top: '20%',textAlign: 'center',width: '100%',fontSize: '1.633rem' }}>{indexName}</div>
                                  <div className='flex-r' style={{ position: 'absolute', top: '65%',left: '26%',width: '100%' }}>
                                    <div>{this.getIcon(indexStatus)}</div>
                                    <div className='fwsize' style={{ color: `${this.bgColor(indexStatus)}`,fontSize: '1.633rem' }}>{this.stateTxt(indexStatus)}</div>
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
                      dataList.map((e, idx) => {
                        const { IDX_NM: indexName, STATE: indexStatus } = e;
                        if (idx >= 3 && idx < 6) {
                          return (
                            <div className='pd6 h100' style={{ width: '30%', alignItems: 'center',height: '90%' }}>
                              <div className={`${this.getBackGround(indexStatus)}`} style={{ height: '100%' }}>
                                <div className='flex-c' style={{ justifyContent: 'center'}}>
                                  <div className='fwsize' style={{ position: 'absolute', top: '20%',textAlign: 'center',width: '100%',fontSize: '1.633rem' }}>{indexName}</div>
                                  <div className='flex-r' style={{ position: 'absolute', top: '65%',left: '26%',width: '100%' }}>
                                    <div>{this.getIcon(indexStatus)}</div>
                                    <div style={{ color: `${this.bgColor(indexStatus)}`,fontSize: '1.633rem' }}>{this.stateTxt(indexStatus)}</div>
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
            </div>
        )
    }
}

export default CoreIndex

