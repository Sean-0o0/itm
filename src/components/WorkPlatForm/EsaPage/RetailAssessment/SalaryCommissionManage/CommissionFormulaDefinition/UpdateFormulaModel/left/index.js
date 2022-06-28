import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { Form, Row, Col, Input, Radio, Select, Button, message, InputNumber, Icon } from 'antd';
import { getDictKey } from '../../../../../../../../utils/dictUtils';
import { FetchQueryInfoRoyaltyFormulaVariable } from '../../../../../../../../services/EsaServices/commissionManagement';

const { TextArea } = Input;
class SalaryPlan extends React.Component {
  state ={
    informWay: [], // 初始变量
  }

  componentDidMount = () => {
    if (this.props.item) {
      const { item: { id } } = this.props;
      if (id) {
        this.FetchQueryInfoRoyaltyFormulaVariable(id);
      }
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.selectIndex !== this.props.selectIndex) {
      this.editFmla(nextProps.data.value, nextProps.data.data);
    }
    if (nextProps.inputChangIndex !== this.props.inputChangIndex) {
      this.handleFmlaDescChange(nextProps.params);
    }
  }

    // 变量数值变化
    onValschange = (e, objKey, index) => {
      const { Variable = [], updateVariable } = this.props;
      const value = (e && e.target) ? e.target.value : e;
      const tmplVal = JSON.parse(JSON.stringify(Variable));
      if (tmplVal[index]) {
        tmplVal[index][objKey] = value;
      } else {
        tmplVal.push({ seq: `${Variable.length}`, name: '', minVal: '', maxVal: '', auditVal: '', [objKey]: value });
      }
      if (updateVariable) {
        updateVariable(tmplVal);
      }
    }


  // 编辑计算公式
  editFmla = (str = '', data) => {
    const obj = lodash.get(this, '_jsgsTextArea.textAreaRef');
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
    const { getFieldValue, setFieldsValue } = this.props.form;
    const preValue = getFieldValue('calFmla') || '';
    const aftValue = `${preValue.substring(0, position)}${str}${preValue.substring(position)}`;
    setFieldsValue({ calFmla: aftValue });
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
    // 更新说明
    this.handleFmlaDescChange(data);
  }


  FetchQueryInfoRoyaltyFormulaVariable = async (fmlaId = '') => { // 变量查询
    const data = await FetchQueryInfoRoyaltyFormulaVariable({ fmlaId });
    const { success = false } = data;
    if (success) {
      const { records = [] } = data;
      if (records.length) {
        this.setState({ informWay: records });
        this.props.setVariable(records[0].paramValue.length ? records[0].paramValue : []);
      }
    }
  }

  // 计算公式内容改变
  handleInputChange=() => {
    this.props.handelInputChange();
  }


  handleFmlaDescChange = (data) => {
    const flag = data && data.length;
    const { getFieldValue, setFieldsValue } = this.props.form;
    let formula = getFieldValue('calFmla') || '';
    // 替换运算符和指标
    if (flag) {
      data.forEach((item) => {
        const { regStr = '', expsDescr = '' } = item;
        let regExp = '';
        regExp = new RegExp(regStr, 'g');
        formula = formula.replace(regExp, expsDescr);
      });
      setFieldsValue({ fmlaDesc: formula });
    }
  }

    // 删除变量
    remove = (k) => {
      const { Variable = [], updateVariable } = this.props;
      const tmplVal = JSON.parse(JSON.stringify(Variable));
      tmplVal.splice(k, 1);
      if (updateVariable) {
        updateVariable(tmplVal);
      }
    }

    // 添加变量
    add = () => {
      const { Variable = [], updateVariable } = this.props;
      const tmplVal = JSON.parse(JSON.stringify(Variable));
      if (tmplVal.length < 20) {
        tmplVal.push({ seq: `${Variable.length}`, name: '', minVal: '', maxVal: '', auditVal: '' });
      } else {
        message.error('最多可以添加20个变量！');
      }
      if (updateVariable) {
        updateVariable(tmplVal);
      }
    }


