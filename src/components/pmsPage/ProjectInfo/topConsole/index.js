import React, { useEffect, useState } from 'react';
import { Select, Button, Input, InputNumber } from 'antd';
import { QueryProjectListPara, QueryProjectListInfo } from "../../../../services/pmsServices";
const InputGroup = Input.Group;
const { Option } = Select;

export default function TopConsole() {
    const [amountSelector, setAmountSelector] = useState('1'); //项目金额下拉框，区间 '1'，大于 '2'
    const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false
    const [budgetData, setBudgetData] = useState([]); //关联预算
    const [labelData, setLabelData] = useState([]); //项目标签
    const [prjNameData, setprjNameData] = useState([]); //项目名称
    const [prjMngerData, setPrjMngerData] = useState([]); //项目经理
    const [orgData, setOrgData] = useState([]); //应用部门
    const [prjTypeData, setPrjTypeData] = useState([]); //项目类型
    const [budget, setBudget] = useState(''); //关联预算
    const [label, setLabel] = useState(''); //项目标签
    const [prjName, setprjName] = useState(''); //项目名称
    const [prjMnger, setPrjMnger] = useState(); //项目经理
    const [org, setOrg] = useState(''); //应用部门
    const [prjType, setPrjType] = useState(''); //项目类型

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
    //大于、区间
    const handleAmtSltChange = (v) => {
        setAmountSelector(v);
    };
    return (
        <div className='top-console'>
            <div className='item-box'>
                <div className='console-item'>
                    项目经理
                    <Select className='item-selector' onChange={(v) => setPrjMnger(v)}>
                        {prjMngerData.map((x, i) => <Option key={i} value={x.ID}>{x.USERNAME}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    项目名称
                    <Select className='item-selector' onChange={(v) => setprjName(v)}>
                        {prjNameData.map((x, i) => <Option key={i} value={x.ID}>{x.USERNAME}</Option>)}
                    </Select>
                </div>
                <div className='console-item' onChange={(v) => setPrjType(v)}>
                    项目类型
                    <Select className='item-selector'>
                        {/* {prjType.map((x, i) => <Option key={i} value={x.ID}>{x.USERNAME}</Option>)} */}
                    </Select>
                </div>
                <Button className='btn-search' type='primary'>查询</Button>
                <Button className='btn-reset'>重置</Button>
            </div>
            <div className='item-box'>
                <div className='console-item' >
                    项目标签
                    <Select className='item-selector' mode='multiple' onChange={(v) => setLabel([...v])}>
                        {labelData.map((x, i) => <Option key={i} value={x.ID}>{x.BQMC}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    应用部门
                    <Select className='item-selector'  mode='multiple' onChange={(v) => setOrg([...v])}>
                        {orgData.map((x, i) => <Option key={i} value={x.ID}>{x.NAME}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    关联预算
                    <Select className='item-selector' onChange={(v) => setBudget(v)}>
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
                            {amountSelector === '1' ?
                                <Input className='item-input' defaultValue="Xihu District, Hangzhou" />
                                :
                                <div className='input-between'>
                                    <Input className='input-min' placeholder="Minimum" />
                                    <Input className='input-to' placeholder="~" disabled />
                                    <Input className='input-max' placeholder="Maximum" />
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