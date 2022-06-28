import React from 'react';
import { Select, Input } from 'antd';
import styles from './SelectInput.less';

// 单选--输入框 自定义联动组件
class SelectInput extends React.Component {
  constructor(props) {
    super(props);
    const { value = {} } = this.props;
    const { selectValue, inputValue } = value;
    this.state = {
      selectValue,
      inputValue,
    };
  }
  componentWillReceiveProps(props) {
    const { value } = props;
    if (value) {
      const { selectValue, inputValue } = value;
      this.setState({
        selectValue,
        inputValue,
      });
    }
  }
  handleSelect = (value) => {
    if (value) {
      this.setState({
        selectValue: value,
      });
    }
    this.triggerChange({ selectValue: value });
  }
  handleInputChange = (e) => {
    const { value } = e.target;
    if (value) {
      this.setState({
        inputValue: value,
      });
    }
    this.triggerChange({ inputValue: value });
  }
  triggerChange = (changedValue) => {
    // 将值改变时间传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  render() {
    const { datas = [] } = this.props;
    return (
      <Input.Group className="m-input-group" compact>
        <Select className={`${styles.m_select} m-select`} value={this.state.selectValue} onChange={this.handleSelect}>
          {
          datas.map((item) => {
            return <Select.Option key={item.key} disabled={item.disabled} value={item.value}>{item.lable}</Select.Option>;
          })
        }
        </Select>
        <div className="m-right-input">
          <Input defaultValue="" value={this.state.inputValue} onChange={this.handleInputChange} />
        </div>
      </Input.Group>
    );
  }
}
export default SelectInput;
