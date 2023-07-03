import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, DatePicker } from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QuerySupplierList,
} from '../../../../services/pmsServices';
import moment from 'moment';
const InputGroup = Input.Group;
const { Option } = Select;

export default forwardRef(function TopConsole(props, ref) {
  const { dataProps = {}, funcProps = {} } = props;
  const { filterData } = dataProps;
  const { setFilterData, getTableData } = funcProps;

  //重置按钮
  const handleReset = () => {
    setFilterData(p => ({
      ...p,
      value: undefined,
    }));
  };

  // onChange-start
  const handleBgmcChange = v => {
    setFilterData(p => ({
      ...p,
      value: v,
    }));
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">报告名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleBgmcChange}
            value={filterData.value}
            placeholder="请选择"
          >
            {filterData.data.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.NAME}
              </Option>
            ))}
          </Select>
        </div>
        <Button className="btn-search" type="primary" onClick={getTableData}>
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
});
