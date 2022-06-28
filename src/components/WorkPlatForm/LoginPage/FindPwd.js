import React from 'react';
import { Form, Row, Col, Input, Progress, message } from 'antd';
// import FindPwdContent from './FindPwdContent';
import { FetchAchieveAuthCode } from '../../../services/commonbase';

const { Item: FormItem } = Form;

class FindPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeCount: 60,
      timeVisible: false,
    };
    this.myForm = null;
    this.timer = null;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  authCode = async (phone, yhm) => {
    await FetchAchieveAuthCode({ yhm, phone }).then((res) => {
      const { code = 0, message: msg = '' } = res;
      if (code > 0) {
        this.setState({
          timeVisible: true,
        });
        const { timeCount } = this.state;
        let temp = timeCount;
        this.timer = setInterval(() => {
          if (temp > 0) {
            this.setState({
              timeCount: --temp,
            });
            this.props.setOkVisible(false);
          } else {
            clearInterval(this.timer);
            this.setState({
              timeCount: 60,
              timeVisible: false,
            });
            this.props.setOkVisible(true);
          }
        }, 1000);
      } else {
        message.error(msg);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  sendMsg = (e) => {
    e.preventDefault();
    if (this.props.form) {
      const { validateFieldsAndScroll } = this.props.form;
      validateFieldsAndScroll((err, values) => {
        const { phone = '', yhm = '' } = values;
        if (err) {
          if (yhm === '') {
            message.error('请输入用户名！');
            return false;
          }
          if (phone === '') {
            message.error('请正确输入手机号！');
            return false;
          }
          if (!err.yhm && !err.phone) {
            this.authCode(phone, yhm);
          }
        } else {
          this.authCode(phone, yhm);
        }
      });
    }
  }
  render() {
    const { timeCount, timeVisible } = this.state;
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
            <Col sm={24} md={24} xxl={24}>
              <FormItem labelCol={{ span: 12 }} className="m-form-item" label="用户名" wrapperCol={{ span: 12 }} help="" >
                {getFieldDecorator('yhm', {
              rules: [{ required: true, message: '请输入账号' }],
            })(<Input autoComplete="off" placeholder="输入账号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24} xxl={24} >
              <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="新密码" wrapperCol={{ span: 12 }}>
                {getFieldDecorator('newPwd', {
                  rules: [{ required: true, min: 6, max: 16 }] })(<Input type="password" placeholder="新密码由数字、字母和特殊字符组成" />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col>
              <Col span={10} offset={4} style={{ paddingLeft: '1rem' }}>
                <div style={{ marginTop: '-2rem' }}>
                  <Progress percent={(getPwdLevel(getFieldsValue) || 0) * 25} strokeColor={(aqdjDic[getPwdLevel(getFieldsValue)] || {}).color || ''} {...progressProps} />
                  <span style={{ fontSize: '.866rem' }}>密码强度</span>
                </div>
              </Col>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="确认新密码" wrapperCol={{ span: 12 }}>
                {getFieldDecorator('reNewPwd', { rules: [{ required: true, min: 6, max: 16 }] })(<Input type="password" placeholder="确认新密码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24} xxl={24} >
              <FormItem labelCol={{ span: 12 }} help="" className="m-form-item" label="手机号" wrapperCol={{ span: 12 }}>
                {getFieldDecorator('phone', { rules: [{ required: true, len: 11, pattern: /^0?(13[0-9]|14[579]|15[012356789]|16[6]|17[0135678]|18[0-9]|19[89])[0-9]{8}$/, message: '请正确输入手机号' }] })(<Input placeholder="请输入入职手机号" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} xxl={12} >
              <FormItem labelCol={{ span: 6 }} help="" className="m-form-item" label="验证码" wrapperCol={{ span: 6 }}>
                {
                  getFieldDecorator('authCode', {
                    rules: [{ required: true, len: 6, pattern: /^[A-Za-z0-9]{6}$/, message: '请正确输入手机验证码' }],
                  })(<Input placeholder="手机验证码" />)
                }
              </FormItem>
            </Col>
            <Col sm={6} md={6} xxl={6}>
              <div><a className="blue" onClick={this.sendMsg} style={{ marginLeft: '-2rem', display: timeVisible ? 'none' : '' }}>获取手机验证码</a><span className="blue" style={{ display: timeVisible ? '' : 'none', marginLeft: '-2rem' }}>剩余{timeCount}秒</span></div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create()(FindPwd);
