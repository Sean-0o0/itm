import React, { Component } from 'react'
import { QueryProjectListPara } from '../../../../services/pmsServices'
import { Select, Button, TreeSelect, Input, message } from 'antd'
import TreeUtils from '../../../../utils/treeUtils';

class ToConsole extends Component {
    state = {
        labelList: [],
        xmlist: [],
        wdlxList: [],
        xmjlList: [],
        glysList: [],
        filterFold: true,
        glysid: undefined,
        xmbqid: [],
        params: {
            xmid: undefined,
            xmlx: undefined,
            xmbq: undefined,
            wdlx: undefined,
            xmjl: undefined,
            glys: undefined,
            yssxlx: 'SCOPE',
            ysje1: undefined,
            ysje2: undefined,
        }
    }

    componentDidMount() {
        this.getFilterData()
    }

    //顶部下拉框查询数据
    getFilterData = () => {
        QueryProjectListPara({
            paging: -1,
            cxlx: 'WDLBPT',
        })
            .then(res => {
                const { code = 0 } = res;
                if (code > 0) {
                    const wdlx = JSON.parse(res.fileTypeRecord)
                    const wdlxList = TreeUtils.toTreeData(
                        wdlx,
                        {
                            keyName: 'ID',
                            pKeyName: 'FID',
                            titleName: 'NAME',
                            normalizeTitleName: 'title',
                            normalizeKeyName: 'value'
                        },
                        true
                    )
                    this.setState({
                        glysList: [...this.toItemTree(JSON.parse(res.budgetProjectRecord))],
                        xmlist: [...JSON.parse(res.projectRecord)],
                        xmjlList: [...JSON.parse(res.projectManagerRecord)],
                        labelList: [...JSON.parse(res.labelRecord)],
                        wdlxList: wdlxList.length ? wdlxList[0]?.children : []
                    });
                }
            })
            .catch((error) => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //转为树结构-关联项目
    toItemTree = (list, parId) => {
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
                            indexData.push(item.ZDBM);
                            if (b[item.ZDBM]) {
                                let treeDatamini = { children: [] };
                                if (item.ZDBM === '6') {
                                    // console.log("b[item.ZDBM]",b["6"])
                                    b[item.ZDBM].map(i => {
                                        treeDatamini.key = i.ID;
                                        treeDatamini.value = i.ID + i.ZDBM;
                                        treeDatamini.title = i.YSXM;
                                        treeDatamini.ID = i.ID;
                                        treeDatamini.KGLYS = Number(i.KGLYS);
                                        treeDatamini.YSLB = i.YSLB;
                                        treeDatamini.YSXM = i.YSXM;
                                        treeDatamini.ZYS = Number(i.ZYS);
                                        treeDatamini.KZXYS = Number(i.KZXYS);
                                        treeDatamini.ZDBM = i.ZDBM;
                                    });
                                    // treeDatamini.dropdownStyle = { color: '#666' }
                                    // treeDatamini.selectable=false;
                                    // treeDatamini.children = b[item.ZDBM]
                                } else {
                                    treeDatamini.key = item.ZDBM;
                                    treeDatamini.value = item.ZDBM + item.YSLXID;
                                    treeDatamini.title = item.YSLB;
                                    treeDatamini.ID = item.ID;
                                    treeDatamini.KGLYS = Number(item.KGLYS);
                                    treeDatamini.YSLB = item.YSLB;
                                    treeDatamini.YSXM = item.YSXM;
                                    treeDatamini.YSLX = item.YSLX;
                                    treeDatamini.YSLXID = item.YSLXID;
                                    treeDatamini.ZYS = Number(item.ZYS);
                                    treeDatamini.KZXYS = Number(item.KZXYS);
                                    treeDatamini.ZDBM = item.ZDBM;
                                    treeDatamini.dropdownStyle = { color: '#666' };
                                    treeDatamini.selectable = false;
                                    treeDatamini.children = b[item.ZDBM];
                                }
                                childrenDatamini.push(treeDatamini);
                            }
                            childrenData.key = key;
                            childrenData.value = key;
                            childrenData.title = item.YSLX;
                            childrenData.dropdownStyle = { color: '#666' };
                            childrenData.selectable = false;
                            childrenData.children = childrenDatamini;
                        }
                    });
                    treeData.push(childrenData);
                }
            }
        }
        return treeData;
    };

    handleSearch = () => {
        this.props.handleSearch(this.state.params)
    }

    //重置按钮
    handleReset = () => {
        this.setState({
            params: {
                xmid: undefined,
                xmlx: undefined,
                xmbq: undefined,
                wdlx: undefined,
                xmjl: undefined,
                glys: undefined,
                yssxlx: 'SCOPE',
                ysje1: undefined,
                ysje2: undefined,
            }
        })
    };

    handleXmid = v => {
        const { params = {} } = this.state;
        this.setState({
            params: {
                ...params,
                xmid: v
            }
        })
    }

    handleXmlx = v => {
        const { params = {} } = this.state;
        this.setState({
            params: {
                ...params,
                xmlx: v
            }
        })
    }

    handleXmbq = v => {
        const { params = {} } = this.state;
        this.setState({
            xmbqid: v,
            params: {
                ...params,
                xmbq: v.join(';')
            }
        })
    }

    handleXmjl = v => {
        const { params = {} } = this.state;
        this.setState({
            params: {
                ...params,
                xmjl: v
            }
        })
    }

    handleWdlx = (v, txt, node) => {
        const { params = {} } = this.state;
        this.setState({
            params: {
                ...params,
                wdlx: v
            }
        })
    }

    handleGlys = (v, txt, node) => {
        const { params = {} } = this.state;
        this.setState({
            glysid: v,
            params: {
                ...params,
                glys: node?.triggerNode?.props?.ID
            }
        })
    }

    //大于、区间
    handleAmtSltChange = v => {
        const { params = {} } = this.state;
        this.setState({
            params: {
                ...params,
                yssxlx: v,
                ysje1: undefined,
                ysje2: undefined
            }
        })
    };

    //项目预算，大于
    handleGtAmountChange = v => {
        const { params = {} } = this.state;
        this.setState({
            params: {
                ...params,
                ysje1: v
            }
        })
    };
    //项目预算，小于
    handleLtAmountChange = v => {
        const { params = {} } = this.state;
        this.setState({
            params: {
                ...params,
                ysje2: v
            }
        })
    };

    render() {
        const {
            labelList,
            xmlist,
            wdlxList,
            xmjlList,
            glysList,
            filterFold,
            xmbqid,
            glysid,
            params: {
                xmid,
                xmlx,
                wdlx,
                xmjl,
                yssxlx,
                ysje1,
                ysje2

            } } = this.state
        const { dictionary = {} } = this.props;
        const { XMLX: xmlxList = [] } = dictionary;

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
                        onChange={this.handleXmid}
                        value={xmid}
                    >
                        {xmlist.map((x, i) => (
                            <Select.Option key={i} value={x.XMID}>
                                {x.XMMC}
                            </Select.Option>
                        ))}
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
                        onChange={this.handleXmlx}
                        value={xmlx}
                    >
                        {xmlxList.map((x, i) => (
                            <Select.Option key={i} value={x.ibm}>
                                {x.note}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div className="console-item">
                    <div className="item-label">项目标签</div>
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
                        onChange={this.handleXmbq}
                        value={xmbqid}
                    >
                        {labelList.map((x, i) => (
                            <Select.Option key={i} value={x.ID}>
                                {x.BQMC}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <Button
                    className="btn-search"
                    type="primary"
                    onClick={this.handleSearch}
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
                    <TreeSelect
                        allowClear
                        className="item-selector"
                        showSearch
                        treeNodeFilterProp="title"
                        dropdownClassName="newproject-treeselect"
                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                        treeData={wdlxList}
                        placeholder="请选择"
                        onChange={this.handleWdlx}
                        value={wdlx}
                    />
                </div>
                <div className="console-item">
                    <div className="item-label">项目经理</div>
                    <Select
                        className="item-selector"
                        dropdownClassName={'item-selector-dropdown'}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        allowClear
                        onChange={this.handleXmjl}
                        value={xmjl}
                        placeholder="请选择"
                    >
                        {xmjlList.map((x, i) => (
                            <Select.Option key={i} value={x.ID}>
                                {x.USERNAME}
                            </Select.Option>
                        ))}
                    </Select>
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
                        treeData={glysList}
                        placeholder="请选择"
                        onChange={this.handleGlys}
                        value={glysid}
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
                                defaultValue="SCOPE"
                                className="item-selector"
                                dropdownClassName="item-selector-dropdown"
                                onChange={this.handleAmtSltChange}
                            >
                                <Select.Option value="SCOPE">区间</Select.Option>
                                <Select.Option value="BIGGER">大于</Select.Option>
                                <Select.Option value="SMALLER">小于</Select.Option>
                            </Select>
                            {yssxlx === 'SCOPE' && (
                                <div className="input-between">
                                    <Input
                                        className="input-min"
                                        value={ysje1}
                                        onChange={this.handleGtAmountChange}
                                        placeholder="下限"
                                    />
                                    <Input className="input-to" placeholder="~" disabled />
                                    <Input
                                        className="input-max"
                                        value={ysje2}
                                        onChange={this.handleLtAmountChange}
                                        placeholder="上限"
                                    />
                                </div>
                            )}
                            {yssxlx === 'BIGGER' && (
                                <Input
                                    className="item-input"
                                    value={ysje1}
                                    onChange={this.handleGtAmountChange}
                                    placeholder="请输入"
                                />
                            )}
                            {yssxlx === 'SMALLER' && (
                                <Input
                                    className="item-input"
                                    value={ysje1}
                                    onChange={this.handleGtAmountChange}
                                    placeholder="请输入"
                                />
                            )}
                        </div>
                    </div>
                    <div className="filter-unfold" onClick={() => this.setState({ filterFold: true })}>
                        收起
                        <i className="iconfont icon-up" />
                    </div>
                </div>
            )}
        </div>);
    }
}

export default ToConsole;