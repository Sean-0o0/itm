import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, Icon, message } from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QueryOutsourceRequirementList,
} from '../../../../services/pmsServices';
import TreeUtils from '../../../../utils/treeUtils';
import { set } from 'store';
const InputGroup = Input.Group;
const { Option } = Select;

export default forwardRef(function TopConsole(props, ref) {
  //下拉框数据
  const [budgetData, setBudgetData] = useState([]); //关联预算
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [prjMngerData, setPrjMngerData] = useState([]); //项目经理
  const [dmNameData, setDmNameData] = useState([]); //需求名称
  const [dmInitiatorData, setDmInitiatorData] = useState([]); //需求发起人
  //查询的值
  const [budget, setBudget] = useState(undefined); //关联预算
  const [budgetValue, setBudgetValue] = useState(undefined); //关联预算-为了重置
  const [budgetType, setBudgetType] = useState('1'); //关联预算类型id
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [dmName, setDmName] = useState(undefined); //需求名称
  const [dmInitiator, setDmInitiator] = useState(undefined); //需求发起人
  const { setTableLoading, setTableData, setTotal, setCurPage, setCurPageSize } = props;

  useEffect(() => {
    getFilterData();
    return () => {};
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSearch,
        handleReset,
      };
    },
    [budget, budgetValue, budgetType, prjName, prjMnger, dmInitiator, dmName],
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
  const getFilterData = () => {};

  //查询按钮
  const handleSearch = (current = 1, pageSize = 20, sort = 'XMID DESC') => {
    setTableLoading(true);
    setCurPage(current);
    setCurPageSize(pageSize);

    let params = {
      current,
      cxlx: 'XM',
      pageSize,
      paging: 1,
      sort,
      total: -1,
    };
    if (budget !== undefined && budget !== '') {
      params.ysxm = Number(budget);
      params.yslx = Number(budgetType);
    }
    if (prjName !== undefined && prjName !== '') {
      params.xmmc = Number(prjName);
    }
    if (prjMnger !== undefined && prjMnger !== '') {
      params.xmjl = Number(prjMnger);
    }
    if (dmInitiator !== undefined && dmInitiator !== '') {
      params.xqfqr = Number(dmInitiator);
    }
    if (dmName !== undefined && dmName !== '') {
      params.xqmc = Number(dmName);
    }
    QueryOutsourceRequirementList(params)
      .then(res => {
        if (res?.success) {
          const data = JSON.parse(res.xmxx);
          console.log('🚀 ~ file: index.js:50 ~ getTableData ~ res:', data);
          setTableData(p => data);
          setTotal(res.totalrows);
          setTableLoading(false);
        }
      })
      .catch(e => {
        message.error('表格数据查询失败', 1);
        console.error('getTableData', e);
        setTableLoading(false);
      });
  };

  //重置按钮
  const handleReset = v => {
    setBudget(undefined); //关联预算-生效的入参
    setBudgetValue(undefined); //关联预算-单纯为了重置
    setBudgetType('1'); //预算类型
    setPrjName(undefined); //项目名称
    setPrjMnger(undefined); //项目经理
    setDmInitiator(undefined);
    setDmName(undefined);
  };

  // onChange-start
  //项目经理
  const handlePrjMngerChange = v => {
    // console.log('handlePrjMngerChange', v);
    setPrjMnger(v);
  };
  //项目名称
  const handlePrjNameChange = v => {
    // console.log('handlePrjMngerChange', v);
    setPrjName(v);
  };
  //需求名称
  const handleDmNameChange = v => {
    // console.log(' handleDmNameChange', v);
    setDmName(v);
  };
  //需求发起人
  const handleDmInitiatorChange = v => {
    // console.log('handleDmInitiatorChange', v);
    setDmInitiator(v);
  };
  //关联预算
  const handleBudgetChange = (v, txt, node) => {
    // console.log('handleBudgetChange', v, node?.triggerNode?.props);
    setBudget(node?.triggerNode?.props?.ID);
    setBudgetValue(v);
    if (node?.triggerNode?.props?.ZDBM === '6') {
      setBudgetType('4');
    } else {
      setBudgetType(node?.triggerNode?.props?.YSLXID);
    }
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
          <div className="item-label">需求名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleDmNameChange}
            value={dmName}
            placeholder="请选择"
          >
            {/* {dmNameData.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.USERNAME}
              </Option>
            ))} */}
          </Select>
        </div>
        <Button className="btn-search" type="primary" onClick={() => handleSearch()}>
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">关联预算</div>
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
        <div className="console-item">
          <div className="item-label">需求发起人</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleDmInitiatorChange}
            value={dmInitiator}
            placeholder="请选择"
          >
            {/* {dmInitiatorData.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.USERNAME}
              </Option>
            ))} */}
          </Select>
        </div>
      </div>
    </div>
  );
});
