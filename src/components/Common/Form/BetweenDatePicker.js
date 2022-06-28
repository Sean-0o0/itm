import React, { Fragment } from 'react';
import { Radio, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './DatePicker.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 日期范围输入框组件
class BetweenDatePicker extends React.Component {
  constructor(props) {
    super(props);
    const { type = 1, defaultValue = '', value = '' } = this.props; // type: 0|没有radio选择;1|时间段选择(近一周近一月近三月);2|时间量选择(一周/一个月/三个月)
    if (value === '' && defaultValue !== '') { // 没有传入value 但是有传入defaultValue时
      let { leftValue = '', rightValue = '' } = defaultValue || {};
      if (typeof value !== 'object' || (typeof value === 'object' && Object.keys(value).length === 0)) {
        if (type === 1 || type === 3) {
          leftValue = this.getTypedDate('oneWeekAgo');
          rightValue = moment();
        } else if (type === 2) {
          leftValue = moment();
          rightValue = this.getTypedDate('oneWeekLater');
        }
      }
      this.state = {
        leftValue, // 左输入框的值
        rightValue, // 右输入框的值
      };
      this.triggerChange({ leftValue, rightValue });
    } else { // 有传入value的时候,为受控组件
      let { leftValue = '', rightValue = '' } = value || {};
      if (typeof value !== 'object' || (typeof value === 'object' && Object.keys(value).length === 0)) {
        if (type === 1) {
          leftValue = this.getTypedDate('oneWeekAgo');
          rightValue = moment();
        } else if (type === 2) {
          leftValue = moment();
          rightValue = this.getTypedDate('oneWeekLater');
        }
      }
      this.state = {
        leftValue, // 左输入框的值
        rightValue, // 右输入框的值
      };
      this.triggerChange({ leftValue, rightValue });
    }
  }
  componentWillReceiveProps(props) {
    const { leftValue: leftValueInstate, rightValue: rightValueInstate } = this.state;
    const { value = {} } = props;
    const { leftValue = '', rightValue = '' } = value;
    let changed = false;
    if (moment.isMoment(leftValue) !== moment.isMoment(leftValueInstate) || moment.isMoment(rightValue) !== moment.isMoment(rightValueInstate)) {
      changed = true;// 如果一个是moment对象,一个不是,很显然发生了改变
    } else if (moment.isMoment(leftValue) && moment.isMoment(leftValueInstate) && !moment(leftValue).isSame(leftValueInstate, 'd')) {
      changed = true;// 开始时间 如果都是moment对象,但是不是同一天,很显然发生了改变
    } else if (moment.isMoment(rightValue) && moment.isMoment(rightValueInstate) && !moment(rightValue).isSame(rightValueInstate, 'd')) {
      changed = true;// 结束时间 如果都是moment对象,但是不是同一天,很显然发生了改变
    }
    if (changed) { // 如果监听到改变,那么才会触发state的变化
      this.setState({
        leftValue,
        rightValue,
      });
    }
  }
  getTypedDate = (type) => {
    switch (type) {
      default: // 默认是"oneWeekAgo"
        return moment().subtract(1, 'weeks').add(1, 'day');
      case 'oneMonthAgo':
        return moment().subtract(1, 'months').add(1, 'day');
      case 'threeMonthAgo':
        return moment().subtract(3, 'months').add(1, 'day');
      case 'oneWeekLater':
        return moment().add(1, 'weeks').subtract(1, 'day');
      case 'oneMonthLater':
        return moment().add(1, 'months').subtract(1, 'day');
      case 'threeMonthLater':
        return moment().add(3, 'months').subtract(1, 'day');
    }
  }
  handleLeft = (value) => {
    this.setState({
      leftValue: value || '',
    });
    this.triggerChange({
      leftValue: value || '',
    });
  }
  handleRight = (value) => {
    this.setState({
      rightValue: value || '',
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
  handleRadioChange = (e) => {
    const { type = 1 } = this.props;
    const { value } = e.target;
    const leftValue = (type === 1 || type === 3) ? this.getTypedDate(value) : moment();
    const rightValue = (type === 1 || type === 3) ? moment() : this.getTypedDate(value);
    this.setState({
      leftValue,
      rightValue,
    });
    this.triggerChange({
      leftValue,
      rightValue,
    });
  }
  handleLeftDisabledDate = (currentDate) => {
    const { rightValue } = this.state;
    if (moment.isMoment(rightValue) && moment.isMoment(currentDate)) {
      return currentDate > rightValue;
    }
    return false;
  }
  handleRightDisabledDate = (currentDate) => {
    const { leftValue } = this.state;
    if (moment.isMoment(leftValue) && moment.isMoment(currentDate)) {
      return currentDate < leftValue;
    }
    return false;
  }
  render() {
    const { leftValue, rightValue } = this.state;
    const { type = 1, allowClear = true, disabled = false, format = '' } = this.props;
    let radioValue = '';
    // 如果开始日期结束日期都是moment对象,而且结束日期就是今天,那么就判断开始日期是否和"近一周/近一月/近三月"这三个间的日期相同
    if (type === 1 && moment.isMoment(leftValue) && moment.isMoment(rightValue) && moment().isSame(rightValue, 'd')) {
      if (moment(this.getTypedDate('oneWeekAgo')).isSame(leftValue, 'd')) {
        radioValue = 'oneWeekAgo';
      } else if (moment(this.getTypedDate('oneMonthAgo')).isSame(leftValue, 'd')) {
        radioValue = 'oneMonthAgo';
      } else if (moment(this.getTypedDate('threeMonthAgo')).isSame(leftValue, 'd')) {
        radioValue = 'threeMonthAgo';
      }
    } else if (type === 2 && moment.isMoment(leftValue) && moment.isMoment(rightValue) && moment().isSame(leftValue, 'd')) {
      // 如果开始日期结束日期都是moment对象,而且开始日期就是今天,那么就判断结束日期是否和"一周/一个月/三个月"这三个间的日期相同
      if (moment(this.getTypedDate('oneWeekLater')).isSame(rightValue, 'd')) {
        radioValue = 'oneWeekLater';
      } else if (moment(this.getTypedDate('oneMonthLater')).isSame(rightValue, 'd')) {
        radioValue = 'oneMonthLater';
      } else if (moment(this.getTypedDate('threeMonthLater')).isSame(rightValue, 'd')) {
        radioValue = 'threeMonthLater';
      }
    } else if (type === 3 && moment.isMoment(leftValue) && moment.isMoment(rightValue) && moment().isSame(rightValue, 'd')) {
      // 如果开始日期结束日期都是moment对象,而且开始日期就是今天,那么就判断结束日期是否和"一周/一个月/三个月"这三个间的日期相同
      if (moment(this.getTypedDate('oneWeekAgo')).isSame(leftValue, 'd')) {
        radioValue = 'oneWeekAgo';
      } else if (moment(this.getTypedDate('oneMonthAgo')).isSame(leftValue, 'd')) {
        radioValue = 'oneMonthAgo';
      } else if (moment(this.getTypedDate('threeMonthAgo')).isSame(leftValue, 'd')) {
        radioValue = 'threeMonthAgo';
      }
    }
    return (
      <span className="clearfix" style={{ display: 'inline-block', width: '100%' }}>
        {type !== 0 && (
          <RadioGroup className="m-product-radio-group" style={{ width: '18rem', float: 'left' }} disabled={disabled} onChange={this.handleRadioChange} value={radioValue}>
            {type === 1 && (
              <Fragment>
                <RadioButton value="oneWeekAgo">近一周</RadioButton>
                <RadioButton value="oneMonthAgo">近一月</RadioButton>
                <RadioButton value="threeMonthAgo">近三月</RadioButton>
              </Fragment>
            )}
            {type === 2 && (
              <Fragment>
                <RadioButton value="oneWeekLater">一周</RadioButton>
                <RadioButton value="oneMonthLater">一个月</RadioButton>
                <RadioButton value="threeMonthLater">三个月</RadioButton>
              </Fragment>
            )}
            {type === 3 && (
              <Fragment>
                <RadioButton value="oneWeekAgo">最近7天</RadioButton>
                <RadioButton value="oneMonthAgo">最近30天</RadioButton>
              </Fragment>
            )}
          </RadioGroup>
        )}
        <span style={{ display: 'block', marginLeft: type === 0 ? '' : '19rem', fontSize: '1rem' }}>
          <DatePicker style={{ width: '45%' }} allowClear={allowClear} disabled={disabled} value={!leftValue ? null : leftValue} disabledDate={this.handleLeftDisabledDate} onChange={this.handleLeft} format={format || 'YYYY/MM/DD'} className={`${styles.m_Input}`} placeholder="开始日期" />
          <span style={{ width: '10%', display: 'inline-block', textAlign: 'center' }}>-</span>
          <DatePicker style={{ width: '45%' }} allowClear={allowClear} disabled={disabled} value={!rightValue ? null : rightValue} disabledDate={this.handleRightDisabledDate} onChange={this.handleRight} format={format || 'YYYY/MM/DD'} className={`${styles.m_Input}`} placeholder="结束日期" />
        </span>
      </span>
    );
  }
}
export default BetweenDatePicker;
