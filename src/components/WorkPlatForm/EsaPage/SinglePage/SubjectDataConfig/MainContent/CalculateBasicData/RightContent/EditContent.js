import React, { Component } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import BasicDataColTree from './BasicDataColTree';
import util from './Util';
import lodash from 'lodash';
import {  FetchOperateSubjectDataDetail } from '../../../../../../../../services/EsaServices/commissionManagement'
class EditContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.props.onRef(this);
  }
  // 验证表单
  handleSubmit = (e) => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.commitFormData(values);
      }
    });
  }
  // 编辑计算规则
  editFmla = (str = '', data) => {
    const obj = lodash.get(this, '_jsgzTextArea.textAreaRef');
    let position = 0;
    if (obj) {
      if (typeof obj.selectionStart === 'number') {
        // 非IE
        position = obj.selectionStart;
      } else {
        position = document.selection.createRange().text;
      }
    }
    // 改变值
    const { getFieldValue, setFieldsValue, validateFields } = this.props.form;
    const preValue = getFieldValue('sbjFmlatext') || '';
    const aftValue = `${preValue.substring(0, position)}${str}${preValue.substring(position)}`;
    setFieldsValue({ sbjFmlatext: aftValue });
    validateFields(['sbjFmlatext']);
    // 重置光标位置
    if (obj) {
      setTimeout(() => {
        obj.focus();
        if (obj.setSelectionRange) { // 标准浏览器
          obj.setSelectionRange(position + str.length, position + str.length);
        } else { // IE9-
          const range = obj.createTextRange();
          range.moveStart('character', -position + str.length);
          range.moveEnd('character', -position + str.length);
          range.moveStart('character', position + str.length);
          range.moveEnd('character', 0);
          range.select();
        }
      }, 10);
    }
  }

  // 提交表单数据
  commitFormData = (values) => {
    // 提交成功调用
    const { data, sbjDataId } = this.props;
    const payload = {
      sbjDataDtlId: data.sbjDataDtlId? data.sbjDataDtlId:'',
      oprType: data.sbjDataDtlId? 2:1,
      sbjDataDtlName:values.sbjDataDtlName,
      corrIndi:values.corrIndi,
      sbjColFmla:values.sbjFmlatext,
      sbjDataId: sbjDataId
    }
    this.commitForm(payload);
  }

  commitForm = (payload) => {
    const { fetchData, sbjDataId } = this.props;
    FetchOperateSubjectDataDetail({ ...payload }).then((response) => {
      const {code, note} =response;
      if (code < 0) {
        message.error(note);
      } else {
        fetchData(sbjDataId);
        message.success(payload.oprType === 1?"新增成功！": "修改成功！");
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });

  }

  addOperateBtn = () => {

  }

  fmlaCheck = (rule, val, callback) => {
    if (!val) {
      callback();
    }
    const validateResult = util.fmlaCheck(val);
    if (!validateResult) {
      callback('公式定义错误!');
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data = {}, basicDataCol = [], indicators=[] } = this.props;
    //console.log(this.props);
    const operateBtn = ['+', '-', 'x', '÷', '(', ')'];
    return (
      <div className="esa-edit-form">
        <Form className="m-form">
          <div className="esa-edit-form-item">
            <div className="esa-edit-form-label"><span style={{ color: 'red' }}>*&nbsp;</span>列名</div>
            <div style={{ flex: '1' }}>
              <Form.Item>
                {
                  getFieldDecorator('sbjDataDtlName', {
                    initialValue: data.sbjDataDtlName,
                    rules: [{
                      required: true,
                      message: '列名不能为空',
                    }]
                  })(<Input style={{ width: '200px' }} />)
                }
              </Form.Item>
            </div>
          </div>
          <div className="esa-edit-form-item">
            <div className="esa-edit-form-label"><span style={{ color: 'red' }}>*&nbsp;</span>对应指标</div>
            <div style={{ flex: '1' }}>
              <Form.Item>
                {
                  getFieldDecorator('corrIndi', {
                    initialValue: data.corrIndi,
                    rules: [{
                      required: true,
                      message: '对应指标不能为空',
                    }]
                  })(<Select style={{ width: '200px' }} >
                    {
                      indicators.map((item) => {
                        return <Select.Option key={item.key} value={item.value}>{item.title}</Select.Option>;
                      })
                    }
                  </Select>)
                }
              </Form.Item>
            </div>
          </div>
          <div className="esa-edit-form-item">
            <div className="esa-edit-form-label"><span style={{ color: 'red' }}>*&nbsp;</span>公式定义</div>
            <div style={{ flex: '1.5' }}>
              <div className="dis-fx" style={{ marginBottom: '1rem' }}>
                {
                  operateBtn.map((item, index) => {
                    return (
                      <Button
                        style={{ height: '3rem', width: '6.1rem' }}
                        className="m-btn-radius m-btn-headColor"
                        key={index}
                        onClick={() => { this.editFmla(item); }}
                      >{item}
                      </Button>
                    );
                  })
                }
              </div>
              <Form.Item>
                {getFieldDecorator('sbjFmlatext', {
                  initialValue: data.sbjColFmlaDisp,
                  rules: [{ required: true, message: '请填写公式定义！', whitespace: true }, { validator: (rule, val, callback) => this.fmlaCheck(rule, val, callback) }],
                })(<Input.TextArea
                  ref={(e) => { this._jsgzTextArea = e; }}
                  autoSize={{ minRows: 9, maxRows: 9 }}
                />)}
              </Form.Item>
            </div>
            <div style={{ flex: '1 1 0%', marginLeft: '1rem' }}>
              <BasicDataColTree basicDataCol={basicDataCol} editFmla={this.editFmla} />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
export default Form.create()(EditContent);
