import React, { useEffect, useState } from 'react';
import { Select, Button, Input, InputNumber } from 'antd';
import { QueryProjectListPara, QueryProjectListInfo } from "../../../../services/pmsServices";
const InputGroup = Input.Group;
const { Option } = Select;

export default function TopConsole(props) {
    const [amountSelector, setAmountSelector] = useState('1'); //项目金额下拉框，区间 '1'，大于 '2'
    const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false
    //下拉框数据
    const [budgetData, setBudgetData] = useState([]); //关联预算
    const [labelData, setLabelData] = useState([]); //项目标签
    const [prjNameData, setprjNameData] = useState([]); //项目名称
    const [prjMngerData, setPrjMngerData] = useState([]); //项目经理
    const [orgData, setOrgData] = useState([]); //应用部门
    const { XMLX } = props.dictionary; //项目类型
    //查询的值
    const [budget, setBudget] = useState(''); //关联预算
    const [label, setLabel] = useState([]); //项目标签
    const [prjName, setprjName] = useState(''); //项目名称
    const [prjMnger, setPrjMnger] = useState(''); //项目经理
    const [org, setOrg] = useState([]); //应用部门
    const [prjType, setPrjType] = useState(''); //项目类型
    const [gtAmount, setGtAmount] = useState(''); //项目金额，大于
    const [minAmount, setMinAmount] = useState([]); //项目金额，最小
    const [maxAmount, setMaxAmount] = useState([]); //项目金额，最大

    useEffect(() => {
        getFilterData()
        return () => {
        }
    }, []);
    //顶部下拉框查询数据
    const getFilterData = () => {
        QueryProjectListPara({
            "current": 1,
            "czr": 0,
            "pageSize": 10,
            "paging": 1,
            "sort": "string",
            "total": -1
        }).then(res => {
            if (res?.success) {
                setBudgetData(p => [...JSON.parse(res.budgetProjectRecord)]);
                setLabelData(p => [...JSON.parse(res.labelRecord)]);
                setOrgData(p => [...JSON.parse(res.orgRecord)]);
                setPrjMngerData(p => [...JSON.parse(res.projectManagerRecord)]);
                setprjNameData(p => [...JSON.parse(res.projectRecord)]);
            }
        }).catch(e => {
            console.error('QueryProjectListPara', e);
        });
    };

    // onChange-start
    //大于、区间
    const handleAmtSltChange = (v) => {
        setAmountSelector(v);
    };
    //项目经理
    const handlePrjMngerChange = (v) => {
        // console.log('handlePrjMngerChange', v);
        if (v === undefined) v = '';
        setPrjMnger(v);
    };
    //项目名称
    const handlePrjNameChange = (v) => {
        // console.log('handlePrjMngerChange', v);
        if (v === undefined) v = '';
        setPrjName(v);
    };
    //项目类型
    const handlePrjTypeChange = (v) => {
        // console.log('handlePrjMngerChange', v);
        if (v === undefined) v = '';
        setPrjType(v);
    };
    //项目标签
    const handleLabelChange = (v) => {
        // console.log('handleLabelChange', v);
        setLabel(p => [...v]);
    };
    //应用部门
    const handleOrgChange = (v) => {
        // console.log('handlePrjMngerChange', v);
        setOrg(p => [...v]);
    };
    //关联预算
    const handleBudgetChange = (v) => {
        // console.log('handleBudgetChange', v);
        if (v === undefined) v = '';
        setBudget(v);
    };
    //项目金额，大于
    const handleGtAmountChange = (v) => {
        console.log('handleGtAmountChange', v);
        setGtAmount(v);
    };
    //项目金额，最小
    const handleMinAmountChange = (v) => {
        console.log('handleBtAmountChange', v);
        setMinAmount(v);
    };
    //项目金额，最大
    const handleMaxAmountChange = (v) => {
        console.log('handleBtAmountChange', v);
        setMaxAmount(v);
    };
    // onChange-end
    return (
        <div className='top-console'>
            <div className='item-box'>
                <div className='console-item'>
                    <div className='item-label'>项目经理</div>
                    <Select className='item-selector' showSearch allowClear onChange={handlePrjMngerChange} placeholder='请选择'>
                        {prjMngerData.map((x, i) => <Option key={i} value={x.ID}>{x.USERNAME}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    <div className='item-label'>项目名称</div>
                    <Select className='item-selector' showSearch allowClear onChange={handlePrjNameChange} placeholder='请选择'>
                        {prjNameData.map((x, i) => <Option key={i} value={x.XMID}>{x.XMMC}</Option>)}
                    </Select>
                </div>
                <div className='console-item' >
                    <div className='item-label'>项目类型</div>
                    <Select className='item-selector' showSearch allowClear onChange={handlePrjTypeChange} placeholder='请选择'>
                        {XMLX?.map((x, i) => <Option key={i} value={x.cbm}>{x.note}</Option>)}
                    </Select>
                </div>
                <Button className='btn-search' type='primary'>查询</Button>
                <Button className='btn-reset'>重置</Button>
            </div>
            <div className='item-box'>
                <div className='console-item' >
                    <div className='item-label'>项目标签</div>
                    <Select className='item-selector'
                        // maxTagCount={2}
                        // maxTagTextLength={200}
                        // maxTagPlaceholder={(extraArr) => {
                        //     return `等${extraArr.length + 2}个`
                        // }}
                        placeholder='请选择'
                        allowClear mode='multiple'
                        onChange={handleLabelChange}>
                        {labelData.map((x, i) => <Option key={i} value={x.ID}>{x.BQMC}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    <div className='item-label'>应用部门</div>
                    <Select className='item-selector' allowClear mode='multiple' onChange={handleOrgChange} placeholder='请选择'>
                        {orgData.map((x, i) => <Option key={i} value={x.ID}>{x.NAME}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    <div className='item-label'>关联预算</div>
                    <Select className='item-selector' showSearch allowClear onChange={handleBudgetChange} placeholder='请选择'>
                        {budgetData.map((x, i) => <Option key={i} value={x.ID}>{x.YSXM}</Option>)}
                    </Select>
                </div>
                {filterFold &&
                    <div className='filter-unfold' onClick={() => setFilterFold(false)}>
                        更多<i className='iconfont icon-down' />
                    </div>}
            </div>
            {!filterFold &&
                <div className='item-box'>
                    <div className='console-last-item'>
                        <div className='item-txt'>
                            项目金额
                        </div>
                        <div className='item-compact'>
                            <Select defaultValue="1" className='item-selector' onChange={handleAmtSltChange}>
                                <Option value="1">区间</Option>
                                <Option value="2">大于</Option>
                            </Select>
                            {amountSelector === '2' ?
                                <Input className='item-input' onChange={handleGtAmountChange} placeholder='请输入' />
                                :
                                <div className='input-between'>
                                    <Input className='input-min' onChange={handleMinAmountChange} placeholder="请输入下限" />
                                    <Input className='input-to' placeholder="~" disabled />
                                    <Input className='input-max' onChange={handleMaxAmountChange} placeholder="请输入上限" />
                                </div>}
                        </div>
                    </div>
                    <div className='filter-unfold' onClick={() => setFilterFold(true)}>
                        收起<i className='iconfont icon-up' />
                    </div>
                </div>}
        </div>
    )
};