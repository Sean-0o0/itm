import React, { useEffect, useState } from 'react';
import { Row, Col, Popconfirm, Modal, Form, Input, Table, DatePicker, message, Upload, Button, Icon, Select, Pagination, Spin, Radio } from 'antd';
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";
const { TextArea } = Input;
const LOGIN_USER_ID = JSON.parse(sessionStorage.getItem("user")).id;

export default function FormOperate(props) {

    const [isSkzhOpen, setIsSkzhOpen] = useState(false);

    const { form, formData, setAddSkzhModalVisible } = props;
    const {
        bt, setBt, sfyht, setSfyht, htje, setHtje, yfkje, setYfkje, sqrq, setSqrq,
        fjzs, setFjzs, zhfw, setZhfw, skzh, setSkzh, ms, setMs, dgskzh, setDgskzh
    } = formData;
    const { getFieldDecorator } = form;

    const onSfyhtChange = (e) => {
        setSfyht(e.target.value);
    };
    const onZhfwChange = (e) => {
        let rec = [...dgskzh];
        let tempArr = rec.filter(x => {
            let arr = x.ssr?.split(';');
            return arr?.includes(String(LOGIN_USER_ID));
        })
        let finalArr = Number(e.target.value) === 1 ? [...rec] : [...tempArr];
        setZhfw(e.target.value);
        setSkzh(p => [...finalArr]);
    };
    const getInputDisabled = (label, value) => {
        return (
            <Form.Item label={label} labelCol={{ span: 6}} wrapperCol={{ span: 18 }}>
                <div style={{
                    width: '100%', height: '32px', backgroundColor: '#F5F5F5', border: '1px solid #d9d9d9',
                    borderRadius: '4px', marginTop: '5px', lineHeight: '32px', paddingLeft: '10px', fontSize: '1.867rem'
                }}>{value}</div>
            </Form.Item>
        )
    }
    const handleSkzhChange = () => {

    }
    return (
        <Form style={{ padding: '0 24px' }}>
            <Row>
                <Col span={12}>
                    <Form.Item label="标题" labelCol={{ span: 6}} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('bt', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '标题不允许空值',
                                },
                                // {
                                // pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
                                // message: '最多不超过13位数字且小数点后数字不超过2位'
                                // },
                            ],
                        })(<Input placeholder="请输入标题" />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    {getInputDisabled('法人实体', '红红火火恍恍惚惚')}
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    {getInputDisabled('提交人', '红红火火恍恍惚惚')}
                </Col>
                <Col span={12}>
                    {getInputDisabled('部门', '红红火火恍恍惚惚')}
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item label="合同金额(CNY)" labelCol={{ span: 9}} wrapperCol={{ span: 15 }}>
                        {getFieldDecorator('htje', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '合同金额不允许空值',
                                },
                                // {
                                // pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
                                // message: '最多不超过13位数字且小数点后数字不超过2位'
                                // },
                            ],
                        })(<Input placeholder="请输入合同金额" />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="已付款金额(CNY)" labelCol={{ span: 9}} wrapperCol={{ span: 15 }}>
                        {getFieldDecorator('yfkje', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '已付款金额不允许空值',
                                },
                                // {
                                // pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
                                // message: '最多不超过13位数字且小数点后数字不超过2位'
                                // },
                            ],
                        })(<Input placeholder="请输入已付款金额" />)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item label="是否有合同" required labelCol={{ span: 6}} wrapperCol={{ span: 18 }}>
                        <Radio.Group value={formData?.sfyht} onChange={onSfyhtChange}>
                            <Radio value={1}>是</Radio>
                            <Radio value={2}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="申请日期" labelCol={{ span: 9}} wrapperCol={{ span: 15 }}>
                        {getFieldDecorator('yfkje', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '已付款金额不允许空值',
                                },
                                // {
                                // pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
                                // message: '最多不超过13位数字且小数点后数字不超过2位'
                                // },
                            ],
                        })(<Input placeholder="请输入已付款金额" />)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item label="账户范围" required labelCol={{ span: 6}} wrapperCol={{ span: 18 }}>
                        <Radio.Group value={formData?.zhfw} onChange={onZhfwChange}>
                            <Radio value={1}>公共账户</Radio>
                            <Radio value={2}>个人账户</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={11}><Form.Item label="收款账户" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                    {getFieldDecorator('skzh', {
                        initialValue: '',
                        rules: [
                            {
                                required: true,
                                message: '收款账户不允许空值',
                            },
                        ],
                    })(<Select
                        style={{ width: '100%', borderRadius: '8px !important' }}
                        showSearch
                        placeholder="请选择收款账户"
                        optionFilterProp="children"
                        onChange={handleSkzhChange}
                        filterOption={(input, option) =>
                            (option.props.children)?.toLowerCase().includes(input.toLowerCase())
                        }
                        open={isSkzhOpen}
                        onDropdownVisibleChange={(visible) => setIsSkzhOpen(visible)}
                    >
                        {
                            skzh?.map((item = {}, ind) => {
                                return <Select.Option key={ind} value={item.khmc}>
                                    {item.khmc}
                                    {isSkzhOpen && <div style={{ fontSize: '0.6em' }}>{item.yhkh}</div>}
                                </Select.Option>
                            })
                        }
                    </Select>)}
                </Form.Item> </Col>
                <Col span={1}>
                    <img src={require('../../../../../image/pms/LifeCycleManagement/add.png')}
                        onClick={() => setAddSkzhModalVisible(true)}
                        alt='' style={{ height: '20px', marginLeft: '7px', marginTop: '10px', cursor: 'pointer' }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item label="附件张数" labelCol={{ span: 6}} wrapperCol={{ span: 18 }}>
                        {getFieldDecorator('yfkje', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '已付款金额不允许空值',
                                },
                            ],
                        })(<Input placeholder="请输入已付款金额" />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="附件" labelCol={{ span: 9}} wrapperCol={{ span: 15 }}>
                        {getFieldDecorator('yfkje', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '已付款金额不允许空值',
                                },
                            ],
                        })(<Input placeholder="请输入已付款金额" />)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item label="描述" labelCol={{ span: 6 }} wrapperCol={{ span: 21 }}>
                        <TextArea placeholder='请输入描述' maxLength={1000} autoSize={{ maxRows: 6, minRows: 3 }} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
