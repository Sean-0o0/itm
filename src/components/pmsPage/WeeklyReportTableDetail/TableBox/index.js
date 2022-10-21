import React, { useState, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import { QueryDigitalSpecialClassWeeklyReport } from '../../../../services/pmsServices';
import Scrollbars from 'react-custom-scrollbars';

const TableBox = (props) => {
    const {form, tableData, currentWeek, setTableData} = props;
    useEffect(() => {
        // QueryDigitalSpecialClassWeeklyReport({
        //     kssj: 0,
        //     jssj: 99999999,
        //     xmmc: ""
        // }).then(res=>{
        //     console.log(res);
        // })
        // const newArr = arr.map(item => {
        //     return {
        //         id: item.id,
        //         ['module']: item.module,
        //         ['sysBuilding']: item.sysBuilding,
        //         ['manager']: item.manager,
        //         ['annualPlan' + item.id]: item.annualPlan,
        //         ['cplTime' + item.id]: item.cplTime,
        //         ['curProgress' + item.id]: item.curProgress,
        //         ['curRate' + item.id]: item.curRate,
        //         ['curStatus' + item.id]: item.curStatus,
        //         ['riskDesc' + item.id]: item.riskDesc,
        //     };
        // })
        // setTableData(preState => [...preState, ...newArr])
    }, []);
    const handleTableSave = row => {
        const newData = [...tableData];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setTableData(preState => [...newData]);
    };
    const tableColumns = [
        {
            title: '模块',
            dataIndex: 'module',
            key: 'module',
            width: 200,
            fixed: true,
            ellipsis: true,
            // editable: true,
        },
        {
            title: '系统建设',
            dataIndex: 'sysBuilding',
            key: 'sysBuilding',
            width: 300,
            fixed: 'left',
            ellipsis: true,
            // editable: true,
        },
        {
            title: '负责人',
            dataIndex: 'manager',
            key: 'manager',
            width: 90,
            fixed: 'left',
            ellipsis: true,
            // editable: true,
        },
        {
            title: '年度规划',
            dataIndex: 'annualPlan',
            key: 'annualPlan',
            // width: 400,
            ellipsis: true,
            editable: true,
        },
        {
            title: '完成时间',
            dataIndex: 'cplTime',
            key: 'cplTime',
            width: 120,
            ellipsis: true,
            editable: true,
        },
        {
            title: '当前进展',
            dataIndex: 'curProgress',
            key: 'curProgress',
            width: 100,
            ellipsis: true,
            editable: true,
        },
        {
            title: '当前进度',
            dataIndex: 'curRate',
            key: 'curRate',
            width: 100,
            ellipsis: true,
            editable: true,
        },
        {
            title: '当前状态',
            dataIndex: 'curStatus',
            key: 'curStatus',
            width: 100,
            ellipsis: true,
            editable: true,
        },
        {
            title: '风险说明',
            dataIndex: 'riskDesc',
            key: 'riskDesc',
            // width: ,
            ellipsis: true,
            editable: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            ellipsis: true,
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            fixed: 'right',
            render: (text, row, index) => {
                return <div>
                    <a>退回</a>
                </div>
            },
        },
    ];
    const columns = tableColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => {
                return ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    handleSave: handleTableSave,
                    key: col.key,
                    formdecorate: props.form,
                })
            },
        };
    });
    const components = {
        body: {
            row: EditableFormRow,
            cell: EditableCell,
        },
    };
    return (
        <div className='table-box'>
            <div className='table-console'>
                <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img>
                <div className='console-txt'>{currentWeek.length!==0&&currentWeek[0].format('YYYY-MM-DD')} 至 {currentWeek.length!==0&&currentWeek[1].format('YYYY-MM-DD')}</div>
                <Button style={{ marginLeft: 'auto' }}>保存</Button>
                <Button style={{ margin: '0 1.1904rem' }}>导出</Button>
                <Button>跳过本周</Button>
            </div>
            <div className='table-content'>
                <Table
                    columns={columns}
                    components={components}
                    rowKey={record => record.id}
                    rowClassName={() => 'editable-row'}
                    dataSource={tableData}
                    // bodyStyle={{ overflowY: 'scroll' }}
                    scroll={{ y: 580, x: 2000 }}
                    pagination={false}
                    bordered
                ></Table>
            </div>
        </div>
    )
}
export default Form.create()(TableBox);
