import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, message, Input, Icon, TreeSelect, DatePicker } from 'antd';
import moment from 'moment';

export default function TopFilter(props) {
  const {
    handleSearch,
    config = [],
    filterData,
    setFilterData,
    resetFunc = () => {},
    showBtns = true,
  } = props;
  const [open, setOpen] = useState({
    org: false,
    year: false,
  });

  const getInput = ({ label = '--', value, onChange }) => (
    <Input
      value={value}
      onChange={onChange}
      placeholder={'请输入' + label}
      style={{ width: '100%' }}
      allowClear
    />
  );

  const getTreeSelect = ({ label, treeData = [], onChange, value, open, setOpen }) => (
    <Fragment>
      <TreeSelect
        allowClear
        showArrow
        showSearch
        // treeCheckable
        // maxTagCount={2}
        // maxTagTextLength={42}
        style={{ width: '100%' }}
        // maxTagPlaceholder={extraArr => {
        //   return `等${extraArr.length + 2}个`;
        // }}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
        treeNodeFilterProp="title"
        // dropdownClassName="newproject-treeselect"
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        treeData={treeData}
        placeholder={'请选择' + label}
        onChange={onChange}
        value={value}
        treeDefaultExpandedKeys={['1', '8857']}
        // open={open}
        // onDropdownVisibleChange={v => setOpen(v)}
      />
      {/* <Icon type="down" className={'label-selector-arrow' + (open ? ' selector-rotate' : '')} /> */}
    </Fragment>
  );

  const getYearPicker = ({ label, value, open, setOpen, onChange, allowClear = true }) => (
    <DatePicker
      mode="year"
      value={value}
      open={open}
      placeholder={'请选择' + label}
      format="YYYY"
      onChange={onChange}
      onOpenChange={v => setOpen(v)}
      onPanelChange={onChange}
      allowClear={allowClear}
      style={{ width: '100%' }}
    />
  );

  const handleReset = () => {
    setFilterData({});
    resetFunc();
  };

  const getConfigDetail = ({
    label = '项目名称',
    componentType = 'input',
    valueField = 'projectName',
    valueType = 'string',
    treeData = [],
    allowClear = true,
  }) => {
    const handleType = v =>
      v === undefined ? undefined : valueType === 'string' ? String(v) : Number(v);

    let component = getInput({
      label,
      value: filterData[valueField],
      onChange: v => {
        v.persist();
        if (v.target.value === '') {
          setFilterData(p => ({ ...p, [valueField]: undefined }));
        } else {
          setFilterData(p => ({ ...p, [valueField]: handleType(v.target.value) }));
        }
        !showBtns &&
          handleSearch({
            ...filterData,
            [valueField]: v.target.value === '' ? undefined : handleType(v.target.value),
            year: filterData.year?.year(),
          });
      },
    });

    switch (componentType) {
      case 'date-picker-year':
        component = getYearPicker({
          label,
          value: filterData[valueField],
          open: open.year,
          setOpen: v => setOpen(p => ({ ...p, year: v })),
          onChange: v => {
            setFilterData(p => ({ ...p, [valueField]: v ?? undefined }));
            setOpen(p => ({ ...p, year: false }));
            !showBtns && handleSearch({ ...filterData, year: v?.year() });
          },
          allowClear,
        });
        break;
      case 'tree-select':
        component = getTreeSelect({
          label,
          treeData,
          value: filterData[valueField],
          open: open.org,
          setOpen: v => setOpen(p => ({ ...p, org: v })),
          onChange: v => {
            setFilterData(p => ({ ...p, [valueField]: handleType(v) }));
            !showBtns && handleSearch({ ...filterData, year: filterData.year?.year() });
          },
        });
        break;
      default:
        break;
    }
    return {
      label,
      component,
    };
  };

  return (
    <div className="top-filter">
      <div className="filter-row">
        {config.map(x => {
          const { label, component } = getConfigDetail(x);
          return (
            <div className="filter-item" key={label}>
              <div className="item-label">{label}</div>
              <div className="item-component">{component}</div>
            </div>
          );
        })}
        {showBtns && (
          <Fragment>
            <Button
              className="btn-search"
              type="primary"
              onClick={() => {
                console.log(filterData);
                handleSearch(
                  filterData.year !== undefined
                    ? { ...filterData, year: filterData.year.year() }
                    : filterData,
                );
              }}
            >
              查询
            </Button>
            <Button className="btn-reset" onClick={handleReset}>
              重置
            </Button>
          </Fragment>
        )}
      </div>
    </div>
  );
}
