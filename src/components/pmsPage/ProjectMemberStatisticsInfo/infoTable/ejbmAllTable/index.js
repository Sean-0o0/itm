import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Empty, message, Spin, Tabs} from 'antd';
import {useLocation} from 'react-router';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/title';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import MemberAllTableEjbmAllTable from "../memberAllTable";
import MemberAllTable from "../memberAllTable";
import {QueryProjectStatistics} from "../../../../../services/pmsServices";
import {EncryptBase64} from "../../../../Common/Encrypt";
import {Link} from "react-router-dom";
import DataComparison from "../dataComparisonRY";
import DataComparisonRY from "../dataComparisonRY";
import DataComparisonBM from "../dataComparisonBM";


const {TabPane} = Tabs;

export default function EjbmAllTable(props) {

  const [footerVisableLD, setFooterVisableLD] = useState('');
  const [footerVisableBM, setFooterVisableBM] = useState('');
  const [detailVisable, setDetailVisable] = useState(false);
  const [itemWidth, setItemWidth] = useState("calc(33.33% - 24px)"); //块宽度
  const [tableDataRY, setTableDataRY] = useState([]);
  const [totalRY, setTotalRY] = useState(0);
  const [bmmc, setBMMC] = useState('');
  const [memberLoading, setMemberLoading] = useState(true);
  const [compareRYVisible, setCompareRYVisible] = useState(false);//人员对比
  const [compareBMVisible, setCompareBMVisible] = useState(false);//部门对比
  const [orgId, setOrgId] = useState('');
  const [userId, setUserId] = useState('');

  const {
    tableDataLD = [],
    totalLD = 0,
    tableDataBM = [],
    totalBM = 0,
    loading = true,
    getTableDataBM,
    bmid,
    activeKeyFlag,
    setActiveKeyFlag,
  } = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)

  //防抖定时器
  let timer = null;

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', {bubbles: true, composed: true})); //刷新时能触发resize
    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);

  //屏幕宽度变化触发
  const resizeUpdate = e => {
    const fn = () => {
      let w = e.target.innerWidth; //屏幕宽度
      console.log('🚀 ~ file: index.js ~ line 21 ~ resizeUpdate ~ w', w);
      if (w < 1440) {
        setItemWidth('calc(33.33% - 24px)');
      } else if (w < 1730) {
        setItemWidth('calc(33.33% - 24px)');
      } else if (w < 2021) {
        setItemWidth('calc(25% - 24px)');
      } else if (w < 2312) {
        setItemWidth('calc(25% - 24px)');
      } else if (w < 2603) {
        setItemWidth('calc(20% - 24px)');
      } else if (w < 2894) {
        setItemWidth('calc(20% - 24px)');
      } else if (w < 3185) {
        setItemWidth('calc(20% - 24px)');
      } else {
        setItemWidth('calc(20% - 24px)'); //5个
      }
    };
    debounce(fn, 300);
  };

  // 防抖
  const debounce = (fn, waits = 500) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  const getRadarChatLD = (item) => {
    // console.log("雷达数据",item)
    //获取雷达图数据
    let max = item.XMZS;
    let datavalue = [item.XMZS, item.HJXM, item.KTXM, item.ZBXM, item.XCXM,];
    let flag = item.XMZS === 0 && item.ZBXM === 0 && item.KTXM === 0 && item.XCXM === 0 && item.HJXM === 0
    let data = [{value: datavalue, name: item.ORGNAME,},]
    let i = -1;
    return {
      // title: {
      //   text: '基础雷达图'
      // },
      color: ["#1890FF"],
      tooltip: {
        show: false,
      },
      radar: [{
        center: ['50%', '55%'],
        // shape: 'circle',
        radius: 68,
        name: {
          textStyle: {
            color: '#999',
            backgroundColor: '#fff',
            borderRadius: 3,
            padding: [1, 1]
          },
          rich: {
            a: {
              fontSize: '14',
              color: '#999999',
              align: 'left',
              lineHeight: '20'
            },
            b: {
              fontSize: '14',
              color: '#333333',
              align: 'center',
              fontWeight: 'bold'
            }
          },
          formatter: (a, b) => {
            i++;
            return `{a|${a}}\n{b|${datavalue[i]}}`
          }
        },
        indicator: [
          {name: '负责项目', max: max},
          {name: '获奖项目', max: max},
          {name: '课题项目', max: max},
          {name: '专班项目', max: max},
          {name: '信创项目', max: max},
        ],
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#fff', '']
            // 图表背景网格的颜色
          }
        },
      }],
      series: [{
        name: '',
        type: 'radar',
        // areaStyle: {normal: {}},
        itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
          color: '#5B8FF9',
          borderColor: '#5B8FF9',
        },
        areaStyle: {
          color: '#5B8FF9',
        },
        data: flag ? [] : data
      }]
    };
  }

  const getRadarChatBM = (item) => {
    console.log("雷达数据", item)
    // tableDataBM
    let maxtemp = item.XMZS;
    tableDataBM.map(item => {
      if (item.XMZS >= maxtemp) {
        maxtemp = item.XMZS;
      }
    })
    //获取雷达图数据
    // let max = item.XMZS;
    let max = maxtemp === 0 ? 0 : (maxtemp === 1 ? 1 : Math.ceil(Math.log(maxtemp)))
    let xmzstep = item.XMZS === 0 ? 0 : (item.XMZS === 1 ? 1 : (item.XMZS === maxtemp ? max : Math.log(item.XMZS) + 1))
    let hjxmtep = item.HJXM === 0 ? 0 : (item.HJXM === 1 ? 1 : (item.HJXM === maxtemp ? max : Math.log(item.HJXM) + 1))
    let ktxmtep = item.KTXM === 0 ? 0 : (item.KTXM === 1 ? 1 : (item.KTXM === maxtemp ? max : Math.log(item.KTXM) + 1))
    let zbxmtep = item.ZBXM === 0 ? 0 : (item.ZBXM === 1 ? 1 : (item.ZBXM === maxtemp ? max : Math.log(item.ZBXM) + 1))
    let xcxmtep = item.XCXM === 0 ? 0 : (item.XCXM === 1 ? 1 : (item.XCXM === maxtemp ? max : Math.log(item.XCXM) + 1))
    let datavalue = [xmzstep, hjxmtep, ktxmtep, zbxmtep, xcxmtep];
    let totalArr = [item.XMZS, item.HJXM, item.KTXM, item.ZBXM, item.XCXM];
    let flag = item.XMZS === 0 && item.ZBXM === 0 && item.KTXM === 0 && item.XCXM === 0 && item.HJXM === 0
    let data = [{value: datavalue, name: item.ORGNAME,},]
    let i = -1;
    return {
      // title: {
      //   text: '基础雷达图'
      // },
      color: ["#1890FF"],
      tooltip: {
        show: false,
      },
      radar: [{
        center: ['50%', '55%'],
        // shape: 'circle',
        radius: 68,
        name: {
          textStyle: {
            color: '#999',
            backgroundColor: '#fff',
            borderRadius: 3,
            padding: [1, 1]
          },
          rich: {
            a: {
              fontSize: '14',
              color: '#999999',
              align: 'left',
              lineHeight: '20'
            },
            b: {
              fontSize: '14',
              color: '#333333',
              align: 'center',
              fontWeight: 'bold'
            }
          },
          formatter: (a, b) => {
            i++;
            return `{a|${a}}\n{b|${totalArr[i]}}`
          }
        },
        indicator: [
          {name: '所有项目', max: max},
          {name: '获奖项目', max: max},
          {name: '课题项目', max: max},
          {name: '专班项目', max: max},
          {name: '信创项目', max: max},
        ],
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#fff', '']
            // 图表背景网格的颜色
          }
        },
      }],
      series: [{
        name: '',
        type: 'radar',
        // areaStyle: {normal: {}},
        itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
          color: '#5B8FF9',
          borderColor: '#5B8FF9',
        },
        areaStyle: {
          color: '#5B8FF9',
        },
        data: flag ? [] : data,
      }]
    };
  }

  const getFooterLD = (key) => {
    setFooterVisableLD(key)
  }

  const hiddenFooterLD = () => {
    setFooterVisableLD(false)
  }

  const getFooterBM = (key) => {
    setFooterVisableBM(key)
  }

  const hiddenFooterBM = () => {
    setFooterVisableBM(false)
  }

  const toDetail = (item) => {
    setMemberLoading(true);
    setDetailVisable(true);
    setActiveKeyFlag(false);
    setBMMC(item.ORGNAME)
    getTableDataMember('EJBM_ALL', item.ORGID)
  }

  const getTableDataMember = (queryType = 'EJBM_ALL', id) => {
    setMemberLoading(true);
    // YJBM_ALL|全部一级部门（部门id和人员id都不用传）;
    // YJBM_LD|查询对应一级部门下的部门领导数据（传一级部门的id）;
    // YJBM_BM|查询对应一级部门下的二级部门数据（传一级部门的id）;
    // EJBM_ALL|查询对应二级部门下人员的数据（传二级部门的id）;
    // RY|查询对应人员id的数据（传人员的id）;
    // BM|查询对应部门的数据（部门的id）
    const payload = {
      "current": 1,
      // "memberId": 0,
      "orgID": id,
      "pageSize": 10,
      "paging": 1,
      "queryType": queryType,
      "sort": '',
      "total": -1
    }
    QueryProjectStatistics({
      ...payload
    }).then(res => {
      const {
        code = 0,
        result,
        totalrows = 0,
      } = res
      if (code > 0) {
        setTableDataRY([...JSON.parse(result)])
        setTotalRY(totalrows)
        setMemberLoading(false);
      } else {
        message.error(note)
        setMemberLoading(false);
      }
    }).catch(err => {
      message.error("查询项目统计失败")
      setMemberLoading(false);
    })
  }

  const handleBack = () => {
    setDetailVisable(false)
    setBMMC('')
    getTableDataBM("YJBM_LD", bmid);
    getTableDataBM("YJBM_BM", bmid);
  }

  const closeCompareRYVisibleModal = () => {
    setCompareRYVisible(false)
  }

  const getCompareRYModel = (item) => {
    setUserId(item.USERID)
    setCompareRYVisible(true)
  }

  const closeCompareBMVisibleModal = () => {
    setCompareBMVisible(false)
  }

  const getCompareBMModel = (item) => {
    setOrgId(item.ORGID)
    setCompareBMVisible(true)
  }


  return (
    activeKeyFlag ? (tableDataLD.length > 0 || tableDataBM.length > 0 ?
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="info-table">
          {
            tableDataLD.length > 0 && <div className="info-table-title">
              领导统计
            </div>
          }
          {
            compareRYVisible && (
              <DataComparisonRY userId={userId} closeModal={closeCompareRYVisibleModal}
                                visible={compareRYVisible}/>
            )}
          <div className="info-table-content">
            {
              tableDataLD.length > 0 && tableDataLD.map(item => {
                return <div style={{width: itemWidth}} className="info-table-content-box">
                  <div className="info-table-content-box-title">
                    <div className="info-table-content-box-title-left">
                      <Link
                        style={{color: '#303133'}}
                        to={{
                          pathname: `/pms/manage/staffDetail/${EncryptBase64(
                            JSON.stringify({
                              ryid: item.USERID,
                            }),
                          )}`,
                          state: {
                            routes: [{name: '统计分析', pathname: location.pathname}],
                          },
                        }}
                        className="table-link-strong-staffname"
                      >
                        {item.NAME}
                      </Link>
                    </div>
                    <div className="info-table-content-box-title-right" onClick={() => getCompareRYModel(item)}>
                      <i className="iconfont icon-vs" onClick={() => getCompareRYModel(item)}/>数据对比
                    </div>
                  </div>
                  <Link
                    style={{color: '#3361ff', width: '100%'}}
                    to={{
                      pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(
                        JSON.stringify({
                          cxlx: 'RY',
                          memberID: item.USERID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '统计分析', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className="info-table-content-box-radar" onMouseEnter={() => getFooterLD(item.USERID)}
                         onMouseLeave={hiddenFooterLD}>
                      <ReactEchartsCore
                        echarts={echarts}
                        option={getRadarChatLD(item)}
                        notMerge
                        lazyUpdate
                        style={{height: '240px'}}
                        theme=""
                      />
                      {/*{*/}
                      {/*  footerVisableLD === item.USERID &&*/}
                      {/*  <div className="info-table-content-box-footer">*/}
                      {/*    <Link*/}
                      {/*      style={{color: '#3361ff',justifyContent: 'center',display: 'flex',width: '100%'}}*/}
                      {/*      to={{*/}
                      {/*        pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(*/}
                      {/*          JSON.stringify({*/}
                      {/*            cxlx: 'RY',*/}
                      {/*            memberID: item.USERID,*/}
                      {/*          }),*/}
                      {/*        )}`,*/}
                      {/*        state: {*/}
                      {/*          routes: [{name: '统计分析', pathname: location.pathname}],*/}
                      {/*        },*/}
                      {/*      }}*/}
                      {/*      className="table-link-strong"*/}
                      {/*    >*/}
                      {/*      <div className="info-table-content-box-footer-left" style={{width:'100%'}}>*/}
                      {/*        <span className="info-table-content-box-footer-left-span">项目明细</span>*/}
                      {/*      </div>*/}
                      {/*    </Link>*/}
                      {/*    /!*<div className="info-table-content-box-footer-right">*!/*/}
                      {/*    /!*  <span className="info-table-content-box-footer-left-span" onClick={() =>toDetail(item)}>部门详情</span>*!/*/}
                      {/*    /!*</div>*!/*/}
                      {/*  </div>*/}
                      {/*}*/}
                    </div>
                  </Link>
                </div>
              })
            }
          </div>
          {
            tableDataBM.length > 0 && <div className="info-table-title">
              部门统计
            </div>
          }
          {
            compareBMVisible && (
              <DataComparisonBM orgId={orgId} closeModal={closeCompareBMVisibleModal}
                                visible={compareBMVisible}/>
            )}
          <div className="info-table-content">
            {
              tableDataBM.length > 0 && tableDataBM.map((item, index) => {
                return <div style={{width: itemWidth}} className="info-table-content-box">
                  <div className="info-table-content-box-title">
                    <div className="info-table-content-box-title-left">
                      {item.ORGNAME}
                    </div>
                    <div className="info-table-content-box-title-right" onClick={() => getCompareBMModel(item)}>
                      <i className="iconfont icon-vs" onClick={() => getCompareBMModel(item)}/>数据对比
                    </div>
                  </div>
                  <div className="info-table-content-box-radar" onMouseEnter={() => getFooterBM(item.ORGID)}
                       onMouseLeave={hiddenFooterBM}>
                    <Link
                      style={{color: '#3361ff'}}
                      to={{
                        pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(
                          JSON.stringify({
                            cxlx: 'BM',
                            orgID: item.ORGID,
                          }),
                        )}`,
                        state: {
                          routes: [{name: '统计分析', pathname: location.pathname}],
                        },
                      }}
                      className="table-link-strong"
                    >
                      <ReactEchartsCore
                        echarts={echarts}
                        option={getRadarChatBM(item)}
                        notMerge
                        lazyUpdate
                        style={{height: '240px'}}
                        theme=""
                      />
                    </Link>
                    {
                      footerVisableBM === item.ORGID &&
                      <div className="info-table-content-box-footer">
                        <Link
                          style={{color: '#3361ff'}}
                          to={{
                            pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(
                              JSON.stringify({
                                cxlx: 'BM',
                                orgID: item.ORGID,
                              }),
                            )}`,
                            state: {
                              routes: [{name: '统计分析', pathname: location.pathname}],
                            },
                          }}
                          className="table-link-strong"
                        >
                          <div className="info-table-content-box-footer-left">
                            <span className="info-table-content-box-footer-left-span">项目明细</span>
                          </div>
                        </Link>
                        <div className="info-table-content-box-footer-right" onClick={() => toDetail(item)}>
                          <span className="info-table-content-box-footer-left-span">部门详情</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </Spin> : <Empty
        description="暂无数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}
      />) : (!detailVisable ? (tableDataLD.length > 0 || tableDataBM.length > 0 ?
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="info-table">
          {
            tableDataLD.length > 0 && <div className="info-table-title">
              领导统计
            </div>
          }
          {
            compareRYVisible && (
              <DataComparisonRY userId={userId} closeModal={closeCompareRYVisibleModal}
                                visible={compareRYVisible}/>
            )}
          <div className="info-table-content">
            {
              tableDataLD.length > 0 && tableDataLD.map(item => {
                return <div style={{width: itemWidth}} className="info-table-content-box">
                  <div className="info-table-content-box-title">
                    <div className="info-table-content-box-title-left">
                      <Link
                        style={{color: '#303133'}}
                        to={{
                          pathname: `/pms/manage/staffDetail/${EncryptBase64(
                            JSON.stringify({
                              ryid: item.USERID,
                            }),
                          )}`,
                          state: {
                            routes: [{name: '统计分析', pathname: location.pathname}],
                          },
                        }}
                        className="table-link-strong"
                      >
                        {item.NAME}
                      </Link>
                    </div>
                    <div className="info-table-content-box-title-right" onClick={() => getCompareRYModel(item)}>
                      <i className="iconfont icon-vs" onClick={() => getCompareRYModel(item)}/>数据对比
                    </div>
                  </div>
                  <Link
                    style={{color: '#3361ff', width: '100%'}}
                    to={{
                      pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(
                        JSON.stringify({
                          cxlx: 'RY',
                          memberID: item.USERID,
                        }),
                      )}`,
                      state: {
                        routes: [{name: '统计分析', pathname: location.pathname}],
                      },
                    }}
                    className="table-link-strong"
                  >
                    <div className="info-table-content-box-radar" onMouseEnter={() => getFooterLD(item.USERID)}
                         onMouseLeave={hiddenFooterLD}>
                      <ReactEchartsCore
                        echarts={echarts}
                        option={getRadarChatLD(item)}
                        notMerge
                        lazyUpdate
                        style={{height: '240px'}}
                        theme=""
                      />
                      {/*{*/}
                      {/*  footerVisableLD === item.USERID &&*/}
                      {/*  <div className="info-table-content-box-footer">*/}
                      {/*    <Link*/}
                      {/*      style={{color: '#3361ff',justifyContent: 'center',display: 'flex',width: '100%'}}*/}
                      {/*      to={{*/}
                      {/*        pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(*/}
                      {/*          JSON.stringify({*/}
                      {/*            cxlx: 'RY',*/}
                      {/*            memberID: item.USERID,*/}
                      {/*          }),*/}
                      {/*        )}`,*/}
                      {/*        state: {*/}
                      {/*          routes: [{name: '统计分析', pathname: location.pathname}],*/}
                      {/*        },*/}
                      {/*      }}*/}
                      {/*      className="table-link-strong"*/}
                      {/*    >*/}
                      {/*      <div className="info-table-content-box-footer-left" style={{width:'100%'}}>*/}
                      {/*        <span className="info-table-content-box-footer-left-span">项目明细</span>*/}
                      {/*      </div>*/}
                      {/*    </Link>*/}
                      {/*    /!*<div className="info-table-content-box-footer-right">*!/*/}
                      {/*    /!*  <span className="info-table-content-box-footer-left-span" onClick={() =>toDetail(item)}>部门详情</span>*!/*/}
                      {/*    /!*</div>*!/*/}
                      {/*  </div>*/}
                      {/*}*/}
                    </div>
                  </Link>
                </div>
              })
            }
          </div>
          {
            tableDataBM.length > 0 && <div className="info-table-title">
              部门统计
            </div>
          }
          {
            compareBMVisible && (
              <DataComparisonBM orgId={orgId} closeModal={closeCompareBMVisibleModal}
                                visible={compareBMVisible}/>
            )}
          <div className="info-table-content">
            {
              tableDataBM.length > 0 && tableDataBM.map((item, index) => {
                return <div style={{width: itemWidth}} className="info-table-content-box">
                  <div className="info-table-content-box-title">
                    <div className="info-table-content-box-title-left">
                      {item.ORGNAME}
                    </div>
                    <div className="info-table-content-box-title-right" onClick={() => getCompareBMModel(item)}>
                      <i className="iconfont icon-vs" onClick={() => getCompareBMModel(item)}/>数据对比
                    </div>
                  </div>
                  <div className="info-table-content-box-radar" onMouseEnter={() => getFooterBM(item.ORGID)}
                       onMouseLeave={hiddenFooterBM}>
                    <Link
                      style={{color: '#3361ff'}}
                      to={{
                        pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(
                          JSON.stringify({
                            cxlx: 'BM',
                            orgID: item.ORGID,
                          }),
                        )}`,
                        state: {
                          routes: [{name: '统计分析', pathname: location.pathname}],
                        },
                      }}
                      className="table-link-strong"
                    >
                      <ReactEchartsCore
                        echarts={echarts}
                        option={getRadarChatBM(item)}
                        notMerge
                        lazyUpdate
                        style={{height: '240px'}}
                        theme=""
                      />
                    </Link>
                    {
                      footerVisableBM === item.ORGID &&
                      <div className="info-table-content-box-footer">
                        <Link
                          style={{color: '#3361ff'}}
                          to={{
                            pathname: `/pms/manage/ProjectStatisticsInfo/${EncryptBase64(
                              JSON.stringify({
                                cxlx: 'BM',
                                orgID: item.ORGID,
                              }),
                            )}`,
                            state: {
                              routes: [{name: '统计分析', pathname: location.pathname}],
                            },
                          }}
                          className="table-link-strong"
                        >
                          <div className="info-table-content-box-footer-left">
                            <span className="info-table-content-box-footer-left-span">项目明细</span>
                          </div>
                        </Link>
                        <div className="info-table-content-box-footer-right" onClick={() => toDetail(item)}>
                          <span className="info-table-content-box-footer-left-span">部门详情</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </Spin> : <Empty
        description="暂无数据"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}
      />) : <MemberAllTable handleBack={handleBack} bmmc={bmmc} tableData={tableDataRY} total={totalRY}
                            loading={memberLoading}/>)

  );
}
