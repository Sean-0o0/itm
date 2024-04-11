import React, { useState, useEffect, useLayoutEffect } from 'react';
import { message, Spin, Tabs } from 'antd';
import TableBox from './TableBox';
import ProjectSummaryTable from './ProjectSummaryTable';
import {
  QueryBudgetStatistics,
  QueryProjectListPara, QueryProjectManHourSummary,
  QuerySelfDevProjWHstatistics,
  QueryUserRole,
} from '../../../services/pmsServices';
import moment from 'moment';
import { FetchQueryBudgetProjects } from '../../../services/projectManage';
const { TabPane } = Tabs;

export default function AttendanceStatistic(props) {
  const { authorities } = props;
  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({}); //合计
  const [summaryFilterData, setSummaryFilterData] = useState({
    year: moment(),
    startMonth: 1,
    endMonth: 12,
    yearOpen: false,
  }); //筛选栏数据

  const [filterData, setFilterData] = useState({
    year: moment(),
    yearOpen: false,
    month: moment(),
    prjSlt: [],
    prjId: undefined,
  }); //筛选栏数据

  const [activeKey, setActiveKey] = useState('YDHZ');
  const [spinningData, setSpinningData] = useState({
    spinning: false,
    tip: '加载中',
  }); //加载状态

  useLayoutEffect(() => {
    if(activeKey === 'KQTJ' || activeKey === 'YDHZ') {
      getPrjSlt(activeKey);
    } else {
      queryProjectManHourSummary();
    }
  }, [activeKey, getPrjSlt]);

  const queryTableData = ({ queryType = activeKey, projectId, year, month }) => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    let params = {
      presentType: 'XQ',
      projectId: projectId || filterData.prjId,
      queryType,
    };
    if (queryType === 'KQTJ') {
      params.year = year || filterData.year?.year();
    } else {
      params.month = month || Number(filterData.month?.format('YYYYMM'));
    }
    //表格数据
    QuerySelfDevProjWHstatistics(params)
      .then(res => {
        if (res?.success) {
          console.log(
            '🚀 ~ QueryBudgetStatistics ~ res',
            JSON.parse(res.statisticsResult),
            JSON.parse(res.summaryResult),
          );
          setTableData(
            queryType === 'KQTJ' ? JSON.parse(res.statisticsResult) : JSON.parse(res.summaryResult),
          );
          querySummaryData(queryType, projectId, year, month);
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

  //合计数据
  const querySummaryData = (queryType = activeKey, projectId = filterData.prjId, year, month) => {
    let params = {
      presentType: 'HJ',
      projectId,
      queryType,
    };
    if (queryType === 'KQTJ') {
      params.year = year || filterData.year?.year();
    } else {
      params.month = month || Number(filterData.month?.format('YYYYMM'));
    }
    //合计数据
    QuerySelfDevProjWHstatistics(params)
      .then(res => {
        if (res?.success) {
          const obj =
            (queryType === 'KQTJ'
              ? JSON.parse(res.statisticsResult)[0]
              : JSON.parse(res.summaryResult)[0]) || {};
          setSummaryData(obj);
          setTableData(p => (p.length > 0 ? [...p, obj] : p));
          setSpinningData(p => ({
            ...p,
            spinning: false,
          }));
        }
      })
      .catch(e => {
        console.error('🚀合计数据', e);
        message.error('合计数据获取失败', 1);
        setSpinningData(p => ({
          ...p,
          spinning: false,
        }));
      });
  };

  //项目名称下拉框信息
  const getPrjSlt = () => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    QueryProjectListPara({
      current: 1,
      pageSize: 10,
      paging: -1,
      sort: 'string',
      total: -1,
      cxlx: 'ZYXM',
    })
      .then(res => {
        if (res?.success) {
          const prjId =
            [...JSON.parse(res.projectRecord)][0]?.XMID &&
            Number([...JSON.parse(res.projectRecord)][0]?.XMID);
          setFilterData(p => ({
            ...p,
            prjSlt: [...JSON.parse(res.projectRecord)],
            prjId,
          }));
          queryTableData({ queryType: activeKey, projectId: prjId });
        }
      })
      .catch(e => {
        console.error('QueryProjectListPara', e);
        message.error('项目名称下拉框信息查询失败', 1);
      });
  };

  const handleTabsChange = key => {
    if(activeKey === 'KQTJ' || activeKey === 'YDHZ') {
      // queryTableData({ queryType: key });
    }
    setActiveKey(key);
  };

  const queryProjectManHourSummary = () => {
    setSpinningData(p => ({
      tip: '加载中',
      spinning: true,
    }));
    // let params = summaryFilterData;
    const params = {
      year: summaryFilterData.year.year(),
      startMonth: 1,
      endMonth: 12,
    }
    //表格数据
    QueryProjectManHourSummary(params)
      .then(res => {
        if (res?.success) {
          setTableData(JSON.parse(res.result));
          console.log(JSON.parse(res.result))
        }
      })
      .catch(e => {
        console.error('🚀表格数据', e);
        message.error('表格数据获取失败', 1);

      }).finally(() => {
      setSpinningData(p => ({
        ...p,
        spinning: false,
      }));
    });
  };

  return (
    <div className="weekly-report-detail">
      <Spin
        spinning={spinningData.spinning}
        tip={spinningData.tip}
        wrapperClassName="attendance-statistic-spin-wrapper"
      >
        <div className="top-console">
          <Tabs
            defaultActiveKey="YDHZ"
            activeKey={activeKey}
            onChange={handleTabsChange}
            size={'large'}
          >
            <TabPane tab="月度汇总" key="YDHZ"></TabPane>
            <TabPane tab="考勤统计" key="KQTJ"></TabPane>
            <TabPane tab="项目汇总" key="XMHZ"></TabPane>
          </Tabs>
        </div>
        {
          activeKey === 'KQTJ' || activeKey === 'YDHZ' ?
            (
              <TableBox
                authorities={authorities}
                dataProps={{ tableData, filterData, activeKey, summaryData }}
                funcProps={{ setFilterData, queryTableData }}
              />
            ) :
            (
              <ProjectSummaryTable
                authorities={authorities}
                dataProps={{ tableData, filterData: summaryFilterData, activeKey }}
                funcProps={{ setFilterData: setSummaryFilterData, queryProjectManHourSummary }}
              />
            )
        }
      </Spin>
    </div>
  );
}
