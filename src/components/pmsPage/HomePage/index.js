import { Carousel, message, Spin } from 'antd';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  QueryBudgetOverviewInfo,
  QueryMemberOverviewInfo,
  QueryProjectGeneralInfo,
  QueryStagingOverviewInfo,
  QuerySupplierOverviewInfo,
  QueryUserRole,
  FetchQueryOwnerMessage,
  FetchQueryOwnerWorkflow,
  FetchQueryOwnerProjectList,
  FetchQueryCustomReportList,
  QueryProjectTracking,
  QueryProjectDraft,
  QueryWeekday,
  QueryProjectStatusList,
} from '../../../services/pmsServices';
import CptBudgetCard from './CptBudgetCard';
import GuideCard from './GuideCard';
import OverviewCard from './OverviewCard';
import ProcessCard from './ProcessCard';
import ProjectCard from './ProjectCard';
import ShortcutCard from './ShortcutCard';
import SupplierCard from './SupplierCard';
import TeamCard from './TeamCard';
import ToDoCard from './ToDoCard';
import moment from 'moment';
import AnalyzeRepsCard from './AnalyzeRepsCard';
import PrjTracking from './PrjTracking';
import SystemNotice from './SystemNotice';
import PrjDynamic from './PrjDynamic';
import PrjSituation from './PrjSituation';
import {
  FetchQueryOrganizationInfo,
  FetchQueryProjectLabel,
} from '../../../services/projectManage';
import { setParentSelectableFalse } from '../../../utils/pmsPublicUtils';
import TreeUtils from '../../../utils/treeUtils';
import { get, debounce as debounceFn } from 'lodash';

