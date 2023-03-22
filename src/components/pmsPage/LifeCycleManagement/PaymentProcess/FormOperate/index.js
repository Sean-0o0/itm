import React, { useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Upload, Select, Radio, InputNumber } from 'antd';
import moment from 'moment';
const { TextArea } = Input;

export default function FormOperate(props) {
  const [isSkzhOpen, setIsSkzhOpen] = useState(false);
  const { form, formData, setAddSkzhModalVisible } = props;
  const {
    sfyht,
    setSfyht,
    htje,
    yfkje,
    setSqrq,
    zhfw,
    setZhfw,
    skzh,
    setSkzh,
    dgskzh,
    // fileList, setFileList, fileUrl, setFileUrl, isFjTurnRed, setIsFjTurnRed,
    // fileName, setFileName,
    setskzhId,
    setYkbSkzhId,
  } = formData;
  const { getFieldDecorator, getFieldValue } = form;

  //是否有合同变化
  const onSfyhtChange = e => {
    setSfyht(e.target.value);
  };
  //账户范围变化
  const onZhfwChange = e => {
    let rec = [...dgskzh];
    let tempArr = rec.filter(x => {
      let arr = x.ssr?.split(';');
      return arr?.includes(String(LOGIN_USER_ID));
    });
    let finalArr = Number(e.target.value) === 1 ? [...rec] : [...tempArr];
    setZhfw(e.target.value);
    setSkzh(p => [...finalArr]);
  };
  //收款账户变化
  const handleSkzhChange = v => {
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
          <div
            style={{
              width: '100%',
              height: '32px',
              backgroundColor: '#F5F5F5',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginTop: '5px',
              lineHeight: '32px',
              paddingLeft: '10px',
              fontSize: '14px',
            }}
          >
            {value}
          </div>
        </Form.Item>
      </Col>
    );
  };
  //输入框
  const getInput = ({
    label,
    labelCol,
    wrapperCol,
    dataIndex,
    initialValue,
    rules,
    maxLength,
    node,
  }) => {
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
        <Form.Item label={label} required labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Radio.Group value={value} onChange={onChange}>
            <Radio value={1}>{txt1}</Radio>
            <Radio value={2}>{txt2}</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
    );
  };
  //申请日期
  const getDatePicker = () => {
    return (
      <Col span={12}>
        <Form.Item label="申请日期" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
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
        <Col span={24} style={{ position: 'relative' }}>
          <Form.Item label="收款账户" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('skzh', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '收款账户不允许空值',
                },
              ],
            })(
              <Select
                style={{ width: '100%', borderRadius: '8px !important' }}
                className="skzh-box"
                showSearch
                placeholder="请选择收款账户"
                onChange={handleSkzhChange}
                open={isSkzhOpen}
                onDropdownVisibleChange={visible => setIsSkzhOpen(visible)}
              >
                {skzh?.map((item = {}, ind) => {
                  return (
                    <Select.Option key={item.id} value={item.khmc}>
                      {item.khmc}
                      {isSkzhOpen && <div style={{ fontSize: '0.6em' }}>{item.yhkh}</div>}
                    </Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <div
            style={{
              height: '20px',
              width: '1px',
              backgroundColor: '#c7c7c7',
              marginLeft: '8px',
              marginTop: '10px',
              cursor: 'pointer',
              position: 'absolute',
              top: '0',
              right: '40px',
            }}
          ></div>
          <i
            className="iconfont circle-add"
            onClick={() => setAddSkzhModalVisible(true)}
            style={{
              marginTop: '6px',
              cursor: 'pointer',
              position: 'absolute',
              top: '0',
              right: '12px',
              color: '#c7c7c7',
              fontSize: '20px',
            }}
          />
          {/* <img
            src={require('../../../../../image/pms/LifeCycleManagement/add.png')}
            onClick={() => setAddSkzhModalVisible(true)}
            alt=""
            style={{
              height: '20px',
              marginLeft: '8px',
              marginTop: '10px',
              cursor: 'pointer',
              position: 'absolute',
              top: '0',
              right: '12px',
            }}
          /> */}
        </Col>
      </>
    );
  };
  //描述
  const getTextArea = () => {
    return (
      <Col span={24}>
        <Form.Item label="描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('ms', {
            initialValue: '',
          })(
            <TextArea
              className="ms-textarea"
              placeholder="请输入描述"
              maxLength={1000}
              autoSize={{ maxRows: 6, minRows: 3 }}
            ></TextArea>,
          )}
          {/* <div className="ms-count-txt">
            {String(getFieldValue('ms'))?.length}/{1000}
          </div> */}
        </Form.Item>
      </Col>
    );
  };

  //输入框入参
  const btInputProps = {
    label: '标题',
    labelCol: 8,
    wrapperCol: 16,
    dataIndex: 'bt',
    initialValue: '',
    rules: [
      {
        required: true,
        message: '标题不允许空值',
      },
    ],
  };
  const htjeInputProps = {
    label: '合同金额(CNY)',
    labelCol: 8,
    wrapperCol: 16,
    dataIndex: 'htje',
    initialValue: htje,
    rules: [
      {
        required: true,
        message: '合同金额不允许空值',
      },
    ],
    node: (
      <InputNumber
        className="htje-input-number"
        max={99999999999.99}
        min={0}
        step={0.01}
        precision={2}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
    ),
  };
  const yfkjeInputProps = {
    label: '已付款金额(CNY)',
    labelCol: 8,
    wrapperCol: 16,
    dataIndex: 'yfkje',
    initialValue: yfkje,
    rules: [
      {
        required: true,
        message: '已付款金额不允许空值',
      },
    ],
    node: (
      <InputNumber
        className="yfkje-input-number"
        max={99999999999.99}
        min={0}
        step={0.01}
        precision={2}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
      />
    ),
  };
  const fjzsInputProps = {
    label: '附件张数',
    labelCol: 8,
    wrapperCol: 16,
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
  const LOGIN_USER = JSON.parse(sessionStorage.getItem('user'));
  const LOGIN_USER_ID = LOGIN_USER.id;
  const LOGIN_USER_NAME = LOGIN_USER.name;
  const LOGIN_USER_ORG_NAME = localStorage.getItem('orgName');
  return (
    <Form style={{ padding: '0 24px' }}>
      <div className="basic-info-title">基本信息</div>
      <Row>
        {getInputDisabled('提交人', LOGIN_USER_NAME, 8, 16)}
        {getInputDisabled('部门', LOGIN_USER_ORG_NAME, 8, 16)}
      </Row>
      <Row>
        {getInput(btInputProps)}
        {getDatePicker()}
      </Row>
      <div className="payment-info-title">付款信息</div>
      <Row>
        {getRadio('是否有合同', sfyht, onSfyhtChange, '是', '否')}
        {getInputDisabled('法人实体', '浙商证券股份有限公司（ZSZQ）', 8, 16)}
      </Row>
      <Row>
        {getInput(htjeInputProps)}
        {getInput(fjzsInputProps)}
      </Row>
      <Row>
        {getInput(yfkjeInputProps)}
        {getRadio('账户范围', zhfw, onZhfwChange, '公共账户', '个人账户')}
      </Row>
      <Row>{getSelector()}</Row>
      <Row>{getTextArea()}</Row>
    </Form>
  );
}
