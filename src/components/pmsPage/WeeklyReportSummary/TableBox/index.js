import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, message, Modal, Popconfirm, Form, DatePicker, Select, Icon } from 'antd';
import { EditableFormRow, EditableCell } from '../EditableRowAndCell';
import { OperateSZHZBWeekly, CreateOperateHyperLink, QueryUserInfo } from '../../../../services/pmsServices';
import moment from 'moment';
import config from '../../../../utils/config';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
const { WeekPicker } = DatePicker;
const { Option } = Select;
const { api } = config;
const { pmsServices: { digitalSpecialClassWeeklyReportExcel } } = api;
const CUR_USER_ID = String(JSON.parse(sessionStorage.getItem("user")).id);

const TableBox = (props) => {
    const { form, tableData, dateRange, setTableData, tableLoading, setTableLoading,
        edited, setEdited, getCurrentWeek, currentXmid, queryTableData, monthData,
        projectData,
        setCurrentXmid,
        setDateRange
    } = props;
    const [isSaved, setIsSaved] = useState(false);
    const [summaryModalUrl, setSummaryModalUrl] = useState('');
    const [summaryModalVisible, setSummaryModalVisible] = useState(false);
    const [authIdData, setAuthIdData] = useState([]);//权限用户id
    const [toLeft, setToLeft] = useState(false);//是否允许左滚
    const [toRight, setToRight] = useState(true);
    const [managerData, setManagerData] = useState([]);//负责人下拉框数据
    const [lcbqkModalUrl, setLcbqkModalUrl] = useState('');
    const [lcbqkModalVisible, setLcbqkModalVisible] = useState('');

    // const downloadRef = useRef(null);

    useEffect(() => {
        // setTableLoading(true);
        getAutnIdData();
        getManagerData();
        const tableNode = document.querySelector('.weekly-report-detail .ant-table .ant-table-body');
        tableNode.addEventListener("scroll", (e) => {
            // console.log(Math.floor(tableNode.scrollWidth - tableNode.clientWidth));
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

    //负责人下拉框数据
    const getManagerData = () => {
        QueryUserInfo({
            type: '信息技术事业部'
        }).then(res => {
            if (res.success) {
                setManagerData(p => [...res.record]);
                // console.log(res);
            }
        })
    };
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
        // console.log("🚀 ~ file: index.js ~ line 78 ~ handleTableSave ~ keys", keys)
        //去空格
        const newRow = {
            id: row.id,
            module: row.module,
            sysBuilding: row.sysBuilding,
            [keys[3]]: row[keys[3]],
            [keys[4]]: row[keys[4]].trim(),
            [keys[5]]: row[keys[5]].trim(),
            [keys[6]]: row[keys[6]].trim(),
            [keys[7]]: row[keys[7]].trim(),
            [keys[8]]: row[keys[8]].trim(),
            [keys[9]]: row[keys[9]].trim(),
            [keys[10]]: row[keys[10]].trim(),
            [keys[11]]: row[keys[11]].trim(),
            [keys[12]]: row[keys[12]].trim(),
        };
        newData.splice(index, 1, {
            ...item,//old row data
            ...newRow,//new row data
        });
        setEdited(true);
        // console.log('TableData', newData);
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
                        V_FZR: item['manager' + item.id]?.join(';'),
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
    const handleSummary = () => {
        const params = {
            "attribute": 0,
            "authFlag": 0,
            "objectName": "V_XSZHZBHZ",
            "operateName": "V_XSZHZBHZ_SUMMIT",
            "parameter": [
                // {
                //     "name": "ZBID",
                //     "value": String(id)
                // },
            ],
            "userId": String(JSON.parse(sessionStorage.getItem("user")).loginName),
        }
        CreateOperateHyperLink(params).then((ret = {}) => {
            const { code, message, url } = ret;
            if (code === 1) {
                setSummaryModalUrl(url);
                setSummaryModalVisible(true);
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
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
    const tableColumns = [
        {
            title: '工作模块',
            dataIndex: 'gzmk',
            key: 'gzmk',
            width: 150,
            fixed: 'left',
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
            dataIndex: 'bznr',
            key: 'bznr',
            width: 150,
            ellipsis: true,
            render: (value, row, index) => {
                const obj = {
                    children: value,
                    props: {},
                };
                obj.props.rowSpan = getRowSpanCount(tableData, 'bzzdgz', index);
                return obj;
            },
            editable: true,
        },
        {
            title: '下周工作安排',
            dataIndex: 'xzjh',
            key: 'xzjh',
            width: 150,
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
            editable: true,
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
            dataIndex: 'dqzt',
            key: 'dqzt',
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
            dataIndex: 'zysjsm',
            key: 'zysjsm',
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
                    managerdata: managerData,
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
    const summaryModalProps = {
        isAllWindow: 1,
        // defaultFullScreen: true,
        title: '手动汇总',
        width: '40%',
        height: '60rem',
        style: { top: '5%' },
        visible: summaryModalVisible,
        footer: null,
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
    const [open, setOpen] = useState(false);

    const handleWeekChange = (txt) => {
        let startDayStamp = dateRange[0].valueOf();
        let endDaystamp = Number(dateRange[1].endOf('day').format('x'));
        const oneDayStamp = 86400000;//ms
        let newStart = null, newEnd = null;
        if (txt === 'last') {//上周
            newStart = startDayStamp - oneDayStamp * 7;
            newEnd = endDaystamp - oneDayStamp * 7;
        } else if (txt === 'next') {//下周
            newStart = startDayStamp + oneDayStamp * 7;
            newEnd = endDaystamp + oneDayStamp * 7;
        } else if (txt === 'current') {//当前周
            let curWeekRange = getCurrentWeek(new Date());
            newStart = curWeekRange[0];
            newEnd = curWeekRange[1];
        } else {
            return;
        }
        setEdited(false);
        setDateRange(pre => [...[moment(newStart), moment(newEnd)]]);
        setTableLoading(true);
        queryTableData(Number(moment(newStart).format('YYYYMMDD')), Number(moment(newEnd).format('YYYYMMDD')), currentXmid);
    };
    const handleDateChange = (d, ds) => {
        let timeStamp = d.valueOf();
        let currentDay = d.day();
        let monday = 0, sunday = 0;
        if (currentDay !== 0) {
            monday = new Date(timeStamp - (currentDay - 1) * 60 * 60 * 24 * 1000);
            sunday = new Date(timeStamp + (7 - currentDay) * 60 * 60 * 24 * 1000);
        } else {
            monday = new Date(timeStamp - (7 - 1) * 60 * 60 * 24 * 1000);
            sunday = new Date(timeStamp + (7 - 7) * 60 * 60 * 24 * 1000);
        }
        let currentWeek = [moment(monday), moment(sunday)];
        setEdited(false);
        setDateRange(pre => [...currentWeek]);
        setTableLoading(true);
        queryTableData(Number(currentWeek[0].format('YYYYMMDD')), Number(currentWeek[1].format('YYYYMMDD')), currentXmid);
    };
    const handleProjectChange = (value) => {
        if (value) {
            setCurrentXmid(Number(value));
            queryTableData(Number(dateRange[0].format('YYYYMMDD')), Number(dateRange[1].format('YYYYMMDD')), Number(value));
        } else {
            queryTableData(Number(dateRange[0].format('YYYYMMDD')), Number(dateRange[1].format('YYYYMMDD')), -1);
        }
        setTableLoading(true);
        setEdited(false);
    };
    return (<>
        {summaryModalVisible &&
            <BridgeModel modalProps={summaryModalProps} onSucess={() => {
                queryTableData(Number(monthData.startOf('month').format('YYYYMMDD')), Number(monthData.endOf('month').format('YYYYMMDD')), Number(currentXmid));
                setSummaryModalVisible(false);
                message.success('汇总成功', 1);
            }}
                onCancel={() => setSummaryModalVisible(false)}
                src={summaryModalUrl} />}
        {lcbqkModalVisible &&
            <BridgeModel modalProps={lcbqkModalProps} onSucess={() => setLcbqkModalVisible(false)}
                onCancel={() => setLcbqkModalVisible(false)}
                src={lcbqkModalUrl} />}
        <div className='table-box' style={{ marginTop: '0' }}>
            <div className='table-console'>
                <div className='console-date'>
                    <img className='console-icon' src={require('../../../../image/pms/WeeklyReportDetail/icon_date@2x.png')} alt=''></img>
                    {/* <div className='console-txt'>{monthData.format('YYYY-MM')}</div> */}
                </div>
                <Button onClick={handleWeekChange.bind(this, 'current')} style={{ marginRight: '2.3808rem' }}>回到本周</Button>
                <Button onClick={handleWeekChange.bind(this, 'last')}>
                    <Icon type="left" />
                    上周
                </Button>
                <WeekPicker
                    value={dateRange[1]}
                    onChange={handleDateChange}
                    style={{ margin: '0 1.488rem', width: '16.368rem' }} />
                <Button onClick={handleWeekChange.bind(this, 'next')}>
                    下周
                    <Icon type="right" />
                </Button>
                <Select
                    style={{ width: '34rem', borderRadius: '1.1904rem !important', marginLeft: '2.3808rem', marginRight: 'auto' }}
                    showSearch
                    allowClear
                    placeholder="请选择项目名称"
                    optionFilterProp="children"
                    onChange={handleProjectChange}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    open={open}
                    onDropdownVisibleChange={(visible) => { setOpen(visible); }}
                >
                    {
                        projectData?.map((item = {}, ind) => {
                            return <Option key={ind} value={item.xmid}>{item.xmmc}</Option>
                        })
                    }
                </Select>
                <div className='console-btn-submit'>
                    <Button style={{ marginLeft: 'auto' }} disabled={!toLeft} onClick={() => handleTableScroll('left')}><Icon type="left" />上一列</Button>
                    <Button disabled={!toRight} style={{ margin: '0 1.1904rem' }} onClick={() => handleTableScroll('right')}>下一列<Icon type="right" /></Button>
                    {/* <Button style={{ marginRight: '1.1904rem'}} onClick={handleSummary}>手动汇总</Button> */}
                    <Button disabled={!edited} onClick={handleSubmit}>保存</Button>
                    <Popconfirm title="确定要导出吗?" onConfirm={handleExport}>
                        <Button className='ss' style={{ marginLeft: '1.1904rem' }}>导出</Button>
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
