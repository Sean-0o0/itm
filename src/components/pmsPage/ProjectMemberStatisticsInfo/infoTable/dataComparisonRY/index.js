import React, {useEffect, useState} from 'react';
import {Button, Empty, message, Modal, Select, Spin, Tabs} from 'antd';
import {useLocation} from 'react-router';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/radar';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import {QueryMemberInfo, QueryProjectListPara, QueryProjectStatistics} from "../../../../../services/pmsServices";
import MemberAllTable from "../memberAllTable";
import {EncryptBase64} from "../../../../Common/Encrypt";
import {Link} from "react-router-dom";
import TreeUtils from "../../../../../utils/treeUtils";


const {TabPane} = Tabs;
const {Option} = Select;

export default function DataComparisonRY(props) {

  const [footerVisable, setFooterVisable] = useState('');
  const [detailVisable, setDetailVisable] = useState(false);
  const [tableDataRY, setTableDataRY] = useState([]);
  const [totalRY, setTotalRY] = useState(0);
  const [bmmc, setBMMC] = useState('');
  const [memberLoading, setMemberLoading] = useState(true);
  const [prjMnger, setPrjMnger] = useState(undefined); //人员选择
  const [staffData, setStaffData] = useState([]); //人员数据

  // const [tooltipDataXMZS, setTooltipDataXMZS] = useState([]); //发起项目
  // const [tooltipDataZBXM, setTooltipDataZBXM] = useState([]); //专班项目
  // const [tooltipDataKTXM, setTooltipDataKTXM] = useState([]); //课题项目
  // const [tooltipDataCYXM, setTooltipDataCYXM] = useState([]); //参与项目
  // const [tooltipDataHJXM, setTooltipDataHJXM] = useState([]); //获奖项目
  const [tooltipData, setTooltipData] = useState([]); //tooltip展示数据
  const [tooltipleftData, setTooltipleftData] = useState([]); //tooltip展示数据
  const [radardata, setRadardata] = useState([]); //雷达数据
  //各项目类型总数
  const [totalXMZS, setTotalXMZS] = useState(0); //发起项目总数
  const [totalZBXM, setTotalZBXM] = useState(0); //专班项目总数
  const [totalKTXM, setTotalKTXM] = useState(0); //课题项目总数
  const [totalCYXM, setTotalCYXM] = useState(0); //参与项目总数
  const [totalHJXM, setTotalHJXM] = useState(0); //获奖项目总数
  const [totalZYXM, setTotalZYXM] = useState(0); //获奖项目总数
  const [totalWCXM, setTotalWCXM] = useState(0); //获奖项目总数
  const [totalArr, setTotalArr] = useState([0, 0, 0, 0, 0]); //获奖项目总数组成的数组
  const [totalNameArr, setTotalNameArr] = useState(['', '', '', '', '']); //人名组成的数组-legend

  const {
    userId = '',
    visible = false,
    closeModal,
    defaultYear
  } = props; //表格数据
  const location = useLocation();

  useEffect(() => {
    getStaffData();
    if (userId !== undefined) {
      setPrjMnger(String(userId));
      getTableData('DRY', userId, defaultYear)
    }
    return () => {
    }
  }, [userId, visible, defaultYear]);
  // console.log("🚀 ~ file: index.js:15 ~ InfoTable ~ location:", location)


  const getRadarChat = () => {
    // console.log("雷达数据",item)
    //获取雷达图数据
    let i = -1;
    let arr = [totalHJXM, totalKTXM, totalZBXM, totalZYXM, totalWCXM]
    let max = Math.max(...arr)
    // let max = maxtemp === 0 ? 0 : (maxtemp === 1 ? 1 : ((Math.log(maxtemp) / Math.log(Math.E)) + 1))
    let flag = totalHJXM === 0 && totalKTXM === 0 && totalZBXM === 0 && totalZYXM === 0 && totalWCXM === 0;
    return {
      // title: {
      //   text: '基础雷达图'
      // },
      legend: {
        data: totalNameArr,
        itemGap: 24,
        itemWidth: 10,
        itemHeight: 10,
      },
      color: ['rgba(91,143,249,1)', 'rgba(90,216,166,1)', 'rgba(93,112,146,1)', 'rgba(246,189,22,1)', 'rgba(232,104,74,1)'],
      tooltip: {
        extraCssText: 'padding:12px;height: 240px;background-color:#ffffff;color:#ffffff;box-shadow: 0px 3px 6px -4px rgba(0,0,0,0.12), 0px 6px 16px 0px rgba(0,0,0,0.08), 0px 9px 28px 8px rgba(0,0,0,0.05);',
        formatter: (params) => {
          console.log("paramsparams", params)
          //params.data.name
          //params.data.value
          //params是数组格式
          let str = ''
          for (let item of tooltipData) {
            str += '<span style="font-size: 14px;font-weight: 500;color: #303133;line-height: 22px;font-family: PingFangSC-Medium, PingFang SC;">' + item.xmlx + '</span><br/>'
            console.log("itemitemitem", item)
            item.data.map((i, index) => {
              if (index !== 0) {
                str += "<span style='display:inline-block;width:10px;height:10px;border-radius:10px;background-color:" + item + ";'></span>"
                  + '<span style="font-size: 14px;font-weight: 400;color: #909399;line-height: 22px;font-family: PingFangSC-Regular, PingFang SC;">' + '｜' + i.name + " : " + '</span>'
                  + '<span style="font-size: 14px;font-weight: 400;color: #303133;line-height: 22px;font-family: PingFangSC-Regular, PingFang SC;">' + i.value + "\t" + '</span>'
              } else {
                str += "<span style='display:inline-block;width:10px;height:10px;border-radius:10px;background-color:" + item + ";'></span>"
                  + '<span style="font-size: 14px;font-weight: 400;color: #909399;line-height: 22px;font-family: PingFangSC-Regular, PingFang SC;">' + i.name + " : " + '</span>'
                  + '<span style="font-size: 14px;font-weight: 400;color: #303133;line-height: 22px;font-family: PingFangSC-Regular, PingFang SC;">' + i.value + "\t" + '</span>'
              }
            })
            str = str + '<br/>'
          }
          return str
        }
      },
      radar: [{
        center: ['50%', '55%'],
        // shape: 'circle',
        radius: 135.5,
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
          formatter: (a) => {
            i++;
            return `{a|${a}}\n{b|${totalArr[i]}}`
          }
        },
        indicator: [
          {name: '获奖项目', max},
          {name: '课题项目', max},
          {name: '专班项目', max},
          {name: '自研项目', max},
          {name: '外采项目', max},
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
        lineStyle: {
          width: 2.5,
        },
        areaStyle: {
          opacity: 0.2,
        },
        data: flag ? [] : radardata,
      }]
    };
  }

  //获取人员数据
  const getStaffData = (orgArr = []) => {
    setMemberLoading(true);
    QueryMemberInfo({
      type: 'XXJS',
    })
      .then(res => {
        if (res?.success) {
          let memberArr = JSON.parse(res.record);
          setStaffData(p => [...memberArr]);
          setMemberLoading(false);
        }
      })
      .catch(e => {
        setMemberLoading(false);
        message.error('人员信息查询失败', 1);
        console.error('QueryMemberInfo', e);
      });
  };

  const getTableData = (queryType = 'DRY', v, year) => {
    setMemberLoading(true);
    console.log("String(v)", String(v))
    // YJBM_ALL|全部一级部门（部门id和人员id都不用传）;
    // YJBM_LD|查询对应一级部门下的部门领导数据（传一级部门的id）;
    // YJBM_BM|查询对应一级部门下的二级部门数据（传一级部门的id）;
    // EJBM_ALL|查询对应二级部门下人员的数据（传二级部门的id）;
    // RY|查询对应人员id的数据（传人员的id）;
    // BM|查询对应部门的数据（部门的id）
    //DRY|查询对应多个人员的数据；格式为英文括号，里面多个id用逗号隔开，(11169,15508) DBM时传
    //DBM|查询对应多个部门的数据 格式为英文括号，格式为英文括号，里面多个id用逗号隔开，(115148,12488) DRY时传
    const payload = {
      "current": 1,
      // "memberId": 0,
      "multiMember": "(" + String(v) + ")",
      "pageSize": 10,
      "paging": 1,
      "queryType": queryType,
      "sort": '',
      "total": -1,
      year: year ?? defaultYear
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
        const resdata = JSON.parse(result);
        //发起项目
        let tooltipDataXMZS = [];
        //专班项目
        let tooltipDataZBXM = [];
        //课题项目
        let tooltipDataKTXM = [];
        //参与项目
        let tooltipDataCYXM = [];
        //获奖项目
        let tooltipDataHJXM = [];
        //自研项目
        let tooltipDataZYXM = [];
        //外采项目
        let tooltipDataWCXM = [];
        //雷达数据
        let radardata = [];
        //各项目类型总数
        //发起项目总数
        let totalXMZS = 0;
        //专班项目总数
        let totalZBXM = 0;
        //课题项目总数
        let totalKTXM = 0;
        //参与项目总数
        let totalCYXM = 0;
        //获奖项目总数
        let totalHJXM = 0;
        //自研项目总数
        let totalZYXM = 0;
        //外采项目总数
        let totalWCXM = 0;
        let name = []
        resdata.length > 0 && resdata.map(item => {
          const XMZS = {name: item.NAME, value: item.XMZS};
          const ZBXM = {name: item.NAME, value: item.ZBXM};
          const KTXM = {name: item.NAME, value: item.KTXM};
          const CYXM = {name: item.NAME, value: item.CYXM};
          const HJXM = {name: item.NAME, value: item.HJXM};
          const ZYXM = {name: item.NAME, value: item.ZYXM};
          const WCXM = {name: item.NAME, value: item.WCXM};
          // let xmzstep = item.XMZS === 0 ? 0 : (item.XMZS === 1 ? 1 : ((Math.log(item.XMZS) / Math.log(Math.E)) + 1))
          // let hjxmtep = item.HJXM === 0 ? 0 : (item.HJXM === 1 ? 1 : ((Math.log(item.HJXM) / Math.log(Math.E)) + 1))
          // let ktxmtep = item.KTXM === 0 ? 0 : (item.KTXM === 1 ? 1 : ((Math.log(item.KTXM) / Math.log(Math.E)) + 1))
          // let zbxmtep = item.ZBXM === 0 ? 0 : (item.ZBXM === 1 ? 1 : ((Math.log(item.ZBXM) / Math.log(Math.E)) + 1))
          // let xcxmtep = item.CYXM === 0 ? 0 : (item.CYXM === 1 ? 1 : ((Math.log(item.CYXM) / Math.log(Math.E)) + 1))
          // const radar = {id:item.USERID,name: item.NAME, value: [xmzstep, hjxmtep, ktxmtep, zbxmtep, xcxmtep]};
          const radar = {name: item.NAME, value: [item.HJXM, item.KTXM, item.ZBXM, item.ZYXM, item.WCXM]};
          tooltipDataXMZS.push(XMZS);
          tooltipDataZBXM.push(ZBXM);
          tooltipDataKTXM.push(KTXM);
          tooltipDataCYXM.push(CYXM);
          tooltipDataHJXM.push(HJXM);
          tooltipDataZYXM.push(ZYXM);
          tooltipDataWCXM.push(WCXM);
          radardata.push(radar)
          name.push(item.NAME);
          if (item.XMZS > totalXMZS) {
            totalXMZS = item.XMZS;
          }
          if (item.ZBXM > totalZBXM) {
            totalZBXM = item.ZBXM;
          }
          if (item.KTXM > totalKTXM) {
            totalKTXM = item.KTXM;
          }
          if (item.CYXM > totalCYXM) {
            totalCYXM = item.CYXM;
          }
          if (item.HJXM > totalHJXM) {
            totalHJXM = item.HJXM;
          }
          if (item.ZYXM > totalZYXM) {
            totalZYXM = item.ZYXM;
          }
          if (item.WCXM > totalWCXM) {
            totalWCXM = item.WCXM;
          }
        })
        let tooltipData = [{xmlx: '获奖项目', data: tooltipDataHJXM}, {xmlx: '课题项目', data: tooltipDataKTXM}, {
          xmlx: '专班项目',
          data: tooltipDataZBXM
        }, {xmlx: '自研项目', data: tooltipDataZYXM}, {xmlx: '外采项目', data: tooltipDataWCXM}]
        let tooltipleftData = [{xmlx: '发起项目', data: tooltipDataXMZS}, {xmlx: '参与项目', data: tooltipDataCYXM}]
        setTooltipData(tooltipData);
        setTooltipleftData(tooltipleftData);
        setRadardata(radardata);
        setTotalXMZS(totalXMZS);
        setTotalZBXM(totalZBXM);
        setTotalKTXM(totalKTXM);
        setTotalCYXM(totalCYXM);
        setTotalHJXM(totalHJXM);
        setTotalZYXM(totalZYXM);
        setTotalWCXM(totalWCXM);
        setTotalArr([totalHJXM, totalKTXM, totalZBXM, totalZYXM, totalWCXM])
        console.log("namename", name)
        console.log("radardata", radardata)
        setTotalNameArr(name);
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

  //人员选择
  const handlePrjMngerChange = v => {
    console.log('handlePrjMngerChange', v);
    console.log('handlePrjMngerChange2222', String(v));
    // if (v === undefined) v = '';
    setPrjMnger(v);
    if (v.length > 0) {
      getTableData('DRY', v);
    } else {
      setTooltipData([]);
      setTooltipleftData([]);
      setRadardata([]);
      setTotalXMZS(0);
      setTotalZBXM(0);
      setTotalKTXM(0);
      setTotalCYXM(0);
      setTotalHJXM(0);
      setTotalZYXM(0);
      setTotalWCXM(0);
      setTotalArr([0, 0, 0, 0, 0])
      setTotalNameArr(['暂无']);
    }
  };

  // console.log("tableDatatableData",tableData)

  return (
    <Modal
      wrapClassName="dataComparison-modal"
      style={{top: '10px'}}
      width={'860px'}
      title={null}
      zIndex={100}
      bodyStyle={{
        padding: '0',
      }}
      // onOk={e => this.handleFormValidate(e)}
      onCancel={closeModal}
      maskClosable={false}
      footer={null}
      visible={visible}
    >
      <div
        style={{
          height: '42px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#3361FF',
          color: 'white',
          // marginBottom: '16px',
          padding: '0 24px',
          borderRadius: '8px 8px 0 0',
          fontSize: '15px',
        }}
      >
        <strong>数据对比</strong>
      </div>
      <Spin spinning={memberLoading} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="info-table">
          {/*<div className="info-table-title">*/}
          {/*  领导统计*/}
          {/*</div>*/}
          <div className="console-item">
            <span><span style={{
              fontFamily: 'SimSun, sans-serif',
              color: '#f5222d',
              marginRight: '4px',
              lineHeight: 1
            }}>*</span>选择人员:</span>
            <Select
              showArrow={true}
              mode="multiple"
              className="item-selector"
              dropdownClassName='item-selector-dropdown-radar'
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              onChange={(selectValue) => {
                console.log("selectValue", selectValue)
                // 模式为多选且存在最大值时，当最大长度大于输入长度时触发校验
                if (selectValue?.length > 5) {
                  message.warn("最多选择五人进行比较！")
                  selectValue?.pop(); // 删除多余项
                  handlePrjMngerChange(selectValue);
                } else {
                  handlePrjMngerChange(selectValue);
                }
              }}
              value={prjMnger}
              placeholder="请选择"
            >
              {staffData.map((x, i) => (
                <Option key={i} value={x.id}>
                  {x.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="info-table-content">
            <div className="info-table-content-box">
              <div className="info-table-content-box-title">
                {/*<div className="info-table-content-box-title-left">*/}
                {/*  {tableData[0]?.ORGNAME}*/}
                {/*</div>*/}
                {/*<div className="info-table-content-box-title-right">*/}
                {/*  <i className="iconfont icon-vs"/>数据对比*/}
                {/*</div>*/}
              </div>
              <div style={{float: 'left', margin: '10px 0',}}>
                {
                  tooltipleftData.map(item => {
                    return <div style={{
                      fontSize: '14px',
                      marginBottom: '10px',
                      color: '#303133',
                      fontWeight: 500,
                    }}>
                      <div style={{marginBottom: '6px'}}>{item.xmlx}:</div>
                      {
                        item.data.map(i => {
                          return <div style={{marginBottom: '6px'}}><span
                            style={{fontWeight: 400, color: '#999999'}}>{i.name}:</span><span
                            style={{fontWeight: 500, color: '#303133'}}>&nbsp;&nbsp;{i.value}</span><br/></div>
                        })
                      }</div>
                  })
                }
              </div>
              <div className="info-table-content-box-radar" style={{padding: '16px 0'}}>
                <ReactEchartsCore
                  echarts={echarts}
                  option={getRadarChat()}
                  notMerge
                  lazyUpdate
                  style={{height: '424px'}}
                  theme=""
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
}
