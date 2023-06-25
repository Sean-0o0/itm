import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
  Select,
  Button,
  TreeSelect,
  InputNumber,
  Cascader,
  Input,
  message,
  DatePicker,
} from 'antd';
import {} from '../../../../services/pmsServices';
import TreeUtils from '../../../../utils/treeUtils';
import { set } from 'store';
const InputGroup = Input.Group;
const { Option } = Select;
const { MonthPicker } = DatePicker;
import moment from 'moment';

export default function TopConsole(props) {
  //下拉框数据
  const { data = {}, setData = () => {}, getSQL = () => {} } = props;
  //查询的值

  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    return () => {};
  }, []);

  const handleReset = () => {};

  // onChange-start
  //项目名称
  const handlePrjNameChange = v => {
    // console.log('handlePrjMngerChange', v);
    setPrjName(v);
  };
  //供应商
  const handleGysChange = v => {
    setGys(v);
  };
  const handleJdChange = (v, node) => {
    setDateRange([...(node?.props?.range ?? [])]);
    setQuarter(v);
  };
  // onChange-end

  const getComponent = (x = []) => {
    const { ID = -1, NAME = '--', ZJLX = 'MULTIPLE', SELECTORDATA = [], SELECTORVALUE = [] } = x;
    // console.log('🚀 ~ file: index.js:28 ~ getComponent ~ SELECTORDATA:', SELECTORDATA);
    let maxTagCount = 1;
    if (['项目名称', '预算项目'].includes(NAME)) {
      maxTagCount = 1;
    }
    let component = '';
    let dateValue = ['', ' ', undefined, [], null].includes(SELECTORVALUE)
      ? null
      : moment(SELECTORVALUE);

    //修改数据
    const modifyData = value => {
      let arr = [...data.filterData];
      arr.forEach(y => {
        if (y.ID === ID) {
          y.SELECTORVALUE = value;
        }
      });
      setData(p => ({ ...p, filterData: arr }));
    };

    const handleMultipleSltChange = (v, node) => {
      console.log('🚀 ~ handleMultipleSltChange ~ v, node:', v, node);
      modifyData(v);
    };

    const handleInputMinChange = v => {
      modifyData({
        min: v,
        max: SELECTORVALUE?.max,
      });
    };

    const handleInputMaxChange = v => {
      modifyData({
        min: SELECTORVALUE?.min,
        max: v,
      });
    };

    const handleDateChange = (ds, d) => {
      console.log('🚀 ~ file: index.js:25 ~ handleDateChange ~ ds, d:', ds, d);
      modifyData(ds);
    };

    switch (ZJLX) {
      case 'MULTIPLE':
        component = (
          <Select
            className="item-component"
            dropdownClassName="item-selector-dropdown"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            mode="multiple"
            maxTagCount={maxTagCount}
            maxTagTextLength={160}
            maxTagPlaceholder={extraArr => {
              return `等${extraArr.length + maxTagCount}个`;
            }}
            value={SELECTORVALUE}
            onChange={handleMultipleSltChange}
            placeholder="请选择"
          >
            {SELECTORDATA.map(x => (
              <Select.Option key={x.ID} value={x.ID}>
                {x.NAME}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      case 'TREE-MULTIPLE':
        component = (
          <TreeSelect
            allowClear
            showArrow
            className="item-component"
            showSearch
            treeCheckable
            maxTagCount={maxTagCount}
            maxTagTextLength={42}
            maxTagPlaceholder={extraArr => {
              return `等${extraArr.length + maxTagCount}个`;
            }}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            treeData={SELECTORDATA}
            value={SELECTORVALUE}
            placeholder="请选择"
            onChange={handleMultipleSltChange}
          />
        );
        break;
      case 'RANGE':
        component = (
          <div className="input-between item-component">
            <InputNumber
              className="input-min"
              value={SELECTORVALUE?.min}
              onChange={handleInputMinChange}
              placeholder="下限"
              type="number"
              allowClear
            />
            <Input className="input-to" placeholder="-" disabled />
            <InputNumber
              className="input-max"
              value={SELECTORVALUE?.max}
              onChange={handleInputMaxChange}
              placeholder="上限"
              type="number"
              allowClear
            />
          </div>
        );
        break;
      case 'DATE':
        component = (
          <DatePicker value={dateValue} onChange={handleDateChange} className="item-component" />
        );
        break;
      case 'SINGLE':
      case 'TREE-SINGLE':
      default:
        console.error(`🚀 ~ 该类型组件【${ZJLX}】尚未配置`);
        return;
    }
    return (
      <div className="condition-filter-item" key={ID}>
        <div className="item-label">{NAME}</div>
        {component}
      </div>
    );
  };

  return (
    <div className="top-console">
      <div className="filter-condition">
        <div className="left">{data.filterData?.map(x => getComponent(x))}</div>
        <div className="right">
          <Button className="btn-search" type="primary" onClick={() => getSQL()}>
            查询
          </Button>
          <Button className="btn-reset" onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
      <div className="group-condition">
        <span className="label">组合条件</span>
        {data.groupData?.map(x => (
          <div className="condition-group-item">
            {x.length - 2 >= 0 && x[x.length - 2].NAME + ' - '}
            {x[x.length - 1].NAME}
          </div>
        ))}
      </div>
    </div>
  );
}
