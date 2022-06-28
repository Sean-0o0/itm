---
order: 1
title: TagPicker 色块选择 单独使用时的简单demo
---

````jsx
import InputTagPicker from '../../InputTagPicker';

const value = {
  keys: [],
  titles: [],
}

const inputTagPickerProps = {
  lable: '客户标签',
  value: value,
  onChange: this.hanleInputTagPickerChange,
  onButtonClick: this.hanleInputTagPickerButtonClick,
};

ReactDOM.render(
  <InputTagPicker
    {...inputTagPickerProps}
  />
, mountNode);
````
