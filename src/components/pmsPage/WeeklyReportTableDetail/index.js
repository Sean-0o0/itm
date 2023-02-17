import React, { useState, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select } from 'antd';
import TopConsole from './topConsole';
import TableBox from './TableBox';
const { RangePicker } = DatePicker;
import { FetchQueryOwnerProjectList, QueryDigitalSpecialClassWeeklyReport } from '../../../services/pmsServices';
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


    useEffect(() => {
        queryProjectData();
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
                let defaultSTime = Number(monthData.startOf('month').format('YYYYMMDD'));
                let defaultETime = Number(monthData.endOf('month').format('YYYYMMDD'));
                queryTableData(defaultSTime, defaultETime, currentXmid);
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
                // const getCurP = (num) => {
                //     switch (num) {
                //         case '1':
                //             return '规划中';
                //         case '2':
                //             return '进行中';
                //         case '3':
                //             return '已完成'
                //     }
                // };
                // const getCurS = (num) => {
                //     switch (num) {
                //         case '1':
                //             return '低风险';
                //         case '2':
                //             return '进度正常';
                //     }
                // };
                const getStatus = (num) => {
                    switch (num) {
                        case '1':
                            return '填写中';
                        case '2':
                            return '已提交';
                        case '3':
                            return '被退回'
                    }
                };
                function uniqueFunc(arr, uniId) {
                    const res = new Map();
                    return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
                }
                let uniqueArr = uniqueFunc(res.record, 'id');//去重后的arr
                uniqueArr?.forEach(x => {
                    let arr = [];
                    res.record.forEach(item => {
                        if (x.id === item.id) {
                            arr.push(item.fzr.trim())
                        }
                    });
                    x.fzr = arr.join('、');
                });
                // console.log('@@', uniqueArr);
                const newArr = uniqueArr?.map(item => {
                    return {
                        id: item.id,
                        module: item.mk.trim(),
                        sysBuilding: item.xtjs.trim(),
                        manager: item.fzr.trim(),
                        ['annualPlan' + item.id]: item.ndgh.trim(),
                        ['cplTime' + item.id]: item.wcsj,
                        ['curProgress' + item.id]: item.dqjz.trim(),
                        ['curRate' + item.id]: item.dqjzszhzb.trim(),
                        ['curStatus' + item.id]: item.dqzt.trim(),
                        ['riskDesc' + item.id]: item.fxsm.trim(),
                        ['peopleNumber' + item.id]: item.zbrs.trim(),
                        ['orgName' + item.id]: item.sybm.trim(),
                        ['status']: getStatus(item.zt.trim()),
                    };
                });
                let groupObj = newArr.reduce((pre, current, index) => {
                    pre[current.module] = pre[current.module] || [];
                    pre[current.module].push({
                        id: current.id,
                        sysBuilding: current.sysBuilding,
                        manager: current.manager,
                        ['annualPlan' + current.id]: current['annualPlan' + current.id],
                        ['cplTime' + current.id]: current['cplTime' + current.id],
                        ['curProgress' + current.id]: current['curProgress' + current.id],
                        ['curRate' + current.id]: current['curRate' + current.id],
                        ['curStatus' + current.id]: current['curStatus' + current.id],
                        ['riskDesc' + current.id]: current['riskDesc' + current.id],
                        ['peopleNumber' + current.id]: current['peopleNumber' + current.id],
                        ['orgName' + current.id]: current['orgName' + current.id],
                        ['status']: current['status'],
                    });
                    return pre;
                }, {});
                setGroupData({ ...groupObj });
                let finalArr = [];

                let arrLength = 0;
                for (let item in groupObj) {
                    arrLength += groupObj[item].length;
                    groupObj[item].forEach(x => {
                        finalArr.push({ module: item, ...x })
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
                setCurrentXmid={setCurrentXmid}
                setEdited={setEdited}
                monthData={monthData}
                setMonthData={setMonthData}
            >
            </TopConsole>
            <TableBox tableData={tableData}
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
            >
            </TableBox>
        </div>
    )
}
