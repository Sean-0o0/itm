import React, { useCallback, useEffect, useState } from 'react';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';
import PaymentStatus from './PaymentStatus';
import ProgressStatistics from './ProgressStatistics';

import {
  FetchQueryLifecycleStuff,
  FetchQueryLiftcycleMilestone,
  QueryIteProjectList,
  QueryIteProjPayPlan,
  QueryIteProjPayRcd,
  QueryMemberAttendanceRcd,
  QueryProjectFiles,
  QueryProjectInfoAll,
  QueryProjectMessages,
  QueryProjectNode,
  QueryProjectTracking,
  QueryProjectUpdateInfo,
  QueryProjectXCContract,
  QueryUserRole,
  QueryProjectProgressStatistics,
} from '../../../services/pmsServices/index';
import { message, Spin } from 'antd';
import { FetchQueryProjectLabel } from '../../../services/projectManage';
import PrjTracking from './PrjTracking';
import PrjNode from './PrjNode';
import PrjDoc from './PrjDoc';
import ShortcutCard from './ShortcutCard';
import PaymentRecord from './PaymentRecord';
import IterationContent from './IterationContent';
import IterationPayment from './IterationPayment';
import AttendanceInfo from './AttendanceInfo';
import moment from 'moment';
import SubPrjProgress from './SubPrjProgress';
import { connect } from 'dva';

