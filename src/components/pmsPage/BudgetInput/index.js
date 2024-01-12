import React, { useState, useEffect, useLayoutEffect } from 'react';
import { message, Spin } from 'antd';
import TableBox from '../BudgetCarryover/TableBox';
import {
  QueryCapitalBudgetCarryoverInfo,
  QueryUserRole,
  QueryWeekday,
} from '../../../services/pmsServices';
import { DecryptBase64 } from '../../Common/Encrypt';
import moment from 'moment';

export default function BudgetInput(props) {
  const {
    dictionary = {},
    userBasicInfo = {},
    match: {
      params: { params = '' },
    },
  } = props;
  const { YSFL = [], XMYSJZZT = [] } = dictionary;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filterData, setFilterData] = useState({}); //筛选栏数据
  const activeKey = 'ZB';
  const [curSorter, setCurSorter] = useState(''); //排序
  const [spinningData, setSpinningData] = useState({
    spinning: false,
    tip: '加载中',
    sltDisabled: false,
  }); //加载状态
  const [userRole, setUserRole] = useState(''); //用户角色
  const [role, setRole] = useState(''); //用户角色2 - 包含一级部门领导
  const [defaultYear, setDefaultYear] = useState(moment().year()); //默认年份

  /** 是否是禁止“操作”的 信息技术事业部领导、一级领导
   * allrole里面只返回系统里配的权限，一级部门领导是单独判断的只在role里面返回，
   *  只要是信息技术开发部领导或信息技术运保部领导就算是一级部门领导
   */
  const [isForbiddenLeader, setIsForbiddenLeader] = useState(false);

  useEffect(() => {
    if (params !== '') {
      let obj = JSON.parse(DecryptBase64(params));
      // console.log('🚀 ~ file: index.js:55 ~ useLayoutEffect ~ obj:', obj);
      if (obj.fromHome === true) {
        //首页待办跳转
        let field = 'budgetName';
        setFilterData(p => ({ ...p, [field]: obj.xmmc }));
        getDefaultYear({ [field]: obj.xmmc });
      } else {
        //预算提交页面跳转回来
        getDefaultYear(obj.refreshParams);
      }
    } else {
      //首次刷新
      getDefaultYear({ });
    }
    return () => {};
  }, [params]);

  //获取用户角色
  const getUserRole = params => {
    QueryUserRole({
      userId: String(userBasicInfo.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { testRole = '{}', role: loginRole } = res;
          if (loginRole === '信息技术事业部领导' || loginRole === '一级部门领导') {
            setIsForbiddenLeader(true);
          }
          const roleTxt = JSON.parse(testRole).ALLROLE || '';
          setUserRole(roleTxt);
          setRole(loginRole);
          queryTableData({ ...params, userType: getUserType(roleTxt, loginRole) });
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
      });
  };

  //获取默认年份
  const getDefaultYear = params => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    QueryWeekday({
      begin: 20600101,
      days: 31,
      queryType: 'YSLRNF',
    })
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.result);
          if (data.length > 0) {
            const year = data[0].YSLRNF ? moment(String(data[0].YSLRNF), 'YYYY') : moment();
            setFilterData(p => ({
              ...p,
              year,
            }));
            setDefaultYear(year);
            getUserRole({ ...params, year });
          }
          //to do ...
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀默认年份', e);
        message.error('默认年份获取失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  const queryTableData = ({
    current = 1,
    pageSize = 20,
    sort = curSorter,
    budgetProject,
    projectName,
    year,
    budgetCategory,
    budgetName,
    budgetId,
    userType = getUserType(userRole, role),
    head,
    headName,
    state,
    newOrCarryover,
  }) => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));

    QueryCapitalBudgetCarryoverInfo({
      queryType: 'YS',
      year: year?.year(),
      budgetCategory,
      budgetName,
      budgetId,
      userType,
      head,
      headName,
      state,
      newOrCarryover,
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ QueryBudgetStatistics ~ res', JSON.parse(res.result));
          setTableData(p => ({
            ...p,
            current,
            pageSize,
            total: res.totalrows,
            data: JSON.parse(res.result),
          }));
          setCurSorter(sort);
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀表格数据', e);
        message.error('表格数据获取失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  const getUserType = (userRole, role) => {
    if (
      ['信息技术事业部领导', '一级部门领导'].includes(role) ||
      userRole.includes('信息技术事业部领导') ||
      userRole.includes('一级部门领导')
    ) {
      return 'YJLD';
    } else if (userRole.includes('预算管理人')) {
      return 'GLY';
    } else if (userRole.includes('预算统筹人')) {
      return 'TCR';
    } else {
      return 'FZR';
    }
  };

  return (
    <div className="weekly-report-detail">
      <Spin
        spinning={spinningData.spinning}
        tip={spinningData.tip}
        wrapperClassName="budget-statistic-spin-wrapper"
      >
        <TableBox
          dataProps={{
            tableData,
            filterData,
            activeKey,
            spinningData,
            XMYSJZZT,
            YSFL,
            userRole,
            userBasicInfo,
            curSorter,
            defaultYear,
            isForbiddenLeader,
          }}
          funcProps={{ setFilterData, queryTableData, setSpinningData }}
        />
      </Spin>
    </div>
  );
}
