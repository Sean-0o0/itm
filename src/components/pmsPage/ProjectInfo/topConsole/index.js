import React, { useEffect, useState, forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, Icon, message, DatePicker, Spin } from 'antd';
import { QueryProjectListPara, QueryProjectListInfo } from '../../../../services/pmsServices';
import TreeUtils from '../../../../utils/treeUtils';
import moment from 'moment';
import { setParentSelectableFalse } from '../../../../utils/pmsPublicUtils';

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
  const [prjName, setPrjName] = useState(undefined);   //项目名称
  // const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [org, setOrg] = useState([]); //应用部门
  const [prjType, setPrjType] = useState(undefined); //项目类型
  const [gtAmount, setGtAmount] = useState(undefined); //项目金额，大于
  const [ltAmount, setLtAmount] = useState(undefined); //项目金额，小于
  const [minAmount, setMinAmount] = useState(undefined); //项目金额，最小
  const [maxAmount, setMaxAmount] = useState(undefined); //项目金额，最大
  const [labelOpen, setLabelOpen] = useState(false); //下拉框展开
  const [orgOpen, setOrgOpen] = useState(false); //下拉框展开

  // const [isYearOpen, setIsYearOpen] = useState(false) // 是否打开年面板
  const [undertakingDepartmentObj, setUndertakingDepartmentObj] = useState({ // 承接部门
    data: [],
    isOpen: false,
  })

  const { setTableLoading,
    setTableData,
    projectManager,
    setTotal,
    setCurPage,
    setCurPageSize,
    curPage,
    curPageSize,
    queryType,
    setQueryType,
    prjMnger,
    setPrjMnger,
    // year,
    // setYear,
    // defaultYearRef
    dateRange,
    setDateRange,
    defaultDateRangeRef
  } = props;


  useEffect(() => {
    getFilterData();
    return () => { };
  }, [projectManager]);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSearch,
        handleReset,
      };
    },
    //筛选栏的每个组件的值都得转发到父组件，否则切换分页的时候状态丢失
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
      // year,
      dateRange
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
                    let treeDatamini = {};
                    treeDatamini.key = i.ID + i.ysLXID;
                    treeDatamini.value = i.ID + i.ysLXID;
                    treeDatamini.title = i.YSXM;
                    treeDatamini.ID = i.ID;
                    treeDatamini.KGLYS = Number(i.KGLYS);
                    treeDatamini.YSLB = i.YSLB;
                    treeDatamini.YSXM = i.YSXM;
                    treeDatamini.ZYS = Number(i.ZYS);
                    treeDatamini.KZXYS = Number(i.KZXYS);
                    treeDatamini.ZDBM = i.ZDBM;
                    treeDatamini.ysLX = i.ysLX;
                    treeDatamini.ysLXID = i.ysLXID;
                    childrenDatamini.push(treeDatamini);
                  });
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
                  childrenDatamini.push(treeDatamini);
                }
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
      sort: 'string',
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
  const handleSearch = (current = 1, pageSize = 20, prjMnger = undefined, queryType = 'ALL', sort = 'XMNF DESC,XH DESC,ID DESC',) => {
    setTableLoading(true);
    setCurPage(current);
    setCurPageSize(pageSize);
    setQueryType('ALL');

    let params = {
      current,
      pageSize,
      paging: 1,
      sort,
      total: -1,
      queryType,
      // year: moment.isMoment(year) ? new Date(year.valueOf()).getFullYear() : '', //年
    };
    if (dateRange.length !== 0) {
      params.startTime = moment(dateRange[0]).format('YYYYMMDD');//日期区间
      params.endTime = moment(dateRange[1]).format('YYYYMMDD');
    }
    if (budget !== undefined && budget !== '') {
      params.budgetProject = Number(budget);
      params.budgetType = Number(budgetType);
    }
    // if (prjName !== undefined && prjName !== '') { //原本下拉框的代码
    //   params.projectId = Number(prjName);
    // }
    if (prjName !== undefined && prjName !== '') {  //输入框
      params.projectName = prjName
    }
    if (prjMnger !== undefined && prjMnger !== '') {
      params.projectManager = Number(prjMnger);
    }
    if (amountSelector === '1') {
      //区间 ,目前暂定只有均不为空时才查
      if (
        minAmount !== undefined &&
        minAmount !== '' &&
        maxAmount !== undefined &&
        maxAmount !== ''
      ) {
        params.amountType = 'SCOPE';
        params.amountBig = Number(maxAmount);
        params.amountSmall = Number(minAmount);
      }
    } else if (amountSelector === '2') {
      //大于
      if (gtAmount !== undefined && gtAmount !== '') {
        params.amountType = 'BIGGER';
        params.amountSmall = Number(gtAmount);
      }
    } else {
      //小于
      if (ltAmount !== undefined && ltAmount !== '') {
        params.amountType = 'SMALLER';
        params.amountBig = Number(ltAmount);
      }
    }
    // if (org !== undefined && org !== '') {
    //   params.orgId = Number(org);
    // }
    if (org.length !== 0) {
      params.orgId = org.map(x => x.value).join(';|;'); //应用部门
    }
    if (undertakingDepartmentObj.data.length !== 0) {
      params.undertakingDepartment = Number(undertakingDepartmentObj.data[0].value) //承接部门
    }
    if (label.length !== 0) {
      params.projectLabel = label.join(';|;');
    }
    if (prjType !== undefined && prjType !== '') {
      params.projectType = Number(prjType);
    }

    QueryProjectListInfo(params)
      .then(res => {
        if (res?.success) {
          setTableData(p => [...JSON.parse(res.record)]);
          setTableLoading(false);
          setTotal(res.totalrows);
        }
      })
      .catch(e => {
        message.error(`查询项目列表失败${e}`, 1);
        setTableLoading(false);
      });
  };

  //重置按钮
  const handleReset = v => {
    setBudget(undefined); //关联预算-生效的入参
    setBudgetValue(undefined); //关联预算-单纯为了重置
    setBudgetType('1'); //预算类型
    setLabel([]); //项目标签
    setPrjName(undefined); //项目名称
    setPrjMnger(undefined); //项目经理
    setOrg([]); //应用部门
    setPrjType(undefined); //项目类型
    setGtAmount(undefined); //项目金额，大于
    setMinAmount(undefined); //项目金额，最小
    setMaxAmount(undefined); //项目金额，最大
    setLtAmount(undefined); //项目金额，小于
    // setYear(defaultYearRef.current); //默认年
    setDateRange(defaultDateRangeRef.current); //默认日期区间
    setUndertakingDepartmentObj({ data: [], isOpen: false }) // 承接部门
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
  //项目名称 --原本的下拉框
  // const handlePrjNameChange = v => {
  //   // console.log('handlePrjMngerChange', v);
  //   // if (v === undefined) v = '';
  //   setPrjName(v);
  // };
  //项目类型
  const handlePrjTypeChange = v => {
    // console.log('handlePrjTypeChange', v);
    // if (v === undefined) v = '';
    setPrjType(v);
  };
  //项目标签
  const handleLabelChange = v => {
    // console.log('handleLabelChange', v);
    setLabel(p => [...v]);
  };
  //应用部门
  const handleOrgChange = v => {
    // console.log('handleOrgChange', v);
    setOrg(v);
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
  /** 承接部门————值变化 */
  const undertakingDepartmentObjChangeHandle = (newArr) => {
    if (newArr.length === 0) {
      setUndertakingDepartmentObj({ ...undertakingDepartmentObj, data: [] })
    }
    if (newArr.length === 1) {
      setUndertakingDepartmentObj({ ...undertakingDepartmentObj, data: newArr })
    }
    if (newArr.length === 2) {
      const formatArr = [newArr[1]]
      setUndertakingDepartmentObj({ ...undertakingDepartmentObj, data: formatArr })
    }
  }
  // onChange-end


  return (
    <div className="top-console">
      {/* 第一行 */}
      <div className="item-box">

        <div className="console-item">
          <div className="item-label">项目日期</div>
          <DatePicker.RangePicker
            className="item-selector"
            placeholder={['开始日期', '结束日期']}
            allowClear
            value={dateRange}
            onChange={(dates, dateStrings) => {
              setDateRange(dates)
            }}
          >
          </DatePicker.RangePicker>

          {/* <DatePicker
            mode="year"
            className="item-selector"
            value={year}
            open={isYearOpen}
            placeholder="请选择年份"
            format="YYYY"
            allowClear
            onChange={(date, dateString) => {
              setYear(date)
            }}
            onPanelChange={(value, mode) => {
              setYear(value)
              setIsYearOpen(false)
            }}
            onOpenChange={(futureStatus) => {
              setIsYearOpen(futureStatus)
            }}
          /> */}
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
          <div className="item-label">项目名称</div>
          <Input
            className="item-selector"
            allowClear
            placeholder="请输入"
            value={prjName}
            onChange={(e) => {
              const { target: { value: val } } = e
              setPrjName(val)
            }}
          >
          </Input>

          {/* <Select
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
          </Select> */}
        </div>

        <Button
          className="btn-search"
          type="primary"
          onClick={() => handleSearch(1, curPageSize, prjMnger, 'ALL')}
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>

      {/* 第二行 */}
      <div className="item-box">
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

        <div className="console-item">
          <div className="item-label">项目标签</div>
          <TreeSelect
            allowClear
            showArrow
            className="item-selector"
            showSearch
            treeCheckable
            maxTagCount={2}
            maxTagTextLength={42}
            maxTagPlaceholder={extraArr => {
              return `等${extraArr.length + 2}个`;
            }}
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            treeData={labelData}
            placeholder="请选择"
            onChange={handleLabelChange}
            value={label}
            treeDefaultExpandedKeys={['1']}
            open={labelOpen}
            onDropdownVisibleChange={v => setLabelOpen(v)}
          />
          <Icon
            type="down"
            className={'label-selector-arrow' + (labelOpen ? ' selector-rotate' : '')}
            onClick={() => {
              console.log('@@@', labelOpen);
              setLabelOpen(p => !p);
            }}
          />
        </div>

        <div className="console-item">
          <div className="item-label">承接部门</div>
          <TreeSelect
            allowClear
            showArrow
            multiple={true}
            className="item-selector"
            showSearch
            treeDefaultExpandedKeys={['1', '8857']}
            showCheckedStrategy={TreeSelect.SHOW_ALL}
            treeCheckStrictly
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
            placeholder="请选择"
            treeCheckable
            treeData={orgData}
            value={undertakingDepartmentObj.data}
            onChange={(value, label, extra) => {
              undertakingDepartmentObjChangeHandle(value)
            }}
            open={undertakingDepartmentObj.isOpen}
            onDropdownVisibleChange={(open) => {
              setUndertakingDepartmentObj({ ...undertakingDepartmentObj, isOpen: open })
            }}
          />

        </div>

        {filterFold && (
          <div className="filter-unfold" onClick={() => setFilterFold(false)}>
            更多
            <i className="iconfont icon-down" />
          </div>
        )}
      </div>


      {/* 第三行 */}
      {!filterFold && (
        <div className="item-box">

          <div className="console-item">
            <div className="item-label">应用部门</div>
            <TreeSelect
              allowClear
              showArrow
              className="item-selector"
              showSearch
              treeCheckable
              maxTagCount={2}
              maxTagTextLength={42}
              maxTagPlaceholder={extraArr => {
                return `等${extraArr.length + 2}个`;
              }}
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              treeCheckStrictly
              treeNodeFilterProp="title"
              dropdownClassName="newproject-treeselect"
              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              treeData={orgData}
              placeholder="请选择"
              onChange={handleOrgChange}
              value={org}
              treeDefaultExpandedKeys={['1', '8857']}
              open={orgOpen}
              onDropdownVisibleChange={v => setOrgOpen(v)}
            />
            <Icon
              type="down"
              className={'label-selector-arrow' + (orgOpen ? ' selector-rotate' : '')}
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
              treeData={budgetData}
              placeholder="请选择"
              onChange={handleBudgetChange}
              value={budgetValue}
            />
          </div>

          <div className="console-last-item">
            <div className="item-txt">项目金额</div>
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
                    type="number"
                  />
                  <Input className="input-to" placeholder="-" disabled />
                  <Input
                    className="input-max"
                    value={maxAmount}
                    onChange={handleMaxAmountChange}
                    placeholder="上限"
                    type="number"
                  />
                </div>
              )}
              {amountSelector === '2' && (
                <Input
                  className="item-input"
                  value={gtAmount}
                  onChange={handleGtAmountChange}
                  placeholder="请输入"
                  type="number"
                />
              )}
              {amountSelector === '3' && (
                <Input
                  className="item-input"
                  value={ltAmount}
                  onChange={handleLtAmountChange}
                  placeholder="请输入"
                  type="number"
                />
              )}
            </div>
          </div>


          <div className="filter-unfold" onClick={() => setFilterFold(true)}>
            收起
            <i className="iconfont icon-up" />
          </div>

        </div>
      )}
    </div>
  );
});
