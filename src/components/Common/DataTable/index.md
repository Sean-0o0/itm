---
title: DataTable
subtitle: 数据表格组件
---

基于BasicDataTable组件封装,加上样式等细节功能

## API

| 参数         | 类型   |   默认值   |  说明                                                          |
|-------------|--------|------------|---------------------------------------------------------------|
| rowKey      | string |     id     | 表格数据主键                                                   |
| column      | Array  |     []     | 表格列信息(必须)                                               |
| dataSource  | Array  |     []     | 表格数据                                                      |
| pagination  | Object |     -      | 分页数据                                                      |
| rowSelection| Object |     []     | 行选择数据                                                    |
| rowClassName| Func   |     -      | 行选样式                                                      |
| onChange    | Func   |     -      | 分页、排序、筛选变化时的操作,动态表格需要在onChage中请求数据(必须)|