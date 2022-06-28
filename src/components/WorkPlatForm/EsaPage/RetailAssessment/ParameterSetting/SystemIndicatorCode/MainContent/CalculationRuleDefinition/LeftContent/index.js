/* eslint-disable react/jsx-indent */
/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import lodash from 'lodash';
import { Row, Col, Form, Radio, Checkbox, Input } from 'antd';


const { TextArea } = Input;
class LeftContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bl: [], // 变量数组
      sydx: '1', // 适用对象
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

  onRadioChange = (e) => {
    this.setState({
      sydx: e.target.value,
    });
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
    const aftValue = `${preValue.substring(0, position)}${preValue.substring(position)}${str}`;
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

  addTag() {
    const nextKeys = this.state.bl.concat([this.uuid]);
    this.uuid = this.uuid + 1;
    this.setState({
      bl: nextKeys,
    }, () => {
      this.props.onBlChange(this.state.bl);
    });
  }

  removeTag(index) {
    // const { form } = this.props;
    // can use data-binding to get
    // const keys = form.getFieldValue('keys');
    const { bl } = this.state;
    // We need at least one passenger
    if (bl && bl.length === 0) {
      return;
    }
    // this.uuid = this.uuid - 1;

    // can use data-binding to set
    bl.splice(index, 1);
    this.setState({
      bl,
    }, () => {
      this.props.onBlChange(bl);
    });
    // form.setFieldsValue({
    //   bl,
    // });
  }

  // 动态渲染表单项
  renderTagFormItems = () => {
    const { form: { getFieldDecorator } } = this.props;

    const { bl } = this.state;

    const formItems = bl.map((k, index) => (
      <Form.Item
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        label={`变量${index + 1}`}
        required={false}
        key={k}
      >

        <Form.Item
          name="参数名称"
          rules={[{ required: false }]}
          style={{ display: 'inline-block', width: 'calc(20% - 5px)', marginRight: 8 }}
        >
          {
            getFieldDecorator(`参数名称${index + 1}`, {
              // initialValue: (operate === 'edit' && existingData.yyb) || orgid,
              rules: [{ required: false, message: '' }],
            })(<Input placeholder="参数名称" />)
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
              rules: [{ required: false, message: '' }],
            })(<Input placeholder="参数值" />)
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
              rules: [{ required: false, message: '' }],
            })(<Input placeholder="单位" />)
          }

        </Form.Item>
        <Form.Item
          name="描述"
          rules={[{ required: false }]}
          style={{ display: 'inline-block', width: 'calc(20% - 5px)' }}
        > {
            getFieldDecorator(`描述${index + 1}`, {
              // initialValue: (operate === 'edit' && existingData.yyb) || orgid,
              rules: [{ required: false, message: '' }],
            })(<Input placeholder="描述" />)
          }

        </Form.Item>
        {bl && (
          <span onClick={() => this.removeTag(index)}>
            <i className="iconfont info-iconfont icon-jianshao" />
          </span>
        )}


      </Form.Item>

    ));
    return formItems;
  }


  render() {
    const { form: { getFieldDecorator }, selectRowData } = this.props;
    const { jsfs } = selectRowData;

    const options = [
      { label: '服务关系', value: '1' },
      { label: '签约关系', value: '2' },
      { label: '考核服务关系', value: '3' },
      { label: '期货开发关系', value: '4' },
      { label: '开发关系', value: '5' },
      { label: '介绍维护关系', value: '6' },
    ];
    return (
      <Fragment>
        <div className="m-pgfa-left">
          <Form className=" m-form">
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="指标名称" >
              {
                getFieldDecorator('zbmc', {
                  initialValue: selectRowData ? selectRowData.zbmc : '',
                  rules: [{ required: false, message: '' }],
                })(<Input disabled />)
              }
            </Form.Item>
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="指标名称" >
              {
                getFieldDecorator('zbdm', {
                  initialValue: selectRowData ? selectRowData.zbdm : '',
                  rules: [{ required: false, message: '' }],
                })(<Input disabled />)
              }
            </Form.Item>

            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="适用对象" >
              {
                getFieldDecorator('sydx', {
                  initialValue: selectRowData ? selectRowData.sydx : '1',
                  rules: [{ required: true }],
                })(<Radio.Group
                  onChange={this.onRadioChange}
                  className="m-radio-group"
                >
                  <Radio value="1">客户</Radio>
                  <Radio value="2">个人</Radio>
                  <Radio value="3">团队</Radio>
                  <Radio value="4">部门</Radio>
                  <Radio value="5">营业部</Radio>
                  <Radio value="6">公司</Radio>

                </Radio.Group>) // eslint-disable-line
              }
            </Form.Item>
            {
              jsfs.indexOf('引用指标') !== -1 ? (
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="引用层级" >
                  {
                    getFieldDecorator('yycj', {
                      initialValue: selectRowData ? selectRowData.yycj : '1',
                      rules: [{ required: true, message: '请选择引用层级' }],
                    })(<Radio.Group
                      className="m-radio-group"
                    >
                      <Radio value="1">客户指标</Radio>
                      <Radio value="2">人员指标</Radio>
                      <Radio value="3">团队指标</Radio>
                       </Radio.Group>)
                  }

                </Form.Item>
              ) : ''
            }

            {
              jsfs.indexOf('引用数据源') !== -1 || jsfs.indexOf('自定义脚本') !== -1 ? (
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="关系类型" >
                  {
                    getFieldDecorator('gxlx', {
                      initialValue: selectRowData ? selectRowData.gxlx : '1',
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
                <span onClick={() => this.addTag()}>
                  <a style={{ float: 'right' }}>+添加</a>
                </span>
              </Col>
            </Row>

            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="计算公式" >
              {
                getFieldDecorator('jsgs', {
                  initialValue: '',
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
                  // initialValue: '1',
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

