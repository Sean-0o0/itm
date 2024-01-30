import React, { Component } from 'react';
import { QueryProjectListPara } from '../../../../services/pmsServices';
import { Select, Button, TreeSelect, Input, message, Icon } from 'antd';
import TreeUtils from '../../../../utils/treeUtils';

class ToConsole extends Component {
  state = {
    time: 0,
    labelList: [],
    xmlist: [],
    wdlxList: [],
    xmjlList: [],
    glysList: [],
    filterFold: true,
    glysid: [],
    prjTypeList: [],
    xmlxOpen: false,
    xmbqOpen: false,
    wdlxOpen: false,
    glysOpen: false,
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
      yslx: undefined,
    },
    yslxArr: [],
  };

  componentDidMount() {
    const { cxlx } = this.props;
    if (cxlx) {
      this.getFilterData(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    const { xmid: newid, cxlx } = nextprops;
    const { cxlx: newCxlx } = this.props;
    const {
      params: { xmid },
    } = this.state;
    // console.log("🚀 ~ file: index.js:48 ~ ToConsole ~ UNSAFE_componentWillReceiveProps ~ xmid:", xmid, newid)
    if (newid !== undefined) {
      this.setState({
        params: {
          ...this.state.params,
          xmid: newid,
        },
      });
    }
    if (newCxlx !== cxlx) {
      this.getFilterData(nextprops);
    }
  }

  //顶部下拉框查询数据
  getFilterData = props => {
    const { cxlx } = props;
    this.props.setSpin(true);
    QueryProjectListPara({
      paging: -1,
      cxlx: cxlx === 'FQCY' ? 'WDLBPT' : 'WDLBLD',
    })
      .then(res => {
        const { code = 0 } = res;
        if (code > 0) {
          const wdlx = JSON.parse(res.fileTypeRecord);
          const label = JSON.parse(res.labelRecord);
          const wdlxList = TreeUtils.toTreeData(
            wdlx,
            {
              keyName: 'ID',
              pKeyName: 'FID',
              titleName: 'NAME',
              normalizeTitleName: 'title',
              normalizeKeyName: 'value',
            },
            true,
          );
          const labelList = TreeUtils.toTreeData(
            label,
            {
              keyName: 'ID',
              pKeyName: 'FID',
              titleName: 'BQMC',
              normalizeTitleName: 'title',
              normalizeKeyName: 'value',
            },
            true,
          );
          const prjTypeList = TreeUtils.toTreeData(JSON.parse(res.projectTypeRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          });
          this.setState({
            glysList: [...this.toItemTree(JSON.parse(res.budgetProjectRecord))],
            xmlist: [...JSON.parse(res.projectRecord)],
            xmjlList: [...JSON.parse(res.projectManagerRecord)],
            labelList: labelList.length ? labelList[0]?.children : [],
            wdlxList: wdlxList.length ? wdlxList[0]?.children : [],
            prjTypeList: prjTypeList.length ? prjTypeList[0]?.children : [],
          });
          this.props.setSpin(false);
        }
      })
      .catch(error => {
        this.props.setSpin(false);
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
              key: current.ID + current.YSLXID,
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
                    treeDatamini.key = i.ID + i.ZDBM;
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
                  treeDatamini.key = item.ZDBM + item.YSLXID;
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
    this.setState(
      {
        params: {
          ...this.state.params,
          yslx:
            this.state.params?.glys !== undefined && this.state.yslxArr.length !== 0
              ? this.state.yslxArr[0]
              : undefined,
        },
      },
      () => {
        this.props.handleSearch(this.state.params);
      },
    );
  };

  //重置按钮
  handleReset = () => {
    this.setState({
      glysid: [],
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
        yslx: undefined,
      },
      yslxArr: [],
    });
  };

  handleXmid = v => {
    const { params = {} } = this.state;
    this.setState({
      time: 1,
      params: {
        ...params,
        xmid: v.join(';'),
      },
    });
  };

  handleXmlx = v => {
    const { params = {} } = this.state;
    this.setState({
      params: {
        ...params,
        xmlx: v.join(';'),
      },
    });
  };

  handleXmbq = v => {
    const { params = {} } = this.state;
    this.setState({
      params: {
        ...params,
        xmbq: v.join(';'),
      },
    });
  };

  handleXmjl = v => {
    const { params = {} } = this.state;
    this.setState({
      params: {
        ...params,
        xmjl: v.join(';'),
      },
    });
  };

  handleWdlx = (v, txt, node) => {
    const { params = {} } = this.state;
    this.setState({
      params: {
        ...params,
        wdlx: v.join(';'),
      },
    });
  };

  handleGlys = (v, txt, node) => {
    const { params = {} } = this.state;
    const { glys = '' } = params;
    let arr = [...this.state.yslxArr];
    arr.push(node?.triggerNode?.props?.YSLX || '资本性预算项目');
    this.setState({
      glysid: v,
      params: {
        ...params,
        glys: v.length
          ? glys
            ? glys + ',' + node?.triggerNode?.props?.ID
            : node?.triggerNode?.props?.ID
          : undefined,
      },
      yslxArr: v.length !== 0 ? [...arr] : [],
    });
  };

  //大于、区间
  handleAmtSltChange = v => {
    const { params = {} } = this.state;
    this.setState({
      params: {
        ...params,
        yssxlx: v,
        ysje1: undefined,
        ysje2: undefined,
      },
    });
  };

  //项目预算，大于
  handleGtAmountChange = v => {
    const { params = {} } = this.state;
    this.setState({
      params: {
        ...params,
        ysje1: v.target.value,
      },
    });
  };
  //项目预算，小于
  handleLtAmountChange = v => {
    const { params = {} } = this.state;
    this.setState({
      params: {
        ...params,
        ysje2: v.target.value,
      },
    });
  };

  render() {
    const {
      labelList,
      xmlist,
      wdlxList,
      xmjlList,
      glysList,
      filterFold,
      glysid,
      prjTypeList,
      xmlxOpen = false,
      xmbqOpen = false,
      wdlxOpen = false,
      glysOpen = false,
      params: { xmid, xmbq, xmlx, wdlx, xmjl, yssxlx, ysje1, ysje2 },
    } = this.state;
    const { dictionary = {} } = this.props;
    const { XMLX: xmlxList = [] } = dictionary;

    return (
      <div className="top-console">
        <div className="item-box">
          <div className="console-item">
            <div className="item-label">项目名称</div>
            <Select
              className="item-selector"
              showArrow
              dropdownClassName={'item-selector-dropdown'}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              placeholder="请选择"
              maxTagCount={1}
              maxTagTextLength={8}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 1}个`;
              }}
              mode="multiple"
              onChange={this.handleXmid}
              value={xmid ? String(xmid).split(';') : []}
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
            <TreeSelect
              allowClear
              className="item-selector"
              showArrow
              showSearch
              treeNodeFilterProp="title"
              treeCheckable
              maxTagCount={1}
              maxTagTextLength={8}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 1}个`;
              }}
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeData={prjTypeList}
              placeholder="请选择"
              onChange={this.handleXmlx}
              value={xmlx ? xmlx.split(';') : []}
              treeDefaultExpandAll
              open={xmlxOpen}
              onDropdownVisibleChange={v =>
                this.setState({
                  xmlxOpen: v,
                })
              }
            />
            <Icon
              type="down"
              className={'label-selector-arrow' + (xmlxOpen ? ' selector-rotate' : '')}
            />
          </div>
          <div className="console-item">
            <div className="item-label">项目标签</div>
            <TreeSelect
              allowClear
              className="item-selector"
              showSearch
              showArrow
              treeNodeFilterProp="title"
              treeCheckable
              maxTagCount={1}
              maxTagTextLength={8}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 1}个`;
              }}
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeDefaultExpandedKeys={['1']}
              treeData={labelList}
              placeholder="请选择"
              onChange={this.handleXmbq}
              value={xmbq ? xmbq.split(';') : []}
              open={xmbqOpen}
              onDropdownVisibleChange={v =>
                this.setState({
                  xmbqOpen: v,
                })
              }
            />
            <Icon
              type="down"
              className={'label-selector-arrow' + (xmbqOpen ? ' selector-rotate' : '')}
            />
          </div>
          <Button className="btn-search" type="primary" onClick={this.handleSearch}>
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
              showArrow
              treeNodeFilterProp="title"
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeData={wdlxList}
              treeCheckable
              maxTagCount={1}
              maxTagTextLength={8}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 1}个`;
              }}
              placeholder="请选择"
              onChange={this.handleWdlx}
              value={wdlx ? wdlx.split(';') : []}
              open={wdlxOpen}
              onDropdownVisibleChange={v =>
                this.setState({
                  wdlxOpen: v,
                })
              }
            />
            <Icon
              type="down"
              className={'label-selector-arrow' + (wdlxOpen ? ' selector-rotate' : '')}
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
              showArrow
              showSearch
              allowClear
              placeholder="请选择"
              maxTagCount={1}
              maxTagTextLength={8}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 1}个`;
              }}
              mode="multiple"
              onChange={this.handleXmjl}
              value={xmjl ? xmjl.split(';') : []}
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
              showArrow
              treeNodeFilterProp="title"
              dropdownClassName="newproject-treeselect"
              maxTagCount={1}
              maxTagTextLength={8}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 1}个`;
              }}
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeData={glysList}
              placeholder="请选择"
              multiple={true}
              onChange={this.handleGlys}
              value={glysid}
              open={glysOpen}
              onDropdownVisibleChange={v =>
                this.setState({
                  glysOpen: v,
                })
              }
            />
            <Icon
              type="down"
              className={'label-selector-arrow' + (glysOpen ? ' selector-rotate' : '')}
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
                  value={yssxlx}
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
                    <Input className="input-to" placeholder="-" disabled />
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
      </div>
    );
  }
}

export default ToConsole;
