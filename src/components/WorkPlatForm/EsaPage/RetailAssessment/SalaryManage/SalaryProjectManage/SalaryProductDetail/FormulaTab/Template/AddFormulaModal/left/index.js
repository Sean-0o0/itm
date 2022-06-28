/* eslint-disable no-mixed-operators */
import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import Moment from 'moment';
import { Form, Row, Col, Input, TreeSelect, DatePicker, Radio, message } from 'antd';
import CommonSelect from '../../../../../../../../../../Common/Form/Select';
// import { FetchRoyaltyFormulaVariableQuery } from '../../../../../../../../../../../services/salaryAssessment';
// import { FetchQueryStaffCategoryLevel } from '../../../../../../../../../../../services/staffrelationship/index';
import ExaminersModal from '../../../../../../../PerformanceAppraisal/Common/\/AddEditAppraisalPlan/ExaminersModal'
import ApplyTemp from './CalcTypes/ApplyTemp';

class SalaryPlan extends React.Component {
  state = {
    ryDatas: this.props.ryDatas,
    orgNo:this.props.existingData.orgNo,
    examinerModal: {
      visible: false,
      selectedKeys: {},
      handleOk: this.handleExaminersSelected,
      onCancel: this.onExaminerCancel,
    },
  }

  componentDidMount = () => {
    // this.FetchRoyaltyFormulaVariableQuery();
    this.isFirst = true;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.existingData.orgNo&&(nextProps.existingData.orgNo!==this.props.existingData.orgNo)){
      this.isFirst = true;
      this.handleYybChange(nextProps.existingData.orgNo)
    }
    // 点击操作符或者树形数据
    if (nextProps.selectIndex !== this.props.selectIndex) {
      this.editJsgs(nextProps.jsgsData);
    }

