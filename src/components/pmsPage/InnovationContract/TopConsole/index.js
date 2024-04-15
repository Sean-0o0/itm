import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Input, Select, Tooltip, TreeSelect } from 'antd';
import moment from 'moment';

export default function TopConsole(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const {
    filterData = {
      projectId: undefined, //  关联项目
      contractCode: undefined, //合同编号
      contractName: undefined, //合同名称
      handleStatus: undefined, //处理状态
      trustee: undefined, //经办人
      sysType: undefined, //系统类型
      contractType: undefined, //合同类型
      isXC: undefined, //是否信创
    },
    sltData = {
      glxm: [], //关联项目
      jbr: [], //经办人
    },
    dictionary = {},
    filterFold,
    roleTxt = '',
  } = dataProps;
  const {
    xc_deal_flag = [], //处理状态
    xc_sys = [], //系统类型
    xc_cont_type = [], //合同类型
  } = dictionary;
  const {
    setFilterData = () => {},
    queryTableData = () => {},
    setFilterFold = () => {},
    setSearchData = () => {},
  } = funcProps;
  const [sltOpen, setSltOpen] = useState(false); //

  useEffect(() => {
    return () => {};
  }, []);

  //获取下拉框
  const getSelector = ({
    value,
    onChange,
    data = [],
    titleField,
    valueField,
    optionNode,
    optionLabelProp = 'children',
    optionFilterProp = 'children',
  }) => {
    return (
      <Select
        className="item-selector"
        dropdownClassName="item-selector-dropdown"
        showSearch
        allowClear
        onChange={onChange}
        value={value}
        placeholder="请选择"
        optionLabelProp={optionLabelProp}
        optionFilterProp={optionFilterProp}
      >
        {data.map((x, i) =>
          optionNode ? (
            optionNode(x)
          ) : (
            <Select.Option key={i} value={Number(x[valueField])}>
              {x[titleField]}
            </Select.Option>
          ),
        )}
      </Select>
    );
  };

  //重置
  const handleReset = () => {
    setFilterData({});
  };

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">合同编号</div>
          <Input
            value={filterData.contractCode}
            className="item-selector"
            onChange={v => {
              v.persist();
              if (v.target.value === '') {
                setFilterData(p => ({ ...p, contractCode: undefined }));
              } else {
                setFilterData(p => ({ ...p, contractCode: v.target.value }));
              }
            }}
            placeholder={'请输入合同编号'}
            allowClear
            style={{ width: '100%' }}
          />
        </div>
        <div className="console-item">
          <div className="item-label">关联项目</div>
          {getSelector({
            value: filterData.projectId,
            onChange: v => setFilterData(p => ({ ...p, projectId: v })),
            data: sltData.glxm,
            titleField: 'XMMC',
            valueField: 'XMID',
            optionNode: x => (
              <Select.Option key={x.XMID} value={x.XMID} title={x.XMMC}>
                <Tooltip title={x.XMMC} placement="topLeft">
                  {x.XMMC}
                  {<div style={{ fontSize: '12px', color: '#bfbfbf' }}>{x.XMNF}</div>}
                </Tooltip>
              </Select.Option>
            ),
            optionLabelProp: 'title',
            optionFilterProp: 'title',
          })}
        </div>
        <div className="console-item">
          <div className="item-label">处理状态</div>
          {getSelector({
            value: filterData.handleStatus,
            onChange: v => setFilterData(p => ({ ...p, handleStatus: v })),
            data: xc_deal_flag,
            titleField: 'note',
            valueField: 'ibm',
          })}
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
          onClick={() => queryTableData(filterData, setSearchData)}
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={() => handleReset()}>
          重置
        </Button>
      </div>
      {!filterFold && (
        <Fragment>
          <div className="item-box">
            <div className="console-item">
              <div className="item-label">经办人</div>
              <TreeSelect
                allowClear
                showArrow
                className="item-selector"
                showSearch
                treeNodeFilterProp="title"
                dropdownClassName="newproject-treeselect"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={sltData.jbr}
                placeholder="请选择"
                onChange={v => setFilterData(p => ({ ...p, trustee: v }))}
                value={filterData.trustee}
                treeDefaultExpandedKeys={[
                  '8867',
                  '13104',
                  '13395',
                  '393',
                  '544',
                  '12459',
                  '357',
                  '11168',
                ]}
              />
            </div>
            <div className="console-item">
              <div className="item-label">系统类型</div>
              {getSelector({
                value: filterData.sysType,
                onChange: v => setFilterData(p => ({ ...p, sysType: v })),
                data: xc_sys,
                titleField: 'note',
                valueField: 'ibm',
              })}
            </div>
            <div className="console-item">
              <div className="item-label">合同类型</div>
              {getSelector({
                value: filterData.contractType,
                onChange: v => setFilterData(p => ({ ...p, contractType: v })),
                data: xc_cont_type,
                titleField: 'note',
                valueField: 'ibm',
              })}
            </div>
          </div>
          <div className="item-box">
            <div className="console-item">
              <div className="item-label">是否信创</div>
              {getSelector({
                value: filterData.isXC,
                onChange: v => setFilterData(p => ({ ...p, isXC: v })),
                data: [
                  { note: '是', ibm: 1 },
                  { note: '否', ibm: 2 },
                ],
                titleField: 'note',
                valueField: 'ibm',
              })}
            </div>
            <div className="filter-unfold" onClick={() => setFilterFold(true)}>
              收起
              <i className="iconfont icon-up" />
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
