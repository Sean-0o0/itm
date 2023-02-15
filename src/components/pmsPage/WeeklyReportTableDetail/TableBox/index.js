import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, message, Modal, Popconfirm, Form, Icon } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import { OperateSZHZBWeekly, CreateOperateHyperLink, QueryUserInfo } from '../../../../services/pmsServices';
import moment from 'moment';
import config from '../../../../utils/config';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

const { api } = config;
const { pmsServices: { digitalSpecialClassWeeklyReportExcel } } = api;
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem("user")).id);

const TableBox = (props) => {
    const { form, tableData, dateRange, setTableData, tableLoading, setTableLoading,
        groupData, edited, setEdited, getCurrentWeek, currentXmid, queryTableData, monthData } = props;
    const [isSaved, setIsSaved] = useState(false);
    const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
    const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');
    const [authIdData, setAuthIdData] = useState([]);//权限用户id
    const [toLeft, setToLeft] = useState(false);//是否允许左滚
    const [toRight, setToRight] = useState(true);

    // const downloadRef = useRef(null);

    useEffect(() => {
        setTableLoading(true);
        getAutnIdData();
        const tableNode = document.querySelector('.weekly-report-detail .ant-table .ant-table-body');
        tableNode.addEventListener("scroll", (e) => {
            console.log(Math.floor(tableNode.scrollWidth - tableNode.clientWidth));
            if (tableNode.scrollLeft === 0) {
                setToLeft(false);
                setToRight(true);
            } else if (tableNode.scrollLeft > 0 && tableNode.scrollLeft <= Math.floor(tableNode.scrollWidth - tableNode.clientWidth)) {
                setToLeft(true);
                setToRight(true);
            }
            else {
                setToLeft(true);
                setToRight(false);
            }
        });
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
            id: row.id,
            module: row.module,
            sysBuilding: row.sysBuilding,
            manager: row.manager,
            // lcbmc: row.lcbmc,
            // lcbjd: row.lcbjd,
            // lcbbz: row.lcbbz,
            [keys[6]]: row[keys[6]].trim(),
            [keys[7]]: row[keys[7]],
            [keys[8]]: row[keys[8]],
            [keys[9]]: row[keys[9]].trim(),
            [keys[10]]: row[keys[10]],
            [keys[11]]: row[keys[11]].trim(),
            [keys[12]]: row[keys[12]].trim(),
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
                        setIsSaved(true);
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
                queryTableData(Number(monthData.startOf('month').format('YYYYMMDD')), Number(monthData.endOf('month').format('YYYYMMDD')), Number(currentXmid));
                message.success('操作成功', 1);
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
                queryTableData(Number(monthData.startOf('month').format('YYYYMMDD')), Number(monthData.endOf('month').format('YYYYMMDD')), Number(currentXmid));
                message.success('操作成功', 1);
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
        params.append("startTime", Number(monthData.startOf('month').format('YYYYMMDD')));
        params.append("endTime", Number(monthData.endOf('month').format('YYYYMMDD')));
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
            let fileName = `数字化专班月报(${new moment().format('YYYYMMDD')}).xlsx`;
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
            message.success('请求成功，正在导出中', 1);
        }).catch(e => {
            message.error('导出失败', 1);
        });
    };
    const handleTableScroll = (direction) => {
        const tableNode = document.querySelector('.weekly-report-detail .ant-table .ant-table-body');
        if (direction === 'left') {
            tableNode.scrollLeft = 0;
        }
        if (direction === 'right') {
            tableNode.scrollLeft = tableNode.scrollWidth;
        }
        // console.log("🚀 ~ file: index.js ~ line 210 ~ handleTableScroll ~ tableNode", tableNode, tableNode.scrollLeft, tableNode.scrollWidth, tableNode.clientWidth)
    }
    const tableColumns = [
        {
            title: '模块',
            dataIndex: 'module',
            key: 'module',
            width: 120,
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
            width: 200,
            fixed: 'left',
            ellipsis: true,
        },
        {
            title: '负责人',
            dataIndex: 'manager',
            key: 'manager',
            width: 125,
            fixed: 'left',
            ellipsis: true,
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
            title: '项目进展',
            dataIndex: 'curProgress',
            key: 'curProgress',
            width: 100,
            ellipsis: true,
            editable: true,
        },
        {
            title: '项目进度',
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
            title: '年度规划',
            dataIndex: 'annualPlan',
            key: 'annualPlan',
            ellipsis: true,
            editable: true,
        },
        {
            title: '专班人数',
            dataIndex: 'peopleNumber',
            key: 'peopleNumber',
            ellipsis: true,
            editable: true,
        },
        {
            title: '使用部门',
            dataIndex: 'orgName',
            key: 'orgName',
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
            width: 160,
            fixed: 'right',
            render: (text, row, index) => {
                return <div>
                    <a style={{ color: '#3361ff', marginRight: '1.488rem' }} onClick={() => getLcbqkModalUrl(row.id)}>查看</a>
                    {authIdData?.includes(CUR_USER_ID) && (<>
                        <Popconfirm title="确定要退回吗?" onConfirm={() => handleSendBack(row.id)}>
                            <a style={{ color: '#3361ff', marginRight: '1.488rem' }}>退回</a>
                        </Popconfirm>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(row.id)}>
                            <a style={{ color: '#3361ff' }}>删除</a>
                        </Popconfirm>
                    </>)}
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
                    issaved: isSaved,
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
            "operateName": "V_XSZHZBHZ_VIEW_copy",
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
            <div className='table-console'>
                <div className='console-date'>
                    <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img>
                    <div className='console-txt'>{monthData.format('YYYY-MM')}</div>
                </div>
                <div className='console-btn-submit'>
                    <Button style={{ marginLeft: 'auto' }} disabled={!toLeft} onClick={() => handleTableScroll('left')}><Icon type="left" />上一列</Button>
                    <Button disabled={!toRight} style={{ margin: '0 1.1904rem' }} onClick={() => handleTableScroll('right')}>下一列<Icon type="right" /></Button>
                    <Button  disabled={!edited} onClick={handleSubmit}>保存</Button>
                    <Popconfirm title="确定要导出吗?" onConfirm={handleExport}>
                        <Button style={{ marginLeft: '1.1904rem' }}>导出</Button>
                    </Popconfirm> 
                </div>
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
