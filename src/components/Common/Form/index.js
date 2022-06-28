import React from 'react';
import { Form as AntForm, Row, Col, TreeSelect, Radio } from 'antd';
import SelectInput from './SelectInput';
import BetweenInput from './BetweenInput';
import FuzzySearch from './FuzzySearch';
import TagPicker from '../TagPicker';
import SearchInput from '../Form/SearchInput';
import CommonSearchTags from './CommonSearchTags';
import Patterns from '../../../utils/pattern';
import Select from './Select';
import Input from './Input';
import DatePicker from './DatePicker';
import BetweenDatePicker from './BetweenDatePicker';

const { number } = Patterns;

const { Item: FormItem } = AntForm;
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExtends: this.props.forms.showExtends || false,
    };
  }
  // 读取option生成item
    getFields = () => {
      const { getFieldDecorator } = this.props.form;
      const { forms } = this.props;
      if (forms) {
        const { items } = forms;
        if (items) {
          return items.map((row) => {
            const { rowGutter, rowItems, rowKey, className = 'm-row-form', style } = row;
            return (
              <Row className={`${className}`} style={Object.assign({}, { marginLeft: '0.833rem', marginRight: '0.833rem' }, style)} gutter={rowGutter} key={rowKey}>
                {rowItems.map((item) => {
                  const { span = { span: 8 }, key, name, style: mStyle, type, datas, FormItemClassName = '' } = item;
                  let { initialValue, rules } = item;
                  const tempRules = rules;
                  let { itemStyle } = item;
                  if (!itemStyle) {
                    itemStyle = { labelSpan: 8, wrapperCol: 16 };
                  }
                  let defineRules;
                  const { labelSpan = 8, itemSpan = 16 } = itemStyle;
                  if (type) { // 设置自定义组件的初始值类型
                    switch (type) {
                      case 'SelectInput':
                        if (!initialValue) {
                          initialValue = {};
                        }
                        if (datas && datas.length > 0) {
                          initialValue = Object.assign(initialValue, {
                            selectValue: datas[0].value,
                          });
                        }
                        break;
                      case 'BetweenInput':
                        if (!initialValue) {
                          initialValue = {};
                        }
                        defineRules = (upRules, rule, value, callback) => {
                          let finalRules = upRules;
                          if (!finalRules) {
                            finalRules = {};
                          }
                          const { leftRules, rightRules } = finalRules;
                          let flag = true;
                          let mess = '';
                          finalRules = {
                            leftRules: { required: false, pattern: number, message: '请输入数字', ...leftRules },
                            rightRules: { required: false, pattern: number, message: '请输入数字', ...rightRules },
                          };
                          const { leftValue: left, rightValue: right } = value;
                          if (left) {
                            if (!finalRules.leftRules.pattern.test(left)) {
                              flag = false;
                              mess = finalRules.leftRules.message;
                            }
                          } else if (finalRules.leftRules.required) {
                              flag = false;
                              mess = '下限值为必填';
                            }
                            if (flag) {
                              if (right) {
                                if (!finalRules.rightRules.pattern.test(right)) {
                                  flag = false;
                                  mess = finalRules.rightRules.message;
                                }
                              } else if (finalRules.rightRules.required) {
                                flag = false;
                                mess = '上限值为必填';
                              }
                            }
                            if (!flag) {
                              callback(mess);
                            } else {
                              callback();
                            }
                        };
                        rules = [{ validator: (rule, value, callback) => { defineRules(tempRules, rule, value, callback); } }];
                        break;
                      case 'FuzzySearch':
                        if (!initialValue) {
                          initialValue = {};
                        }
                        break;
                      default:
                        break;
                    }
                  }
                  return (
                    <Col {...span} style={mStyle} key={key}>
                      {
                      type === 'Button' ? this.renderButton(item) : (
                        <FormItem className={`m-form-item ${FormItemClassName}`} label={name} labelCol={{ span: labelSpan }} wrapperCol={{ span: itemSpan }}>
                          {getFieldDecorator(key, { initialValue, rules })(this.formItem(item))}
                        </FormItem>
                      )
                    }
                    </Col>
                  );
              })}
              </Row>
            );
          });
        }
      }
    }
    formItem=(element) => {
      const { onSelect, onChange, labelName } = element;
      const { setFieldsValue } = this.props.form;
      let optipons = {};
      switch (element.type) {
        case 'Auto':
          return element.content;
        case 'SearchInput':
          return <SearchInput {...element} />;
        case 'SelectInput':
          return <SelectInput datas={element.datas} />;
        case 'BetweenInput':
          return <BetweenInput labelName={labelName} />;
        case 'BetweenDatePicker':
          return <BetweenDatePicker labelName={labelName} />;
        case 'FuzzySearch':
          return <FuzzySearch />;
        case 'TagPicker':
          return <TagPicker {...element} dataSource={element.datas} />;
        case 'singleSelect':
          return <Select style={{ width: '100%', minWidth: '200px' }} onSelect={onSelect} labelName={labelName} {...element} />;
        case 'Input':
          return <Input {...element} />;
        case 'multiSelect':
          return (
            <Select mode="multiple">
              {element.datas.map(item =>
                <Select.Option disabled={item.disable} key={item.key} value={item.value}>{item.lable}</Select.Option>)}
            </Select>
          );
        case 'singleTreeSelect':
          return (
            <TreeSelect
              treeData={element.datas}
              placeholder="请选择"
            />
          );
        case 'DatePicker':
          return (
            <DatePicker {...element} />
          );
        case 'multiTreeSelect':
          return (
            <TreeSelect
              treeCheckable
              treeData={element.datas}
              placeholder="请选择"
            />
          );
        case 'CommonSearchTags':
          return <CommonSearchTags {...element} />;
        case 'radio':
          if (onChange) {
            optipons = Object.assign(optipons, { onChange: (value) => { onChange(this.props.dispatch, value, setFieldsValue); } });
          }
          return (
            <Radio.Group {...optipons}>
              {element.datas.map(item =>
                <Radio key={item.key} value={item.value}>{item.lable}</Radio>)}
            </Radio.Group >
          );
        case 'radioButtons':
          if (onChange) {
            optipons = Object.assign(optipons, { onChange: (value) => { onChange(this.props.dispatch, value, setFieldsValue); } });
          }
          return (
            <Radio.Group {...optipons} className={element.className}>
              {element.datas.map(item =>
                <Radio.Button key={item.key} value={item.value}>{item.lable}</Radio.Button>)}
            </Radio.Group >
          );
        default:
          return <Input placeholder={`${element.placeholder || ''}`} />;
      }
    }
      handleSearch = () => {
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const { forms: { ok } } = this.props;
            if (ok) {
              ok(values);
            }
          }
        });
      }
      handleSave = () => {
        const { forms: { save } } = this.props;
        if (save) {
          save();
        }
      }
      handleReset = () => {
        const { forms: { cancel } } = this.props;
        if (cancel) {
          cancel();
        }
        this.props.form.resetFields();
      }
    // 渲染form表单中的按钮
    renderButton = (item) => {
      const { className, action } = item;
      switch (action) {
        case 'Search':
          return <button onClick={this.handleSearch} className={`${className || 'm-btn-radius m-btn-headColor ant-btn'}`}>查询</button>;
        case 'Save':
          return <button onClick={this.handleSave} type="button" className="m-btn-radius m-btn-radius-small ant-btn m-btn-headColor" style={{ marginLeft: '1rem' }}><i className="iconfont icon-preservation" /></button>;
        default:
          return null;
      }
    }
    render() {
      const { exTends = true, className = 'm-form', style } = this.props.forms;
      return (
        <AntForm style={style} className={`${className} ${this.state.showExtends ? '' : 'm-form-show'}`}>
          {this.getFields()}
          {/* <Row className="m-row-form" style={{ display: this.state.type === 'window' ? 'none' : '' }}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={this.handleSearch}>查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  清空
                </Button>
              </Col>
            </Row> */}
          <div onClick={() => this.setState({ showExtends: !this.state.showExtends })} style={{ display: exTends ? '' : 'none' }} className="m-operation-box">
            <div className="m-operation-btn">收起<span><i className="iconfont icon-up-line-arrow" style={{ fontSize: '1rem' }} /></span>
            </div>
            <div className="m-operation-btn-two">展开<span><i className="iconfont icon-diwn-line-arrow" style={{ fontSize: '1rem' }} /></span>
            </div>
          </div>
        </AntForm>
      );
    }
}
export default AntForm.create()(Form);
