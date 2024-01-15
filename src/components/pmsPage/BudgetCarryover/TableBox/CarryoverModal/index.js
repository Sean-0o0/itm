import React, { Fragment, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Modal, Spin } from 'antd';
import moment from 'moment';
import { getIn } from 'immutable';
import { OperateBudgetCarryoverInfo } from '../../../../../services/pmsServices';
const { TextArea } = Input;

export default Form.create()(function CarryoverModal(props) {
  const { visible, setVisible, form = {}, type = 'JZ', data = {}, refresh } = props;
  // console.log('🚀 ~ file: index.js:10 ~ CarryoverModal ~  data:', data);
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const labelCol = 6;
  const wrapperCol = 18;

  useEffect(() => {
    return () => { };
  }, []);

  //输入框 - 数值型
  const getInputNumber = ({ label, labelCol, wrapperCol, dataIndex, initialValue, rules, max }) => {
    return (
      <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
        {getFieldDecorator(dataIndex, {
          initialValue,
          rules,
        })(
          <InputNumber
            style={{ width: '100%' }}
            max={max}
            min={0}
            step={0.01}
            precision={2}
            placeholder={'请输入' + label}
          // formatter={value => `value`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value.replace(/$\s?|(,*)/g, '')}
          />,
        )}
      </Form.Item>
    );
  };

  //文本域
  const getTextArea = ({
    label,
    dataIndex,
    initialValue,
    labelCol,
    wrapperCol,
    maxLength,
    rules = [],
  }) => {
    return (
      <Form.Item
        label={label}
        labelCol={{ span: labelCol }}
        wrapperCol={{ span: wrapperCol }}
        className="textarea-margin-bottom-style"
      >
        {getFieldDecorator(dataIndex, {
          initialValue,
          rules,
        })(
          <TextArea
            placeholder={'请输入' + label}
            maxLength={maxLength}
            autoSize={{ maxRows: 6, minRows: 3 }}
            allowClear
          ></TextArea>,
        )}
      </Form.Item>
    );
  };

  //提交数据
  const onOk = () => {
    validateFields(async (err, values) => {
      if (!err) {
        Modal.confirm({
          title: '提示：',
          content: `确定${type === 'BJZ' ? '不结转' : '结转'}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            setIsSpinning(true);
            const params = {
              operateType: type,
              recordId: Number(data.ID),
              budgetProject: Number(data.YSID),
              amount: String(values.jzje),
              originalAmount: type === 'TJ' ? String(data.JZJE) : undefined,
              carryoverDes: type === 'BJZ' ? values.bjzsm : values.jzsm,
            };
            // console.log('🚀 ~ file: index.js:62 ~ validateFields ~ values:', values, data, params);
            OperateBudgetCarryoverInfo(params)
              .then(res => {
                if (res.success) {
                  refresh();
                  message.success('操作成功', 1);
                  setIsSpinning(false);
                  onCancel();
                }
              })
              .catch(e => {
                console.error('🚀 ~ file: index.js:61 ~ validateFields ~ e:', e);
                message.error('操作失败', 1);
              });
          },
        });
      }
    });
  };

  //取消
  const onCancel = () => {
    setVisible(false);
    resetFields();
  };

  //弹窗参数
  const modalProps = {
    wrapClassName: 'carryover-modal',
    width: 560,
    maskClosable: false,
    style: { top: 60 },
    maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
    zIndex: 103,
    title: null,
    visible,
    onCancel,
    onOk,
    // okText: type === 'BJZ' ? '不结转' : '结转',
    okText: '确定',
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>{type === 'BJZ' ? '不结转项目' : '结转项目'}</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          {type === 'BJZ' ? (
            getTextArea({
              label: '不结转说明',
              dataIndex: 'bjzsm',
              labelCol,
              wrapperCol,
              rules: [
                {
                  required: true,
                  message: '不结转说明不允许为空',
                },
              ],
              maxLength: 600,
            })
          ) : (
            <Fragment>
              {getInputNumber({
                label: '结转金额(万元)',
                dataIndex: 'jzje',
                labelCol,
                wrapperCol,
                initialValue: Number(data.JZJE),
                rules: [
                  {
                    required: true,
                    message: '结转金额不允许为空',
                  },
                ],
                max: 999999999,
              })}
              {getTextArea({
                label: '结转说明',
                dataIndex: 'jzsm',
                labelCol,
                wrapperCol,
                initialValue: data.JZSM,
                rules: [
                  {
                    required: true,
                    message: '结转说明不允许为空',
                  },
                ],
                maxLength: 600,
              })}
            </Fragment>
          )}
        </Form>
      </Spin>
    </Modal>
  );
});
