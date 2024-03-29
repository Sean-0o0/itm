import React, { useEffect, useState } from 'react';
import { Button, Form, message, Modal, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(
  Form.create()(function ContractInfoMod_RLFWRW(props) {
    const {
      visible,
      setVisible,
      form = {},
      refresh = () => {},
      dictionary = {},
      userBasicInfo = {},
      roleData = {},
    } = props;
    const {} = dictionary; //todo
    const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
    const [isSpinning, setIsSpinning] = useState(false); //加载状态
    const labelCol = 6;
    const wrapperCol = 18;

    useEffect(() => {
      return () => {};
    }, []);

    //提交数据
    const onOk = () => {
      validateFields((err, values) => {
        if (!err) {
          const params = {
            //to do
          };
          //to do
          API(params)
            .then(res => {
              if (res?.success) {
                refresh();
                message.success('操作成功', 1);
                onCancel();
                setIsSpinning(false);
              }
            })
            .catch(e => {
              console.error('🚀', e);
              message.error('操作失败', 1);
              setIsSpinning(false);
            });
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
      wrapClassName: 'contract-info-mod-modal',
      width: 800, // todo
      maskClosable: false,
      style: { top: 10 }, // todo
      maskStyle: { backgroundColor: 'rgb(0 0 0 / 30%)' },
      zIndex: 103,
      title: null,
      visible,
      onCancel,
      onOk,
      confirmLoading: isSpinning,
    };

    return (
      <Modal {...modalProps}>
        <div className="body-title-box">
          <strong>合同信息录入修改</strong>
        </div>
        <Spin spinning={isSpinning} tip="加载中">
          <Form className="content-box">to do...</Form>
        </Spin>
      </Modal>
    );
  }),
);