import React, { useState, useEffect } from 'react';
import TableBox from './TableBox';
import {
  FetchQueryOwnerProjectList,
  QueryUserInfo,
  QueryHjgWeeklyInfo,
} from '../../../services/pmsServices';
import moment from 'moment';

export default function WeeklyReportSummary() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [tableData, setTableData] = useState([]);
  const [groupData, setGroupData] = useState({});
  const [tableLoading, setTableLoading] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [currentXmid, setCurrentXmid] = useState(-1);
  const [edited, setEdited] = useState(false);
  const [monthData, setMonthData] = useState(new moment());
  const [originData, setOriginData] = useState([]); //编辑前table数据

  useEffect(() => {
    // queryProjectData();
    setDateRange(p => [...getCurrentWeek(new Date())]);
    let defaultSTime = Number(getCurrentWeek(new Date())[0].format('YYYYMMDD'));
    let defaultETime = Number(getCurrentWeek(new Date())[1].format('YYYYMMDD'));
    setTableLoading(true);
    queryTableData(defaultSTime, defaultETime, currentXmid);
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
  const queryTableData = (startTime, endTime, xmid) => {
    QueryHjgWeeklyInfo({
      kssj: startTime,
      jssj: endTime,
      xmid,
    })
      .then(res => {
        if (res.code === 1) {
          function uniqueFunc(arr, uniId) {
            const res = new Map();
            return arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
          }
          let uniqueArr = uniqueFunc(JSON.parse(res.record), 'id'); //去重后的arr
          uniqueArr?.forEach(x => {
            let arr = [];
            JSON.parse(res.record).forEach(item => {
              if (x.id === item.id) {
                arr.push(item.txr.trim());
              }
            });
            x.txr = arr;
          });
          const newArr = uniqueArr.map(item => {
            // let arr = item.txr?.trim() === '' ? [] : item.txr?.trim()?.split(';');
            const getKeyId = keyStr => keyStr + item.id;
            const nullCheck = x => (x === null ? '' : x);
            return {
              id: nullCheck(item.id),
              gzmk: nullCheck(item.gzmk),
              txr: nullCheck(item.txr),
              [getKeyId('bznr')]: nullCheck(item.bznr)?.trim(),
              [getKeyId('xzjh')]: nullCheck(item.xzjh)?.trim(),
              [getKeyId('bbh')]: nullCheck(item.bbh)?.trim(),
              [getKeyId('jhsxrq')]: item.jhsxrq,
              [getKeyId('dqzt')]: item.dqzt === null ? '进度正常' : item.dqzt?.trim(), //默认值
              [getKeyId('dqjd')]: nullCheck(item.dqjd)?.trim(),
              [getKeyId('zysjsm')]: nullCheck(item.zysjsm)?.trim(),
              // submitted: Number(item.id) % 2 === 0 ? false : true, //非提交
              zt: item.zt,
            };
          });
          setTableData(preState => [...newArr]);
          setOriginData(preState => [...newArr]);
          console.log('🚀 ~ file: index.js ~ line 59 ~ queryTableData ~ newArr', newArr);
          setTableLoading(false);
        }
      })
      .catch(e => {
        console.error('queryTableData错误', e);
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

  return (
    <div className="weekly-report-summary">
      <TableBox
        tableData={tableData}
        queryTableData={queryTableData}
        groupData={groupData}
        setTableData={setTableData}
        tableLoading={tableLoading}
        setTableLoading={setTableLoading}
        dateRange={dateRange}
        setDateRange={setDateRange}
        edited={edited}
        setEdited={setEdited}
        getCurrentWeek={getCurrentWeek}
        currentXmid={currentXmid}
        monthData={monthData}
        setCurrentXmid={setCurrentXmid}
        setMonthData={setMonthData}
        projectData={projectData}
        originData={originData}
      />
    </div>
  );
}
