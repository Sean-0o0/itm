import React, { useState, useEffect } from 'react'
import { Button, Table, Form, message, Popconfirm, Icon } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import { CreateOperateHyperLink, OperateMonthly, QueryUserInfo } from '../../../../services/pmsServices';
import config from '../../../../utils/config';
import moment from 'moment';

const { api } = config;
const { pmsServices: { digitalSpecialClassMonthReportExcel } } = api;
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem("user")).id);

const TableBox = (props) => {
    const { form, tableData, setTableData, tableLoading, setTableLoading, edited, setEdited,
        monthData, getRowSpanCount, currentXmid, queryTableData, txrData } = props;
    const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
    const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');
    const [authIdAData, setAuthIdData] = useState([]);//权限用户id
    const [isSaved, setIsSaved] = useState(false);
    const [toLeft, setToLeft] = useState(false);//是否允许左滚
    const [toRight, setToRight] = useState(true);

    useEffect(() => {
        getAutnIdData();
        setTableLoading(true);
        const tableNode = document.querySelector('.weekly-report-summary .ant-table .ant-table-body');
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
            xzgzap: row.xzgzap,
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
        console.log('newTable', newData);
        setEdited(true);
        setTableData(preState => [...newData]);
    };
    const handleSubmit = () => {
        form.validateFields(err => {
            if (!err) {
                let submitTable = tableData.map((item, index) => {
                    let rowspan = getRowSpanCount(tableData, 'xzgzap', index);
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
                // console.log("🚀submitTable", submitTable)
                let submitData = {
                    json: JSON.stringify(submitTable),
                    count: tableData.length,
                    type: 'UPDATE'
                };
                OperateMonthly({ ...submitData }).then(res => {
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
        let params = new URLSearchParams();
        params.append("month", Number(monthData.format('YYYYMM')));
        params.append("xmmc", Number(currentXmid));
        params.append("czr", 0);
        fetch(digitalSpecialClassMonthReportExcel, {
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
            // console.error(e);
        });
    };
    const handleTableScroll = (direction) => {
        const tableNode = document.querySelector('.weekly-report-summary .ant-table .ant-table-body');
        if (direction === 'left') {
            tableNode.scrollLeft = 0;
        }
        if (direction === 'right') {
            tableNode.scrollLeft = tableNode.scrollWidth;
        }
        console.log("🚀 ~ file: index.js ~ line 210 ~ handleTableScroll ~ tableNode", tableNode, tableNode.scrollLeft, tableNode.scrollWidth, tableNode.clientWidth)
    }
    const tableColumns = [
        {
            title: '工作模块',
            dataIndex: 'gzmk',
            key: 'gzmk',
            width: 150,
            // fixed: 'left',
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'gzmk', index);
                return obj;
            },
        },
        {
            title: '本周重点工作',
            dataIndex: 'bzzdgz',
            key: 'bzzdgz',
            width: 150,
            // fixed: 'left',
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'bzzdgz', index);
                return obj;
            },
        },
        {
            title: '下周工作安排',
            dataIndex: 'xzgzap',
            key: 'xzgzap',
            width: 150,
            // fixed: 'left',
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'xzgzap', index);
                return obj;
            },
        },
        {
            title: '版本号',
            dataIndex: 'bbh',
            key: 'bbh',
            // fixed: 'left',
            width: 150,
            ellipsis: true,
        },
        {
            title: '计划上线日期',
            dataIndex: 'jhsxrq',
            key: 'jhsxrq',
            ellipsis: true,
            editable: true,

        },
        {
            title: '进度状态',
            dataIndex: 'jdzt',
            key: 'jdzt',
            ellipsis: true,
            editable: true,
        },
        {
            title: '当前进度',
            dataIndex: 'dqjd',
            key: 'dqjd',
            ellipsis: true,
            editable: true,
        },
        {
            title: '重要事项说明',
            dataIndex: 'zysxsm',
            key: 'zysxsm',
            width: 200,
            ellipsis: true,
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 180,
            fixed: 'right',
            render: (text, row, index) => {
                return <div>
                    <a style={{ color: '#3361ff', marginRight: '1.488rem' }} onClick={() => getLcbqkModalUrl(row.id)}>查看</a>
                    {authIdAData?.includes(CUR_USER_ID) && (<>
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
    const columns = tableColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record, index) => {
                return ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    handleSave: handleTableSave,
                    formdecorate: form,
                    txrdata: txrData,
                    issaved: isSaved,
                    recordindex: index,
                    tabledata: tableData,
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
            {/* <div ref={downloadRef} style={{ display: 'none' }}></div> */}
            <div className='table-console'>
                <div className='console-date'>
                    <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img>
                    <div className='console-txt'>{monthData.format('YYYY-MM')}</div>
                </div>
                <div className='console-btn-submit'>
                    <Button style={{ marginLeft: 'auto' }} disabled={!toLeft} onClick={() => handleTableScroll('left')}><Icon type="left" />上一列</Button>
                    <Button disabled={!toRight} style={{ margin: '0 1.1904rem' }} onClick={() => handleTableScroll('right')}>下一列<Icon type="right" /></Button>
                    <Button disabled={!edited} onClick={handleSubmit}>保存</Button>
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
                    rowKey={'id'}
                    rowClassName={() => 'editable-row'}
                    dataSource={tableData}
                    // scroll={tableData.length > 11 ? { y: 573, x: 2200 } : { x: 2200 }}
                    scroll={{ y: true, x: 2200 }}
                    pagination={false}
                    bordered
                ></Table>
            </div>
        </div>
    </>
    )
}
export default Form.create()(TableBox);