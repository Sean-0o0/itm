/* eslint-disable react/sort-comp */
import React, { Component, Fragment } from 'react';
import { Input, Form, Select, InputNumber } from 'antd';
/**
 * 级别考核方案-考核标准
 */
class AssessmentCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 精确4位小数
  limitDecimals = (value) => {
    // eslint-disable-next-line no-useless-escape
    const reg = /^(\-)*(\d+)\.(\d{1,4}).*$/;
    let reValue = '0.0000';
    if (typeof value === 'string') {
      reValue = !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '0.0000';
    } else if (typeof value === 'number') {
      reValue = !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '0.0000';
    }
    if (reValue === '') {
      reValue = '0.0000';
    }
    return reValue;
  };

  handleExamStd = (value) => {
    const { handleExamStd, index } = this.props;
    if (handleExamStd) {
      const reValue = !isNaN(Number(value)) ? value : '0';
      handleExamStd(reValue, index);
    }
  }

  render() {
    const { formData = {}, index, logiTypeDic = [], relaTypeDic = [] } = this.props;
    return (
      <Fragment>
        <Form.Item label={`考核标准${index}`}>
          <div className="dis-fx" style={{ flexWrap: 'wrap', justifyContent: 'start' }}>
            <Input className="mr12 mb6" value={formData[`indiName${index}`]} disabled style={{ width: '180px' }} />
            <Select className="mr12 mb6" value={formData[`relaTypeid${index}`]} disabled style={{ width: '180px' }}>
              {relaTypeDic.map((item) => {
                  return (<Select.Option value={item.ibm} key={item.ibm}>{item.note}</Select.Option>);
                })}
            </Select>
            <InputNumber
              className="mr12 mb6"
              value={formData[`examStd${index}`]}
              onChange={this.handleExamStd}
              formatter={this.limitDecimals}
              parser={this.limitDecimals}
              precision={4}
              style={{ width: '180px' }}
            />
            { typeof (formData[`logiTypeid${index}`]) !== 'undefined' && formData[`logiTypeid${index}`] !== '' ? (
              <Select className="mr12 mb6" value={formData[`logiTypeid${index}`]} disabled style={{ width: '180px' }}>
                {logiTypeDic.map((item) => {
                    return (<Select.Option value={item.ibm} key={item.ibm}>{item.note}</Select.Option>);
                  })}
              </Select>
            )
              : ''}
          </div>
        </Form.Item>
      </Fragment>
    );
  }
}

export default AssessmentCriteria;
