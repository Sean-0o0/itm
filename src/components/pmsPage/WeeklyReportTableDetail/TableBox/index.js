import React, { useState, useEffect } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form, message, Modal} from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import { CreateOperateHyperLink } from '../../../../services/pmsServices';

const TableBox = (props) => {
    const { form, tableData, dateRange, setTableData, tableLoading, setTableLoading, groupData } = props;
    const [edited, setEdited] = useState(false);
    const [sendBackVisable, setSendBackVisable] = useState(false);
    const [skipCurWeekVisable, setSkipCurWeekVisable] = useState(false);
    const [sendBackUrl, setSendBackUrl] = useState('');
    const [skipCurWeekUrl, setSkipCurWeekUrl] = useState('');
    // const skipCurWeekUrl = '/OperateProcessor?operate=V_XSZHZBHZ_SKIP&Table=V_XSZHZBHZ';
    const Loginname = localStorage.getItem("firstUserID");

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
    const handleSubmit = () => {
        form.validateFields(err => {
            if (!err) {
                console.log('dd');
            }
        })
    }
    const handleSendBack = (id) => {
        // let params = {
        //     "attribute": 0,
        //     "authFlag": 0,
        //     "objectName": "V_XSZHZBHZ",
        //     "operateName": "V_XSZHZBHZ_BACK",
        //     "parameter": [{
        //         "name": "ZB",
        //         "value": id,
        //     },],
        //     "userId": Loginname
        // }
        // CreateOperateHyperLink(params).then((ret = {}) => {
        //     const { code, message, url } = ret;
        //     if (code === 1) {
        //         setSendBackVisable(true);
        //         setSendBackUrl(url);
        //     }
        // }).catch((error) => {
        //     message.error(!error.success ? error.message : error.note);
        // });
        Modal.confirm({title:'确定要退回吗？'});
    };
    const handleSkipCurWeek = () => {
        let params = {
            "attribute": 0,
            "authFlag": 0,
            "objectName": "V_XSZHZBHZ",
            "operateName": "V_XSZHZBHZ_SKIP",
            "parameter": [],
            "userId": Loginname
        }
        CreateOperateHyperLink(params).then((ret = {}) => {
            const { code, message, url } = ret;
            if (code === 1) {
                setSkipCurWeekVisable(true);
                setSkipCurWeekUrl(url);
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }
    const onSuccess = (name) => {
        message.success(name + "成功");
    }
    const tableColumns = [
        {
            title: '模块',
            dataIndex: 'module',
            key: 'module',
            width: 200,
            fixed: true,
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if ((index > 0 && row.module !== tableData[index - 1].module) || index === 0) {
                    obj.props.rowSpan = groupData[value].length;
                } else {
                    obj.props.rowSpan = 0;
                }
                return obj;
            },
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
                    <a onClick={() => handleSendBack(row.id)} style={{ color: '#1890ff' }}>退回</a>
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
    const sendBackModalProps = {
        isAllWindow: 1,
        // defaultFullScreen: true,
        width: '100rem',
        height: '58rem',
        title: '退回弹窗',
        style: { top: '20rem' },
        visible: sendBackVisable,
        footer: null,
    };
    const skipCurWeekProps = {
        isAllWindow: 1,
        // defaultFullScreen: true,
        width: '100rem',
        height: '58rem',
        title: '跳过本周弹窗',
        style: { top: '20rem' },
        visible: skipCurWeekVisable,
        footer: null,
    };
    return (<>
        {sendBackVisable &&
            <BridgeModel modalProps={sendBackModalProps} onSucess={() => onSuccess("退回")}
                onCancel={() => setSendBackVisable(false)}
                src={sendBackUrl} />}
        {skipCurWeekVisable &&
            <BridgeModel modalProps={skipCurWeekProps} onSucess={() => onSuccess("跳回本周")}
                onCancel={() => setSkipCurWeekVisable(false)}
                src={skipCurWeekUrl} />}
        <div className='table-box'>
            <div className='table-console'>
                <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img>
                <div className='console-txt'>{dateRange.length !== 0 && dateRange[0]?.format('YYYY-MM-DD') || ''} 至 {dateRange.length !== 0 && dateRange[1]?.format('YYYY-MM-DD') || ''}</div>
                <Button style={{ marginLeft: 'auto' }} disabled={!edited} onClick={handleSubmit}>保存</Button>
                <Button style={{ margin: '0 1.1904rem' }}>导出</Button>
                <Button onClick={handleSkipCurWeek}>跳过本周</Button>
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
    </>
    )
}
export default Form.create()(TableBox);
