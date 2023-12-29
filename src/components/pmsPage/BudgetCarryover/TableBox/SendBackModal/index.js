import React, { Fragment, useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Spin } from 'antd';
import {
  OperateBudgetCarryoverInfo,
  OperateCapitalBeginYearBudgetInfo,
} from '../../../../../services/pmsServices';
const { TextArea } = Input;

export default Form.create()(function SendBackModal(props) {
  const {
    visible,
    setVisible,
    form = {},
    data = {},
    budgetId = -1,
    refresh,
    fromBudget = false, //true时是外边表格的退回，false时是抽屉里的退回
  } = props;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const labelCol = 6;
  const wrapperCol = 18;

  useEffect(() => {
    return () => {};
  }, []);

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
      <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
        {getFieldDecorator(dataIndex, {
          initialValue,
          rules,
        })(
          <TextArea
            placeholder={'请输入' + label}
            maxLength={maxLength}
            autoSize={{ maxRows: 6, minRows: 3 }}
            allowCear
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
          content: `确定退回吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            console.log('🚀 ~ file: index.js:62 ~ validateFields ~ values:', values, data);
            setIsSpinning(true);
            if (fromBudget === false) {
              //结转的退回
              OperateBudgetCarryoverInfo({
                operateType: 'TH',
                recordId: Number(data.JLID),
                budgetProject: budgetId,
                amount: String(data.JZJE),
                carryoverDes: data.JZSM,
                backDes: values.thsm,
              })
                .then(res => {
                  if (res.success) {
                    refresh();
                    message.success('退回成功', 1);
                    setIsSpinning(false);
                    onCancel();
                  }
                })
                .catch(e => {
                  console.error('🚀 ~ file: index.js:61 ~ validateFields ~ e:', e);
                  message.error('退回失败', 1);
                });
            } else {
              //资本性预算那边的退回
              OperateCapitalBeginYearBudgetInfo({ ...data, backDes: values.thsm, fileInfo: '[]' })
                .then(res => {
                  if (res.success) {
                    refresh();
                    message.success('退回成功', 1);
                    setIsSpinning(false);
                    onCancel();
                  }
                })
                .catch(e => {
                  console.error('退回失败', e);
                  message.error('退回失败', 1);
                  setIsSpinning(false);
                });
            }
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
    okText: '确定',
  };

  return (
    <Modal {...modalProps}>
      <div className="body-title-box">
        <strong>退回</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          {getTextArea({
            label: '退回说明',
            dataIndex: 'thsm',
            labelCol,
            wrapperCol,
            rules: [
              {
                required: true,
                message: '退回说明不允许为空',
              },
            ],
            maxLength: 600,
          })}
        </Form>
      </Spin>
    </Modal>
  );
});
