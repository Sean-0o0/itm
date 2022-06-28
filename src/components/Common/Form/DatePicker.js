import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Input, DatePicker as AntdDatePicker } from 'antd';
import styles from './DatePicker.less';

// 日期份选择控件
// 组件国际化
moment.locale('zh-cn');
const { MonthPicker, WeekPicker } = AntdDatePicker;
class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    const { value = '' } = this.props;
    this.state = {
      value,
    };
  }
  componentWillReceiveProps(props) {
    if ('value' in props) {
      const { value } = props;
      this.setState({
        value: value ? value.value : '',
      });
    }
  }
  handleChange=(value) => {
    this.triggerChange({
      value,
    });
  }
  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  renderDateInput = (dataType) => {
    switch (dataType) {
      case 'MonthPicker':
        return <MonthPicker format="YYYY/MM" className={`${styles.m_Input}`} onChange={this.handleChange} value={this.state.value} placeholder="" />;
      case 'WeekPicker':
        return <WeekPicker className={`${styles.m_Input}`} onChange={this.handleChange} value={this.state.value} placeholder="" />;
      default:
        return <AntdDatePicker format="YYYY/MM/DD" className={`${styles.m_Input}`} onChange={this.handleChange} value={this.state.value} placeholder="" />;
    }
  }
  render() {
    const { labelName, dataType } = this.props;
    return (
      <Input.Group className="m-input-group" compact>
        <span className="ant-input-group-addon">{labelName}</span>
        {this.renderDateInput(dataType)}
        <button style={{ cursor: 'text' }} type="button" className={`${styles.m_button} m-btn-radius m-btn-radius-small ant-btn m-btn-headColor`}>
          <i className="iconfont icon-calendar" />
        </button>
      </Input.Group>
    );
  }
}

export default DatePicker;
