import React, { useEffect, useState } from 'react';
import { Button, Table, Popover, message } from 'antd';
import InfoDetail from '../infoDetail';
import BridgeModel from '../../../Common/BasicModal/BridgeModel.js';
import {EncryptBase64} from '../../../Common/Encrypt';

export default function InfoTable() {
    const [tableLoading, setTableLoading] = useState(false); //表格加载状态
    const [tableData, setTableData] = useState([]); //表格数据
    const [sortedInfo, setSortedInfo] = useState({}); //金额排序
    const [modalVisible, setModalVisible] = useState(false); //项目详情弹窗显示
    const [fileAddVisible, setFileAddVisible] = useState(false); //项目详情弹窗显示

    useEffect(() => {
        const data = [{
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '12345678',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '迭代项目;数字化专班;项目课题;抵税扣除;信创项目;软著专利;党建项目'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '迭代项目;数字化专班;项目课题;抵税扣除;信创项目;软著专利;党建项目'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '1234567891',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '迭代项目;数字化专班;项目课题;抵税扣除;信创项目;软著专利;党建项目'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '迭代项目;数字化专班;项目课题;抵税扣除;信创项目;软著专利;党建项目'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '迭代项目;数字化专班;项目课题;抵税扣除;信创项目;软著专利;党建项目'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三;一二三四五六七八九十一二三;一二三四五六七八九十一二三;一二三四五六七八九十一二三;一二三四五六七八九十一二三;一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        }, {
            xmmc: '一二三四五六七八九十一二三',
            xmjl: '一二三四五六七八九十一二三',
            xmlx: '一二三四五六七八九十一二三',
            glys: '一二三四五六七八九十一二三',
            xmje: '123456789123456789',
            yybm: '一二三四五六七八九十一二三',
            xmbq: '一二三四五六七八九十一二三'
        },];
        setTableData(p => [...data]);
        return () => {
        }
    }, []);
    const handleTableChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setSortedInfo(sorter);
    };
    const getTagData = (tag) => {
        let arr = [];
        if (tag !== '' && tag !== null && tag !== undefined) {
            if (tag.includes(';')) {
                arr = tag.split(';');
            }
            else {
                arr.push(tag);
            }
        }
        return arr;
    }
    const handleModalOpen = (v) => {
        setModalVisible(true);
        return;
    };
    const fileAddModalProps = {
        isAllWindow: 1,
        // defaultFullScreen: true,
        title: '新建项目',
        width: '70%',
        height: '120rem',
        style: {top: '2rem'},
        visible: true,
        footer: null,
      };
    const openVisible = () =>{
        setFileAddVisible(true);
    }
    const closeFileAddModal = () =>{
        setFileAddVisible(false);
    }
    const src_fileAdd = `/#/single/pms/SaveProject/${EncryptBase64(JSON.stringify({ xmid: -1, type: true }))}`;
    const columns = [
        {
            title: '项目名称',
            dataIndex: 'xmmc',
            width: 200,
            key: 'xmmc',
            ellipsis: true,
        },
        {
            title: '项目经理',
            dataIndex: 'xmjl',
            width: 100,
            key: 'xmjl',
            ellipsis: true,
        },
        {
            title: '项目类型',
            dataIndex: 'xmlx',
            width: 100,
            key: 'xmlx',
            ellipsis: true,
        },
        {
            title: '关联预算',
            dataIndex: 'glys',
            width: 140,
            key: 'glys',
            ellipsis: true,
        },
        {
            title: '项目金额(元)',
            dataIndex: 'xmje',
            width: 120,
            align: 'right',
            key: 'xmje',
            ellipsis: true,
            sorter: (a, b) => Number(a.xmje) - Number(b.xmje),
        },
        {
            title: '应用部门',
            dataIndex: 'yybm',
            width: 150,
            key: 'yybm',
            ellipsis: true,
        },
        {
            title: '项目标签',
            dataIndex: 'xmbq',
            width: 300,
            key: 'xmbq',
            ellipsis: true,
            render: (text, row, index) => {
                return (<div className='prj-tags'>
                    {getTagData(text).length !== 0 && <>
                        {getTagData(text)?.slice(0, 3).map((x, i) => <div key={i} className='tag-item'>{x}</div>)}
                        {getTagData(text)?.length > 3 && <Popover overlayClassName='tag-more-popover' content={(
                            <div className='tag-more'>
                                {getTagData(text)?.slice(3).map((x, i) => <div key={i} className='tag-item'>{x}</div>)}
                            </div>
                        )} title={null}>
                            <div className='tag-item'>...</div>
                        </Popover>}
                    </>}
                </div>);
            },
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            key: 'operation',
            width: 100,
            render: (text, row, index) => <a style={{ color: '#3361ff' }} onClick={() => { handleModalOpen() }}>查看</a>,
        },
    ];
    return (
        <div className='info-table'>
            {fileAddVisible &&
                <BridgeModel isSpining="customize" modalProps={fileAddModalProps} onSucess={() => {
                    closeFileAddModal();
                    message.success('保存成功', 1);
                }} onCancel={closeFileAddModal}
                    src={src_fileAdd} />}
            <InfoDetail modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <Button type='primary' className='btn-add-prj' onClick={openVisible}>新建项目</Button>
            <Table
                loading={tableLoading}
                columns={columns}
                rowKey={'id'}
                dataSource={tableData}
                handleTableChange={handleTableChange}
                pagination={{
                    pageSizeOptions: ['10', '20', '30', '40'],
                    showSizeChanger: true,
                    hideOnSinglePage: true,
                    showQuickJumper: true,
                    showTotal: total => `共 ${total} 条数据`
                }}
            // bordered
            ></Table>
        </div>
    )
};