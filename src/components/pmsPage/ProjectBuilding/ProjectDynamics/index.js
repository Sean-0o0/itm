import React, { Fragment, useEffect, useState, useCallback } from 'react';
import {
  Empty,
  Spin,
  Input,
  Tooltip,
  Popover,
  Tree,
  TreeSelect,
  Radio,
  DatePicker,
  Button,
  Select,
} from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import iconLabel from '../../../../assets/homePage/icon_label.png';
import iconOrg from '../../../../assets/homePage/icon_org.png';
import iconFilter from '../../../../assets/homePage/icon_filter.png';
import ProjectQueryTable from '../ProjectQueryTable';
import { connect } from 'dva';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(function ProjectDynamics(props) {
  const {
    dataList = [],
    routes = [],
    defaultYear = moment().year(),
    roleData = {},
    dictionary = {},
    sltorData = { label: [], org: [] },
    getPrjDynamicData,
  } = props;
  const XMZT = [
    { ibm: '1', note: '正常' },
    { ibm: '2', note: '逾期' },
    { ibm: '3', note: '完结' },
    { ibm: '4', note: '终止' },
  ];
  const [orgData, setOrgData] = useState({
    sltedItems: [],
    open: false,
  }); //部门
  const [labelData, setLabelData] = useState({
    sltedItems: [],
    open: false,
  }); //标签
  const [moreData, setMoreData] = useState({
    open: false,
    //初始值、点筛选后 与外边一致
    tag: [],
    org: [],
    projectName: undefined,
    //另外维护
    projectManager: undefined,
    projectStatus: undefined,
    startYear: moment(String(defaultYear)),
    endYear: moment(String(defaultYear)),
    startYearOpen: false,
    endYearOpen: false,
  }); //更多筛选
  const [moreData_Filtered, setMoreData_Filtered] = useState({
    projectManager: undefined,
    projectStatus: undefined,
    startYear: moment(String(defaultYear)),
    endYear: moment(String(defaultYear)),
  }); //用于控制数据
  const [projectName, setPrjName] = useState(undefined); //项目名称
  let filterParams = {
    role: roleData.role,
    ...moreData,
    tag: labelData.sltedItems,
    org: orgData.sltedItems,
    projectName,
  }; //筛选查询接口入参
  const [curTab, setCurTab] = useState('1'); //当前tab，看板、列表
  const [curStage, setCurStage] = useState(undefined); //当前tab项目阶段
  const location = useLocation();

  useEffect(() => {
    setMoreData(p => ({
      ...p,
      startYear: moment(String(defaultYear)),
      endYear: moment(String(defaultYear)),
    }));
    return () => {};
  }, [defaultYear]);

  //部门
  const getOrgBox = (curTab = '1') => {
    //选中
    const handleSlt = (keyArr = [], e) => {
      // console.log("🚀 ~ handleSlt ~ keyArr:", keyArr, e)
      // let sltedItem = { name: e.node?.props?.title, id: e.node?.props?.eventKey };
      const data = e.checkedNodes?.map(x => ({ id: x.key, name: x.props?.title })) || [];
      setOrgData(p => ({
        ...p,
        sltedItems: data,
      }));
      getPrjDynamicData({
        ...filterParams,
        org: data,
      });
    };
    //树型节点
    const renderTreeNodes = useCallback(
      (data = []) =>
        data.map(item => {
          if (item.children?.length > 0) {
            return (
              <Tree.TreeNode title={item.title} key={item.value}>
                {renderTreeNodes(item.children)}
              </Tree.TreeNode>
            );
          }
          return <Tree.TreeNode key={item.value} {...item} />;
        }),
      [],
    );
    //是否已选中
    const isSlted = orgData.sltedItems.length > 0;
    //清空
    const handleClear = e => {
      e?.stopPropagation();
      setOrgData({ sltedItems: [], open: false });
      getPrjDynamicData({
        ...filterParams,
        org: [],
      });
    };
    //已选择文本
    const sltedTitle = orgData.sltedItems.map(x => x.name).join('、');
    if (curTab === '2') return '';
    return (
      <Popover
        title={null}
        placement="bottom"
        trigger="click"
        visible={orgData.open}
        onVisibleChange={v => setOrgData(p => ({ ...p, open: v }))}
        autoAdjustOverflow
        content={
          <Tree
            // selectedKeys={orgData.sltedItems.map(x => x.id)}
            // onSelect={handleSlt}
            // defaultExpandedKeys={['11167', '357', '11168', '15681']}
            defaultExpandAll
            className="slt-list"
            multiple
            selectable={false}
            checkable
            checkedKeys={orgData.sltedItems.map(x => x.id)}
            checkStrictly
            onCheck={handleSlt}
          >
            {renderTreeNodes(sltorData.org)}
          </Tree>
        }
        overlayClassName="prj-dynamic-filter-popover"
      >
        <div className="filter-item" key="部门">
          <div className="divide-line"></div>
          <img className="filter-icon" src={iconOrg} alt="部门" />
          <span>
            {isSlted ? (
              <Tooltip title={sltedTitle} placement="topLeft">
                {sltedTitle}
              </Tooltip>
            ) : (
              '部门'
            )}
          </span>
          {isSlted && <i className="iconfont icon-close" onClick={handleClear} />}
          <i className="iconfont icon-fill-down" />
          <div className="divide-line"></div>
        </div>
      </Popover>
    );
  };

  //标签
  const getLabelBox = (curTab = '1') => {
    //选中
    const handleSlt = (keyArr = [], e = {}) => {
      const data = e.checkedNodes?.map(x => ({ id: x.key, name: x.props?.title })) || [];
      setLabelData(p => ({ ...p, sltedItems: data }));
      getPrjDynamicData({
        ...filterParams,
        tag: data,
      });
    };
    //树型节点
    const renderTreeNodes = useCallback(
      (data = []) =>
        data.map(item => {
          if (item.children?.length > 0) {
            return (
              <Tree.TreeNode title={item.title} key={item.value} selectable={false}>
                {renderTreeNodes(item.children)}
              </Tree.TreeNode>
            );
          }
          return <Tree.TreeNode key={item.value} {...item} />;
        }),
      [],
    );
    //是否已选中
    const isSlted = labelData.sltedItems.length > 0;
    //清空
    const handleClear = e => {
      e?.stopPropagation();
      setLabelData({ sltedItems: [], open: false });
      getPrjDynamicData({
        ...filterParams,
        tag: [],
      });
    };
    //标签数据有子节点的文本
    const hasChildrenArr = sltorData.label?.filter(x => x.children?.length > 0).map(x => x.title);
    //已选中的文本
    const sltedTitle = labelData.sltedItems
      .map(x => x.name)
      .filter(x => !hasChildrenArr.includes(x))
      .join('、');
    if (curTab === '2') return '';
    return (
      <Popover
        title={null}
        placement="bottom"
        trigger="click"
        visible={labelData.open}
        onVisibleChange={v => setLabelData(p => ({ ...p, open: v }))}
        autoAdjustOverflow
        content={
          <Tree
            selectable={false}
            className="slt-list"
            defaultExpandAll
            multiple
            checkable
            showCheckedStrategy="SHOW_CHILD"
            checkedKeys={labelData.sltedItems.map(x => x.id)}
            onCheck={handleSlt}
          >
            {renderTreeNodes(sltorData.label)}
          </Tree>
        }
        overlayClassName="prj-dynamic-filter-popover"
      >
        <div className="filter-item" key="标签">
          <img className="filter-icon" src={iconLabel} alt="标签" />
          <span>
            {isSlted ? (
              <Tooltip title={sltedTitle} placement="topLeft">
                {sltedTitle}
              </Tooltip>
            ) : (
              '标签'
            )}
          </span>
          {isSlted && <i className="iconfont icon-close" onClick={handleClear} />}
          <i className="iconfont icon-fill-down" />
          <div className="divide-line"></div>
        </div>
      </Popover>
    );
  };

  //更多筛选
  const getMoreBox = () => {
    return (
      <Popover
        title={null}
        placement="bottom"
        trigger="click"
        visible={moreData.open}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        onVisibleChange={v =>
          setMoreData(p => ({ ...p, open: v, startYearOpen: false, endYearOpen: false }))
        }
        autoAdjustOverflow
        content={
          <div className="slt-form-box">
            <div className="slt-form-item" key="部门名称">
              <div className="item-label">部门名称：</div>
              <TreeSelect
                allowClear
                showArrow
                className="item-component"
                showSearch
                treeNodeFilterProp="title"
                multiple
                treeCheckStrictly
                treeCheckable
                showCheckedStrategy="SHOW_ALL"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={sltorData.org}
                placeholder="请选择"
                onChange={(v = []) => {
                  let arr = v.map(x => ({ id: x.value, name: x.label }));
                  setMoreData(p => ({ ...p, org: arr }));
                }}
                value={moreData.org.map(x => ({
                  value: x.id,
                }))}
                treeDefaultExpandAll
              />
            </div>
            <div className="slt-form-item" key="项目名称">
              <div className="item-label">项目名称：</div>
              <Input
                placeholder="请输入"
                value={moreData.projectName}
                className="item-component"
                onChange={e => {
                  e.persist();
                  setMoreData(p => ({ ...p, projectName: e?.target?.value }));
                  console.log(e?.target?.value);
                }}
              />
            </div>
            <div className="slt-form-item" key="人员名称">
              <div className="item-label">人员名称：</div>
              <Input
                placeholder="请输入"
                value={moreData.projectManager}
                className="item-component"
                onChange={e => {
                  e.persist();
                  console.log('🚀 ~ getMoreBox ~ e:', e);
                  setMoreData(p => ({ ...p, projectManager: e?.target?.value }));
                  console.log(e?.target?.value);
                }}
              />
            </div>
            <div className="slt-form-item" key="标签名称">
              <div className="item-label">标签名称：</div>
              <TreeSelect
                allowClear
                showArrow
                className="item-component"
                showSearch
                treeNodeFilterProp="title"
                dropdownClassName="newproject-treeselect"
                multiple
                treeCheckable
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={sltorData.label}
                placeholder="请选择"
                onChange={(v = [], txt = []) => {
                  let arr = v.map((x, i) => ({ id: x, name: txt[i] }));
                  setMoreData(p => ({ ...p, tag: arr }));
                }}
                value={moreData.tag.map(x => x.id)}
                treeDefaultExpandAll
              />
            </div>
            <div className="slt-form-item" key="项目年份">
              <div className="item-label">项目年份：</div>
              <DatePicker
                mode="year"
                className="item-year-picker"
                value={moreData.startYear}
                open={moreData.startYearOpen}
                placeholder="请选择"
                format="YYYY"
                allowClear={false}
                onChange={v =>
                  setMoreData(p => ({
                    ...p,
                    startYear: (p.endYear?.year() || 0) <= (v?.year() || 0) ? p.endYear : v,
                    startYearOpen: false,
                  }))
                }
                onOpenChange={v => setMoreData(p => ({ ...p, startYearOpen: v }))}
                onPanelChange={v =>
                  setMoreData(p => ({
                    ...p,
                    startYear: (p.endYear?.year() || 0) <= (v?.year() || 0) ? p.endYear : v,
                    startYearOpen: false,
                  }))
                }
              />
              &nbsp;~&nbsp;
              <DatePicker
                mode="year"
                className="item-year-picker"
                value={moreData.endYear}
                open={moreData.endYearOpen}
                placeholder="请选择"
                format="YYYY"
                allowClear={false}
                onChange={v =>
                  setMoreData(p => ({
                    ...p,
                    endYear: (p.startYear?.year() || 0) >= (v?.year() || 0) ? p.startYear : v,
                    endYearOpen: false,
                  }))
                }
                onOpenChange={v => setMoreData(p => ({ ...p, endYearOpen: v }))}
                onPanelChange={v =>
                  setMoreData(p => ({
                    ...p,
                    endYear: (p.startYear?.year() || 0) >= (v?.year() || 0) ? p.startYear : v,
                    endYearOpen: false,
                  }))
                }
              />
            </div>
            <div className="slt-form-item" key="项目状态">
              <div className="item-label">项目状态：</div>
              <Select
                value={moreData.projectStatus}
                className="item-component"
                placeholder="请选择"
                onChange={v => {
                  setMoreData(p => ({
                    ...p,
                    projectStatus: v,
                  }));
                }}
              >
                {XMZT.map(x => (
                  <Select.Option key={x.ibm} title={x.note} value={x.ibm}>
                    {x.note}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="footer-btn">
              <Button
                className="btn-cancel"
                onClick={() => {
                  setMoreData(p => ({
                    ...p,
                    tag: [],
                    org: [],
                    projectName: undefined,
                    //另外维护
                    projectManager: undefined,
                    projectStatus: undefined,
                    startYear: moment(String(defaultYear)),
                    endYear: moment(String(defaultYear)),
                    startYearOpen: false,
                    endYearOpen: false,
                  }));
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                className="btn-submit"
                onClick={() => {
                  //点筛选后 与外边一致
                  setLabelData(p => ({ ...p, sltedItems: moreData.tag }));
                  setOrgData(p => ({ ...p, sltedItems: moreData.org }));
                  setPrjName(moreData.projectName);
                  setMoreData(p => ({ ...p, open: false }));
                  //外边没有的几个字段存起来
                  setMoreData_Filtered({
                    projectManager: moreData.projectManager,
                    projectStatus: moreData.projectStatus,
                    startYear: moreData.startYear,
                    endYear: moreData.endYear,
                  });
                  getPrjDynamicData({
                    ...filterParams,
                    ...moreData,
                  });
                }}
              >
                筛选
              </Button>
            </div>
          </div>
        }
        overlayClassName="prj-dynamic-filter-popover"
      >
        <div
          className="filter-item"
          key="更多筛选"
          onClick={() => {
            setMoreData(p => ({
              ...p,
              //初始值 与外边一致
              tag: labelData.sltedItems,
              org: orgData.sltedItems,
              projectName,
              //外边没有的几个字段
              projectManager: moreData_Filtered.projectManager,
              projectStatus: moreData_Filtered.projectStatus,
              startYear: moreData_Filtered.startYear,
              endYear: moreData_Filtered.endYear,
            }));
          }}
        >
          <img className="filter-icon" src={iconFilter} alt="更多筛选" />
          更多筛选
          <div className="divide-line"></div>
        </div>
      </Popover>
    );
  };

  //画板、列表
  const getTabsBox = () => {
    return (
      <div className="tabs-box">
        <Radio.Group
          value={curTab}
          buttonStyle="solid"
          onChange={e => {
            setCurStage(undefined);
            setCurTab(e.target.value);
          }}
        >
          <Radio.Button value="1" key="1">
            <i className="iconfont icon-workbench" />
            看板
          </Radio.Button>
          <Radio.Button value="2" key="2">
            <i className="iconfont icon-xmlb" />
            列表
          </Radio.Button>
        </Radio.Group>
      </div>
    );
  };

  //展示子块
  const getDynamicCard = ({ title = '-', value = '-', children = [] }, index = '-') => {
    return (
      <div className="info-prj-dynamics-card" key={value}>
        <div className="info-prj-dynamics-title">
          <div className="info-prj-dynamics-title-num">{index < 10 ? '0' + index : index}</div>
          <div className="info-prj-dynamics-title-left">
            <div className="prj-name">{title}</div>
            <div className="info-prj-dynamics-title-right">
              <div className="info-prj-dynamics-title-right-box">
                <div className="info-prj-dynamics-title-right-time">
                  今年：
                  <div className="info-prj-dynamics-title-right-num">
                    {children[0]?.JNZX ?? 0}个
                  </div>
                </div>
                <div style={{ paddingLeft: '8px' }} className="info-prj-dynamics-title-right-time">
                  近一周：
                  <div className="info-prj-dynamics-title-right-num">
                    {children[0]?.BZZX ?? 0}个
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="info-prj-dynamics-content-box">
          {children.length > 0 ? (
            children.map(item => {
              return (
                <Link
                  to={{
                    pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                      JSON.stringify({
                        xmid: item.XMID,
                        routes: routes,
                      }),
                    )}`,
                  }}
                  className="table-link-strong"
                >
                  <div className="info-prj-dynamics-content">
                    <div className="info-prj-dynamics-content-row1">
                      <Tooltip title={item.XMMC} placement="topLeft">
                        {item.XMMC}
                      </Tooltip>
                    </div>
                    <div className="info-prj-dynamics-content-row2">
                      <div className="info-prj-dynamics-content-row2-name">
                        <i className="iconfont icon-user" />
                        {item.XMJL}
                      </div>
                      <div className="info-prj-dynamics-content-row2-time">
                        <i className="iconfont icon-time" />
                        {item.ZXSJ}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <Empty
              description="暂无数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            />
          )}
        </div>
        {children.length > 0 && (
          <div
            className="info-prj-dynamics-footer"
            onClick={() => {
              setCurStage(title);
              setCurTab('2');
            }}
          >
            查看详情
            <i class="iconfont icon-right" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="info-prj-dynamics">
      <Spin spinning={false} wrapperClassName="spin" tip="正在努力的加载中..." size="large">
        <div className="info-prj-dynamics-card-box">
          <div className="filter-row">
            {/* 画板、列表 */}
            {getTabsBox()}
            {/* 部门 */}
            {getOrgBox(curTab)}
            {/* 标签 */}
            {getLabelBox(curTab)}
            {/* 更多筛选 */}
            {curTab === '1' && getMoreBox()}
            {curTab === '1' && (
              <Input
                placeholder="请输入项目名称"
                value={projectName}
                // allowClear
                onChange={e => {
                  setPrjName(e?.target?.value);
                  getPrjDynamicData({
                    ...filterParams,
                    projectName: e?.target?.value,
                  });
                }}
              />
            )}
          </div>
          {curTab === '1' && dataList.map((x, i) => getDynamicCard(x, i + 1))}
          {curTab === '2' && (
            <ProjectQueryTable dictionary={dictionary} curStage={curStage} roleData={roleData} />
          )}
        </div>
      </Spin>
    </div>
  );
});
