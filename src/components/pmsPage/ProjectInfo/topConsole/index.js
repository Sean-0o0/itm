import React, { useEffect, useState } from 'react';
import { Select, Button, Input, TreeSelect } from 'antd';
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
    const [budget, setBudget] = useState(undefined); //关联预算
    const [budgetType, setBudgetType] = useState('1'); //关联预算类型id
    const [label, setLabel] = useState([]); //项目标签
    const [prjName, setPrjName] = useState(undefined); //项目名称
    const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
    const [org, setOrg] = useState(undefined); //应用部门  待定------->需要改成单选*****
    const [prjType, setPrjType] = useState(undefined); //项目类型
    const [gtAmount, setGtAmount] = useState(undefined); //项目金额，大于
    const [minAmount, setMinAmount] = useState(undefined); //项目金额，最小
    const [maxAmount, setMaxAmount] = useState(undefined); //项目金额，最大

    const { setTableLoading, setTableData } = props;

    useEffect(() => {
        getFilterData();
        return () => {
        }
    }, []);
    function uniqueFunc(arr, uniId) {
        const res = new Map();
        return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
    }
    const toItemTree = (list, parId) => {
        let a = list.reduce((pre, current, index) => {
            pre[current.YSLXID] = pre[current.YSLXID] || [];
            pre[current.YSLXID].push({
                key: current.YSLXID,
                title: current.YSLX,
                value: current.YSLXID,
                ID: current.ID,
                KGLYS: Number(current.KGLYS),
                YSLB: current.YSLB,
                YSXM: current.YSXM,
                ZYS: Number(current.ZYS),
                ZDBM: current.ZDBM,
                YSLX: current.YSLX,
                YSLXID: current.YSLXID,
                KZXYS: Number(current.KZXYS),
            });
            return pre;
        }, []);

        const treeData = [];
        for (const key in a) {
            const indexData = [];
            const childrenData = [];
            const childrenDatamini = [];
            if (a.hasOwnProperty(key)) {
                if (a[key] !== null) {
                    // console.log("item",a[key]);
                    let b = a[key].reduce((pre, current, index) => {
                        pre[current.ZDBM] = pre[current.ZDBM] || [];
                        pre[current.ZDBM].push({
                            key: current.ID,
                            title: current.YSXM,
                            value: current.ID + current.YSLXID,
                            ID: current.ID,
                            KGLYS: Number(current.KGLYS),
                            YSLB: current.YSLB,
                            YSXM: current.YSXM,
                            ZYS: Number(current.ZYS),
                            ZDBM: current.ZDBM,
                            YSLX: current.YSLX,
                            YSLXID: current.YSLXID,
                            KZXYS: Number(current.KZXYS),
                        });
                        return pre;
                    }, []);
                    a[key].map(item => {
                        if (indexData.indexOf(item.ZDBM) === -1) {
                            indexData.push(item.ZDBM)
                            if (b[item.ZDBM]) {
                                let treeDatamini = { children: [] }
                                if (item.ZDBM === "6") {
                                    // console.log("b[item.ZDBM]",b["6"])
                                    b[item.ZDBM].map(i => {
                                        treeDatamini.key = i.ID
                                        treeDatamini.value = i.ID + i.ZDBM
                                        treeDatamini.title = i.YSXM
                                        treeDatamini.ID = i.ID
                                        treeDatamini.KGLYS = Number(i.KGLYS)
                                        treeDatamini.YSLB = i.YSLB
                                        treeDatamini.YSXM = i.YSXM
                                        treeDatamini.ZYS = Number(i.ZYS)
                                        treeDatamini.KZXYS = Number(i.KZXYS)
                                        treeDatamini.ZDBM = i.ZDBM
                                    })
                                    // treeDatamini.dropdownStyle = { color: '#666' }
                                    // treeDatamini.selectable=false;
                                    // treeDatamini.children = b[item.ZDBM]
                                } else {
                                    treeDatamini.key = item.ZDBM
                                    treeDatamini.value = item.ZDBM + item.YSLXID
                                    treeDatamini.title = item.YSLB
                                    treeDatamini.ID = item.ID
                                    treeDatamini.KGLYS = Number(item.KGLYS)
                                    treeDatamini.YSLB = item.YSLB
                                    treeDatamini.YSXM = item.YSXM
                                    treeDatamini.YSLX = item.YSLX
                                    treeDatamini.YSLXID = item.YSLXID
                                    treeDatamini.ZYS = Number(item.ZYS)
                                    treeDatamini.KZXYS = Number(item.KZXYS)
                                    treeDatamini.ZDBM = item.ZDBM
                                    treeDatamini.dropdownStyle = { color: '#666' }
                                    treeDatamini.selectable = false;
                                    treeDatamini.children = b[item.ZDBM]
                                }
                                childrenDatamini.push(treeDatamini)
                            }
                            childrenData.key = key;
                            childrenData.value = key;
                            childrenData.title = item.YSLX;
                            childrenData.dropdownStyle = { color: '#666' };
                            childrenData.selectable = false;
                            childrenData.children = childrenDatamini;
                        }
                    })
                    treeData.push(childrenData);
                }
            }
        }
        return treeData;
    }
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
                setBudgetData(p => [...toItemTree(JSON.parse(res.budgetProjectRecord))]);
                // console.log("🚀 ~ budget:", toItemTree(JSON.parse(res.budgetProjectRecord)));
                setLabelData(p => [...JSON.parse(res.labelRecord)]);
                setOrgData(p => [...JSON.parse(res.orgRecord)]);
                setPrjMngerData(p => [...JSON.parse(res.projectManagerRecord)]);
                setprjNameData(p => [...JSON.parse(res.projectRecord)]);
            }
        }).catch(e => {
            console.error('QueryProjectListPara', e);
        });
    };

    //查询按钮
    const handleSearch = () => {
        setTableLoading(true);
        let params = {
            "current": 1,
            "pageSize": 10,
            "paging": -1,
            "sort": "string",
            "total": -1
        };

        if (budget !== undefined && budget !== '') {
            params.budgetProject = Number(budget);
            params.budgetType = Number(budgetType);
        }
        if (prjName !== undefined && prjName !== '') {
            params.projectId = Number(prjName);
        }
        if (prjMnger !== undefined && prjMnger !== '') {
            params.projectManager = Number(prjMnger);
        }
        if (amountSelector === '1') {//区间 ,目前暂定只有均不为空时才查
            if (minAmount !== undefined && minAmount !== '' && maxAmount !== undefined && maxAmount !== '') {
                params.amountType = 'SCOPE';
                params.amountBig = Number(maxAmount);
                params.amountSmall = Number(minAmount);
            }
        } else {//大于
            if (gtAmount !== undefined && gtAmount !== '') {
                params.amountType = 'BIGGER';
                params.amountSmall = Number(gtAmount);
            }
        }
        // if (org.length !== 0) {
        //     params.orgId = org.join(';');
        // }
        if (org !== undefined && org !== '') {
            params.orgId = Number(org);
        }
        if (label.length !== 0) {
            params.projectLabel = label.join(';');
        }
        if (prjType !== undefined && prjType !== '') {
            params.projectType = Number(prjType);
        }
        console.log('params', params);
        QueryProjectListInfo(params).then(res => {
            if (res?.success) {
                console.log('JSON.parse(res.record)', JSON.parse(res.record));
                setTableData(p => [...JSON.parse(res.record)]);
                setTableLoading(false);
            }
        }).catch(e => {
            console.error('handleSearch', e);
            setTableLoading(false);
        });
    };

    //重置按钮
    const handleReset = (v) => {
        setBudget(undefined); //关联预算
        setLabel([]); //项目标签
        setPrjName(undefined); //项目名称
        setPrjMnger(undefined); //项目经理
        setOrg([]); //应用部门
        setPrjType(undefined); //项目类型
        setGtAmount(undefined); //项目金额，大于
        setMinAmount(undefined); //项目金额，最小
        setMaxAmount(undefined); //项目金额，最大
    };

    // onChange-start
    //大于、区间
    const handleAmtSltChange = (v) => {
        setAmountSelector(v);
    };
    //项目经理
    const handlePrjMngerChange = (v) => {
        // console.log('handlePrjMngerChange', v);
        // if (v === undefined) v = '';
        setPrjMnger(v);
    };
    //项目名称
    const handlePrjNameChange = (v) => {
        // console.log('handlePrjMngerChange', v);
        // if (v === undefined) v = '';
        setPrjName(v);
    };
    //项目类型
    const handlePrjTypeChange = (v) => {
        // console.log('handlePrjMngerChange', v);
        // if (v === undefined) v = '';
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
        setOrg(v);
    };
    //关联预算
    const handleBudgetChange = (v, txt, node) => {
        console.log('handleBudgetChange', node.triggerNode.props);
        // if (v === undefined) v = '';
        setBudget(node.triggerNode.props.ID);
        if (node.triggerNode.props?.ZDBM === '6') {
            setBudgetType('4');
        } else {
            setBudgetType(node.triggerNode.props.YSLXID);
        }

    };
    //项目金额，大于
    const handleGtAmountChange = (v) => {
        // console.log('handleGtAmountChange', v.target.value);
        setGtAmount(v.target.value);
    };
    //项目金额，最小
    const handleMinAmountChange = (v) => {
        // console.log('handleBtAmountChange', v.target.value);
        setMinAmount(v.target.value);
    };
    //项目金额，最大
    const handleMaxAmountChange = (v) => {
        // console.log('handleBtAmountChange', v.target.value);
        setMaxAmount(v.target.value);
    };
    // onChange-end
    return (
        <div className='top-console'>
            <div className='item-box'>
                <div className='console-item'>
                    <div className='item-label'>项目经理</div>
                    <Select className='item-selector'
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={prjMnger} showSearch allowClear onChange={handlePrjMngerChange} placeholder='请选择'>
                        {prjMngerData.map((x, i) => <Option key={i} value={x.ID}>{x.USERNAME}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    <div className='item-label'>项目名称</div>
                    <Select className='item-selector'
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={prjName} showSearch allowClear onChange={handlePrjNameChange} placeholder='请选择'>
                        {prjNameData.map((x, i) => <Option key={i} value={x.XMID}>{x.XMMC}</Option>)}
                    </Select>
                </div>
                <div className='console-item' >
                    <div className='item-label'>项目类型</div>
                    <Select className='item-selector'
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={prjType} showSearch allowClear onChange={handlePrjTypeChange} placeholder='请选择'>
                        {XMLX?.map((x, i) => <Option key={i} value={x.cbm}>{x.note}</Option>)}
                    </Select>
                </div>
                <Button className='btn-search' type='primary' onClick={handleSearch}>查询</Button>
                <Button className='btn-reset' onClick={handleReset}>重置</Button>
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
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={label}
                        placeholder='请选择'
                        allowClear mode='multiple'
                        onChange={handleLabelChange}>
                        {labelData.map((x, i) => <Option key={i} value={x.ID}>{x.BQMC}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    <div className='item-label'>应用部门</div>
                    <Select className='item-selector'
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={org} showSearch allowClear onChange={handleOrgChange} placeholder='请选择'>
                        {orgData.map((x, i) => <Option key={i} value={x.ID}>{x.NAME}</Option>)}
                    </Select>
                </div>
                <div className='console-item'>
                    <div className='item-label'>关联预算</div>
                    {/* <Select className='item-selector'
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={budget} showSearch allowClear onChange={handleBudgetChange} placeholder='请选择'>
                        {budgetData.map((x, i) => <Option key={i} value={x.ID} yslxid={x.YSLXID}>{x.YSXM}</Option>)}
                    </Select> */}
                    <TreeSelect
                        allowClear
                        className='item-selector'
                        showSearch
                        treeNodeFilterProp="title"
                        dropdownClassName="newproject-treeselect"
                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                        treeData={budgetData}
                        placeholder="请选择"
                        onChange={handleBudgetChange}
                    />
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