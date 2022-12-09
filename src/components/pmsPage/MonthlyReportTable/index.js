import React, { useState, useEffect } from 'react';
import { Button, Icon, DatePicker, Input, Table, Select } from 'antd';
import TopConsole from './topConsole';
import TableBox from './TableBox';
const { RangePicker } = DatePicker;
import { FetchQueryOwnerProjectList, QueryUserInfo, QueryMonthlyList } from '../../../services/pmsServices';
import moment from 'moment';

export default function MonthlyReportTable() {
    const [monthData, setMonthData] = useState(new moment());
    const [tableData, setTableData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [projectData, setProjectData] = useState([]);
    const [currentXmid, setCurrentXmid] = useState(-1);
    const [edited, setEdited] = useState(false);
    const [txrData, setTxrData] = useState([]);
    const [txrChange, setTxrChange] = useState(false);

    useEffect(() => {
        queryProjectData();
        getTxrData();
    }, []);
    
    //填写人下拉框数据
    const getTxrData = () => {
        QueryUserInfo({
            type: '信息技术事业部'
        }).then(res => {
            if(res.success){
                setTxrData(p=>[...res.record]);
                queryTableData(monthData.format('YYYYMM'), currentXmid, [...res.record]);
            }
        })
    };
    //项目下拉框数据
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
    //表格数据
    const queryTableData = (yf, xmid, txrData) => {
        QueryMonthlyList({
            month: Number(yf),
            xmmc: Number(xmid)
        }).then(res => {
            if (res.code === 1) {
                const newArr = res.record.map(item => {
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
                    let arr = item.txr?.trim()===''?[]:item.txr?.trim()?.split(';');
                    // let txrArr = arr?.map(item => {
                    //     return txrData?.filter(x => String(x?.id) === String(item))[0]?.name;
                    // });
                    return {
                        id: item.id,
                        zdgz: item.zdgz,
                        rwfl: item.rwfl,
                        xmmc: item.xmmc,
                        // zmk: item.zmk,
                        yf: item.yf,
                        zt: getStatus(item.zt),
                        ['bywcqk' + item.id]: item.bywcqk?.trim(),
                        ['xygzjh' + item.id]: item.xygzjh?.trim(),
                        ['ldyj' + item.id]: item.ldyj?.trim(),
                        ['txr' + item.id]: [...arr],
                    };
                })
                setTableData(preState => [...newArr]);
                setTableLoading(false);
            }
        })
        setTableLoading(false);
    };
    //表格跨行合并
    const getRowSpanCount = (data, key, target) => {
        if (!Array.isArray(data)) return 1;
        data = data.map(_ => _[key]); // 只取出筛选项
        let preValue = data[0];
        const res = [[preValue]]; // 放进二维数组里
        let index = 0; // 二维数组下标
        for (let i = 1; i < data.length; i++) {
            if (data[i] === preValue) { // 相同放进二维数组
                res[index].push(data[i]);
            } else { // 不相同二维数组下标后移
                index += 1;
                res[index] = [];
                res[index].push(data[i]);
                preValue = data[i];
            }
        }
        const arr = [];
        res.forEach((_) => {
            const len = _.length;
            for (let i = 0; i < len; i++) {
                arr.push(i === 0 ? len : 0);
            }
        });
        return arr[target];
    }
    return (
        <div className='weekly-report-detail'>
            <TopConsole
                setTableLoading={setTableLoading}
                queryTableData={queryTableData}
                projectData={projectData}
                currentXmid={currentXmid}
                setCurrentXmid={setCurrentXmid}
                monthData={monthData}
                setMonthData={setMonthData}
                txrData={txrData}
            >
            </TopConsole>
            <TableBox tableData={tableData}
                queryTableData={queryTableData}
                setTableData={setTableData}
                tableLoading={tableLoading}
                setTableLoading={setTableLoading}
                monthData={monthData}
                currentXmid={currentXmid}
                getRowSpanCount={getRowSpanCount}
                edited={edited}
                setEdited={setEdited}
                txrData={txrData}
            >
            </TableBox>
        </div>
    )
}
