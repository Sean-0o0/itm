import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Input, DatePicker } from 'antd';

const InputGroup = Input.Group;

class BetweenYearPicker extends Component {
  constructor(props) {
    super(props);
    let leftValue = '';
    let rightValue = '';
    const { defaultValue = '', value = '' } = props;
    if (value === '' && defaultValue !== '' && typeof value === 'object') { // 非受控,传入默认值
      const { leftValue: sm = '', rightValue: em = '' } = defaultValue;
      leftValue = sm;
      rightValue = em;
    } else if (value !== '' && typeof value === 'object') { // 受控
      const { leftValue: sm = '', rightValue: em = '' } = value || {};
      leftValue = sm;
      rightValue = em;
    }
    // 开始月份
    if (leftValue !== '' && !moment.isMoment(leftValue)) { // 传入非moment对象,那么就解析一下
      leftValue = this.normalizeValue(leftValue);
    }
    // 结束月份
    if (rightValue !== '' && !moment.isMoment(rightValue)) { // 传入非moment对象,那么就解析一下
      rightValue = this.normalizeValue(rightValue);
    }
    this.state = {
      leftValue,
      rightValue,
      leftopen: false,
      rightopen: false,
    };
    this.triggerChange({ leftValue, rightValue });
  }
  //   static getDerivedStateFromProps(nextProps, prevState) {
  //     let { leftValue = '', rightValue = '' } = nextProps.value || {};
  //     const { leftValue: leftValueInstate = '', rightValue: rightValueInstate = '' } = prevState || {};
  //     if (nextProps.value === undefined) {
  //       return {
  //         leftValue: leftValueInstate,
  //         rightValue: rightValueInstate,
  //       };
  //     }
  //     // 开始月份
  //     if (leftValue !== '' && !moment.isMoment(leftValue)) { // 传入非moment对象,那么就解析一下
  //       leftValue = this.normalizeValue(leftValue);
  //     }
  //     // 结束月份
  //     if (rightValue !== '' && !moment.isMoment(rightValue)) { // 传入非moment对象,那么就解析一下
  //       rightValue = this.normalizeValue(rightValue);
  //     }
  //     let changed = false;
  //     if (moment.isMoment(leftValue) !== moment.isMoment(leftValueInstate) || moment.isMoment(rightValue) !== moment.isMoment(rightValueInstate)) {
  //       changed = true;// 如果一个是moment对象,一个不是,很显然发生了改变
  //     } else if (moment.isMoment(leftValue) && moment.isMoment(leftValueInstate) && !moment(leftValue).isSame(leftValueInstate, 'd')) {
  //       changed = true;// 开始时间 如果都是moment对象,但是不是一样的,很显然发生了改变
  //     } else if (moment.isMoment(rightValue) && moment.isMoment(rightValueInstate) && !moment(rightValue).isSame(rightValueInstate, 'd')) {
  //       changed = true;// 结束时间 如果都是moment对象,但是不是一样的,很显然发生了改变
  //     }
  //     if (changed) {
  //       return {
  //         leftValue,
  //         rightValue,
  //       };
  //     }
  //     // 默认不改动 state
  //     return null;
  //   }
  // 把日期格式化为moment格式,如果格式不正确,则设置为空字符串
  //   normalizeValue = (value) => {
  //     const m = moment(value, ['YYYY', 'YYYYMM', 'YYYY-MM', 'YYYY/MM', 'YYYY年MM月']);
  //     if (m.isValid()) {
  //       return m;
  //     }
  //     return ''; // 传入月份不规范,设置为空
  //   }
  //   handleLeftDisabledDate = (currentDate) => {
  //     const { rightValue } = this.state;
  //     if (moment.isMoment(rightValue) && moment.isMoment(currentDate)) {
  //       return currentDate > rightValue;
  //     }
  //     return false;
  //   }
  //   handleRightDisabledDate = (currentDate) => {
  //     const { leftValue } = this.state;
  //     if (moment.isMoment(leftValue) && moment.isMoment(currentDate)) {
  //       return currentDate < leftValue;
  //     }
  //     return false;
  //   }
  handleLeft=(value) => {
    this.setState({
      leftValue: value || '',
      leftopen: false,
    });
    this.triggerChange({
      leftValue: value || '',
    });
  }
  handleRight=(value) => {
    this.setState({
      rightValue: value || '',
      rightopen: false,
    });
    this.triggerChange({
      rightValue: value || '',
    });
  }
  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  handleLeftOpenChange = (status) => {
    this.setState({ leftopen: status });
  }
  handleRightOpenChange = (status) => {
    this.setState({ rightopen: status });
  }
  clearLeftValue = () => {
    this.setState({
      leftValue: null,
    });
  }
  clearRightValue = () => {
    this.setState({
      rightValue: null,
    });
  }
  render() {
    const { leftValue = '', rightValue = '' } = this.state;
    const { className, allowClear = true } = this.props;
    return (
      <InputGroup className={classnames(className)} >
        <DatePicker
          mode="year"
          style={{ width: '48%' }}
          format="YYYY"
          allowClear={allowClear}
          open={this.state.leftopen}
          value={leftValue === '' ? null : leftValue}
          placeholder="开始年份"
        //   disabledDate={this.handleLeftDisabledDate}
          onPanelChange={this.handleLeft}
          onOpenChange={this.handleLeftOpenChange}
          onChange={this.clearLeftValue}
        />
        <span style={{ width: '4%', display: 'inline-block', position: 'relative', top: '-1.2rem', lineHeight: '2.5rem', textAlign: 'center' }}>-</span>
        <DatePicker
          mode="year"
          format="YYYY"
          style={{ width: '48%' }}
          allowClear={allowClear}
          open={this.state.rightopen}
          value={rightValue === '' ? null : rightValue}
          placeholder="结束年份"
        //   disabledDate={this.handleRightDisabledDate}
          onPanelChange={this.handleRight}
          onOpenChange={this.handleRightOpenChange}
          onChange={this.clearRightValue}
        />
      </InputGroup>
    );
  }
}

export default BetweenYearPicker;
