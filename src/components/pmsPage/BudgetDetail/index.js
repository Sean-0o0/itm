import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { Breadcrumb, message, Spin, Tabs } from 'antd';
import { QueryUserRole } from '../../../services/pmsServices';
import CapitalBudget from './CapitalBudget';
import NonCapitalBudget from './NonCapitalBudget';
import ScientificBudget from './ScientificBudget';
import { useLocation } from 'react-router-dom';
import { DecryptBase64 } from '../../Common/Encrypt';
import { Link } from 'react-router-dom';

export const BudgetDetailContext = createContext();

/**
 * 预算详情（跳转过来的页面，不可直接访问）
 */
const BudgetDetail = props => {
  const {
    dictionary,
    userBasicInfo = {},
    match: {
      params: { params = '' },
    },
  } = props;

  const location = useLocation();
  const { pathname } = location;

  /** 预算类型 */
  const [budgetType, setBudgetType] = useState('');

  /** 预算项目的ID */
  const budgetIdRef = useRef('');

  /** 项目所有其他信息 */
  const [projectData, setProjectData] = useState({});

  /** 整个页面的加载动画 */
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  const [routes, setRoutes] = useState([{ name: '预算详情', pathname: location.pathname }]); //路由

  const [role, setRole] = useState(''); //角色文本

  const isLeader =
    role.includes('信息技术事业部领导') ||
    role.includes('一级部门领导') ||
    role.includes('二级部门领导'); //是否二级部门领导以上

  useEffect(() => {
    if (userBasicInfo.id !== undefined) getUserRole(userBasicInfo.id);
    return () => {};
  }, [userBasicInfo.id]);

  useEffect(() => {
    if (params !== '') {
      //浏览器回退/刷新会触发pathname变化，刷新：budgetType有值，回退：budgetType无值 state:自定义的从哪个页面跳过来的路由信息
      if (location.state === undefined && budgetType !== '') return;
      const startIndex = pathname.lastIndexOf('/') + 1;
      const extractedJSONString = DecryptBase64(pathname.substring(startIndex));
      const urlInfo = JSON.parse(extractedJSONString);
      const { fromKey, budgetID } = urlInfo;
      console.log('🚀 ~ useEffect ~ urlInfo:', urlInfo);
      budgetIdRef.current = Number(budgetID);
      const budgetTypeHandled = ['资本性预算', '资本性预算项目', 'ZB'].includes(fromKey)
        ? 'ZB'
        : ['非资本性预算', '非资本性预算项目', 'FZB'].includes(fromKey)
        ? 'FZB'
        : 'KY';
      setBudgetType(budgetTypeHandled);
      //名称路由去重
      const routesArr = [
        ...(urlInfo.routes || []),
        {
          name: '预算详情',
          pathname: location.pathname,
        },
      ]?.filter((obj, index, arr) => {
        return !arr.slice(index + 1).some(item => item.name === obj.name);
      });
      setRoutes(routesArr);
    }
  }, [params]);

  //获取用户角色
  const getUserRole = userId => {
    QueryUserRole({
      userId,
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '', testRole = '{}' } = res;
          setRole(role + JSON.parse(testRole).ALLROLE);
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
      });
  };

  return (
    <BudgetDetailContext.Provider
      value={{
        isGlobalLoading,
        setIsGlobalLoading,
        budgetType,
        budgetIdRef,
        projectData,
        setProjectData,
        dictionary,
        routes,
        isLeader,
        userBasicInfo,
      }}
    >
      <Spin spinning={isGlobalLoading} tip="加载中">
        <div className="budget-detail-breadcrumb-box">
          <Breadcrumb separator=">">
            {routes?.map((item, index) => {
              const { name = item, pathname = '' } = item;
              const historyRoutes = routes.slice(0, index + 1);
              return (
                <Breadcrumb.Item key={index}>
                  {index === routes.length - 1 ? (
                    <>{name}</>
                  ) : (
                    <Link
                      to={{
                        pathname: pathname,
                        state: {
                          routes: historyRoutes,
                        },
                      }}
                    >
                      {name}
                    </Link>
                  )}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </div>
        <div className="BudgetDetail">
          {budgetType === 'ZB' && <CapitalBudget />}

          {budgetType === 'FZB' && <NonCapitalBudget />}

          {budgetType === 'KY' && <ScientificBudget />}
        </div>
      </Spin>
    </BudgetDetailContext.Provider>
  );
};

export default BudgetDetail;
