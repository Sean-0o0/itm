import React, { useState, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select } from 'antd';
import TopConsole from './topConsole';
import TableBox from './TableBox';
const { RangePicker } = DatePicker;
import { FetchQueryOwnerProjectList, QueryDigitalSpecialClassWeeklyReport } from '../../../services/pmsServices';
import moment from 'moment';

export default function WeeklyReportDetail() {
    const [open, setOpen] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [tableData, setTableData] = useState([]);
    const [groupData, setGroupData] = useState({});
    const [tableLoading, setTableLoading] = useState(false);
    const [projectData, setProjectData] = useState([]);
    const [currentXmid, setCurrentXmid] = useState(-1);

    useEffect(() => {
        queryProjectData();
        setDateRange(p => [...getCurrentWeek(new Date())]);
    }, []);

    const queryProjectData = () => {
        FetchQueryOwnerProjectList({
            paging: -1,
            total: -1,
            sort: '',
            cxlx: 'ALL',
        }).then(res => {
            if (res.code === 1) {
                let curXmid = Number(res?.record[0]?.xmid);
                setProjectData(p => [...res.record]);
                setCurrentXmid(curXmid);
                let defaultSTime = Number(getCurrentWeek(new Date())[0].format('YYYYMMDD'));
                let defaultETime = Number(getCurrentWeek(new Date())[1].format('YYYYMMDD'));
                defaultSTime = 20220901;
                defaultETime = 20221001;
                queryTableData(defaultSTime, defaultETime, -1);
            }
        });
    };
    const queryTableData = (startTime, endTime, xmid) => {
        QueryDigitalSpecialClassWeeklyReport({
            kssj: startTime,
            jssj: endTime,
            xmmc: xmid
        }).then(res => {
            if (res.code === 1) {
                const newArr = res.record.map(item => {
                    return {
                        id: item.id,
                        ['module']: item.mk.trim(),
                        ['sysBuilding']: item.xtjs.trim(),
                        ['manager']: item.fzr.trim(),
                        ['annualPlan' + item.id]: item.ndgh.trim(),
                        ['cplTime' + item.id]: item.wcsj,
                        ['curProgress' + item.id]: item.dqjz.trim(),
                        ['curRate' + item.id]: item.dqjzszhzb.trim(),
                        ['curStatus' + item.id]: item.dqzt.trim(),
                        ['riskDesc' + item.id]: item.fxsm.trim(),
                        ['status' + item.id]: item.zt.trim(),
                    };
                });
                let groupObj = newArr.reduce((pre, current, index) => {
                    pre[current.module] = pre[current.module] || [];
                    pre[current.module].push({
                        id: current.id,
                        ['sysBuilding']: current['sysBuilding'],
                        ['manager']: current['manager'],
                        ['annualPlan' + current.id]: current['annualPlan' + current.id],
                        ['cplTime' + current.id]: current['cplTime' + current.id],
                        ['curProgress' + current.id]: current['curProgress' + current.id],
                        ['curRate' + current.id]: current['curRate' + current.id],
                        ['curStatus' + current.id]: current['curStatus' + current.id],
                        ['riskDesc' + current.id]: current['riskDesc' + current.id],
                        ['status' + current.id]: current['status' + current.id],
                    });
                    return pre;
                }, {});
                setGroupData({...groupObj});
                let finalArr = [];
                let arrLength = 0;
                for( let item in groupObj){
                    arrLength += groupObj[item].length;
                    groupObj[item].forEach(x=>{
                        finalArr.push({module: item, ...x})
                    })
                }
                setTableData(preState => [...finalArr]);
                setTableLoading(false);
            }
        })
    };
    const getCurrentWeek = (date) => {
        let timeStamp = date.getTime();
        let currentDay = date.getDay();
        let monday = 0, sunday = 0;
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
        <div className='weekly-report-detail'>
            <TopConsole dateRange={dateRange}
                setDateRange={setDateRange}
                getCurrentWeek={getCurrentWeek}
                setTableLoading={setTableLoading}
                queryTableData={queryTableData}
                projectData={projectData}
                currentXmid={currentXmid}
                setCurrentXmid={setCurrentXmid}>
            </TopConsole>
            <TableBox tableData={tableData}
                groupData={groupData}
                setTableData={setTableData}
                tableLoading={tableLoading}
                setTableLoading={setTableLoading}
                dateRange={dateRange}>
            </TableBox>
        </div>
    )
}
