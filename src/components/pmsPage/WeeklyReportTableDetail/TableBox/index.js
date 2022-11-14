import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, message, Modal, Popconfirm } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import { OperateSZHZBWeekly, CreateOperateHyperLink, QueryUserInfo } from '../../../../services/pmsServices';
import moment from 'moment';
import config from '../../../../utils/config';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

const { api } = config;
const { pmsServices: { digitalSpecialClassWeeklyReportExcel } } = api;
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem("user")).id);

const TableBox = (props) => {
    const { form, tableData, dateRange, setTableData, tableLoading, setTableLoading, groupData, edited, setEdited, getCurrentWeek, currentXmid, queryTableData, } = props;
    // const [edited, setEdited] = useState(false);
    const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
    const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');
    const [authIdAData, setAuthIdData] = useState([]);//权限用户id

    // const downloadRef = useRef(null);

    useEffect(() => {
        setTableLoading(true);
        getAutnIdData();
    }, []);

    const getAutnIdData = () => {
        QueryUserInfo({
            type: 'ZBAUTH',
        }).then(res => {
            if (res.success) {
                let idArr = res.record?.map(item => {
                    return item.id;
                });
                setAuthIdData(p => [...idArr]);
            }
        }).catch(e => {
            // message.error('查询失败', 1);
        })
    };
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
            [keys[6]]: row[keys[6]],
            [keys[7]]: row[keys[7]].trim(),
            [keys[8]]: row[keys[8]],
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
                let submitTable = tableData.map(item => {
                    const getCurP = (txt) => {
                        switch (txt) {
                            case '规划中':
                                return '1';
                            case '进行中':
                                return '2';
                            case '已完成':
                                return '3'
                        }
                    };
                    const getCurS = (txt) => {
                        switch (txt) {
                            case '低风险':
                                return '1';
                            case '进度正常':
                                return '2';
                        }
                    };
                    return {
                        V_ID: String(item.id),
                        V_NDGH: String(item['annualPlan' + item.id]),
                        V_WCSJ: String(moment(item['cplTime' + item.id]).format('YYYYMM')),
                        V_DQJZ: String(getCurP(item['curProgress' + item.id])),
                        V_DQJD: String(item['curRate' + item.id]),
                        V_DQZT: String(getCurS(item['curStatus' + item.id])),
                        V_FXSM: String(item['riskDesc' + item.id]),
                    }
                })
                submitTable.push({});
                console.log('submitTable', submitTable);
                let submitData = {
                    json: JSON.stringify(submitTable),
                    count: tableData.length,
                    type: 'UPDATE'
                };
                OperateSZHZBWeekly({ ...submitData }).then(res => {
                    if (res?.code === 1) {
                        message.success('保存成功', 1);
                    } else {
                        message.error('保存失败', 1);
                    }
                })
                console.log('submitData', submitData);
            }
        })
    }
    const handleSendBack = (id) => {
        let sendBackData = {
            json: JSON.stringify([{
                V_ID: String(id)
            }, {}]),
            count: 1,
            type: 'BACK'
        }
        OperateSZHZBWeekly({ ...sendBackData }).then(res => {
            if (res.success) {
                message.success('操作成功', 1);
                queryTableData(Number(dateRange[0].format('YYYYMMDD')), Number(dateRange[1].format('YYYYMMDD')), Number(currentXmid));
            }
        }).catch(e => {
            message.error('操作失败', 1);
        })
    };
    const handleDelete = (id) => {
        let deleteData = {
            json: JSON.stringify([{
                V_ID: String(id)
            }, {}]),
            count: 1,
            type: 'DELETE'
        }
        OperateSZHZBWeekly({ ...deleteData }).then(res => {
            if (res.success) {
                message.success('操作成功', 1);
                queryTableData(Number(dateRange[0].format('YYYYMMDD')), Number(dateRange[1].format('YYYYMMDD')), Number(currentXmid));
            }
        }).catch(e => {
            message.error('操作失败', 1);
        })
    };
    const handleSkipCurWeek = () => {
        Modal.confirm({
            // title: '跳过本周',
            className: 'skip-current-week',
            content: '确定要跳过本周吗？',
            onOk: () => {
                let curWeek = getCurrentWeek(new Date());
                let skipCurWeekData = {
                    json: JSON.stringify([{
                        V_KSSJ: curWeek[0].format('YYYYMMDD'),
                        V_JSSJ: curWeek[1].format('YYYYMMDD'),
                    }, {}]),
                    count: 1,
                    type: 'SKIP'
                }
                OperateSZHZBWeekly({ ...skipCurWeekData }).then(res => {
                    if (res.success) {
                        message.success('操作成功', 1);
                        queryTableData(Number(dateRange[0].format('YYYYMMDD')), Number(dateRange[1].format('YYYYMMDD')), Number(currentXmid));
                    }
                }).catch(e => {
                    message.error('操作失败', 1);
                })
            }
        });
    }
    const handleExport = () => {
        let params = new URLSearchParams();
        params.append("startTime", Number(dateRange[0].format('YYYYMMDD')));
        params.append("endTime", Number(dateRange[1].format('YYYYMMDD')));
        params.append("xmmc", Number(currentXmid));
        fetch(digitalSpecialClassWeeklyReportExcel, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        }).then(res => {
            return res.blob();
        }).then(blob => {
            let fileName = `数字化专班周报(${new moment().format('YYYYMMDD')}).xlsx`;
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
            message.success('请求成功，正在导出中', 1);
        }).catch(e => {
            message.error('导出失败', 1);
        });
        // const node = downloadRef.current;
        // const actionUrl = digitalSpecialClassWeeklyReportExcel;
        // const downloadForm = document.createElement('form');
        // downloadForm.id = 'downloadForm';
        // downloadForm.name = 'downloadForm';
        // const input = document.createElement('input');
        // input.type = 'text';
        // input.name = 'startTime';
        // input.value = Number(dateRange[0].format('YYYYMMDD'));
        // downloadForm.appendChild(input);
        // const input2 = document.createElement('input');
        // input2.type = 'text';
        // input2.name = 'endTime';
        // input2.value = Number(dateRange[1].format('YYYYMMDD'));
        // downloadForm.appendChild(input2);
        // const input3 = document.createElement('input');
        // input3.type = 'text';
        // input3.name = 'xmmc';
        // input3.value = Number(currentXmid);
        // downloadForm.appendChild(input3);
        // downloadForm.method = 'POST';
        // downloadForm.action = actionUrl;
        // node.appendChild(downloadForm);
        // downloadForm.submit();
        // node.removeChild(downloadForm);
    };
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
                    obj.props.rowSpan = groupData[value]?.length;
                } else {
                    obj.props.rowSpan = 0;
                }
                return obj;
            },
        },
        {
            title: '系统建设',
            dataIndex: 'sysBuilding',
            key: 'sysBuilding',
            width: 300,
            fixed: 'left',
            ellipsis: true,
        },
        {
            title: '负责人',
            dataIndex: 'manager',
            key: 'manager',
            width: 90,
            fixed: 'left',
            ellipsis: true,
        },
        {
            title: '里程碑情况',
            dataIndex: 'lcbqk',
            key: 'lcbqk',
            width: 120,
            ellipsis: true,
            render: (text, row, index) => {
                return <div>
                    <a style={{ color: '#1890ff' }}
                        onClick={() => getLcbqkModalUrl(row.id)}>详细信息</a>
                </div>
            },
        },
        {
            title: '年度规划',
            dataIndex: 'annualPlan',
            key: 'annualPlan',
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
            width: 120,
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
            ellipsis: true,
            editable: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 180,
            fixed: 'right',
            render: (text, row, index) => {
                return <div>
                    {authIdAData?.includes(CUR_USER_ID) && (<>
                        <Popconfirm title="确定要退回吗?" onConfirm={() => handleSendBack(row.id)}>
                            <a style={{ color: '#1890ff', marginRight: '10px' }}>退回</a>
                        </Popconfirm>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(row.id)}>
                            <a style={{ color: '#1890ff', marginRight: '10px' }}>删除</a>
                        </Popconfirm>
                    </>)}
                    <a style={{ color: '#1890ff' }} onClick={() => getLcbqkModalUrl(row.id)}>查看</a>
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
    const lcbqkModalProps = {
        isAllWindow: 1,
        // defaultFullScreen: true,
        title: '详细信息',
        width: '60%',
        height: '102rem',
        style: { top: '5%' },
        visible: lcbqkModalVisible,
        footer: null,
    };
    const getLcbqkModalUrl = (id) => {
        const params = {
            "attribute": 0,
            "authFlag": 0,
            "objectName": "V_XSZHZBHZ",
            "operateName": "V_XSZHZBHZ_VIEW",
            "parameter": [
                {
                    "name": "ZBID",
                    "value": String(id)
                },
            ],
            "userId": String(JSON.parse(sessionStorage.getItem("user")).loginName),
        }
        CreateOperateHyperLink(params).then((ret = {}) => {
            const { code, message, url } = ret;
            if (code === 1) {
                setLcbqkModalUrl(url);
                setLcbqkModalVisible(true);
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    };
    return (<>
        {lcbqkModalVisible &&
            <BridgeModel modalProps={lcbqkModalProps} onSucess={() => setLcbqkModalVisible(false)}
                onCancel={() => setLcbqkModalVisible(false)}
                src={lcbqkModalUrl} />}
        <div className='table-box'>
            {/* <div ref={downloadRef} style={{ display: 'none' }}></div> */}
            <div className='table-console'>
                <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img>
                <div className='console-txt'>{dateRange.length !== 0 && dateRange[0]?.format('YYYY-MM-DD') || ''} 至 {dateRange.length !== 0 && dateRange[1]?.format('YYYY-MM-DD') || ''}</div>
                <Button style={{ marginLeft: 'auto' }} disabled={!edited} onClick={handleSubmit}>保存</Button>
                <Popconfirm title="确定要导出吗?" onConfirm={handleExport}>
                    <Button style={{ margin: '0 1.1904rem' }}>导出</Button>
                </Popconfirm>

                {authIdAData?.includes(CUR_USER_ID) && <Button onClick={handleSkipCurWeek}>跳过本周</Button>}
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
