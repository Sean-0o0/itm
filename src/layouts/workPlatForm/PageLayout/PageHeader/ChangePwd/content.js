import React from 'react';
import _ from 'lodash';
import { Form, Row, Col, Input, Progress } from 'antd';

const { Item: FormItem } = Form;

class ChangePwdContent extends React.Component {
  state = {
    isRePwdSameToNew: true, // 重复新密码是否和新密码一样
  }

  handleNewPwdChange = (e) => {
    // isRePwdSameToNew
    const { form: { getFieldsValue } } = this.props;
    const value = _.get(e, 'target.value', '');
    if (getFieldsValue().newPwd === value) {
      this.setState({ isRePwdSameToNew: true });
    } else {
      this.setState({ isRePwdSameToNew: false });
    }
  }

  // 校验密码
  validateNewPwd = (_, value, callback) => {
    const { form: { getFieldsValue }, userBasicInfo: { userid = '', name = '' } } = this.props;
    const { yhm = '' } = getFieldsValue();
    const usrPwdStrengthLevel = localStorage.getItem('usrPwdStrengthLevel') ? Number.parseInt(localStorage.getItem('usrPwdStrengthLevel'), 10) : 3;
    const usrPwdMinLength = localStorage.getItem('usrPwdMinLength') ? Number.parseInt(localStorage.getItem('usrPwdMinLength'), 10) : 8;
    // if (level === 1) {
    // '必须包含数字、小写字母、大写字母或其它特殊符号当中的一种'
    // } else if (level === 2) {
    // '必须包含数字、小写字母、大写字母或其它特殊符号当中的两种；不能以用户帐号，用户姓名作为开头'
    // } else if (level === 3) {
    // '必须包含数字、小写字母、大写字母或其它特殊符号当中的三种；不能以用户帐号，用户姓名作为开头'
    // } else if (level === 4) {
    // '必须包含数字、小写字母、大写字母或其它特殊符号当中的四种；不能以用户帐号，用户姓名作为开头'
    // }
    if (!value) {
      callback('必填');
      return;
    }
    // 长度
    if (value.length < usrPwdMinLength) {
      callback(`密码最少${usrPwdMinLength}位`);
      return;
    }
    if (value.length > 16) {
      callback('密码最多16位');
      return;
    }
    if (usrPwdStrengthLevel > 1) {
      if (userid && value.indexOf(userid) === 0) {
        callback('不能以用户账号作为开头');
        return;
      }
      if (name && value.indexOf(name) === 0) {
        callback('不能以用户姓名作为开头');
        return;
      }
    }
    // 密码包含 数字、小写字母、大写字母或其它特殊符号 的数量
    let rule1Num = 0;
    if (/\d+/.test(value)) {
      rule1Num++;
    }
    if (/[a-z]+/.test(value)) {
      rule1Num++;
    }
    if (/[A-Z]+/.test(value)) {
      rule1Num++;
    }
    if (/[\~\!\@\#\$\%\^\&\*\(\)\_\+\\\|\]\}\[\{\'\"\;\:\/\?\.\>\,\<\-\*\.]+/.test(value)) {
      rule1Num++;
    }
    if (rule1Num < usrPwdStrengthLevel) {
      callback(`必须包含数字、小写字母、大写字母或其它特殊符号当中的${usrPwdStrengthLevel}种`);
      return;
    }
    // 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  }

  // 校验重复密码
  validateRePwd = (_, value, callback) => {
    const { form: { getFieldsValue } } = this.props;
    const { newPwd = '' } = getFieldsValue();
    if (!value) {
      callback('必填');
      return;
    }
    if (newPwd !== value) {
      callback('两次输入的密码不一样！');
      return;
    }
    // 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  }

  render() {
    const { isRePwdSameToNew } = this.state;
    const { getPwdLevel, form: { getFieldDecorator, getFieldsValue }, aqdjDic = {}, getPwdStrengthTip } = this.props;
    const progressProps = {
      size: 'small',
      status: 'active',
      format: percent => aqdjDic[percent / 25].label || '',
    };
    const usrPwdStrengthLevel = localStorage.getItem('usrPwdStrengthLevel') ? Number.parseInt(localStorage.getItem('usrPwdStrengthLevel'), 10) : 3;
    const usrPwdMinLength = localStorage.getItem('usrPwdMinLength') ? Number.parseInt(localStorage.getItem('usrPwdMinLength'), 10) : 8;
    return (
      <div className="ant-collapse-content-box">
        <Form className="m-form-default ant-advanced-search-form" style={{ paddingTop: '1.666rem' }}>
          <Row type="flex" justify='center'>
            <Col sm={20} md={20} xxl={20} >
              <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="旧密码" wrapperCol={{ span: 12 }}>
                {
                  getFieldDecorator('oldPwd', {
                    rules: [{ required: true, min: 6, max: 16, message: '请正确输入旧密码' }],
                  })(<Input type="password" placeholder="旧密码" />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify='center'>
              <Col sm={20} md={20} xxl={20} >
                <FormItem labelCol={{ span: 12 }} className="m-form-item" label="新密码" wrapperCol={{ span: 12 }} help="">
                  {
                    getFieldDecorator('newPwd', {
                      rules: [{ required: true, message: '请输入新密码' }, { validator: this.validateNewPwd }],
                    })(<Input.Password placeholder="请输入新密码" />)
                  }
                  <span style={{ color: '#999', fontSize: '1.25rem', display: 'block', marginTop: '.5rem' }}>最少{usrPwdMinLength}位；最多16位；{getPwdStrengthTip(usrPwdStrengthLevel)}</span>
                </FormItem>
              </Col>
          </Row>
          <Row type="flex" justify='space-around'>
              <Col span={16} offset={2}>
                <div style={{ marginTop: '-1rem' }}>
                  <Progress percent={(getPwdLevel(getFieldsValue) || 0) * 25} strokeColor={(aqdjDic[getPwdLevel(getFieldsValue)] || {}).color || ''} {...progressProps} />
                  <span style={{ fontSize: '1rem' }}>密码强度</span>
                </div>
              </Col>
          </Row>
          <Row type="flex" justify='center'>
            <Col sm={20} md={20} xxl={20}>
              <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="确认密码" wrapperCol={{ span: 12 }}>
                {
                  getFieldDecorator('reNewPwd', {
                    rules: [{ required: true, message: '请确认密码' }, { validator: this.validateRePwd }],
                  })(<Input.Password placeholder="确认密码" onChange={this.handleNewPwdChange} />)
                }
                {
                  !isRePwdSameToNew && <span style={{ color: '#999', fontSize: '1rem', display: 'block', marginTop: '.5rem' }}>两次输入的密码不一样！</span>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(ChangePwdContent);
