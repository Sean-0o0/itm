import React, { useEffect, useState } from 'react';
import { Form, Upload, Modal, Icon, Button, Spin, Checkbox, Dropdown, Menu } from 'antd';
import { CheckInvoice } from '../../../../../../../services/pmsServices';
const SelectReceipt = (props) => {
    //弹窗全屏
    const [isModalFullScreen, setIsModalFullScreen] = useState(false);
    //加载状态
    const [isSpinning, setIsSpinning] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const { visible, setVisible, form, userykbid, setUploadReceiptVisible, setInputReceiptVisible, } = props;
    //防抖定时器
    let timer = null;

    useEffect(() => {
        return () => {
            clearTimeout(timer)
        }
    }, [])


    const handleSubmit = () => {
        setVisible(false);
    };
    const handleClose = () => {
        setVisible(false);
    };
    //防抖
    const debounce = (fn, waits) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            fn(...arguments);
        }, waits);
    };
    const handleReceiptMenuClick = (e) => {
        if (e.key === '1') {
            setUploadReceiptVisible(true);
            return;
        }
        if (e.key === '2') {
            setInputReceiptVisible(true);
            return;
        }
    };
    const menu = (
        <Menu onClick={handleReceiptMenuClick}>
            <Menu.Item key="1">
                <Icon type="file-pdf" />
                电子发票文件
            </Menu.Item>
            <Menu.Item key="2">
                <Icon type="form" />
                手录发票
            </Menu.Item>
        </Menu>
    );
    const getSelectReceipt = () => {
        const getRecepitItem = () => {
            return (
                <div className='receipt-item'>
                    <div className='item-title'>
                        <Checkbox onChange={() => { }}>通过电子发票文件导入了 1 张发票</Checkbox>
                    </div>
                    <div className={'item-info' + (isHover ? ' hover' : '')}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                    >
                        <div className='info-title'>
                            <div className='title-left'>
                                <Checkbox onChange={() => { }}>
                                    杭州滴滴出行科技有限公司</Checkbox>
                                <div className='title-tag-icon'></div>
                                <div className='title-tag'>已验真</div>
                            </div>
                            ¥ {17.28}
                        </div>
                        <div className='info-expand'>
                            <div className='expand-left'>
                                <div className='type-tag'>增值税电子普通发票</div>
                                2022年11月17日
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div className='select-receipt-content'>
                <div className='top-console'>
                    <div className='select-all'>
                        <Checkbox onChange={() => { }}>全选</Checkbox>
                        <span>已选 {0} 张发票, 共¥{0}</span>
                    </div>
                    <Dropdown overlay={menu}>
                        <Button>
                            <Icon type="upload" />继续添加
                        </Button>
                    </Dropdown>
                </div>
                <div className='receipt-list'>
                    {getRecepitItem()}
                    {getRecepitItem()}
                    {getRecepitItem()}
                </div>
            </div>
        );
    };
    return (
        <Modal wrapClassName='editMessage-modify'
            centered
            width={isModalFullScreen ? '100vw' : '47vw'}
            maskClosable={false}
            maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
            zIndex={102}
            cancelText={null}
            okText='与该消费绑定'
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
                padding: '0',
                overflow: 'hidden'
            }}
            title={null} visible={visible}
            onOk={handleSubmit}
            onCancel={handleClose}>
            <div className='body-title-box'>
                <strong>发票列表</strong>
                <img src={isModalFullScreen
                    ? require('../../../../../../../image/pms/LifeCycleManagement/full-screen-cancel.png')
                    : require('../../../../../../../image/pms/LifeCycleManagement/full-screen.png')} alt=''
                    onClick={() => setIsModalFullScreen(!isModalFullScreen)} />
            </div>
            {getSelectReceipt()}
        </Modal>
    );
};
export default Form.create()(SelectReceipt);