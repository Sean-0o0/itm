import React, { useState, useEffect, useLayoutEffect } from 'react';
import { message, Spin, Tabs } from 'antd';
import TableBox from './TableBox';
import { QueryBudgetStatistics, QueryUserRole } from '../../../services/pmsServices';
import moment from 'moment';
import TreeUtils from '../../../utils/treeUtils';
import {
  FetchQueryBudgetProjects,
  FetchQueryOrganizationInfo,
} from '../../../services/projectManage';
import { setParentSelectableFalse } from '../../../utils/pmsPublicUtils';
const { TabPane } = Tabs;

export default function BudgetStatistic(props) {
  const { dictionary = {}, tab } = props;
  const { YSLB = [] } = dictionary;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: 0,
    sort: '',
  });
  const [filterData, setFilterData] = useState({
    year: moment(),
    yearOpen: false,
    budgetCategory: undefined,
    budgetCategorySlt: [],
    budgetId: undefined,
    budgetPrjSlt: [],
    org: undefined,
    director: undefined,
  }); //筛选栏数据
  const [activeKey, setActiveKey] = useState('ZB');
  const [spinningData, setSpinningData] = useState({
    spinning: false,
    tip: '加载中',
    sltDisabled: false,
  }); //加载状态
  const [allowExport, setAllowExport] = useState(false); //是否允许导出
  let CUR_USER_ID = String(JSON.parse(sessionStorage.getItem('user')).id);
  const [orgData, setOrgData] = useState([]); //部门下拉框数据
  const [sortInfo, setSortInfo] = useState({
    sort: undefined,
    columnKey: '',
  }); //用于查询后清空排序状态
  const [searchData, setSearchData] = useState({ year: moment() }); //点查询后的顶部筛选数据

  useLayoutEffect(() => {
    if (tab === undefined) {
      queryTableData({});
      getBudgetPrjSlt(activeKey);
      getUserRole();
      getOrgData();
      setSortInfo({ sort: undefined, columnKey: '' });
      setSearchData({ year: moment() });
    }
    return () => {};
  }, []);

  useLayoutEffect(() => {
    if (tab !== undefined) {
      let CUR_USER_NAME = JSON.parse(sessionStorage.getItem('user'))?.name;
      setActiveKey(tab);
      setFilterData(p => ({ ...p, director: CUR_USER_NAME }));
      setSearchData(p => ({ ...p, director: CUR_USER_NAME }));
      setSortInfo({ sort: undefined, columnKey: '' });
      queryTableData({ budgetType: tab, director: CUR_USER_NAME });
      getBudgetPrjSlt(tab);
      getUserRole();
      getOrgData();
    }
    return () => {};
  }, [tab]);

  //获取用户角色
  const getUserRole = () => {
    QueryUserRole({
      userId: CUR_USER_ID,
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '' } = res;
          // console.log(['二级部门领导', '一级部门领导', '信息技术事业部领导'].includes(role));
          setAllowExport(['二级部门领导', '一级部门领导', '信息技术事业部领导'].includes(role));
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
      });
  };

  //获取部门数据
  const getOrgData = () => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    FetchQueryOrganizationInfo({
      type: 'XXJS',
    })
      .then(res => {
        if (res?.success) {
          let data = TreeUtils.toTreeData(res.record, {
            keyName: 'orgId',
            pKeyName: 'orgFid',
            titleName: 'orgName',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0].children[0].children;
          data.selectable = false;
          data.forEach(node => setParentSelectableFalse(node));
          setOrgData([...data]);
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        message.error('部门信息查询失败', 1);
        console.error('FetchQueryOrganizationInfo', e);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  const queryTableData = (
    {
      budgetType = activeKey,
      current = 1,
      pageSize = 20,
      sort = '',
      budgetCategory,
      budgetId,
      org,
      director,
      year = moment(),
      yearNum = moment().year(),
    },
    setSearchData = () => {},
  ) => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    //预算统计信息
    QueryBudgetStatistics({
      budgetCategory,
      budgetId,
      budgetType,
      org,
      director,
      year: yearNum,
      current,
      pageSize,
      paging: 1,
      queryType: 'YSTJ',
      sort,
      total: -1,
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ QueryBudgetStatistics ~ res', JSON.parse(res.budgetInfo));
          setTableData(p => ({
            ...p,
            current,
            pageSize,
            total: res.totalrows,
            data: JSON.parse(res.budgetInfo),
          }));
          setSearchData({
            budgetCategory,
            budgetId,
            org,
            director,
            year,
          });
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

  const getBudgetPrjSlt = key => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    FetchQueryBudgetProjects({
      type: 'NF',
      year: filterData.year?.year(),
    })
      .then(res => {
        if (res?.success) {
          // console.log('🚀 ~ FetchQueryBudgetProjects ~ res', res);
          let ysxmArr = (
            res.record?.filter(
              x => x.ysLXID === (key === 'ZB' ? '1' : key === 'FZB' ? '2' : '3'),
            ) || []
          ).reduce((acc, cur) => {
            const index = acc.findIndex(item => item.value === cur.zdbm && item.title === cur.ysLB);
            if (index === -1) {
              acc.push({
                title: cur.ysLB,
                value: cur.zdbm,
                children: [
                  {
                    ...cur,
                    title: cur.ysName,
                    value: cur.ysID,
                  },
                ],
              });
            } else {
              acc[index].children.push({
                ...cur,
                title: cur.ysName,
                value: cur.ysID,
              });
            }
            return acc;
          }, []);
          ysxmArr.forEach(node => setParentSelectableFalse(node));
          // console.log(ysxmArr);
          setFilterData(p => ({
            ...p,
            budgetCategorySlt: YSLB.filter(x => (key === 'ZB' ? true : Number(x.ibm) > 6)),
            budgetPrjSlt: ysxmArr,
          }));
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀预算项目信息', e);
        message.error('预算项目信息获取失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  const handleTabsChange = key => {
    setFilterData(p => ({
      ...p,
      year: moment(),
      budgetCategory: undefined,
      budgetId: undefined,
      org: undefined,
      director: undefined,
    }));
    queryTableData({ budgetType: key });
    getBudgetPrjSlt(key);
    // console.log('🚀 ~ file: index.js:146 ~ handleTabsChange ~ key:', key);
    setActiveKey(key);
    setSortInfo({ sort: undefined, columnKey: '' });
    setSearchData({ year: moment() });
  };

  return (
    <div className="weekly-report-detail">
      <Spin
        spinning={spinningData.spinning}
        tip={spinningData.tip}
        wrapperClassName="budget-statistic-spin-wrapper"
      >
        <div className="top-console">
          <Tabs
            defaultActiveKey="ZB"
            activeKey={activeKey}
            onChange={handleTabsChange}
            size={'large'}
          >
            <TabPane tab="资本性预算" key="ZB"></TabPane>
            <TabPane tab="非资本性预算" key="FZB"></TabPane>
            <TabPane tab="科研预算" key="KY"></TabPane>
          </Tabs>
        </div>
        <TableBox
          dataProps={{
            tableData,
            filterData,
            allowExport,
            activeKey,
            spinningData,
            orgData,
            sortInfo,
            searchData,
          }}
          funcProps={{ setFilterData, queryTableData, setSpinningData, setSortInfo, setSearchData }}
        />
      </Spin>
    </div>
  );
}
