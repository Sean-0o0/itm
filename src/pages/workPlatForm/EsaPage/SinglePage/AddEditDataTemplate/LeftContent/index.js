/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { Form, Row, Col, Input, Button, message } from 'antd';
import CommonSelect from '../../../../../../components/Common/Form/Select';
import TreeSelect from './TreeSelect';
import { getDictKey } from '../../../../../../utils/dictUtils';
import { fetchObject } from '../../../../../../services/sysCommon';

const { TextArea } = Input;
const operatorData = [
  { expsDescr: '+', calExpsRsol: '+', calExps: '+', regStr: '\\+' },
  { expsDescr: '-', calExpsRsol: '-', calExps: '-', regStr: '\\-' },
  { expsDescr: '×', calExpsRsol: '*', calExps: '*', regStr: '\\*' },
  { expsDescr: '÷', calExpsRsol: '/', calExps: '/', regStr: '\\÷' },
  { expsDescr: '(', calExpsRsol: '(', calExps: '(', regStr: '\\(' },
  { expsDescr: ')', calExpsRsol: ')', calExps: ')', regStr: '\\)' },
];
class LeftContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indiData: [],
    };
  }
  componentDidMount() {
    this.fetchIndiData();
  }
  // 关联指标数据
  fetchIndiData = async () => {
    fetchObject('ZBK').then((res) => {
      const { note, code, records } = res;
      if (code > 0) {
        const tmpl = [];
        records.forEach((item) => {
          tmpl.push({
            value: item.INDI_NO,
            label: item.INDI_NAME,
            ...item,
          });
        });
        this.setState({ indiData: tmpl });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectIndex !== this.props.selectIndex) {
      this.editFmla(nextProps.data.value, nextProps.data.data);
    }
    if (nextProps.inputChangIndex !== this.props.inputChangIndex) {
      this.handleFmlaDescChange(nextProps.params);
    }
  }

  // 编辑计算公式
  editFmla = (str = '') => {
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
  }

  // 计算公式内容改变
  handleInputChange = () => {
    this.props.handelInputChange();
  }

  // 按钮点击
  handClick = (item) => {
    this.editFmla(item.calExps);
  }
  render() {
    const { salaryTemplateConfData = {}, dictionary } = this.props;
    const { [getDictKey('PRFM_COL_TYPE')]: TypeData = [], // 类型
      [getDictKey('PRFM_UNIT')]: UnitData = [], // 单位
      [getDictKey('PRFM_CAL_MODE')]: CalculateData = [], // 计算类型
    } = dictionary;
    const { indiData } = this.state;
    const commonDictKey = {
      titleKey: 'note',
      rowKey: 'ibm',
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const calMode = getFieldValue('calMode') || '';
    return (
      <Form className="m-form">
        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="数据列名" colon>
          {getFieldDecorator('fileColName', {
            initialValue: salaryTemplateConfData.name,
            rules: [{ required: true, message: '请输入数据列名' }],
          })(<Input />)}
          <span className="red">若计算类型为&quot;直接导入&quot;,则数据列名需与导入文件列名一致.</span>
        </Form.Item>
        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 7 }} label="关联指标" >
          {getFieldDecorator('corrIndi', {
            initialValue: salaryTemplateConfData.remk,
            rules: [{ required: true, message: '请选择关联指标' }],
          })(<CommonSelect className="esa-select" style={{ width: '100%' }} datas={indiData} placeholder="请选择关联指标" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 15 }} label="基础数据表列名" colon>
          {getFieldDecorator('bscColName', {
            initialValue: salaryTemplateConfData.name,
          })(<Input />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 7 }} label="数据单位" >
          {getFieldDecorator('fileColUnit', {
            initialValue: salaryTemplateConfData.remk,
            rules: [{ required: true, message: '请选择数据单位' }],
          })(<CommonSelect className="esa-select" style={{ width: '100%' }} {...commonDictKey} datas={UnitData} placeholder="请选择数据单位" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 7 }} label="数据类型" >
          {getFieldDecorator('fileColType', {
            initialValue: salaryTemplateConfData.remk,
            rules: [{ required: true, message: '请选择数据类型' }],
          })(<CommonSelect className="esa-select" style={{ width: '100%' }} {...commonDictKey} datas={TypeData} placeholder="请选择数据类型" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 7 }} label="计算类型" >
          {getFieldDecorator('calMode', {
            initialValue: salaryTemplateConfData.remk,
            rules: [{ required: true, message: '请选择计算类型' }],
          })(<CommonSelect className="esa-select" style={{ width: '100%' }} {...commonDictKey} datas={CalculateData} placeholder="请选择计算类型" />)}
        </Form.Item>
        {calMode === '2' ? (
          <Row >
            <Col sm={16} md={16} xxl={16} >
              <Form.Item labelCol={{ span: 6 }} label="计算公式" wrapperCol={{ span: 18 }} >
                <Row className="m-row">{operatorData.map((item, index) => (
                  <Col sm={6} md={4} xxl={4} >
                    <Button
                      key={`${index}`}
                      value={item.calExps}
                      style={{ height: '3rem', minWidth: '100%' }}
                      className="m-btn-radius m-btn-headColor"
                      onClick={() => this.handClick(item)}
                    >
                      {item.expsDescr}
                    </Button>
                  </Col>
                ))}
                </Row>
                {getFieldDecorator('calFmla', {
                  initialValue: salaryTemplateConfData.calFmla,
                  rules: [{ required: true, message: '计算公式内容不能为空' }],
                })(<TextArea
                  ref={(e) => { this._jsgsTextArea = e; }}
                  onChange={this.handleInputChange}
                  style={{ minHeight: '10rem' }}
                />)}
              </Form.Item>
            </Col>
            <Col sm={8} md={8} xxl={8} >
              <TreeSelect />
            </Col>
          </Row>
        ) : ''}
      </Form >
    );
  }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(LeftContent));
