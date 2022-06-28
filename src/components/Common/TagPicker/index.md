---
title: TagPicker
subtitle: 标签选择器
---

色块选择框 可进行多选，带折叠收起和展开更多功能，常用于对列表进行筛选。

## API

### TagSelect
| 参数         | 类型   |   默认值   |  说明                                                          |
|-------------|--------|------------|---------------------------------------------------------------|
| initialValue| Array  |     []     | 默认选中项数据                                                 |
| value       | Array  |     []     | 选中项数据                                                     |
| rowkey      | String |     id     | 作为键值的字段                                                 |
| titleKey    | String |     name   | 作为显示名称的字段                                              |
| allTagData  | Objct  |     -      | 全选项的相关配置                                                |
| dataSource  | Array  |     []     | 选项数据来源                                                    |
| onChange    | Func   |     -      | 标签选择的回调函数                                              |
