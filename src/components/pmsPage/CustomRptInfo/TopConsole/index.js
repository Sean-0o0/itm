import React, { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from 'react';
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

  const handleReset = () => {
    // console.log('kkkk');
    let arr = [...data.filterData];
    arr.forEach(y => {
      if (y.ZJLX === 'MULTIPLE' || y.ZJLX === 'TREE-MULTIPLE') {
        y.SELECTORVALUE = [];
      } else if (y.ZJLX === 'RANGE') {
        y.SELECTORVALUE = { max: undefined, min: undefined };
      } else if (y.ZJLX === 'DATE') {
        y.SELECTORVALUE = null;
      } else {
        y.SELECTORVALUE = undefined;
      }
    });
    setData(p => ({ ...p, filterData: arr }));
  };

  const getComponent = (x = []) => {
    const {
      ID = -1,
      NAME = '--',
      ZJLX = 'MULTIPLE',
      SELECTORDATA = [],
      SELECTORVALUE = [],
      TJBCXLX = '',
    } = x;
    // console.log("🚀 ~ file: index.js:57 ~ getComponent ~ TJBCXLX:", TJBCXLX)
    // console.log('🚀 ~ file: index.js:28 ~ getComponent ~ SELECTORDATA:', SELECTORDATA);
    let maxTagCount = 1;
    if (['项目名称', '预算项目'].includes(NAME)) {
      maxTagCount = 1;
    }
    let treeDefaultExpandedKeys = [1];
    if (['项目标签'].includes(NAME)) {
      treeDefaultExpandedKeys = [1];
    } else if (['应用部门'].includes(NAME)) {
      treeDefaultExpandedKeys = [1, 8857];
    }

    let component = '';
    let dateValue = ['', ' ', undefined, [], null].includes(SELECTORVALUE)
      ? null
      : moment(SELECTORVALUE);

    //修改数据
    const modifyData = value => {
      let arr = JSON.parse(JSON.stringify([...data.filterData]));
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

    const handleYSXMLXChange = v => {
      modifyData({
        type: v,
        value: [],
        typeObj: SELECTORDATA.type?.filter(x => x.YSLXID === v)[0] || {},
      });
    };
    const handleYSXMChange = v => {
      console.log('🚀 ~ file: index.js:125 ~ handleYSXMChange ~ v:', v);
      modifyData({
        type: SELECTORVALUE?.type,
        typeObj: SELECTORVALUE?.typeObj,
        value: v,
      });
    };

    if (TJBCXLX === 'YSXM') {
      let ysxmArr = (
        SELECTORDATA.origin?.filter(x => x.YSLXID === SELECTORVALUE.type) || []
      ).reduce((acc, cur) => {
        const index = acc.findIndex(item => item.value === cur.ZDBM && item.label === cur.YSLB);
        if (index === -1) {
          acc.push({
            label: cur.YSLB,
            value: cur.ZDBM,
            children: [
              {
                ...cur,
                label: cur.YSXM,
                value: cur.ID,
              },
            ],
          });
        } else {
          acc[index].children.push({
            ...cur,
            label: cur.YSXM,
            value: cur.ID,
          });
        }
        return acc;
      }, []);

      component = (
        <Select
          className="item-component"
          dropdownClassName="item-selector-dropdown"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow={false}
          showSearch
          allowClear
          value={SELECTORVALUE.type}
          onChange={handleYSXMLXChange}
          placeholder="请选择"
        >
          {SELECTORDATA.type?.map(x => (
            <Select.Option key={x.YSLXID} value={x.YSLXID}>
              {x.YSLX}
            </Select.Option>
          ))}
        </Select>
      );

      const component2 = (
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
          showCheckedStrategy={TreeSelect.SHOW_CHILD}
          treeNodeFilterProp="title"
          dropdownClassName="newproject-treeselect"
          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          treeData={ysxmArr}
          value={SELECTORVALUE.value}
          placeholder="请选择"
          onChange={handleYSXMChange}
          // treeDefaultExpandAll
        />
      );
      return (
        <Fragment>
          <div className="condition-filter-item" key={'预算类型'}>
            <div className="item-label">预算类型</div>
            {component}
          </div>
          <div className="condition-filter-item" key={ID}>
            <div className="item-label">{NAME}</div>
            {component2}
          </div>
        </Fragment>
      );
    } else {
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
            <Fragment>
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
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                treeNodeFilterProp="title"
                dropdownClassName="newproject-treeselect"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={SELECTORDATA}
                value={SELECTORVALUE}
                placeholder="请选择"
                onChange={handleMultipleSltChange}
                // />
                treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                // open={orgOpen}
                // onDropdownVisibleChange={v => setOrgOpen(v)}
              />
              {/* <Icon
                type="down"
                className={'label-selector-arrow' + (orgOpen ? ' selector-rotate' : '')}
              /> */}
            </Fragment>
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
    }
  };

  return (
    <div className="top-console">
      <div className="filter-condition">
        <div className="left">{data.filterData?.map(x => getComponent(x))}</div>
        <div className="right">
          <Button className="btn-search" type="primary" onClick={() => getSQL({}, data)}>
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
