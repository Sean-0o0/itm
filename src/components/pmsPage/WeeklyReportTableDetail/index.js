import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import TableBox from './TableBox';
import MonthlyReportTable from '../MonthlyReportTable';
import WeeklyReportSummary from '../WeeklyReportSummary/index';
import {
  FetchQueryOwnerProjectList,
  QueryDigitalSpecialClassWeeklyReport,
  QueryUserInfo,
} from '../../../services/pmsServices';
import moment from 'moment';
import { FetchQueryOrganizationInfo } from '../../../services/projectManage';
import TreeUtils from '../../../utils/treeUtils';
const { TabPane } = Tabs;

export default function WeeklyReportTableDetail() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [tableData, setTableData] = useState([]);
  const [tableEditingData, setTableEditingData] = useState([]); //编辑状态时的table数据
  const [groupData, setGroupData] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [currentXmid, setCurrentXmid] = useState(-1);
  const [edited, setEdited] = useState(false);
  const [monthData, setMonthData] = useState(new moment());
  const [activeKey, setActiveKey] = useState('1');
  const [originData, setOriginData] = useState([]); //编辑前table数据
  const [fzrTableData, setFzrTableData] = useState([]); //表格数据，里边是负责人文本
  const [orgData, setOrgData] = useState([]); //部门数据
  const [orgArr, setOrgArr] = useState([]); //部门数据-非树结构
  const [managerData, setManagerData] = useState([]); //负责人下拉框数据

  useEffect(() => {
    // queryProjectData();
    getManagerData();
    // setDateRange(p => [...getCurrentWeek(new Date())]);
  }, []);

  const queryProjectData = () => {
    FetchQueryOwnerProjectList({
      paging: -1,
      total: -1,
      sort: '',
      cxlx: 'ALL',
    }).then(res => {
      if (res.code === 1) {
        setProjectData(p => [...res.record]);
      }
    });
  };
  //负责人下拉框数据
  const getManagerData = () => {
    QueryUserInfo({
      type: '信息技术事业部',
    }).then(res => {
      if (res.success) {
        setManagerData(p => [...res.record]);
        // console.log(res);
        getOrgData();
      }
    });
  };
  //部门数据
  const getOrgData = () => {
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
          })[0].children;
          setOrgData(data);
          // console.log('🚀 ~ file: index.js:83 ~ getOrgData ~ data:', data);
          setOrgArr([...res.record]);
          let defaultSTime = Number(monthData.startOf('month').format('YYYYMMDD'));
          let defaultETime = Number(monthData.endOf('month').format('YYYYMMDD'));
          queryTableData(defaultSTime, defaultETime, currentXmid, [...res.record]);
        }
      })
      .catch(e => {
        console.error('FetchQueryOrganizationInfo', e);
      });
  };
  const queryTableData = (startTime, endTime, xmid, orgNameArr = []) => {
    QueryDigitalSpecialClassWeeklyReport({
      kssj: startTime,
      jssj: endTime,
      xmmc: xmid,
    }).then(res => {
      if (res.code === 1) {
        console.log('🚀 ~ file: index.js:50 ~ queryTableData ~ res:', res);
        const getStatus = num => {
          switch (num) {
            case '1':
              return '填写中';
            case '2':
              return '已提交';
            case '3':
              return '被退回';
          }
        };
        function uniqueFunc(arr, uniId) {
          const res = new Map();
          return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
        }
        let uniqueArr = uniqueFunc(res.record, 'id'); //去重后的arr
        uniqueArr?.forEach(x => {
          let arr = [];
          let arr2 = [];
          res.record.forEach(item => {
            if (x.id === item.id) {
              arr.push(item.fzrid.trim());
              arr2.push(item.fzr.trim());
            }
          });
          // x.fzr = arr.join(';');
          x.fzrid = arr;
          x.fzr = arr2;
        });

        const newArr = uniqueArr?.map(item => {
          return {
            id: item.id,
            module: item.mk.trim(),
            sysBuilding: item.xtjs.trim(),
            ['manager' + item.id]: [...item.fzrid],
            ['annualPlan' + item.id]: item.ndgh.trim(),
            ['cplTime' + item.id]: item.wcsj,
            ['curProgress' + item.id]: item.dqjz.trim(),
            ['curRate' + item.id]: item.dqjzszhzb.trim(),
            ['curStatus' + item.id]: item.dqzt.trim(),
            ['riskDesc' + item.id]: item.fxsm.trim(),
            ['peopleNumber' + item.id]: item.zbrs.trim(),
            ['orgName' + item.id]: orgNameArr.filter(x => x.orgName === item.sybm)[0]?.orgId || '',
            ['status']: getStatus(item.zt.trim()),
            fzrid: item.fzrid,
            zt: item.zt,
          };
        });
        let groupObj = newArr.reduce((pre, current, index) => {
          pre[current.module] = pre[current.module] || [];
          pre[current.module].push({
            // id: current.id,
            // sysBuilding: current.sysBuilding,
            // ['manager' + current.id]: current['manager' + current.id],
            // ['annualPlan' + current.id]: current['annualPlan' + current.id],
            // ['cplTime' + current.id]: current['cplTime' + current.id],
            // ['curProgress' + current.id]: current['curProgress' + current.id],
            // ['curRate' + current.id]: current['curRate' + current.id],
            // ['curStatus' + current.id]: current['curStatus' + current.id],
            // ['riskDesc' + current.id]: current['riskDesc' + current.id],
            // ['peopleNumber' + current.id]: current['peopleNumber' + current.id],
            // ['orgName' + current.id]: current['orgName' + current.id],
            // ['status']: current['status'],
            ...current,
          });
          return pre;
        }, {});
        setGroupData({ ...groupObj });
        let finalArr = [];

        let arrLength = 0;
        for (let item in groupObj) {
          arrLength += groupObj[item].length;
          groupObj[item].forEach(x => {
            finalArr.push({ module: item, ...x });
          });
        }

        setOriginData(preState => [...newArr]);
        setFzrTableData(preState => [...newArr]);
        // let finalArr2 = finalArr.map(x=>{
        //   return {
        //     ...x,
        //   }
        // })
        setTableData(preState => [...newArr]);
        // console.log('🚀 ~ file: index.js ~ line 136 ~ queryTableData ~ finalArr]', finalArr);
        setTableLoading(false);
      }
    });
  };

  const getCurrentWeek = date => {
    let timeStamp = date.getTime();
    let currentDay = date.getDay();
    let monday = 0,
      sunday = 0;
    if (currentDay !== 0) {
      monday = new Date(timeStamp - (currentDay - 1) * 60 * 60 * 24 * 1000);
      sunday = new Date(timeStamp + (7 - currentDay) * 60 * 60 * 24 * 1000);
    } else {
      monday = new Date(timeStamp - (7 - 1) * 60 * 60 * 24 * 1000);
      sunday = new Date(timeStamp + (7 - 7) * 60 * 60 * 24 * 1000);
    }
    return [moment(monday), moment(sunday)];
  };
  const handleTabsChange = key => {
    setActiveKey(key);
    if (key === '1') getManagerData();
  };

  return (
    <div className="weekly-report-detail">
      <div className="top-console">
        <Tabs defaultActiveKey="1" activeKe={activeKey} onChange={handleTabsChange} size={'large'}>
          <TabPane tab="数字化专班月报" key="1"></TabPane>
          <TabPane tab="信息技术事业部月报" key="2"></TabPane>
          <TabPane tab="汇金谷零售业务周报" key="3"></TabPane>
        </Tabs>
      </div>
      {activeKey === '1' && (
        <TableBox
          tableData={tableData}
          queryTableData={queryTableData}
          groupData={groupData}
          setTableData={setTableData}
          tableLoading={tableLoading}
          setTableLoading={setTableLoading}
          dateRange={dateRange}
          edited={edited}
          setEdited={setEdited}
          getCurrentWeek={getCurrentWeek}
          currentXmid={currentXmid}
          monthData={monthData}
          setCurrentXmid={setCurrentXmid}
          setMonthData={setMonthData}
          projectData={projectData}
          originData={originData}
          setOriginData={setOriginData}
          fzrTableData={fzrTableData}
          setFzrTableData={setFzrTableData}
          orgData={orgData}
          orgArr={orgArr}
          managerData={managerData}
        />
      )}
      {activeKey === '2' && <MonthlyReportTable />}
      {activeKey === '3' && <WeeklyReportSummary />}
    </div>
  );
}
