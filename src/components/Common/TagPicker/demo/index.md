---
order: 1
title: TagPicker 色块选择 单独使用时的简单demo
---

````jsx
import TagPicker from '../../TagPicker';

function handleFormSubmit(checkedValue) {
  console.log(checkedValue);
}

const tagPickerProps = {
    rowkey: 'id',
    titleKey: 'name',
    lable: '字母选项',
    value: [],
    allTagData: {
      showText: '不限',
    },
    dataSource: [
      { id: '1', name: 'AAA' },
      { id: '2', name: 'BBB' },
      { id: '3', name: 'CCC' },
      { id: '4', name: 'DDD' },
      { id: '5', name: 'EEE' },
    ],
    onChange: handleFormSubmit,
}

ReactDOM.render(
  <TagPicker
    {...tagPickerProps}
  />
, mountNode);
````
