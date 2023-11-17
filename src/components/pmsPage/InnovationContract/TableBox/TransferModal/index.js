import React, { useEffect, useState } from 'react';
import { Button, Form, message, Modal, Spin, TreeSelect } from 'antd';
import moment from 'moment';
import { TransferXCContract } from '../../../../../services/pmsServices';

export default Form.create()(function TransferModal(props) {
  const { visible, setVisible, form = {}, treeData = [], refresh, contractId } = props;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [zbrName, setZbrName] = useState(''); //转办人名称

  useEffect(() => {
    return () => {};
  }, []);

  //提交数据
  const onOk = () => {
    validateFields((err, values) => {
      if (!err) {
        Modal.confirm({
          title: '提示：',
          content: `确定转办给 ${zbrName} 吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            TransferXCContract({
              newTrustee: Number(values.zbr),
              contractId,
            })
              .then(res => {
                if (res?.success) {
                  refresh();
                  message.success('操作成功', 1);
                  setIsSpinning(false);
                  onCancel();
                }
              })
              .catch(e => {
                console.error('🚀转办', e);
                message.error('操作失败', 1);
                setIsSpinning(false);
              });
          },
        });
      }
    });
  };

  //取消
  const onCancel = () => {
    setZbrName('');
    resetFields();
    setVisible(false);
  };

  //弹窗参数
  const modalProps = {
    wrapClassName: 'transfer-modal-modal',
    width: 430,
    maskClosable: false,
    style: { top: 60 },
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
        <strong>转办</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Form.Item label="转办人" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('zbr', {
              rules: [
                {
                  required: true,
                  message: '转办人不允许空值',
                },
              ],
            })(
              <TreeSelect
                style={{ width: '100%' }}
                treeDefaultExpandedKeys={['357', '11168']}
                showSearch
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                dropdownClassName="newproject-treeselect"
                allowClear
                treeNodeFilterProp="title"
                showCheckedStrategy="SHOW_CHILD"
                treeData={treeData}
                onChange={(v, nodeArr) => setZbrName(nodeArr.join('、'))}
              />,
            )}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
});
