import React, { Component, Fragment } from 'react';
import { Form, Input, Select } from 'antd';
import BasicModal from '../../../../../../../../Common/BasicModal';
/**
 * 证券经纪人转换调整弹出框
 */
class StockbrokerLevelAdjustModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }
  handleOk = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err || err.length === 0) { // 校验通过
        this.handleCancel();
      }
    });
  }
  render() {
    const { confirmLoading } = this.state;
    const { visible = false, form = {} } = this.props;
    const { getFieldDecorator } = form;

    const modalProps = {
      title: '证券经纪人级别转换调整',
      width: '75rem',
      visible,
      confirmLoading,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <Fragment>
        <BasicModal
          {...modalProps}
        >
          <Form className="m-form">
            <Form.Item
              className="wid80"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="营业部"
            >信息部
            </Form.Item>
            <Form.Item
              className="wid80"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="部门类别"
            >证券经纪人
            </Form.Item>
            <Form.Item
              className="wid80"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="证券经纪人"
            >{getFieldDecorator('zqjjr', {
              rules: [{ required: true, message: '请输入证券经纪人!' }],
            })(<Input />)}
            </Form.Item>
            <Form.Item
              className="wid80"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="原级别"
            />
            <Form.Item
              className="wid80"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="转换级别"
            >
              {getFieldDecorator('zhjb', {
                rules: [{ required: true, message: '请选择转换级别!' }],
              })(<Select
                getPopupContainer={node => node}
                className="m-select m-select-default"
                placeholder="请选择"
              />)}
            </Form.Item>
            <Form.Item
              className="wid80"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="说明"
            >
              {getFieldDecorator('sm', {
                rules: [{ required: true, message: '请填写说明!' }],
              })(<Input.TextArea rows={4} />)}
              <span style={{ color: 'red' }}>注意：本月考核的证券经纪人进行级别转换将会覆盖考核，级别重新计算将会恢复转换调整</span>

            </Form.Item>
          </Form>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(StockbrokerLevelAdjustModal);
