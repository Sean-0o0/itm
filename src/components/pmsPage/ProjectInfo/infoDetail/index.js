import React, { useEffect, useState } from 'react';
import { Modal, Spin, Tabs } from 'antd';
import BasicInfo from './basicInfo';
import OtherInfo from './otherInfo';
const { TabPane } = Tabs;

export default function InfoDetail(props) {
    const [isSpinning, setIsSpinning] = useState(false); //弹窗加载状态
    const [activekey, setActiveKey] = useState('3'); //高亮tab的key值

    const { modalVisible, setModalVisible } = props;
    const handleEdit = ()=>{ 
    };
    const handleTabChange = (v)=>{
        // console.log('handleTabChange', v);
        setActiveKey(v);
    };
    return (
        <Modal wrapClassName='info-detail-modal' width='130rem'
            maskClosable={false}
            zIndex={100}
            maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
            cancelText='取消'
            okText='保存'
            style={{ top: '2rem' }}
            bodyStyle={{ height: 'calc(100vh - 13.5rem)', padding: '0', overflow: 'hidden' }}
            title={null}
            // visible={true}
            visible={modalVisible}
            onOk={() => { }}
            onCancel={() => setModalVisible(false)}>
            <div className='body-title-box'>
                <strong>项目详情</strong>
                <i className='iconfont icon-edit'
                    style={{ marginLeft: 'auto', marginRight: '3.7rem', cursor: 'pointer' }}
                    onClick={handleEdit} />
            </div>
            <Spin spinning={isSpinning} tip='加载中' size='large' wrapperClassName='diy-style-spin payment-process-box'>
                <Tabs activeKey={activekey} onChange={handleTabChange} size='large'>
                    <TabPane tab="基本信息" key="1">
                        <BasicInfo />
                    </TabPane>
                    <TabPane tab="里程碑信息" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="其他信息" key="3">
                        <OtherInfo />
                    </TabPane>
                </Tabs>
            </Spin>
        </Modal>
    )
};