    render() {
      const { dictionary = {}, Variable = [] } = this.props;
      const { informWay = [] } = this.state;
      const flag = informWay.length;
      const { getFieldDecorator } = this.props.form;
      const mblx = dictionary[getDictKey('TCLX')] || [];
      return (
        <div style={{ padding: '1.833rem 1rem 0 0' }}>
          <Form className="m-form-default ant-form-horizontal ant-advanced-search-form m-form">
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="模板名称" >
                  {getFieldDecorator('fmlaName', {
                    initialValue: flag ? informWay[0].fmlaName : '',
                  rules: [{ required: true, message: '请输入' }] })(<Input />)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="模板类型" wrapperCol={{ span: 12 }}>
                  {getFieldDecorator('tmplType', {
                    initialValue: flag ? informWay[0].tmplType : '请选择模板类型',
                    rules: [{ required: true, message: '请选择模板' }] })(<Select className="esa-xcxmgl-select" showSearch placeholder="请选择模板类型">{mblx.map((tempitem) => { return <Select.Option key={tempitem.ibm} value={tempitem.ibm}>{tempitem.note}</Select.Option>; })}</Select>)
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24} xxl={24} >
                <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="说明" >
                  {getFieldDecorator('remk', {
                    initialValue: flag ? informWay[0].remk : '',
                  rules: [{ required: true, message: '请输入说明' }] })(<TextArea style={{ minWidth: '9.5rem' }} autosize={{ minRows: 3, maxRows: 5 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24} xxl={24} >
                <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="计算方式" wrapperCol={{ span: 12 }} >
                  {getFieldDecorator('valMode', {
                    initialValue: flag ? informWay[0].valMode : '',
                    rules: [{ required: true, message: '请选择计算方式' }],
                  })(<Radio.Group options={[{ label: '分段选一', value: '1', key: '1' }, { label: '分段累加', value: '2', key: '2' }, { label: '单项', value: '3', key: '3' }]} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24} xxl={24} >
                <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="计算类型" wrapperCol={{ span: 12 }} >
                  {getFieldDecorator('settType', {
                    initialValue: flag ? informWay[0].settType : '',
                    rules: [{ required: true, message: '请选择计算类型' }],
                  })(<Radio.Group options={[{ label: '按单户计算', value: '1', key: '1' }, { label: '按客户营业部汇总', value: '2', key: '2' }, { label: '按人员汇总', value: '3', key: '3' }]} />)}
                </Form.Item>
              </Col>
            </Row>
            {Variable.map((item, index) => (
              <Row className="variabelRow" key={index}>
                <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label={`变量名${index + 1}`}>
                  <Col sm={24} md={24} lg={6}>
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="has-success">
                      <Input placeholder="变量名" value={item.name} onChange={(e) => { this.onValschange(e, 'name', index); }} />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={24} lg={5}>
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12, offset: 2 }} className="has-success" >
                      <InputNumber className="esa-input-number" placeholder="最小值" value={item.minVal} onChange={(e) => { this.onValschange(e, 'minVal', index); }} style={{ width: '7rem', verticalAlign: 'top' }} />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={24} lg={5}>
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12, offset: 2 }} className="has-success" >
                      <InputNumber className="esa-input-number" placeholder="最大值" value={item.maxVal} onChange={(e) => { this.onValschange(e, 'maxVal', index); }} style={{ width: '7rem', verticalAlign: 'top' }} />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={24} lg={5}>
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12, offset: 2 }} className="has-success">
                      <InputNumber className="esa-input-number" placeholder="审核阈值" value={item.auditVal} onChange={(e) => { this.onValschange(e, 'auditVal', index); }} style={{ width: '7rem', verticalAlign: 'top' }} />
                    </Form.Item>
                  </Col>
                  <Col sm={24} md={4} lg={2}>
                    <Button shape="circle" size="small" style={{ marginLeft: '0.25rem' }} className="m-jianshao-icon m-btn" icon="minus" type="default" onClick={() => this.remove(index)} />
                  </Col>
                </Form.Item>
              </Row>
              ))}
            <Row>
              <Col sm={24} md={24} xxl={24} >
                <Form.Item labelCol={{ span: 12 }} className="m-form-item" label=" " wrapperCol={{ span: 12 }} >
                  <Button type="dashed" onClick={this.add} style={{ width: '60%' }} className="esa-btn-dash-bg">
                    <Icon type="plus" />添加
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24} xxl={24} >
                <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="计算公式" wrapperCol={{ span: 12 }} >
                  {getFieldDecorator('calFmla', {
                    initialValue: flag ? informWay[0].calFmla : '',
                    rules: [{ required: true, message: '计算公式内容不能为空' }] })(<TextArea placeholder="" style={{ minWidth: '9.5rem' }} ref={(e) => { this._jsgsTextArea = e; }} onChange={this.handleInputChange} autosize={{ minRows: 4, maxRows: 6 }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24} xxl={24} >
                <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="公式描述" wrapperCol={{ span: 12 }} >
                  {getFieldDecorator('fmlaDesc', {
                    initialValue: flag ? informWay[0].fmlaDesc : '',
                   })(<TextArea disabled placeholder="" style={{ minWidth: '9.5rem' }} autosize={{ minRows: 4, maxRows: 6 }} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      );
    }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(SalaryPlan));
