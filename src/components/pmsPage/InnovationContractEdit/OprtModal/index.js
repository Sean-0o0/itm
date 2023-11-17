import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Spin } from 'antd';
import Decimal from 'decimal.js';
const { TextArea } = Input;

export default Form.create()(function OprtModal(props) {
  const { visible, setVisible, form = {}, dataProps = {}, funcProps = {} } = props;
  const { oprtModalData = {}, xc_cat_1 = [], xc_cat_2 = [], sltData = {}, glxm } = dataProps;
  const { data = {}, type = 'ADD' } = oprtModalData;
  const { setTableData, scrolltoBottom } = funcProps;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields, setFieldsValue } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const labelCol = 6;
  const wrapperCol = 18;

  useEffect(() => {
    return () => {};
  }, []);

  //输入框 - 数值型
  const getInputNumber = ({
    label,
    labelCol,
    wrapperCol,
    dataIndex,
    initialValue,
    max,
    step = 0.01,
    precision = 2,
    unit = '',
    onChange = () => {},
  }) => {
    return (
      <Col span={12}>
        <Form.Item
          label={label + unit}
          labelCol={{ span: labelCol }}
          wrapperCol={{ span: wrapperCol }}
        >
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <InputNumber
              style={{ width: '100%' }}
              max={max}
              min={0}
              step={step}
              onChange={onChange}
              precision={precision}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // parser={value => value.replace(/$\s?|(,*)/g, '')}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  //单选普通下拉框
  const getSingleSelector = ({
    label,
    dataIndex,
    initialValue,
    labelCol,
    wrapperCol,
    sltArr = [],
    titleField,
    valueField,
  }) => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <Select placeholder="请选择" optionFilterProp="children" showSearch allowClear>
              {sltArr.map(x => (
                <Select.Option key={x[valueField]} value={Number(x[valueField])}>
                  {x[titleField]}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
    );
  };

  //输入框
  const getInput = (label, dataIndex, initialValue, labelCol, wrapperCol, maxLength = 100) => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <Input
              placeholder={'请输入' + label}
              allowCear
              style={{ width: '100%' }}
              maxLength={maxLength}
            />,
          )}
        </Form.Item>
      </Col>
    );
  };

  //文本域
  const getTextArea = ({ label, dataIndex, initialValue, labelCol, wrapperCol, maxLength }) => {
    return (
      <Col span={24}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          {getFieldDecorator(dataIndex, {
            initialValue,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <TextArea
              placeholder={'请输入' + label}
              maxLength={maxLength}
              autoSize={{ maxRows: 6, minRows: 3 }}
              allowCear
            ></TextArea>,
          )}
        </Form.Item>
      </Col>
    );
  };

  //数量变化
  const onSLChange = v => {
    if (
      !['', null, undefined].includes(v) &&
      !['', null, undefined].includes(getFieldValue('SL')) &&
      !['', null, undefined].includes(getFieldValue('DJ'))
    ) {
      setFieldsValue({
        ZJE: Decimal(v).times(getFieldValue('DJ')),
      });
    }
  };

  //单价变化
  const onDJChange = v => {
    if (
      !['', null, undefined].includes(v) &&
      !['', null, undefined].includes(getFieldValue('SL')) &&
      !['', null, undefined].includes(getFieldValue('DJ'))
    ) {
      setFieldsValue({
        ZJE: Decimal(v).times(getFieldValue('SL')),
      });
    }
  };

  //判空
  const getValue = (v, type = 'number') => {
    if (['', null, undefined].includes(v)) return undefined;
    if (type === 'number') return Number(v);
    return String(v);
  };

  //提交数据
  const onOk = () => {
    validateFields((err, values) => {
      if (!err) {
        // console.log('🚀 ~ validateFields ~ values:', values);
        if (type === 'ADD') {
          setTableData(p => [...p, { ...values, ID: new Date().getTime(), CZLX: type }]);
          setTimeout(() => {
            scrolltoBottom();
          }, 200);
        } else {
          setTableData(p => {
            const arr = [...p];
            const index = p.findIndex(x => x.ID === data.ID);
            if (index !== -1) {
              arr.splice(index, 1, { ...values, ID: data.ID, CZLX: type });
            }
            return [...arr];
          });
        }
        onCancel();
      }
    });
  };

  //取消
  const onCancel = () => {
    resetFields();
    setVisible(false);
  };

  //弹窗参数
  const modalProps = {
    wrapClassName: 'innovation-contract-edit-oprt-modal',
    width: 800,
    maskClosable: false,
    style: { top: 10 },
    maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
    zIndex: 103,
    title: null,
    visible,
    onCancel,
    onOk,
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>附属信息新增</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Row>
            {getSingleSelector({
              label: '关联项目',
              dataIndex: 'GLXM',
              initialValue: data.GLXM || glxm,
              labelCol,
              wrapperCol,
              sltArr: sltData.glxm,
              titleField: 'XMMC',
              valueField: 'XMID',
            })}
            {getSingleSelector({
              label: '大类',
              dataIndex: 'XCDL',
              initialValue: getValue(data.XCDL),
              labelCol,
              wrapperCol,
              sltArr: xc_cat_1,
              titleField: 'note',
              valueField: 'ibm',
            })}
          </Row>
          <Row>
            {getInputNumber({
              label: '数量',
              labelCol,
              wrapperCol,
              dataIndex: 'SL',
              initialValue: getValue(data.SL),
              max: 9999999999,
              step: 1,
              precision: 0,
              onChange: onSLChange,
            })}
            {getSingleSelector({
              label: '小类',
              dataIndex: 'XCXL',
              initialValue: getValue(data.XCXL),
              labelCol,
              wrapperCol,
              sltArr: xc_cat_2,
              titleField: 'note',
              valueField: 'ibm',
            })}
          </Row>
          <Row>
            {getInputNumber({
              label: '单价',
              unit: '(元)',
              labelCol,
              wrapperCol,
              dataIndex: 'DJ',
              initialValue: getValue(data.DJ),
              max: 9999999999,
              onChange: onDJChange,
            })}
            {getInput('单位', 'DW', data.DW, labelCol, wrapperCol, 100)}
          </Row>
          <Row>
            {getInputNumber({
              label: '总金额',
              unit: '(元)',
              labelCol,
              wrapperCol,
              dataIndex: 'ZJE',
              initialValue: getValue(data.ZJE),
              max: 9999999999,
            })}
            {getInput('产品名称', 'CPMC', data.CPMC, labelCol, wrapperCol, 300)}
          </Row>
          <Row>
            {getSingleSelector({
              label: '是否信创',
              dataIndex: 'SFXC',
              initialValue: data.SFXC,
              labelCol,
              wrapperCol,
              sltArr: [
                { note: '是', ibm: 1 },
                { note: '否', ibm: 2 },
              ],
              titleField: 'note',
              valueField: 'ibm',
            })}
            {getInput('产品型号', 'CPXH', data.CPXH, labelCol, wrapperCol, 300)}
          </Row>
          <Row>
            {getTextArea({
              label: '配置详情',
              dataIndex: 'PZXQ',
              initialValue: data.PZXQ,
              labelCol: labelCol / 2,
              wrapperCol: 24 - labelCol / 2,
              maxLength: 600,
            })}
          </Row>
          <Row>{getInput('生产厂商', 'SCCS', data.SCCS, labelCol, wrapperCol, 300)}</Row>
        </Form>
      </Spin>
    </Modal>
  );
});
