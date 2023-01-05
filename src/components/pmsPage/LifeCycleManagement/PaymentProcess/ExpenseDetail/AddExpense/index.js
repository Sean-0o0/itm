import React, { useEffect, useRef, useState } from 'react';
import {
    Row, Col, Form, Input, DatePicker,
    Upload, Select, Radio, Menu, InputNumber,
    Drawer, Button, Icon, Dropdown
} from 'antd';
import moment from 'moment';
import InputReceipt from './InputReceipt';
import UploadReceipt from './UploadReceipt';
const { TextArea } = Input;

const AddExpense = (props) => {
    //弹窗全屏
    const [isModalFullScreen, setIsModalFullScreen] = useState(false);
    const [isSelectorOpen, setIsSelectorOpenn] = useState(false);
    const [isTreeSelectorOpen, setIsTreeSelectorOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        expenseType: 0,
        receiptType: 0,
        isFinalPay: 1,
        amount: 0,
        consumeReason: '',
        //附件上传
        receiptFileUrl: '',
        receiptFileName: '',
        receiptFileList: [],
        receiptIsTurnRed: false,
        OAProcessFileUrl: '',
        OAProcessFileName: '',
        OAProcessFileList: [],
        OAProcessTurnRed: false,
        contractFileUrl: '',
        contractFileName: '',
        contractFileList: [],
        contractIsTurnRed: false,
        checkFileUrl: '',
        checkFileName: '',
        checkFileList: [],
        checkIsTurnRed: false,
    });
    //是否尾款
    const [isFinalPay, setIsFinalPay] = useState(2);
    //新增发票
    const [inputReceiptVisible, setInputReceiptVisible] = useState(false);
    const [uploadReceiptVisible, setUploadReceiptVisible] = useState(false);
    //附件上传
    // const [receiptFileUrl, setReceiptFileUrl] = useState('');
    // const [receiptFileName, setReceiptFileName] = useState('');
    // const [receiptFileList, setReceiptFileList] = useState([]);
    // const [receiptIsTurnRed, setReceiptIsTurnRed] = useState(false);
    // const [OAProcessFileUrl, setOAProcessFileUrl] = useState('');
    // const [OAProcessFileName, setOAProcessFileName] = useState('');
    // const [OAProcessFileList, setOAProcessFileList] = useState([]);
    // const [OAProcessIsTurnRed, setOAProcessIsTurnRed] = useState(false);
    // const [contractFileUrl, setContractFileUrl] = useState('');
    // const [contractFileName, setContractFileName] = useState('');
    // const [contractFileList, setContractFileList] = useState([]);
    // const [contractIsTurnRed, setContractIsTurnRed] = useState(false);
    // const [checkFileUrl, setCheckFileUrl] = useState('');
    // const [checkFileName, setCheckFileName] = useState('');
    // const [checkFileList, setCheckFileList] = useState([]);
    // const [checkIsTurnRed, setCheckIsTurnRed] = useState(false);
    const { visible, setVisible, form, userykbid } = props;
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
    const handleDateChange = () => {

    };

    const handleSelectorChange = () => {

    };
    const handleTreeSelectorChange = () => {

    };
    //日期
    const getDatePicker = () => {
        return (
            <Col span={12}>
                <Form.Item label="日期" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
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
    //描述
    const getTextArea = () => {
        return (
            <Col span={24}>
                <Form.Item label="消费事由" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                    {getFieldDecorator('csmReason', {
                        initialValue: '',
                    })(<TextArea className='consumeReason-textarea' placeholder='请输入消费事由' maxLength={1000} autoSize={{ maxRows: 6, minRows: 3 }}>
                    </TextArea>)}
                    <div className='consumeReason-count-txt'>{String(getFieldValue('csmReason'))?.length}/{1000}</div>
                </Form.Item>
            </Col>
        );
    }
    //单选框
    const getRadio = (label, value, onChange, txt1, txt2) => {
        return (
            <Col span={12}>
                <Form.Item label={label} required labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                    <Radio.Group value={value} onChange={onChange}>
                        <Radio value={1}>{txt1}</Radio>
                        <Radio value={2}>{txt2}</Radio>
                    </Radio.Group>
                </Form.Item>
            </Col>
        );
    }
    //普通下拉框
    const getSelector = () => {
        return (
            <>
                <Col span={12}><Form.Item label="费用类型" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                    {getFieldDecorator('skzh', {
                        initialValue: '',
                        rules: [
                            {
                                required: true,
                                message: '费用类型不允许空值',
                            },
                        ],
                    })(<Select
                        style={{ width: '100%', borderRadius: '8px !important' }}
                        showSearch
                        placeholder="请选择费用类型"
                        optionFilterProp="children"
                        onChange={handleSelectorChange}
                        filterOption={(input, option) =>
                            (option.props.children)?.toLowerCase().includes(input.toLowerCase())
                        }
                        open={isSelectorOpen}
                        onDropdownVisibleChange={(visible) => setIsSelectorOpen(visible)}
                    >
                        {
                            // skzh?.map((item = {}, ind) => {
                            //     return <Select.Option key={ind} value={item.khmc}>
                            //         {item.khmc}
                            //         {isSelectorOpenn && <div style={{ fontSize: '0.6em' }}>{item.yhkh}</div>}
                            //     </Select.Option>
                            // })
                        }
                    </Select>)}
                </Form.Item> </Col>
            </>
        );
    }
    //树形下拉框
    const getTreeSelector = () => {
        return (
            <>
                <Col span={12}><Form.Item label="发票类型" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                    {getFieldDecorator('skzh', {
                        initialValue: '',
                        rules: [
                            {
                                required: true,
                                message: '发票类型不允许空值',
                            },
                        ],
                    })(<Select
                        style={{ width: '100%', borderRadius: '8px !important' }}
                        showSearch
                        placeholder="请选择发票类型"
                        optionFilterProp="children"
                        onChange={handleSelectorChange}
                        filterOption={(input, option) =>
                            (option.props.children)?.toLowerCase().includes(input.toLowerCase())
                        }
                        open={isSelectorOpen}
                        onDropdownVisibleChange={(visible) => setIsSelectorOpen(visible)}
                    >
                        {
                            // skzh?.map((item = {}, ind) => {
                            //     return <Select.Option key={ind} value={item.khmc}>
                            //         {item.khmc}
                            //         {isSelectorOpenn && <div style={{ fontSize: '0.6em' }}>{item.yhkh}</div>}
                            //     </Select.Option>
                            // })
                        }
                    </Select>)}
                </Form.Item> </Col>
            </>
        );
    };
    //附件
    const getUpload = ({ label, formData, dataIndex, setFormData }) => {
        return (
            <Col span={12}>
                <Form.Item label={label} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}
                    required
                    help={formData[dataIndex + 'IsTurnRed'] ? `${label}不允许空值` : ''}
                    validateStatus={formData[dataIndex + 'IsTurnRed'] ? 'error' : 'success'}
                >
                    <Upload
                        showUploadList={{
                            showRemoveIcon: true,
                            showPreviewIcon: true,
                        }}
                        onChange={(info) => {
                            let list = [...info.fileList];
                            setFormData((p) => {
                                p[dataIndex + 'FileList'] = [...list];
                                return { ...p };
                            });
                            if (list.length === 0) {
                                setFormData((p) => {
                                    p[dataIndex + 'IsTurnRed'] = true;
                                    return { ...p };
                                });
                            } else {
                                setFormData((p) => {
                                    p[dataIndex + 'IsTurnRed'] = false;
                                    return { ...p };
                                });
                            }
                        }}
                        beforeUpload={(file, fileList) => {
                            let reader = new FileReader(); //实例化文件读取对象
                            reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                            reader.onload = (e) => { //文件读取成功完成时触发
                                let urlArr = e.target.result.split(',');
                                setFormData((p) => {
                                    p[dataIndex + 'FileUrl'] = urlArr[1];
                                    return { ...p };
                                });
                                setFormData((p) => {
                                    p[dataIndex + 'FileName'] = file.name;
                                    return { ...p };
                                });
                            }
                        }}
                        accept={'.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                        fileList={[...formData[dataIndex + 'FileList']]}>
                        <Button type="dashed">
                            <Icon type="upload" />点击上传
                        </Button>
                    </Upload>
                </Form.Item>
            </Col>
        );
    };
    //新增发票
    const getRecepit = () => {
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
        return (
            <Col span={12}>
                <Form.Item label='发票' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}
                    required
                    help={formData.receiptIsTurnRed ? `${label}不允许空值` : ''}
                    validateStatus={formData.receiptIsTurnRed ? 'error' : 'success'}
                >
                    <Dropdown overlay={menu}>
                        <Button>
                            <Icon type="upload" />新增发票
                        </Button>
                    </Dropdown>
                </Form.Item>
            </Col>
        );
    };
    //发票展示
    const getRecepitList = () => {
        const getItem = () => {
            return (
                <div className='recepit-item'>
                    <div className='recepit-hover-icon'><Icon type="edit" /><Icon type="delete" /></div>
                    <div className='recepit-info'>
                        <div className='item-top-left'>
                            <div className='top-left-icon'><Icon type='file-pdf' /></div>
                            <div className='top-left-txt'>
                                <div className='recepit-name'>票据1</div>
                                <div className='recepit-time'>2023年01月04日</div>
                            </div>
                        </div>
                        <div className='item-top-right'>
                            <div>电子发票文件</div>
                            <div>其他票据</div>
                        </div></div>
                    <div className='recepit-amount-sum'>
                        总金额<span>￥ 73.29</span>
                    </div>
                    <div className='recepit-tax-rate'>
                        税率<span>0%</span>
                    </div>
                    <div className='recepit-deductible-tax'>
                        可抵扣税额<span>￥ 0.00</span>
                    </div>
                </div>
            );
        }
        return (
            <div className='addexpense-recepit-list'>
                {getItem()}
                {getItem()}
                {getItem()}
                {getItem()}
                {getItem()}
                {getItem()}
            </div>
        );
    }
    //表单
    const FormOperate = () => {
        return (
            <Form>
                <Row>
                    {getDatePicker()}
                    {getTreeSelector()}
                </Row>
                <Row>
                    {getSelector()}
                    {getRadio("是否尾款", isFinalPay, e => setIsFinalPay(e.target.value), '是', '否')}
                </Row>
                <Row>
                    {getRecepit()}
                </Row>
                {getRecepitList()}
                <Row>
                    {getInput(amountInputProps)}
                </Row>
                <Row>
                    {getTextArea()}
                </Row>
                <Row>
                    {getUpload(OAProcessProps)}
                    {getUpload(contractProps)}
                </Row>
                {isFinalPay === 1 && <Row>{getUpload(checkProps)}</Row>}
            </Form>
        )
    };
    //输入框入参
    const amountInputProps = {
        label: '金额（本位币CN）',
        labelCol: 10,
        wrapperCol: 14,
        dataIndex: 'htje',
        initialValue: 1,
        rules: [
            {
                required: true,
                message: '金额不允许空值',
            },
        ],
        node: <InputNumber style={{ width: '100%' }}
            max={99999999999.99} min={0} step={0.01}
            precision={2}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')} />,
    };
    //发票上传入参
    const receiptProps = {
        label: '发票',
        dataIndex: 'receipt',
        formData,
        setFormData
    };
    //OA流程附件上传入参
    const OAProcessProps = {
        label: 'OA流程附件',
        dataIndex: 'OAProcess',
        formData,
        setFormData
    };
    //合同复印件上传入参
    const contractProps = {
        label: '合同复印件',
        dataIndex: 'contract',
        formData,
        setFormData
    };
    //验收复印件上传入参
    const checkProps = {
        label: '验收复印件',
        dataIndex: 'check',
        formData,
        setFormData
    };
    return (
        <>
            <Drawer
                title="新增费用明细"
                width={720}
                onClose={() => setVisible(false)}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
                maskClosable={false}
                zIndex={101}
                maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
            >
                <InputReceipt visible={inputReceiptVisible} setVisible={setInputReceiptVisible} />
                <UploadReceipt visible={uploadReceiptVisible} setVisible={setUploadReceiptVisible} userykbid={userykbid} />
                <FormOperate />
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={handleClose} style={{ marginRight: 8 }}>
                        关闭
                    </Button>
                    <Button onClick={handleSubmit} type="primary">
                        确定
                    </Button>
                </div>
            </Drawer>
        </>

    )
};
export default Form.create()(AddExpense);
