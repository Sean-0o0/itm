import React, { useState, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select } from 'antd';
import TopConsole from './topConsole';
import TableBox from './TableBox';
const { RangePicker } = DatePicker;
import { QueryDigitalSpecialClassWeeklyReport } from '../../../services/pmsServices';
import moment from 'moment';

export default function WeeklyReportDetail() {
    const [open, setOpen] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        let defaultSTime = Number(getCurrentWeek(new Date())[0].format('YYYYMMDD'));
        let defaultETime = Number(getCurrentWeek(new Date())[1].format('YYYYMMDD'));
        // queryTableData( defaultSTime, defaultETime, -1);
        queryTableData( 20220901, 20220930, -1);
        setDateRange(p => [...getCurrentWeek(new Date())]);
    }, []);
    // const handleTableSave = row => {
    //     const newData = [...tableData];
    //     const index = newData.findIndex(item => row.id === item.id);
    //     const item = newData[index];
    //     newData.splice(index, 1, {
    //         ...item,
    //         ...row,
    //     });
    //     setTableData(preState => [...newData]);
    // };
    const queryTableData = (startTime, endTime, xmid)=>{
        QueryDigitalSpecialClassWeeklyReport({
            kssj: startTime,
            jssj: endTime,
            xmmc: xmid
        }).then(res => {
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
        });
    };
    const getCurrentWeek = (date) => {
        let timeStamp = date.getTime();
        let currentDay = date.getDay();
        let monday = new Date(timeStamp - (currentDay - 1) * 60 * 60 * 24 * 1000)
        let sunday = new Date(timeStamp + (7 - currentDay) * 60 * 60 * 24 * 1000)
        // console.log(timeStamp, currentDay, moment(monday), sunday);
        return [moment(monday), moment(sunday)];
    };
    return (
        <div className='weekly-report-detail'>
            <TopConsole dateRange={dateRange} setDateRange={setDateRange} queryTableData={queryTableData}></TopConsole>
            <TableBox tableData={tableData} setTableData={setTableData} currentWeek={getCurrentWeek(new Date())}></TableBox>
        </div>
    )
}
