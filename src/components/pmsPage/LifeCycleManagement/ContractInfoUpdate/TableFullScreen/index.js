import React, { Component } from 'react'
import { Popconfirm, Modal, Table, message, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

export default class TableFullScreen extends Component {
    state = {
        editableFormData: {}
    }

    render() {
        const {
            isTableFullScreen,
            setTableFullScreen,
            setTableData,
            setSelectedRowIds,
            handleMultiDelete,
            columns,
            components,
            tableData,
            rowSelection,
            selectedRowIds,
        } = this.props;

        return (<>
            <Modal title={null} footer={null} width={'100vw'}
                // destroyOnClose
                visible={isTableFullScreen}
                wrapClassName='table-fullscreen'
                maskClosable={false}
                onCancel={() => { setTableFullScreen(false); }}
                style={{
                    maxWidth: "100vw",
                    top: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                }}
                bodyStyle={{
                    height: "100vh",
                    padding: '0 0 24px 0',
                }}>
                <div style={{ height: '55px', width: '100%', display: 'flex', alignItems: 'center', padding: '0 57px 0 22px' }}>
                    <div style={{ lineHeight: '18px', marginRight: '10px', cursor: 'pointer' }} onClick={() => {
                        let arrData = tableData;
                        arrData.push({ id: Date.now(), ['fkqs' + Date.now()]: '', ['bfb' + Date.now()]: 0.5, ['fkje' + Date.now()]: 0.5, ['fksj' + Date.now()]: moment().format('YYYY-MM-DD'), zt: '2' });
                        setTableData(arrData);
                    }}><img src={require('../../../../../image/pms/LifeCycleManagement/addTable.png')}
                        alt='' style={{ height: '20px', marginRight: '6px' }}
                        />新增</div>
                    <Popconfirm title="确定要删除吗?" onConfirm={() => {
                        if (selectedRowIds.length > 0) {
                            handleMultiDelete(selectedRowIds);
                            setSelectedRowIds([]);
                        } else {
                            message.info('请选择需要删除的数据', 1);
                        }
                    }}>
                        <div style={{ lineHeight: '18px', cursor: 'pointer' }}><img
                            src={require('../../../../../image/pms/LifeCycleManagement/deleteTable.png')}
                            alt='' style={{ height: '20px', marginRight: '6px' }}
                        />删除</div></Popconfirm>
                    <img src={isTableFullScreen ? require('../../../../../image/pms/LifeCycleManagement/full-screen-cancel-gray.png')
                        : require('../../../../../image/pms/LifeCycleManagement/full-screen-gray.png')}
                        alt='' style={{ height: '20px', marginLeft: 'auto', cursor: 'pointer' }}
                        onClick={() => { setTableFullScreen(!isTableFullScreen); }} />
                </div>
                <div className='tableBox1'>
                    <Table columns={columns}
                        rowKey={record => record.id}
                        components={components}
                        rowClassName={() => 'editable-row'}
                        dataSource={tableData}
                        scroll={{ y: 730 }}
                        rowSelection={rowSelection}
                        pagination={false}
                        size={'middle'}
                        bordered
                    ></Table>
                </div>
            </Modal>
        </>
        )
    }
}
