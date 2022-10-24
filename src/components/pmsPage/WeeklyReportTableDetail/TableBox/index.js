import React, { useState, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import { QueryDigitalSpecialClassWeeklyReport } from '../../../../services/pmsServices';
import Scrollbars from 'react-custom-scrollbars';

const TableBox = (props) => {
    const { form, tableData, dateRange, setTableData } = props;
    const [edited, setEdited] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    useEffect(() => {
        setTableLoading(true);
    }, []);
    useEffect(() => {
        if (tableData.length !== 0) {
            setTableLoading(false);
        }
    }, [tableData]);
    const handleTableSave = row => {
        const newData = [...tableData];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setEdited(true);
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
                    <a style={{color: '#1890ff'}}>退回</a>
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
                    formdecorate: form,
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
                <div className='console-txt'>{dateRange.length !== 0 && dateRange[0]?.format('YYYY-MM-DD') || ''} 至 {dateRange.length !== 0 && dateRange[1]?.format('YYYY-MM-DD') || ''}</div>
                <Button style={{ marginLeft: 'auto' }} disabled={!edited}>保存</Button>
                <Button style={{ margin: '0 1.1904rem' }}>导出</Button>
                <Button>跳过本周</Button>
            </div>
            <div className='table-content'>
                <Table
                    loading={tableLoading}
                    columns={columns}
                    components={components}
                    rowKey={record => record.id}
                    rowClassName={() => 'editable-row'}
                    dataSource={tableData}
                    scroll={tableData.length > 11 ? { y: 580, x: 2000 } : { x: 2000 }}
                    pagination={false}
                    bordered
                ></Table>
            </div>
        </div>
    )
}
export default Form.create()(TableBox);
