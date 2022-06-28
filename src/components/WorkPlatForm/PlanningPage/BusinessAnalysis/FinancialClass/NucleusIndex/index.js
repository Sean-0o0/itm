import React, { Component } from 'react';
import { Row, Col, Card, Progress } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { FetchQueryBusAnalFinanceFirst } from '../../../../../../services/planning/planning';
import moment from 'moment';


import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';

class NucleusIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //showExpense: true
      // 核心指标卡片数据
      coreIndexCardList: [],

      // 趋势图年份
      year: [],
      // 营业收入
      taking: [],
      // 剔除仓库营收
      taking2: [],
      // 净利润
      profit: [],
    };
  }

  toggleContent = (e) => {
    let { changeExpenseArray, showExpense } = this.props;
    changeExpenseArray(0, !showExpense);
  };

  /**
   * 经营分析财务类核心指标查询
   *  @param {number} param  month|月份; orgId|组织机构ID; type|类型
   *  @returns {object} null
   */
  handleFetchQueryBusAnalFinanceFirst = (param) => {
    FetchQueryBusAnalFinanceFirst({
      'month': param.month,
      'orgId': param.orgId,
      'type': param.type,
    }).then(res => {
      let { code = 0, result = [] } = res;
      if (code === 1) {
        let obj = JSON.parse(result);
        let defaultData = [{
          MON: 0, //月份
          INDIID: 0, //指标ID
          INDINAME: '', //指标名称
          INDI_VAL: 0, //当月指标值
          TOTL_VAL: 0, //本年指标值
          YOY_MON: 0, //月同比
          GROWTH_MON: 0, //月环比
          GROWTH_YEAR: 0, //年环比
        }, {
          MON: 0, //月份
          INDIID: 0, //指标ID
          INDINAME: '', //指标名称
          INDI_VAL: 0, //当月指标值
          TOTL_VAL: 0, //本年指标值
          YOY_MON: 0, //月同比
          GROWTH_MON: 0, //月环比
          GROWTH_YEAR: 0, //年环比
        }];
        this.setState({
          coreIndexCardList: (obj.result1 && obj.result1.length > 0) ? obj.result1 : defaultData,
          // coreIndexTrendList: obj.result2

        });
        // 数据提取 营业收入 | 剔除仓库营收 | 净利润
        this.handCoreIndexTrendList(obj.result2);

        // //console.log(`coreIndexCardList`,obj.result1)
        return obj;

      }
    });
  };

  /**
   * 数据提取 营业收入 | 剔除仓库营收 | 净利润
   *  @param {number} handCoreIndexTrendList   核心指标趋势数据
   *  @returns {null}
   */
  handCoreIndexTrendList = (handCoreIndexTrendList) => {
    let foo = (item) => {
      return [item.INDIID];
    };
    // 数据分组
    let dataList = this.groupBy(handCoreIndexTrendList, foo);

    let year = [];
    // 营业收入
    let taking = [];
    // 剔除仓库营收
    let taking2 = [];
    // 净利润
    let profit = [];
    dataList.forEach(arr => {
      let arrStr = JSON.stringify(arr);
      if (arrStr.includes('营业收入(扣除仓单)')) {
        taking2 = arr;
      } else if (arrStr.includes('净利润')) {
        profit = arr;
      } else {
        taking = arr;
      }
    });
    year = dataList.length > 0 ? dataList[dataList.length - 1].map(item => item.MON) : ['201901', '201902', '201903', '201904', '201905', '201906'];
    taking = taking.length > 0 ? taking.map(item => Number(item.INDI_VAL)) : [0, 0, 0, 0, 0, 0];
    taking2 = taking2.length > 0 ? taking2.map(item => Number(item.INDI_VAL)) : [0, 0, 0, 0, 0, 0];
    profit = profit.length > 0 ? profit.map(item => Number(item.INDI_VAL)) : [0, 0, 0, 0, 0, 0];
    // //console.log(`taking.map(item=>item.INDI_VAL)`, taking.map(item=>Number(item.INDI_VAL)))
    this.setState({
      year,
      taking,
      taking2,
      profit,
    });
  };

  /**
   * 按字段分组数据
   *  @param {arrays} array   数组
   *  @param {function} f   字段
   *  @returns {null}
   */
  groupBy = (array, f) => {
    let result = [];
    const groups = {};
    array && array.forEach((o) => {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    for (let key in groups) {
      result.push(groups[key]);
    }

    return result;

  };

  getOption = (taking, taking2, profit, year) => {
    let option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        textStyle: {
          color: '#aaa',
          fontWeight: 'normal',
          fontSize: '15',
        },
        padding: [10, 10],
        itemGap: 40,
        icon: 'circle',
        data: [
          {
            name: '总营收',
            itemStyle: {
              color: '#E51339',
            },
          },
          {
            name: '剔除仓库营收',
            itemStyle: {
              color: '#D3AA7D',
            },
          },
          {
            name: '净利润',
            itemStyle: {
              color: '#81BFE7',
            },
          },
        ],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      // toolbox: {
      //     feature: {
      //         saveAsImage: {}
      //     }
      // },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        min: 0,
        data: year,
        offset: 10,
        axisLabel: {
          color: '#A5A7AF',
          fontSize: 15,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#A5A7AF',
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        name: '单位:（万元）',
        nameTextStyle: {
          padding: [0, 0, 0, 6],
          fontSize: 14,
          color: '#A5A7AF',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#A5A7AF',
          fontSize: 15,
        },

      },
      series: [
        {
          name: '总营收',
          type: 'line',
          data: taking,
          itemStyle: {
            color: '#E51339',
          },
          lineStyle: {
            color: '#E51339',
          },
        },
        {
          name: '剔除仓库营收',
          type: 'line',
          data: taking2,
          itemStyle: {
            color: '#D3AA7D',
          },
          lineStyle: {
            color: '#D3AA7D',
          },
        },
        {
          name: '净利润',
          type: 'line',
          data: profit,
          lineStyle: {
            color: '#81BFE7',
          },
          itemStyle: {
            color: '#81BFE7',
          },
        },
      ],
    };
    // this.setState({
    //     option
    // })
    return option;

  };

  componentWillMount() {
    // 经营分析财务类核心指标查询
    this.handleFetchQueryBusAnalFinanceFirst({
      month: moment().format('YYYYMM'),
      orgId: 1,
      type: 0,
    });

  }


  render() {
    const { coreIndexCardList, taking, taking2, profit, year } = this.state;
    const option = this.getOption(taking, taking2, profit, year);

    const { showExpense } = this.props;
    return (
      <Row className='nucleus-Index'>
        <Col span={24}>
          <div className='basic-index-outline title'>
            {<div className='dp-table-title'
                  style={{ display: 'flex', alignItems: 'center'}}>
              核心指标
              <div onClick={() => {
                this.toggleContent();
              }}>
                {showExpense ?
                  <i className='iconfont iconfont icon-down-solid-arrow'
                     style={{ cursor: 'pointer', fontSize: '1.3rem' }} /> :
                  <i className='iconfont icon-right-solid-arrow' style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
                }
              </div>

            </div>}
          </div>
        </Col>
        <Col span={12} style={{ height: '31.75rem', display: showExpense ? 'block' : 'none' }}>
          <Row style={{ height: '100%' }}>
            <Col span={24} style={{ height: '100%' }}>
              <div className='block-content' style={{ padding: '2rem', height: '100%' }}>
                <Card style={{ height: '100%', width: '100%' }}
                      bodyStyle={{ width: '100%', height: '100%', padding: '2rem 1rem 0rem 1rem' }} hoverable={true}>
                  {coreIndexCardList.map((item, index) => {
                    return (
                      <div style={{ height: '50%',width:'100%' }}>
                      <div style={{ display:'inline-flex',whiteSpace: 'nowrap',flex:'1',height: '50%',width:'100%' }}>
                      <div style={{display:'inline-block',width:'15%',fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem',whiteSpace: 'normal',color:'#333333'}}>
                        本月总营收{index > 0 && <div style={{textAlign:'left'}}>{'(扣除仓单)'}</div>}
                      </div>
                      <div style={{display:'grid',width:'31%',height:'1.5rem'}}>
                        <Progress format={0} strokeColor="linear-gradient(90deg, #5CBAF6 0%, #3796D2 100%)" percent={!item.INDI_VAL ? '- -' : item.INDI_VAL} showInfo={false} size='small' style={{ height: '1.5rem',display:'inline-block' }}/>
                        <span style={{ fontSize: '1.07rem',display:'flex'}}><span style={{textAlign:'left',width:'100%'}}>0</span><span style={{textAlign:'right' }}>期望{}亿元</span></span>
                      </div>
                      <div style={{display:'grid',width:'19%',color:'#333333',fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem'}}>
                        &nbsp;&nbsp;{!item.INDI_VAL ? '- -' : item.INDI_VAL}亿元
                      </div>
                      <div style={{display:'inline-block',width:'35%',textAlign: 'left',fontSize:'1.07rem',fontWeight:400,lineHeight:'1.7rem'}}>
                        <span style={{display:'inline-block' }}>同比：</span>
                        <span className={(item.YOY_MON && Number(item.YOY_MON)) > 0 ? 'up-color-red' : 'down-color-green'}
                              style={{display:'inline-block' }}>{!item.YOY_MON ? '0' : item.YOY_MON}%</span>
                        &nbsp;&nbsp;
                        {+item.YOY_MON !== 0 && <div style={{display:'inline-block'}}
                                                     className={(item.YOY_MON && Number(item.YOY_MON)) > 0 ? 'go-up-icon' : 'go-down-icon'}></div>}
                        &nbsp;&nbsp;
                        <span style={{display:'inline-block' }}>环比：</span>
                        <span
                          className={(item.GROWTH_MON && Number(item.GROWTH_MON)) > 0 ? 'up-color-red' : 'down-color-green'}
                          style={{display:'inline-block' }}>{!item.GROWTH_MON ? '0' : item.GROWTH_MON}%</span>
                        &nbsp;&nbsp;
                        {+item.GROWTH_MON !== 0 && <div style={{display:'inline-block'}}
                                                        className={(item.GROWTH_MON && Number(item.GROWTH_MON)) > 0 ? 'go-up-icon' : 'go-down-icon'} />}
                      </div>
                    </div>
                    <div style={{ display:'inline-flex',whiteSpace: 'nowrap',flex:'1',height: '50%',width:'100%' }}>
                        <div style={{display:'inline-block',width:'15%',fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem',whiteSpace: 'normal',color:'#333333'}}>
                          本年总营收{index > 0 && <div style={{textAlign:'left'}}>{'(扣除仓单)'}</div>}
                        </div>
                        <div style={{display:'grid',width:'31%',height:'1.5rem'}}>
                          <Progress strokeColor="linear-gradient(90deg, #F7C739 0%, #FEC622 100%)" percent={!item.TOTL_VAL ? '- -' : item.TOTL_VAL} showInfo={false} size='small' style={{ height: '1.5rem',display:'inline-block' }}/>
                          <span style={{ fontSize: '1.07rem',display:'flex'}}><span style={{textAlign:'left',width:'100%'}}>0</span><span style={{textAlign:'right' }}>期望{}亿元</span></span>
                        </div>
                        <div style={{display:'grid',width:'19%',color:'#333333',fontSize:'1.43rem',fontWeight:500,lineHeight:'2rem'}}>
                          &nbsp;&nbsp;{!item.TOTL_VAL ? '- -' : item.TOTL_VAL}亿元
                        </div>
                        <div style={{display:'inline-block',width:'35%',textAlign: 'left',fontSize:'1.07rem',fontWeight:400,lineHeight:'1.7rem'}}>
                          {/*年总计没有同比-需增加要素-暂用月份同比*/}
                          <span style={{display:'inline-block' }}>同比：</span>
                          <span className={(item.YOY_MON && Number(item.YOY_MON)) > 0 ? 'up-color-red' : 'down-color-green'}
                                style={{display:'inline-block' }}>{!item.YOY_MON ? '0' : item.YOY_MON}%</span>
                          &nbsp;&nbsp;
                          {+item.YOY_MON !== 0 && <div style={{display:'inline-block'}}
                                                       className={(item.YOY_MON && Number(item.YOY_MON)) > 0 ? 'go-up-icon' : 'go-down-icon'}></div>}
                          &nbsp;&nbsp;
                          <span style={{display:'inline-block' }}>环比：</span>
                          <span
                            className={(item.GROWTH_YEAR && Number(item.GROWTH_YEAR)) > 0 ? 'up-color-red' : 'down-color-green'} style={{display:'inline-block'  }}>
                            {!item.GROWTH_YEAR ? '0' : item.GROWTH_YEAR}%</span>
                          &nbsp;&nbsp;
                          {+item.GROWTH_YEAR !== 0 && <div style={{display:'inline-block'}} className={(item.GROWTH_YEAR && Number(item.GROWTH_YEAR)) > 0 ? 'go-up-icon' : 'go-down-icon'} />}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </Card>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={12} style={{ height: '31.75rem', display: showExpense ? 'block' : 'none' }}>
          <div className='coreIndex2'>
            {/*<div style={{height: '26.75rem',padding:'20px 20px'}}>*/}
            <Card style={{ height: '100%' }} bodyStyle={{ height: '28rem', padding: '0.5rem' }} hoverable={true}>
              {/*<div className="line-title" style={{ fontSize: '1.2rem' }}>单位：（万元）</div>*/}
              <ReactEchartsCore
                echarts={echarts}
                style={{ marginLeft: '1rem', height: '26.75rem', width: '100%', fontSize: '1.07rem' }}
                option={option}
                notMerge
                lazyUpdate
                theme='theme_name'
              />
            </Card>
            {/*</div>*/}
          </div>
        </Col>
      </Row>

    );
  }
}

export default NucleusIndex;
