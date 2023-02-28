import React, { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';

export default function InfoDetail(props) {
    const [isSpinning, setIsSpinning] = useState(false); //example
    const { modalVisible, setModalVisible } = props;

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
            visible={modalVisible}
            onOk={() => { }}
            onCancel={() => setModalVisible(false)}>
            <div className='body-title-box'>
                <strong>项目详情</strong>
                <i className='iconfont icon-edit'
                    style={{ marginLeft: 'auto', marginRight: '3.7rem', cursor: 'pointer' }}
                    onClick={() => { }} />
            </div>
            <Spin spinning={isSpinning} tip='加载中' size='large' wrapperClassName='diy-style-spin payment-process-box'>
                TO DO ...
            </Spin>
        </Modal>
    )
};