export default connect(({ global = {} }) => ({
  userBasicInfo: global.userBasicInfo,
  dictionary: global.dictionary,
}))(function ProjectDetail(props) {
  const { routes = [], xmid, dictionary = {}, userBasicInfo = {} } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [prjData, setPrjData] = useState({}); //项目信息-所有
  const {
    HJRYDJ = [],
    ZSCQLX = [],
    RYGW = [],
    CGFS = [],
    ZYXMKQLX = [],
    CQLX = [],
    QYBZDQZT = [],
    ZSCQDQZT = [],
    FMZLDQZT = [],
    HJLX = [],
    KTZT = [],
    HJQK = [],
  } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  const [isLeader, setIsLeader] = useState(false); //判断用户是否为领导 - 权限控制
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [isHwPrj, setIsHwPrj] = useState(false); //是否包含硬件
  const [isHwSltPrj, setIsHwSltPrj] = useState(false); //是否为硬件入围类型
  const [XMLX, setXMLX] = useState([]); //项目类型
  const [prjDocData, setPrjDocData] = useState({
    data: [],
    total: 0,
    current: 1,
    pageSize: 5,
    loading: false,
    history: [],
    historyLoading: false,
  }); //项目文档数据
  const [msgData, setMsgData] = useState([]); //留言信息
  const [currentStep, setCurrentStep] = useState(0); //当前步骤
  const [mileStoneData, setMileStoneData] = useState([]); //里程碑数据-全部数据
  const [allStaffData, setAllStaffData] = useState([]); //里程碑事项数据-未处理前的
  const [initIndex, setInitIndex] = useState(0); //初始当前里程碑index
  const [lastBtnVisible, setLastBtnVisible] = useState(false); //上一个按钮显示
  const [nextBtnVisible, setNextBtnVisible] = useState(false); //下一个按钮显示
  const [startIndex, setStartIndex] = useState(0); //切割开始index
  const [endIndex, setEndIndex] = useState(5); //切割结束index
  const [isBdgtMnger, setIsBdgtMnger] = useState(false); //是否预算管理人
  const [daysData, setDaysData] = useState({
    curMonth: -1, //当前tab key，月份字符串
    activeId: -1, //高亮的 RYID
    attendanceDays: [], //出勤天
    attendanceHalfDays: [], //出勤半天
    leaveDays: [], //请假天
    leaveHalfDays: [], //请假半天
    overTimeDays: [], //加班天
    overTimeHalfDays: [], //加班半天
    monthData: [], //月份数据
    otherPrjDays: [],
    otherPrjHalfDays: [],
    leftDays: undefined, //剩下的工作日
  }); //考勤信息
  const [grayTest, setGrayTest] = useState({
    KQMK: false, //考勤模块
    DDMK: false, //迭代模块
    ZSCQ: false, //知识产权、获奖荣誉
    XCHT: false, //信创合同
  }); //灰度测试
  let isDDXM =
    prjData.prjBasic?.XMBQ?.includes('迭代项目') ||
    prjData.prjBasic?.XMBQ?.includes('自研迭代项目'); // 是否迭代项目
  let isDDXMFK =
    prjData.prjBasic?.XMBQ?.includes('迭代项目') && !prjData.prjBasic?.XMLX?.includes('自研项目'); // 是否迭代项目付款 - 标签有迭代项目且类型不为自研项目的展示，其他隐藏
  const [showSCDD, setShowSCDD] = useState(false); //显示生成迭代
  let showKQXX =
    prjData.prjBasic?.YSLX === '科研预算' ||
    prjData.prjBasic?.YSXMMC === '自研项目无预算' ||
    prjData.prjBasic?.XMBQ?.includes('抵税扣除'); //显示考勤信息、考勤登记
  let is_XMJL_FXMJL = [
    prjData.prjBasic?.XMJLID,
    ...(prjData.prjBasic?.FXMJL === '' ? [] : prjData.prjBasic?.FXMJL?.split(',') || []),
  ].includes(String(LOGIN_USER_INFO.id)); //快捷入口用的
  const [isGLY, setIsGLY] = useState({
    hjry: false,
    zscq: false,
    rypj: false, //人员评价
  }); //是否管理员
  const [openNewIteContent, setOpenNewIteContent] = useState(false); //（转为自研迭代项目后）打开新增升级内容弹窗
  const ysspHide = String(prjData.prjBasic?.XMZT) === '5'; //预算审批的情况 隐藏 里程碑、项目跟踪、快捷方式、编辑及更多按钮
  const isSinglePayment = String(prjData.prjBasic?.XMLX).includes('单费用付款'); //是否单费用付款项目 项目人员、项目节点、项目跟踪模块不展示。右上角的更多按钮也不展示
  const isEnd = ['5'].includes(String(prjData.prjBasic?.WJZT)); //项目已终止（完结状态为5）的项目详情不能再进行操作
  // var s = 0;
  // var e = 0;

  /** 逾期里程碑数据 */
  const [overdueData, setOverdueData] = useState([]);

  /** 风险数据 */
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    if (xmid !== -1 && HJRYDJ && ZSCQLX && RYGW && CGFS) {
      setIsSpinning(true);
      // s = performance.now();
      handlePromiseAll();
    }
    return () => {
      // console.log('组件销毁呜呜呜呜呜');
      setPrjData({});
    };
  }, [HJRYDJ, ZSCQLX, RYGW, CGFS, xmid]);

  //初次加载
  const handlePromiseAll = async () => {
    try {
      //获取项目类型
      const xmlxPromise = FetchQueryProjectLabel({});
      //获取登录角色数据 - 判断用户是否为领导
      const rolePromise = QueryUserRole({
        userId: Number(LOGIN_USER_INFO.id),
      });
      //获取项目详情数据
      const infoPromise = QueryProjectInfoAll({
        current: 1,
        cxlx: 'ALL',
        pageSize: 10,
        paging: -1,
        sort: '',
        total: -1,
        xmid: Number(xmid),
        // xmid: 334,
      });
      //获取所有里程碑数据
      const allMsPromise = FetchQueryLiftcycleMilestone({
        xmmc: Number(xmid),
        cxlx: 'ALL',
      });
      //获取当前里程碑数据
      const curMsPromise = FetchQueryLiftcycleMilestone({
        xmmc: Number(xmid),
        cxlx: 'SINGLE',
      });
      //里程碑事项数据
      const msItemPromise = FetchQueryLifecycleStuff({
        xmmc: Number(xmid),
        cxlx: 'ALL',
      });
      //获取项目节点数据
      const nodePromise = QueryProjectNode({
        projectId: Number(xmid),
      });
      //获取项目跟踪数据
      const trackingPromise = QueryProjectTracking({
        projectId: Number(xmid),
        // projectManager
        // org
        // startTime
        // endTime
        // cycle
        queryType: 'GZZB',
        // projectType
        sort: 'XMZQ ASC',
      });
      //项目文档数据
      const docPromise = QueryProjectFiles({
        current: 1,
        // fileId: 0,
        // matterId: 0,
        // milestoneId: 0,
        pageSize: 5,
        paging: 1,
        projectId: Number(xmid),
        queryType: 'XMWD',
        sort: '',
        total: -1,
      });
      //项目文档 - 里程碑数据
      const docLcbPromise = QueryProjectFiles({
        current: 1,
        pageSize: 99,
        paging: -1,
        projectId: Number(xmid),
        queryType: 'LCBTJ',
        sort: '',
        total: -1,
      });
      //获取留言数据
      const msgPromise = QueryProjectMessages({
        current: 1,
        czlx: 'ALL',
        pageSize: 10,
        paging: -1,
        sort: '',
        total: -1,
        xmid: Number(xmid),
        ryid: Number(LOGIN_USER_INFO.id),
      });
      //获取进展统计数据
      const progressStatisticsPromise = QueryProjectProgressStatistics({
        projectID: Number(xmid),
      });
      //信创合同信息展示 - ！！！跳转编辑页后只能查看，故无其他刷新，后续可能有变动，需注意
      const invCPromise = QueryProjectXCContract({
        projectId: Number(xmid), //  关联项目
      });

      const [
        xmlxRes,
        roleRes,
        infoRes,
        nodeRes,
        trackingRes,
        docRes,
        docLcbRes,
        msgRes,
        allMsRes,
        curMsRes,
        msItemRes,
        invCRes,
        progressStatisticsRes,
      ] = await Promise.all([
        xmlxPromise,
        rolePromise,
        infoPromise,
        nodePromise,
        trackingPromise,
        docPromise,
        docLcbPromise,
        msgPromise,
        allMsPromise,
        curMsPromise,
        msItemPromise,
        invCPromise,
        progressStatisticsPromise,
      ]);

      const xmlxData = (await xmlxRes) || {};
      const roleData = (await roleRes) || {};
      const infoData = (await infoRes) || {};
      const nodeData = (await nodeRes) || {};
      const trackingData = (await trackingRes) || {};
      const docData = (await docRes) || {};
      const docLcbData = (await docLcbRes) || {};
      const msgData = (await msgRes) || {};
      const allMsData = (await allMsRes) || {};
      const curMsData = (await curMsRes) || {};
      const msItemData = (await msItemRes) || {};
      const inVcData = (await invCRes) || {};
      const progressStatisticsData = (await progressStatisticsRes) || {};

      if (xmlxData.success) {
        let xmlxArr = JSON.parse(xmlxData.xmlxRecord).map(x => {
          return {
            ibm: x.ID,
            note: x.NAME,
          };
        });
        setXMLX(p => [...xmlxArr]);
      }
      if (roleData.success) {
        setIsLeader(roleData.role !== '普通人员');
        setIsBdgtMnger(roleData.zyrole === '预算管理人');
        const roleTxt = (JSON.parse(roleData.testRole || '{}').ALLROLE || '') + roleData.role;
        setIsGLY({
          zscq: roleTxt.includes('知识产权管理员'),
          hjry: roleTxt.includes('获奖荣誉管理员'),
          rypj: roleTxt.includes('人员评价管理员') || roleTxt.includes('二级部门领导'),
        });
        //灰度测试
        const testRole = JSON.parse(roleData.testRole || '{}');
        const { KQDJ = '', DDXM = '', ZSCQ = '', XCHT = '' } = testRole;
        const KQDJ_IDArr = KQDJ === '' ? [] : KQDJ.split(',');
        const KQDJ_Auth = KQDJ_IDArr.includes(String(LOGIN_USER_INFO.id));
        const DDXM_IDArr = DDXM === '' ? [] : DDXM.split(',');
        const DDXM_Auth = DDXM_IDArr.includes(String(LOGIN_USER_INFO.id));
        const ZSCQ_IDArr = ZSCQ === '' ? [] : ZSCQ.split(',');
        const ZSCQ_Auth = ZSCQ_IDArr.includes(String(LOGIN_USER_INFO.id));
        const XCHT_IDArr = XCHT === '' ? [] : XCHT.split(',');
        const XCHT_Auth = XCHT_IDArr.includes(String(LOGIN_USER_INFO.id));
        setGrayTest({ KQMK: true, DDMK: true, ZSCQ: true, XCHT: true });
      }
      if (infoData.success) {
        const p = (str, isArr = true) => {
          if (isArr) return JSON.parse(str) || [];
          return JSON.parse(str)[0] || {};
        };
        let member = p(infoData.ryxxRecord);
        member.forEach(item => {
          item.GWID = item.GW;
          item.GW = RYGW?.filter(x => x.ibm === item.GW)[0]?.note;
        });
        let prjBasic = p(infoData.xmjbxxRecord, false);
        setIsHwSltPrj(prjBasic.XMLX === '6');
        setIsHwPrj(prjBasic.SFBHYJ === '1');
        //知识产权获奖荣誉
        let award = [];
        let topic = [];
        if (prjBasic.XMLX !== '6') {
          const getDqztField = (cqlx, bool) => {
            if (cqlx === '2') return bool ? 'FMZLDQZT' : FMZLDQZT;
            else if (cqlx === '4') return bool ? 'QYBZDQZT' : QYBZDQZT;
            else return bool ? 'ZSCQDQZT' : ZSCQDQZT;
          };
          const getDqztField2 = (cqlx, bool) => {
            if (cqlx === '2') return bool ? 'KTZT' : KTZT;
            else return bool ? 'HJQK' : HJQK;
          };
          //获奖荣誉
          award = HJLX.map(x => ({
            title: x.note,
            data: p(infoData.hjxxRecord)
              .filter(y => y.HJLX === x.ibm)
              .map(m => ({
                ...m,
                //新增当前状态 文本
                DQZT: getDqztField2(m.HJLX).find(f => f.ibm === m[getDqztField2(m.HJLX, true)])
                  ?.note,
              })),
          }));
          //知识产权
          topic = CQLX.map(x => ({
            title: x.note,
            data: p(infoData.ktxxRecord)
              .filter(y => y.CQLX === x.ibm)
              .map(m => ({
                ...m,
                //新增当前状态 文本
                DQZT: getDqztField(m.CQLX).find(f => f.ibm === m[getDqztField(m.CQLX, true)])?.note,
              })),
          }));
        }
        prjBasic.ZBFS = CGFS?.filter(x => x.ibm === prjBasic.ZBFS)[0]?.note;
        prjBasic.XMLX = JSON.parse(xmlxData.xmlxRecord)
          .map(x => {
            return {
              ibm: x.ID,
              note: x.NAME,
            };
          })
          ?.filter(x => x.ibm === prjBasic.XMLX)[0]?.note;
        //供应商信息处理
        function uniqueFunc(arr, uniId) {
          const res = new Map();
          return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
        }
        let supplierArr = uniqueFunc(p(infoData.gysxxRecord), 'GYSID');
        supplierArr.forEach(x => {
          let lxrdata = [];
          p(infoData.gysxxRecord).forEach(y => {
            if (y.GYSID === x.GYSID) lxrdata.push(y);
          });
          x.LXRDATA = [...lxrdata];
        });
        //多合同数据
        let contrastArr = p(infoData.htxxRecord).map(x => ({
          ...x,
          payment: p(infoData.fkxxRecord).filter(y => y.HTID === x.ID),
        }));
        let obj = {
          prjBasic,
          member,
          demand: p(infoData.xqxxRecord),
          risk: p(infoData.fxxxRecord),
          contrast: p(infoData.htxxRecord, false),
          contrastArr,
          bidding: p(infoData.zbxxRecord, false),
          otrSupplier: p(infoData.qtgysxxRecord),
          award,
          topic,
          payment: p(infoData.fkxxRecord),
          supplier: supplierArr,
          xmjbxxRecord: p(infoData.xmjbxxRecord),
        };
        setPrjData(p => ({ ...p, ...obj }));
      }
      if (allMsData.success) {
        //里程碑数据
        let allMsArr = [...allMsData.record];
        const prjBasic = JSON.parse(infoData.xmjbxxRecord)[0] || {};
        //集合项目的时候，隐藏其他里程碑
        if (prjBasic.SFBHZXM && Number(prjBasic.SFBHZXM) > 0) {
          allMsArr = [...allMsData.record].filter(
            x => x.lcbmc === '项目立项' || x.lcbmc === '市场及需求分析',
          );
        }
        let currentIndex = -1;
        //当前里程碑数据
        if (curMsData.success) {
          allMsArr.forEach((x, i) => {
            //添加 isCurrent，用于判断是否为当前里程碑
            x.isCurrent = x.lcbid === curMsData.record[0].lcbid;
            if (x.lcbid === curMsData.record[0].lcbid) {
              currentIndex = i;
            }
          });
          //里程碑事项数据
          if (msItemData.success) {
            setAllStaffData(msItemData.record);
            //事项分类到各个里程碑的 itemData中
            allMsArr.forEach(item => {
              let arr = [];
              msItemData.record?.forEach(x => {
                if (item.lcbid === x.lcbid) {
                  arr.push(x);
                }
              });
              const groupBy = arr => {
                let dataArr = [];
                arr.map(mapItem => {
                  if (dataArr.length === 0) {
                    dataArr.push({ swlx: mapItem.swlx, swItem: [mapItem] });
                  } else {
                    let res = dataArr.some(item => {
                      //判断相同swlx，有就添加到当前项
                      if (item.swlx === mapItem.swlx) {
                        item.swItem.push(mapItem);
                        return true;
                      }
                    });
                    if (!res) {
                      //如果没找相同swlx添加一个新对象
                      dataArr.push({ swlx: mapItem.swlx, swItem: [mapItem] });
                    }
                  }
                });
                return dataArr;
              };
              item.itemData = groupBy(arr);
            });
            setMileStoneData(p => [...allMsArr]);
            //初次刷新，自动选择当前里程碑
            setCurrentStep(currentIndex);
            //集合项目的时候，隐藏其他里程碑，特殊处理
            if (prjBasic.SFBHZXM && Number(prjBasic.SFBHZXM) > 0) {
              let xmlxIndex = 0;
              allMsArr.forEach((y, i) => {
                if (y.lcbmc === '项目立项') xmlxIndex = i;
              });
              setCurrentStep(xmlxIndex);
            }
            if (allMsArr.length >= 3) {
              if (currentIndex - 1 >= 0 && currentIndex + 1 < allMsArr.length) {
                setStartIndex(currentIndex - 1);
                setInitIndex(currentIndex - 1);
                setEndIndex(currentIndex + 2); //不包含
              } else if (currentIndex < 1) {
                setStartIndex(0);
                setInitIndex(0);
                setEndIndex(3);
              } else {
                setInitIndex(allMsArr.length - 3);
                setStartIndex(allMsArr.length - 3);
                setEndIndex(allMsArr.length);
              }
            } else {
              setInitIndex(0);
              setStartIndex(0);
              setEndIndex(allMsArr.length);
            }
            if (allMsArr.length > 3) {
              if (currentIndex - 1 >= 0 && currentIndex < allMsArr.length - 1) {
                setLastBtnVisible(true);
                setNextBtnVisible(true);
              } else if (currentIndex < 1) {
                setLastBtnVisible(false);
                setNextBtnVisible(true);
              } else {
                setNextBtnVisible(false);
                setLastBtnVisible(true);
              }
            } else {
              setLastBtnVisible(false);
              setNextBtnVisible(false);
            }
            if (currentIndex - 1 === 0) {
              setLastBtnVisible(false);
            }
            if (currentIndex === allMsArr.length - 1) {
              setNextBtnVisible(false);
            }
            if (currentIndex >= allMsArr.length - 2) {
              setNextBtnVisible(false);
            }
          }
        }
      }
      if (nodeData.success) {
        let nodeArr = JSON.parse(nodeData.result).reverse();
        setPrjData(p => ({
          ...p,
          nodeData: nodeArr,
        }));
      }
      if (trackingData.success) {
        let trackingArr = JSON.parse(trackingData.result);
        setPrjData(p => ({
          ...p,
          trackingData: trackingArr,
        }));
      }
      if (docData.success) {
        setPrjDocData(p => ({
          ...p,
          data: JSON.parse(docData.wdResult),
          pageTotal: docData.totalrows,
          current: 1,
          pageSize: 5,
          loading: false,
        }));
      }
      if (docLcbData.success) {
        const wdsl = JSON.parse(docLcbData.lcbResult).reduce(
          (total, item) => total + parseInt(item.WDSL),
          0,
        );
        const lcbArr = JSON.parse(docLcbData.lcbResult);
        lcbArr.unshift({
          LCB: '全部',
          LCBID: 'qb',
          WDSL: wdsl,
        });
        setPrjDocData(p => ({
          ...p,
          loading: false,
          lcbOrigin: lcbArr,
          lcb: lcbArr.filter(x => x.LCBID !== 'qb'),
          total: wdsl,
          curLcb: lcbArr[0],
        }));
      }
      if (msgData.success) {
        //最初获取数据
        setMsgData([...JSON.parse(msgData.result)]);
      }
      if (roleData.success && infoData.success) {
        const XMJBXX = JSON.parse(infoData.xmjbxxRecord)[0] || {};
        //灰度测试
        const testRole = JSON.parse(roleData.testRole || '{}');
        const { KQDJ = '', DDXM = '' } = testRole;
        const KQDJ_IDArr = KQDJ === '' ? [] : KQDJ.split(',');
        const KQDJ_Auth = KQDJ_IDArr.includes(String(LOGIN_USER_INFO.id));
        const DDXM_IDArr = DDXM === '' ? [] : DDXM.split(',');
        const DDXM_Auth = DDXM_IDArr.includes(String(LOGIN_USER_INFO.id));

        //.分割，取最后一个
        const glddxmIdArr = XMJBXX.GLDDXM === '' ? [] : XMJBXX.GLDDXM?.split('.') || [];
        const glddxmId = glddxmIdArr.length > 0 ? glddxmIdArr[glddxmIdArr.length - 1] : undefined;
        //迭代项目下拉框数据 - 用于判断是否显示生成迭代、基本信息 - 迭代项目显示
        const itrListData =
          (await QueryIteProjectList({
            current: 1,
            pageSize: glddxmId, //这边是迭代项目id
            paging: -1,
            sort: '',
            total: -1,
            cxlx: 'DDXM',
          })) || {};

        if (itrListData.success) {
          // const itrListArr = [...JSON.parse(itrListData.result)].map(x => x.ID);
          /**
           * 生成迭代按钮显示：
           * (软硬件 且 不包含硬件 或 软硬件 且 包含硬件 且 软件金额>0) 或 关联预算为科研预算
           */
          const isPrjExist = true;
          // itrListArr.includes(String(xmid)); //且 关联项目数据包含本项目
          const isNotCplHard =
            XMJBXX.XMLX === '1' &&
            (XMJBXX.SFBHYJ === '2' || (XMJBXX.SFBHYJ === '1' && parseFloat(XMJBXX.RJYSJE) > 0));
          const isKYYS = XMJBXX.YSLX === '科研预算';
          setShowSCDD((isPrjExist && isNotCplHard) || isKYYS);
          setPrjData(p => ({ ...p, glddxmData: [...JSON.parse(itrListData.result)] }));
        }

        if (
          XMJBXX.XMBQ?.includes('迭代项目') ||
          (XMJBXX.GLDDXM === undefined && Number(XMJBXX.SFGLDD) > 0)
        ) {
          // 获取迭代项目付款记录
          const paymentRecordData = (await QueryIteProjPayRcd({ projectId: Number(xmid) })) || {};
          if (paymentRecordData.success) {
            let paymentRecordArr = JSON.parse(paymentRecordData.fkxxResult);
            let yearArr = JSON.parse(paymentRecordData.nfxxResult)?.filter(
              x => Number(x.ID) !== Number(xmid),
            );
            let curYear = JSON.parse(paymentRecordData.nfxxResult)?.find(
              x => Number(x.ID) === Number(xmid),
            )?.NF;
            setPrjData(p => ({
              ...p,
              paymentRecord: paymentRecordArr,
              iterationYear: {
                currentYear: curYear,
                dropdown: yearArr,
              },
            }));
          }
        }

        if (XMJBXX.XMBQ?.includes('迭代项目')) {
          //获取项目迭代内容
          const iterationCtnPromise = QueryProjectUpdateInfo({
            projectId: Number(xmid),
          });
          //获取迭代项目付款计划
          const iterationPaymentPromise = QueryIteProjPayPlan({ projectId: Number(xmid) });
          const [iterationCtnRes, iterationPaymentRes] = await Promise.all([
            iterationCtnPromise,
            iterationPaymentPromise,
          ]);
          const iterationPaymentData = (await iterationPaymentRes) || {};
          const iterationCtnData = (await iterationCtnRes) || {};
          if (iterationCtnData.success) {
            let iterationCtnArr = JSON.parse(iterationCtnData.result);
            setPrjData(p => ({
              ...p,
              iterationCtn: iterationCtnArr,
            }));
          }
          if (iterationPaymentData.success) {
            setPrjData(p => ({
              ...p,
              iterationPayment: JSON.parse(iterationPaymentData.result),
            }));
          }
        }

        const showKQXX =
          XMJBXX.YSLX === '科研预算' ||
          XMJBXX.YSXMMC === '自研项目无预算' ||
          XMJBXX.XMBQ?.includes('抵税扣除'); //显示考勤信息、考勤登记
        if (showKQXX) {
          //获取考勤信息 - 月份数据
          const attendanceMonthRes = await QueryMemberAttendanceRcd({
            projectId: Number(xmid),
            month: -1,
            queryType: 'YF',
          });
          if (attendanceMonthRes.success) {
            let YFArr = (JSON.parse(attendanceMonthRes.result) || []).map(x => String(x.YF));
            if (YFArr.length > 0) {
              //获取考勤信息 - 左侧信息
              const attendanceRes = await QueryMemberAttendanceRcd({
                projectId: Number(xmid),
                month: Number(YFArr[YFArr.length - 1]),
                queryType: 'GL',
              });
              if (attendanceRes.success) {
                let attendanceArr = JSON.parse(attendanceRes.result);
                setPrjData(p => ({
                  ...p,
                  attendance: attendanceArr,
                }));
                setDaysData(p => ({
                  ...p,
                  curMonth: YFArr[YFArr.length - 1],
                  monthData: YFArr,
                  activeId: -1, //高亮的 RYID
                  attendanceDays: [], //出勤天
                  attendanceHalfDays: [], //出勤半天
                  leaveDays: [], //请假天
                  leaveHalfDays: [], //请假半天
                  overTimeDays: [], //加班天
                  overTimeHalfDays: [], //加班半天
                  otherPrjDays: [],
                  otherPrjHalfDays: [],
                }));
              }
            }
          }
        }

        //子项目
        if (Number(XMJBXX.SFBHZXM || 0) > 0) {
          const subPrjRes =
            (await QueryProjectTracking({
              projectId: Number(xmid),
              startTime: Number(
                moment()
                  .startOf('week')
                  .format('YYYYMMDD'),
              ),
              endTime: Number(
                moment()
                  .endOf('week')
                  .format('YYYYMMDD'),
              ),
              queryType: 'CXZXM',
              sort: 'XMID ASC',
            })) || {};
          if (subPrjRes.success) {
            let subPrjArr = JSON.parse(subPrjRes.result);
            setPrjData(p => ({
              ...p,
              subPrjData: subPrjArr,
            }));
          }
        }
      }
      if (inVcData.success) {
        setPrjData(p => ({
          ...p,
          invCData: JSON.parse(inVcData.result), //信创合同信息展示
        }));
      }
      if (progressStatisticsData.success) {
        const arr = JSON.parse(progressStatisticsData.result);
        const { milestone, risk } = arr;
        // console.log('进度管理的数据', milestone, risk)
        setOverdueData(milestone);
        setRiskData(risk);
      }

      // e = performance.now();
      // console.log(`Request time: ${e - s} milliseconds`, s, e);
      setIsSpinning(false);
    } catch (error) {
      console.error('🚀 ~ handlePromiseAll ~ error:', error);
      message.error('详情信息获取失败', 1);
      setIsSpinning(false);
    }
  };

  // - 后续刷新数据
  //获取项目详情数据
  const getPrjDtlData = () => {
    setIsSpinning(true);
    QueryProjectInfoAll({
      current: 1,
      cxlx: 'ALL',
      pageSize: 10,
      paging: -1,
      sort: '',
      total: -1,
      xmid: Number(xmid),
    })
      .then(res => {
        if (res?.success) {
          const p = (str, isArr = true) => {
            if (isArr) return JSON.parse(str) || [];
            return JSON.parse(str)[0] || {};
          };
          let member = p(res.ryxxRecord);
          member.forEach(item => {
            item.GWID = item.GW;
            item.GW = RYGW?.filter(x => x.ibm === item.GW)[0]?.note;
          });
          let prjBasic = p(res.xmjbxxRecord, false);
          setIsHwSltPrj(prjBasic.XMLX === '6');
          setIsHwPrj(prjBasic.SFBHYJ === '1');
          //知识产权获奖荣誉
          let award = [];
          let topic = [];
          if (prjBasic.XMLX !== '6') {
            const getDqztField = (cqlx, bool) => {
              if (cqlx === '2') return bool ? 'FMZLDQZT' : FMZLDQZT;
              else if (cqlx === '4') return bool ? 'QYBZDQZT' : QYBZDQZT;
              else return bool ? 'ZSCQDQZT' : ZSCQDQZT;
            };
            const getDqztField2 = (cqlx, bool) => {
              if (cqlx === '2') return bool ? 'KTZT' : KTZT;
              else return bool ? 'HJQK' : HJQK;
            };
            //获奖荣誉
            award = HJLX.map(x => ({
              title: x.note,
              data: p(res.hjxxRecord)
                .filter(y => y.HJLX === x.ibm)
                .map(m => ({
                  ...m,
                  //新增当前状态 文本
                  DQZT: getDqztField2(m.HJLX).find(f => f.ibm === m[getDqztField2(m.HJLX, true)])
                    ?.note,
                })),
            }));
            //知识产权
            topic = CQLX.map(x => ({
              title: x.note,
              data: p(res.ktxxRecord)
                .filter(y => y.CQLX === x.ibm)
                .map(m => ({
                  ...m,
                  //新增当前状态 文本
                  DQZT: getDqztField(m.CQLX).find(f => f.ibm === m[getDqztField(m.CQLX, true)])
                    ?.note,
                })),
            }));
          }
          prjBasic.ZBFS = CGFS?.filter(x => x.ibm === prjBasic.ZBFS)[0]?.note;
          prjBasic.XMLX = XMLX?.filter(x => x.ibm === prjBasic.XMLX)[0]?.note;
          //供应商信息处理
          function uniqueFunc(arr, uniId) {
            const res = new Map();
            return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
          }
          let supplierArr = uniqueFunc(p(res.gysxxRecord), 'GYSID');
          supplierArr.forEach(x => {
            let lxrdata = [];
            p(res.gysxxRecord).forEach(y => {
              if (y.GYSID === x.GYSID) lxrdata.push(y);
            });
            x.LXRDATA = [...lxrdata];
          });

          //多合同数据 - 单词拼错了-_-|
          let contrastArr = p(res.htxxRecord).map(x => ({
            ...x,
            payment: p(res.fkxxRecord).filter(y => y.HTID === x.ID),
          }));

          const XMJBXX = p(res.xmjbxxRecord, false);
          //是否显示生成迭代
          const isNotCplHard =
            XMJBXX.XMLX === '1' &&
            (XMJBXX.SFBHYJ === '2' || (XMJBXX.SFBHYJ === '1' && parseFloat(XMJBXX.RJYSJE) > 0));
          const isKYYS = prjBasic.YSLX === '科研预算';
          setShowSCDD(isNotCplHard || isKYYS);

          let obj = {
            prjBasic,
            member,
            demand: p(res.xqxxRecord),
            risk: p(res.fxxxRecord),
            contrast: p(res.htxxRecord, false),
            contrastArr,
            bidding: p(res.zbxxRecord, false),
            otrSupplier: p(res.qtgysxxRecord),
            award,
            topic,
            payment: p(res.fkxxRecord),
            supplier: supplierArr,
            xmjbxxRecord: p(res.xmjbxxRecord),
          };
          setPrjData(p => ({ ...p, ...obj }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('QueryProjectInfoAll', e);
        message.error('项目详情信息查询失败', 1);
        setIsSpinning(false);
      });
  };

  //项目文档信息
  const getPrjDocData = ({ current = 1, pageSize = 5, LCBID = undefined, totalChange = false }) => {
    setPrjDocData(p => ({ ...p, loading: true }));
    QueryProjectFiles({
      current,
      // fileId: 0,
      // matterId: 0,
      milestoneId: LCBID ? Number(LCBID) : undefined,
      pageSize,
      paging: 1,
      projectId: Number(xmid),
      queryType: 'XMWD',
      sort: '',
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          setPrjDocData(p => ({
            ...p,
            data: JSON.parse(res.wdResult),
            pageTotal: res.totalrows,
            current,
            pageSize,
            loading: false,
          }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀项目文档信息', e);
        message.error('项目文档信息获取失败', 1);
        setIsSpinning(false);
        setPrjDocData(p => ({ ...p, loading: false }));
      });
    //项目文档-里程碑 - totalChange文档数量会改变时调用
    totalChange &&
      QueryProjectFiles({
        current: 1,
        pageSize: 99,
        paging: -1,
        projectId: Number(xmid),
        queryType: 'LCBTJ',
        sort: '',
        total: -1,
      })
        .then(res => {
          if (res?.success) {
            const wdsl = JSON.parse(res.lcbResult).reduce(
              (total, item) => total + parseInt(item.WDSL),
              0,
            );
            const lcbArr = JSON.parse(res.lcbResult);
            lcbArr.unshift({
              LCB: '全部',
              LCBID: 'qb',
              WDSL: wdsl,
            });
            setPrjDocData(p => ({
              ...p,
              loading: false,
              lcbOrigin: lcbArr,
              lcb: lcbArr.filter(x => x.LCBID !== 'qb'),
              total: wdsl,
              curLcb: lcbArr[0],
            }));
            setIsSpinning(false);
          }
        })
        .catch(e => {
          console.error('🚀项目文档-里程碑信息', e);
          message.error('项目文档-里程碑信息获取失败', 1);
          setIsSpinning(false);
          setPrjDocData(p => ({ ...p, loading: false }));
        });
  };

  //获取里程碑数据
  const getMileStoneData = async (isInitCurStep = false) => {
    setIsSpinning(true);
    try {
      //获取所有里程碑数据
      const allMsPromise = FetchQueryLiftcycleMilestone({
        xmmc: Number(xmid),
        cxlx: 'ALL',
      });
      //获取当前里程碑数据
      const curMsPromise = FetchQueryLiftcycleMilestone({
        xmmc: Number(xmid),
        cxlx: 'SINGLE',
      });
      //里程碑事项数据
      const msItemPromise = FetchQueryLifecycleStuff({
        xmmc: Number(xmid),
        cxlx: 'ALL',
      });
      const [allMsRes, curMsRes, msItemRes] = await Promise.all([
        allMsPromise,
        curMsPromise,
        msItemPromise,
      ]);
      const allMsData = (await allMsRes) || {};
      const curMsData = (await curMsRes) || {};
      const msItemData = (await msItemRes) || {};
      if (allMsData.success) {
        //里程碑数据
        let allMsArr = [...allMsData.record];
        //集合项目的时候，隐藏其他里程碑
        if (prjData.prjBasic?.SFBHZXM && Number(prjData.prjBasic?.SFBHZXM) > 0) {
          allMsArr = [...allMsData.record].filter(
            x => x.lcbmc === '项目立项' || x.lcbmc === '市场及需求分析',
          );
        }
        let currentIndex = -1;
        //当前里程碑数据
        if (curMsData.success) {
          allMsArr.forEach((x, i) => {
            //添加 isCurrent，用于判断是否为当前里程碑
            x.isCurrent = x.lcbid === curMsData.record[0].lcbid;
            if (x.lcbid === curMsData.record[0].lcbid && isInitCurStep) {
              //目前只有编辑项目之后会初始化高亮
              setCurrentStep(i);
              currentIndex = i;
            }
          });

          //目前只有编辑项目之后会初始化高亮
          if (isInitCurStep) {
            if (allMsArr.length >= 3) {
              if (currentIndex - 1 >= 0 && currentIndex + 1 < allMsArr.length) {
                setStartIndex(currentIndex - 1);
                setInitIndex(currentIndex - 1);
                setEndIndex(currentIndex + 2); //不包含
              } else if (currentIndex < 1) {
                setStartIndex(0);
                setInitIndex(0);
                setEndIndex(3);
              } else {
                setInitIndex(allMsArr.length - 3);
                setStartIndex(allMsArr.length - 3);
                setEndIndex(allMsArr.length);
              }
            } else {
              setInitIndex(0);
              setStartIndex(0);
              setEndIndex(allMsArr.length);
            }
            if (allMsArr.length > 3) {
              if (currentIndex - 1 >= 0 && currentIndex < allMsArr.length - 1) {
                setLastBtnVisible(true);
                setNextBtnVisible(true);
              } else if (currentIndex < 1) {
                setLastBtnVisible(false);
                setNextBtnVisible(true);
              } else {
                setNextBtnVisible(false);
                setLastBtnVisible(true);
              }
            } else {
              setLastBtnVisible(false);
              setNextBtnVisible(false);
            }
            if (currentIndex - 1 === 0) {
              setLastBtnVisible(false);
            }
            if (currentIndex === allMsArr.length - 1) {
              setNextBtnVisible(false);
            }
            if (currentIndex >= allMsArr.length - 2) {
              setNextBtnVisible(false);
            }
          }

          //里程碑事项数据
          if (msItemData.success) {
            setAllStaffData(msItemData.record);
            //事项分类到各个里程碑的 itemData中
            allMsArr.forEach(item => {
              let arr = [];
              msItemData.record?.forEach(x => {
                if (item.lcbid === x.lcbid) {
                  arr.push(x);
                }
              });
              const groupBy = arr => {
                let dataArr = [];
                arr.map(mapItem => {
                  if (dataArr.length === 0) {
                    dataArr.push({ swlx: mapItem.swlx, swItem: [mapItem] });
                  } else {
                    let res = dataArr.some(item => {
                      //判断相同swlx，有就添加到当前项
                      if (item.swlx === mapItem.swlx) {
                        item.swItem.push(mapItem);
                        return true;
                      }
                    });
                    if (!res) {
                      //如果没找相同swlx添加一个新对象
                      dataArr.push({ swlx: mapItem.swlx, swItem: [mapItem] });
                    }
                  }
                });
                return dataArr;
              };
              item.itemData = groupBy(arr);
            });
            setMileStoneData(p => [...allMsArr]);
            setIsSpinning(false);
          }
        }
      }
    } catch (error) {
      console.error('🚀 ~ 里程碑信息查询失败', error);
      message.error('里程碑信息查询失败', 1);
      setIsSpinning(false);
    }
  };

  //获取项目跟踪数据
  const getTrackingData = () => {
    setIsSpinning(true);
    QueryProjectTracking({
      projectId: Number(xmid),
      queryType: 'GZZB',
      sort: 'XMZQ ASC',
    })
      .then(res => {
        if (res?.success) {
          setPrjData(p => ({ ...p, trackingData: JSON.parse(res.result) }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀项目跟踪数据获取失败', e);
        message.error('项目跟踪数据获取失败', 1);
        setIsSpinning(false);
      });
  };

  //获取项目迭代内容
  const getIterationCtn = () => {
    setIsSpinning(true);
    QueryProjectUpdateInfo({
      projectId: Number(xmid),
    })
      .then(res => {
        if (res?.success) {
          setPrjData(p => ({ ...p, iterationCtn: JSON.parse(res.result) }));
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('🚀项目迭代内容获取失败', e);
        message.error('项目迭代内容获取失败', 1);
        setIsSpinning(false);
      });
  };

  //考勤信息 - 月份范围
  const getMonthRange = pastDateStr => {
    // 项目创建时间
    const pastDate = moment(pastDateStr, 'YYYYMMDD');
    // 当前时间
    const currentDate = moment();
    // 获取从过去时间到当前时间的月份数组
    const monthsArray = [];
    let cursor = pastDate.clone(); // 使用克隆方法来避免改变原始时间对象
    while (cursor.isSameOrBefore(currentDate, 'month')) {
      monthsArray.push(cursor.format('YYYYMM'));
      cursor.add(1, 'month');
    }
    return monthsArray;
  };

  // 获取个人考勤信息 - 右侧信息
  const getCalendarData = async (memberId, month, projectId, fn = () => {}) => {
    try {
      fn(true);
      const atdCalendarResult = await QueryMemberAttendanceRcd({
        memberId,
        month,
        projectId,
        queryType: 'XQ',
      });
      if (atdCalendarResult.success) {
        const atdCalendarArr = JSON.parse(atdCalendarResult.result);
        const attendanceDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 3 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)));
        const attendanceHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 1 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)));
        const leaveDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 4 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)));
        const leaveHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 2 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)));
        const overTimeDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 5 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)));
        const overTimeHalfDaysArr = atdCalendarArr
          .filter(x => x.KQLX === 6 && Number(x.XMMC) === Number(xmid))
          .map(x => moment(String(x.RQ)));
        const otherPrjArr = atdCalendarArr
          .filter(x => Number(x.XMMC) !== Number(xmid) && [3, 5, 4].includes(x.KQLX))
          .map(x => ({ ...x, RQ: moment(String(x.RQ)) }));
        const otherPrjHalfArr = atdCalendarArr
          .filter(x => Number(x.XMMC) !== Number(xmid) && [1, 6, 2].includes(x.KQLX))
          .map(x => ({ ...x, RQ: moment(String(x.RQ)) }));
        // console.log({
        //   curMonth: String(month),
        //   activeId: memberId,
        //   attendanceDays: attendanceDaysArr,
        //   attendanceHalfDays: attendanceHalfDaysArr,
        //   leaveDays: leaveDaysArr,
        //   leaveHalfDays: leaveHalfDaysArr,
        //   overTimeDays: overTimeDaysArr,
        //   overTimeHalfDays: overTimeHalfDaysArr,
        // });
        // let currentDay = moment(month, 'YYYYMM')
        //   .clone()
        //   .startOf('month');
        // const workdaysRes = await QueryWeekday({
        //   begin: Number(currentDay.format('YYYYMMDD')),
        //   days: 31,
        //   queryType: 'ALL',
        // });
        // if (workdaysRes?.success) {
        //   let workdays = JSON.parse(workdaysRes.result)
        //     .map(x => moment(String(x.GZR)))
        //     .filter(x => x.month() === moment(month, 'YYYYMM').month());
        //   //剩下的工作日
        //   let leftDays = workdays.filter(
        //     x =>
        //       atdCalendarArr.map(z => moment(String(z.RQ))).findIndex(y => x.isSame(y, 'day')) ===
        //       -1,
        //   ).length;

        setDaysData(p => ({
          ...p,
          curMonth: String(month),
          activeId: memberId,
          attendanceDays: attendanceDaysArr,
          attendanceHalfDays: attendanceHalfDaysArr,
          leaveDays: leaveDaysArr,
          leaveHalfDays: leaveHalfDaysArr,
          overTimeDays: overTimeDaysArr,
          overTimeHalfDays: overTimeHalfDaysArr,
          otherPrjDays: otherPrjArr,
          otherPrjHalfDays: otherPrjHalfArr,
          // leftDays, //剩下的工作日
        }));
        fn(false);
        // } else {
        //   fn(false);
        // }
      }
    } catch (e) {
      message.error('考勤信息获取失败', 1);
      console.error('获取个人考勤信息 - 右侧信息', e);
      fn(false);
    }
  };

  //获取考勤信息 - 左侧信息
  const getAttendanceData = async (month, projectId, fn = () => {}) => {
    try {
      fn(true);
      const attendanceRes = await QueryMemberAttendanceRcd({
        projectId,
        month,
        queryType: 'GL',
      });
      if (attendanceRes.success) {
        let attendanceArr = JSON.parse(attendanceRes.result);
        setPrjData(p => ({
          ...p,
          attendance: attendanceArr,
        }));
        setDaysData(p => ({
          ...p,
          curMonth: String(month),
          activeId: -1, //高亮的 RYID
          attendanceDays: [], //出勤天
          attendanceHalfDays: [], //出勤半天
          leaveDays: [], //请假天
          leaveHalfDays: [], //请假半天
          overTimeDays: [], //加班天
          overTimeHalfDays: [], //加班半天
          otherPrjDays: [],
          otherPrjHalfDays: [],
        }));
        fn(false);
      }
    } catch (error) {
      message.error('考勤信息获取失败', 1);
      console.error('获取考勤信息 - 左侧信息', e);
      fn(false);
    }
  };

  //获取迭代项目付款计划
  const getIterationPayment = async () => {
    try {
      setIsSpinning(true);
      const iterationPaymentData = await QueryIteProjPayPlan({ projectId: Number(xmid) });
      if (iterationPaymentData.success) {
        setPrjData(p => ({
          ...p,
          iterationPayment: JSON.parse(iterationPaymentData.result),
        }));
        setIsSpinning(false);
      }
    } catch (e) {
      message.error('考勤信息获取失败', 1);
      console.error('获取考勤信息 - 左侧信息', e);
      setIsSpinning(false);
    }
  };

  //获取子项目进度数据
  const getSubPrjData = async () => {
    try {
      setIsSpinning(true);
      const subPrjRes = await QueryProjectTracking({
        projectId: Number(xmid),
        startTime: Number(
          moment()
            .startOf('week')
            .format('YYYYMMDD'),
        ),
        endTime: Number(
          moment()
            .endOf('week')
            .format('YYYYMMDD'),
        ),
        queryType: 'CXZXM',
        sort: 'XMID ASC',
      });
      if (subPrjRes.success) {
        let subPrjArr = JSON.parse(subPrjRes.result);
        setPrjData(p => ({
          ...p,
          subPrjData: subPrjArr,
        }));
      }
    } catch (e) {
      message.error('子项目进度数据获取失败', 1);
      console.error('获取子项目进度数据', e);
      setIsSpinning(false);
    }
  };

  /** 获取进度管理数据 */
  const getProgressStatisticsData = async () => {
    const queryParams = {
      projectID: Number(xmid),
    };
    try {
      const res = await QueryProjectProgressStatistics(queryParams);
      if (res.code === 1) {
        const arr = JSON.parse(res.result);
        const { milestone, risk } = arr;
        setOverdueData(milestone);
        setRiskData(risk);
      }
    } catch (err) {
      message.error(`查询项目逾期情况和风险情况失败，${!err.success ? err.message : err.note}`, 3);
    }
  };

  return (
    <Spin
      spinning={isSpinning}
      tip="加载中"
      size="large"
      wrapperClassName="diy-style-spin-prj-detail"
    >
      <div className="prj-detail-box">
        <TopConsole
          xmid={xmid}
          routes={routes}
          prjData={prjData}
          getPrjDtlData={getPrjDtlData}
          getMileStoneData={getMileStoneData}
          isLeader={isLeader}
          haveSpl={!isHwSltPrj && prjData?.supplier?.length !== 0}
          setIsSpinning={setIsSpinning}
          setPrjData={setPrjData}
          isDDXM={
            prjData.prjBasic?.XMBQ?.includes('迭代项目') ||
            (prjData.prjBasic?.GLDDXM === undefined && Number(prjData.prjBasic?.SFGLDD) > 0)
          }
          grayTest={grayTest}
          isAdmin={userBasicInfo.id === '0'} //项目编辑，管理员可以编辑所有项目，子项目的项目立项里程碑信息，也对管理员开放编辑
          ysspHide={ysspHide}
          isSinglePayment={isSinglePayment}
          isEnd={isEnd}
        />
        <div className="detail-row">
          <div className="col-left">
            {isDDXM && (
              <IterationContent
                prjData={prjData}
                xmid={xmid}
                is_XMJL_FXMJL={is_XMJL_FXMJL}
                getIterationCtn={getIterationCtn}
                openNewIteContent={openNewIteContent}
                ysspHide={ysspHide}
                isEnd={isEnd}
              />
            )}
            {isDDXMFK && !ysspHide && !isEnd && (
              <IterationPayment
                prjData={prjData}
                xmid={xmid}
                is_XMJL_FXMJL={is_XMJL_FXMJL}
                isLeader={isLeader}
                funcProps={{
                  getIterationPayment,
                  getPrjDtlData,
                }}
              />
            )}
            <MileStone
              xmid={xmid}
              prjData={prjData}
              getPrjDtlData={() => {
                getPrjDtlData();
                getMileStoneData();
                getPrjDocData({ totalChange: true });
                getTrackingData();
                getProgressStatisticsData();
              }}
              setIsSpinning={setIsSpinning}
              isLeader={isLeader}
              isHwSltPrj={isHwSltPrj}
              isDDXM={isDDXM}
              stateProps={{
                currentStep,
                setCurrentStep,
                mileStoneData,
                initIndex,
                setInitIndex,
                lastBtnVisible,
                setLastBtnVisible,
                nextBtnVisible,
                setNextBtnVisible,
                startIndex,
                setStartIndex,
                endIndex,
                setEndIndex,
              }}
              ysspHide={ysspHide}
              isSinglePayment={isSinglePayment}
              routes={routes}
              isEnd={isEnd}
            />
            <PrjTracking
              xmid={xmid}
              prjData={prjData}
              getTrackingData={getTrackingData}
              isLeader={isLeader}
              dictionary={dictionary}
              ysspHide={ysspHide}
              isEnd={isEnd}
              isSinglePayment={isSinglePayment}
            />
            <InfoDisplay
              isHwSltPrj={isHwSltPrj}
              prjData={prjData}
              routes={routes}
              xmid={xmid}
              isLeader={isLeader}
              isBdgtMnger={isBdgtMnger}
              isDDXM={isDDXM}
              grayTest={grayTest}
              isSinglePayment={isSinglePayment}
            />
            <SubPrjProgress dataProps={{ prjData, routes }} funcProps={{}} />
            {showKQXX && (
              <AttendanceInfo
                dataProps={{ prjData, xmid, daysData, routes }}
                funcProps={{ getCalendarData, getAttendanceData, setDaysData }}
              />
            )}
          </div>
          <div className="col-right">
            <ProgressStatistics
              isSpinning={isSpinning}
              overdueData={overdueData}
              riskData={riskData}
            />

            <PaymentStatus
              xmid={xmid}
              prjData={prjData}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />
            <ShortcutCard
              dataProps={{
                prjData,
                xmid,
                ZYXMKQLX,
                showSCDD,
                routes,
                showKQXX,
                isGLY,
                grayTest,
                is_XMJL_FXMJL,
                allStaffData,
                ysspHide,
                isSinglePayment,
                isEnd,
              }}
              funcProps={{
                getPrjDtlData,
                setIsSpinning,
                handlePromiseAll,
                setShowSCDD,
                setOpenNewIteContent,
              }}
            />
            <PrjMember
              routes={routes}
              prjData={prjData}
              xmid={xmid}
              getPrjDtlData={getPrjDtlData}
              isLeader={isLeader}
              isSinglePayment={isSinglePayment}
            />
            {isDDXM && <PaymentRecord prjData={prjData} />}
            <PrjNode prjData={prjData} isSinglePayment={isSinglePayment} />
            <PrjDoc
              prjDocData={prjDocData}
              setPrjDocData={setPrjDocData}
              getPrjDocData={getPrjDocData}
              prjData={prjData}
              isLeader={isLeader}
            />
            <PrjMessage xmid={xmid} msgData={msgData} setMsgData={setMsgData} />
          </div>
        </div>
      </div>
    </Spin>
  );
});
