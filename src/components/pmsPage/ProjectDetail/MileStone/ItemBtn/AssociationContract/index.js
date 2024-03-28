import React, { useEffect, useState } from 'react';
import { Button, Form, message, Modal, Select, Spin, Tooltip } from 'antd';
import moment from 'moment';
import { UpdatePaymentContract } from '../../../../../../services/pmsServices';

export default Form.create()(function AssociationContract(props) {
  const { visible, setVisible, ykbid = '', dhtData = [], form, refresh, glhtid } = props;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态

  useEffect(() => {
    return () => {};
  }, []);

  //提交数据
  const onOk = () => {
    validateFields(e => {
      if (!e) {
        const params = {
          contractId: Number(getFieldValue('glht')),
          paymentId: ykbid, //ykbid
        };
        console.log(
          '🚀 ~提交参数 ~ contractId: ' +
            Number(getFieldValue('glht')) +
            ';   ' +
            'paymentId: ' +
            ykbid,
        );
        UpdatePaymentContract(params)
          .then(res => {
            if (res?.success) {
              refresh();
              message.success('操作成功', 1);
              resetFields();
              setIsSpinning(false);
              setVisible(false);
            }
          })
          .catch(e => {
            console.error('🚀InsertIteContract', e);
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

  return (
    <Modal
      wrapClassName="association-contract-modal"
      width={570}
      maskClosable={false}
      style={{ top: 60 }}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      title={null}
      visible={visible}
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>关联合同</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Form.Item label="关联合同" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('glht', {
              initialValue: glhtid,
              rules: [
                {
                  required: true,
                  message: '关联合同不允许空值',
                },
              ],
            })(
              <Select
                style={{ width: '100%', borderRadius: '8px !important' }}
                placeholder="请选择关联合同"
                showSearch
                allowClear
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children?.props?.children
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {dhtData.map(x => (
                  <Option key={x.ID} value={x.ID}>
                    <Tooltip title={x.HTMC} placement="topLeft">
                      {x.HTMC}
                    </Tooltip>
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
});
