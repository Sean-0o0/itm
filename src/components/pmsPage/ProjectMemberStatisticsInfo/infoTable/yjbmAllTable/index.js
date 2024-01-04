import React, {useEffect, useState} from 'react';
import {Empty, message, Spin, Tabs} from 'antd';
import {useLocation} from 'react-router';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/radar';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import {QueryProjectStatistics} from "../../../../../services/pmsServices";
import MemberAllTable from "../memberAllTable";
import {EncryptBase64} from "../../../../Common/Encrypt";
import {Link} from "react-router-dom";


const {TabPane} = Tabs;

export default function YjbmAllTable(props) {

  const [footerVisable, setFooterVisable] = useState('');
  const [detailVisable, setDetailVisable] = useState(false);
  const [tableDataRY, setTableDataRY] = useState([]);
  const [totalRY, setTotalRY] = useState(0);
  const [bmmc, setBMMC] = useState('');
  const [memberLoading, setMemberLoading] = useState(true);
  const [itemWidth, setItemWidth] = useState("calc(33.33% - 24px)"); //块宽度
  const {
    tableData = [],
    total = 0,
    loading = true,
    setLoading,
    getTableData,
    tabsKeyCallback,
    defaultYear,
  } = props; //表格数据
  const location = useLocation();

  useEffect(() => {
    return () => {
    }
  }, [props]);
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

  const getRadarChat = (item) => {
    // console.log("雷达数据",item)
    //获取雷达图数据
    // tableDataBM
    let max = 0;
    let hjxmtep = 0
    let ktxmtep = 0
    let zbxmtep = 0
    let xcxmtep = 0
    let zyxmtep = 0
    let wcxmtep = 0
    tableData.map(item => {
      if (item.HJXM >= hjxmtep) {
        hjxmtep = item.HJXM;
      }
      if (item.KTXM >= ktxmtep) {
        ktxmtep = item.KTXM;
      }
      if (item.ZBXM >= zbxmtep) {
        zbxmtep = item.ZBXM;
      }
      if (item.XCXM >= xcxmtep) {
        xcxmtep = item.XCXM;
      }
      if (item.ZYXM >= zyxmtep) {
        zyxmtep = item.ZYXM;
      }
      if (item.WCXM >= wcxmtep) {
        wcxmtep = item.WCXM;
      }
    })
    max = Math.max(hjxmtep, ktxmtep, zbxmtep, xcxmtep, zyxmtep, wcxmtep)
    // let max = maxtemp === 0 ? 0 : (maxtemp === 1 ? 1 : ((Math.log(maxtemp) / Math.log(Math.E)) + 1))
    // //1等于1  2计算后用实际值+1
    // let xmzstep = item.XMZS === 0 ? 0 : (item.XMZS === 1 ? 1 : (item.XMZS === maxtemp ? max : ((Math.log(item.XMZS) / Math.log(Math.E)) + 1)))
    // let hjxmtep = item.HJXM === 0 ? 0 : (item.HJXM === 1 ? 1 : (item.HJXM === maxtemp ? max : ((Math.log(item.HJXM) / Math.log(Math.E)) + 1)))
    // let ktxmtep = item.KTXM === 0 ? 0 : (item.KTXM === 1 ? 1 : (item.KTXM === maxtemp ? max : ((Math.log(item.KTXM) / Math.log(Math.E)) + 1)))
    // let zbxmtep = item.ZBXM === 0 ? 0 : (item.ZBXM === 1 ? 1 : (item.ZBXM === maxtemp ? max : ((Math.log(item.ZBXM) / Math.log(Math.E)) + 1)))
    // let xcxmtep = item.XCXM === 0 ? 0 : (item.XCXM === 1 ? 1 : (item.XCXM === maxtemp ? max : ((Math.log(item.XCXM) / Math.log(Math.E)) + 1)))
    // let datavalue = [xmzstep, hjxmtep, ktxmtep, zbxmtep, xcxmtep];
    // let totalArr = [item.XMZS, item.HJXM, item.KTXM, item.ZBXM, item.XCXM];

    // let max = maxtemp === 0 ? 0 : (maxtemp === 1 ? 1 : ((Math.log(maxtemp) / Math.log(Math.E)) + 1))
    // //1等于1  2计算后用实际值+1
    // let xmzstep = item.XMZS === 0 ? 0 : (item.XMZS === 1 ? 1 : (item.XMZS === maxtemp ? max : ((Math.log(item.XMZS) / Math.log(Math.E)) + 1)))
    // let hjxmtep = item.HJXM === 0 ? 0 : (item.HJXM === 1 ? 1 : (item.HJXM === maxtemp ? max : ((Math.log(item.HJXM) / Math.log(Math.E)) + 1)))
    // let ktxmtep = item.KTXM === 0 ? 0 : (item.KTXM === 1 ? 1 : (item.KTXM === maxtemp ? max : ((Math.log(item.KTXM) / Math.log(Math.E)) + 1)))
    // let zbxmtep = item.ZBXM === 0 ? 0 : (item.ZBXM === 1 ? 1 : (item.ZBXM === maxtemp ? max : ((Math.log(item.ZBXM) / Math.log(Math.E)) + 1)))
    // let xcxmtep = item.XCXM === 0 ? 0 : (item.XCXM === 1 ? 1 : (item.XCXM === maxtemp ? max : ((Math.log(item.XCXM) / Math.log(Math.E)) + 1)))
    // let datavalue = [xmzstep, hjxmtep, ktxmtep, zbxmtep, xcxmtep];
    let datavalue = [item.HJXM, item.KTXM, item.ZBXM, item.XCXM, item.ZYXM, item.WCXM];
    let totalArr = [item.HJXM, item.KTXM, item.ZBXM, item.XCXM, item.ZYXM, item.WCXM];

    // let datavalue = [item.XMZS, item.HJXM, item.KTXM, item.ZBXM, item.XCXM,];
    let flag = item.ZBXM === 0 && item.KTXM === 0 && item.XCXM === 0 && item.HJXM === 0 && item.ZYXM === 0 && item.WCXM === 0
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
        center: ['50%', '50%'],
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
          // {name: '项目总数', max: max},
          {name: '获奖项目', max: max},
          {name: '课题项目', max: max},
          {name: '专班项目', max: max},
          {name: '信创项目', max: max},
          {name: '自研项目', max: max},
          {name: '外采项目', max: max},
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

  const getFooter = (key) => {
    setFooterVisable(key)
  }

  const hiddenFooter = () => {
    setFooterVisable(false)
  }

  const toDetail = (item) => {
    tabsKeyCallback(String(item.ORGID))
    // setMemberLoading(true);
    // setDetailVisable(true);
    // setBMMC(item.ORGNAME)
    // getTableDataMember('EJBM_ALL', item.ORGID)
  }

  const handleBack = () => {
    setDetailVisable(false)
    setBMMC('')
    getTableData('YJBM_ALL')
  }

  const getTableDataMember = (queryType = 'EJBM_ALL', id, year) => {
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
      "total": -1,
      year: year ?? defaultYear,
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

  console.log("tableDatatableData", tableData)

  return (
    !detailVisable ? (tableData.length > 0 ?
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="info-table">
          {/*<div className="info-table-title">*/}
          {/*  领导统计*/}
          {/*</div>*/}
          <div className="info-table-content">
            {
              tableData.map(item => {
                return <div style={{width: itemWidth}} className="info-table-content-box">
                  <div className="info-table-content-box-title">
                    <div className="info-table-content-box-title-left">
                      {item.ORGNAME}
                    </div>
                    {/*<div className="info-table-content-box-title-right">*/}
                    {/*  <i className="iconfont icon-vs"/>数据对比*/}
                    {/*</div>*/}
                  </div>
                  <span style={{
                    float: 'left',
                    margin: '16px',
                    fontSize: '14px',
                    color: '#999999'
                  }}>项目总数:&nbsp;&nbsp;<span style={{color: '#303133', fontWeight: 500}}>{item.XMZS}</span></span>
                  <div className="info-table-content-box-radar" onMouseEnter={() => getFooter(item.ORGID)}
                       onMouseLeave={hiddenFooter}>
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
                        option={getRadarChat(item)}
                        notMerge
                        lazyUpdate
                        style={{height: '240px'}}
                        theme=""
                      />
                    </Link>
                    {
                      footerVisable === item.ORGID &&
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
                            loading={memberLoading}/>
  );
}
