---
title: From
subtitle: 通用配置列表组件
cols: 1
order: 5
---

基于Form组件的进一步封装

## API

| 参数         | 说明                                      | 类型         | 默认值 |
|-------------|------------------------------------------|-------------|-------|

使用说明：
配置form表单 items中，每一行单独配置，每一个组件，需要有key和type，
使用样例 demo：
<Form forms={forms} />
布局配置 demo：
forms: {
      ok: (values) => {//查询按钮
        console.log(values);// eslint-disable-line
      },
      cancel: () => {//清空按钮
        alert('点击了取消按钮！');// eslint-disable-line
      },
      showExtends: true, // 展开
      exTends: false, // 是否有展开按钮
      items: [
        { // 第一行 该数组中每一个对象代表form表单中的一行
          rowGutter: 12, // 该行的间隔
          rowKey: 'rowKey21',
          rowItems: [
            //配置该行中的
          ]
        },
        { // 第二行
          rowGutter: 12, // 该行的间隔
          rowKey: 'rowKey21',
          rowItems: []
        }
      ],
   }
组件配置 demo：
        搜索不带标签输入框： SearchInput
        {
          key: 'khh',                     //组件的唯一key
          type: 'SearchInput',            //组件类型
          placeholder: '客户号/客户名称',   //输入框中默认显示
          span: { sm: 12, md: 12, xl: 8, xxl: 6 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
        },
        
        带下拉框的输入框： SelectInput
        {
          key: '自定义1',
          type: 'SelectInput',
          // name: '自定义1',
          span: { sm: 24, md: 12, lg: 6 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
          initialValue: {
            selectValue: '1', // 下拉框的默认值
            inputValue: '', // 输入框的默认值
          },
          datas: [
            { key: 's1', value: '1', lable: '证券代码', disable: false },
            { key: 's2', value: '2', lable: '客户代码', disable: false },
          ],
        },

        范围输入框： BetweenInput
        {
          key: '自定义1',
          type: 'BetweenInput',
          labelName: '',
          // name: '自定义2',
          span: { sm: 12, md: 12, lg: 6 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
          initialValue: {
            leftValue: '', // 左边的默认值（选填）
            rightValue: '', // 右边的默认值（选填）
          },
          rules: {
            leftRules: { required: true, pattern: number, message: '请输入数字' }, // 左输入框验证规则
            rightRules: { required: true, pattern: number, message: '请输入数字' }, // 右输入框验证规则
          },
        },

        色块选择： TagPicker
        {
          key: '事件等级',
          type: 'TagPicker',
          label: '事件等级',
          span: { sm: 12, md: 12, lg: 12 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
          tagClassName: 'm-tag m-tag-marginBm-tag',
          allTagData: {
            showText: '全部',
          },
          datas: [
            { id: '1', name: '必做' },
            { id: '2', name: '选作' },
            { id: '3', name: '提醒' },
          ],
        },

        单选下拉框（可联级选择）：singleSelect
        {
          key: '营业部',
          type: 'singleSelect',
          labelName: '营业部',
          span: { sm: 24, md: 12, xl: 8, xxl: 6 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
          datas: [{
            value: '大连黄浦路证券营业部',
            label: '大连黄浦路证券营业部',
          }],
        },

        输入框：Input

        
        常用搜素组件：CommonSearchTags
        {
          key: '常用搜索',
          // name: '常用搜索',
          type: 'CommonSearchTags',
          span: { span: 24 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
          datas,
        },
        /// datas 的数据结构
        const datas = [
      {
        key: 1,
        label: '常用搜索',
        tags: [
          {
            key: 1,
            name: '新股中签客户',
            closable: 0,
          },
          {
            key: 2,
            name: '本月未服务客户',
            closable: 0,
            number: 109,
          },
          {
            key: 3,
            name: '两融维持担保比<150%',
            closable: 0,
            number: 110,
          },
        ],
      },
      {
        key: 2,
        label: '自定义',
        tags: [
          {
            key: 1,
            name: '自定义1',
            closable: 0,
          },
          {
            key: 2,
            name: '自定义2',
            closable: 0,
            number: 109,
          },
          {
            key: 3,
            name: '自定义3',
            closable: 1,
            number: 98,
          },
        ],
      },
      {
        key: 3,
        label: '大客户',
        tags: [
          {
            key: 1,
            name: '大客户1',
            closable: 0,
          },
          {
            key: 2,
            name: '大客户2',
            closable: 0,
            number: 109,
          },
        ],
      }];




        日期选择：DatePicker
        {
          key: '考核开始月份',
          type: 'DatePicker',
          dataType: 'MonthPicker', //或者DatePicker,WeekPicker
          labelName: '考核开始月份',
          span: { sm: 24, md: 12, xl: 8, xxl: 6 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
        },


        按钮radio：radioButtons
        {
          key: 'radio',
          type: 'radioButtons',
          className: 'm-product-radio-group',
          span: { sm: 24, md: 12, lg: 7 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
          initialValue: '1',
          datas: [
            { key: 's1', value: '1', lable: '近一周' },
            { key: 's2', value: '2', lable: '近一月' },
            { key: 's3', value: '3', lable: '近三月' },
          ],
        },

        自定义组件：Auto
        {
          key: '案例知识',
          type: 'Auto',
          label: '案例知识',
          span: { sm: 12, md: 12, lg: 6 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 0, // 标签的宽度
            itemSpan: 24, // item的宽度
          },
          content: <button type="button" className="m-btn m-btn-big m-btn-blue ant-btn " style={{ float: 'right' }}><span>案例知识</span></button>,
        },

        查询按钮
        {
          key: '查询按钮',
          type: 'Button',
          action: 'Search',
          name: '查询',
          span: { sm: 12, md: 4, lg: 6 }, // 所占列的宽度
          className: 'm-btn-radius m-btn-pink ant-btn',
        },
