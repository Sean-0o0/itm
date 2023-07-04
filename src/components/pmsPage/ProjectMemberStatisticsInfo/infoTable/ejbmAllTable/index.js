import React, {useState} from 'react';
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


const {TabPane} = Tabs;

export default function EjbmAllTable(props) {

  const [footerVisableLD, setFooterVisableLD] = useState('');
  const [footerVisableBM, setFooterVisableBM] = useState('');
  const [detailVisable, setDetailVisable] = useState(false);
  const [tableDataRY, setTableDataRY] = useState([]);
  const [totalRY, setTotalRY] = useState(0);
  const [bmmc, setBMMC] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);

  const {
    tableDataLD = [],
    totalLD = 0,
    tableDataBM = [],
    totalBM = 0,
    loading = true,
    getTableDataBM,
    bmid,
  } = props; //表格数据
  const location = useLocation();
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)


  const getRadarChatLD = (item) => {
    // console.log("雷达数据",item)
    //获取雷达图数据
    let max = item.XMZS;
    let datavalue = [item.XMZS, item.ZBXM, item.KTXM, item.XCXM, item.HJXM];
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
            return `{a|${a}}\n{b|${datavalue[i]}}`
          }
        },
        indicator: [
          {name: '负责项目', max: max},
          {name: '专班项目', max: max},
          {name: '课题项目', max: max},
          {name: '信创项目', max: max},
          {name: '获奖项目', max: max},
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
        data: [
          {
            value: datavalue,
            name: item.ORGNAME,
          },
        ]
      }]
    };
  }

  const getRadarChatBM = (item) => {
    // console.log("雷达数据",item)
    //获取雷达图数据
    let max = item.XMZS;
    let datavalue = [item.XMZS, item.ZBXM, item.KTXM, item.XCXM, item.HJXM];
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
            return `{a|${a}}\n{b|${datavalue[i]}}`
          }
        },
        indicator: [
          {name: '所有项目', max: max},
          {name: '专班项目', max: max},
          {name: '课题项目', max: max},
          {name: '信创项目', max: max},
          {name: '获奖项目', max: max},
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
        data: [
          {
            value: datavalue,
            name: item.ORGNAME,
          },
        ]
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

  // console.log("tableDatatableData",tableData)

  return (
    !detailVisable ? (tableDataLD.length > 0 || tableDataBM.length > 0 ?
      <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="info-table">
          {
            tableDataLD.length > 0 && <div className="info-table-title">
              领导统计
            </div>
          }
          <div className="info-table-content">
            {
              tableDataLD.length > 0 && tableDataLD.map(item => {
                return <div className="info-table-content-box">
                  <div className="info-table-content-box-title">
                    <div className="info-table-content-box-title-left">
                      {item.NAME}
                    </div>
                    {/*<div className="info-table-content-box-title-right">*/}
                    {/*  <i className="iconfont icon-vs"/>数据对比*/}
                    {/*</div>*/}
                  </div>
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
                    {/*    <div className="info-table-content-box-footer-left">*/}
                    {/*      <span className="info-table-content-box-footer-left-span">项目明细</span>*/}
                    {/*    </div>*/}
                    {/*    <div className="info-table-content-box-footer-right">*/}
                    {/*      <span className="info-table-content-box-footer-left-span" onClick={() =>toDetail(item)}>部门详情</span>*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*}*/}
                  </div>
                </div>
              })
            }
          </div>
          {
            tableDataBM.length > 0 && <div className="info-table-title">
              部门统计
            </div>
          }
          <div className="info-table-content">
            {
              tableDataBM.length > 0 && tableDataBM.map(item => {
                return <div className="info-table-content-box">
                  <div className="info-table-content-box-title">
                    <div className="info-table-content-box-title-left">
                      {item.ORGNAME}
                    </div>
                    {/*<div className="info-table-content-box-title-right">*/}
                    {/*  <i className="iconfont icon-vs"/>数据对比*/}
                    {/*</div>*/}
                  </div>
                  <div className="info-table-content-box-radar" onMouseEnter={() => getFooterBM(item.ORGID)}
                       onMouseLeave={hiddenFooterBM}>
                    <ReactEchartsCore
                      echarts={echarts}
                      option={getRadarChatBM(item)}
                      notMerge
                      lazyUpdate
                      style={{height: '240px'}}
                      theme=""
                    />
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
                        <div className="info-table-content-box-footer-right">
                          <span className="info-table-content-box-footer-left-span"
                                onClick={() => toDetail(item)}>部门详情</span>
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
