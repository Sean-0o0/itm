/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import lodash from 'lodash';
import { Row, Col, Form, Radio, Checkbox, Input } from 'antd';
import { getDictKey } from '../../../../../../utils/dictUtils';



const { TextArea } = Input;
class LeftContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // sydx: '', // 适用对象
    };
    this.uuid = 0; // 变量数组增加的种子
  }


  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectIndex !== this.props.selectIndex) {
      this.editJsgs(nextProps.jsgsData);
    }
  }


  // 变量数值变化
  onValschange = (e, objKey, index) => {
    this.props.editVariable(e.target.value, objKey, index);
  }

  // 编辑计算公式输入框
  editJsgs = (data) => {
    const str = data.value;

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
    const preValue = getFieldValue('jsgs') || '';
    const aftValue = `${preValue.substring(0, position)}${str}${preValue.substring(position)}`;
    setFieldsValue({ jsgs: aftValue });
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

  // 添加表单变量项
  addTag() {
    this.props.addVariable();
  }

  // 移除表单变量项
  removeTag(index) {
    this.props.deleteVariable(index);
  }
  radioOnchange = (e) => {
    const { changeDataTier } = this.props;
    if (changeDataTier) {
      changeDataTier(e.target.value)
    }
  }
  // 动态渲染表单项
  renderTagFormItems = () => {
    const { form: { getFieldDecorator }, Variable } = this.props;
    const formItems = Variable.map((k, index) => (
      <Form.Item
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label={`变量${index + 1}`}
        required={false}
        key={`变量${index + 1}`}
      >
        <Form.Item
          name="参数名称"
          rules={[{ required: true }]}
          style={{ display: 'inline-block', width: 'calc(20% - 5px)', marginRight: 8 }}
        >
          {
            getFieldDecorator(`参数名称${index + 1}`, {
              // initialValue: (operate === 'edit' && existingData.yyb) || orgid,
              initialValue: k.expsDescr,
              rules: [{ required: true, message: `变量${index + 1}名称不能为空!` }],
            })(<Input placeholder="参数名称" onChange={(e) => { this.onValschange(e, 'expsDescr', index); this.onValschange(e, 'calExps', index); }} />)
          }

        </Form.Item>
        <Form.Item
          name="参数值"
          rules={[{ required: false }]}
          style={{ display: 'inline-block', width: 'calc(20% - 5px)', marginRight: 8 }}
        >
          {
            getFieldDecorator(`参数值${index + 1}`, {
              // initialValue: (operate === 'edit' && existingData.yyb) || orgid,
              initialValue: k.seq,
              rules: [{ required: false, message: '' }],
            })(<Input placeholder="参数值" onChange={(e) => { this.onValschange(e, 'seq', index); }} />)
          }

        </Form.Item>
        <Form.Item
          name="单位"
          rules={[{ required: false }]}
          style={{ display: 'inline-block', width: 'calc(20% - 5px)', marginRight: 8 }}
        >
          {
            getFieldDecorator(`单位${index + 1}`, {
              // initialValue: (operate === 'edit' && existingData.yyb) || orgid,
              initialValue: k.dw,
              rules: [{ required: false, message: '' }],
            })(<Input placeholder="单位" onChange={(e) => { this.onValschange(e, 'dw', index); }} />)
          }

        </Form.Item>
        <Form.Item
          name="描述说明"
          rules={[{ required: false }]}
          style={{ display: 'inline-block', width: 'calc(20% - 5px)' }}
        > {
            getFieldDecorator(`描述${index + 1}`, {
              // initialValue: (operate === 'edit' && existingData.yyb) || orgid,
              initialValue: k.sm,
              rules: [{ required: false, message: '' }],
            })(<Input placeholder="描述" onChange={(e) => { this.onValschange(e, 'sm', index); }} />)
          }
        </Form.Item>
        <span onClick={() => this.removeTag(index)}>
          <i className="iconfont info-iconfont icon-jianshao" />
        </span>
      </Form.Item>
    ));
    return formItems;
  }


  render() {
    const { form: { getFieldDecorator }, ruleData = [], dictionary } = this.props;
    const { [getDictKey('TINDI_DEF_RELA_TYPE')]: gxlxList = [] } = dictionary;

    // 计算方式 1|引用数据源;2|引用过程;3|引用指标;4|自定义脚本
    const { calMode = '', relaType = '' } = ruleData;
    const valueArr = relaType.split(',');

    const options = [
      // { label: '服务关系', value: '1' },
      // { label: '签约关系', value: '2' },
      // { label: '考核服务关系', value: '3' },
      // { label: '期货开发关系', value: '4' },
      // { label: '开发关系', value: '10' },
      // { label: '介绍维护关系', value: '6' },
    ];

    const objRange = [
      { label: '客户', value: '1' },
      { label: '个人', value: '2' },
      { label: '团队', value: '3' },
      { label: '部门', value: '4' },
      { label: '营业部', value: '5' },
      { label: '公司', value: '7' },
    ];
    if (gxlxList.length > 0) {
      // eslint-disable-next-line array-callback-return
      gxlxList.map((item) => {
        const obj = {
          label: item.note,
          value: item.ibm,
        };
        options.push(obj);
      });
    }
    return (
      <Fragment>
        <div className="m-pgfa-left">
          <Form className=" m-form">
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="指标名称" >
              {
                getFieldDecorator('zbmc', {
                  initialValue: ruleData.length !== 0 ? ruleData.indiName : '',
                  rules: [{ required: false, message: '' }],
                })(<Input disabled />)
              }
            </Form.Item>
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="指标代码" >
              {
                getFieldDecorator('zbdm', {
                  initialValue: ruleData.length !== 0 ? ruleData.indiCode : '',
                  rules: [{ required: false, message: '' }],
                })(<Input disabled />)
              }
            </Form.Item>

            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="适用对象" >
              {
                getFieldDecorator('sydx', {
                  initialValue: ruleData.length !== 0 ? ruleData.objRange : '',
                  rules: [{ required: true }],
                })(<Radio.Group
                  disabled
                  // onChange={this.onRadioChange}
                  className="m-radio-group"
                >
                  {objRange.map(item => {
                    return <Radio value={item.value}>{item.label}</Radio>
                  })}
                </Radio.Group>) // eslint-disable-line
              }
            </Form.Item>
            {
              calMode === '3' ? (
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="引用层级" >
                  {
                    getFieldDecorator('yycj', {
                      initialValue: ruleData.length !== 0 ? ruleData.refLvl : '',
                      rules: [{ required: true, message: '请选择引用层级' }],
                    })(<Radio.Group
                      className="m-radio-group"
                      onChange={this.radioOnchange}
                    >
                      {objRange.map((item, index) => {
                        if (index < ruleData.objRange) {
                          return <Radio value={item.value}>{item.label}</Radio>
                        }
                        return '';
                      })}
                    </Radio.Group>)
                  }

                </Form.Item>
              ) : ''
            }

            {
              calMode === '1' || calMode === '4' ? (
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="关系类型" >
                  {
                    getFieldDecorator('gxlx', {
                      initialValue: ruleData.length !== 0 ? valueArr : '',
                      rules: [{ required: true, message: '请选择关系类型' }],
                    })(<Checkbox.Group
                      className="m-checkbox-group"

                      options={options}
                    />)
                  }
                </Form.Item>
              ) : ''
            }

            {this.renderTagFormItems()}

            <Row style={{ padding: '0 0 1.5rem 0' }}>
              <Col xs={10} sm={10} lg={10}>
                <span onClick={() => this.addTag()} className="esa-add">
                  <a style={{ float: 'right' }}>+添加</a>
                </span>
              </Col>
            </Row>

            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label={calMode === '4' ? 'SQL语句' : calMode === '2' ? '执行过程' : '计算公式'} >
              {
                getFieldDecorator('jsgs', {
                  initialValue: ruleData.length !== 0 ? ruleData.calExps : '',
                  rules: [{ required: true, message: '请输入计算公式' }],
                })(<TextArea
                  className="m-input"
                  //  disabled
                  autoSize={{ minRows: 2 }}
                  ref={(e) => { this._jsgsTextArea = e; }}
                />) // eslint-disable-line
              }

            </Form.Item>
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="限制条件" >
              {
                getFieldDecorator('xztj', {
                  initialValue: ruleData.length !== 0 ? ruleData.restrCond : '',

                  rules: [{ required: false }],
                })(<TextArea
                  className="m-input"
                  //  disabled
                  autoSize={{ minRows: 2 }}
                />) // eslint-disable-line
              }


            </Form.Item>

            {/* </FormItem> */}


          </Form>
        </div>
      </Fragment>
    );
  }
}
//
// export default LeftContent;
export default Form.create({})(LeftContent);