//金额格式化
const getAmountFormat = value => {
  if ([undefined, null, '', ' ', NaN].includes(value)) return '';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export { getAmountFormat };
export default function HomePage(props) {
  const { cacheLifecycles, dictionary, roleData = {}, authorities = {} } = props;
  let LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [leftWidth, setLeftWidth] = useState('71.405%'); //左侧功能块宽度
  const [itemWidth, setItemWidth] = useState('32%'); //待办、项目每小块宽度
  const [userRole, setUserRole] = useState(''); //用户角色
  const [overviewInfo, setOverviewInfo] = useState({}); //项目概览
  const [prjInfo, setPrjInfo] = useState([]); //项目信息情况
  const [budgetData, setBudgetData] = useState({}); //预算执行情况
  const [teamData, setTeamData] = useState([]); //队伍建设
  const [supplierData, setSupplierData] = useState({}); //供应商情况
  const [toDoData, setToDoData] = useState([]); //待办数据
  const [processData, setProcessData] = useState([]); //流程情况
  const [noticeData, setNoticeData] = useState([]); //系统公告数据
  const [statisticYearData, setStatisticYearData] = useState({
    dropdown: [], //下拉菜单数据
    currentYear: moment().year(), //当前年份
  }); //统计年份数据
  const [placement, setPlacement] = useState('rightTop'); //参与人popover位置
  const [total, setTotal] = useState({
    todo: 0,
    project: 0,
    process: 0,
    tracking: 0,
  }); //数据总数
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  //以下：报表状态
  const [showExtendsWD, setShowExtendsWD] = useState(false);
  const [totalWD, setWDTotal] = useState(0); //分析报表数据总条数
  const [cusRepDataWD, setCusRepDataWD] = useState([]); //分析报表数据
  const [isLoading, setIsLoading] = useState(false); //加载状态
  //以下：跟踪状态
  const [params, setParams] = useState({
    current: 1,
    pageSize: 9,
    org: '',
    projectId: '',
    projectManager: '',
    projectType: '',
  }); //表格数据-项目列表
  const [trackingData, setTrackingData] = useState([{ tableInfo: [] }]);
  const [isTrackingSpinning, setIsTrackingSpinning] = useState(false);
  const [showExtends, setShowExtends] = useState(false);
  const [isGLY, setIsGLY] = useState({
    hjry: false,
    zscq: false,
  }); //是否管理员
  const [grayTest, setGrayTest] = useState({
    KQMK: false, //考勤模块
    DDMK: false, //迭代模块
    ZSCQ: false, //知识产权、获奖荣誉
  }); //灰度测试
  const [popLoading, setPopLoading] = useState(false); //浮窗数据加载状态 - 待办
  const [dynamicData, setDynamicData] = useState({
    data: [],
    current: 1,
    pageSize: 5,
    total: -1,
  }); //项目动态
  const [labelData, setLabelData] = useState([]); //标签数据
  const [orgData, setOrgData] = useState([]); //部门数据
  const [prjSituationData, setPrjSituationData] = useState({
    loading: false,
    data: [],
    total: -1,
  }); //项目情况数据
  const roleTxt =
    (JSON.parse(roleData.testRole || '{}')?.ALLROLE ?? '') + ',' + (roleData.role ?? ''); //角色信息
  var s = 0;
  var e = 0;

  //防抖定时器
  let timer = null;

  // 页面恢复，跳转回首页时触发
  cacheLifecycles.didRecover(() => {
    setPlacement('rightTop'); //参与人popover位置
    // console.log('跳转回首页时触发');
  });

  cacheLifecycles.didCache(() => {
    setPlacement(undefined); //参与人popover位置
    // console.log('首页缓存时触发');
  });

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    s = performance.now();
    getDefaultYear();
    return () => {};
  }, [JSON.stringify(roleData)]);

  //获取默认年份
  const getDefaultYear = () => {
    setIsSpinning(true);
    QueryWeekday({
      begin: 20600101,
      days: 31,
      queryType: 'YSCKNF',
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.result);
          if (data.length > 0) {
            const year = data[0].YSCKNF ? moment(String(data[0].YSCKNF), 'YYYY') : moment();
            handlePromiseAll(year.year());
            //默认统计年份
            setStatisticYearData(p => ({ ...p, currentYear: year.year() }));
          }
        }
      })
      .catch(e => {
        console.error('🚀默认年份', e);
        message.error('默认年份获取失败', 1);
        setIsSpinning(false);
      });
  };

  //初次加载
  const handlePromiseAll = async (year = statisticYearData.currentYear) => {
    try {
      setIsSpinning(true);
      const ROLE = roleData.role;
      setUserRole(ROLE);
      setIsGLY({
        zscq: JSON.parse(roleData.testRole || '{}').ALLROLE?.includes('知识产权管理员'),
        hjry: JSON.parse(roleData.testRole || '{}').ALLROLE?.includes('获奖荣誉管理员'),
      });

      //获取预算执行情况
      const budgetPromise = QueryBudgetOverviewInfo({
        org: Number(LOGIN_USER_INFO.org),
        queryType: 'SY',
        role: ROLE,
        year,
      });
      //项目信息
      const prjPromise = QueryProjectDraft({
        projectManager: Number(LOGIN_USER_INFO.id),
      });
      //获取待办、系统公告数据
      const todoPromise = FetchQueryOwnerMessage({
        cxlx: 'DB',
        date: Number(new moment().format('YYYYMMDD')),
        paging: 1,
        current: 1,
        pageSize: 99999,
        total: -1,
        sort: '',
      });
      //获取系统公告数据
      const sysNoticePromise = FetchQueryOwnerMessage({
        cxlx: 'GG',
        date: Number(new moment().format('YYYYMMDD')),
        paging: 1,
        current: 1,
        pageSize: 5,
        total: -1,
        sort: '',
      });
      //获取项目概览信息
      const overviewPromise1 = QueryStagingOverviewInfo({
        org: Number(LOGIN_USER_INFO.org),
        role: ROLE,
        year,
        queryType: 'NR1',
      });
      const overviewPromise2 = QueryStagingOverviewInfo({
        org: Number(LOGIN_USER_INFO.org),
        role: ROLE,
        year,
        queryType: 'NR2',
      });
      //获取我的报表数据
      const rptPromise = FetchQueryCustomReportList({
        current: 1,
        //SC|收藏的报表;WD|我的报表;GX|共享报表;CJ|我创建的报表;CJR|查询创建人;KJBB|可见报表
        cxlx: 'WD',
        pageSize: 3,
        paging: 1,
        sort: '',
        total: -1,
      });
      //获取项目跟踪数据
      const trackingPromise = QueryProjectTracking({
        current: 1,
        pageSize: 9,
        paging: 1,
        queryType: 'XM',
        sort: '',
        total: -1,
      });
      //标签
      const labelPromise = FetchQueryProjectLabel({});
      //部门
      const orgPromise = FetchQueryOrganizationInfo({
        type: roleTxt.includes('非IT部门') ? 'FITBM' : 'ZZJG',
      });
      //项目情况
      const prjSitutaionPromise = QueryProjectStatusList({
        current: 1,
        pageSize: 9,
        paging: -1,
        sort: '',
        total: -1,
        role: ROLE,
        startYear: year,
        endYear: year,
      });

      const PROMISE = [
        budgetPromise,
        prjPromise,
        todoPromise,
        sysNoticePromise,
        overviewPromise1,
        overviewPromise2,
        rptPromise,
        trackingPromise,
        labelPromise,
        orgPromise,
        prjSitutaionPromise,
      ];
      if (['二级部门领导', '普通人员'].includes(ROLE)) {
        //获取流程情况
        const processPromise = FetchQueryOwnerWorkflow({
          paging: 1,
          current: 1,
          pageSize: 3,
          total: -1,
          sort: '',
        });

        PROMISE.push(processPromise);
      } else {
        //队伍建设
        const teamPromise = QueryMemberOverviewInfo({
          org: Number(LOGIN_USER_INFO.org),
          queryType: 'SY',
          role: ROLE,
          year,
        });
        //供应商情况
        const supplierPromise = QuerySupplierOverviewInfo({
          org: Number(LOGIN_USER_INFO.org),
          queryType: 'SY',
          paging: -1,
          current: 1,
          pageSize: 9999,
          total: -1,
          sort: '',
          role: ROLE,
          year,
        });
        PROMISE.push(teamPromise);
        PROMISE.push(supplierPromise);
      }
      const RESULT = await Promise.all(PROMISE);
      const [
        budgetRes,
        prjRes,
        todoRes,
        sysNoticeRes,
        overviewRes1,
        overviewRes2,
        rptRes,
        trackingRes,
        labelRes,
        orgRes,
        prjSitutaionRes,
      ] = RESULT;

      const budgetResData = (await budgetRes) || {};
      const prjResData = (await prjRes) || {};
      const todoResData = (await todoRes) || {};
      const sysNoticeResData = (await sysNoticeRes) || {};
      const overviewResData1 = (await overviewRes1) || {};
      const overviewResData2 = (await overviewRes2) || {};
      const rptResData = (await rptRes) || {};
      const trackingResData = (await trackingRes) || {};
      const labelResData = (await labelRes) || {};
      const orgResData = (await orgRes) || {};
      const prjSituationResData = (await prjSitutaionRes) || {};

      if (budgetResData.success) {
        setBudgetData(JSON.parse(budgetResData.ysglxx)[0]);
        setStatisticYearData(p => ({ ...p, dropdown: JSON.parse(budgetResData.ysqs) }));
      }
      if (prjResData.success) {
        let arr = JSON.parse(prjResData.result || '[]'); //项目草稿
        setPrjInfo(p => [...arr]);
        setTotal(p => {
          return {
            ...p,
            project: arr.length,
          };
        });
      }
      if (todoResData.success) {
        let data = [...todoResData.record];
        setToDoData(data);
        setTotal(p => {
          return {
            ...p,
            todo: data.length,
          };
        });
      }
      if (sysNoticeResData.success) {
        setNoticeData([...sysNoticeResData.record]);
      }
      if (overviewResData1.success && overviewResData2.success) {
        setOverviewInfo({
          ...JSON.parse(overviewResData1.result)[0],
          ...JSON.parse(overviewResData2.result)[0],
        });
        // console.log('🚀~ handlePromiseAll ~ OverviewInfo: ', {
        //   ...JSON.parse(overviewResData1.result)[0],
        //   ...JSON.parse(overviewResData2.result)[0],
        // });
      }
      if (rptResData.success) {
        setCusRepDataWD(p => [...JSON.parse(rptResData.result)]);
        setWDTotal(rptResData.totalrows);
        setIsLoading(false);
        setShowExtendsWD(false);
      }
      if (trackingResData.success) {
        const track = JSON.parse(trackingResData.result);
        setTrackingData(track);
        setTotal(p => {
          return {
            ...p,
            tracking: trackingResData.totalrows,
          };
        });
      }
      if (labelResData.success) {
        let labelTree = TreeUtils.toTreeData(JSON.parse(labelResData.record), {
          keyName: 'ID',
          pKeyName: 'FID',
          titleName: 'BQMC',
          normalizeTitleName: 'title',
          normalizeKeyName: 'value',
        });
        labelTree = get(labelTree, '[0].children[0].children', []);
        labelTree.forEach(x => setParentSelectableFalse(x));
        // console.log('🚀 ~ handlePromiseAll ~ labelTree:', labelTree);
        setLabelData(labelTree);
      }
      if (orgResData.success) {
        let orgTree = TreeUtils.toTreeData(orgResData.record, {
          keyName: 'orgId',
          pKeyName: 'orgFid',
          titleName: 'orgName',
          normalizeTitleName: 'title',
          normalizeKeyName: 'value',
        });
        console.log('🚀 ~ orgTree ~ orgTree:', orgTree);
        let orgTreeData = get(orgTree, '[0].children[0].children[0].children', []);
        if (roleTxt.includes('非IT部门')) {
          orgTreeData = get(orgTree, '[0].children[0].children', []);
        }
        setOrgData(orgTreeData);
      }
      if (prjSituationResData.success) {
        setPrjSituationData({
          loading: false,
          data: JSON.parse(prjSituationResData.result),
          total: prjSituationResData.totalrows,
        });
      }
      if (['二级部门领导', '普通人员'].includes(ROLE)) {
        const processResData = (await RESULT[RESULT?.length - 1]) || {};
        if (processResData.success) {
          setProcessData(p => [...processResData.record]);
          setTotal(p => {
            return {
              ...p,
              process: processResData.totalrows,
            };
          });
        }
      } else {
        const teamResData = (await RESULT[RESULT?.length - 2]) || {};
        const supplierResData = (await RESULT[RESULT?.length - 1]) || {};
        if (teamResData.success) {
          let arr = JSON.parse(teamResData.bmry).map(x => {
            return {
              value: Number(x.BMRS),
              name: x.BMMC,
            };
          });
          setTeamData(p => [...arr]);
        }
        if (supplierResData.success) {
          let obj = {
            cgje: [],
            cgsl: [],
            gysmc: [],
            item: [],
          };
          let maxJe = 100;
          JSON.parse(supplierResData.gysxx)?.forEach(item => {
            obj.cgje.push(Number(item.CGJE));
            obj.cgsl.push(Number(item.CGSL));
            obj.item.push(item);
          });
          maxJe = Math.max(...obj.cgje);
          JSON.parse(supplierResData.gysxx)?.forEach(item => {
            obj.gysmc.push({
              name: item.GYSMC,
              max: maxJe * 1.1,
            });
          });
          setSupplierData(obj);
        }
      }

      e = performance.now();
      console.log(`Request time: ${e - s} milliseconds`, s, e);
      setIsSpinning(false);
    } catch (error) {
      console.error('🚀 ~ handlePromiseAll ~ error:', error);
      message.error('个人工作台信息获取失败', 1);
      setIsSpinning(false);
    }
  };

  //统计年份变化
  const handleCurYearChange = (year = moment().year()) => {
    handlePromiseAll(year);
  };

  //刷新待办数据 - 后续刷新数据
  const getToDoData = async (year = moment().year()) => {
    try {
      //获取待办、系统公告数据
      setPopLoading(true);
      const todoPromise = FetchQueryOwnerMessage({
        cxlx: 'DB',
        date: Number(new moment().format('YYYYMMDD')),
        paging: 1,
        current: 1,
        pageSize: 99999,
        total: -1,
        sort: '',
      });
      const overviewPromise = QueryStagingOverviewInfo({
        org: Number(LOGIN_USER_INFO.org),
        role: roleData.role,
        year,
        queryType: 'NR2',
      });
      const [todoRes, overviewRes] = await Promise.all([todoPromise, overviewPromise]);
      if (todoRes.success) {
        let data = [...todoRes.record];
        setToDoData(data);
        setTotal(p => {
          return {
            ...p,
            todo: data.length,
          };
        });
        // setIsSpinning(false);
      }
      if (overviewRes.success) {
        setOverviewInfo(p => ({
          ...p,
          ...JSON.parse(overviewRes.result)[0],
        }));
      }
      setTimeout(() => {}, 3000);
      setPopLoading(false);
    } catch (error) {
      console.error('getToDoData', error);
      message.error('待办数据查询失败', 1);
      setPopLoading(false);
    }
  };

  //项目草稿 - 后续刷新数据
  const getPrjInfo = (role, year = moment().year()) => {
    setIsSpinning(true);
    // QueryProjectGeneralInfo({
    //   queryType: 'CG',
    //   role,
    //   org: Number(LOGIN_USER_INFO.org),
    //   paging: 1,
    //   current: 1,
    //   pageSize: 3,
    //   total: -1,
    //   sort: '',
    //   year,
    // })
    QueryProjectDraft({
      projectManager: Number(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.success) {
          let arr = JSON.parse(res.result || '[]'); //项目草稿
          // let arr = JSON.parse(res?.xmxx || '[]'); //项目信息
          // arr?.forEach(item => {
          //   let riskArr = []; //风险信息
          //   let participantArr = []; //人员信息
          //   JSON.parse(res?.fxxx || '[]').forEach(x => {
          //     if (x.XMID === item.XMID) {
          //       riskArr.push(x);
          //     }
          //   });
          //   JSON.parse(res?.ryxx || '[]').forEach(x => {
          //     if (x.XMID === item.XMID) {
          //       participantArr.push(x);
          //     }
          //   });
          //   item.riskData = [...riskArr];
          //   item.participantData = [...participantArr];
          // });
          setPrjInfo(p => [...arr]);
          setTotal(p => {
            return {
              ...p,
              project: arr.length,
            };
          });
          setIsSpinning(false);
        }
      })
      .catch(e => {
        console.error('QueryProjectGeneralInfo', e);
        message.error('项目信息查询失败', 1);
        setIsSpinning(false);
      });
  };

  //项目情况 - 后续刷新数据
  const getPrjSituation = useCallback(
    debounceFn(
      async ({
        stage,
        org,
        tag,
        projectManager,
        projectName,
        projectStatus,
        startYear,
        endYear,
        role,
      }) => {
        try {
          setPrjSituationData(p => ({
            ...p,
            loading: true,
          }));
          const params = {
            stage: stage === undefined ? undefined : stage.map(x => x.id).join(',') || undefined,
            org: org === undefined ? undefined : org.map(x => x.id).join(',') || undefined,
            tag: tag === undefined ? undefined : tag.map(x => x.id).join(',') || undefined,
            projectManager: projectManager === '' ? undefined : projectManager,
            projectName: projectName === '' ? undefined : projectName,
            projectStatus: projectStatus === undefined ? undefined : projectStatus,
            startYear: startYear === undefined ? undefined : startYear?.year(),
            endYear: startYear === undefined ? undefined : endYear?.year(),
            role,
            current: 1,
            pageSize: 9,
            paging: -1,
            sort: '',
            total: -1,
          };
          const res = await QueryProjectStatusList(params);
          if (res.success) {
            setPrjSituationData({
              loading: false,
              data: JSON.parse(res.result),
              total: res.totalrows,
            });
          }
        } catch (e) {
          console.error('项目数据获取失败', e);
          message.error('项目数据获取失败', 1);
          setPrjSituationData(p => ({
            ...p,
            loading: false,
          }));
        }
      },
      800,
    ),
    [],
  );

  //获取报表数据 - 后续刷新数据
  const getCusRepData = (cxlx = 'WD', pageSize = '3', flag = true, col = '') => {
    col === '' && setIsLoading(true);
    const payload = {
      current: 1,
      //SC|收藏的报表;WD|我的报表;GX|共享报表;CJ|我创建的报表;CJR|查询创建人;KJBB|可见报表
      cxlx,
      pageSize,
      paging: 1,
      sort: '',
      total: -1,
    };
    FetchQueryCustomReportList({ ...payload })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryOwnerMessage ~ res', res.record);
          if (cxlx === 'WD') {
            setCusRepDataWD(p => [...JSON.parse(res.result)]);
            setWDTotal(res.totalrows);
            col === '' && setIsLoading(false);
            setShowExtendsWD(!flag);
          }
        }
      })
      .catch(e => {
        col === '' && setIsLoading(false);
        setShowExtendsWD(!flag);
        message.error('报表信息查询失败', 1);
      });
  };

  //获取项目跟踪数据 - 后续刷新数据
  const getTrackingData = (params, flag) => {
    setIsTrackingSpinning(true);
    const payload = {
      current: params.current,
      // cycle: 0,
      // endTime: 0,
      // org: 0,
      pageSize: params.pageSize,
      paging: 1,
      // projectId: 0,
      // projectManager: 0,
      // projectType: 0,
      queryType: 'XM',
      sort: '',
      // startTime: 0,
      total: -1,
    };
    if (params.org !== '') {
      payload.org = params.org;
    }
    if (params.projectId !== '') {
      payload.projectId = params.projectId;
    }
    if (params.projectManager !== '') {
      payload.projectManager = params.projectManager;
    }
    if (params.projectType !== '') {
      payload.projectType = params.projectType;
    }
    QueryProjectTracking({ ...payload })
      .then(res => {
        if (res?.success) {
          setIsTrackingSpinning(false);
          const track = JSON.parse(res.result);
          setTrackingData(track);
          setTotal(p => ({
            ...p,
            tracking: res.totalrows,
          }));
          params.pageSize === 9 ? setShowExtends(false) : setShowExtends(true);
        }
      })
      .catch(e => {
        setIsTrackingSpinning(false);
        message.error('项目跟踪信息获取失败', 1);
      });
  };

  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  //屏幕宽度变化触发
  const resizeUpdate = e => {
    const fn = () => {
      let w = e.target.innerWidth; //屏幕宽度
      //每个块于1440下254.33+边距16，约271
      if (w < 1710) {
        setLeftWidth('71.405%');
      } else if (w < 1981) {
        setLeftWidth('72%');
      } else if (w < 2252) {
        setLeftWidth('74%');
      } else if (w < 2523) {
        setLeftWidth('76%');
      } else if (w < 2794) {
        setLeftWidth('78%');
      } else if (w < 3165) {
        setLeftWidth('79%');
      } else if (w < 3437) {
        setLeftWidth('80%');
      } else {
        setLeftWidth('86%');
      }
      if (w < 2020) {
        setItemWidth('32%');
      } else if (2020 <= w && w < 2340) {
        setItemWidth('24%');
      } else if (2340 <= w && w < 2660) {
        setItemWidth('19%');
      } else if (2660 <= w && w < 2980) {
        setItemWidth('15.6%');
      } else if (2980 <= w && w < 3300) {
        setItemWidth('13.2%');
      } else {
        setItemWidth('11.5%'); //每行 8个
      }
    };
    debounce(fn, 300);
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = width => {
    let arr = [];
    for (let i = 0; i < 8; i++) {
      //每行最多n=8个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  return (
    <Spin
      spinning={isSpinning}
      tip="加载中"
      size="large"
      wrapperClassName="home-page-box-spin-wrapper"
    >
      <div className="home-page-box">
        <div className="row-box">
          <div className="col-left" style={{ width: leftWidth }}>
            <OverviewCard
              width={leftWidth}
              overviewInfo={overviewInfo}
              userRole={userRole}
              toDoData={toDoData}
              reflush={handlePromiseAll}
              dictionary={dictionary}
              toDoDataNum={total.todo}
              statisticYearData={statisticYearData}
              setStatisticYearData={setStatisticYearData}
              handleCurYearChange={handleCurYearChange}
              getToDoData={getToDoData}
              popLoading={popLoading}
              AUTH={authorities.GRGZT}
            />
            {!['二级部门领导', '普通人员'].includes(userRole) && (
              <CptBudgetCard
                boxShadow={'none'}
                border={'none'}
                userRole={userRole}
                budgetData={budgetData}
                time={moment(overviewInfo?.ysgxsj).format('YYYY-MM-DD')}
                defaultYear={statisticYearData.currentYear}
                AUTH={authorities.GRGZT}
              />
            )}
            <ProjectCard
              itemWidth={itemWidth}
              getAfterItem={getAfterItem}
              userRole={userRole}
              prjInfo={prjInfo}
              getPrjInfo={() => {
                getPrjInfo(userRole, statisticYearData.currentYear);
                let yearMoment =
                  statisticYearData.currentYear === undefined
                    ? moment()
                    : moment(String(statisticYearData.currentYear));
                getPrjSituation({
                  role: userRole,
                  startYear: yearMoment,
                  endYear: yearMoment,
                });
              }}
              total={total.project}
              placement={placement}
              setPlacement={setPlacement}
              toDoData={toDoData}
            />
            <PrjSituation
              itemWidth={itemWidth}
              getAfterItem={getAfterItem}
              prjSituationData={prjSituationData}
              setPrjSituationData={setPrjSituationData}
              sltorData={{ label: labelData, org: orgData }}
              currentYear={statisticYearData.currentYear}
              getPrjSituation={getPrjSituation}
            />
          </div>
          <div className="col-right">
            <GuideCard />
            <SystemNotice
              noticeData={noticeData}
              setNoticeData={setNoticeData}
              isGLY={isGLY.hjry}
              AUTH={authorities.GRGZT}
            />
            <ShortcutCard
              userRole={userRole}
              getPrjInfo={() => {
                getPrjInfo(userRole, statisticYearData.currentYear);
                let yearMoment =
                  statisticYearData.currentYear === undefined
                    ? moment()
                    : moment(String(statisticYearData.currentYear));
                getPrjSituation({
                  role: userRole,
                  startYear: yearMoment,
                  endYear: yearMoment,
                });
              }}
              reflush={handlePromiseAll}
              toDoData={toDoData}
              dictionary={dictionary}
              toDoDataNum={total.todo}
              getToDoData={getToDoData}
              popLoading={popLoading}
              AUTH={authorities.GRGZT}
            />
            {/* <PrjDynamic dynamicData={dynamicData} setDynamicData={setDynamicData} /> */}
            {['二级部门领导', '普通人员'].includes(userRole) ? (
              <Fragment>
                <CptBudgetCard
                  boxShadow={'0px 4px 24px -4px rgba(0, 0, 0, 0.06)'}
                  border={'1px solid #fafafb'}
                  marginBottom={'16px'}
                  isVertical={true}
                  userRole={userRole}
                  budgetData={budgetData}
                  time={moment(overviewInfo?.ysgxsj).format('YYYY-MM-DD')}
                  defaultYear={statisticYearData.currentYear}
                  AUTH={authorities.GRGZT}
                />
                <ProcessCard processData={processData} total={total.process} />
              </Fragment>
            ) : (
              <Fragment>
                <TeamCard
                  teamData={teamData}
                  defaultYear={statisticYearData.currentYear}
                  AUTH={authorities.GRGZT}
                />
                {supplierData.item?.length > 1 ? (
                  <SupplierCard
                    supplierData={supplierData}
                    time={moment(overviewInfo?.gysgxsj).format('YYYY-MM-DD')}
                    defaultYear={statisticYearData.currentYear}
                    AUTH={authorities.GRGZT}
                  />
                ) : null}
              </Fragment>
            )}
            <AnalyzeRepsCard
              getCusRepData={getCusRepData}
              stateProps={{
                showExtendsWD,
                totalWD,
                cusRepDataWD,
                isLoading,
              }}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
