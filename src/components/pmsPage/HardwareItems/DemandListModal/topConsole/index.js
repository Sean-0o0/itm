import React, { useEffect, useState } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col } from 'antd';

const InputGroup = Input.Group;
const { Option } = Select;

export default function TopConsole(props) {
  const [demand, setDemand] = useState(''); //询比项目名称
  const [drafter, setDrafter] = useState(''); //发起人
  const [amountSelector, setAmountSelector] = useState('1'); //预算金额下拉框，区间 '1'，大于 '2'
  const [budgetData, setBudgetData] = useState([]); //关联预算
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [dmNameData, setDmNameData] = useState([]); //需求名称
  const [prjMngerData, setPrjMngerData] = useState([]); //项目经理
  //查询的值
  const [budget, setBudget] = useState(undefined); //关联预算
  const [budgetValue, setBudgetValue] = useState(undefined); //关联预算-为了重置
  const [budgetType, setBudgetType] = useState('1'); //关联预算类型id
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [dmName, setDmName] = useState(undefined); //需求名称
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [gtAmount, setGtAmount] = useState(undefined); //预算金额，大于
  const [ltAmount, setLtAmount] = useState(undefined); //预算金额，小于
  const [minAmount, setMinAmount] = useState(undefined); //预算金额，最小
  const [maxAmount, setMaxAmount] = useState(undefined); //预算金额，最大
  //查询的值
  const { handleSearch, callBackParams, params, FRQData } = props;

  useEffect(() => {
    return () => {};
  }, []);

  //重置按钮
  const handleReset = v => {
    setBudget(undefined); //关联预算-生效的入参
    setBudgetValue(undefined); //关联预算-单纯为了重置
    setBudgetType('1'); //预算类型
    setDmName(undefined); //需求名称
    setPrjName(undefined); //项目名称
    setPrjMnger(undefined); //项目经理
    setGtAmount(undefined); //项目金额，大于
    setMinAmount(undefined); //项目金额，最小
    setMaxAmount(undefined); //项目金额，最大
    setLtAmount(undefined); //项目金额，小于
    // callBackParams({ ...params, demand: '', drafter: '', current: 1 });
  };

  // onChange-start
  //大于、区间
  const handleAmtSltChange = v => {
    setAmountSelector(v);
    setGtAmount(undefined); //项目金额，大于
    setMinAmount(undefined); //项目金额，最小
    setMaxAmount(undefined); //项目金额，最大
    setLtAmount(undefined); //项目金额，小于
  };
  //项目经理
  const handlePrjMngerChange = v => {
    // console.log('handlePrjMngerChange', v);
    // if (v === undefined) v = '';
    setPrjMnger(v);
  };
  //项目名称
  const handlePrjNameChange = v => {
    // console.log('handlePrjMngerChange', v);
    // if (v === undefined) v = '';
    setPrjName(v);
  };
  //关联预算
  const handleBudgetChange = (v, txt, node) => {
    // console.log('handleBudgetChange', v, node?.triggerNode?.props);
    // if (v === undefined) v = '';
    setBudget(node?.triggerNode?.props?.ID);
    setBudgetValue(v);
    if (node?.triggerNode?.props?.ZDBM === '6') {
      setBudgetType('4');
    } else {
      setBudgetType(node?.triggerNode?.props?.YSLXID);
    }
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
  //询比项目名称
  const handleNameChange = v => {
    console.log('询比项目名称询比项目名称询比项目名称', v.target.value);
    setDemand(v.target.value);
    callBackParams({ ...params, demand: String(v.target.value), current: 1 });
  };

  //发起人
  const handleFQRNameChange = v => {
    console.log('发起人发起人发起人', v);
    setDrafter(v);
    callBackParams({ ...params, drafter: Number(v), current: 1 });
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">项目名称：</div>
          <Select
            className="item-selector"
            placeholder="请选择"
            showSearch
            allowClear
            onChange={handleFQRNameChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {FRQData?.map((item = {}, ind) => {
              return (
                <Option key={item.FQR} value={item.FQR}>
                  {item.NAME}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">项目经理：</div>
          <Select
            className="item-selector"
            placeholder="请选择"
            showSearch
            allowClear
            onChange={handleFQRNameChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {FRQData?.map((item = {}, ind) => {
              return (
                <Option key={item.FQR} value={item.FQR}>
                  {item.NAME}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">需求名称：</div>
          <Select
            className="item-selector"
            placeholder="请选择"
            showSearch
            allowClear
            onChange={handleFQRNameChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {FRQData?.map((item = {}, ind) => {
              return (
                <Option key={item.FQR} value={item.FQR}>
                  {item.NAME}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="btn-item">
          <Button className="btn-search" type="primary" onClick={() => handleSearch({ ...params })}>
            查询
          </Button>
          <Button className="btn-reset" onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
      <div className="item-box">
        {/* <div className="console-item" style={{width: '275px'}}>
          <div className="item-label">项目名称：</div>
          <Input placeholder="请输入" value={demand} onChange={handleNameChange}/>
        </div> */}
        <div className="console-item">
          <div className="item-label">预算项目：</div>
          <TreeSelect
            allowClear
            className="item-selector"
            showSearch
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            treeData={budgetData}
            placeholder="请选择"
            onChange={handleBudgetChange}
            value={budgetValue}
          />
        </div>
        <div className="console-last-item">
          <div className="item-txt">预算金额：</div>
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
                />
                <Input className="input-to" placeholder="-" disabled />
                <Input
                  className="input-max"
                  value={maxAmount}
                  onChange={handleMaxAmountChange}
                  placeholder="上限"
                />
              </div>
            )}
            {amountSelector === '2' && (
              <Input
                className="item-input"
                value={gtAmount}
                onChange={handleGtAmountChange}
                placeholder="请输入"
              />
            )}
            {amountSelector === '3' && (
              <Input
                className="item-input"
                value={ltAmount}
                onChange={handleLtAmountChange}
                placeholder="请输入"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
