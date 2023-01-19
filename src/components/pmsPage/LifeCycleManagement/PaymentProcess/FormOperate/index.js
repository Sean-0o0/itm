import React, { useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Upload, Select, Radio, InputNumber } from 'antd';
import moment from 'moment';
const { TextArea } = Input;
const LOGIN_USER = JSON.parse(sessionStorage.getItem("user"));
const LOGIN_USER_ID = LOGIN_USER.id;
const LOGIN_USER_NAME = LOGIN_USER.name;
const LOGIN_USER_ORG_NAME = localStorage.getItem('orgName');


export default function FormOperate(props) {

    const [isSkzhOpen, setIsSkzhOpen] = useState(false);
    const { form, formData, setAddSkzhModalVisible } = props;
    const {
        sfyht, setSfyht, htje, yfkje, setSqrq,
        zhfw, setZhfw, skzh, setSkzh, dgskzh,
        // fileList, setFileList, fileUrl, setFileUrl, isFjTurnRed, setIsFjTurnRed,
        // fileName, setFileName, 
        setskzhId, setYkbSkzhId
    } = formData;
    const { getFieldDecorator, getFieldValue } = form;

    //是否有合同变化
    const onSfyhtChange = (e) => {
        setSfyht(e.target.value);
    };
    //账户范围变化
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
    //收款账户变化
    const handleSkzhChange = (v) => {
        const obj = skzh?.filter(x => x.khmc === v)[0];
        setskzhId(obj?.id);
        setYkbSkzhId(obj?.ykbid);
    };
    //申请日期变化
    const onSqrqChange = (d, ds) => {
        setSqrq(ds);
    };

    //输入框 - 灰
    const getInputDisabled = (label, value, labelCol, wrapperCol) => {
        return (
            <Col span={12}>
                <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
                    <div style={{
                        width: '100%', height: '4.7616rem', backgroundColor: '#F5F5F5', border: '0.1488rem solid #d9d9d9',
                        borderRadius: '0.5952rem', marginTop: '0.744rem', lineHeight: '4.7616rem', paddingLeft: '1.488rem', fontSize: '1.867rem'
                    }}>{value}</div>
                </Form.Item>
            </Col>
        );
    };
    //输入框
    const getInput = ({ label, labelCol, wrapperCol, dataIndex, initialValue, rules, maxLength, node }) => {
        maxLength = maxLength || 150;
        node = node || <Input maxLength={maxLength} placeholder={`请输入${label}`} />;
        return (
            <Col span={12}>
                <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
                    {getFieldDecorator(dataIndex, {
                        initialValue,
                        rules,
                    })(node)}
                </Form.Item>
            </Col>
        );
    };
    //单选框
    const getRadio = (label, value, onChange, txt1, txt2) => {
        return (
            <Col span={12}>
                <Form.Item label={label} required labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Radio.Group value={value} onChange={onChange}>
                        <Radio value={1}>{txt1}</Radio>
                        <Radio value={2}>{txt2}</Radio>
                    </Radio.Group>
                </Form.Item>
            </Col>
        );
    }
    //申请日期
    const getDatePicker = () => {
        return (
            <Col span={12}>
                <Form.Item label="申请日期" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                    {getFieldDecorator('sqrq', {
                        initialValue: moment(),
                        rules: [
                            {
                                required: true,
                                message: '申请日期不允许空值',
                            },
                        ],
                    })(<DatePicker style={{ width: '100%' }} onChange={onSqrqChange} />)}
                </Form.Item>
            </Col>
        );
    };
    //收款账户
    const getSelector = () => {
        return (
            <>
                <Col span={11}><Form.Item label="收款账户" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                    {getFieldDecorator('skzh', {
                        initialValue: '',
                        rules: [
                            {
                                required: true,
                                message: '收款账户不允许空值',
                            },
                        ],
                    })(<Select
                        style={{ width: '100%', borderRadius: '1.1904rem !important' }}
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
                        alt='' style={{ height: '2.976rem', marginLeft: '1.1904rem', marginTop: '1.488rem', cursor: 'pointer' }}
                    />
                </Col>
            </>
        );
    }
    //描述
    const getTextArea = () => {
        return (
            <Col span={24}>
                <Form.Item label="描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                    {getFieldDecorator('ms', {
                        initialValue: '',
                    })(<TextArea className='ms-textarea' placeholder='请输入描述' maxLength={1000} autoSize={{ maxRows: 6, minRows: 3 }}>
                    </TextArea>)}
                    <div className='ms-count-txt'>{String(getFieldValue('ms'))?.length}/{1000}</div>
                </Form.Item>
            </Col>
        );
    }

    //输入框入参
    const btInputProps = {
        label: '标题',
        labelCol: 6,
        wrapperCol: 18,
        dataIndex: 'bt',
        initialValue: '',
        rules: [
            {
                required: true,
                message: '标题不允许空值',
            },
        ]
    };
    const htjeInputProps = {
        label: '合同金额(CNY)',
        labelCol: 6,
        wrapperCol: 18,
        dataIndex: 'htje',
        initialValue: htje,
        rules: [
            {
                required: true,
                message: '合同金额不允许空值',
            },
        ],
        node: <InputNumber className='htje-input-number'
            max={99999999999.99} min={0} step={0.01}
            precision={2}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')} />,
    };
    const yfkjeInputProps = {
        label: '已付款金额(CNY)',
        labelCol: 9,
        wrapperCol: 15,
        dataIndex: 'yfkje',
        initialValue: yfkje,
        rules: [
            {
                required: true,
                message: '已付款金额不允许空值',
            },
        ],
        node: <InputNumber className='yfkje-input-number'
            max={99999999999.99} min={0} step={0.01}
            precision={2}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')} />,
    };
    const fjzsInputProps = {
        label: '附件张数',
        labelCol: 6,
        wrapperCol: 18,
        dataIndex: 'fjzs',
        initialValue: '',
        rules: [
            {
                required: true,
                message: '附件张数不允许空值',
            },
            {
                pattern: /^\d{0,13}$/,
                message: '只能输入整数',
            },
        ],
        maxLength: 13,
    };
    return (
        <Form style={{ padding: '0 3.5712rem' }}>
            <div className='basic-info-title'>基本信息</div>
            <Row>
                {getInputDisabled('提交人', LOGIN_USER_NAME, 6, 18)}
                {getInputDisabled('部门', LOGIN_USER_ORG_NAME, 9, 15)}
            </Row>
            <Row>
                {getInput(btInputProps)}
                {getDatePicker()}
            </Row>
            <div className='payment-info-title'>付款信息</div>
            <Row>
                {getRadio('是否有合同', sfyht, onSfyhtChange, '是', '否')}
                {getInputDisabled('法人实体', '浙商证券股份有限公司（ZSZQ）', 9, 15)}
            </Row>
            <Row>
                {getInput(htjeInputProps)}
                {getInput(yfkjeInputProps)}
            </Row>
            <Row>
                {getRadio("账户范围", zhfw, onZhfwChange, '公共账户', '个人账户')}
                {getSelector()}
            </Row>
            <Row>
                {getInput(fjzsInputProps)}
            </Row>
            <Row>
                {getTextArea()}
            </Row>
        </Form>
    )
}
