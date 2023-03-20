import { Breadcrumb } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  QueryBudgetOverviewInfo,
  QueryMemberOverviewInfo,
  QueryProjectGeneralInfo,
  QueryStagingOverviewInfo,
  QuerySupplierOverviewInfo,
  QueryUserRole,
} from '../../../services/pmsServices';
import AvatarCard from './AvatarCard';
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

//金额显示,
const getAmountFormat = value => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export { getAmountFormat };
export default function HomePage(props) {
  const {} = props;
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const [leftWidth, setLeftWidth] = useState('70%'); //左侧功能块宽度
  const [itemWidth, setItemWidth] = useState('32%'); //待办、项目每小块宽度
  const [userRole, setUserRole] = useState(''); //用户角色
  const [overviewInfo, setOverviewInfo] = useState({}); //项目概览
  const [prjInfo, setPrjInfo] = useState([]); //项目信息情况
  const [budgetData, setBudgetData] = useState({}); //预算执行情况
  const [teamData, setTeamData] = useState([]); //队伍建设
  const [supplierData, setSupplierData] = useState({}); //供应商情况
  const [updateTime, setUpdateTime] = useState(''); //预算执行情况接口调用时间

  //防抖定时器
  let timer = null;

  useEffect(() => {
    getUserRole();
    setUpdateTime(moment().format('YYYY-MM-DD'));
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
      if (w < 1850) {
        setLeftWidth('70%');
      } else if (1850 <= w && w < 2050) {
        setLeftWidth('72%');
      } else if (2050 <= w && w < 2350) {
        setLeftWidth('74%');
      } else if (2350 <= w && w < 2850) {
        setLeftWidth('76%');
      } else if (2850 <= w && w < 3150) {
        setLeftWidth('78%');
      } else {
        setLeftWidth('80%');
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
  const getUserRole = () => {
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '' } = res;
          setUserRole(role);
          getOverviewInfo(role);
          getBudgetData(role);
          getPrjInfo(role);
          getTeamData(role);
          getSupplierData(role);
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
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
        }
      })
      .catch(e => {
        console.error('QueryBudgetOverviewInfo', e);
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
          console.log('🚀 ~ getOverviewInfo ~ res', res);
          setOverviewInfo(res?.record[0]);
        }
      })
      .catch(e => {
        console.error('QueryStagingOverviewInfo', e);
      });
  };

  //项目信息
  const getPrjInfo = role => {
    QueryProjectGeneralInfo({
      queryType: 'SY',
      role,
      org: Number(LOGIN_USER_INFO.org),
      paging: -1,
      current: 1,
      pageSize: 9999,
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
          // console.log('🚀 ~ file: index.js ~ line 178 ~ getPrjInfo ~ obj', arr);
        }
      })
      .catch(e => {
        console.error('QueryProjectGeneralInfo', e);
      });
  };

  //队伍建设
  const getTeamData = role => {
    QueryMemberOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      queryType: 'SY',
      role,
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
        }
      })
      .catch(e => {
        console.error('QueryMemberOverviewInfo', e);
      });
  };

  //供应商情况
  const getSupplierData = role => {
    QuerySupplierOverviewInfo({
      org: Number(LOGIN_USER_INFO.org),
      queryType: 'SY',
      role,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ QuerySupplierOverviewInfo ~ res', JSON.parse(res?.gysxx));
          let obj = {
            cgje: [],
            cgsl: [],
            gysmc: [],
          };
          JSON.parse(res?.gysxx)?.forEach(item => {
            obj.cgje.push(Number(item.cgje));
            obj.cgsl.push(Number(item.cgsl));
            obj.gysmc.push({ name: item.gysmc, max: 255 });
          });
          // console.log('🚀 ~ file: index.js ~ line 234 ~ getSupplierData ~ obj', obj);
          setSupplierData(obj);
        }
      })
      .catch(e => {
        console.error('QuerySupplierOverviewInfo', e);
      });
  };

  return (
    <div className="home-page-box">
      <div className="row-box">
        <AvatarCard width={leftWidth} overviewInfo={overviewInfo} />
        <GuideCard />
      </div>
      <div className="row-box">
        <OverviewCard width={leftWidth} overviewInfo={overviewInfo} userRole={userRole} />
        <ShortcutCard userRole={userRole} />
      </div>
      <div className="row-box">
        <div className="col-left" style={{ width: leftWidth }}>
          {['二级部门领导', '普通人员'].includes(userRole) ? (
            <ToDoCard itemWidth={itemWidth} getAfterItem={getAfterItem} />
          ) : (
            <CptBudgetCard userRole={userRole} budgetData={budgetData} time={updateTime} />
          )}
          <ProjectCard
            itemWidth={itemWidth}
            getAfterItem={getAfterItem}
            userRole={userRole}
            prjInfo={prjInfo}
            getPrjInfo={getPrjInfo}
          />
        </div>
        <div className="col-right">
          {['二级部门领导', '普通人员'].includes(userRole) ? (
            <CptBudgetCard
              isVertical={true}
              userRole={userRole}
              budgetData={budgetData}
              time={updateTime}
            />
          ) : (
            <TeamCard teamData={teamData} />
          )}
          {['二级部门领导', '普通人员'].includes(userRole) ? (
            <ProcessCard />
          ) : (
            <SupplierCard supplierData={supplierData} time={updateTime}/>
          )}
          {/* <SupplierCard supplierData={supplierData} time={updateTime}/>
          <TeamCard teamData={teamData} /> */}
        </div>
      </div>
    </div>
  );
}
