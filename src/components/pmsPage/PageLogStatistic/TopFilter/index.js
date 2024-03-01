import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, message, Input, Icon, TreeSelect, DatePicker, Select } from 'antd';
import moment from 'moment';

export default function TopFilter(props) {
  const { handleSearch, filterData, setFilterData, orgData = [], RZCZLX = [] } = props;
  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false

  const handleReset = () => {
    setFilterData({
      dateRange: [moment().startOf('month'), moment().endOf('month')],
      startTime: Number(
        moment()
          .startOf('month')
          .format('YYYYMMDD'),
      ),
      endTime: Number(
        moment()
          .endOf('month')
          .format('YYYYMMDD'),
      ),
    });
  };

  return (
    <div className="top-filter">
      <div className="filter-row">
        <div className="filter-item" key="统计时间">
          <div className="item-label">统计时间</div>
          <DatePicker.RangePicker
            className="item-component"
            placeholder={['开始日期', '结束日期']}
            allowClear
            value={filterData.dateRange}
            onChange={dates => {
              if (dates?.length > 0)
                setFilterData(p => ({
                  ...p,
                  dateRange: dates,
                  startTime: Number(dates[0].format('YYYYMMDD')),
                  endTime: Number(dates[0].format('YYYYMMDD')),
                }));
              else
                setFilterData(p => ({
                  ...p,
                  dateRange: dates,
                  startTime: undefined,
                  endTime: undefined,
                }));
            }}
          />
        </div>
        <div className="filter-item" key="页面名称">
          <div className="item-label">页面名称</div>
          <Input
            value={filterData.pageName}
            className="item-component"
            onChange={v => {
              v.persist();
              if (v.target.value === '') {
                setFilterData(p => ({ ...p, pageName: undefined }));
              } else {
                setFilterData(p => ({ ...p, pageName: v.target.value }));
              }
            }}
            placeholder={'请输入页面名称'}
            allowClear={true}
            style={{ width: '100%' }}
          />
        </div>
        <div className="filter-item" key="统计部门">
          <div className="item-label">统计部门</div>
          <TreeSelect
            allowClear
            showArrow
            className="item-component"
            showSearch
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            treeData={orgData}
            value={filterData.orgID}
            placeholder="请选择统计部门"
            onChange={v => setFilterData(p => ({ ...p, orgID: v !== undefined ? Number(v) : v }))}
            treeDefaultExpandAll
          />
        </div>
        {filterFold && (
          <div className="filter-unfold" onClick={() => setFilterFold(false)}>
            更多
            <i className="iconfont icon-down" />
          </div>
        )}
        <Button
          className="btn-search"
          type="primary"
          onClick={() =>
            handleSearch({
              ...filterData,
              dateRange: undefined,
            })
          }
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
      {!filterFold && (
        <div className="filter-row">
          <div className="filter-item" key="操作人员">
            <div className="item-label">操作人员</div>
            <Input
              value={filterData.operator}
              className="item-component"
              onChange={v => {
                v.persist();
                if (v.target.value === '') {
                  setFilterData(p => ({ ...p, operator: undefined }));
                } else {
                  setFilterData(p => ({ ...p, operator: v.target.value }));
                }
              }}
              placeholder={'请输入操作人员'}
              allowClear={true}
              style={{ width: '100%' }}
            />
          </div>
          <div className="filter-item" key="操作类型">
            <div className="item-label">操作类型</div>
            <Select
              className="item-component"
              dropdownClassName={'item-selector-dropdown'}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              onChange={v => setFilterData(p => ({ ...p, operateType: v }))}
              value={filterData.operateType}
              placeholder="请选择操作类型"
            >
              {RZCZLX.map((x, i) => (
                <Option key={i} value={x.note}>
                  {x.note}
                </Option>
              ))}
            </Select>
          </div>
          <div className="filter-unfold" onClick={() => setFilterFold(true)}>
            收起
            <i className="iconfont icon-up" />
          </div>
        </div>
      )}
    </div>
  );
}
