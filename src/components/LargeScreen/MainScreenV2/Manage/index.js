import React from 'react';
import { connect } from 'dva';
import { FetchQueryChartIndexData } from '../../../../services/largescreen';
import { message } from 'antd';


class Monitor extends React.Component {
  state = {
    sortedData0: [],
    sortedData1: [],
    sortedData2: [],
    sortedData3: [],
    sortedData4: [],
    sortedData5: [],
  };

  componentDidMount() {
    //查询指标状态
    this.fetchData();
  }

  componentWillUnmount() {

  }

  //指标状态
  fetchData = () => {
    FetchQueryChartIndexData({
      //集团运营概况
      chartCode: 'GroupOperOverview',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          const sorted = this.handleDataByGroup(data, function(item) {
            //按照LARGEGROUP进行分组
            return [item.LARGEGROUP];
          });
          //将data分成三组,三组样式不一样。【0-2,3,4-5】
          this.setState({
            sortedData0: sorted.slice(0, 1),
            sortedData1: sorted.slice(1, 2),
            sortedData2: sorted.slice(2, 3),
            sortedData3: sorted.slice(3, 4),
            sortedData4: sorted.slice(4, 5),
            sortedData5: sorted.slice(5, 6),
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //数据分组方法
  handleDataByGroup = (data, f) => {
    const groups = {};
    data.forEach(function(o) { //注意这里必须是forEach 大写
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
      return groups[group];
    });
  };

  //按照SUBGROUP进行分组
  handleDataBySubGroup = (data) => {
    const sorted = this.handleDataByGroup(data, function(item) {
      //按照SUBGROUP进行分组
      return [item.SUBGROUP];
    });
    //console.log('---sorted----', sorted);
    return sorted;
  };

  handleStyle = (status, value) => {
    if (status) {
      switch (status) {
        case "待处理":
          return 'orange';
        case "已完成":
          return 'blue';
        case "已审核":
          return 'blue';
        case "已办结":
          return 'blue';
        case "异常":
          if(value !== '0'){
            return 'red';
          }
          return '';
        default:
          return '';
      }
    }
  };


  render() {

    const {
      sortedData0 = [],
      sortedData1 = [],
      sortedData2 = [],
      sortedData3 = [],
      sortedData4 = [],
      sortedData5 = [],
    } = this.state;
    return (
      <div className='ax-card flex-c'>
        <div className='pos-r'>
          <div className='card-title title-c'>集团运营管理部</div>
        </div>
        <div style={{ padding: '0 2rem', height: 'calc(100% - 3.667rem)' }}>
          {sortedData0.map((item) => {
            let sorted = [];
            sorted = this.handleDataBySubGroup(item);
            return (
              <div className='h20 flex-c'>
                <div className='flex1 flex-r'
                     style={{ alignItems: 'center', justifyContent: 'center' }}>{item[0].LARGEGROUP}
                </div>
                <div className='mana-squre flex-c flex3'>
                  {sorted.map((item) => {
                    return (<div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      <div style={{ width: '10rem' }}>{item[0].SUBGROUP}</div>
                      <div className='flex-r flex1'>
                        {item.map((item) => {
                          return (<div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;<span
                            className={this.handleStyle(item.INDEXNAME,item.INDEXVALUE)}>{item.INDEXVALUE}</span></div>);
                        })}
                      </div>
                    </div>);
                  })}
                </div>
              </div>);
          })}
          {sortedData1.map((item) => {
            let sorted = [];
            sorted = this.handleDataBySubGroup(item);
            return (
              <div className='h14 flex-c'>
                <div className='flex1 flex-r'
                     style={{ alignItems: 'center', justifyContent: 'center' }}>{item[0].LARGEGROUP}
                </div>
                <div className='mana-squre flex-c flex2'>
                  {sorted.map((item) => {
                    return (<div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      <div style={{ width: '10rem' }}>{item[0].SUBGROUP}</div>
                      <div className='flex-r flex1'>
                        {item.map((item) => {
                          return (<div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;
                          <span className={this.handleStyle(item.INDEXNAME)}>{item.INDEXVALUE}</span></div>);
                        })}
                      </div>
                    </div>);
                  })}
                </div>
              </div>);
          })}
          {sortedData2.map((item) => {
            let sorted = [];
            sorted = this.handleDataBySubGroup(item);
            return (
              <div className='h20 flex-c'>
                <div className='flex1 flex-r'
                     style={{ alignItems: 'center', justifyContent: 'center' }}>{item[0].LARGEGROUP}
                </div>
                <div className='mana-squre flex-c flex3'>
                  {sorted.map((item) => {
                    return (<div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      <div style={{ width: '10rem' }}>{item[0].SUBGROUP}</div>
                      <div className='flex-r flex1'>
                        {item.map((item) => {
                          return (<div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;<span
                            className={this.handleStyle(item.INDEXNAME)}>{item.INDEXVALUE}</span></div>);
                        })}
                        {/*<div className='flex1 tc'>{item.INDEXNAME}&nbsp;&nbsp;<span>0</span></div>*/}
                        {/*<div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;<span className='blue'>16</span></div>*/}
                      </div>
                    </div>);
                  })}
                </div>
              </div>);
          })}
          {
            sortedData3.map((item) => {
              let sorted1 = [];
              sorted1 = this.handleDataBySubGroup(item);
              return (<div className='h14 flex-c'>
                  <div className='flex1 flex-r'
                       style={{ alignItems: 'center', justifyContent: 'center' }}>{item[0].LARGEGROUP}</div>
                  <div className='mana-squre flex-c flex2'>
                    <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      {sorted1.map((item) => {
                        return (item.slice(0, 2).map((item, key) => {
                          return (
                            key % 2 === 0 ?
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue'>{item.INDEXVALUE}笔</span>
                              </div>
                              :
                              <div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue'>{item.INDEXVALUE}笔</span>
                              </div>
                          );
                        }));
                      })}
                    </div>
                    <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      {sorted1.map((item) => {
                        return (item.slice(2, 4).map((item, key) => {
                          return (
                            key % 2 === 0 ?
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue'>{item.INDEXVALUE}笔</span>
                              </div>
                              :
                              <div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue fr'>{item.INDEXVALUE}笔</span>
                              </div>
                          );
                        }));
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          {
            sortedData4.map((item) => {
              let sorted1 = [];
              sorted1 = this.handleDataBySubGroup(item);
              return (<div className='h14 flex-c'>
                  <div className='flex1 flex-r'
                       style={{ alignItems: 'center', justifyContent: 'center' }}>{item[0].LARGEGROUP}</div>
                  <div className='mana-squre flex-c flex2'>
                    <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      {sorted1.map((item) => {
                        return (item.slice(0, 2).map((item, key) => {
                          return (
                            key % 2 === 0 ?
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue'>{item.INDEXVALUE}笔</span>
                              </div>
                              :
                              <div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue'>{item.INDEXVALUE}笔</span>
                              </div>
                          );
                        }));
                      })}
                    </div>
                    <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      {sorted1.map((item) => {
                        return (item.slice(2, 4).map((item, key) => {
                          return (
                            key % 2 === 0 ?
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue fr'>{item.INDEXVALUE}</span>
                              </div>
                              :
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue fr'>{item.INDEXVALUE}</span>
                              </div>
                          );
                        }));
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          {
            sortedData5.map((item) => {
              let sorted1 = [];
              sorted1 = this.handleDataBySubGroup(item);
              return (<div className='h14 flex-c'>
                  <div className='flex1 flex-r'
                       style={{ alignItems: 'center', justifyContent: 'center' }}>{item[0].LARGEGROUP}</div>
                  <div className='mana-squre flex-c flex2'>
                    <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      {sorted1.map((item) => {
                        return (item.slice(0, 2).map((item, key) => {
                          return (
                            key % 2 === 0 ?
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue'>{item.INDEXVALUE}笔</span>
                              </div>
                              :
                              <div className='flex1 tr'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue'>{item.INDEXVALUE}笔</span>
                              </div>
                          );
                        }));
                      })}
                    </div>
                    <div className='flex-r flex1' style={{ alignItems: 'center' }}>
                      {sorted1.map((item) => {
                        return (item.slice(2, 4).map((item, key) => {
                          return (
                            key % 2 === 0 ?
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue fr'>{item.INDEXVALUE}</span>
                              </div>
                              :
                              <div className='flex1'>{item.INDEXNAME}&nbsp;&nbsp;<span
                                className='blue fr'>{item.INDEXVALUE}</span>
                              </div>
                          );
                        }));
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({}))(Monitor);