    // 计算公式手动输入改变
    if (nextProps.inputChangeIndex !== this.props.inputChangeIndex) {
      this.handleJsgsgsChange();
    }
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
    // 更新说明
    this.handleFmlaDescChange(data.data);
  }

  // 计算公式编辑框手动输入改变
  handleJsgsInputChange = () => {
    // 经过父组件方法传入改变 避免在输入时内容不一致

    this.props.handelInputChange();
    // this.handleJsgsgsChange();
  }

  //处理营业部变化时人员的变化
  handleYybChange = (e) => {
    const { form: { setFieldsValue } } = this.props;
    if (!this.isFirst) {
      setFieldsValue({ jsry: '', empName:'' });
    }
    this.isFirst = false;
  }

     // // 选择人员
     handleExaminerSelect = () => {
      const { examinerModal } = this.state;
      this.setState({ examinerModal: { ...examinerModal, visible: true } });
    }
    // // 考核人员取消
    onExaminerCancel = () => {
      const { examinerModal } = this.state;
      const { form: { resetFields } } = this.props;
      examinerModal.selectedKeys = {};
      this.props.form.setFieldsValue({ empName: '', jsry: '' });
      this.setState({ examinerModal: { ...examinerModal, visible: false }, ry: '' });
    }
    // 选中考核人员
    handleExaminersSelected = (record = {}) => {
      this.setState({ examinerModal: { visible: false, selectedKeys: record }, ry: record.EMP_NO });
      this.props.form.setFieldsValue({ empName: record.EMP_NAME || '', jsry: record.EMP_NO });
    }



  handleJsgsgsChange = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    let formula = getFieldValue('jsgs') || '';
    // // 替换运算符和指标
    // if (flag) {
    //   data.forEach((item) => {
    //     const { regStr = '', expsDescr = '' } = item;
    //     let regExp = '';
    //     regExp = new RegExp(regStr, 'g');
    //     formula = formula.replace(regExp, expsDescr);
    //   });
    this.handleFmlaDescChange(this.props.jsgsData.data);
    // }
  }

  handleFmlaDescChange = (data) => {
    const flag = data && data.length;
    const { getFieldValue, setFieldsValue } = this.props.form;
    let formula = getFieldValue('jsgs') || '';
    // 替换运算符和指标
    if (flag) {
      data.forEach((item) => {
        const { regStr = '', expsDescr = '' } = item;
        let regExp = '';
        regExp = new RegExp(regStr, 'g');
        formula = formula.replace(regExp, expsDescr);
      });
    }
    setFieldsValue({ gsms: formula });
  }


  render() {
    const { version, form: { getFieldDecorator, getFieldsValue }, rightData = {}, gxyybDatas = [], userBasicInfo: { orgid }, updatePayload, payload, existingData = {}, operate = '', ryDatas = [] } = this.props;
    const { examinerModal } = this.state;
    const calcType = getFieldsValue().jsfs || (operate === 'edit' && existingData.calMode) || '1';
    return (
      <div className="m-pgfa-left">
        <Form className="m-form-default ant-form-horizontal ant-advanced-search-form">
          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="名称" >
                <span style={{ fontSize: '1.086rem' }}>{rightData.payName}</span>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="营业部" >
                {
                  getFieldDecorator('yyb', {
                    initialValue: (operate === 'edit' && existingData.orgNo) || orgid,
                    rules: [{ required: true, message: '请选择营业部' }],
                  })(<TreeSelect
                    className="esa-xcxmgl-select"
                    showSearch
                    treeData={gxyybDatas}
                    placeholder="请选择营业部"
                    searchPlaceholder="搜索..."
                    multiple={false}
                    filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    style={{ width: '100%' }}
                    onChange={this.handleYybChange}
                  />)
                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="考核对象" colon={false} >
                  {getFieldDecorator('empName', {
                    initialValue: operate === 'edit' && existingData.empName || '',
                    rules: [{ required: true, message: '请选择考核对象' }],
                  })(<Input placeholder="点击选择人员" readOnly onClick={() => this.handleExaminerSelect()} style={{ cursor: 'pointer' }} />
                  )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} style={{ display: "none" }} >
              <Form.Item labelCol={{ span: 12 }}  wrapperCol={{ span: 12 }} className="m-form-item" label="考核人员编号" >
                {getFieldDecorator('jsry', {
                  initialValue: operate === 'edit' && existingData.empNo || '',
                })(<Input
                />)
                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item   esa-datepick" label="月份" >
                {
                  getFieldDecorator('ksyf', {
                    initialValue: (operate === 'edit' && existingData.beginMon && new Moment(`${existingData.beginMon}01`)) || new Moment().add(-1, 'M'),
                    rules: [{ required: true, message: '请选择开始月份' }],

                  })(<DatePicker.MonthPicker format="YYYYMM" className="esa-xcxmgl-select" placeholder="请选择开始月份" />)
                }
                <span style={{ fontSize: '1.086rem', margin: '0 1rem' }}>-</span>
                {
                  getFieldDecorator('jsyf', {
                    initialValue: (operate === 'edit' && existingData.endMon && new Moment(`${existingData.endMon}01`)) || null,
                    rules: [{ required: true, message: '请选择结束月份' }],
                  })(<DatePicker.MonthPicker format="YYYYMM" className="esa-xcxmgl-select" placeholder="请选择结束月份" />)
                }
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={24} md={24} xxl={24} >
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item   esa-raido" label="计算方式" >
                {
                  getFieldDecorator('jsfs', {
                    initialValue: (operate === 'edit' && existingData.calMode) || '1',
                    rules: [{ required: true }],
                  })(<Radio.Group
                    className="m-radio-group"
                  >
                    <Radio value="1">套用模板</Radio>
                    <Radio value="2">常量</Radio>
                    <Radio value="3">表达式计算</Radio>
                    <Radio value="4">手工录入</Radio>
                  </Radio.Group>) // eslint-disable-line
                }
              </Form.Item>
            </Col>
          </Row>

          {/* 套用模板 */}
          {
            calcType === '1' && (<ApplyTemp version={version} templateInitArr={this.props.templateInitArr} updatePayload={updatePayload} onSelectTemplate={this.props.onSelectTemplate} templateArr={this.props.templateArr} payload={payload} existingData={existingData} operate={operate} onTemplateArrChange={this.props.onTemplateArrChange} />)

          }

          {/* 常量值 */}
          {
            calcType === '2' && (
              <Row>
                <Col sm={24} md={24} xxl={24} >
                  <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-xcxmgl-select" label="常量值">
                    {
                      getFieldDecorator('clz', {
                        initialValue: operate === 'edit' && existingData.calMode === '2' && existingData.calFmla || '',
                        rules: [{ required: true, message: '请输入常量值' }],
                      })(<Input placeholder="请输入常量值" />)
                    }
                  </Form.Item>
                </Col>
              </Row>
            )
          }

          {/* 表达式计算 */}
          {
            calcType === '3' && (
              <React.Fragment>
                <Row>
                  <Col sm={24} md={24} xxl={24} >
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-xcxmgl-select" label="计算公式">
                      {
                        getFieldDecorator('jsgs', {
                          initialValue: (operate === 'edit' && existingData.calMode === '3' && existingData.calFmla) || '',
                          rules: [{ required: true, message: '计算公式内容不能为空' }],
                        })(<Input.TextArea placeholder="" style={{ minWidth: '9.5rem' }} ref={(e) => { this._jsgsTextArea = e; }} onChange={this.handleJsgsInputChange} autosize={{ minRows: 4 }} />)
                      }
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col sm={24} md={24} xxl={24} >
                    <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item esa-xcxmgl-select" label="公式描述">
                      {
                        getFieldDecorator('gsms', {
                          initialValue: (operate === 'edit' && existingData.calMode === '3' && existingData.fmlaDesc) || '',
                        })(<Input.TextArea disabled placeholder="" style={{ minWidth: '9.5rem' }} autosize={{ minRows: 4 }} />)
                      }
                    </Form.Item>
                  </Col>
                </Row>
              </React.Fragment>
            )
          }
        </Form>
        <ExaminersModal
              {...examinerModal}
              orgNo={getFieldsValue().yyb}
              handleOk={this.handleExaminersSelected}
              onCancel={this.onExaminerCancel}
              modalProps={{ bodyStyle: { maxHeight: '55rem', overflow: 'auto' } }}
            />
      </div>
    );
  }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  // gxyybDatas: code.gxyybDatas,
}))(SalaryPlan));
