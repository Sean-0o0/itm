import React from 'react';
import { Input } from 'antd';

class SearchInput extends React.Component {
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
      if (value && value.value !== '') {
        if (value.value) {
          this.setState({
            value: value.value,
          });
        } else {
          this.setState({
            value,
          });
        }
      } else {
        this.setState({
          value: '',
        });
      }
    }
  }
  handleChange=(e) => {
    const { value } = e.target;
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
  render() {
    const { placeholder = '搜索条件' } = this.props;
    return (
      <span className="m-input-search-form ant-input-search ant-input-search-enter-button ant-input-affix-wrapper">
        <Input type="text" onChange={this.handleChange} value={this.state.value} placeholder={placeholder} />
        {/* <span className="ant-input-suffix">
          <button type="button" className="m-btn-radius m-btn-radius-small ant-btn m-btn-white ant-input-search-button">
            <i className="iconfont icon-search ant-input-search-icon" />
          </button>
        </span> */}
      </span>
    );
  }
}

export default SearchInput;
