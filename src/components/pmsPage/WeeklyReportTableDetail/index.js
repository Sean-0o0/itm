import React, { useState, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select } from 'antd';
import TopConsole from './topConsole';
import TableBox from './TableBox';
const { RangePicker } = DatePicker;
import { FetchQueryOwnerProjectList, QueryDigitalSpecialClassWeeklyReport } from '../../../services/pmsServices';
import moment from 'moment';
import { fn } from 'moment';

export default function WeeklyReportDetail() {
    const [open, setOpen] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [tableData, setTableData] = useState([]);
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
                queryTableData(defaultSTime, defaultETime, curXmid);
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
                        ['module']: item.mk,
                        ['sysBuilding']: item.xtjs,
                        ['manager']: item.fzr,
                        ['annualPlan' + item.id]: item.ndgh,
                        ['cplTime' + item.id]: item.wcsj,
                        ['curProgress' + item.id]: item.dqjz,
                        ['curRate' + item.id]: item.dqjzszhzb,
                        ['curStatus' + item.id]: item.dqzt,
                        ['riskDesc' + item.id]: item.fxsm,
                        ['status' + item.id]: item.zt,
                    };
                })
                setTableData(preState => [...newArr]);
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
                setTableData={setTableData}
                tableLoading={tableLoading}
                setTableLoading={setTableLoading}
                dateRange={dateRange}>
            </TableBox>
        </div>
    )
}
