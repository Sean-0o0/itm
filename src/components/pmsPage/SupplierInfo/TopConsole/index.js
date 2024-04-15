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
  const [amountSelector, setAmountSelector] = useState('1'); //项目金额下拉框，区间 '1'，大于 '2'
  const [xmNumSelector, setXmNumSelector] = useState('1'); //项目数量下拉框，区间 '1'，大于 '2'
  //查询的值
  const [gysmc, setGysmc] = useState(undefined); //供应商名称
  const [gyslx, setGyslx] = useState([]); //供应商类型 - id
  const [gyslxmc, setGyslxmc] = useState([]); //供应商类型 - 文本
  const [lxrmc, setLxrmc] = useState(undefined); //联系人名称
  const [gyszt, setGyszt] = useState(undefined); //供应商状态
  const [gtAmount, setGtAmount] = useState(undefined); //项目金额，大于
  const [ltAmount, setLtAmount] = useState(undefined); //项目金额，小于
  const [minAmount, setMinAmount] = useState(undefined); //项目金额，最小
  const [maxAmount, setMaxAmount] = useState(undefined); //项目金额，最大
  const [xmNum, setXmNum] = useState({
    gt: undefined,
    lt: undefined,
    min: undefined,
    max: undefined,
  }); //项目数量

  const {
    setTableLoading,
    setTableData,
    gysData = [],
    lxrData = [],
    gyslxData = [],
    setTotal,
    setCurPage,
    setCurPageSize,
    curPage,
    curPageSize,
    setFilterData,
    setSortInfo,
  } = props;

  useImperativeHandle(ref, () => {
    return {
      handleSearch,
      handleReset,
    };
  });

  //查询按钮
  const handleSearch = ({
    current = 1,
    pageSize = 20,
    sort = 'ID ASC',
    queryType = 'ALL',
    gysmc,
    gyslx,
    lxrmc,
    gyszt,
    gtAmount,
    ltAmount,
    minAmount,
    maxAmount,
    xmNum,
  }) => {
    setTableLoading(true);
    setCurPage(current);
    setCurPageSize(pageSize);
    let params = {
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
      queryType,
    };
    console.log('🚀 ~ TopConsole ~ params.queryType:', params.queryType);
    if (gysmc !== undefined && gysmc !== '') {
      params.supplierId = Number(gysmc);
    }
    if (gyslx?.length > 0) {
      params.supplierType = gyslx.join(';');
    }
    if (lxrmc !== undefined && lxrmc !== '') {
      params.liaisonName = lxrmc;
    }
    if (gyszt !== undefined && gyszt !== '') {
      params.dataTime = Number(gyszt); //供应商状态
    }
    if (amountSelector === '1') {
      //区间 ,目前暂定只有均不为空时才查
      if (
        minAmount !== undefined &&
        minAmount !== '' &&
        maxAmount !== undefined &&
        maxAmount !== ''
      ) {
        params.budgetType = 'SCOPE';
        params.budgetUpper = Number(maxAmount);
        params.budgetBelow = Number(minAmount);
      }
    } else if (amountSelector === '2') {
      //大于
      if (gtAmount !== undefined && gtAmount !== '') {
        params.budgetType = 'BIGGER';
        params.budgetBelow = Number(gtAmount);
        params.budgetUpper = 0;
      }
    } else {
      //小于
      if (ltAmount !== undefined && ltAmount !== '') {
        params.budgetType = 'SMALLER';
        params.budgetUpper = 0;
        params.budgetBelow = Number(ltAmount);
      }
    }
    if (xmNumSelector === '1') {
      //区间 ,目前暂定只有均不为空时才查
      if (
        xmNum?.min !== undefined &&
        xmNum?.min !== '' &&
        xmNum?.max !== undefined &&
        xmNum?.max !== ''
      ) {
        params.projectCountType = 'SCOPE';
        params.projectUpper = Number(xmNum.max);
        params.projectBelow = Number(xmNum.min);
      }
    } else if (xmNumSelector === '2') {
      //大于
      if (xmNum?.gt !== undefined && xmNum?.gt !== '') {
        params.projectCountType = 'BIGGER';
        params.projectBelow = Number(xmNum.gt);
        params.projectUpper = 0;
      }
    } else {
      //小于
      if (xmNum?.lt !== undefined && xmNum?.lt !== '') {
        params.projectCountType = 'SMALLER';
        params.projectUpper = 0;
        params.projectBelow = Number(xmNum.lt);
      }
    }
    QuerySupplierList(params)
      .then(res => {
        if (res?.success) {
          let liaisonArr = [...JSON.parse(res.liaisonRecord)];
          let supplierArr = [...JSON.parse(res.supplierRecord)];
          let tableArr = [...supplierArr];
          tableArr.forEach(x => {
            let arr = liaisonArr.filter(y => y.GYSID === x.ID);
            x.LXRINFO = [...arr];
          });
          setTableData(p => tableArr);
          setTotal(res.totalrows);
          // console.log('🚀 ~ file: index.js:117 ~ handleSearch ~ tableArr:', tableArr);
          setTableLoading(false);
        }
      })
      .catch(e => {
        console.error('handleSearch', e);
        message.error('查询失败', 1);
        setTableLoading(false);
      });
  };

  //重置按钮
  const handleReset = () => {
    setGysmc(undefined);
    setGyslx([]);
    setGyslxmc([]);
    setLxrmc(undefined);
    setGyszt(undefined);
    setGtAmount(undefined); //项目金额，大于
    setMinAmount(undefined); //项目金额，最小
    setMaxAmount(undefined); //项目金额，最大
    setLtAmount(undefined); //项目金额，小于
    setXmNum({
      gt: undefined,
      lt: undefined,
      min: undefined,
      max: undefined,
    });
  };

  // onChange-start
  const handleGysmcChange = v => {
    // console.log('handleGysmcChange', v);
    setGysmc(v);
  };
  const handleGyslxChange = (v, node) => {
    setGyslx(p => [...v]);
    let arr = [];
    node?.forEach(x => arr.push(x?.props?.children));
    setGyslxmc(p => arr);
    //  console.log("🚀 ~ file: index.js:163 ~ handleGyslxChange ~ arr:", arr)
  };
  const handleLxrmcChange = (v, node) => {
    // console.log('handleLxrmcChange', v, node);
    setLxrmc(node?.props?.children);
  };
  const handleGysztChange = v => {
    setGyszt(v);
  };
  //大于、区间
  const handleXmNumSltChange = v => {
    setXmNumSelector(v);
    setXmNum({
      gt: undefined,
      lt: undefined,
      min: undefined,
      max: undefined,
    });
  };
  //项目数量，大于
  const handleGtXmNumChange = v => {
    setXmNum({ ...xmNum, gt: v.target.value });
  };
  //项目数量，小于
  const handleLtXmNumChange = v => {
    setXmNum({ ...xmNum, lt: v.target.value });
  };
  //项目数量，最小
  const handleMinXmNumChange = v => {
    setXmNum({ ...xmNum, min: v.target.value });
  };
  //项目数量，最大
  const handleMaxXmNumChange = v => {
    setXmNum({ ...xmNum, max: v.target.value });
  };
  //大于、区间
  const handleAmtSltChange = v => {
    setAmountSelector(v);
    setGtAmount(undefined); //项目金额，大于
    setMinAmount(undefined); //项目金额，最小
    setMaxAmount(undefined); //项目金额，最大
    setLtAmount(undefined); //项目金额，小于
  };
  //项目金额，大于
  const handleGtAmountChange = v => {
    // console.log('handleGtAmountChange', v.target.value);
    setGtAmount(v.target.value);
  };
  //项目金额，小于
  const handleLtAmountChange = v => {
    // console.log('handleLtAmountChange', v);
    setLtAmount(v.target.value);
  };
  //项目金额，最小
  const handleMinAmountChange = v => {
    // console.log('handleBtAmountChange', v.target.value);
    setMinAmount(v.target.value);
  };
  //项目金额，最大
  const handleMaxAmountChange = v => {
    // console.log('handleBtAmountChange', v.target.value);
    setMaxAmount(v.target.value);
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">供应商名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleGysmcChange}
            value={gysmc}
            placeholder="请选择"
          >
            {gysData.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.GYSMC}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">供应商类型</div>
          <Select
            mode="multiple"
            className="item-selector"
            maxTagCount={1}
            maxTagPlaceholder={extraArr => {
              return `等${extraArr.length + 1}个`;
            }}
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            showArrow
            allowClear
            onChange={handleGyslxChange}
            value={gyslx}
            placeholder="请选择"
          >
            {gyslxData.map((x, i) => (
              <Option key={i} value={x.ibm}>
                {x.note}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">联系人名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleLxrmcChange}
            value={lxrmc}
            placeholder="请选择"
          >
            {lxrData.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.LXR}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          className="btn-search"
          type="primary"
          onClick={() => {
            setSortInfo({
              sort: undefined,
              columnKey: '',
            });
            setFilterData({
              gysmc,
              gyslx,
              lxrmc,
              gyszt,
              gtAmount,
              ltAmount,
              minAmount,
              maxAmount,
              xmNum,
            });
            handleSearch({
              current: 1,
              pageSize: 20,
              gysmc,
              gyslx,
              lxrmc,
              gyszt,
              gtAmount,
              ltAmount,
              minAmount,
              maxAmount,
              xmNum,
            });
          }}
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">供应商状态</div>
          <Select
            className="item-selector"
            dropdownClassName="item-selector-dropdown"
            value={gyszt}
            allowClear
            onChange={handleGysztChange}
            placeholder="请选择"
          >
            <Option value="1">黑名单</Option>
            <Option value="2">淘汰</Option>
            <Option value="3">淘汰、黑名单</Option>
            <Option value="4">正常</Option>
          </Select>
        </div>
        <div className="console-last-item">
          <div className="item-txt">项目金额</div>
          <div className="item-compact">
            <Select
              defaultValue="1"
              className="item-selector"
              dropdownClassName="item-selector-dropdown"
              onChange={handleAmtSltChange}
            >
              <Option value="1">区间</Option>
              <Option value="2">大于</Option>
              <Option value="3">小于</Option>
            </Select>
            {amountSelector === '1' && (
              <div className="input-between">
                <Input
                  className="input-min"
                  value={minAmount}
                  onChange={handleMinAmountChange}
                  placeholder="下限"
                  type="number"
                  // allowClear
                />
                <Input className="input-to" placeholder="-" disabled />
                <Input
                  className="input-max"
                  value={maxAmount}
                  onChange={handleMaxAmountChange}
                  placeholder="上限"
                  type="number"
                  // allowClear
                />
              </div>
            )}
            {amountSelector === '2' && (
              <Input
                className="item-input"
                value={gtAmount}
                onChange={handleGtAmountChange}
                placeholder="请输入"
                type="number"
                allowClear
              />
            )}
            {amountSelector === '3' && (
              <Input
                className="item-input"
                value={ltAmount}
                onChange={handleLtAmountChange}
                placeholder="请输入"
                type="number"
                allowClear
              />
            )}
          </div>
        </div>
        <div className="console-last-item">
          <div className="item-txt">项目数量</div>
          <div className="item-compact">
            <Select
              defaultValue="1"
              className="item-selector"
              dropdownClassName="item-selector-dropdown"
              onChange={handleXmNumSltChange}
            >
              <Option value="1">区间</Option>
              <Option value="2">大于</Option>
              <Option value="3">小于</Option>
            </Select>
            {xmNumSelector === '1' && (
              <div className="input-between">
                <Input
                  className="input-min"
                  value={xmNum.min}
                  onChange={handleMinXmNumChange}
                  placeholder="下限"
                  type="number"
                  // allowClear
                />
                <Input className="input-to" placeholder="-" disabled />
                <Input
                  className="input-max"
                  value={xmNum.max}
                  onChange={handleMaxXmNumChange}
                  placeholder="上限"
                  type="number"
                  // allowClear
                />
              </div>
            )}
            {xmNumSelector === '2' && (
              <Input
                className="item-input"
                value={xmNum.gt}
                onChange={handleGtXmNumChange}
                placeholder="请输入"
                type="number"
                allowClear
              />
            )}
            {xmNumSelector === '3' && (
              <Input
                className="item-input"
                value={xmNum.lt}
                onChange={handleLtXmNumChange}
                placeholder="请输入"
                type="number"
                allowClear
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
