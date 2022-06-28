import React from 'react';
import { Input as AntdInput } from 'antd';

class Input extends React.Component {
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
        value,
      });
    }
  }
  handleChange=(value) => {
    this.triggerChange(value);
  }
  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  render() {
    const { labelName } = this.props;
    return (
      <AntdInput.Group className="m-input-group" compact>
        <span className="ant-input-group-addon">{labelName}</span>
        <div className="m-right-input">
          <AntdInput onChange={this.handleChange} value={this.state.value} />
        </div>
      </AntdInput.Group>
    );
  }
}

export default Input;
