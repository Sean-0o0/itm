import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Upload, Select, Radio, Modal, InputNumber, Drawer, Button, Icon } from 'antd';
import moment from 'moment';
const InputReceipt = (props) => {
    //弹窗全屏
    const [isModalFullScreen, setIsModalFullScreen] = useState(false);
    const { visible, setVisible, form } = props;
    const { getFieldDecorator, getFieldValue, validateFields } = form;
    const handleSubmit = () => {
        validateFields(err => {
            if (!err) {
                setVisible(false);
            }
        })
    };
    const handleClose = () => {
        setVisible(false);
    };
    const handleDateChange = () => {

    };

    //输入框
    const getInput = ({ label, labelCol, wrapperCol, dataIndex, initialValue, rules, maxLength, node }) => {
        maxLength = maxLength || 150;
        node = node || <Input maxLength={maxLength} placeholder={`请输入${label}`} />;
        return (
            <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
                {getFieldDecorator(dataIndex, {
                    initialValue,
                    rules,
                })(node)}
            </Form.Item>
        );
    };

    //输入框入参
    const amountInputProps = {
        label: '金额',
        labelCol: 8,
        wrapperCol: 16,
        dataIndex: 'htje',
        rules: [
            {
                required: true,
                message: '金额不允许空值',
            },
        ],
        node: <InputNumber style={{ width: '100%' }}
            max={99999999999.99} min={0} step={0.01}
            placeholder='请输入金额（不含税）'
            precision={2}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')} />,
    };
    const codeInputProps = {
        label: '发票代码',
        labelCol: 8,
        wrapperCol: 16,
        dataIndex: 'htje',
        rules: [
            {
                required: true,
                message: '发票代码不允许空值',
            },
        ],
        node: <Input style={{ width: '100%' }} placeholder='请输入12位发票代码' />,
    };
    const numberInputProps = {
        label: '发票号码',
        labelCol: 8,
        wrapperCol: 16,
        dataIndex: 'htje',
        rules: [
            {
                required: true,
                message: '发票号码不允许空值',
            },
        ],
        node: <Input style={{ width: '100%' }} placeholder='请输入8位发票号码' />,
    };
    const checkInputProps = {
        label: '校验码',
        labelCol: 4,
        wrapperCol: 20,
        dataIndex: 'htje',
        rules: [
            {
                required: true,
                message: '校验码不允许空值',
            },
        ],
        node: <Input style={{ width: '100%' }} placeholder='请输入20位校验码' />,
    };
    //日期
    const getDatePicker = () => {
        return (
            <Form.Item label="日期" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('date', {
                    initialValue: moment(),
                    rules: [
                        {
                            required: true,
                            message: '日期不允许空值',
                        },
                    ],
                })(<DatePicker style={{ width: '100%' }} onChange={handleDateChange} />)}
            </Form.Item>
        );
    };

    //表单
    const FormOperate = () => {
        return (
            <Form style={{ padding: '3.5712rem 3.5712rem 0 3.5712rem' }}>
                <Row>
                    <Col span={12}>{getInput(codeInputProps)}</Col>
                    <Col span={12}>{getInput(numberInputProps)}</Col>
                </Row>
                <Row>
                    <Col span={12}>{getDatePicker()}</Col>
                    <Col span={12}>{getInput(amountInputProps)}</Col>
                </Row>
                {getInput(checkInputProps)}
            </Form>
        )
    };

    //底部提示信息
    const BottomTip = () => {
        return (
            <div className='bottom-tip-box'>
                <p>1、可查验使用增值税发票管理新系统开具的发票，包括：</p>
                <div style={{ paddingLeft: '1.1904rem' }}>
                    <p>（1）增值税专用发票</p>
                    <p>（2）增值税普通发票（含电子普通发票、卷式发票、通行费发票）</p>
                    <p>（3）机动车销售统一发票</p>
                    <p>（4）货物运输业增值税专用发票</p>
                    <p>（5）二手车销售统一发票</p>
                    <p>不在上述范围之内的发票，请按照原查验渠道进行查验。</p>
                </div>
                <p>2、可查验的时间范围：</p>
                <div style={{ paddingLeft: '1.1904rem' }}>
                    <p>（1）可查验最近1年内增值税发票管理新系统开具的发票</p>
                    <p>（2）当日开具的发票如开票方已将发票数据上传税局，则当日可查验否则最快次日查验</p>
                </div>
                <p>3、每天每张发票可在线查询次数为5次，超过次数后请于次日再进行查验操作。</p>
            </div>
        )
    };


    return (
        <Modal wrapClassName='editMessage-modify' width={isModalFullScreen ? '100vw' : '45vw'}
            maskClosable={false}
            maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
            zIndex={102}
            cancelText={'关闭'}
            style={isModalFullScreen ? {
                maxWidth: "100vw",
                top: 0,
                paddingBottom: 0,
                marginBottom: 0
            } : {
                top: '14rem'
            }}
            bodyStyle={isModalFullScreen ? {
                height: "calc(100vh - 53px)",
                overflowY: "auto",
                padding: '0'
            } : {
                // height: 'calc(100vh - 25.5rem)',
                padding: '0',
                overflow: 'hidden'
            }}
            title={null} visible={visible}
            onOk={handleSubmit}
            onCancel={handleClose}>
            <div className='body-title-box'>
                <strong>手动录入发票</strong>
                <img src={isModalFullScreen
                    ? require('../../../../../../../image/pms/LifeCycleManagement/full-screen-cancel.png')
                    : require('../../../../../../../image/pms/LifeCycleManagement/full-screen.png')} alt=''
                    onClick={() => setIsModalFullScreen(!isModalFullScreen)} />
            </div>
            <div className='upload-receipt-modal-content'>
                <FormOperate />
                <BottomTip />
            </div>
        </Modal>
    );
};
export default Form.create()(InputReceipt);