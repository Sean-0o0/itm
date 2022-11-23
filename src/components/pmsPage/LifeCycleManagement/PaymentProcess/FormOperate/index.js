import React, { useEffect, useState } from 'react';
import { Row, Col, Popconfirm, Modal, Form, Input, Table, DatePicker, message, Upload, Button, Icon, Select, Pagination, Spin, Radio } from 'antd';
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";
import moment from 'moment';
const { TextArea } = Input;
const LOGIN_USER = JSON.parse(sessionStorage.getItem("user"));
const LOGIN_USER_ID = LOGIN_USER.id;
const LOGIN_USER_NAME = LOGIN_USER.name;


export default function FormOperate(props) {

    const [isSkzhOpen, setIsSkzhOpen] = useState(false);

    const { form, formData, setAddSkzhModalVisible } = props;
    const {
        bt, setBt, sfyht, setSfyht, htje, setHtje, yfkje, setYfkje, sqrq, setSqrq,
        fjzs, setFjzs, zhfw, setZhfw, skzh, setSkzh, ms, setMs, dgskzh, setDgskzh,
        fileList, setFileList, fileUrl, setFileUrl, isFjTurnRed, setIsFjTurnRed,
        fileName, setFileName, bmName
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
    const handleSkzhChange = () => {
    };
    const onSqrqChange = () => {

    };
    //输入框 - 灰
    const getInputDisabled = (label, value, labelCol, wrapperCol) => {
        return (
            <Col span={12}>
                <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
                    <div style={{
                        width: '100%', height: '32px', backgroundColor: '#F5F5F5', border: '1px solid #d9d9d9',
                        borderRadius: '4px', marginTop: '5px', lineHeight: '32px', paddingLeft: '10px', fontSize: '1.867rem'
                    }}>{value}</div>
                </Form.Item>
            </Col>
        );
    };
    //附件
    const getFjUpload = () => {
        return (
            <Col span={12}>
                <Form.Item label="附件" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}
                    required
                    help={isFjTurnRed ? '附件不允许空值' : ''}
                    validateStatus={isFjTurnRed ? 'error' : 'success'}
                >
                    <Upload
                        showUploadList={{
                            // showDownloadIcon: true,
                            showRemoveIcon: true,
                            showPreviewIcon: true,
                        }}
                        onChange={(info) => {
                            let list = [...info.fileList];
                            list = list.slice(-1);
                            setFileList(p => [...list]);
                            if (list.length === 0) {
                                setIsFjTurnRed(true);
                            } else {
                                setIsFjTurnRed(false);
                            }
                        }}
                        beforeUpload={(file, fileList) => {
                            let reader = new FileReader(); //实例化文件读取对象
                            reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                            reader.onload = (e) => { //文件读取成功完成时触发
                                let urlArr = e.target.result.split(',');
                                setFileUrl(urlArr[1]);
                                setFileName(file.name);
                            }
                        }}
                        accept={'.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                        fileList={[...fileList]}>
                        <Button type="dashed">
                            <Icon type="upload" />点击上传
                        </Button>
                    </Upload>
                </Form.Item>
            </Col>
        );
    };
    //输入框
    const getInput = ({ label, labelCol, wrapperCol, dataIndex, initialValue, rules }) => {
        return (
            <Col span={12}>
                <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
                    {getFieldDecorator(dataIndex, {
                        initialValue,
                        rules,
                    })(<Input placeholder={`请输入${label}`} />)}
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
                        initialValue: sqrq ? moment(sqrq) : moment(),
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
                        alt='' style={{ height: '20px', marginLeft: '8px', marginTop: '10px', cursor: 'pointer' }}
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
                    <TextArea placeholder='请输入描述' value={ms} maxLength={1000} autoSize={{ maxRows: 6, minRows: 3 }}>
                    </TextArea>
                    <span className='ms-count-txt'>{ms?.length}/{1000}</span>
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
        initialValue: bt,
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
        ]
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
        ]
    };
    const fjzsInputProps = {
        label: '附件张数',
        labelCol: 6,
        wrapperCol: 18,
        dataIndex: 'fjzs',
        initialValue: fjzs,
        rules: [
            {
                required: true,
                message: '附件张数不允许空值',
            },
        ]
    };
    return (
        <Form style={{ padding: '0 24px' }}>
            <div className='basic-info-title'>基本信息</div>
            <Row>
                {getInputDisabled('提交人', LOGIN_USER_NAME, 6, 18)}
                {getInputDisabled('部门', bmName, 9, 15)}
            </Row>
            <Row>
                {getInput(btInputProps)}
                {getDatePicker()}
            </Row>
            <div className='payment-info-title'>付款信息</div>
            <Row>
                {getRadio('是否有合同', sfyht, onSfyhtChange, '是', '否')}
                {getInputDisabled('法人实体', '红红火火恍恍惚惚', 9, 15)}
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
                {getFjUpload()}
            </Row>
            <Row>
                {getTextArea()}
            </Row>
        </Form>
    )
}
