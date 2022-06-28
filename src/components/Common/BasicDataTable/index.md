---
title: BasicDataTable
subtitle: 基础表格组件
---

基于antd的Table组件封装,用法几乎完全一样,rowSelection中增加了crossPageSelect参数,用于判断是否是跨页全选操作

## API

| 参数         | 类型   |   默认值   |  说明                                                          |
|-------------|--------|------------|---------------------------------------------------------------|
| rowKey      | string |     id     | 表格数据主键                                                   |
| column      | Array  |     []     | 表格列信息                                                     |
| dataSource  | Array  |     []     | 表格数据                                                       |
| pagination  | Object |     -      | 分页数据                                                       |
| rowSelection| Object |     []     | 行选择数据                                                     |
