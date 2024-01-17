import React, { useEffect, useState, Fragment } from 'react';
import {
  Button,
  message,
  Select,
  TreeSelect,
  InputNumber,
  DatePicker,
  Cascader,
  Input,
  Icon,
  Radio,
  Popover,
} from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default function ConditionFilter(props) {
  const {
    options = [],
    data = [],
    setData = () => {},
    onChange = () => {},
    onDelete = () => {},
  } = props;

  useEffect(() => {
    return () => {};
  }, []);

  const getComponent = (x = []) => {
    const {
      ID = -1,
      NAME = '--',
      ZJLX = 'MULTIPLE',
      SELECTORDATA = [],
      SELECTORVALUE = [],
      TJBCXLX = '',
      sltOpen,
    } = x;
    // console.log('🚀 ~ file: index.js:28 ~ getComponent ~ SELECTORDATA:', SELECTORDATA);
    let maxTagCount = 1;
    let treeDefaultExpandedKeys = [1];
    if (['项目名称', '预算项目'].includes(NAME)) {
      maxTagCount = 1;
    }
    if (['项目标签'].includes(NAME)) {
      treeDefaultExpandedKeys = [1];
    } else if (['应用部门'].includes(NAME)) {
      treeDefaultExpandedKeys = [1, 8857];
    }

    let component = '';
    let dateValue = ['', ' ', 'undefined', 'null', '[]'].includes(JSON.stringify(SELECTORVALUE))
      ? [null, null]
      : ['', ' ', undefined, null].includes(SELECTORVALUE[0])
      ? [null, null]
      : [moment(SELECTORVALUE[0]), moment(SELECTORVALUE[1])];

    //修改数据
    const modifyData = value => {
      let arr = [...data];
      arr.forEach(y => {
        if (y.ID === ID) {
          y.SELECTORVALUE = value;
        }
      });
      setData(arr);
    };

    //修改 sltOpen
    const modifySltOpen = bool => {
      let arr = [...data];
      arr.forEach(y => {
        if (y.ID === ID) {
          y.sltOpen = bool;
        }
      });
      setData(arr);
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
      // console.log('🚀 ~ file: index.js:25 ~ handleDateChange ~ ds, d:', ds, d);
      modifyData([...d]);
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
    const handleRadioChange = v => {
      modifyData(v.target.value);
    };

    // const popoverContent = (data = []) => (
    //   <div className="list">
    //     {data.map(x => (
    //       <div
    //         className="item"
    //         // key={x.ENTRYNO + x.JLMC + x.JLID}
    //         // onClick={() => handleFilePreview(x.JLID, x.JLMC, x.ENTRYNO)}
    //       >
    //         {x}
    //         {/* <a style={{ color: '#3361ff' }}>{x.JLMC}</a> */}
    //       </div>
    //     ))}
    //   </div>
    // );

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
          showSearch
          showArrow
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
        <Fragment>
          <TreeSelect
            allowClear
            className="item-component"
            showSearch
            treeCheckable
            maxTagCount={1}
            maxTagPlaceholder={extraArr => {
              return (
                // <Popover
                //   placement="bottom"
                //   title={null}
                //   content={popoverContent(extraArr)}
                //   overlayClassName="demand-detail-content-popover"
                // >
                `+${extraArr.length + maxTagCount}`
                // </Popover>
              );
            }}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            treeData={ysxmArr}
            value={SELECTORVALUE.value}
            placeholder="请选择"
            onChange={handleYSXMChange}
            open={sltOpen}
            onDropdownVisibleChange={v => modifySltOpen(v)}
          />
          <Icon
            type="down"
            className={'label-selector-arrow' + (sltOpen ? ' selector-rotate' : '')}
          />
        </Fragment>
      );
      return (
        <Fragment>
          <div className="condition-filter-item" key={ID}>
            <div className="item-label">预算类型</div>
            {component}
            <i className="iconfont icon-close-circle" onClick={() => onDelete(ID)} />
          </div>
          <div className="condition-filter-item" key={ID}>
            <div className="item-label">{NAME}</div>
            {component2}
            <i className="iconfont icon-close-circle" onClick={() => onDelete(ID)} />
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
              showArrow
              allowClear
              mode="multiple"
              maxTagCount={1}
              maxTagPlaceholder={extraArr => {
                return `+${extraArr.length + maxTagCount}`;
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
                className="item-component"
                showSearch
                treeCheckable
                maxTagCount={1}
                maxTagPlaceholder={extraArr => {
                  return `+${extraArr.length + maxTagCount}`;
                }}
                showCheckedStrategy={TreeSelect.SHOW_ALL}
                treeCheckStrictly
                treeNodeFilterProp="title"
                dropdownClassName="newproject-treeselect"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={SELECTORDATA}
                value={SELECTORVALUE}
                placeholder="请选择"
                onChange={handleMultipleSltChange}
                treeDefaultExpandedKeys={treeDefaultExpandedKeys}
                open={sltOpen}
                onDropdownVisibleChange={v => modifySltOpen(v)}
              />
              <Icon
                type="down"
                className={'label-selector-arrow' + (sltOpen ? ' selector-rotate' : '')}
              />
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
                max={9999999999}
                min={0}
              />
              <Input className="input-to" placeholder="-" disabled />
              <InputNumber
                className="input-max"
                value={SELECTORVALUE?.max}
                onChange={handleInputMaxChange}
                placeholder="上限"
                type="number"
                allowClear
                max={9999999999}
                min={0}
              />
            </div>
          );
          break;
        case 'DATE':
          component = (
            <RangePicker
              format="YYYY-MM-DD"
              value={dateValue}
              onChange={handleDateChange}
              className="item-component"
              // placeholder={['开始', '结束']}
            />
          );
          break;

        case 'RADIO':
          component = (
            <Radio.Group
              value={SELECTORVALUE}
              onChange={handleRadioChange}
              className="item-component"
            >
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          );
          break;

        case 'RADIO-XMZT':
          component = (
            <Radio.Group
              value={SELECTORVALUE}
              onChange={handleRadioChange}
              className="item-component"
            >
              <Radio value={true}>正常</Radio>
              <Radio value={false}>逾期</Radio>
            </Radio.Group>
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
          <i className="iconfont icon-close-circle" onClick={() => onDelete(ID)} />
        </div>
      );
    }
  };
  return (
    <div className="filter-condition">
      {data.map(x => getComponent(x))}
      <Cascader
        options={options}
        onChange={onChange}
        popupClassName="custom-rpt-management-cascader"
      >
        <Button type="dashed" icon={'plus-circle'}>
          添加筛选条件
        </Button>
      </Cascader>
    </div>
  );
}
