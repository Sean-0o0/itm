import React, { Component, Fragment } from 'react';
import { Form, Input, Row, Col, Select } from 'antd';
/**
 * 基本信息
 */
class BaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yyb: this.props.deptList
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    if (typeof onRef === 'function') {
      onRef(this);
    }
  }
  // 年度选择
  handleAssessmentYearSelect=() => {
    const { handleAssessmentYearSelect } = this.props;
    if (typeof handleAssessmentYearSelect === 'function') {
      handleAssessmentYearSelect();
    }
  }
  // 营业部选择
  handleSalesDepartmentSelect=() => {
    const { handleSalesDepartmentSelect } = this.props;
    if (typeof handleSalesDepartmentSelect === 'function') {
      handleSalesDepartmentSelect();
    }
  }
  // 部门类别选择
  handleDepClassSelect=(value) => {
    const { handleDepClassSelect } = this.props;
    if (typeof handleDepClassSelect === 'function') {
      handleDepClassSelect(value);
    }
  }
  // 考核区域选择
  handleAreaSelect=(value) => {
    const { handleAreaSelect } = this.props;
    if (typeof handleAreaSelect === 'function') {
      handleAreaSelect(value);
    }
  }
  handleInput = (e) => {
    const relateMap = new Map([['coExamWeight', 'orgExamWeight'], ['orgExamWeight', 'coExamWeight'], ['coRequiredWeight', 'coOptionalWeight'], ['coOptionalWeight', 'coRequiredWeight']]);
    const relateName = relateMap.get(e.target.id);
    if (e.target.value !== '') {
      this.props.form.setFieldsValue({ [relateName]: Number(100 - e.target.value) });
    }
  }
  // 表单校验
  validateForm=() => {
    let params = null;
    this.props.form.validateFields((e, values) => {
      if (!e) {
        params = values;
      }
    });
    return params;
  }
  changeFieldValue=(payload) => {
    this.props.form.setFieldsValue({ ...payload });
  }
  validator = (rule, value, callback) => {
    let fieldName;
    let min = 0;
    let max = 100;
    const { field } = rule;
    switch (field) {
      case 'coExamWeight':
        fieldName = '公司';
        min = 0;
        max = 1000;
        break;
      case 'orgExamWeight':
        fieldName = '营业部';
        min = 0;
        max = 1000;
        break;
      case 'coRequiredWeight':
        fieldName = '公司可选';
        break;
      case 'coOptionalWeight':
        fieldName = '公司必选';
        break;
      default:
    }
    if (value === '') {
      callback(`请输入${fieldName}指标权重！`);
    } else if (Number(value) > max || Number(value) < min) {
      callback('权重值必须在指定范围内！');
    } else {
      callback();
    }
  }
  render() {
    const { vorgName, form = {}, type, depClass = [], planDetail = {}, deptList, area } = this.props;
    let isFix = true;
    if(type === '2' && planDetail.orgNo !== '1'){
      isFix = false;
    }
    const { getFieldDecorator } = form;
    const date = new Date();
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const formItemLayoutLongLabel = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      <Fragment>
        <Form className="m-form esa-form">
          <Row gutter={16}>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
              <Form.Item label={<span className="fwb">基本信息</span>} required colon={false} />
            </Col>
            <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
              <Form.Item {...formItemLayout} label="方案名称">
                {
                  getFieldDecorator('tmplName', {
                    initialValue: planDetail.tmplName || `${deptList.yybmc || ''}${date.getFullYear()}${date.getMonth() <= 7 ? '上半年' : '下半年'}绩效考核方案` || '',
                    rules: [{ required: true, message: '请输入方案名称！' }],
                  })(<Input readOnly/>)
                }
              </Form.Item>
            </Col>
            <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
              <Form.Item {...formItemLayout} label="考核年度">
                {
                  getFieldDecorator('examYear', {
                    initialValue: planDetail.examYearName || `${date.getFullYear()}${date.getMonth() <= 7 ? '上半年' : '下半年'}` || '',
                    rules: [{ required: true, message: '请选择考核年度！' }],
                  })(<Input.Search onSearch={() => this.handleAssessmentYearSelect()} readOnly />)
                }
              </Form.Item>
            </Col>
          </Row>
          {
          type !== '0' && (
          <Fragment>
            <Row gutter={16}>
              <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item {...formItemLayout} label="营业部">
                  {
                    getFieldDecorator('orgName', {
                      initialValue: vorgName || planDetail.orgName || deptList.yybmc || '',
                      rules: [{ required: true, message: '请选择营业部！' }],
                    })(<Input.Search disabled={vorgName} onSearch={() => this.handleSalesDepartmentSelect()} readOnly />)
                  }
                </Form.Item>
              </Col>
              <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item {...formItemLayout} label="部门类别">
                  {
                    getFieldDecorator('depClass', {
                      initialValue: planDetail.depClass || undefined,
                      rules: [{ required: true, message: '请选择部门类别！' }],
                    })(<Select
                      // getPopupContainer={node => node}
                      className="m-select m-select-default esa-select"
                      placeholder="请选择"
                      onSelect={this.handleDepClassSelect}
                    >
                      {
                        depClass.map(item => (
                          <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>
                        ))
                      }
                      {/* eslint-disable-next-line react/jsx-indent */}
                       </Select>)
                  }
                </Form.Item>
              </Col>
              </Row>
              {
                isFix && deptList.fid === '0' && (<Row><Col sm={11} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item {...formItemLayout} label="考核地区">
                  {
                    getFieldDecorator('area', {
                      initialValue: planDetail.area || '',
                      rules: [{ required: true, message: '请输入考核地区！' }],
                    })(<Select
                      // getPopupContainer={node => node}
                      className="m-select m-select-default esa-select"
                      placeholder="请选择"
                      onSelect={this.handleAreaSelect}
                    >
                      {
                        area.map(item => (
                          <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>
                        ))
                      }
                      {/* eslint-disable-next-line react/jsx-indent */}
                       </Select>)
                  }
                </Form.Item>
              </Col>
              </Row>)
              }
            <Row gutter={16}>
            <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item {...formItemLayoutLongLabel} label="公司考核指标权重(0%-100%)" required>
                  {
                    getFieldDecorator('coExamWeight', {
                      initialValue: planDetail.coExamWeight || '',
                      rules: [
                        { validator: this.validator },
                      ],
                    })(<Input type="number" onInput={this.handleInput} />)
                  }
                </Form.Item>
              </Col>
              <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item {...formItemLayoutLongLabel} label="营业部考核指标权重(0%-100%)" required>
                  {
                    getFieldDecorator('orgExamWeight', {
                      initialValue: planDetail.orgExamWeight || '',
                      rules: [
                        { validator: this.validator },
                      ],
                    })(<Input type="number" onInput={this.handleInput} />)
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
            <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item {...formItemLayoutLongLabel} label="公司必选指标权重(0%-100%)" required>
                  {
                    getFieldDecorator('coRequiredWeight', {
                      initialValue: planDetail.coRequiredWeight || '',
                      rules: [
                        { validator: this.validator },
                      ],
                    })(<Input type="number" onInput={this.handleInput} />)
                  }
                </Form.Item>
              </Col>
              <Col sm={11} md={11} lg={11} xl={11} xxl={11}>
                <Form.Item {...formItemLayoutLongLabel} label="公司可选指标权重(0%-100%)" required>
                  {
                    getFieldDecorator('coOptionalWeight', {
                      initialValue: planDetail.coOptionalWeight || '',
                      rules: [
                        { validator: this.validator },
                      ],
                    })(<Input type="number" onInput={this.handleInput} />)
                  }
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
          )
        }
        </Form>
      </Fragment>
    );
  }
}

export default Form.create()(BaseInfo);
