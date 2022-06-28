import React, { Component, Fragment } from 'react';
import { Form, Row, Col, message, Input, Select } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';


/**
 * 营业部负责人审批/分公司复核
 */
class AuditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleOk = () => {
    const { confirmLoading } = this.state;
    if (!confirmLoading) {
      this.handleSubmit();
    }
  }
  handleCancel = () => {
    const { confirmLoading } = this.state;
    if (confirmLoading) {
      message.warning('正在执行中,请勿关闭窗口!');
    } else {
      const { onCancel } = this.props;
      if (onCancel) {
        onCancel();
      }
    }
  }
  handleSubmit = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err || err.length === 0) { // 校验通过
        this.setState({ confirmLoading: true });
        const { handleAudit, onCancel, type, selectedId } = this.props;
        if (typeof handleAudit === 'function') {
          handleAudit(
            { ...values, oprType: type === '1' ? '5' : '6', tmplId: selectedId },
            () => { this.setState({ confirmLoading: false }); if (onCancel) onCancel(); },
            () => { this.setState({ confirmLoading: false }); },
          );
        }
      }
    });
  }

  render() {
    const { confirmLoading } = this.state;
    const { visible = false, type = '', form = {} } = this.props;
    const { getFieldDecorator } = form;
    const title = type === '1' ? '营业部负责人审批' : '分公司复核';
    const modalProps = {
      width: '75rem',
      title,
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
          <Form className="m-form" onSubmit={this.handleSubmit}>
            <Row className="m-row-form">
              <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                  className="wid50"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label={type === '1' ? '审核状态' : '复核状态'}
                >
                  {getFieldDecorator('status', {
                    rules: [{ required: true, message: '请选择审核状态!' }],
                    })(<Select
                      getPopupContainer={node => node}
                      className="m-select m-select-default esa-select"
                      placeholder="请选择"
                    >
                      <Select.Option value="0">同意</Select.Option>
                      <Select.Option value="1">不同意</Select.Option>
                      {/* eslint-disable-next-line react/jsx-indent */}
                       </Select>)}
                </Form.Item>
              </Col>
              <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  label={type === '1' ? '审核意见' : '复核意见'}
                >
                  {getFieldDecorator('auditOpion', {
                    rules: [{ required: true, message: '请填写审核意见!' }],
                    })(<Input.TextArea rows={4} placeholder="请填写审核意见" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </BasicModal>
      </Fragment>
    );
  }
}

export default Form.create()(AuditModal);
