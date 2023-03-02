import React, { useEffect, useState } from 'react';
import InfoTable from './infoTable';
import TopConsole from './topConsole';
import { QueryProjectListInfo } from "../../../services/pmsServices";

export default function ProjectInfo(props) {
    const [tableData, setTableData] = useState([]); //表格数据-项目列表
    useEffect(() => {
        getTableData();
        return () => {
        }
    }, []);
    const getTableData = (v) => {
        QueryProjectListInfo({
            // "amountBig": 0,
            // "amountSmall": 0,
            // "amountType": "string",
            // "budgetProject": 0,
            // "budgetType": 0,
            // "orgId": 0,
            // "projectLabel": "string",
            // "projectManager": 0,
            // "projectType": 0,
            "current": 1,
            "projectId": 0,
            "pageSize": 10,
            "paging": -1,
            "sort": "string",
            "total": -1
        }).then(res => {
            if (res?.success) {
                setTableData(p => [...JSON.parse(res.record)]);
            }
            console.log("🚀 ~ file: index.js ~ line 29 ~ getTableData ~ res", JSON.parse(res.record))
        }).catch(e => console.error('getTableData', e));
    };
    return (
        <div className='project-info-box'>
            <TopConsole dictionary={props.dictionary} setTableData={setTableData} />
            <InfoTable tableData={tableData} />
        </div>
    )
};