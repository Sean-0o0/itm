import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, Icon, message } from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QueryProjectStatisticsList,
} from '../../../../services/pmsServices';
import TreeUtils from '../../../../utils/treeUtils';
import { set } from 'store';
import { setParentSelectableFalse } from '../../../../utils/pmsPublicUtils';

const InputGroup = Input.Group;
const { Option } = Select;

export default forwardRef(function TopConsole(props, ref) {
  const [amountSelector, setAmountSelector] = useState('1'); //项目金额下拉框，区间 '1'，大于 '2'
  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false
  //下拉框数据
  const [budgetData, setBudgetData] = useState([]); //关联预算
  const [labelData, setLabelData] = useState([]); //项目标签
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [prjMngerData, setPrjMngerData] = useState([]); //项目经理
  const [orgData, setOrgData] = useState([]); //应用部门
  const { XMLX } = props.dictionary; //
  const [prjTypeData, setPrjTypeData] = useState([]); //项目类型
  //查询的值
  const [budget, setBudget] = useState(undefined); //关联预算
  const [budgetValue, setBudgetValue] = useState(undefined); //关联预算-为了重置
  const [budgetType, setBudgetType] = useState('1'); //关联预算类型id
  const [label, setLabel] = useState([]); //项目标签
  // const [prjName, setPrjName] = useState(undefined); //项目名称
  // const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [org, setOrg] = useState([]); //应用部门
  // const [prjType, setPrjType] = useState(undefined); //项目类型
  const [gtAmount, setGtAmount] = useState(undefined); //项目金额，大于
  const [ltAmount, setLtAmount] = useState(undefined); //项目金额，小于
  const [minAmount, setMinAmount] = useState(undefined); //项目金额，最小
  const [maxAmount, setMaxAmount] = useState(undefined); //项目金额，最大
  const [labelOpen, setLabelOpen] = useState(false); //下拉框展开
  const [orgOpen, setOrgOpen] = useState(false); //下拉框展开

  const {
    setTableLoading,
    setTableData,
    setTotal,
    setCurPage,
    setCurPageSize,
    curPage,
    curPageSize,
    queryType,
    setQueryType,
    prjMnger,
    setPrjMnger,
    prjName,
    setPrjName,
    prjType,
    setPrjType,
    tabsKey,
    orgID,
  } = props;

  useEffect(() => {
    getFilterData();
    return () => {};
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSearch,
      };
    },
    [
      budget,
      budgetValue,
      budgetType,
      label,
      prjName,
      prjMnger,
      org,
      prjType,
      gtAmount,
      ltAmount,
      minAmount,
      maxAmount,
    ],
  );

  //转为树结构-关联项目
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

  //顶部下拉框查询数据
  const getFilterData = () => {
    QueryProjectListPara({
      current: 1,
      czr: 0,
      pageSize: 10,
      paging: 1,
      sort: '',
      total: -1,
      cxlx: 'XMLB',
    })
      .then(res => {
        if (res?.success) {
          setBudgetData(p => [...toItemTree(JSON.parse(res.budgetProjectRecord))]);
          let labelTree = TreeUtils.toTreeData(JSON.parse(res.labelRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'BQMC',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0];
          setLabelData(p => [...[labelTree]]);
          let orgTree = TreeUtils.toTreeData(JSON.parse(res.orgRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0];
          setOrgData(p => [...[orgTree]]);
          setPrjMngerData(p => [...JSON.parse(res.projectManagerRecord)]);
          // if (projectManager) {
          //   setPrjMnger(String(projectManager));
          // }
          setPrjNameData(p => [...JSON.parse(res.projectRecord)]);
          let xmlx = TreeUtils.toTreeData(JSON.parse(res.projectTypeRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0];
          xmlx.selectable = false;
          xmlx.children?.forEach(node => setParentSelectableFalse(node));
          setPrjTypeData(p => [...[xmlx]]);
        }
      })
      .catch(e => {
        console.error('QueryProjectListPara', e);
        message.error('下拉框信息查询失败', 1);
      });
  };

  //查询按钮
  const handleSearch = (current = 1, pageSize = 20, queryType = 'BM', sort = '', tabsKey = '0') => {
    setTableLoading(true);
    setCurPage(current);
    setCurPageSize(pageSize);
    setQueryType('BM');
    let params = {
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
      queryType,
      orgID,
    };
    if (prjName !== undefined && prjName !== '') {
      params.projectID = Number(prjName);
    }
    if (prjMnger !== undefined && prjMnger !== '') {
      params.manager = Number(prjMnger);
    }
    if (prjType !== undefined && prjType !== '') {
      params.projectType = Number(prjType);
    }
    if (tabsKey !== '0') {
      params.tab = tabsKey;
    }
    QueryProjectStatisticsList(params)
      .then(res => {
        if (res?.success) {
          setTableData(p => [...JSON.parse(res.result)]);
          setTableLoading(false);
          setTotal(res.totalrows);
        }
      })
      .catch(e => {
        console.error('handleSearch', e);
        message.error('查询失败', 1);
        setTableLoading(false);
      });
  };

  //重置按钮
  const handleReset = v => {
    // setBudget(undefined); //关联预算-生效的入参
    // setBudgetValue(undefined); //关联预算-单纯为了重置
    // setBudgetType('1'); //预算类型
    // setLabel([]); //项目标签
    setPrjName(undefined); //项目名称
    setPrjMnger(undefined); //项目经理
    // setOrg([]); //应用部门
    setPrjType(undefined); //项目类型
    // setGtAmount(undefined); //项目金额，大于
    // setMinAmount(undefined); //项目金额，最小
    // setMaxAmount(undefined); //项目金额，最大
    // setLtAmount(undefined); //项目金额，小于
  };

  // onChange-start
  //大于、区间
  // const handleAmtSltChange = v => {
  //   setAmountSelector(v);
  //   setGtAmount(undefined); //项目金额，大于
  //   setMinAmount(undefined); //项目金额，最小
  //   setMaxAmount(undefined); //项目金额，最大
  //   setLtAmount(undefined); //项目金额，小于
  // };
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
  //项目类型
  const handlePrjTypeChange = v => {
    // console.log('handlePrjTypeChange', v);
    // if (v === undefined) v = '';
    setPrjType(v);
  };
  // onChange-end

  return (
    <div className="top-console">
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
            onChange={handlePrjNameChange}
            value={prjName}
            placeholder="请选择"
          >
            {prjNameData.map((x, i) => (
              <Option key={i} value={x.XMID}>
                {x.XMMC}
              </Option>
            ))}
          </Select>
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
            onChange={handlePrjMngerChange}
            value={prjMnger}
            placeholder="请选择"
          >
            {prjMngerData.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.USERNAME}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">项目类型</div>
          <TreeSelect
            allowClear
            showArrow
            className="item-selector"
            showSearch
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            treeData={prjTypeData}
            placeholder="请选择"
            onChange={handlePrjTypeChange}
            value={prjType}
            treeDefaultExpandAll
          />
        </div>
        <Button
          className="btn-search"
          type="primary"
          onClick={() => handleSearch(curPage, curPageSize, 'BM')}
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
});
