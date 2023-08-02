import { Carousel, message, Spin } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
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

//金额格式化
const getAmountFormat = value => {
  if ([undefined, null, '', ' ', NaN].includes(value)) return '';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export { getAmountFormat };
export default function HomePage(props) {
  const { cacheLifecycles, dictionary } = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [leftWidth, setLeftWidth] = useState('65.48%'); //左侧功能块宽度
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
    if (LOGIN_USER_INFO.id !== undefined) {
      // getUserRole();
      s = performance.now();
      handlePromiseAll();
    }
    return () => {};
  }, [LOGIN_USER_INFO.id]);

  //初次加载
  const handlePromiseAll = async (year = moment().year()) => {
    try {
      setIsSpinning(true);
      //获取用户角色
      const roleData =
        (await QueryUserRole({
          userId: String(LOGIN_USER_INFO.id),
        })) || {};
      if (roleData.code === 1) {
        const ROLE = roleData.role;
        setUserRole(ROLE);
        //获取预算执行情况
        const budgetPromise = QueryBudgetOverviewInfo({
          org: Number(LOGIN_USER_INFO.org),
          queryType: 'SY',
          role: ROLE,
          year,
        });
        //项目信息
        const prjPromise = QueryProjectGeneralInfo({
          queryType: 'SY',
          role: ROLE,
          org: Number(LOGIN_USER_INFO.org),
          paging: 1,
          current: 1,
          pageSize: 9,
          total: -1,
          sort: '',
          year,
        });
        //获取待办、系统公告数据
        const todoPromise = FetchQueryOwnerMessage({
          cxlx: 'ALL',
          date: Number(new moment().format('YYYYMMDD')),
          paging: 1,
          current: 1,
          pageSize: 99999,
          total: -1,
          sort: '',
        });
        //获取项目概览信息
        const overviewPromise = QueryStagingOverviewInfo({
          org: Number(LOGIN_USER_INFO.org),
          role: ROLE,
          year,
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

        const PROMISE = [
          budgetPromise,
          prjPromise,
          todoPromise,
          overviewPromise,
          rptPromise,
          trackingPromise,
          // processPromise,
          // teamPromise,
          // supplierPromise,
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
        const [budgetRes, prjRes, todoRes, overviewRes, rptRes, trackingRes] = RESULT;

        const budgetResData = (await budgetRes) || {};
        const prjResData = (await prjRes) || {};
        const todoResData = (await todoRes) || {};
        const overviewResData = (await overviewRes) || {};
        const rptResData = (await rptRes) || {};
        const trackingResData = (await trackingRes) || {};

        if (budgetResData.success) {
          setBudgetData(JSON.parse(budgetResData.ysglxx)[0]);
          setStatisticYearData(p => ({ ...p, dropdown: JSON.parse(budgetResData.ysqs) }));
        }
        if (prjResData.success) {
          let arr = JSON.parse(prjResData.xmxx); //项目信息
          arr?.forEach(item => {
            let riskArr = []; //风险信息
            let participantArr = []; //人员信息
            JSON.parse(prjResData.fxxx).forEach(x => {
              if (x.XMID === item.XMID) {
                riskArr.push(x);
              }
            });
            JSON.parse(prjResData.ryxx).forEach(x => {
              if (x.XMID === item.XMID) {
                participantArr.push(x);
              }
            });
            item.riskData = [...riskArr];
            item.participantData = [...participantArr];
          });
          setPrjInfo(p => [...arr]);
          setTotal(p => {
            return {
              ...p,
              project: prjResData.totalrows,
            };
          });
        }
        if (todoResData.success) {
          setToDoData([...todoResData.record].filter(x => x.xxlx === '1'));
          setNoticeData(
            [...todoResData.record].filter(x => x.xxlx === '3' || x.xxlx === '4').slice(0, 3),
          );
          setTotal(p => {
            return {
              ...p,
              todo: todoResData.totalrows,
            };
          });
        }
        if (overviewResData.success) {
          setOverviewInfo(overviewResData.record[0]);
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
        if (['二级部门领导', '普通人员'].includes(ROLE)) {
          const processResData = (await RESULT[6]) || {};
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
          const teamResData = (await RESULT[6]) || {};
          const supplierResData = (await RESULT[7]) || {};
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
      }
    } catch (error) {
      console.log('🚀 ~ handlePromiseAll ~ error:', error);
      message.error('个人工作台信息获取失败', 1);
      setIsSpinning(false);
    }
  };

  //统计年份变化
  const handleCurYearChange = (year = moment().year()) => {
    // getBudgetData(userRole, year);
    // if (!['二级部门领导', '普通人员'].includes(userRole)) {
    //   getTeamData(userRole, year);
    // }
    // getOverviewInfo(userRole, year);
    handlePromiseAll(year);
  };

  //项目信息 - 后续刷新数据
  const getPrjInfo = (role, year = moment().year()) => {
    setIsSpinning(true);
    QueryProjectGeneralInfo({
      queryType: 'SY',
      role,
      org: Number(LOGIN_USER_INFO.org),
      paging: 1,
      current: 1,
      pageSize: 9,
      total: -1,
      sort: '',
      year,
    })
      .then(res => {
        if (res?.success) {
          let arr = JSON.parse(res?.xmxx); //项目信息
          arr?.forEach(item => {
            let riskArr = []; //风险信息
            let participantArr = []; //人员信息
            JSON.parse(res?.fxxx).forEach(x => {
              if (x.XMID === item.XMID) {
                riskArr.push(x);
              }
            });
            JSON.parse(res?.ryxx).forEach(x => {
              if (x.XMID === item.XMID) {
                participantArr.push(x);
              }
            });
            item.riskData = [...riskArr];
            item.participantData = [...participantArr];
          });
          setPrjInfo(p => [...arr]);
          setTotal(p => {
            return {
              ...p,
              project: res.totalrows,
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
  const getTrackingData = params => {
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
          setTotal(res.totalrows);
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
      if (w < 1500) {
        setLeftWidth('65.48%');
      } else if (w < 1650) {
        setLeftWidth('67%');
      } else if (w < 1850) {
        setLeftWidth('70%');
      } else if (w < 2200) {
        setLeftWidth('74%');
      } else if (w < 2350) {
        setLeftWidth('77%');
      } else if (w < 2500) {
        setLeftWidth('79%');
      } else if (w < 2650) {
        setLeftWidth('80%');
      } else if (w < 2800) {
        setLeftWidth('81%');
      } else if (w < 2950) {
        setLeftWidth('82%');
      } else if (w < 3100) {
        setLeftWidth('84%');
      } else if (w < 3250) {
        setLeftWidth('84%');
      } else if (w < 3400) {
        setLeftWidth('84%');
      } else if (w < 3550) {
        setLeftWidth('85%');
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
            />
            {!['二级部门领导', '普通人员'].includes(userRole) && (
              <CptBudgetCard
                boxShadow={'none'}
                border={'none'}
                userRole={userRole}
                budgetData={budgetData}
                time={moment(overviewInfo?.ysgxsj).format('YYYY-MM-DD')}
              />
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
            <ProjectCard
              itemWidth={itemWidth}
              getAfterItem={getAfterItem}
              userRole={userRole}
              prjInfo={prjInfo}
              getPrjInfo={getPrjInfo}
              total={total.project}
              placement={placement}
              setPlacement={setPlacement}
            />
            {/*项目跟踪*/}
            <PrjTracking
              dictionary={dictionary}
              getTrackingData={getTrackingData}
              stateProps={{
                total,
                params,
                setParams,
                trackingData,
                isTrackingSpinning,
                setIsTrackingSpinning,
              }}
            />
          </div>
          <div className="col-right">
            <GuideCard />
            <SystemNotice noticeData={noticeData} setNoticeData={setNoticeData} />
            <ShortcutCard userRole={userRole} getPrjInfo={getPrjInfo} />
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
                />
                <ProcessCard processData={processData} total={total.process} />
              </Fragment>
            ) : (
              <Fragment>
                <TeamCard teamData={teamData} />
                {supplierData.item?.length > 1 ? (
                  <SupplierCard
                    supplierData={supplierData}
                    time={moment(overviewInfo?.gysgxsj).format('YYYY-MM-DD')}
                  />
                ) : null}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
}
