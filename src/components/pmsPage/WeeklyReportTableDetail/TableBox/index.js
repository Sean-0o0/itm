import React, { useState, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';

const TableBox = (props) => {
    const { form, tableData, dateRange, setTableData, tableLoading, setTableLoading } = props;
    const [edited, setEdited] = useState(false);

    useEffect(() => {
        setTableLoading(true);
    }, []);

    const handleTableSave = row => {
        const newData = [...tableData];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        const keys = Object.keys(row);
        //去空格
        const newRow = {
            "id": row.id,
            "module": row.module,
            "sysBuilding": row.sysBuilding,
            "manager": row.manager,
            [keys[4]]: row[keys[4]].trim(),
            [keys[5]]: row[keys[5]],
            [keys[6]]: row[keys[6]].trim(),
            [keys[7]]: row[keys[7]].trim(),
            [keys[8]]: row[keys[8]].trim(),
            [keys[9]]: row[keys[9]].trim(),
            [keys[10]]: row[keys[10]].trim(),
        };
        newData.splice(index, 1, {
            ...item,//old row data
            ...newRow,//new row data
        });
        setEdited(true);
        console.log('TableData', newData);
        setTableData(preState => [...newData]);
    };
    const handleSubmit = ()=>{
        form.validateFields(err=>{
            if(!err){
                console.log('dd');
            }
        })
    }
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
                    <a style={{ color: '#1890ff' }}>退回</a>
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
                <Button style={{ marginLeft: 'auto' }} disabled={!edited} onClick={handleSubmit}>保存</Button>
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
                    scroll={tableData.length > 11 ? { y: 573, x: 2020 } : { x: 2020 }}
                    pagination={false}
                    bordered
                ></Table>
            </div>
        </div>
    )
}
export default Form.create()(TableBox);
