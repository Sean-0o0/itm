/* eslint-disable no-console */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Form, Input, Select } from 'antd';
import { getDictKey } from '../../../../../../../utils/dictUtils';
import { connect } from 'dva';
/**
 * 考核项新增修改
 */
class AssessProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bizDictionaryData: [],
      formData: {},
    };
  }
  componentWillMount =() => {
    // 获取考核项分类字典
    const { [getDictKey('PRFM_ITM_CLSS')]:bizDictionaryData=[]} = this.props.dictionary;
    // const bizDictionaryData = [
    //   { note: '财务指标', ibm: '1' },
    //   { note: '组织效率指标', ibm: '2' },
    //   { note: '市场排名及业务管理指标', ibm: '3' },
    // ];
    this.setState({
      bizDictionaryData,
    });
    const formData = {};
    const { selectItem = {}, opTp } = this.props;
    if (opTp === '1') {
      formData.prntitemNo = selectItem.itemNo;
      formData.prntItmName = selectItem.itemAbbr;
      formData.itemFullName = '';
      formData.itemAbbar = '';
      formData.itemNo = '';
      // formData.itemClass = selectItem.itemClass;
      // formData.itemClassName = selectItem.itemClassName;
      formData.remk = '';
    } else {
      formData.prntitemNo = selectItem.prntitemNo;
      formData.prntItmName = selectItem.prntItmName;
      formData.itemFullName = selectItem.itemFullName;
      formData.itemAbbar = selectItem.itemAbbr;
      formData.itemNo = selectItem.itemNo;
      formData.itemClass = selectItem.itemClass;
      formData.itemClassName = bizDictionaryData.find(item => item.ibm === selectItem.itemClass).note;
      formData.remk = selectItem.remk;
    }
    this.setState({
      formData,
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { bizDictionaryData, formData } = this.state;
    const { opTp } = this.props;
    return (
      <Fragment>
        <div style={{ padding: '2rem 0' }}>
          <Form className="esa-assessmentItem-form" labelCol={{ span: 8 }} wrapperCol={{ span: 10 }}>
            <Form.Item label="上级考核项：" >
              {formData.prntItmName}
              {
              getFieldDecorator('prntItemNo', {
              initialValue: formData.prntitemNo || '-1',
             })}
            </Form.Item>
            <Form.Item label="考核项全称：" >
              {opTp === '1' || opTp === '2' ?
              getFieldDecorator('itemFullName', {
              initialValue: formData.itemFullName,
              rules: [{
                required: true,
                message: '考核项全称不能为空',
              }] })(<Input />) : formData.itemFullName}
            </Form.Item>
            <Form.Item label="考核项简称：" >
              {opTp === '1' || opTp === '2' ?
              getFieldDecorator('itemAbbar', {
              initialValue: formData.itemAbbar,
              rules: [{
                required: true,
                message: '考核项简称不能为空',
              }] })(<Input />) : formData.itemAbbar}
            </Form.Item>
            <Form.Item label="考核项编码：" >
              {opTp === '1'?
              getFieldDecorator('itemNo', {
              initialValue: formData.itemNo,
              rules: [{
                required: true,
                message: '考核项编码不能为空',
              }] })(<Input />) : formData.itemNo}
            </Form.Item>
            <Form.Item label="考核项分类：" >
              {opTp === '1' || opTp === '2' ?
              getFieldDecorator('itemClass', {
              initialValue: formData.itemClass,
              rules: [{
                required: true,
                message: '考核项分类不能为空',
              }] })(<Select showSearch optionFilterProp="children">
                {bizDictionaryData.map((item) => {
                  return <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>;
                })}
              </Select>) : formData.itemClassName}
            </Form.Item>

            <Form.Item label="说明：" >
              {opTp === '1' || opTp === '2' ?
              getFieldDecorator('remk', {
              initialValue: formData.remk,
              rules: [{
                required: false,
              }] })(<Input.TextArea rows={4} />) : formData.remk}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(AssessProject));
