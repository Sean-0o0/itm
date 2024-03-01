import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, message, Modal, Spin, DatePicker, Input, Popconfirm } from 'antd';
import moment from 'moment';
import { InsertProjectUpdateInfo } from '../../../../../services/pmsServices';
const { TextArea } = Input;

export default Form.create()(function OprtModal(props) {
  const { xmid, modalData, setModalData, getIterationCtn, form } = props;
  const { type = 'ADD', visible, data = {} } = modalData;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  

  useEffect(() => {
    return () => {};
  }, []);

  //提交数据
  const handleOk = () => {
    validateFields(err => {
      if (!err) {
        setIsSpinning(true);
        InsertProjectUpdateInfo({
          date: Number(getFieldValue('sjrq').format('YYYYMMDD')),
          frequency: type === 'ADD' ? -1 : data.times,
          id: type === 'ADD' ? -1 : data.key,
          info: getFieldValue('sjnr'),
          operateType: type,
          projectId: Number(xmid),
        })
          .then(res => {
            if (res?.success) {
              message.success('操作成功', 1);
              getIterationCtn();
              setIsSpinning(false);
              setModalData({ visible: false, data: {}, type: 'ADD' });
              resetFields();
            }
          })
          .catch(e => {
            console.error('🚀InsertProjectUpdateInfo', e);
            message.error('操作失败', 1);
            setIsSpinning(false);
          });
      }
    });
  };

  //取消
  const handleCancel = () => {
    setModalData({ visible: false, data: {}, type: 'ADD' });
    resetFields();
  };

  //删除
  const handleDelete = () => {
    InsertProjectUpdateInfo({
      date: -1,
      frequency: data.times,
      id: data.key,
      info: '',
      operateType: 'DELETE',
      projectId: Number(xmid),
    })
      .then(res => {
        if (res?.success) {
          message.success('操作成功', 1);
          getIterationCtn();
          setIsSpinning(false);
          setModalData({ visible: false, data: {}, type: 'ADD' });
          resetFields();
        }
      })
      .catch(e => {
        console.error('🚀InsertProjectUpdateInfo', e);
        message.error('操作失败', 1);
        setIsSpinning(false);
      });
  };

  return (
    <Modal
      wrapClassName="editMessage-modify iteration-content-modal"
      width={600}
      maskClosable={false}
      style={{ top: 60 }}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      zIndex={103}
      title={null}
      visible={visible}
      destroyOnClose={true}
      onCancel={handleCancel}
      footer={
        <div className="modal-footer">
          <Button className="btn-default" onClick={handleCancel}>
            取消
          </Button>
          <Button loading={isSpinning} className="btn-primary" type="primary" onClick={handleOk}>
            保存
          </Button>
          {type === 'UPDATE' && (
            <Popconfirm title="确定删除吗？" onConfirm={handleDelete}>
              <Button loading={isSpinning} className="btn-primary" type="primary">
                删除
              </Button>
            </Popconfirm>
          )}
        </div>
      }
    >
      <div className="body-title-box">
        <strong>{type === 'ADD' ? '新增升级内容' : '编辑升级内容'}</strong>
      </div>
      <Spin spinning={isSpinning} tip="加载中">
        <Form className="content-box">
          <Form.Item label="升级日期" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('sjrq', {
              initialValue: data.date ? moment(String(data.date)) : null,
              rules: [
                {
                  required: true,
                  message: '升级日期不允许空值',
                },
              ],
            })(<DatePicker style={{ width: '100%' }} placeholder="请选择升级日期" />)}
          </Form.Item>
          <Form.Item label="升级内容" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            {getFieldDecorator('sjnr', {
              initialValue: data.detail ?? '',
              rules: [
                {
                  required: true,
                  message: '升级内容不允许空值',
                },
              ],
            })(
              <TextArea
                className="ms-textarea"
                placeholder="请输入升级内容"
                maxLength={600}
                autoSize={{ maxRows: 8, minRows: 4 }}
              ></TextArea>,
            )}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
});
