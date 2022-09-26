import { Row, Col, Popconfirm, Modal, Form, Input, Table, DatePicker, message } from 'antd';
// import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import React from 'react';
import {
    FetchQueryHTXXByXQTC,
    UpdateHTXX,
} from "../../../../services/pmsServices";
import moment from 'moment';
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    // toggleEdit = () => {
    //     const editing = !this.state.editing;
    //     this.setState({ editing }, () => {
    //         if (editing) {
    //             this.input.focus();
    //         }
    //     });
    // };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            console.log('values', values);
            // this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    getTitle = (dataIndex) => {
        switch (dataIndex) {
            case 'fkqs':
                return '期数';
            case 'bfb':
                return '占比';
            case 'fkje':
                return '付款金额';
            case 'fksj':
                return '付款时间';
            case 'zt':
                return '状态';
            default:
                break;
        }
    }

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        // console.log(record[dataIndex]);
        return (
            <Form.Item style={{ margin: 0 }}>
                {dataIndex === 'fksj' ? form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${this.getTitle(dataIndex)}不允许空值`,
                        },
                    ],
                    // initialValue: moment(),
                    initialValue: moment(record[dataIndex]),
                })(<DatePicker ref={node => (this.input = node)}
                    onChange={(data, dataString) => {
                        const { record, handleSave } = this.props;
                        this.form.validateFields((error, values) => {
                            console.log('values', values);
                            if (error && error[e.currentTarget.id]) {
                                return;
                            }
                            let newValues = {};
                            newValues = { ...values };
                            for (let i in newValues) {
                                if (i === 'fksj') {
                                    newValues[i] = dataString;
                                }
                            }
                            handleSave({ ...record, ...newValues });
                        });
                    }}
                // onPressEnter={this.save} 
                // onBlur={this.save} 
                />)
                    : (dataIndex === 'bfb' ? form.getFieldDecorator(dataIndex, {
                        initialValue: record[dataIndex],
                    })(<Input style={{ textAlign: 'center' }} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)
                        : form.getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `${this.getTitle(dataIndex)}不允许空值`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(<Input style={{ textAlign: 'center' }} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)
                    )}
            </Form.Item>
        );
    };
    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}
class ContractInnfoUpdate extends React.Component {
    state = {
        isModalFullScreen: false,
        isTableFullScreen: false,
        contractInfo: {   //合同信息
            htje: '',
            qsrq: null
        },
        tableData: [],    //付款详情表格
        selectedRowIds: [],
    }

    componentDidMount() {
        this.fetchQueryHTXXByXQTC();
    }
    // 获取项目信息
    fetchQueryHTXXByXQTC = () => {
        const { currentXmid } = this.props;
        FetchQueryHTXXByXQTC({
            xmmc: currentXmid
        }).then(res => {
            let rec = res.record;
            this.setState({
                contractInfo: { htje: Number(rec[0].htje), qsrq: rec[0].qsrq },
            });
            let arr = [];
            for (let i = 0; i < rec.length; i++) {
                arr.push({
                    id: rec[i].fkxqid,
                    fkqs: Number(rec[i].fkqs),
                    bfb: Number(rec[i].bfb),
                    fkje: Number(rec[i].fkje),
                    fksj: moment(rec[i].fksj).format('YYYY-MM-DD'),
                    zt: rec[i].zt
                });
            }
            this.setState({
                tableData: [...this.state.tableData, ...arr]
            });
        });
    };
    //合同信息修改付款详情表格单行删除
    handleSingleDelete = (id) => {
        const dataSource = [...this.state.tableData];
        this.setState({ tableData: dataSource.filter(item => item.id !== id) });
    };
    //合同信息修改付款详情表格多行删除
    handleMultiDelete = (ids) => {
        const dataSource = [...this.state.tableData];
        for (let j = 0; j < dataSource.length; j++) {
            for (let i = 0; i < ids.length; i++) {
                if (dataSource[j].id === ids[i]) {
                    dataSource.splice(j, 1);
                }
            }
        }
        this.setState({ tableData: dataSource });
    };
    handleTableSave = row => {
        const newData = [...this.state.tableData];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ tableData: newData }, () => {
            console.log('tableData', this.state.tableData);
        });
    };

    //调用getRowHeightAndSetTop方法获取高亮行的index值后，通过setScrollTopValue设置滚动条位置
    //data：table的datasource数据
    //value：当前需要高亮的值
    getRowHeightAndSetTop(data, value) {
        data && data.forEach((item, index) => {
            if (item.id == value) {
                this.setTableScrollTop(index);
            }
        })
    }
    //设置滚动条位置的方法
    setTableScrollTop(index, rowHieight) {
        if (index != 0 || index != -1) {
            //rowHieight是一行的高度，index*rowHieight就是滚动条要移动的位置
            let currPosition = index * rowHieight;
            $(`#list .ant-table-body`).scrollTop(currPosition);
        }
    }

    render() {
        const {
            isTableFullScreen,
            isModalFullScreen,
            tableData,
            contractInfo,
            selectedRowIds } = this.state;
        const { currentXmid, currentXmmc, editMessageVisible, closeMessageEditModal } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let newSelectedRowIds = [];
                selectedRows?.forEach(item => {
                    newSelectedRowIds.push(item.id);
                })
                this.setState({ selectedRowIds: newSelectedRowIds });
            }
        };
        const tableColumns = [
            {
                title: () => <><span style={{ color: 'red' }}>*</span>期数</>,
                dataIndex: 'fkqs',
                width: 100,
                key: 'fkqs',
                ellipsis: true,
                editable: true,
            },
            {
                title: '占比',
                dataIndex: 'bfb',
                key: 'bfb',
                ellipsis: true,
                editable: true,
            },
            {
                title: <><span style={{ color: 'red' }}>*</span>付款金额（元）</>,
                dataIndex: 'fkje',
                width: 125,
                key: 'fkje',
                ellipsis: true,
                editable: true,
            },
            {
                title: <><span style={{ color: 'red' }}>*</span>付款时间</>,
                dataIndex: 'fksj',
                width: 226,
                key: 'fksj',
                ellipsis: true,
                editable: true,
            },
            {
                title: '状态',
                dataIndex: 'zt',
                width: 80,
                key: 'zt',
                ellipsis: true,
                // editable: true,
                render: (text) => {
                    if (text === '1') {
                        return this.state.tableData.length >= 1 ? <span>已付款</span> : null;
                    }
                    return this.state.tableData.length >= 1 ? <span>未付款</span> : null;
                },
            },
            {
                title: '操作',
                dataIndex: 'operator',
                key: 'operator',
                // width: 200,
                // fixed: 'right',
                ellipsis: true,
                render: (text, record) =>
                    this.state.tableData.length >= 1 ? (
                        <Popconfirm title="确定要删除吗?" onConfirm={() => {
                            return this.handleSingleDelete(record.id)
                        }}>
                            <a>删除</a>
                        </Popconfirm>
                    ) : null,
            }
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
                        handleSave: this.handleTableSave,
                        key: col.key,
                    })
                },
            };
        });
        //覆盖默认table元素
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        return (<>
            {isTableFullScreen &&
                <Modal title={null} footer={null} width={'100vw'}
                    visible={isTableFullScreen}
                    maskClosable={false}
                    onCancel={() => { this.setState({ isTableFullScreen: false }) }}
                    style={{
                        maxWidth: "100vw",
                        top: 0,
                        paddingBottom: 0,
                        marginBottom: 0,
                    }}
                    bodyStyle={{
                        height: "100vh",
                        overflowY: "auto",
                        padding: '0 0 24px 0',
                    }}>
                    <div style={{ height: '55px', width: '100%', display: 'flex', alignItems: 'center', padding: '0 57px 0 22px' }}>
                        <div style={{ lineHeight: '18px', marginRight: '10px', cursor: 'pointer' }} onClick={() => {
                            let arrData = tableData;
                            arrData.push({ id: Date.now(), fkqs: '', bfb: '0.5', fkje: '0.5', fksj: moment().format('YYYY-MM-DD'), zt: '2' });
                            this.setState({ tableData: arrData }, () => {
                                let table2 = document.querySelectorAll(`.tableBox2 .ant-table`)[0];
                                table2.scrollTop = table2.scrollHeight;
                            });
                        }}><img
                                src={require('../../../../image/pms/LifeCycleManagement/addTable.png')}
                                alt='' style={{ height: '20px', marginRight: '6px' }}
                            />新增</div>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => {
                            if (selectedRowIds.length > 0) {
                                this.handleMultiDelete(selectedRowIds);
                            } else {
                                message.info('请选择需要删除的数据', 1);
                            }
                        }}>
                            <div style={{ lineHeight: '18px', cursor: 'pointer' }}><img
                                src={require('../../../../image/pms/LifeCycleManagement/deleteTable.png')}
                                alt='' style={{ height: '20px', marginRight: '6px' }}
                            />删除</div></Popconfirm>
                        <img src={isTableFullScreen ? require('../../../../image/pms/LifeCycleManagement/full-screen-cancel-gray.png') : require('../../../../image/pms/LifeCycleManagement/full-screen-gray.png')}
                            alt='' style={{ height: '20px', marginLeft: 'auto' }}
                            onClick={() => { this.setState({ isTableFullScreen: !isTableFullScreen }) }} />
                    </div>
                    <Table columns={columns}
                        rowKey='table'
                        components={components}
                        rowClassName={() => 'editable-row'}
                        dataSource={tableData}
                        rowSelection={rowSelection}
                        pagination={false}
                        bordered
                    ></Table>
                </Modal>}
            <Modal wrapClassName='editMessage-modify' width={isModalFullScreen ? '100vw' : '1000px'}
                maskClosable={false}
                cancelText={'关闭'}
                style={isModalFullScreen ? {
                    maxWidth: "100vw",
                    top: 0,
                    paddingBottom: 0,
                    marginBottom: 0
                } : {}}
                bodyStyle={isModalFullScreen ? {
                    height: "calc(100vh - 53px)",
                    overflowY: "auto",
                    padding: '0'
                } : {
                    padding: '0'
                }}
                title={null} visible={editMessageVisible} 
                onOk={() => {
                    this.props.form.validateFields(err => {
                        if (!err) {
                            let emptyArr = [];
                            let fkjeSum = 0, bfbSum = 0;
                            tableData?.forEach(item => {
                                for (const x in item) {
                                    if (item[x] === null || String(item[x]).trim() === '' && x !== 'bfb') {
                                        if (!emptyArr.includes(x)) { emptyArr.push(x); }
                                    }
                                }
                                fkjeSum += Number(item.fkje);
                                bfbSum += Number(item.bfb);
                            });
                            if (emptyArr.length > 0) {
                                let arr = emptyArr.map(item => {
                                    switch (item) {
                                        case 'fkqs':
                                            return '期数';
                                        case 'fkje':
                                            return '付款金额';
                                        case 'fksj':
                                            return '付款时间';
                                        default:
                                            return null;
                                    }
                                });
                                message.error(`${arr.join('、')}不允许空值`, 1);
                            } else if (bfbSum > 1) {
                                message.error('占比总额不能超过1', 1);
                            } else if (fkjeSum > getFieldValue('htje')) {
                                message.error('付款总额不能超过合同金额', 1);
                            } else {
                                let arr = [...tableData];
                                arr.forEach(item => {
                                    for (let i in item) {
                                        if (i === 'fksj') {
                                            item[i] = moment(item[i]).format('YYYYMMDD');
                                        } else {
                                            item[i] = String(item[i]);
                                        }
                                    }
                                })
                                UpdateHTXX({
                                    xmmc: Number(currentXmid),
                                    json: JSON.stringify(arr),
                                    rowcount: tableData.length,
                                    htje: Number(getFieldValue('htje')),
                                    qsrq: Number(getFieldValue('qsrq').format('YYYYMMDD'))
                                })
                                message.success('合同信息修改成功', 1);
                                this.setState({ tableData: [] });
                                closeMessageEditModal();
                            }
                        }
                    });

                }} 
                onCancel={() => {
                    this.setState({ tableData: [] });
                    closeMessageEditModal();
                }}>
                <div style={{
                    height: '42px', width: '100%', display: 'flex',
                    alignItems: 'center', backgroundColor: '#3361FF', color: 'white',
                    marginBottom: '16px', padding: '0 24px', borderRadius: '8px 8px 0 0', fontSize: '2.333rem'
                }}>
                    <strong>修改</strong>
                    <img src={isModalFullScreen
                        ? require('../../../../image/pms/LifeCycleManagement/full-screen-cancel.png')
                        : require('../../../../image/pms/LifeCycleManagement/full-screen.png')} alt=''
                        style={{ height: '14px', marginLeft: 'auto', marginRight: '25px' }}
                        onClick={() => { this.setState({ isModalFullScreen: !isModalFullScreen }) }} />
                </div>
                <Form name="nest-messages" style={{ padding: '0 24px' }}>
                    <Row>
                        <Col span={12}> <Form.Item label="项目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            <div style={{
                                width: '100%', height: '32px', backgroundColor: '#F5F5F5', border: '1px solid #d9d9d9',
                                borderRadius: '4px', marginTop: '5px', lineHeight: '32px', paddingLeft: '10px'
                            }}>{currentXmmc}</div>
                        </Form.Item>
                        </Col>
                        <Col span={12}><Form.Item label="合同金额（元）" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('htje', {
                                initialValue: contractInfo?.htje || '',
                                rules: [
                                    {
                                        required: true,
                                        message: '合同金额（元）不允许空值',
                                    },
                                ],
                            })(<Input placeholder="请输入合同金额（元）" />)}
                        </Form.Item> </Col>
                    </Row>
                    <Row>
                        <Col span={12}> <Form.Item label="签署日期" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('qsrq', {
                                initialValue: moment(contractInfo?.qsrq) || null,
                                rules: [
                                    {
                                        required: true,
                                        message: '签署日期不允许空值',
                                    },
                                ],
                            })(<DatePicker onChange={() => { }} style={{ width: '100%' }} />)}
                        </Form.Item></Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label={<span><span style={{ color: 'red' }}>*</span>付款详情</span>} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                                <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', paddingTop: '10px' }}>
                                    <div style={{ display: 'flex', height: '36px', padding: '3px 15px' }}>
                                        <div style={{ lineHeight: '18px', marginRight: '10px', cursor: 'pointer' }} onClick={() => {
                                            let arrData = tableData;
                                            arrData.push({ id: Date.now(), fkqs: '', bfb: 0.5, fkje: 0.5, fksj: moment().format('YYYY-MM-DD'), zt: '2' });
                                            this.setState({ tableData: arrData }, () => {
                                                let table2 = document.querySelectorAll(`.tableBox2 .ant-table`)[0];
                                                table2.scrollTop = table2.scrollHeight;
                                            });
                                        }}><img
                                                src={require('../../../../image/pms/LifeCycleManagement/addTable.png')}
                                                alt='' style={{ height: '20px', marginRight: '6px' }}
                                            />新增</div>
                                        <Popconfirm title="确定要删除吗?" onConfirm={() => {
                                            if (selectedRowIds.length > 0) {
                                                this.handleMultiDelete(selectedRowIds);
                                            } else {
                                                message.info('请选择需要删除的数据', 1);
                                            }
                                        }}>
                                            <div style={{ lineHeight: '18px', cursor: 'pointer' }}><img
                                                src={require('../../../../image/pms/LifeCycleManagement/deleteTable.png')}
                                                alt='' style={{ height: '20px', marginRight: '6px' }}
                                            />删除</div>
                                        </Popconfirm>
                                        <img
                                            src={isTableFullScreen ? require('../../../../image/pms/LifeCycleManagement/full-screen-cancel-gray.png') : require('../../../../image/pms/LifeCycleManagement/full-screen-gray.png')}
                                            alt='' style={{ height: '20px', marginLeft: 'auto' }}
                                            onClick={() => {
                                                this.setState({ isTableFullScreen: !isTableFullScreen })
                                            }} />
                                    </div>
                                    <div className='tableBox2'>
                                        <Table
                                            columns={columns}
                                            components={components}
                                            rowKey={record => record.id}
                                            rowClassName={() => 'editable-row'}
                                            dataSource={tableData}
                                            rowSelection={rowSelection}
                                            // scroll={{ y: 200 }}
                                            pagination={false}
                                            bordered
                                            size='middle'
                                        ></Table>
                                    </div>
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>);
    }



}
export default Form.create()(ContractInnfoUpdate);