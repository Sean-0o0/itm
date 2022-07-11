import React from 'react';
import classnames from 'classnames';
import { Input, InputNumber } from 'antd';
import styles from './betweenInput.less';

// 输入框--输入框 自定义 范围输入框组件
class BetweenInput extends React.Component {
  constructor(props) {
    super(props);
    const { value = {}, leftMax = Number.MAX_VALUE, leftMin = 0, rightMax = Number.MAX_VALUE, rightMin = 0, precision = 0 } = this.props;
    const { leftValue, rightValue } = value;
    this.state = {
      leftValue, // 左输入框的值
      rightValue, // 右输入框的值
      leftMax,
      leftMin,
      rightMax,
      rightMin,
      precision,
    };
  }
  componentWillReceiveProps(props) {
    const { value = {} } = props;
    const { leftValue, rightValue } = value;
    this.setState({
      leftValue,
      rightValue,
    });
  }
  handleLeft=(value) => {
    if (!isNaN(value)) {
      this.setState({
        leftValue: Number(value),
      });
      this.triggerChange({ leftValue: Number(value) });
    }
  }
  handleRight=(value) => {
    if (!isNaN(value)) {
      this.setState({
        rightValue: Number(value),
      });
      this.triggerChange({ rightValue: Number(value) });
    }
  }
  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  render() {
    const { className, labelName = '', style = {} } = this.props;
    return (
      <Input.Group style={{ ...style }} className={classnames('m-input-group', styles.betweenInput, className)} compact>
        <span className="ant-input-group-addon" style={{ display: labelName ? '' : 'none' }}>{labelName}</span>
        <div className="m-right-input m-right-input-section">
          <InputNumber
            className={styles.m_inputNum}
            style={{ float: 'left', height: '100%', width: '45%', textAlign: 'center', border: 'none' }}
            onChange={this.handleLeft}
            value={!isNaN(this.state.leftValue) ? this.state.leftValue : null}
            max={this.state.leftMax}
            min={this.state.leftMin}
            precision={this.state.precision}
            // formatter={value => `${value}万`}
            // parser={value => value.replace('万', '')}
          />
          <Input className={styles.middleInput} style={{ width: '10%', borderLeft: 0, pointerEvents: 'none' }} placeholder="-" disabled />
          <InputNumber
            className={styles.m_inputNum}
            // formatter={value => `${value}万`}
            // parser={value => value.replace('万', '')}
            precision={this.state.precision}
            max={this.state.rightMax}
            min={this.state.rightMin}
            onChange={this.handleRight}
            value={!isNaN(this.state.rightValue) ? this.state.rightValue : null}
            style={{ width: '45%', height: '100%', textAlign: 'center', border: 'none' }}
          />
        </div>
      </Input.Group>
    );
  }
}
export default BetweenInput;
