import React, { Component } from 'react'
import { Select, Button, TreeSelect, Input } from 'antd'

class ToConsole extends Component {
    state = {
        filterFold: true,
        amtSltChange: true,
        amountSelector: '1',
        minAmount: undefined,
        maxAmount: undefined,
        gtAmount: undefined,
        ltAmount: undefined
    }

    //重置按钮
    handleReset = () => {

    };

    //大于、区间
    handleAmtSltChange = v => {
        this.setState({
            amountSelector: v
        })
    };

    //项目预算，大于
    handleGtAmountChange = v => {
        this.setState({
            gtAmount: v.target.value
        })
    };
    //项目预算，小于
    handleLtAmountChange = v => {
        this.setState({
            ltAmount: v.target.value
        })
    };
    //项目预算，最小
    handleMinAmountChange = v => {
        this.setState({
            minAmount: v.target.value
        })
    };
    //项目预算，最大
    handleMaxAmountChange = v => {
        this.setState({
            maxAmount: v.target.value
        })
    };

    render() {
        const { filterFold,
            amountSelector,
            minAmount,
            maxAmount,
            gtAmount,
            ltAmount } = this.state

        return (<div className="top-console">
            <div className="item-box">
                <div className="console-item">
                    <div className="item-label">项目名称</div>
                    <Select
                        className="item-selector"
                        dropdownClassName={'item-selector-dropdown'}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        allowClear
                        placeholder="请选择"
                    >
                        {/* {prjMngerData.map((x, i) => (
                <Select.Option key={i} value={x.ID}>
                  {x.USERNAME}
                </Select.Option>
              ))} */}
                    </Select>
                </div>
                <div className="console-item">
                    <div className="item-label">项目类型</div>
                    <Select
                        className="item-selector"
                        dropdownClassName={'item-selector-dropdown'}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        allowClear
                        placeholder="请选择"
                    >
                        {/* {prjNameData.map((x, i) => (
                <Option key={i} value={x.XMID}>
                  {x.XMMC}
                </Option>
              ))} */}
                    </Select>
                </div>
                <div className="console-item">
                    <div className="item-label">项目标签</div>
                    <Select
                        className="item-selector"
                        dropdownClassName={'item-selector-dropdown'}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        allowClear
                        placeholder="请选择"
                    >
                        {/* {XMLX?.map((x, i) => (
                <Option key={i} value={x.cbm}>
                  {x.note}
                </Option>
              ))} */}
                    </Select>
                </div>
                <Button
                    className="btn-search"
                    type="primary"
                // onClick={() =>
                //   handleSearch({
                //     budget,
                //     budgetType,
                //     prjName,
                //     prjMnger,
                //     minAmount,
                //     maxAmount,
                //     gtAmount,
                //     ltAmount,
                //     org,
                //     label,
                //     prjType,
                //   })
                // }
                >
                    查询
                </Button>
                <Button className="btn-reset" onClick={this.handleReset}>
                    重置
                </Button>
            </div>
            <div className="item-box">
                <div className="console-item">
                    <div className="item-label">文档类型</div>
                    <Select
                        className="item-selector"
                        maxTagCount={2}
                        maxTagTextLength={42}
                        maxTagPlaceholder={extraArr => {
                            return `等${extraArr.length + 2}个`;
                        }}
                        dropdownClassName={'item-selector-dropdown'}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="请选择"
                        allowClear
                        mode="multiple"
                    // onChange={this.handleLabelChange}
                    // value={label}
                    >
                        {/* {labelData.map((x, i) => (
                            <Option key={i} value={x.ID}>
                                {x.BQMC}
                            </Option>
                        ))} */}
                    </Select>
                </div>
                <div className="console-item">
                    <div className="item-label">项目经理</div>
                    <TreeSelect
                        allowClear
                        className="item-selector"
                        showSearch
                        treeCheckable
                        maxTagCount={2}
                        maxTagTextLength={42}
                        maxTagPlaceholder={extraArr => {
                            return `等${extraArr.length + 2}个`;
                        }}
                        showCheckedStrategy={TreeSelect.SHOW_PARENT}
                        treeNodeFilterProp="title"
                        dropdownClassName="newproject-treeselect"
                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                        // treeData={orgData}
                        placeholder="请选择"
                    // onChange={handleOrgChange}
                    // value={org}
                    />
                </div>
                <div className="console-item">
                    <div className="item-label">关联预算</div>
                    <TreeSelect
                        allowClear
                        className="item-selector"
                        showSearch
                        treeNodeFilterProp="title"
                        dropdownClassName="newproject-treeselect"
                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                        // treeData={budgetData}
                        placeholder="请选择"
                    // onChange={handleBudgetChange}
                    // value={budgetValue}
                    />
                </div>
                {filterFold && (
                    <div className="filter-unfold" onClick={() => this.setState({ filterFold: false })}>
                        更多
                        <i className="iconfont icon-down" />
                    </div>
                )}
            </div>
            {!filterFold && (
                <div className="item-box">
                    <div className="console-last-item">
                        <div className="item-txt">项目预算</div>
                        <div className="item-compact">
                            <Select
                                defaultValue="1"
                                className="item-selector"
                                dropdownClassName="item-selector-dropdown"
                                onChange={this.handleAmtSltChange}
                            >
                                <Select.Option value="1">区间</Select.Option>
                                <Select.Option value="2">大于</Select.Option>
                                <Select.Option value="3">小于</Select.Option>
                            </Select>
                            {amountSelector === '1' && (
                                <div className="input-between">
                                    <Input
                                        className="input-min"
                                        value={minAmount}
                                        onChange={this.handleMinAmountChange}
                                        placeholder="下限"
                                    />
                                    <Input className="input-to" placeholder="~" disabled />
                                    <Input
                                        className="input-max"
                                        value={maxAmount}
                                        onChange={this.handleMaxAmountChange}
                                        placeholder="上限"
                                    />
                                </div>
                            )}
                            {amountSelector === '2' && (
                                <Input
                                    className="item-input"
                                    value={gtAmount}
                                    onChange={this.handleGtAmountChange}
                                    placeholder="请输入"
                                />
                            )}
                            {amountSelector === '3' && (
                                <Input
                                    className="item-input"
                                    value={ltAmount}
                                    onChange={this.handleLtAmountChange}
                                    placeholder="请输入"
                                />
                            )}
                        </div>
                    </div>
                    <div className="filter-unfold" onClick={() => this.setState({filterFold: true})}>
                        收起
                        <i className="iconfont icon-up" />
                    </div>
                </div>
            )}
        </div>);
    }
}

export default ToConsole;