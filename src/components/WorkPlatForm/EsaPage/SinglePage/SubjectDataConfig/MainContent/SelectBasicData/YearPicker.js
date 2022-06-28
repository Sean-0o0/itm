import React, { Component } from 'react';
import { DatePicker } from 'antd';
// 年份日期选择组件
class YearPicker extends Component {
  constructor(props) {
    super(props);
    const { value = null } = this.props;
    this.state = {
      isopen: false,
      value,
    };
  }

  componentWillReceiveProps(props) {
    if ('value' in props) {
      const { value } = props;
      this.setState({
        value: value || null,
      });
    }
  }

  // 改变面板值
  handlePanelChange = (value) => {
    // 传递给父组件
    const { onChange } = this.props;
    this.setState({
      value,
      isopen: false,
    });
    onChange(value);
  }

  handleOpenChange = (status) => {
    if (status) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  }

  // 点击清除图标
  clearValue = () => {
    this.setState({
      value: null,
    });
    const { onChange } = this.props;
    onChange(null);
  }

  render() {
    return (
      <DatePicker
        value={this.state.value}
        open={this.state.isopen}
        mode="year"
        placeholder="请选择年份"
        format="YYYY"
        onOpenChange={this.handleOpenChange}
        onPanelChange={this.handlePanelChange}
        onChange={this.clearValue}
        getCalendarContainer={triggerNode => triggerNode.parentNode}
      />
    );
  }
}
export default YearPicker;
