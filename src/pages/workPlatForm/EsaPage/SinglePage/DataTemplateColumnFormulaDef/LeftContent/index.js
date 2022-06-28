/* eslint-disable react/sort-comp */
/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { Form, Row, Col, Input, Button, message } from 'antd';

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
    this.props.onRef(this);
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
    const {selectItem } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="m-form">
          <Row >
            <Col sm={24} md={24} xxl={16} >
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
                  initialValue: selectItem.calExpsDisp || '',
                  rules: [{ required: true, message: '计算公式内容不能为空' }],
                })(<TextArea
                  ref={(e) => { this._jsgsTextArea = e; }}
                  onChange={this.handleInputChange}
                  style={{ minHeight: '10rem' }}
                />)}
              </Form.Item>
            </Col>
          </Row>
        )
      </Form >
    );
  }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(LeftContent));
