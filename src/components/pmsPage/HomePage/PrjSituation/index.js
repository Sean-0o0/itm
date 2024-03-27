import React, { useEffect, useState, useRef, useCallback, Fragment } from 'react';
import {
  Button,
  DatePicker,
  Empty,
  Icon,
  Input,
  message,
  Popconfirm,
  Popover,
  Progress,
  Select,
  Spin,
  Tooltip,
  Tree,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import iconLabel from '../../../../assets/homePage/icon_label.png';
import iconStage from '../../../../assets/homePage/icon_stage.png';
import iconOrg from '../../../../assets/homePage/icon_org.png';
import iconFilter from '../../../../assets/homePage/icon_filter.png';
import iconStaffBlue from '../../../../assets/homePage/icon_staff_blue.png';
import { ProjectCollect, QueryProjectStatusList } from '../../../../services/pmsServices';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { EncryptBase64 } from '../../../Common/Encrypt';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(function PrjSituation(props) {
  const {
    dictionary = {},
    sltorData = { label: [], org: [] },
    roleData = {},
    prjSituationData = {},
    setPrjSituationData,
    itemWidth,
    getAfterItem,
    getPrjSituation,
    currentYear,
  } = props;
  const { XMJZ = [] } = dictionary;
  const XMZT = [
    { ibm: '1', note: '正常' },
    { ibm: '2', note: '逾期' },
    { ibm: '3', note: '完结' },
    { ibm: '4', note: '终止' },
  ];
  const [stageData, setStageData] = useState({
    sltedItems: [],
    open: false,
  }); //阶段
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
    stage: [],
    tag: [],
    org: [],
    projectName: undefined,
    //另外维护
    projectManager: undefined,
    projectStatus: undefined,
    startYear: moment(String(currentYear)),
    endYear: moment(String(currentYear)),
    startYearOpen: false,
    endYearOpen: false,
  }); //更多筛选
  const [moreData_Filtered, setMoreData_Filtered] = useState({
    projectManager: undefined,
    projectStatus: undefined,
    startYear: moment(String(currentYear)),
    endYear: moment(String(currentYear)),
  }); //用于控制数据
  const [projectName, setPrjName] = useState(undefined); //项目名称
  const [isUnfold, setIsUnfold] = useState(false); //是否展开
  const [infoList, setInfoList] = useState([]); //项目信息 - 展示
  let filterParams = {
    role: roleData.role,
    ...moreData,
    stage: stageData.sltedItems,
    tag: labelData.sltedItems,
    org: orgData.sltedItems,
    projectName,
  }; //筛选查询接口入参
  const location = useLocation();

  useEffect(() => {
    setInfoList(prjSituationData.data?.slice(0, getColNum(itemWidth) * 3));
    setIsUnfold(false);
    return () => {};
  }, [JSON.stringify(prjSituationData), itemWidth]);

  useEffect(() => {
    setMoreData(p => ({
      ...p,
      startYear: moment(String(currentYear)),
      endYear: moment(String(currentYear)),
    }));
    return () => {};
  }, [currentYear]);

  //收藏
  const handleProjectCollect = (projectId, operateType) => {
    setPrjSituationData(p => ({ ...p, loading: true }));
    ProjectCollect({ projectId, operateType })
      .then(res => {
        if (res.success) {
          getPrjSituation(filterParams);
        }
      })
      .catch(e => {
        console.error(e);
        message.error('操作失败', 1);
        setPrjSituationData(p => ({ ...p, loading: false }));
      });
  };

  // 阶段
  const getStageBox = () => {
    //选中
    const handleSlt = (sltedItem = {}) => {
      let data = [];
      if (stageData.sltedItems.map(x => x.id).includes(sltedItem.id)) {
        data = stageData.sltedItems.filter(x => x.id !== sltedItem.id);
      } else {
        data = stageData.sltedItems.concat(sltedItem);
      }
      setStageData(p => ({ ...p, sltedItems: data }));
      getPrjSituation({
        ...filterParams,
        stage: data,
      });
    };
    //是否已选中
    const isSlted = stageData.sltedItems.length > 0;
    //清空
    const handleClear = e => {
      e?.stopPropagation();
      setStageData({ sltedItems: [], open: false });
      getPrjSituation({
        ...filterParams,
        stage: [],
      });
    };
    //已选择文本
    const sltedTitle = stageData.sltedItems.map(x => x.name).join('、');
    return (
      <Popover
        title={null}
        placement="bottom"
        trigger="click"
        visible={stageData.open}
        onVisibleChange={v => setStageData(p => ({ ...p, open: v }))}
        autoAdjustOverflow
        content={
          <div className="slt-list">
            {XMJZ.sort((a, b) => Number(a.ibm) - Number(b.ibm)).map(x => (
              <div
                onClick={() => handleSlt({ name: x.note, id: x.ibm })}
                id={x.ibm}
                key={x.ibm}
                className="slt-item"
                style={
                  stageData.sltedItems.map(x => x.id).includes(x.ibm)
                    ? { background: '#fafafb', color: '#3361ff' }
                    : {}
                }
              >
                <img className="slt-item-icon" src={iconStage} alt="阶段" />
                <div className="slt-item-txt">{x.note}</div>
              </div>
            ))}
          </div>
        }
        overlayClassName="prj-situation-filter-popover"
      >
        <div className="filter-item" key="阶段">
          <img className="filter-icon" src={iconStage} alt="阶段" />
          <span>
            {isSlted ? (
              <Tooltip title={sltedTitle} placement="topLeft">
                {sltedTitle}
              </Tooltip>
            ) : (
              '阶段'
            )}
          </span>
          {isSlted && <i className="iconfont icon-close" onClick={handleClear} />}
          <i className="iconfont icon-fill-down" />
          <div className="divide-line"></div>
        </div>
      </Popover>
    );
  };

  //部门
  const getOrgBox = () => {
    //选中
    const handleSlt = (keyArr = [], e = {}) => {
      const data = e.checkedNodes?.map(x => ({ id: x.key, name: x.props?.title })) || [];
      setOrgData(p => ({ ...p, sltedItems: data }));
      getPrjSituation({
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
      getPrjSituation({
        ...filterParams,
        org: [],
      });
    };
    //已选择文本
    const sltedTitle = orgData.sltedItems.map(x => x.name).join('、');
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
            defaultExpandAll
            className="slt-list"
            multiple
            selectable={false}
            checkable
            checkStrictly
            checkedKeys={orgData.sltedItems.map(x => x.id)}
            onCheck={handleSlt}
          >
            {renderTreeNodes(sltorData.org)}
          </Tree>
        }
        overlayClassName="prj-situation-filter-popover"
      >
        <div className="filter-item" key="部门">
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
  const getLabelBox = () => {
    //选中
    const handleSlt = (keyArr = [], e = {}) => {
      const data = e.checkedNodes?.map(x => ({ id: x.key, name: x.props?.title })) || [];
      setLabelData(p => ({ ...p, sltedItems: data }));
      getPrjSituation({
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
      getPrjSituation({
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
            className="slt-list"
            defaultExpandAll
            multiple
            checkable
            selectable={false}
            showCheckedStrategy="SHOW_CHILD"
            checkedKeys={labelData.sltedItems.map(x => x.id)}
            onCheck={handleSlt}
          >
            {renderTreeNodes(sltorData.label)}
          </Tree>
        }
        overlayClassName="prj-situation-filter-popover"
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
        onVisibleChange={v => {
          if (v) setMoreData(p => ({ ...p, open: v, startYearOpen: false, endYearOpen: false }));
          else
            setMoreData(p => ({
              ...p,
              open: v,
              stage: [],
              tag: [],
              org: [],
              projectName: undefined,
              //另外维护
              projectManager: undefined,
              projectStatus: undefined,
              startYear: moment(String(currentYear)),
              endYear: moment(String(currentYear)),
              startYearOpen: false,
              endYearOpen: false,
            }));
        }}
        autoAdjustOverflow
        content={
          <div className="slt-form-box">
            <div className="slt-form-item" key="项目阶段">
              <div className="item-label">项目阶段：</div>
              <Select
                value={moreData.stage.map(x => x.id)}
                className="item-component"
                mode="multiple"
                placeholder="请选择"
                onChange={(v, nodeArr) => {
                  setMoreData(p => ({
                    ...p,
                    stage: nodeArr.map(node => ({
                      name: node?.props?.title,
                      id: node?.props?.value,
                    })),
                  }));
                }}
                showSearch
                optionFilterProp="title"
              >
                {XMJZ.sort((a, b) => Number(a.ibm) - Number(b.ibm)).map(x => (
                  <Select.Option key={x.ibm} title={x.note} value={x.ibm}>
                    {x.note}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="slt-form-item" key="部门名称">
              <div className="item-label">部门名称：</div>
              <TreeSelect
                allowClear
                showArrow
                className="item-component"
                showSearch
                treeNodeFilterProp="title"
                multiple
                treeCheckable
                treeCheckStrictly
                showCheckedStrategy="SHOW_ALL"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={sltorData.org}
                placeholder="请选择"
                onChange={(v = [], txt = []) => {
                  let arr = v.map((x, i) => ({ id: x.value, name: x.label }));
                  setMoreData(p => ({ ...p, org: arr }));
                }}
                value={moreData.org.map(x => ({ value: x.id }))}
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
                    stage: [],
                    tag: [],
                    org: [],
                    projectName: undefined,
                    //另外维护
                    projectManager: undefined,
                    projectStatus: undefined,
                    startYear: moment(String(currentYear)),
                    endYear: moment(String(currentYear)),
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
                  setStageData(p => ({ ...p, sltedItems: moreData.stage }));
                  setPrjName(moreData.projectName);
                  //外边没有的几个字段存起来
                  setMoreData_Filtered({
                    projectManager: moreData.projectManager,
                    projectStatus: moreData.projectStatus,
                    startYear: moreData.startYear,
                    endYear: moreData.endYear,
                  });
                  setMoreData(p => ({ ...p, open: false }));
                  getPrjSituation({
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
        overlayClassName="prj-situation-filter-popover"
      >
        <div
          className="filter-item"
          key="更多筛选"
          onClick={() => {
            setMoreData(p => ({
              ...p,
              //初始值 与外边一致
              stage: stageData.sltedItems,
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

  //获取目前每行几个
  const getColNum = w => {
    switch (w) {
      case '32%':
        return 3;
      case '24%':
        return 4;
      case '19%':
        return 5;
      case '15.6%':
        return 6;
      case '13.2%':
        return 7;
      case '11.5%':
        return 8;
      default:
        return 3;
    }
  };

  //展开、收起
  const handleUnfold = bool => {
    if (bool) {
      setInfoList(prjSituationData.data);
    } else {
      setInfoList(prjSituationData.data?.slice(0, getColNum(itemWidth) * 3));
    }
    setIsUnfold(bool);
  };

  // 格式化时间
  const timeFormatter = (timeStr = moment().format('YYYYMMDDHHmmss')) => {
    // const timeStr = '2019-08-19 16:19:23';
    const Now = moment().format('YYYYMMDDHHmmss'); // 当前时间
    const EOTs = moment(Now).diff(timeStr, 'seconds', true); // 时差--秒
    const EOTm = moment(Now).diff(timeStr, 'minutes', true); // 时差--分钟
    let timeDiff = '--';
    if (timeStr) {
      if (parseInt(Now.slice(0, 4), 10) > parseInt(timeStr.slice(0, 4), 10)) {
        timeDiff = `${moment(timeStr, 'YYYYMMDDHHmmss').format('YYYYMMDD')}`;
      } else if (EOTs < 60) {
        timeDiff = '刚刚';
      } else if (EOTm >= 1 && EOTm < 60) {
        timeDiff = `${Math.round(EOTm)}分钟前`;
      } else if (
        EOTm >= 60 &&
        moment(timeStr, 'YYYYMMDDHHmmss') > moment().startOf('day') &&
        moment(timeStr, 'YYYYMMDDHHmmss') < moment().endOf('day')
      ) {
        timeDiff = `${Math.round(EOTm / 60)}小时前`;
      } else if (
        moment(timeStr, 'YYYYMMDDHHmmss') >
          moment()
            .subtract(1, 'd')
            .startOf('day') &&
        moment(timeStr, 'YYYYMMDDHHmmss') <
          moment()
            .subtract(1, 'd')
            .endOf('day')
      ) {
        timeDiff = `昨天${moment(timeStr, 'YYYYMMDDHHmmss').format('HH:mm')}`;
      } else if (moment(timeStr, 'YYYYMMDDHHmmss').year() === moment().year()) {
        timeDiff = `${moment(timeStr, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}`;
      } else {
        timeDiff = `${moment(timeStr, 'YYYYMMDDHHmmss').format('MM-DD')}`;
      }
    }
    return timeDiff;
  };

  //获取项目标签数据
  const getTagData = (tag, idtxt) => {
    let arr = [];
    let arr2 = [];
    if (
      tag !== '' &&
      tag !== null &&
      tag !== undefined &&
      idtxt !== '' &&
      idtxt !== null &&
      idtxt !== undefined
    ) {
      if (tag.includes(',')) {
        arr = tag.split(',');
        arr2 = idtxt.split(',');
      } else {
        arr.push(tag);
        arr2.push(idtxt);
      }
    }
    let arr3 = arr.map((x, i) => {
      return {
        name: x,
        id: arr2[i],
      };
    });
    return arr3;
  };

  //标签样式颜色
  const getTagClassName = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return 'yellow-tag';
    else if (tagTxt.includes('集合')) return 'purple-tag';
    else if (tagTxt.includes('专班')) return 'red-tag';
    else return '';
  };
  const getTagTxtColor = (tagTxt = '') => {
    if (tagTxt.includes('迭代')) return '#F1A740';
    else if (tagTxt.includes('集合')) return '#757CF7';
    else if (tagTxt.includes('专班')) return '#F0978C';
    else return '#3361ff';
  };

  //项目子块
  const getPrjItem = (item = {}) => {
    //逾期
    const isLate = item.LCBJSSJ !== undefined;
    let lateDays = 0;
    if (isLate) {
      //逾期几天
      lateDays = moment().diff(moment(String(item.LCBJSSJ)), 'days');
    }
    //有风险
    const haveRisk = item.XMFX?.length > 0;
    console.log('🚀 ~ getPrjItem ~ haveRisk:', haveRisk, item);
    //终止
    const isEnd = String(item.WJZT) === '5';
    //完结
    const isComplete = String(item.WJZT) === '1';
    //是否显示红色，逾期或有风险
    const isRed = haveRisk || isLate;

    return (
      <Link
        to={{
          pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
            JSON.stringify({
              xmid: item.XMID,
            }),
          )}`,
          state: {
            routes: [{ name: '个人工作台', pathname: location.pathname }],
          },
        }}
        className="item"
        key={item.XMID}
        style={{
          width: itemWidth,
        }}
      >
        <div className="prj-name">
          <Popconfirm
            title={item.SFSC === 0 ? '确定收藏？' : '确定取消收藏？'}
            onConfirm={e => {
              e.stopPropagation();
              handleProjectCollect(item.XMID, item.SFSC === 0 ? 'SCXM' : 'QXXM');
            }}
            onCancel={e => {
              e.stopPropagation();
            }}
            okText="确认"
            cancelText="取消"
          >
            <i className={item.SFSC === 0 ? 'iconfont icon-star' : 'iconfont icon-fill-star'} />
          </Popconfirm>
          <Tooltip title={item.XMMC} placement="topLeft">
            {item.XMMC ?? '-'}
          </Tooltip>
        </div>
        <div className="prj-tags">
          {getTagData(item.XMBQ, item.XMBQID).length > 0 && (
            <>
              {getTagData(item.XMBQ, item.XMBQID)
                ?.slice(0, 2)
                .map(x => (
                  <div key={x.id} className={'tag-item ' + getTagClassName(x.name)}>
                    <Link
                      style={{ color: getTagTxtColor(x.name) }}
                      to={{
                        pathname: `/pms/manage/labelDetail/${EncryptBase64(
                          JSON.stringify({
                            bqid: x.id,
                          }),
                        )}`,
                        state: {
                          routes: [{ name: '个人工作台', pathname: location.pathname }],
                        },
                      }}
                      // className="table-link-strong"
                    >
                      {x.name}
                    </Link>
                  </div>
                ))}
              {getTagData(item.XMBQ, item.XMBQID)?.length > 2 && (
                <Popover
                  overlayClassName="tag-more-popover"
                  content={
                    <div className="tag-more">
                      {getTagData(item.XMBQ, item.XMBQID)
                        ?.slice(2)
                        .map(x => (
                          <div key={x.id} className={'tag-item ' + getTagClassName(x.name)}>
                            <Link
                              style={{ color: getTagTxtColor(x.name) }}
                              to={{
                                pathname: `/pms/manage/labelDetail/${EncryptBase64(
                                  JSON.stringify({
                                    bqid: x.id,
                                  }),
                                )}`,
                                state: {
                                  routes: [{ name: '个人工作台', pathname: location.pathname }],
                                },
                              }}
                              // className="table-link-strong"
                            >
                              {x.name}
                            </Link>
                          </div>
                        ))}
                    </div>
                  }
                  title={null}
                >
                  <div className="tag-item">{getTagData(item.XMBQ, item.XMBQID)?.length - 2}+</div>
                </Popover>
              )}
            </>
          )}
        </div>
        <div className="progress-row">
          <div className="row-top">
            <span className="week-num">第&nbsp;{item.XMZQ ?? '-'}&nbsp;周</span>
            <img className="prj-user-icon" src={iconStaffBlue} alt="" />
            <span>{item.XMJL ?? '-'}</span>
          </div>
          <div className="row-middle">
            <Progress
              strokeColor={isRed ? '#d70e19' : '#3361FF'}
              percent={Number(item.BZJD ?? 0)}
              successPercent={Number(item.SZJD ?? 0)}
              size="small"
              status="active"
              showInfo={false}
              strokeWidth={8}
              className={isRed ? 'progress-red' : ''}
            />
          </div>
          <div className="row-bottom">
            <span className="prj-percent">
              <div className="last-week-percent" style={isRed ? { color: '#ffacb0' } : {}}>
                {item.SZJD ?? '-'}%
              </div>
              {Number(item.BZJD ?? 0) !== 0 && (
                <Fragment>
                  <i className="iconfont icon-rise" />
                  <div className="cur-week-percent" style={isRed ? { color: '#d70e19' } : {}}>
                    {item.BZJD ?? '-'}%
                  </div>
                </Fragment>
              )}
            </span>
            <span className="update-time">
              更新于：{item.GXSJ === undefined ? '-' : timeFormatter(String(item.GXSJ))}
            </span>
          </div>
        </div>
        <div className="status-row" style={isRed ? { backgroundColor: 'rgba(215,14,25,0.1)' } : {}}>
          {/* 逾期时必显示 */}
          {isLate && <div className="status-item-red">逾期{lateDays}天</div>}
          {/* 无风险时显示逾期事项 */}
          {isLate && !haveRisk && (
            <div className="status-txt">
              逾期：
              <Tooltip title={item.SXMC} placement="topLeft">
                {item.SXMC ?? '-'}
              </Tooltip>
            </div>
          )}
          {/* 有风险且逾期，显示一个风险 */}
          {haveRisk && isLate && (
            <Fragment>
              <div className="status-item-red" key={item.XMFX[0].FXID}>
                <Tooltip title={item.XMFX[0].FXBT} placement="topLeft">
                  {item.XMFX[0].FXBT ?? '-'}
                </Tooltip>
              </div>
            </Fragment>
          )}
          {/* 有风险且未逾期，最多显示两个， 只有一个时显示风险内容 */}
          {haveRisk &&
            !isLate &&
            item.XMFX?.slice(0, 2)?.map(fx => (
              <Fragment>
                <div className="status-item-red" key={fx.FXID}>
                  <Tooltip title={fx.FXBT} placement="topLeft">
                    {fx.FXBT ?? '-'}
                  </Tooltip>
                </div>
                {item.XMFX.length === 1 && (
                  <div className="status-txt">
                    <Tooltip title={fx.FXNR} placement="topLeft">
                      {fx.FXNR ?? '-'}
                    </Tooltip>
                  </div>
                )}
              </Fragment>
            ))}
          {/* 未逾期且无风险时 */}
          {!haveRisk && !isLate && (
            <Fragment>
              <div className={isEnd ? 'status-item-red' : 'status-item'}>
                {isEnd ? '终止' : isComplete ? '完结' : '正常'}
              </div>
              <div className="status-txt">
                当前进展：
                <Tooltip
                  title={XMJZ.find(x => String(x.ibm) === String(item.XMJZ))?.note}
                  placement="topLeft"
                >
                  {XMJZ.find(x => String(x.ibm) === String(item.XMJZ))?.note ?? '-'}
                </Tooltip>
              </div>
            </Fragment>
          )}
        </div>
      </Link>
    );
  };

  // if (!prjSituationData.total) return null;
  return (
    <div
      className="prj-situation-box"
      style={prjSituationData.total > getColNum(itemWidth) * 3 ? {} : { paddingBottom: 24 }}
    >
      <div className="home-card-title-box">
        项目情况
        <span>
          <Link
            to={{
              pathname: `/pms/manage/ProjectInfo`,
              state: {
                routes: [{ name: '个人工作台', pathname: location.pathname }],
              },
            }}
          >
            全部
            <i className="iconfont icon-right" />
          </Link>
        </span>
      </div>
      <div className="filter-row">
        {/* 阶段 */}
        {getStageBox()}
        {/* 部门 */}
        {getOrgBox()}
        {/* 标签 */}
        {getLabelBox()}
        {/* 更多筛选 */}
        {getMoreBox()}
        <Input
          placeholder="请输入项目名称"
          value={projectName}
          // allowClear
          onChange={e => {
            setPrjName(e?.target?.value);
            getPrjSituation({
              ...filterParams,
              projectName: e?.target?.value,
            });
          }}
        />
      </div>
      <Spin spinning={prjSituationData.loading} tip="加载中">
        <div className="content-box">
          {infoList.map(item => getPrjItem(item))}
          {getAfterItem(itemWidth)}
          {!prjSituationData.total && (
            <div style={{ width: '100%', margin: '122px auto' }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          )}
        </div>
        {prjSituationData.total > getColNum(itemWidth) * 3 &&
          (isUnfold ? (
            <div className="more-item" onClick={() => handleUnfold(false)}>
              收起
              <i className="iconfont icon-up" />
            </div>
          ) : (
            <div className="more-item" onClick={() => handleUnfold(true)}>
              更多
              {prjSituationData.loading ? (
                <Icon type="loading" />
              ) : (
                <i className="iconfont icon-down" />
              )}
            </div>
          ))}
      </Spin>
    </div>
  );
});
