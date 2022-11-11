import React, { useState, useEffect, useRef } from 'react'
import { Button, Icon, DatePicker, Input, Table, Select, Form, message, Modal, Popconfirm } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import { CreateOperateHyperLink, OperateMonthly, QueryUserInfo } from '../../../../services/pmsServices';
import config from '../../../../utils/config';

const { api } = config;
const { pmsServices: { digitalSpecialClassMonthReportExcel } } = api;
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem("user")).id);

const TableBox = (props) => {
    const { form, tableData, setTableData, tableLoading, setTableLoading, groupData, edited, setEdited, getCurrentWeek, monthData, getRowSpanCount, currentXmid, queryTableData, txrData } = props;
    const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
    const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');
    const [authIdAData, setAuthIdData] = useState([]);//权限用户id
    const downloadRef = useRef(null);

    useEffect(() => {
        getAutnIdData();
        setTableLoading(true);
    }, []);

    const getAutnIdData = () => {
        QueryUserInfo({
            type: 'YBAUTH',
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
        //去空格
        const newRow = {
            id: row.id,
            zdgz: row.zdgz,
            rwfl: row.rwfl,
            xmmc: row.xmmc,
            zmk: row.zmk,
            yf: row.yf,
            zt: row.zt,
            ['bywcqk' + row.id]: row['bywcqk' + row.id]?.trim(),
            ['xygzjh' + row.id]: row['xygzjh' + row.id]?.trim(),
            ['ldyj' + row.id]: row['ldyj' + row.id]?.trim(),
            ['txr' + row.id]: row['txr' + row.id],
        };
        console.log('newRow', newRow);
        newData.splice(index, 1, {
            ...item,//old row data
            ...newRow,//new row data
        });
        console.log(newData);
        setEdited(true);
        setTableData(preState => [...newData]);
    };
    const handleSubmit = () => {
        form.validateFields(err => {
            if (!err) {
                let submitTable = tableData.map((item, index) => {
                    let rowspan = getRowSpanCount(tableData, 'rwfl', index);
                    if (rowspan === 0) {
                        if (index > 1) {
                            let arr = tableData[index - 1];
                            item['txr' + item.id] = [...arr['txr' + arr.id]];
                            item['ldyj' + item.id] = arr['ldyj' + arr.id];
                        }
                    }
                    // //填写人数据替换
                    // let txrArr = item['txr' + item.id]?.map(el => {
                    //     return txrData?.filter(x => x.name === el)[0]?.id;
                    // })
                    return {
                        V_ID: String(item.id),
                        V_BYWCQK: String(item['bywcqk' + item.id]).trim(),
                        V_XYGZJH: String(item['xygzjh' + item.id]).trim(),
                        V_LDYJ: String(item['ldyj' + item.id]).trim(),
                        V_TXR: item['txr' + item.id]?.join(';'),
                    }
                });
                submitTable.push({});
                console.log("🚀submitTable", submitTable)
                let submitData = {
                    json: JSON.stringify(submitTable),
                    count: tableData.length,
                    type: 'UPDATE'
                };
                OperateMonthly({ ...submitData }).then(res => {
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
        OperateMonthly({ ...sendBackData }).then(res => {
            if (res.success) {
                message.success('操作成功', 1);
                queryTableData(Number(monthData.format('YYYYMM')), Number(currentXmid), txrData);
            }
        }).catch(e => {
            message.error('操作失败', 1);
        });
    };
    const handleDelete = (id) => {
        let deleteData = {
            json: JSON.stringify([{
                V_ID: String(id)
            }, {}]),
            count: 1,
            type: 'DELETE'
        }
        OperateMonthly({ ...deleteData }).then(res => {
            if (res.success) {
                message.success('操作成功', 1);
                queryTableData(Number(monthData.format('YYYYMM')), Number(currentXmid), txrData);
            }
        }).catch(e => {
            message.error('操作失败', 1);
        });
    };

    const handleExport = () => {
        const node = downloadRef.current;
        const actionUrl = digitalSpecialClassMonthReportExcel;
        const downloadForm = document.createElement('form');
        downloadForm.id = 'downloadForm';
        downloadForm.name = 'downloadForm';
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'month';
        input.value = Number(monthData.format('YYYYMM'));
        downloadForm.appendChild(input);
        const input2 = document.createElement('input');
        input2.type = 'text';
        input2.name = 'xmmc';
        input2.value = Number(currentXmid);
        downloadForm.appendChild(input2);
        const input3 = document.createElement('input');
        input3.type = 'text';
        input3.name = 'czr';
        input3.value = 0;
        downloadForm.appendChild(input3);
        downloadForm.method = 'POST';
        downloadForm.action = actionUrl;
        node.appendChild(downloadForm);
        downloadForm.submit();
        node.removeChild(downloadForm);
    };
    const tableColumns = [
        {
            title: '重点工作',
            dataIndex: 'zdgz',
            key: 'zdgz',
            width: 300,
            fixed: true,
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'zdgz', index);
                return obj;
            },
        },
        {
            title: '任务分类',
            dataIndex: 'rwfl',
            key: 'rwfl',
            width: 250,
            fixed: 'left',
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'rwfl', index);
                return obj;
            },
        },
        {
            title: '项目名称',
            dataIndex: 'xmmc',
            key: 'xmmc',
            fixed: 'left',
            width: 120,
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'xmmc', index);
                return obj;
            },
        },
        {
            title: '子模块',
            dataIndex: 'zmk',
            key: 'zmk',
            width: 150,
            fixed: 'left',
            ellipsis: true,
        },
        {
            title: '本月完成情况',
            dataIndex: 'bywcqk',
            key: 'annualPlan',
            ellipsis: true,
            editable: true,
        },
        {
            title: '下月工作计划',
            dataIndex: 'xygzjh',
            key: 'xygzjh',
            ellipsis: true,
            editable: true,
        },
        {
            title: '领导意见',
            dataIndex: 'ldyj',
            key: 'ldyj',
            ellipsis: true,
            editable: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'rwfl', index);
                return obj;
            },
        },
        {
            title: '填报人',
            dataIndex: 'txr',
            key: 'txr',
            width: 200,
            ellipsis: true,
            editable: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'rwfl', index);
                return obj;
            },
        },
        {
            title: '月份',
            dataIndex: 'yf',
            key: 'yf',
            width: 150,
            ellipsis: true,
        },
        {
            title: '状态',
            dataIndex: 'zt',
            key: 'zt',
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
                    txrdata: txrData,
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
        height: '80rem',
        style: { top: '5%' },
        visible: lcbqkModalVisible,
        footer: null,
    };
    const getLcbqkModalUrl = (id) => {
        const params = {
            "attribute": 0,
            "authFlag": 0,
            "objectName": "V_YBHZ",
            "operateName": "V_YBHZ_VIEW",
            "parameter": [
                {
                    "name": "YBID",
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
            <div ref={downloadRef} style={{ display: 'none' }}></div>
            <div className='table-console'>
                <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img>
                <div className='console-txt'>{monthData.format('YYYY-MM')}</div>
                <Button style={{ marginLeft: 'auto' }} disabled={!edited} onClick={handleSubmit}>保存</Button>
                <Button style={{ marginLeft: '1.1904rem' }} onClick={handleExport}>导出</Button>
            </div>
            <div className='table-content'>
                <Table
                    loading={tableLoading}
                    columns={columns}
                    components={components}
                    rowKey={record => record.id}
                    rowClassName={() => 'editable-row'}
                    dataSource={tableData}
                    scroll={tableData.length > 11 ? { y: 573, x: 2200 } : { x: 2200 }}
                    pagination={false}
                    bordered
                ></Table>
            </div>
        </div>
    </>
    )
}
export default Form.create()(TableBox);