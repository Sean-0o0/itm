import React from 'react';
import { Form, Row, Col, Input, Progress } from 'antd';

const { Item: FormItem } = Form;

class ChangePwdContent extends React.Component {
  render() {
    const { getPwdLevel, form: { getFieldDecorator, getFieldsValue }, aqdjDic = {} } = this.props;
    const progressProps = {
      size: 'small',
      status: 'active',
      format: percent => aqdjDic[percent / 25].label || '',
    };
    return (
      <div className="ant-collapse-content-box">
        <Form className="m-form-default ant-advanced-search-form" style={{ paddingTop: '2rem' }}>
          <Row>
            <Col sm={24} md={24} xxl={24} >
              <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="旧密码" wrapperCol={{ span: 12 }}>
                {getFieldDecorator('oldPwd', { rules: [{ required: true, min: 6, max: 16, message: '请正确输入旧密码' }] })(<Input type="password" placeholder="旧密码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <Col sm={24} md={24} xxl={24} >
                <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="新密码" wrapperCol={{ span: 12 }}>
                  {getFieldDecorator('newPwd', {
                    rules: [{ required: true, min: 6, max: 16 }],
                  })(<Input type="password" placeholder="新密码由数字、字母和特殊字符组成" />)}
                </FormItem>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col>
              <Col span={10} offset={4} style={{ paddingLeft: '1rem' }}>
                <div style={{ marginTop: '-1rem' }}>
                  <Progress percent={(getPwdLevel(getFieldsValue) || 0) * 25} strokeColor={(aqdjDic[getPwdLevel(getFieldsValue)] || {}).color || ''} {...progressProps} />
                  <span style={{ fontSize: '.866rem' }}>密码强度</span>
                </div>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24} xxl={24} >
              <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="重输新密码" wrapperCol={{ span: 12 }}>
                {getFieldDecorator('reNewPwd', { rules: [{ required: true, min: 6, max: 16 }] })(<Input type="password" placeholder="确认新密码" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ChangePwdContent);
