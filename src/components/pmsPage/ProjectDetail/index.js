import React, { useEffect, useState } from 'react';
import InfoDisplay from './InfoDisplay';
import MileStone from './MileStone';
import PrjMember from './PrjMember';
import PrjMessage from './PrjMessage';
import TopConsole from './TopConsole';
import {
  FetchQueryLifecycleStuff,
  FetchQueryLiftcycleMilestone,
  QueryProjectFiles,
  QueryProjectInfoAll,
  QueryProjectMessages,
  QueryProjectNode,
  QueryProjectTracking,
  QueryUserRole,
} from '../../../services/pmsServices/index';
import { message, Spin } from 'antd';
import { FetchQueryProjectLabel } from '../../../services/projectManage';
import PrjTracking from './PrjTracking';
import PrjNode from './PrjNode';
import PrjDoc from './PrjDoc';

export default function ProjectDetail(props) {
  const { routes, xmid, dictionary } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [prjData, setPrjData] = useState({}); //项目信息-所有
  const { HJRYDJ, ZSCQLX, RYGW, CGFS } = dictionary; //获奖等级、知识产权类型、岗位、招采方式
  const [isLeader, setIsLeader] = useState(false); //判断用户是否为领导 - 权限控制
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
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
  const [initIndex, setInitIndex] = useState(0); //初始当前里程碑index
  const [lastBtnVisible, setLastBtnVisible] = useState(false); //上一个按钮显示
  const [nextBtnVisible, setNextBtnVisible] = useState(false); //下一个按钮显示
  const [startIndex, setStartIndex] = useState(0); //切割开始index
  const [endIndex, setEndIndex] = useState(5); //切割结束index
  const [isBdgtMnger, setIsBdgtMnger] = useState(false); //是否预算管理人
  // var s = 0;
  // var e = 0;

  useEffect(() => {
    if (xmid !== -1 && HJRYDJ && ZSCQLX && RYGW && CGFS) {
      setIsSpinning(true);
      // s = performance.now();
      handlePromiseAll();
    }
    return () => {};
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
        //字典处理
        let award = p(infoData.hjxxRecord);
        prjBasic.XMLX !== '6' &&
          award.forEach(item => {
            item.RYDJ = HJRYDJ?.filter(x => x.ibm === item.RYDJ)[0]?.note;
            item.ZSCQLX = ZSCQLX?.filter(x => x.ibm === item.ZSCQLX)[0]?.note;
            item.HJSJ = item.HJSJ.slice(0, 10);
          });
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
        let obj = {
          prjBasic,
          member,
          demand: p(infoData.xqxxRecord),
          risk: p(infoData.fxxxRecord),
          contrast: p(infoData.htxxRecord, false),
          bidding: p(infoData.zbxxRecord, false),
          otrSupplier: p(infoData.qtgysxxRecord),
          award,
          topic: p(infoData.ktxxRecord),
          payment: p(infoData.fkxxRecord),
          supplier: supplierArr,
          xmjbxxRecord: p(infoData.xmjbxxRecord),
        };
        console.log('🚀 ~ file: index.js:229 ~ handlePromiseAll ~ obj:', obj);
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
          // total: docData.totalrows,
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

      // e = performance.now();
      // console.log(`Request time: ${e - s} milliseconds`, s, e);
      setIsSpinning(false);
    } catch (error) {
      console.error('🚀 ~ handlePromiseAll ~ error:', error);
      message.error('详情信息获取失败', 1);
      setIsSpinning(false);
    }
  };

  //获取项目详情数据 - 后续刷新数据
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
          //字典处理
          let award = p(res.hjxxRecord);
          prjBasic.XMLX !== '6' &&
            award.forEach(item => {
              item.RYDJ = HJRYDJ?.filter(x => x.ibm === item.RYDJ)[0]?.note;
              item.ZSCQLX = ZSCQLX?.filter(x => x.ibm === item.ZSCQLX)[0]?.note;
              item.HJSJ = item.HJSJ.slice(0, 10);
            });
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
          let obj = {
            prjBasic,
            member,
            demand: p(res.xqxxRecord),
            risk: p(res.fxxxRecord),
            contrast: p(res.htxxRecord, false),
            bidding: p(res.zbxxRecord, false),
            otrSupplier: p(res.qtgysxxRecord),
            award,
            topic: p(res.ktxxRecord),
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

  //项目文档信息 - 后续刷新数据
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
            total: res.totalrows,
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

  //获取里程碑数据 - 后续刷新数据
  const getMileStoneData = async () => {
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
        //当前里程碑数据
        if (curMsData.success) {
          allMsArr.forEach((x, i) => {
            //添加 isCurrent，用于判断是否为当前里程碑
            x.isCurrent = x.lcbid === curMsData.record[0].lcbid;
          });
          //里程碑事项数据
          if (msItemData.success) {
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
    QueryProjectTracking({
      projectId: Number(xmid),
      queryType: 'GZZB',
      sort: 'XMZQ ASC',
    })
      .then(res => {
        if (res?.success) {
          setPrjData(p => ({ ...p, trackingData: JSON.parse(res.result) }));
        }
      })
      .catch(e => {
        message.error('接口信息获取失败', 1);
      });
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
        />
        <div className="detail-row">
          <div className="col-left">
            <MileStone
              xmid={xmid}
              prjData={prjData}
              getPrjDtlData={() => {
                // getPrjDtlData();
                getMileStoneData();
                // getPrjDocData({ totalChange: true });
              }}
              setIsSpinning={setIsSpinning}
              isLeader={isLeader}
              isHwSltPrj={isHwSltPrj}
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
            />
            <PrjTracking xmid={xmid} prjData={prjData} getTrackingData={getTrackingData} isLeader={isLeader}/>
            <InfoDisplay
              isHwSltPrj={isHwSltPrj}
              prjData={prjData}
              routes={routes}
              xmid={xmid}
              isLeader={isLeader}
              isBdgtMnger={isBdgtMnger}
            />
          </div>
          <div className="col-right">
            <PrjMember
              routes={routes}
              prjData={prjData}
              xmid={xmid}
              getPrjDtlData={getPrjDtlData}
              isLeader={isLeader}
            />
            <PrjNode prjData={prjData} />
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
}
