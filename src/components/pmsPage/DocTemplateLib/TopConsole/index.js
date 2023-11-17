import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Input, Select, TreeSelect } from 'antd';
import moment from 'moment';

export default function TopConsole(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    filterData = {
      fileType: undefined, //文档类型
      fileName: undefined, //模板名称
    },
  } = dataProps;
  const { setFilterData = () => {}, getDocTplt = () => {} } = funcProps;

  //筛选条件-输入框
  const getInput = (label, valueField) => {
    return (
      <div className="console-item">
        <div className="item-label">{label}</div>
        <Input
          value={filterData[valueField]}
          className="item-node"
          onChange={v => {
            v.persist();
            if (v.target.value === '') {
              setFilterData(p => ({ ...p, [valueField]: undefined }));
            } else {
              setFilterData(p => ({ ...p, [valueField]: v.target.value }));
            }
          }}
          placeholder={'请输入' + label}
          allowClear
          style={{ width: '100%' }}
        />
      </div>
    );
  };

  //重置
  const handleReset = () => {
    setFilterData({});
  };

  return (
    <div className="top-console">
      <div className="item-box">
        {getInput('文档类型', 'fileType')}
        {getInput('模板名称', 'fileName')}
        <Button
          className="btn-search"
          type="primary"
          onClick={() =>
            getDocTplt({
              ...filterData,
            })
          }
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}
