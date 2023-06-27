import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  QueryBudgetOverviewInfo,
  QueryMemberOverviewInfo,
  QueryProjectGeneralInfo,
  QueryStagingOverviewInfo,
  QuerySupplierOverviewInfo,
  QueryUserRole,
  FetchQueryOwnerMessage,
  FetchQueryOwnerWorkflow,
  FetchQueryOwnerProjectList, FetchQueryCustomReportList,
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
import AnalyzeRepsCard from "./AnalyzeRepsCard";
import PrjTracking from "./PrjTracking";

//金额格式化
const getAmountFormat = value => {
  if ([undefined, null, '', ' ', NaN].includes(value)) return '';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export {getAmountFormat};
export default function HomePage(props) {
  const {cacheLifecycles, dictionary} = props;
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
  const [placement, setPlacement] = useState('rightTop'); //参与人popover位置
  const [total, setTotal] = useState({
    todo: 0,
    project: 0,
    process: 0,
  }); //数据总数
  const [isSpinning, setIsSpinning] = useState(false); //加载状态

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
    setIsSpinning(true);
    getUserRole();
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);

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
      // console.log('🚀 ~ file: index.js ~ line 21 ~ resizeUpdate ~ w', w);
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

  //获取用户角色
  const getUserRole = (reflush = false) => {
    LOGIN_USER_INFO.id !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const {role = ''} = res;
            setUserRole(role);
            getBudgetData(role);
            if (['二级部门领导', '普通人员'].includes(role)) {
              reflush ? getToDoData() : getProcessData(); //待办刷新时不用刷新流程数据
            } else {
              getTeamData(role);
            }
            getOverviewInfo(role);
          }
        })
        .catch(e => {
          console.error('HomePage-QueryUserRole', e);
          message.error('用户角色信息查询失败', 1);
        });
  };

  //获取预算执行情况
  const getBudgetData = role => {
    QueryBudgetOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      queryType: 'SY',
      role,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ QueryBudgetOverviewInfo ~ res', JSON.parse(res?.ysglxx));
          setBudgetData(JSON.parse(res?.ysglxx)[0]);
          getPrjInfo(role);
        }
      })
      .catch(e => {
        console.error('QueryBudgetOverviewInfo', e);
        message.error('预算执行情况查询失败', 1);
      });
  };

  //获取项目概览信息
  const getOverviewInfo = role => {
    QueryStagingOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      role,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ getOverviewInfo ~ res', res);
          setOverviewInfo(res?.record[0]);
        }
      })
      .catch(e => {
        console.error('QueryStagingOverviewInfo', e);
        message.error('项目概览信息查询失败', 1);
      });
  };

  //项目信息
  const getPrjInfo = role => {
    QueryProjectGeneralInfo({
      queryType: 'SY',
      role,
      org: Number(LOGIN_USER_INFO.org),
      paging: 1,
      current: 1,
      pageSize: 9,
      total: -1,
      sort: '',
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
      });
  };

  //队伍建设
  const getTeamData = role => {
    QueryMemberOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      queryType: 'SY',
      role,
      // paging: -1,
      // current: 1,
      // pageSize: 9999,
      // total: -1,
      // sort: '',
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ QueryMemberOverviewInfo ~ res', JSON.parse(res?.bmry));
          let arr = JSON.parse(res?.bmry).map(x => {
            return {
              value: Number(x.BMRS),
              name: x.BMMC,
            };
          });
          setTeamData(p => [...arr]);
          getSupplierData(role);
          // console.log("🚀 ~ file: index.js:284 ~ getTeamData ~ [...arr]:", [...arr])
        }
      })
      .catch(e => {
        console.error('QueryMemberOverviewInfo', e);
        message.error('队伍建设信息查询失败', 1);
      });
  };

  //供应商情况
  const getSupplierData = role => {
    QuerySupplierOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      queryType: 'SY',
      role,
      paging: -1,
      current: 1,
      pageSize: 9999,
      total: -1,
      sort: '',
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ QuerySupplierOverviewInfo ~ res', JSON.parse(res?.gysxx));
          let obj = {
            cgje: [],
            cgsl: [],
            gysmc: [],
            item: [],
          };
          let maxJe = 100;
          JSON.parse(res?.gysxx)?.forEach(item => {
            obj.cgje.push(Number(item.CGJE));
            obj.cgsl.push(Number(item.CGSL));
            obj.item.push(item);
          });
          maxJe = Math.max(...obj.cgje);
          // console.log("🚀 ~ file: index.js:316 ~ getSupplierData ~ maxJe:", maxJe)
          JSON.parse(res?.gysxx)?.forEach(item => {
            obj.gysmc.push({
              name: item.GYSMC,
              max: maxJe * 1.1,
            });
          });
          // console.log(
          //   '🚀 ~ file: index.js ~ line 234 ~ getSupplierData ~ obj',
          //   obj,
          // );
          setSupplierData(obj);
        }
      })
      .catch(e => {
        console.error('QuerySupplierOverviewInfo', e);
        message.error('供应商情况信息查询失败', 1);
      });
  };

  //获取待办数据
  const getToDoData = () => {
    FetchQueryOwnerMessage({
      cxlx: 'ALL',
      date: Number(new moment().format('YYYYMMDD')),
      paging: 1,
      current: 1,
      pageSize: 99999,
      total: -1,
      sort: '',
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryOwnerMessage ~ res', res.record);
          setToDoData(p => [...res.record]);
          setTotal(p => {
            return {
              ...p,
              todo: res.totalrows,
            };
          });
        }
      })
      .catch(e => {
        console.error('FetchQueryOwnerMessage', e);
        message.error('待办信息查询失败', 1);
      });
  };

  //获取流程情况
  const getProcessData = () => {
    FetchQueryOwnerWorkflow({
      paging: 1,
      current: 1,
      pageSize: 3,
      total: -1,
      sort: '',
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryOwnerWorkflow ~ res', res?.record);
          setProcessData(p => [...res?.record]);
          setTotal(p => {
            return {
              ...p,
              process: res.totalrows,
            };
          });
          getToDoData();
        }
      })
      .catch(e => {
        console.error('FetchQueryOwnerWorkflow', e);
        message.error('流程情况信息查询失败', 1);
      });
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
          <div className="col-left" style={{width: leftWidth}}>
            <OverviewCard
              width={leftWidth}
              overviewInfo={overviewInfo}
              userRole={userRole}
              toDoData={toDoData}
              reflush={() => getUserRole(true)}
              dictionary={dictionary}
              toDoDataNum={total.todo}
            />
            {['二级部门领导', '普通人员'].includes(userRole) ? (
              // <ToDoCard
              //   itemWidth={itemWidth}
              //   getAfterItem={getAfterItem}
              //   toDoData={toDoData}
              //   reflush={() => getUserRole(true)}
              //   total={total.todo}
              //   dictionary={dictionary}
              // />
              <AnalyzeRepsCard/>
            ) : (
              <CptBudgetCard
                userRole={userRole}
                budgetData={budgetData}
                time={moment(overviewInfo?.ysgxsj).format('YYYY-MM-DD')}
              />
            )}
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
            {/*<PrjTracking*/}
            {/*  dictionary={dictionary}*/}
            {/*/>*/}
          </div>
          <div className="col-right">
            <GuideCard/>
            <ShortcutCard userRole={userRole} getPrjInfo={getPrjInfo}/>
            {['二级部门领导', '普通人员'].includes(userRole) ? (
              <CptBudgetCard
                isVertical={true}
                userRole={userRole}
                budgetData={budgetData}
                time={moment(overviewInfo?.ysgxsj).format('YYYY-MM-DD')}
              />
            ) : (
              <TeamCard teamData={teamData} />
            )}
            {['二级部门领导', '普通人员'].includes(userRole) ? (
              <ProcessCard processData={processData} total={total.process} />
            ) : supplierData.item?.length > 1 ? (
              <SupplierCard
                supplierData={supplierData}
                time={moment(overviewInfo?.gysgxsj).format('YYYY-MM-DD')}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Spin>
  );
}
