---
title: InputTagPicker
subtitle: Input多选标签
---

Input多选标签,是用于封装弹出层选择控件等业务组件的基础组件

## API

### TagSelect
| 参数         | 类型   |   默认值   |  说明                                                          |
|-------------|--------|------------|---------------------------------------------------------------|
| value       | Obj    |{keys:[],titles:[]}| 选中项数据                                              |
| lable       | String |     -      | 显示名称                                                       |
| closable    | Bool   |     true   | 是否允许点击叉叉叉掉                                            |
| hasDropBox  | Bool   |     false   | 是否有下拉箭头和下拉框                                          |
| dropBox     |ReactNode|    ''     | 下拉框内部的组件                                                |
| hasButton   | Bool   |     true   | 是否有右侧的按钮                                                |
| buttonIcon  | String |icon-customer-tag| 按钮的小图标样式的名称                                      |
| onChange    | Func   |     -      | 标签选择的回调函数                                              |
| onButtonClick| Func   |     -      | 右侧按钮点击后的函数                                           |
