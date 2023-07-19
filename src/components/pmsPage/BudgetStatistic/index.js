import React, { useState, useEffect } from 'react';
import { message, Spin, Tabs } from 'antd';
import TableBox from './TableBox';
import { QueryBudgetStatistics, QueryUserRole } from '../../../services/pmsServices';
import moment from 'moment';
import { FetchQueryBudgetProjects } from '../../../services/projectManage';
const { TabPane } = Tabs;

export default function BudgetStatistic(props) {
  const { dictionary = {} } = props;
  const { YSLB = [] } = dictionary;
  const [tableData, setTableData] = useState({
    data: [],
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filterData, setFilterData] = useState({
    year: moment(),
    yearOpen: false,
    budgetCategory: undefined,
    budgetCategorySlt: [],
    budgetPrj: undefined,
    budgetPrjSlt: [],
  }); //筛选栏数据
  const [activeKey, setActiveKey] = useState('ZB');
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [allowExport, setAllowExport] = useState(false); //是否允许导出
  const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem('user')).id);

  useEffect(() => {
    queryTableData({});
    getUserRole();
  }, []);

  //获取用户角色
  const getUserRole = () => {
    QueryUserRole({
      userId: CUR_USER_ID,
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '' } = res;
          console.log(['二级部门领导', '一级部门领导', '信息技术事业部领导'].includes(role));
          setAllowExport(['二级部门领导', '一级部门领导', '信息技术事业部领导'].includes(role));
        }
      })
      .catch(e => {
        console.error('QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
      });
  };

  const queryTableData = ({
    budgetType = 'ZB',
    current = 1,
    pageSize = 20,
    sort = 'YSID DESC',
  }) => {
    setIsSpinning(true);
    //预算统计信息
    QueryBudgetStatistics({
      budgetCategory:
        filterData.budgetCategory !== undefined ? Number(filterData.budgetCategory) : undefined,
      budgetId: filterData.budgetPrj !== undefined ? Number(filterData.budgetPrj) : undefined,
      budgetType,
      current,
      pageSize,
      paging: 1,
      queryType: 'YSTJ',
      sort,
      total: -1,
      year: filterData.year?.year(),
    })
      .then(res => {
        if (res?.success) {
          console.log('🚀 ~ QueryBudgetStatistics ~ res', JSON.parse(res.budgetInfo));
          setTableData(p => ({
            ...p,
            current,
            pageSize,
            total: res.totalrows,
            data: JSON.parse(res.budgetInfo),
          }));
          FetchQueryBudgetProjects({
            type: 'NF',
            year: filterData.year?.year(),
          })
            .then(res => {
              if (res?.success) {
                // console.log('🚀 ~ FetchQueryBudgetProjects ~ res', res);
                let ysxmArr = (
                  res.record?.filter(x => x.ysLXID === (budgetType === 'ZB' ? '1' : '2')) || []
                ).reduce((acc, cur) => {
                  const index = acc.findIndex(
                    item => item.value === cur.zdbm && item.label === cur.ysLB,
                  );
                  if (index === -1) {
                    acc.push({
                      label: cur.ysLB,
                      value: cur.zdbm,
                      children: [
                        {
                          ...cur,
                          label: cur.ysName,
                          value: cur.ysID,
                        },
                      ],
                    });
                  } else {
                    acc[index].children.push({
                      ...cur,
                      label: cur.ysName,
                      value: cur.ysID,
                    });
                  }
                  return acc;
                }, []);
                // console.log(ysxmArr);
                setFilterData(p => ({
                  ...p,
                  budgetCategorySlt: YSLB.filter(x => Number(x.ibm) <= 6),
                  budgetPrjSlt: ysxmArr,
                }));
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error('🚀预算项目信息', e);
              message.error('预算项目获取失败', 1);
              setIsSpinning(false);
            });
        }
      })
      .catch(e => {
        console.error('🚀预算统计信息', e);
        message.error('预算统计信息获取失败', 1);
        setIsSpinning(false);
      });
  };

  const handleTabsChange = key => {
    setActiveKey(key);
    queryTableData({ budgetType: key });
    if (key === 'ZB') {
      setFilterData(p => ({ ...p, budgetCategorySlt: YSLB.filter(x => Number(x.ibm) <= 6) }));
    } else {
      setFilterData(p => ({ ...p, budgetCategorySlt: YSLB.filter(x => Number(x.ibm) > 6) }));
    }
  };

  return (
    <div className="weekly-report-detail">
      <Spin spinning={isSpinning} tip="加载中" wrapperClassName="budget-statistic-spin-wrapper">
        <div className="top-console">
          <Tabs
            defaultActiveKey="ZB"
            activeKey={activeKey}
            onChange={handleTabsChange}
            size={'large'}
          >
            <TabPane tab="资本性预算" key="ZB"></TabPane>
            <TabPane tab="非资本性预算" key="FZB"></TabPane>
          </Tabs>
        </div>
        <TableBox
          dataProps={{ tableData, filterData, allowExport }}
          funcProps={{ setFilterData, queryTableData }}
        />
      </Spin>
    </div>
  );
}
