import React, { useEffect, useState } from 'react';
import { Select, Button, Input, InputNumber } from 'antd';
const InputGroup = Input.Group;
const { Option } = Select;

export default function TopConsole() {
    const [amountSelector, setAmountSelector] = useState('1'); //项目金额下拉框，区间 '1'，大于 '2'
    const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false

    useEffect(() => {

        return () => {
        }
    }, []);
    const handleAmtSltChange = (v) => {
        setAmountSelector(v);
    };
    return (
        <div className='top-console'>
            <div className='item-box'>
                <div className='console-item'>
                    项目经理
                    <Select defaultValue="Zhejiang" className='item-selector'>
                        <Option value="Zhejiang">Zhejiang</Option>
                        <Option value="Jiangsu">Jiangsu</Option>
                    </Select>
                </div>
                <div className='console-item'>
                    项目名称
                    <Select defaultValue="Zhejiang" className='item-selector'>
                        <Option value="Zhejiang">Zhejiang</Option>
                        <Option value="Jiangsu">Jiangsu</Option>
                    </Select>
                </div>
                <div className='console-item'>
                    项目类型
                    <Select defaultValue="Zhejiang" className='item-selector'>
                        <Option value="Zhejiang">Zhejiang</Option>
                        <Option value="Jiangsu">Jiangsu</Option>
                    </Select>
                </div>
                <Button className='btn-search' type='primary'>查询</Button>
                <Button className='btn-reset'>重置</Button>
            </div>
            <div className='item-box'>
                <div className='console-item'>
                    项目标签
                    <Select defaultValue="Zhejiang" className='item-selector'>
                        <Option value="Zhejiang">Zhejiang</Option>
                        <Option value="Jiangsu">Jiangsu</Option>
                    </Select>
                </div>
                <div className='console-item'>
                    应用部门
                    <Select defaultValue="Zhejiang" className='item-selector'>
                        <Option value="Zhejiang">Zhejiang</Option>
                        <Option value="Jiangsu">Jiangsu</Option>
                    </Select>
                </div>
                <div className='console-item'>
                    关联预算
                    <Select defaultValue="Zhejiang" className='item-selector'>
                        <Option value="Zhejiang">Zhejiang</Option>
                        <Option value="Jiangsu">Jiangsu</Option>
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